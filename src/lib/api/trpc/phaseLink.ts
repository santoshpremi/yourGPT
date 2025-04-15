import type { TRPCLink } from "@trpc/client";
import type { AppRouter } from "../../../../backend/src/api/appRouter";
import { observable } from "@trpc/server/observable";
import { useTrialStore } from "../../context/trialModalStore";
import type { PhaseUsageResponse } from "../../../../backend/src/util/credits/phaseUsage";

export const phaseLink: TRPCLink<AppRouter> = () => {
  return ({ next, op }) =>
    observable((observer) =>
      next(op).subscribe({
        error(err) {
          if (err.data?.code === "PRECONDITION_FAILED") {
            const cause = err.data.cause as PhaseUsageResponse;
            const isLocked =
              cause.includes("creditsExhausted") || cause.includes("expired");

            if (isLocked) {
              useTrialStore.setState({
                status: cause.includes("creditsExhausted")
                  ? "creditsExhausted"
                  : "expired",
              });

              return;
            }
          }

          observer.error(err);
        },
        next(value) {
          observer.next(value);
        },
        complete() {
          observer.complete();
        },
      }),
    );
};
