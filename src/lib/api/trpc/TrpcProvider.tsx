//src/lib/api/trpc/TrpcProvider.tsx
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  httpBatchLink,
  httpLink,
  isNonJsonSerializable,
  splitLink,
  TRPCClientError,
  unstable_httpBatchStreamLink,
} from "@trpc/client";
import { createId } from "@paralleldrive/cuid2";
import { useMemo, useState } from "react";
import { useParams } from "../../../router";
import { useTranslation } from "../../i18n";
import { fetchWithAppVersion } from "./fetchWithAppVersion";
import { phaseLink } from "./phaseLink";
import { toastLink } from "./toastLink";
import { trpc } from "./trpc";

const trpcUrl = "/trpc";

const MAX_RETRIES = 3;

export const browserSessionKey = fetchSessionId(); // unique key for the browser session

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
      })
  );

const currentOrganizationId = useParams("/:organizationId").organizationId || "default_org";
  const {
    i18n: { resolvedLanguage: currentLocale },
  } = useTranslation();

  const trpcClient = useMemo(() => {
    console.log("recreating trpcClient", currentOrganizationId);
    const headers = {
      "x-deingpt-organization-id": currentOrganizationId,
      "x-deingpt-session-id": browserSessionKey,
      "x-deingpt-locale": currentLocale,
    } as const;
const terminalLinkCommonProps = {
  url: trpcUrl,
  maxURLLength: 8000,
  headers: (opts: { headers?: Record<string, string> }) => ({
    ...opts.headers,
    ...headers,
  }),
  fetch: fetchWithAppVersion,
} as const;

    return trpc.createClient({
      links: [
        // devtoolsLink({
        //   // `enabled` is true by default
        //   // If you want to use the devtools extension just for development, do the following
        //   // enabled: import.meta.env.MODE === "development",
        // }),
        phaseLink,
        toastLink,
        // first we split if the operation is non-serializable
        splitLink({
          condition: (op) =>
            isNonJsonSerializable(op.input) || !!op.context.nonSerializable,
          true:httpLink(terminalLinkCommonProps as any),

          // the streaming link is preferred for most operations, since it allows batching but also streaming the individual operations, and not waiting for the whole batch to complete. However, some operations cannot be part of a streaming response. Example: Some operations need to set headers, like for authorization, which is not possible to send after a stream has started. So we allow individual operations to disable streaming by settings `context.disableStreaming` to `true`.
          false: splitLink({
            condition: (op) => !op.context.disableStreaming,
            true: unstable_httpBatchStreamLink(terminalLinkCommonProps as any),
            false: httpBatchLink(terminalLinkCommonProps as any)
            }),
        }),

      ],
    });
  }, [currentOrganizationId, currentLocale]);

  return (
    <trpc.Provider client={trpcClient} queryClient={queryClient}>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </trpc.Provider>
  );
}

