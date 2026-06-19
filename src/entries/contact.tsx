/**
 * CHANGES (SPA → MPA conversion):
 *   - NEW FILE: per-page entry point for the Contact page
 *   - Calls createRoot().render() directly (no React Router / BrowserRouter)
 *   - Wraps ContactPage component in PageShell layout
 *
 * UNCHANGED (carried over from old main.tsx):
 *   - StrictMode wrapper
 *   - ErrorBoundary wrapper
 *   - ContactPage component imported and rendered identically
 */
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import ErrorBoundary from "../components/ErrorBoundary";
import PageShell from "../components/PageShell";
import ContactPage from "../pages/ContactPage";
import "../index.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ErrorBoundary>
      <PageShell currentPage="contact">
        <ContactPage />
      </PageShell>
    </ErrorBoundary>
  </StrictMode>,
);
