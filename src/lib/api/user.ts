
import  { ApiUpdatePayloadApiKey, ApiOrganizationUser,ApiUser } from "../../../packages/apiTypes/src/User";
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
import * as Sentry from "@sentry/react";
import { useGuide } from "../../components/onboarding/useGuide";


export function useUser(userId: string | null) {
 const { setCompleted, completed } = useGuide();
 const user = useOrganizationSchemaResource(
   "/users/" + (userId ?? "me"),
   ApiUser
 );
 useEffect(() => {
   if (!user) return;
   if (userId == "me") {
     Sentry.setUser({
       userId: user.id,
       email: user.primaryEmail ?? "",
       username: `${user.firstName ?? ""} ${user.lastName ?? ""}`.trim(),
     });
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


export function useMe() {
 const params = useParams("/:organizationId");
 const mutate = useOrganizationSWR("/users/me").mutate;
 useEffect(() => {
   if (lastOrganizationId === null) {
     lastOrganizationId = params.organizationId;
     return;
   }
   if (params.organizationId === lastOrganizationId) return;
   lastOrganizationId = params.organizationId;
   mutate().catch(() => {});
 }, [params.organizationId, mutate]);


 return useOrganizationSchemaResource("/users/me", ApiUser);
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
