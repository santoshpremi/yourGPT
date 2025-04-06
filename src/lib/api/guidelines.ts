import { trpc } from "./trpc/trpc";

export const useGuidelines = () => {
  const { guidelines, guidelinesLastUpdate } =
    trpc.usageGuidelines.getGuidelines.useQuery().data ?? {};
  const mutateGuidelines =
    trpc.usageGuidelines.mutateGuidelines.useMutation().mutateAsync;
  return { guidelines, guidelinesLastUpdate, mutateGuidelines };
};
