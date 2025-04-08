import { z } from 'zod';
import { initTRPC } from '@trpc/server';
import { ApiOrganization, ApiPatchOrganization } from '../../packages/apiTypes/src/Organization';

const t = initTRPC.create();

const mockOrganization = ApiOrganization.parse({
  id: 'org_cm8yflh26064xmw01zbalts9c',
  name: 'My Enterprise',
  domain: ['deingpt.com'],
  isAcademyOnly: false,
  // Add all required fields from your schema
  customPrimaryColor: '#4F46E5',
  defaultModel: 'gpt-4',
  tenantId: 'tenant_123',
  defaultWorkshopId: 'workshop_123'
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
        ...input
      })),
      health: t.procedure
       .query(() => ({ status: 'ok' })),

  }),

  artifact: t.router({
    getVersion: t.procedure
      .input(z.object({ id: z.string() }))
      .output(z.object({
        Artifact: z.object({
          id: z.string(),
          title: z.string(),
          content: z.string(),
          createdAt: z.date()
        })
      }))
      .query(({ input }) => ({
        Artifact: {
          id: input.id,
          title: 'Example Artifact',
          content: 'Sample content',
          createdAt: new Date()
        }
      }))
  })
});

export type AppRouter = typeof appRouter;