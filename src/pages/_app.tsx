export { ErrorDisplay as Catch } from "../components/util/ErrorDisplay";
import { useParams } from "../router";
import { AxiosError } from "axios";
import React, { useEffect } from "react";
import { Outlet, useNavigate } from "react-router";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { SWRConfig } from "swr";
import { UnsupportedBrowserDetector } from "../components/util/UnsupportedBrowserDetector";
import { TrpcProvider } from "../lib/api/trpc/TrpcProvider";
import { useMe } from "../lib/api/user";
import { useAuthStore } from "../lib/context/authStore";
import { handleGenericError } from "../lib/errorHandling";
import { useTranslation } from "../lib/i18n";
import { createContext } from "react";

// Enhanced organization context with type safety
type OrganizationContextType = {
  id: string;
  name: string;
  defaultModel: string;
};

export const OrganizationContext = createContext<OrganizationContextType>({
  id: "default_org",
  name: "Default Organization",
  defaultModel: "gpt-4",
});

export default function RootLayout() {
  const { t } = useTranslation();

  return (
    <TrpcProvider>
      <ToastContainer hideProgressBar={true} limit={5} />
      <UnsupportedBrowserDetector />
{/*       <SWRConfig
        value={{
          onError: (err) => {
            console.error("swr error", err);
            if (!(err instanceof AxiosError)) {
              handleGenericError(
                err,
                t("unexpectedNetworkError"),
                { source: "swr" },
                true
              );
            }
          },
        }}
      > */}
        <RootContent />
      {/* </SWRConfig> */}
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

function RootContent() {
  const params = useParams("/:organizationId");
  const navigate = useNavigate();
  const DEFAULT_ORG_ID = "default_org";

  // Handle missing organization ID with redirect
  useEffect(() => {
    if (!params.organizationId) {
      navigate(`/${DEFAULT_ORG_ID}`, { replace: true });
    }
  }, [params.organizationId, navigate]);

  return params.organizationId ? (
    <OrganizationContext.Provider
      value={{
        id: params.organizationId,
        name: `Organization ${params.organizationId}`,
        defaultModel: "gpt-4",
      }}
    >
      <CheckLoggedIn />
      <Outlet />
    </OrganizationContext.Provider>
  ) : null;
}