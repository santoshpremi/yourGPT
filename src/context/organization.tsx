// src/context/organization.tsx
import { createContext, useContext, useEffect } from "react";
import { useParams } from "../router";
import { ApiOrganization } from "../../packages/apiTypes/src/Organization";
import { trpc } from "../lib/api/trpc/trpc";

type OrganizationContextType = {
  organization: ApiOrganization | null;
  loading: boolean;
  error: Error | null;
  refetch: () => void;
};

const OrganizationContext = createContext<OrganizationContextType>({
  organization: null,
  loading: true,
  error: null,
  refetch: () => {},
});

export function OrganizationProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const { organizationId } = useParams("/:organizationId");

  const { data, isLoading, error, refetch } =
    trpc.organization.getOrganization.useQuery(undefined, {
      enabled: !!organizationId,
    });

  // Validate organization data against Zod schema
  const validatedOrg = data ? ApiOrganization.safeParse(data) : null;

  const value = {
    organization: validatedOrg?.success ? validatedOrg.data : null,
    loading: isLoading,
    error:
      error || (validatedOrg?.success === false ? validatedOrg.error : null),
    refetch,
  };

  return (
    <OrganizationContext.Provider value={value}>
      {children}
    </OrganizationContext.Provider>
  );
}

export function useOrganizationContext() {
  const context = useContext(OrganizationContext);
  if (!context) {
    throw new Error("useOrganization must be used within OrganizationProvider");
  }
  return context;
}
