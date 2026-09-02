import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import ErrorBoundary from "./components/ErrorBoundary.jsx";
import "./index.css";

// Suppress unhandled promise rejections and errors injected by third-party browser extensions (e.g., MetaMask, EVM wallets, browser toolbars)
if (typeof window !== "undefined") {
  const isExtensionError = (errorOrMsg, filename) => {
    const text = typeof errorOrMsg === "string" 
      ? errorOrMsg 
      : (errorOrMsg?.message || errorOrMsg?.stack || errorOrMsg?.reason || "");
    const file = filename || "";
    return (
      text.toLowerCase().includes("metamask") ||
      text.toLowerCase().includes("ethereum") ||
      text.toLowerCase().includes("failed to connect to metamask") ||
      text.toLowerCase().includes("evm") ||
      text.toLowerCase().includes("walletconnect") ||
      file.includes("chrome-extension://") ||
      file.includes("moz-extension://") ||
      file.includes("safari-extension://")
    );
  };

  window.addEventListener("unhandledrejection", (event) => {
    if (isExtensionError(event?.reason)) {
      event.preventDefault();
      event.stopImmediatePropagation?.();
    }
  });

  window.addEventListener("error", (event) => {
    if (isExtensionError(event?.error || event?.message, event?.filename)) {
      event.preventDefault();
      event.stopImmediatePropagation?.();
    }
  });
}

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </StrictMode>
);

