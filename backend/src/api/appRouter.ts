// backend/src/api/appRouter.ts
import { z } from "zod";
import { initTRPC } from "@trpc/server";
import {
  ApiOrganization,
  ApiPatchOrganization,
} from "../../../packages/apiTypes/src/Organization";
import { checkTrialPhase } from '../util/credits/phaseUsage';

const t = initTRPC.create();
export const publicProcedure = t.procedure;

export const appRouter = t.router({
  organization: t.router({
    getOrganization: t.procedure.input(z.void()).query(() =>
      ApiOrganization.parse({
        id: "org_cm8yflh26064xmw01zbalts9c",
        name: "My Enterprise",
        domain: ["deingpt.com"],
        isAcademyOnly: false,
      }),
    ),

    updateOrganization: t.procedure
      .input(ApiPatchOrganization)
      .mutation(async ({ input }) => ({
        ...input,
        id: "org_cm8yflh26064xmw01zbalts9c",
        isAcademyOnly: false,
      })),
  }),
    trial: t.router({
    check: publicProcedure.query(() => checkTrialPhase())
  }),

  apiKeys: t.router({
    enabled: t.procedure
      .query(() => true),
    list: t.procedure
      .query(() => {
        return [
          {
            id: "key1",
            displayName: "Test Key",
            createdAt: new Date(),
          }
        ];
      }),
    create: t.procedure
      .input(z.object({ displayName: z.string() }))
      .mutation(async ({ input }) => {
        return {
          id: `key_${Date.now()}`,
          displayName: input.displayName,
          key: `sk_test_${Math.random().toString(36).slice(2)}`,
          createdAt: new Date()
        };
      }),
    delete: t.procedure
      .input(z.object({ id: z.string() }))
      .mutation(async ({ input }) => {
        // Mock delete operation
        return true;
      }),
  }),

  artifact: t.router({
    // Add all required procedures
    getVersion: t.procedure
      .input(z.object({ id: z.string() }))
      .query(({ input }) => ({
        Artifact: {
          id: input.id,
          title: "Example Artifact",
          content: "Sample content",
          createdAt: new Date(),
        },
      })),

    getArtifact: t.procedure
      .input(z.object({ chatId: z.string() }))
      .query(() => ({
        id: "artifact_123",
        title: "Sample Artifact",
        versions: [],
      })),

    createVersion: t.procedure
      .input(
        z.object({
          chatId: z.string(),
          baseVersionId: z.string(),
          highlightedText: z.string(),
          feedback: z.string(),
          context: z.string().optional(),
        }),
      )
      .mutation(async () => ({
        id: `new_version_${Date.now()}`,
        content: "New content",
      })),
  }),
});

export type AppRouter = typeof appRouter;
