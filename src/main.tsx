import { Routes } from "@generouted/react-router/lazy";
import "./index.css";
import axios from "axios";
import React from "react";
import ReactDOM from "react-dom/client";
import { loadI18n } from "./lib/i18n";

// Remove all Sentry-related code and simplify initialization
async function initializeApp() {
  try {
    await loadI18n();
  } catch (err) {
    console.error("Failed to initialize app:", err);
  } finally {
    initReact();
  }
}

function initReact() {
  ReactDOM.createRoot(document.getElementById("root")!).render(<Routes />);
}

// Start the app
initializeApp();