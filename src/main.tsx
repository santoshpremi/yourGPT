import { Routes } from "@generouted/react-router/lazy";
import "./index.css";
import * as Sentry from "@sentry/react";
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


axios
  .get("../api/tunnel/sentry/config")
  .then((res) => {
    const dsn = res.data.dsn;
    const environment = res.data.serverName;

    if (!import.meta.env.DEV) {
      Sentry.init({
        dsn,
        tunnel: "../api/tunnel/sentry/config",
        environment,
        integrations: [
          Sentry.reactRouterV7BrowserTracingIntegration({
            useEffect,
            useLocation,
            useNavigationType,
            createRoutesFromChildren,
            matchRoutes,
          }),
        ],
        tracesSampleRate: 0.1,
      });

      Sentry.onLoad(() => {
        console.log("Sentry loaded", dsn);
      });
    } else {
      console.log(
        "Sentry not initialized because vite is running in development mode"
      );
    }
  })
  .catch((err) => {
    console.error("Could not load sentry dsn", err);
  })
  .finally(async () => {
    loadI18n()
      .catch(() => {
        console.error("Could not load i18n");
      })
      .finally(() => {
        initReact();
      });
  });
if (import.meta.env.DEV && !location.pathname.includes('/default-org')) {
  redirect('/:organizationId', { params: { organizationId: 'default-org' } });
}

function initReact() {
  ReactDOM.createRoot(document.getElementById("root")!).render(<Routes />);
}
