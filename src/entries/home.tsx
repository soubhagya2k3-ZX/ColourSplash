/**
 * CHANGES (SPA → MPA conversion):
 *   - NEW FILE: per-page entry point for the Home page
 *   - Calls createRoot().render() directly (no React Router / BrowserRouter)
 *   - Wraps Home component in PageShell layout
 *
 * UNCHANGED (carried over from old main.tsx):
 *   - StrictMode wrapper
 *   - ErrorBoundary wrapper
 *   - Home page component imported and rendered identically
 */
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import ErrorBoundary from "../components/ErrorBoundary";
import PageShell from "../components/PageShell";
import Home from "../pages/Home";
import "../index.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ErrorBoundary>
      <PageShell currentPage="home">
        <Home />
      </PageShell>
    </ErrorBoundary>
  </StrictMode>,
);
