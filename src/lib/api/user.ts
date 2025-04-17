// src/lib/api/user.ts
import {
  ApiUpdatePayloadApiKey,
  ApiOrganizationUser,
  ApiUser,
} from "../../../packages/apiTypes/src/User";
import type { WorkshopUserProfile } from "../../../packages/apiTypes/src/elearning/Workshop";

import { useEffect } from "react";
import { useParams } from "../../router";
import {
  useOrganizationApi,
  useOrganizationSchemaResource,
  useOrganizationSWR,
  useRootApi,
  useRootResource,
  useRootSWR,
} from "../hooks/useApi";
import { useGuide } from "../../components/onboarding/useGuide";

export function useUser(userId: string | null) {
  const { setCompleted, completed } = useGuide();
  const user = useOrganizationSchemaResource(
    "/users/" + (userId ?? "me"),
    ApiUser,
  );
  useEffect(() => {
    if (!user) return;
    if (userId == "me") {
      if (completed !== user.tourCompleted) {
        setCompleted(user.tourCompleted);
      }
    }
  }, [user, userId, completed, setCompleted]);

  return userId ? user : null;
}

export function useOrganizationUsers() {
  return useOrganizationSchemaResource("/users", ApiOrganizationUser.array());
}

export function useMutateOrganizationUsers() {
  return useOrganizationSWR(`/users`).mutate;
}

let lastOrganizationId: string | null = null;

// Modify useMe hook
export function useMe() {
  const params = useParams("/:organizationId");
  const mutate = useOrganizationSWR("/users/me").mutate;
  const { data, error } = useOrganizationSWR("/users/me");

  useEffect(() => {
    if (lastOrganizationId === null) {
      lastOrganizationId = params.organizationId;
      return;
    }
    if (params.organizationId === lastOrganizationId) return;
    lastOrganizationId = params.organizationId;
    mutate();
  }, [params.organizationId, mutate]);

  // Add response validation
  if (error) {
    console.error("Error fetching user:", error);
    return null;
  }

  if (!data) return undefined;

  // Handle unexpected response format
  if (typeof data === "string") {
    console.error("Unexpected string response from API:", data);
    return null;
  }

  try {
    return ApiUser.parse(data);
  } catch (error) {
    console.error("User validation failed:", error);
    return null;
  }
}

export function useMutateMe() {
  return useOrganizationSWR("/users/me").mutate;
}

export function useToggleUserPermissions() {
  const api = useOrganizationApi();
  const mutateMe = useMutateMe();
  const mutateUsers = useOrganizationSWR("/users").mutate;

  return async (userId: string) => {
    await api.post(`/users/${userId}/permission/toggle`);
    await mutateMe();
    await mutateUsers();
  };
}

export function useUpdatePayloadApiKey() {
  const api = useOrganizationApi();
  const mutateMe = useMutateMe();
  const mutateUsers = useOrganizationSWR("/users").mutate;

  return async (payloadApiKey: string) => {
    await api.patch(`/users/me/payloadApiKey`, {
      payloadApiKey,
    } satisfies ApiUpdatePayloadApiKey);
    await Promise.all([mutateMe(), mutateUsers()]);
  };
}

export function useAcademyProfile(): WorkshopUserProfile | null | undefined {
  return useRootResource(`workshopUsers/academyProfile`);
}

export function useUpdateAcademyProfile() {
  const api = useRootApi();
  const mutate = useRootSWR(`workshopUsers/academyProfile`).mutate;

  return async (profile: WorkshopUserProfile) => {
    await api.patch(`workshopUsers/academyProfile`, profile);
    await mutate();
  };
}
