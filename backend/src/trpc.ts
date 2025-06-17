// backend/src/trpc.ts
import { z } from "zod";
import { initTRPC } from "@trpc/server";
import {
  ApiOrganization,
  ApiPatchOrganization,
} from "../../packages/apiTypes/src/Organization.js";
import { KnowledgeCollection } from "./api/rag/dataPool/dataPoolTypes.js";
import {
  ChatInfiniteQueryResultSchema,
  ChatListItem,
} from "../../backend/src/api/chat/chatTypes.js";
// Removed problematic imports
import {
  Workflow,
  WorkflowCreateInput,
  WorkflowUpdateInput,
  WorkflowGetAllInput,
} from "./api/workflow/workflowTypes";
import { Department } from "./api/organization/departmentTypes";
import { get } from "lodash";
import type { Message } from "./api/chat/message/messageTypes.js";
import { response } from "express";
import { ModelOverride } from "./api/chat/chatTypes.js";
export const t = initTRPC.create();

const mockWorkflows: Workflow[] = [
  {
    id: "wf-1",
    name: "Onboarding Workflow",
    description: "New employee onboarding process",
    index: 0,
    departmentId: "dept-1",
    createdAt: new Date(),
    updatedAt: new Date(),
    steps: [
      {
        id: "step-1",
        order: 0,
        promptTemplate: "Welcome to the onboarding process!",
        modelOverride: null,
      },
    ],
  },
];
// Mock data storage
const mockData = {
  organization: ApiOrganization.parse({
    id: "org_cm8yflh26064xmw01zbalts9c",
    name: "My Enterprise",
    domain: ["deingpt.com"],
    isAcademyOnly: false,
    customPrimaryColor: "#4F46E5",
    defaultModel: "gpt-4",
    tenantId: "550e8400-e29b-41d4-a716-446655440000",
    defaultWorkshopId: "550e8400-e29b-41d4-a716-446655440001",
    logoUrl: "",
    avatarUrl: "",
    phaseStatus: "ok",
    customTitle: "My Organization",
    banners: [
      {
        id: "welcome-banner",
        content: "Welcome to ou!",
        type: "success",
      },
    ],
    phaseUsageStatus: "ok",
    phaseUsageEnd: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000), // 2 months from now
    phaseUsageStart: new Date(),
    phaseUsageDuration: 60,
    phase: "TRIAL",
    phaseStartDate: new Date(),
    phaseEndDate: new Date(Date.now() + 60 * 86400000), // 60 days from now
  }),

  guidelines: {
    content: "Sample usage guidelines text...",
  },

  contactInfo: {
    email: "sales@deingpt.com",
    phone: "+1-555-123-4567",
  },
  productConfig: {
    imageGeneration: true,
    meetingSummarizer: true,
    meetingTranscription: true,
    personalAssistant: true,
    meetingTools: true,
    documentTranslator: true,
    textTranslator: true,
    sonar: true,
    academy: true,
    academyOnly: false,
    enableRag: true,
    enableRagAcademy: true,
  },
  tools: {
    images: {
      enabled: true,
      configuredModels: ["model1", "model2"],
    },
    researchAssistant: {
      enabled: true,
      configuredModels: ["model3"],
    },
    meetingTools: {
      enabled: true,
      configuredModels: ["gemini-1.5-pro"],
    },
    techSupport: {
      enabled: true,
      configuredModels: ["model4"],
    },
    translateContent: {
      textTranslator: {
        enabled: true,
        configuredModels: ["model5"],
      },
      documentTranslator: {
        enabled: true,
        configuredModels: ["model6"],
      },
    },
    documentIntelligence: {
      enabled: true,
      configuredModels: ["model7"],
    },
  },
};

// Organization Metrics Router
const organizationMetricsRouter = t.router({
  getPhaseAnalytics: t.procedure.query(() => ({
    numPrompts: 200,
    totalMinutesSaved: 500,
    numWorkflowRuns: 38,
  })),
});

// Add to organization router
const organizationRouter = t.router({
  department: t.router({
    all: t.procedure.output(z.array(Department)).query(() => []), // Implement your actual query
  }),
});
// Workflows Router

const workflowsRouter = t.router({
  getAll: t.procedure
    .input(WorkflowGetAllInput)
    .output(z.array(Workflow))
    .query(({ input }) => {
      if (!input || !input.departmentId) {
        return mockWorkflows;
      }
      return mockWorkflows.filter(
        (w: Workflow) => w.departmentId === input.departmentId
      );
    }),

  create: t.procedure
    .input(WorkflowCreateInput)
    .mutation(() => "new-workflow-id"),

  update: t.procedure.input(WorkflowUpdateInput).mutation(({ input }) => input),

  favorites: t.procedure.output(z.array(Workflow)).query(() => []),

  getTemplates: t.procedure
    .input(z.object({ language: z.enum(["en", "de"]) }))
    .output(
      z.array(
        z.object({ id: z.string(), name: z.string(), description: z.string() })
      )
    )
    .query(({ input }) => {
      const templates = [
        { id: "template-1", name: "Template 1", description: "Description 1" },
        { id: "template-2", name: "Template 2", description: "Description 2" },
      ];
      return input.language === "de" ? templates : templates;
    }),

  wizard: t.procedure
    .input(z.object({ language: z.enum(["en", "de"]), query: z.string() }))
    .mutation(async ({ input }) => {
      const workflow = {
        id: "new-workflow-id",
        name: "Generated Workflow",
        description: "This is a generated workflow.",
        departmentId: "dept-1",
      };
      return workflow;
    }),

  toggleFavorite: t.procedure
    .input(z.object({ workflow: z.object({ id: z.string() }) }))
    .mutation(() => true),

  updateDepartmentAndPosition: t.procedure
    .input(
      z.object({
        workflow: z.object({
          id: z.string(),
          departmentId: z.string(),
          index: z.number(),
        }),
        sourceDepartmentId: z.string(),
      })
    )
    .mutation(() => true),
});

// Usage Guidelines Router
const usageGuidelinesRouter = t.router({
  getGuidelines: t.procedure
    .input(z.void())
    .output(
      z.object({
        accepted: z.boolean(),
        lastUpdated: z.date(),
      })
    )
    .query(() => ({
      accepted: true,
      lastUpdated: new Date(),
    })),
    
  updateGuidelines: t.procedure
    .input(z.object({ accepted: z.boolean() }))
    .mutation(async ({ input }) => {
      // In a real implementation, you would save this to a database
      return input;
    }),
});
// Contact Info Router
const contactInfoRouter = t.router({
  getOrganizationContactInfo: t.procedure
    .input(z.void())
    .query(() => mockData.contactInfo),
});

// productConfig Router
const productConfigRouter = t.router({
  getProductConfig: t.procedure
    .input(z.void())
    .query(() => mockData.productConfig),
});

// Add ModelConfig router
const modelConfigRouter = t.router({
  getEnabled: t.procedure
    .input(z.void())
    .query(() => [
      "sonar",
      "gemini-1.5-pro",
      "gpt-4o-mini",
      "sonar-deep-research",
      "gpt-4o",
      "o1-us",
      "o3-mini",
      "claude-3-7-sonnet",
      "claude-3-7-sonnet-thinking",
      "gemini-2.0-flash",
      "llama-3.3-fast",
      "deepseek-v3",
      "deepseek-r1"
    ] as const),
});
// Tools Router
const toolsRouter = t.router({
  images: t.router({
    listConfigured: t.procedure
      .input(z.void())
      .query(() => mockData.tools.images.configuredModels),
  }),
  modelConfig: modelConfigRouter,
  translateContent: t.router({
    textTranslator: t.router({
      isEnabled: t.procedure
        .input(z.void())
        .query(() => mockData.tools.translateContent.textTranslator.enabled),
    }),
    documentTranslator: t.router({
      isEnabled: t.procedure
        .input(z.void())
        .query(
          () => mockData.tools.translateContent.documentTranslator.enabled
        ),
    }),
  }),
  techSupport: t.router({
    isEnabled: t.procedure
      .input(z.void())
      .query(() => mockData.tools.techSupport.enabled),
    getAnalytics: t.procedure
      .input(z.object({
        from: z.string(),
        to: z.string()
      }))
      .output(z.object({
        totalRequests: z.number(),
        totalIssuesSolved: z.number(),
        unknownOutcome: z.number(),
        totalTicketsCreated: z.number(),
        solvedRequestsByDay: z.array(z.object({
          day: z.string(),
          solved_requests: z.number(),
          tickets_created: z.number(),
          unknown_outcome: z.number()
        }))
      }))
      .query(() => ({
        totalRequests: 100,
        totalIssuesSolved: 75,
        unknownOutcome: 15,
        totalTicketsCreated: 10,
        solvedRequestsByDay: [
          {
            day: new Date().toISOString(),
            solved_requests: 75,
            tickets_created: 10,
            unknown_outcome: 15
          }
        ]
      }))
  }),
  meetingTools: t.router({
    listConfigured: t.procedure
      .input(z.void())
      .query(() => mockData.tools.meetingTools.configuredModels),
  }),
  documentIntelligence: t.router({
    isEnabled: t.procedure
      .input(z.void())
      .query(() => mockData.tools.documentIntelligence.enabled),
  }),
});

// Add RAG router
const ragRouter = t.router({
  dataPools: t.router({
    getAll: t.procedure.query((): KnowledgeCollection[] => [
      {
        id: "default-pool",
        name: "Default Knowledge Base",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]),
    updateAsSeen: t.procedure.mutation(() => true),
  }),
});

// Add chat router
const chatRouter = t.router({
  adjustChatTitle: t.procedure
    .input(z.object({ 
      chatId: z.string(),
      name: z.string()
    }))
    .mutation(async ({ input }) => {
      // Your mutation logic here
      return { success: true };
    }),

  setModelOverride: t.procedure
    .input(
      z.object({
        chatId: z.string(),
        modelOverride: z.string().nullable(),
      })
    )
    .mutation(async ({ input }) => {
      // Your mutation logic here
      return { success: true };
    }),

  get: t.procedure
    .input(z.object({ chatId: z.string() }))
    .query(async ({ input }) => {
      // Your query logic here
      return {
        id: input.chatId,
        name: "Sample Chat",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        hidden: false,
        organizationId: "org-1",
        customSystemPromptSuffix: null,
        ragMode: "OFF" as const,
        customSourceId: null,
        creditWarningAccepted: false,
        organisationDefaultModel: "gpt-4",
      };
    }),
  setRagMode: t.procedure
    .input(
      z.object({
        chatId: z.string(),
        ragMode: z.enum(["OFF", "AUTO", "CUSTOM"]),
        customSourceId: z.string().optional(),
      })
    )
    .mutation(() => true),
  create: t.procedure
    .input(
      z.object({
        id: z.string(),
        name: z.string().nullable(),
        organizationId: z.string(),
      })
    )
    .mutation(async ({ input }) => {
      // In a real app, this would save to database
      return {
        id: input.id,
        name: input.name,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        organizationId: input.organizationId,
        modelOverride: null,
        ragMode: "OFF" as const,
        customSourceId: null,
        creditWarningAccepted: false,
        artifactId: null,
        hidden: false,
        customSystemPromptSuffix: null,
      };
    }),
  getAll: t.procedure
    .input(
      z.object({
        limit: z.number().min(1).max(100),
        cursor: z.string().optional(),
      })
    )
    .output(ChatInfiniteQueryResultSchema)
    .query(({ input }) => ({
      items: [
        {
          id: "chat-1",
          name: "Sample Chat",
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          organizationId: "org_cm8yflh26064xmw01zbalts9c",
        },
      ],
      nextCursor: undefined,
    })),
  acceptCreditWarning: t.procedure
    .input(z.object({ chatId: z.string() }))
    .mutation(async () => {
      return { success: true };
    }),
  delete: t.procedure
    .input(z.object({ chatId: z.string() }))
    .mutation(async ({ input }) => {
      // Your delete logic here
      return { success: true };
    }),
});

// Department Router
const departmentRouter = t.router({
  personal: t.router({
    get: t.procedure
      .input(z.void())
      .query(() => ({ id: "Personal department data" })),
  }),
});



const messageRouter = t.router({
  postMessageAndRequestResponse: t.procedure
    .input(
      z.object({
        content: z.string(),
        language: z.string(),
        attachmentIds: z.array(z.string()).optional(),
        customSystemPromptSuffix: z.string().optional(),
        temperature: z.number().optional(),
        chatId: z.string(),
        modelOverride: z.string().optional(),
        outputFormat: z.string().optional(),
        workflowExecutionId: z.string().optional(),
      })
    )
    .mutation(async function* ({ input }) {
      yield {
        type: "init",
        aiMessageId: "msg-1",
        generationModel: "gpt-4o-mini" as const,
      };
      yield {
        type: "chunk",
        delta: "Sample response",
        content: "Sample response",
        citations: [],
      };
    }),

  abortMessageResponse: t.procedure
    .input(
      z.object({
        chatId: z.string(),
        messageId: z.string(),
        receivedContent: z.string(),
      })
    )
    .mutation(async ({ input }) => {
      // Your mutation logic here
      return { success: true };
    }),

  getMessagesForChat: t.procedure
    .input(z.object({ chatId: z.string() }))
    .query(async ({ input }) => {
      return [
        {
          id: "message-1",
          content: "Sample message",
          chatId: input.chatId,
          createdAt: new Date().toISOString(),
          fromAi: false,
          responseCompleted: true,
          authorId: null,
          generationModel: "gemini-1.5-pro" as const,
          attachmentIds: [] as string[],
          citations: [] as string[],
          artifactVersionId: null,
          cancelled: false,
          ragSources: [] as any[],
          tokens: 0,
          outputDocumentUrl: null,
          errorCode: null
        },
      ];
    }),
});







// Add User router
const userRouter = t.router({
  me: t.procedure
    .input(z.void())
    .query(() => ({
      id: "user_123",
      firstName: "Demo",
      lastName: "User",
      email: "demo@yourgpt.com",
      organizationId: "org_cm8yflh26064xmw01zbalts9c",
      isOrganizationAdmin: false,
      tourCompleted: true,
      roles: ["USER"],
      jobDescription: "Developer",
      onboarded: true,
      isSuperUser: false,
      company: "YourGPT",
      imageUrl: null,
      primaryEmail: "demo@yourgpt.com",
      isSuperUserOnly: false,
      acceptedGuidelines: true,
    })),
});

export const appRouter = t.router({
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
  organization: t.router({
    getOrganization: t.procedure
      .input(z.void())
      .output(ApiOrganization)
      .query(() => mockData.organization),

    updateOrganization: t.procedure
      .input(ApiPatchOrganization)
      .output(ApiOrganization)
      .mutation(async ({ input }) => ({
        ...mockData.organization,
        ...input,
      })),

    health: t.procedure.query(() => ({ status: "ok" })),

    getAllOrganizations: t.procedure
      .input(z.void())
      .query(() => [mockData.organization]),

    department: departmentRouter,
  }),

  artifact: t.router({
    getArtifact: t.procedure
      .input(z.object({ chatId: z.string() }))
      .output(
        z.object({
          id: z.string(),
          title: z.string(),
          content: z.string(),
          versions: z.array(
            z.object({
              id: z.string(),
              content: z.string(),
              createdAt: z.date(),
              fromChat: z.boolean(),
              version: z.number(),
            })
          ),
        })
      )
      .query(({ input }) => ({
        id: input.chatId,
        title: "Sample Artifact",
        content: "Sample content",
        versions: [
          {
            id: "version-1",
            content: "Version 1 content",
            createdAt: new Date(),
            fromChat: false,
            version: 1,
          },
        ],
      })),
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
        })
      )
      .query(({ input }) => ({
        Artifact: {
          id: input.id,
          title: "Example Artifact",
          content: "Sample content",
          createdAt: new Date(),
        },
      })),
    createVersion: t.procedure
      .input(
        z.object({
          artifactId: z.string(),
          content: z.string(),
          title: z.string(),
          chatId: z.string(),
          baseVersionId: z.string().optional(),
          highlightedText: z.string().optional(),
          feedback: z.string().optional(),
          context: z.string().optional(),
          
        })
      )
      .output(
        z.object({
          success: z.boolean(),
          versionId: z.string(),
        })
      )
      .mutation(async ({ input }) => {
        // Your mutation logic here
        return { success: true, versionId: "new-id" };
      }),
  }),

  trial: t.router({
    check: t.procedure.query(() => ({
      status: "ok",
      trialEnd: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000), // 2 months from now
    })),
  }),

  organizationMetrics: organizationMetricsRouter,
  organizational: organizationRouter,
  workflows: workflowsRouter,
  usageGuidelines: usageGuidelinesRouter,
  contactInfo: contactInfoRouter,
  productConfig: productConfigRouter,
  tools: toolsRouter,
  modelConfig: modelConfigRouter,
  department: departmentRouter,
  rag: ragRouter,
  chat: chatRouter,
  message: messageRouter,
  user: userRouter,
  // Add other routers here
});

export type AppRouter = typeof appRouter;
