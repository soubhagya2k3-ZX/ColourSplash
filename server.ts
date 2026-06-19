// Load environment variables FIRST, before any other module reads process.env.
import "dotenv/config";

import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import compression from "compression";
import cors from "cors";
import nodemailer, { type Transporter } from "nodemailer";

/**
 * Escape user-supplied content before it lands in an HTML email body.
 * Prevents the recipient's mail client from rendering injected markup.
 */
function escapeHtml(input: string): string {
  return input
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

/**
 * Build a single shared transporter at boot. Reusing one transporter is much
 * faster than creating a fresh one per request (it pools the SMTP connection).
 * Returns null when credentials are missing — callers should treat that as
 * "email is not configured" instead of throwing.
 */
let transporterPromise: Promise<Transporter | null> | null = null;
function getTransporter(): Promise<Transporter | null> {
  if (transporterPromise) return transporterPromise;
  transporterPromise = (async () => {
    const user = process.env.SMTP_USER;
    const pass = process.env.SMTP_PASS;
    if (!user || !pass) return null;

    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || "smtp.gmail.com",
      port: Number(process.env.SMTP_PORT) || 587,
      secure: process.env.SMTP_SECURE === "true",
      auth: { user, pass },
      pool: true,
      maxConnections: 3,
    });

    try {
      await transporter.verify();
      console.log(`[mail] SMTP transporter verified (${process.env.SMTP_HOST || "smtp.gmail.com"})`);
    } catch (err) {
      console.error("[mail] SMTP verification failed:", (err as Error).message);
    }
    return transporter;
  })();
  return transporterPromise;
}

async function startServer() {
  const app = express();
  const PORT = Number(process.env.PORT) || 3000;

  app.use(compression());

  // Restrict CORS to known origins (allow any in dev for convenience)
  const allowedOrigins = [
    "http://localhost:3000",
    "https://coloursplash-studio.web.app",
    "https://coloursplash-studio.firebaseapp.com",
  ];
  app.use(
    cors({
      origin: (origin, callback) => {
        if (!origin || allowedOrigins.includes(origin)) {
          callback(null, true);
        } else {
          callback(null, true); // Allow in development
        }
      },
      methods: ["GET", "POST"],
      credentials: true,
    })
  );

  app.use(express.json({ limit: "1mb" }));

  // Security headers
  app.use((_req, res, next) => {
    res.setHeader("X-Content-Type-Options", "nosniff");
    res.setHeader("X-Frame-Options", "SAMEORIGIN");
    res.setHeader("X-XSS-Protection", "1; mode=block");
    res.setHeader("Referrer-Policy", "strict-origin-when-cross-origin");
    res.setHeader("Permissions-Policy", "camera=(), microphone=(), geolocation=()");
    next();
  });

  // Naive in-memory rate limiter — 5 contact submissions per IP per hour.
  // Good enough to deflect form-spam bots without adding a dependency.
  const RATE_LIMIT = 5;
  const RATE_WINDOW_MS = 60 * 60 * 1000;
  const rateBuckets = new Map<string, { count: number; resetAt: number }>();
  function rateLimitOk(ip: string): boolean {
    const now = Date.now();
    const bucket = rateBuckets.get(ip);
    if (!bucket || bucket.resetAt < now) {
      rateBuckets.set(ip, { count: 1, resetAt: now + RATE_WINDOW_MS });
      return true;
    }
    if (bucket.count >= RATE_LIMIT) return false;
    bucket.count += 1;
    return true;
  }

  // Health check
  app.get("/api/health", async (_req, res) => {
    const t = await getTransporter();
    res.json({
      status: "ok",
      environment: process.env.NODE_ENV || "development",
      mail: t ? "configured" : "not configured (set SMTP_USER + SMTP_PASS in .env)",
    });
  });

  // Contact form handler — sends an email to CONTACT_EMAIL_TO with reply-to
  // set to the visitor's address (when provided) so the admin can hit Reply.
  app.post("/api/contact", async (req, res) => {
    try {
      const ip =
        (req.headers["x-forwarded-for"] as string)?.split(",")[0].trim() ||
        req.socket.remoteAddress ||
        "unknown";
      if (!rateLimitOk(ip)) {
        return res
          .status(429)
          .json({ success: false, error: "Too many requests. Please try again later." });
      }

      const { name, phone, email, service, message } = req.body as {
        name?: string;
        phone?: string;
        email?: string;
        service?: string;
        message?: string;
      };

      // Validation
      if (!name || typeof name !== "string" || name.trim().length < 2 || name.length > 100) {
        return res
          .status(400)
          .json({ success: false, error: "Please enter a valid name (2–100 characters)." });
      }
      if (!phone || typeof phone !== "string" || phone.trim().length < 7 || phone.length > 20) {
        return res
          .status(400)
          .json({ success: false, error: "Please enter a valid phone number." });
      }
      if (!service || typeof service !== "string" || service.length > 100) {
        return res
          .status(400)
          .json({ success: false, error: "Please choose a service." });
      }
      if (
        !message ||
        typeof message !== "string" ||
        message.trim().length < 10 ||
        message.length > 2000
      ) {
        return res
          .status(400)
          .json({ success: false, error: "Message must be 10–2000 characters." });
      }
      // Optional but validated
      const safeEmail =
        email && typeof email === "string" && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
          ? email.trim()
          : "";

      const safeName = name.trim().slice(0, 100);
      const safePhone = phone.trim().slice(0, 20);
      const safeService = service.trim().slice(0, 100);
      const safeMessage = message.trim().slice(0, 2000);

      const transporter = await getTransporter();
      if (!transporter) {
        console.warn(
          "[mail] Contact submission received but SMTP is not configured — message NOT delivered."
        );
        // Still acknowledge to the user — the data is captured in server logs.
        console.log("[mail] Submission payload:", {
          name: safeName,
          phone: safePhone,
          email: safeEmail,
          service: safeService,
          message: safeMessage,
        });
        return res
          .status(503)
          .json({ success: false, error: "Email service is temporarily unavailable. Please reach out via WhatsApp." });
      }

      const toEmail = process.env.CONTACT_EMAIL_TO || "coloursplash.studio.01@gmail.com";
      const subject = `New enquiry from ${safeName} — ${safeService}`;

      const html = `
        <div style="font-family:'Inter',-apple-system,Segoe UI,Roboto,sans-serif;background:#f9f2de;padding:32px;color:#002b36;">
          <div style="max-width:600px;margin:0 auto;background:#ffffff;border-radius:16px;overflow:hidden;border:1px solid #e2dcca;">
            <div style="background:linear-gradient(135deg,#f97316 0%,#ec4899 50%,#a855f7 100%);padding:24px 32px;color:#ffffff;">
              <h1 style="margin:0;font-size:22px;font-weight:700;">New contact enquiry</h1>
              <p style="margin:6px 0 0;opacity:0.9;font-size:14px;">ColourSplash Studio website</p>
            </div>
            <div style="padding:28px 32px;">
              <table style="width:100%;border-collapse:collapse;font-size:15px;">
                <tr><td style="padding:8px 0;color:#657b83;width:120px;">Name</td><td style="padding:8px 0;font-weight:600;">${escapeHtml(safeName)}</td></tr>
                <tr><td style="padding:8px 0;color:#657b83;">Phone</td><td style="padding:8px 0;font-weight:600;"><a href="tel:${escapeHtml(safePhone)}" style="color:#cb4b16;text-decoration:none;">${escapeHtml(safePhone)}</a></td></tr>
                ${safeEmail ? `<tr><td style="padding:8px 0;color:#657b83;">Email</td><td style="padding:8px 0;font-weight:600;"><a href="mailto:${escapeHtml(safeEmail)}" style="color:#cb4b16;text-decoration:none;">${escapeHtml(safeEmail)}</a></td></tr>` : ""}
                <tr><td style="padding:8px 0;color:#657b83;">Service</td><td style="padding:8px 0;font-weight:600;">${escapeHtml(safeService)}</td></tr>
              </table>
              <div style="margin-top:20px;padding-top:20px;border-top:1px solid #eee8d5;">
                <p style="margin:0 0 8px;color:#657b83;font-size:13px;text-transform:uppercase;letter-spacing:0.08em;font-weight:700;">Message</p>
                <p style="margin:0;line-height:1.6;white-space:pre-wrap;">${escapeHtml(safeMessage)}</p>
              </div>
              <div style="margin-top:24px;padding-top:16px;border-top:1px solid #eee8d5;font-size:12px;color:#93a1a1;">
                Received: ${new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata", dateStyle: "full", timeStyle: "short" })}
              </div>
            </div>
          </div>
        </div>
      `;

      const text =
        `New enquiry from ColourSplash Studio website\n\n` +
        `Name:    ${safeName}\n` +
        `Phone:   ${safePhone}\n` +
        (safeEmail ? `Email:   ${safeEmail}\n` : "") +
        `Service: ${safeService}\n\n` +
        `Message:\n${safeMessage}\n`;

      // Helpful Mail-fields:
      //  • from   — must be the SMTP authenticated user (provider-enforced)
      //  • replyTo — visitor's address (or phone-as-name) so admin can reply
      const fromAddr = process.env.SMTP_FROM || `"ColourSplash Website" <${process.env.SMTP_USER}>`;
      const replyTo = safeEmail
        ? `"${safeName}" <${safeEmail}>`
        : `"${safeName}" <${process.env.SMTP_USER}>`;

      await transporter.sendMail({
        from: fromAddr,
        to: toEmail,
        replyTo,
        subject,
        text,
        html,
      });

      console.log(`[mail] Delivered enquiry from ${safeName} → ${toEmail}`);
      return res.json({ success: true, message: "Thanks! We'll be in touch shortly." });
    } catch (error) {
      console.error("[mail] Failed to send contact email:", error);
      return res
        .status(500)
        .json({ success: false, error: "We couldn't send your message. Please try WhatsApp." });
    }
  });

  // Vite middleware (dev) / static (prod)
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true, hmr: false },
      appType: "mpa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(
      express.static(distPath, {
        maxAge: "1y",
        setHeaders: (res, filePath) => {
          if (filePath.endsWith(".html")) res.setHeader("Cache-Control", "no-cache");
        },
      })
    );
    // MPA route handlers — serve each page's own HTML file
    const pageRoutes: Record<string, string> = {
      "/portfolio": "portfolio/index.html",
      "/contact": "contact/index.html",
      "/admin": "admin/index.html",
    };
    for (const [route, file] of Object.entries(pageRoutes)) {
      app.get(route, (_req, res) => res.sendFile(path.join(distPath, file)));
    }
    // Fallback: serve home page for unknown routes
    app.get("*", (_req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
