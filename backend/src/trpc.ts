// backend/src/trpc.ts
import { z } from "zod";
import { initTRPC } from "@trpc/server";
import {
  ApiOrganization,
  ApiPatchOrganization,
} from "../../packages/apiTypes/src/Organization.js";
import { KnowledgeCollection } from "./api/rag/dataPool/dataPoolTypes.js";
import { ChatInfiniteQueryResultSchema, ChatListItem } from "../../backend/src/api/chat/chatTypes.js";
import { de } from "date-fns/locale.js";
import { p } from "react-router/dist/development/fog-of-war-Cm1iXIp7.js";
import {  Workflow, WorkflowCreateInput, WorkflowUpdateInput, WorkflowGetAllInput } from "./api/workflow/workflowTypes";
import { Department } from "./api/organization/departmentTypes";


export const t = initTRPC.create();


const mockWorkflows: Workflow[] = [
  {
    id: "wf-1",
    name: "Onboarding Workflow",
    description: "New employee onboarding process",
    index: 0,
    departmentId: "dept-1",
    createdAt: new Date(),
    updatedAt: new Date()
  }
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
    banners: [{
    id: "welcome-banner",
    content: "Welcome to ou!",
    type: "success"
    }],
    phaseUsageStatus: "ok",
    phaseUsageEnd: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000), // 2 months from now
    phaseUsageStart: new Date(),
    phaseUsageDuration: 60, 
    phase: "TRIAL",
    phaseStartDate: new Date(),
    phaseEndDate: new Date(Date.now() + 60 * 86400000), // 60 days from now
    
  }),
  
  guidelines: {
    content: "Sample usage guidelines text..."
  },
  
  contactInfo: {
    email: "sales@deingpt.com",
    phone: "+1-555-123-4567"
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
    images:{
      enabled: true,
      configuredModels: ["model1", "model2"]
    },
    researchAssistant: {
      enabled: true,
      configuredModels: ["model3"]
    },
    meetingTools: {
      enabled: true,
      configuredModels: ["gemini-1.5-pro"]
    },
    techSupport: {
      enabled: true,
      configuredModels: ["model4"]
    },
    translateContent: {
      textTranslator: {
        enabled: true,
        configuredModels: ["model5"]
      },
      documentTranslator: {
        enabled: true,
        configuredModels: ["model6"]      
  }
  },
  documentIntelligence: {
    enabled: true,
    configuredModels: ["model7"]
  },

  },  
};

// Organization Metrics Router
const organizationMetricsRouter = t.router({
  getPhaseAnalytics: t.procedure.query(() => ({
    numPrompts: 200,
    totalMinutesSaved: 500,
    numWorkflowRuns: 38
  }))
});


// Add to organization router
const organizationRouter = t.router({
  department: t.router({
    all: t.procedure
      .output(z.array(Department))
      .query(() => []), // Implement your actual query
  }),
});
// Workflows Router

const workflowsRouter = t.router({
  getAll: t.procedure
    .input(WorkflowGetAllInput)
    .output(z.array(Workflow))
    .query(({ input }) => {
      return mockWorkflows.filter((w: Workflow) => 
        w.departmentId === input.departmentId
      );
    }),
  
  create: t.procedure
    .input(WorkflowCreateInput)
    .mutation(() => "new-workflow-id"),
  
  update: t.procedure
    .input(WorkflowUpdateInput)
    .mutation(({ input }) => input),


  favorites: t.procedure
    .output(z.array(Workflow))
    .query(() => []), 

  getTemplates: t.procedure
    .input(z.object({ language: z.enum(["en", "de"]) }))
    .output(z.array(z.object({ id: z.string(), name: z.string(), description: z.string() }))) 
    .query(({ input }) => {
      const templates = [
        { id: "template-1", name: "Template 1", description: "Description 1" },
        { id: "template-2", name: "Template 2", description: "Description 2" },
      ];
      return input.language === "de" ? templates : templates;
    }),

    wizard : t.procedure
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
    .input(z.object({
      workflow: z.object({
        id: z.string(),
        departmentId: z.string(),
        index: z.number()
      }),
      sourceDepartmentId: z.string()
    }))
    .mutation(() => true),
    
});


// Usage Guidelines Router
const usageGuidelinesRouter =  t.router({
    getGuidelines: t.procedure
      .input(z.void())
      .output(z.object({
        accepted: z.boolean(),
        lastUpdated: z.date()
      }))
      .query(() => ({
        accepted: true,
        lastUpdated: new Date()
      }))
  })
// Contact Info Router
const contactInfoRouter = t.router({
  getOrganizationContactInfo: t.procedure
    .input(z.void())
    .query(() => mockData.contactInfo)
});


// productConfig Router
const productConfigRouter = t.router({
  getProductConfig: t.procedure
    .input(z.void())
    .query(() => mockData.productConfig)
});

// Add ModelConfig router
const modelConfigRouter = t.router({
  getEnabled: t.procedure
    .input(z.void())
    .query(() => ["sonar", "gemini-1.5-pro"] as const)
});
// Tools Router
const toolsRouter = t.router({
  images: t.router({
    listConfigured: t.procedure
      .input(z.void())
      .query(() => mockData.tools.images.configuredModels)
  }),
  modelConfig: modelConfigRouter,
  translateContent: t.router({
    textTranslator: t.router({
      isEnabled: t.procedure
        .input(z.void())
        .query(() => mockData.tools.translateContent.textTranslator.enabled)
    }),
    documentTranslator: t.router({
      isEnabled: t.procedure
        .input(z.void())
        .query(() => mockData.tools.translateContent.documentTranslator.enabled)
    })
  }),
  techSupport: t.router({
    isEnabled: t.procedure
      .input(z.void())
      .query(() => mockData.tools.techSupport.enabled)
  }),
  meetingTools: t.router({
    listConfigured: t.procedure
      .input(z.void())
      .query(() => mockData.tools.meetingTools.configuredModels)
  }),
  documentIntelligence: t.router({
    isEnabled: t.procedure
      .input(z.void())
      .query(() => mockData.tools.documentIntelligence.enabled)
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
  setRagMode: t.procedure
    .input(z.object({
      chatId: z.string(),
      ragMode: z.enum(["OFF", "AUTO", "CUSTOM"]),
      customSourceId: z.string().optional(),
    }))
    .mutation(() => true),
  getAll: t.procedure
    .input(z.object({
      limit: z.number().min(1).max(100),
      cursor: z.string().optional(),
    }))
    .output(ChatInfiniteQueryResultSchema)
    .query(({ input }) => ({
      items: [
        {
          id: "chat-1",
          name: "Sample Chat",
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          organizationId: "org-123"
        }
      ] as ChatListItem[],
      nextCursor: undefined
    }))
});

// Department Router
const departmentRouter = t.router({
  personal: t.router({
    get: t.procedure
      .input(z.void())
      .query(() => ({ id: "Personal department data" }))
  })
});

export const appRouter = t.router({
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

    department: departmentRouter
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
  }),

  trial: t.router({
    check: t.procedure.query(() => ({ 
      status: "ok",
      trialEnd: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000) // 2 months from now
    }))
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
  // Add other routers he
});




export type AppRouter = typeof appRouter;