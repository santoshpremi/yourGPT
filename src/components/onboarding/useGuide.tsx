import { create } from "zustand";

interface IntroTourStore {
  step: number;
  setStep: (step: number) => void;
  run: boolean;
  setRun: (run: boolean) => void;
  completed: boolean;
  setCompleted: (completed: boolean) => void;
}

export const useGuide = create<IntroTourStore>((set) => ({
  step: 0,
  setStep: (step: number) => {
    set({ step });
    console.log("step set to", step);
  },
  run: true,
  // Should default to true so that intro tour actions do not start on initial load
  completed: true,
  setRun: (run: boolean) => {
    set({ run });
    console.log("run set to", run);
  },
  setCompleted: (completed: boolean) => {
    set({ completed });
    console.log("completed set to", completed);
  },
}));
