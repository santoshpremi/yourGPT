import type { TRPCLink } from "@trpc/client";
import type { AppRouter } from "../../../../backend/src/api/appRouter";
import { observable } from "@trpc/server/observable";
import { useTrialStore } from "../../context/trialModalStore";
import type { PhaseUsageResponse } from "@credits/phaseUsage";

export const phaseLink: TRPCLink<AppRouter> = () => {
  return ({ next, op }) =>
    observable((observer) =>
      next(op).subscribe({
        error(err) {
          if (err.data?.code === "PRECONDITION_FAILED") {
            const message = err.message.toLowerCase();
            const status: PhaseUsageResponse = 
              message.includes('credits') ? 'creditsExhausted' :
              message.includes('expired') ? 'expired' : 'ok';

            useTrialStore.setState({ status });
            return;
          }
          observer.error(err);
        },
        next(value) { observer.next(value); },
        complete() { observer.complete(); }
      })
    );
};
