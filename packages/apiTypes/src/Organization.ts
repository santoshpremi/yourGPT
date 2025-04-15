//  packages/apiTypes/src/Organization
import * as z from "zod";

// Make optional fields nullable with defaults
export const ApiOrganization = z.object({
  id: z.string().regex(/^org_[a-zA-Z0-9-]{20,30}$/), // More flexible pattern
  name: z.string(),
  domain: z.array(z.string()),
  isAcademyOnly: z.boolean().default(false),
  customPrimaryColor: z.string().default("#4F46E5"),
  defaultModel: z.string().default("gpt-4"),
  tenantId: z.string().uuid(),
  defaultWorkshopId: z.string().uuid(),
  logoUrl: z.string().default(""),
  avatarUrl: z.string().default(""),
  // Mark truly optional fields as optional
  optionalField: z.string().optional(),
});

export type ApiOrganization = z.infer<typeof ApiOrganization>;

export const ApiPatchOrganization = ApiOrganization.omit({
  id: true,
  tenantId: true,
})
  .partial()
  .refine((data) => !(data.domain && data.domain.length > 3), {
    message: "Maximum 3 domains allowed",
  });

export type ApiPatchOrganization = z.infer<typeof ApiPatchOrganization>;
