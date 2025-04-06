import { z } from "zod";

export const ApiUser = z.object({
  id: z.string(),
  firstName: z.string().nullable(),
  lastName: z.string().nullable(),
  imageUrl: z.string().nullable(),
  primaryEmail: z.string().nullable(),
  jobDescription: z.string().nullable(),
  onboarded: z.boolean(),
  isOrganizationAdmin: z.boolean(),
  isSuperUser: z.boolean(),
  isSuperUserOnly: z.boolean().default(false).optional(),
  tourCompleted: z.boolean(),
  company: z.string().nullable(),
  roles: z.enum(["USER", "TEACHER"]).array(),
  hasPayloadKeySet: z.boolean().optional(),
  acceptedGuidelines: z.boolean().optional(),
});

export type ApiUser = z.infer<typeof ApiUser>;

export const UpdateApiUser = ApiUser.partial().omit({
  id: true,
  isOrganizationAdmin: true,
  isSuperUserOnly: true,
  hasPayloadKeySet: true,
  company: true,
  roles: true,
});

export const ApiOrganizationUser = ApiUser.extend({
  lastLogin: z.string().nullable(),
  lastActive: z.string().nullable(),
  totalMessages: z.number(),
});

export type ApiOrganizationUser = z.infer<typeof ApiOrganizationUser>;

export const ApiUpdatePayloadApiKey = z.object({
  payloadApiKey: z.string().uuid(),
});

export type ApiUpdatePayloadApiKey = z.infer<typeof ApiUpdatePayloadApiKey>;
