import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  httpBatchLink,
  httpLink,
  isNonJsonSerializable,
  splitLink,
  TRPCClientError,
  unstable_httpBatchStreamLink,
  type HTTPHeaders,
} from "@trpc/client";
import { createId } from "@paralleldrive/cuid2";
import { useMemo, useState } from "react";
import { useParams } from "../../../router";
import { useTranslation } from "../../i18n";
import { fetchWithAppVersion } from "./fetchWithAppVersion";
import { phaseLink } from "./phaseLink";
import { toastLink } from "./toastLink";
import { trpc } from "./trpc";

const trpcUrl = "/api/trpc";
const MAX_RETRIES = 3;

export const browserSessionKey = fetchSessionId();

function fetchSessionId() {
  const sessionId = sessionStorage.getItem("sessionId");
  if (sessionId) return sessionId;

  const id = createId();
  sessionStorage.setItem("sessionId", id);
  return id;
}

export function TrpcProvider({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            retry(failureCount, error) {
              if (
                !(error instanceof TRPCClientError) ||
                !error.data?.code ||
                [
                  "TIMEOUT",
                  "BAD_GATEWAY",
                  "SERVICE_UNAVAILABLE",
                  "GATEWAY_TIMEOUT",
                ].includes(error.data.code)
              ) {
                return failureCount < MAX_RETRIES;
              }
              return false;
            },
          },
        },
      }),
  );

  const { organizationId: currentOrganizationId } =
    useParams("/:organizationId");
  const {
    i18n: { resolvedLanguage: currentLocale },
  } = useTranslation();

  const safeOrganizationId = currentOrganizationId || "default-org";

  const trpcClient = useMemo(() => {
    const headers = {
      "x-deingpt-organization-id": safeOrganizationId,
      "x-deingpt-session-id": browserSessionKey,
      "x-deingpt-locale": currentLocale,
    };

    const commonConfig = {
      url: trpcUrl,
      headers: (): HTTPHeaders => headers,
      fetch: fetchWithAppVersion,
    };

    return trpc.createClient({
      links: [
        phaseLink,
        toastLink,
        splitLink({
          condition: (op) =>
            isNonJsonSerializable(op.input) || !!op.context.nonSerializable,
          true: httpLink(commonConfig),
          false: splitLink({
            condition: (op) => !op.context.disableStreaming,
            true: unstable_httpBatchStreamLink({
              ...commonConfig,
              maxURLLength: 8000,
            }),
            false: httpBatchLink({
              ...commonConfig,
              maxURLLength: 8000,
            }),
          }),
        }),
      ],
    });
  }, [safeOrganizationId, currentLocale]);

  return (
    <trpc.Provider client={trpcClient} queryClient={queryClient}>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </trpc.Provider>
  );
}
