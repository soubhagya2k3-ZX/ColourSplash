# Contact form email setup

The "Send us a message" form on the Contact page POSTs to `/api/contact`
on the Express server (`server.ts`). The server formats a branded HTML email
and sends it via SMTP to `CONTACT_EMAIL_TO`.

By default `CONTACT_EMAIL_TO` is `coloursplash.studio.01@gmail.com` — change it in `.env`
if you want a different inbox.

## Quick setup with Gmail (recommended)

Gmail blocks regular passwords for SMTP; you must use an **App Password**.

1. **Enable 2-Step Verification** on your Google account
   → https://myaccount.google.com/security
2. **Create an App Password**
   → https://myaccount.google.com/apppasswords
   - App: *Mail*
   - Device: *Other → ColourSplash*
   - Google shows a 16-character password like `abcd efgh ijkl mnop`
3. **Edit `.env`** in this project root:
   ```
   SMTP_USER="coloursplash.studio.01@gmail.com"
   SMTP_PASS="abcdefghijklmnop"          # remove spaces
   CONTACT_EMAIL_TO="coloursplash.studio.01@gmail.com"
   ```
4. **Restart the dev server**: `npm run dev`
5. **Test it** at http://localhost:3000/contact — fill the form and submit.
   On success the server logs:
   ```
   [mail] SMTP transporter verified (smtp.gmail.com)
   [mail] Delivered enquiry from <Name> → coloursplash.studio.01@gmail.com
   ```

## What the recipient receives

A branded HTML email with:
- Visitor's name, phone, optional email, service, and message
- Click-to-call / click-to-mail links
- IST timestamp
- **Reply-to header set to the visitor's email** (or name if no email),
  so hitting *Reply* in your inbox writes back to the visitor directly.

## Other SMTP providers

The server works with any SMTP host. Set the four variables in `.env`:
```
SMTP_HOST="smtp.your-provider.com"
SMTP_PORT="465"        # 465 (SSL) or 587 (STARTTLS)
SMTP_SECURE="true"     # true for 465, false for 587
SMTP_USER="…"
SMTP_PASS="…"
```

Verified working hosts:
| Provider     | Host                   | Port | Secure |
|--------------|------------------------|------|--------|
| Gmail        | smtp.gmail.com         | 587  | false  |
| Outlook 365  | smtp.office365.com     | 587  | false  |
| SendGrid     | smtp.sendgrid.net      | 587  | false  |
| Mailgun      | smtp.mailgun.org       | 587  | false  |
| Zoho         | smtp.zoho.com          | 465  | true   |

## Health check

Visit http://localhost:3000/api/health — it reports whether email is wired:
```json
{ "status": "ok", "mail": "configured" }
```
or
```json
{ "status": "ok", "mail": "not configured (set SMTP_USER + SMTP_PASS in .env)" }
```

## Production deployment notes

- **Cloud Run / Firebase Hosting + Cloud Functions**: set the same env vars in
  the service's environment (or Secret Manager). `dotenv` reads them
  identically because the server uses `process.env.*`.
- **Static-only Firebase Hosting**: `server.ts` will not run. Either deploy
  the Express server to Cloud Run *or* convert the contact handler into a
  Cloud Function and update `VITE_API_BASE_URL` accordingly.

## Rate limiting and spam

The endpoint enforces 5 submissions per IP per hour out of the box.
Tune `RATE_LIMIT` and `RATE_WINDOW_MS` at the top of `server.ts` if needed.
