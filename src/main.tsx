import { Routes } from "@generouted/react-router/lazy";
import "./index.css";
import * as Sentry from "@sentry/react";
import { Replay } from "@sentry/replay";
import axios from "axios";
import React, { useEffect } from "react";
import ReactDOM from "react-dom/client";
import {
  createRoutesFromChildren,
  matchRoutes,
  useLocation,
  useNavigationType,
} from "react-router";
import { loadI18n } from "./lib/i18n";
import { redirect } from '../src/router';

// Test Error Component (Dev only)
const SentryTestButton = () => (
  <button
    onClick={() => {
      throw new Error("Sentry Test Error: Check Dashboard");
    }}
    style={{
      position: 'fixed',
      bottom: '20px',
      right: '20px',
      zIndex: 9999,
      padding: '10px 20px',
      backgroundColor: '#e74c3c',
      color: 'white',
      border: 'none',
      borderRadius: '4px',
      cursor: 'pointer',
    }}
  >
    Test Sentry Error
  </button>
);

axios.get("http://localhost:8003/api/tunnel/sentry/config")
  .then((res) => {
    const dsn = res.data.dsn;
    const environment = res.data.serverName;

    if (!import.meta.env.DEV) {
      Sentry.init({
        dsn: dsn,
        environment: environment,
        integrations: [
          Sentry.reactRouterV7BrowserTracingIntegration({
            useEffect,
            useLocation,
            useNavigationType,
            createRoutesFromChildren,
            matchRoutes,
          }),
          new Replay()
        ],
        tracesSampleRate: 0.1,
        replaysSessionSampleRate: 0.1,
        replaysOnErrorSampleRate: 1.0
      });
    }
  })
  .catch((err) => {
    console.error("Sentry config failed - falling back to defaults", err);
    // Fallback initialization if needed
  })
  .finally(() => {
    loadI18n()
      .catch((error) => {
        console.error("i18n initialization failed:", error);
        Sentry.captureException(error);
      })
      .finally(() => {
        initReact();
      });
  });

if (import.meta.env.DEV && !location.pathname.includes('/default-org')) {
  redirect('/:organizationId', { params: { organizationId: 'default-org' } });
}

function initReact() {
  ReactDOM.createRoot(document.getElementById("root")!).render(
    <React.StrictMode>
      {import.meta.env.DEV && <SentryTestButton />}
      <Routes />
    </React.StrictMode>
  );
}