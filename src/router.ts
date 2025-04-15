// Generouted, changes to this file will be overridden
/* eslint-disable */

import { components, hooks, utils } from "@generouted/react-router/client";

export type Path =
  | `/`
  | `/default_org`
  | `/:organizationId`
  | `/:organizationId/*` // All sub-routes
  | `/:organizationId/adoption`
  | `/:organizationId/chats`
  | `/:organizationId/chats/:chatId`
  | `/:organizationId/learn/:workshopId`
  | `/:organizationId/learn/:workshopId/course/:courseId`
  | `/:organizationId/learn/:workshopId/course/:courseId/done`
  | `/:organizationId/learn/:workshopId/course/:courseId/exercise/:exerciseId`
  | `/:organizationId/onboarding`
  | `/:organizationId/settings`
  | `/:organizationId/settings/dataPool/:id`
  | `/:organizationId/teach`
  | `/:organizationId/teach/*`
  | `/:organizationId/test`
  | `/:organizationId/tools/imageFactory`
  | `/:organizationId/tools/meetingTools`
  | `/:organizationId/tools/meetingTools/recordingTranscriber/:meetingId`
  | `/:organizationId/tools/personalAssistant`
  | `/:organizationId/tools/researchAssistant`
  | `/:organizationId/tools/techSupport`
  | `/:organizationId/tools/translateContent`
  | `/:organizationId/workflows`
  | `/:organizationId/workflows/:workflowId`
  | `/auth`
  | `/invites`
  | `/magic-link/:token`
  | `/oauth-callback`
  | `/teach`
  | `/teach/:workshopId`
  | `/teach/course/:courseId`
  | `/trial`
  | `/workshops/join`;

export type Params = {
  "/organization-select": {};
  "/:organizationId": { organizationId: string };
  "/:organizationId/adoption": { organizationId: string };
  "/:organizationId/chats": { organizationId: string };
  "/:organizationId/chats/:chatId": { organizationId: string; chatId: string };
  "/:organizationId/learn/:workshopId": {
    organizationId: string;
    workshopId: string;
  };
  "/:organizationId/learn/:workshopId/course/:courseId": {
    organizationId: string;
    workshopId: string;
    courseId: string;
  };
  "/:organizationId/learn/:workshopId/course/:courseId/done": {
    organizationId: string;
    workshopId: string;
    courseId: string;
  };
  "/:organizationId/learn/:workshopId/course/:courseId/exercise/:exerciseId": {
    organizationId: string;
    workshopId: string;
    courseId: string;
    exerciseId: string;
  };
  "/:organizationId/onboarding": { organizationId: string };
  "/:organizationId/settings": { organizationId: string };
  "/:organizationId/settings/dataPool/:id": {
    organizationId: string;
    id: string;
  };
  "/:organizationId/teach": { organizationId: string };
  "/:organizationId/teach/*": { organizationId: string; "*": string };
  "/:organizationId/test": { organizationId: string };
  "/:organizationId/tools/imageFactory": { organizationId: string };
  "/:organizationId/tools/meetingTools": { organizationId: string };
  "/:organizationId/tools/meetingTools/recordingTranscriber/:meetingId": {
    organizationId: string;
    meetingId: string;
  };
  "/:organizationId/tools/personalAssistant": { organizationId: string };
  "/:organizationId/tools/researchAssistant": { organizationId: string };
  "/:organizationId/tools/techSupport": { organizationId: string };
  "/:organizationId/tools/translateContent": { organizationId: string };
  "/:organizationId/workflows": { organizationId: string };
  "/:organizationId/workflows/:workflowId": {
    organizationId: string;
    workflowId: string;
  };
  "/magic-link/:token": { token: string };
  "/teach/:workshopId": { workshopId: string };
  "/teach/course/:courseId": { courseId: string };
};

export type ModalPath =
  | `/[organizationId]/tools/profileSettings`
  | `/[organizationId]/tools/techSupport/analytics`
  | `/apiKeys`
  | `/feedback`;

export const { Link, Navigate } = components<Path, Params>();
export const { useModals, useNavigate, useParams } = hooks<
  Path,
  Params,
  ModalPath
>();
export const { redirect } = utils<Path, Params>();
