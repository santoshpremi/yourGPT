import * as z from "zod";

export const ApiOrganization = z.object({
  id: z.string().regex(/^org_[a-zA-Z0-9]{24}$/), // Enforce org ID format
  name: z.string().min(2).max(100),
  domain: z.array(z.string().regex(/^[a-zA-Z0-9-]+\.[a-zA-Z]{2,}$/)), // Validate domain format
  logoUrl: z.string().url().nullable(),
  avatarUrl: z.string().url().nullable(),
  customPrimaryColor: z.string().regex(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/).nullable(),
  defaultModel: z.string().nullable(),
  tenantId: z.string().uuid().nullable(), // Enforce UUID format
  isAcademyOnly: z.boolean().default(false),
  blacklistedModels: z.array(z.string()).optional(),
  nonEuWarningSkippable: z.boolean().optional().default(false),
  defaultWorkshopId: z.string().uuid().nullable()
});

export type ApiOrganization = z.infer<typeof ApiOrganization>;

export const ApiPatchOrganization = ApiOrganization
  .omit({ id: true, tenantId: true })
  .partial()
  .refine(data => 
    !(data.domain && data.domain.length > 3), 
    { message: "Maximum 3 domains allowed" }
  );

export type ApiPatchOrganization = z.infer<typeof ApiPatchOrganization>;