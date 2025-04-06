import { z } from 'zod';
import { initTRPC } from '@trpc/server';
import { ApiOrganization, ApiPatchOrganization } from '../../packages/apiTypes/src/Organization';

const t = initTRPC.create();

export const appRouter = t.router({
  // Organization routes (existing)
  organization: t.router({
    getOrganization: t.procedure
      .input(z.void())
      .query(() => 
        ApiOrganization.parse({
          id: 'org_cm8yflh26064xmw01zbalts9c',
          name: 'My Enterprise',
          domain: ['deingpt.com'],
          isAcademyOnly: false,
        })
      ),
      
    updateOrganization: t.procedure
      .input(ApiPatchOrganization)
      .mutation(async ({ input }) => {
        return ApiOrganization.parse({ 
          ...input,
          id: 'org_cm8yflh26064xmw01zbalts9c',
          isAcademyOnly: false 
        });
      })
  }),

  // New artifact routes (added here)
  artifact: t.router({
    getVersion: t.procedure
      .input(z.object({
        id: z.string(),
      }))
      .query(async ({ input }) => {
        // Example implementation
        return {
          Artifact: {
            id: input.id,
            title: 'Example Artifact',
            content: 'Sample content',
            createdAt: new Date(),
          }
        };
      }),
  })
});

export type AppRouter = typeof appRouter;