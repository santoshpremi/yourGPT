import { z } from "zod";

export const userSchema = z.object({
  id: z.string(),
  name: z.string(),
  email: z.string().email(),
  logoUrl: z.string().optional().default(''),
  avatarUrl: z.string().optional().default(''),
  customPrimaryColor: z.string().optional().default('#000000'),
  defaultModel: z.string().optional().default('gpt-3.5'),
  tenantId: z.string().optional(),
  defaultWorkshopId: z.string().optional()
});

export type User = z.infer<typeof userSchema>;