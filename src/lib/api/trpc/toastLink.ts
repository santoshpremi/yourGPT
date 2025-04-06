import type { TRPCLink } from "@trpc/client";
import type { AppRouter } from "../../../../backend/src/api/appRouter";
import { observable } from "@trpc/server/observable";
import { toast } from "react-toastify";
import { captureException } from "@sentry/react";
import { useAuthStore } from "../../context/authStore";
import { t } from "i18next";

export const toastLink: TRPCLink<AppRouter> = () => {
  return ({ next, op }) =>
    observable((observer) =>
      next(op).subscribe({
        next(value) {
          if (op.type === "mutation" && op.context.successMessage) {
            toast.success(t(op.context.successMessage as string));
          }
          observer.next(value);
        },

        error(err) {
          if (op.context.silentError) {
            observer.error(err);
            return;
          }

          switch (err.data?.code) {
            case "UNAUTHORIZED":
              useAuthStore.getState().setLoggedIn(false);
              break;
            default:
              if (!err.data?.isReported) {
                captureException(err, {
                  extra: {
                    op,
                  },
                });
              }
              console.error("TRPC error during", op);
              console.error("error code:", err.data?.code);
              console.error(err);
              if (
                !(
                  err.data?.code === "INTERNAL_SERVER_ERROR" &&
                  op.type === "query"
                ) &&
                !(
                  import.meta.env.DEV &&
                  err.message === "Invalid response or stream interrupted"
                )
              )
                toast.error(
                  `${t("trpcErrorCodes." + (err.data?.code ?? "UNKNOWN_ERROR"))} (${op.path}) "${err.message}"`
                );
              break;
          }

          observer.error(err);
        },
        complete() {
          observer.complete();
        },
      })
    );
};
