import { initTRPC } from '@trpc/server';
import { z } from 'zod';
import type { Context } from './context';

const t = initTRPC.context<Context>().create();

export const router = t.router;
export const publicProcedure = t.procedure;

// Mock data
const mockOrganization = {
  id: 'org1',
  name: 'Demo Organization',
  customTitle: 'DeinGPT Demo',
  phaseStatus: 'ok' as const,
  isAcademyOnly: false,
  defaultWorkshopId: 'workshop1',
};

const mockChats = [
  {
    id: 'chat1',
    title: 'Welcome to DeinGPT',
    createdAt: new Date().toISOString(),
    organizationId: 'org1',
    userId: 'user1',
  },
  {
    id: 'chat2',
    title: 'AI Assistant Demo',
    createdAt: new Date().toISOString(),
    organizationId: 'org1',
    userId: 'user1',
  },
];

const mockWorkflows = [
  {
    id: 'workflow1',
    name: 'Email Generator',
    description: 'Generate professional emails',
    steps: [],
    inputs: [],
    index: 0,
    departmentId: 'dept1',
    includedDocuments: [],
    modelOverride: null,
    allowDocumentUpload: false,
  },
];

const mockUser = {
  id: 'user1',
  email: 'demo@deingpt.com',
  name: 'Demo User',
  onboarded: true,
  acceptedGuidelines: true,
  organizationId: 'org1',
};

const mockProductConfig = {
  imageGeneration: true,
  meetingSummarizer: true,
  meetingTranscription: true,
  personalAssistant: true,
};

const mockEnabledModels = ['gpt-4o', 'gpt-4o-mini', 'claude-3-5-sonnet'];

export const appRouter = router({
  // User endpoints
  user: router({
    me: publicProcedure.query(() => mockUser),
    updateGuidelines: publicProcedure
      .input(z.object({ accepted: z.boolean() }))
      .mutation(({ input }) => {
        return { ...mockUser, acceptedGuidelines: input.accepted };
      }),
  }),

  // Organization endpoints
  organization: router({
    getOrganization: publicProcedure.query(() => mockOrganization),
  }),

  // Chat endpoints
  chat: router({
    getChats: publicProcedure.query(() => mockChats),
    getChat: publicProcedure
      .input(z.object({ chatId: z.string() }))
      .query(({ input }) => {
        return mockChats.find(chat => chat.id === input.chatId) || null;
      }),
    createChat: publicProcedure
      .input(z.object({ title: z.string() }))
      .mutation(({ input }) => {
        const newChat = {
          id: `chat_${Date.now()}`,
          title: input.title,
          createdAt: new Date().toISOString(),
          organizationId: 'org1',
          userId: 'user1',
        };
        mockChats.push(newChat);
        return newChat;
      }),
  }),

  // Workflow endpoints
  workflow: router({
    getWorkflows: publicProcedure.query(() => mockWorkflows),
    getWorkflow: publicProcedure
      .input(z.object({ workflowId: z.string() }))
      .query(({ input }) => {
        return mockWorkflows.find(w => w.id === input.workflowId) || null;
      }),
  }),

  // Tools endpoints
  tools: router({
    images: router({
      listConfigured: publicProcedure.query(() => ['dall-e-3', 'stable-diffusion']),
    }),
    translateContent: router({
      textTranslator: router({
        isEnabled: publicProcedure.query(() => true),
      }),
      documentTranslator: router({
        isEnabled: publicProcedure.query(() => true),
      }),
    }),
    techSupport: router({
      isEnabled: publicProcedure.query(() => true),
    }),
  }),

  // Model configuration
  modelConfig: router({
    getEnabled: publicProcedure.query(() => mockEnabledModels),
  }),

  // Product configuration
  productConfig: router({
    get: publicProcedure.query(() => mockProductConfig),
  }),

  // Gamification
  academy: router({
    gamification: router({
      xp: publicProcedure.query(() => ({
        xp: 150,
        currentLevel: 2,
        currentLevelProgress: 50,
        xpNeededForNextLevel: 100,
      })),
    }),
  }),
});

export type AppRouter = typeof appRouter; 