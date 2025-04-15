import { useEffect } from "react";
import { useNavigate } from "../../router";
import { trpc } from "./trpc/trpc";
import { skipToken } from "@tanstack/react-query";

export function useOrganization({ skip }: { skip: boolean } = { skip: false }) {
  const { data } = trpc.organization.getOrganization.useQuery(
    skip ? skipToken : undefined,
  );
  return data;
}

export function usePartOfCurrentOrganization() {
  const navigate = useNavigate();
  const { error: orgError } = trpc.organization.getOrganization.useQuery();

  useEffect(() => {
    if (
      orgError &&
      ["NOT_FOUND", "FORBIDDEN"].includes(orgError.data?.code ?? "")
    ) {
      void navigate("/", { replace: true });
    }
  }, [orgError]);
}
