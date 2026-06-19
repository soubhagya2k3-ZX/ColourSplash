/**
 * CHANGES (SPA → MPA conversion):
 *   - NEW FILE: per-page entry point for the Portfolio page
 *   - Calls createRoot().render() directly (no React Router / BrowserRouter)
 *   - Wraps PortfolioPage component in PageShell layout
 *
 * UNCHANGED (carried over from old main.tsx):
 *   - StrictMode wrapper
 *   - ErrorBoundary wrapper
 *   - PortfolioPage component imported and rendered identically
 */
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import ErrorBoundary from "../components/ErrorBoundary";
import PageShell from "../components/PageShell";
import PortfolioPage from "../pages/PortfolioPage";
import "../index.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ErrorBoundary>
      <PageShell currentPage="portfolio">
        <PortfolioPage />
      </PageShell>
    </ErrorBoundary>
  </StrictMode>,
);
