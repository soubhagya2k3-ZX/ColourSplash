/**
 * CHANGES (SPA → MPA conversion):
 *   - NEW FILE: per-page entry point for the Admin panel
 *   - Calls createRoot().render() directly (no React Router / BrowserRouter)
 *   - Wraps AdminPanel component in PageShell layout
 *
 * UNCHANGED (carried over from old main.tsx):
 *   - StrictMode wrapper
 *   - ErrorBoundary wrapper
 *   - AdminPanel component imported and rendered identically
 */
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import ErrorBoundary from "../components/ErrorBoundary";
import PageShell from "../components/PageShell";
import AdminPanel from "../pages/AdminPanel";
import "../index.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ErrorBoundary>
      <PageShell currentPage="admin">
        <AdminPanel />
      </PageShell>
    </ErrorBoundary>
  </StrictMode>,
);
