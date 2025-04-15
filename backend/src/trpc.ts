// backend/src/trpc.ts
import { z } from "zod";
import { initTRPC } from "@trpc/server";
import {
  ApiOrganization,
  ApiPatchOrganization,
} from "../../packages/apiTypes/src/Organization.js";

const t = initTRPC.create();

// Modify the mock organization data to match schema requirements
const mockOrganization = ApiOrganization.parse({
  id: "org_cm8yflh26064xmw01zbalts9c", // Must match your regex pattern
  name: "My Enterprise",
  domain: ["deingpt.com"],
  isAcademyOnly: false,
  customPrimaryColor: "#4F46E5",
  defaultModel: "gpt-4",
  tenantId: "550e8400-e29b-41d4-a716-446655440000",
  defaultWorkshopId: "550e8400-e29b-41d4-a716-446655440001",
  logoUrl: "",
  avatarUrl: "",
});

export const appRouter = t.router({
  organization: t.router({
    getOrganization: t.procedure
      .input(z.void())
      .output(ApiOrganization)
      .query(() => mockOrganization),

    updateOrganization: t.procedure
      .input(ApiPatchOrganization)
      .output(ApiOrganization)
      .mutation(async ({ input }) => ({
        ...mockOrganization,
        ...input,
      })),
    health: t.procedure.query(() => ({ status: "ok" })),
  }),

  artifact: t.router({
    getVersion: t.procedure
      .input(z.object({ id: z.string() }))
      .output(
        z.object({
          Artifact: z.object({
            id: z.string(),
            title: z.string(),
            content: z.string(),
            createdAt: z.date(),
          }),
        }),
      )
      .query(({ input }) => ({
        Artifact: {
          id: input.id,
          title: "Example Artifact",
          content: "Sample content",
          createdAt: new Date(),
        },
      })),
  }),
});

export type AppRouter = typeof appRouter;
