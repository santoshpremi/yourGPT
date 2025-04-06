export { ErrorDisplay as Catch } from "../components/util/ErrorDisplay";
import { useParams } from "../router";
import { AxiosError } from "axios";

import React, { useEffect } from "react";
import { Outlet } from "react-router";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { SWRConfig } from "swr";
import { UnsupportedBrowserDetector } from "../components/util/UnsupportedBrowserDetector";
import { TrpcProvider } from "../lib/api/trpc/TrpcProvider";
import { useMe } from "../lib/api/user";
import { useAuthStore } from "../lib/context/authStore";
import { handleGenericError } from "../lib/errorHandling";
import { useTranslation } from "../lib/i18n";

export default function RootLayout() {
  const { t } = useTranslation();

  return (
    <TrpcProvider>
      <ToastContainer hideProgressBar={true} limit={5} />
      <UnsupportedBrowserDetector />
      <SWRConfig
        value={{
          onError: (err) => {
            console.error("swr error", err);
            // is already handled by axios
            if (!(err instanceof AxiosError)) {
              handleGenericError(
                err,
                t("unexpectedNetworkError"),
                {
                  source: "swr",
                },
                true
              );
            }
          },
        }}
      >
        <RootContent />
      </SWRConfig>
    </TrpcProvider>
  );
}

function CheckLoggedIn() {
  const loggedIn = useAuthStore((s) => s.loggedIn);
  const setLoggedIn = useAuthStore((s) => s.setLoggedIn);

  const me = useMe();

  useEffect(() => {
    if (me && !loggedIn) {
      setLoggedIn(true);
    }
  }, [me, loggedIn, setLoggedIn]);

  return null;
}

// In _app.tsx
function RootContent() {
  const params = useParams("/:organizationId");
  
  // Add temporary org ID validation
  useEffect(() => {
    if (!params.organizationId) {
      console.warn("No organization ID in route, using default");
    }
  }, [params.organizationId]);

  return (
    <>
      <CheckLoggedIn />
      <Outlet />
    </>
  );
}
