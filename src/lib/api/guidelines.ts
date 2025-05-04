// src/lib/api/guidelines.ts
import { trpc } from "./trpc/trpc";

export const useGuidelines = () => {
  const { accepted, lastUpdated } =
    trpc.usageGuidelines.getGuidelines.useQuery().data ?? {};
  const updateGuidelines =
    trpc.usageGuidelines.updateGuidelines.useMutation().mutateAsync;
  return { accepted, lastUpdated, updateGuidelines };
};
