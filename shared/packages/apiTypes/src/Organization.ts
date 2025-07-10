import * as z from "zod";

export const ApiOrganization = z.object({
  id: z.string(),
  name: z.string(),
  domain: z.string().array(),
  logoUrl: z.string().nullable(),
  avatarUrl: z.string().nullable(),
  customPrimaryColor: z.string().nullable(),
  defaultModel: z.string().nullable(),
  tenantId: z.string().nullable(),
  isAcademyOnly: z.boolean(),
  blacklistedModels: z.array(z.string()).optional(),
  nonEuWarningSkippable: z.boolean().optional(),
  defaultWorkshopId: z.string().nullable(),
});

export type ApiOrganization = z.infer<typeof ApiOrganization>;

export const ApiPatchOrganization = ApiOrganization.omit({
  id: true,
  tenantId: true,
  isAcademyOnly: true,
  blacklistedModels: true,
}).partial();

export type ApiPatchOrganization = z.infer<typeof ApiPatchOrganization>;
