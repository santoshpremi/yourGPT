import { create } from "zustand";
import type { PhaseUsageResponse } from "../../../../backend/src/util/credits/phaseUsage";

interface TrialStore {
  status: PhaseUsageResponse;
  reset: () => void;
}

export const useTrialStore = create<TrialStore>((set) => ({
  status: "ok",
  reset: () => set({ status: "ok" }),
}));
