// Generouted, changes to this file will be overridden
/* eslint-disable */

import { components, hooks, utils } from '@generouted/react-router/client'

export type Path =
  | `/`
  | `/:organizationId`
  | `/:organizationId/chats`
  | `/:organizationId/chats/:chatId`
  | `/organization-select`

export type Params = {
  '/:organizationId': { organizationId: string }
  '/:organizationId/chats': { organizationId: string }
  '/:organizationId/chats/:chatId': { organizationId: string; chatId: string }
}

export type ModalPath = `/[organizationId]/tools/profileSettings` | `/[organizationId]/tools/techSupport/analytics` | `/apiKeys` | `/feedback`

export const { Link, Navigate } = components<Path, Params>()
export const { useModals, useNavigate, useParams } = hooks<Path, Params, ModalPath>()
export const { redirect } = utils<Path, Params>()
