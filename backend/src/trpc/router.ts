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
  {
    id: 'chat3',
    title: 'Project Planning Discussion',
    createdAt: new Date(Date.now() - 86400000).toISOString(),
    organizationId: 'org1',
    userId: 'user1',
  },
];

const mockWorkflows = [
  {
    id: 'workflow1',
    name: 'Email Generator',
    description: 'Generate professional emails',
    steps: [
      {
        id: 'step1',
        type: 'input',
        title: 'Email Topic',
        config: { inputType: 'text', placeholder: 'Enter email topic...' }
      },
      {
        id: 'step2',
        type: 'ai-chat',
        title: 'Generate Email',
        config: { model: 'gpt-4o', prompt: 'Write a professional email about: {step1}' }
      }
    ],
    inputs: [],
    index: 0,
    departmentId: 'dept1',
    includedDocuments: [],
    modelOverride: null,
    allowDocumentUpload: false,
  },
  {
    id: 'workflow2',
    name: 'Content Creation Pipeline',
    description: 'Automated blog post creation',
    steps: [
      {
        id: 'step1',
        type: 'input',
        title: 'Topic Input',
        config: { inputType: 'text', placeholder: 'Enter blog topic...' }
      },
      {
        id: 'step2',
        type: 'research',
        title: 'Research Topic',
        config: { sources: ['web', 'academic'] }
      },
      {
        id: 'step3',
        type: 'ai-chat',
        title: 'Write Article',
        config: { model: 'gpt-4o', prompt: 'Write a comprehensive blog post about {step1} using research: {step2}' }
      }
    ],
    inputs: [],
    index: 1,
    departmentId: 'dept1',
    includedDocuments: [],
    modelOverride: null,
    allowDocumentUpload: false,
  },
  {
    id: 'workflow3',
    name: 'Image + Description Generator',
    description: 'Generate images with descriptions',
    steps: [
      {
        id: 'step1',
        type: 'input',
        title: 'Image Concept',
        config: { inputType: 'text', placeholder: 'Describe the image...' }
      },
      {
        id: 'step2',
        type: 'image-gen',
        title: 'Generate Image',
        config: { style: 'realistic', size: '1024x1024' }
      },
      {
        id: 'step3',
        type: 'ai-chat',
        title: 'Write Description',
        config: { model: 'gpt-4o', prompt: 'Write a compelling description for an image of: {step1}' }
      }
    ],
    inputs: [],
    index: 2,
    departmentId: 'dept1',
    includedDocuments: [],
    modelOverride: null,
    allowDocumentUpload: false,
  }
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

const mockEnabledModels = ['gpt-4o', 'gpt-4o-mini', 'claude-3-5-sonnet', 'gemini-pro', 'perplexity'];

const mockCourses = [
  {
    id: 'course1',
    title: 'Introduction to AI Prompting',
    description: 'Learn the fundamentals of effective AI prompt engineering',
    category: 'AI Basics',
    difficulty: 'beginner',
    duration: 45,
    lessons: 8,
    instructor: 'Dr. Sarah Chen',
    rating: 4.8,
    enrolled: 156
  },
  {
    id: 'course2',
    title: 'Advanced Workflow Automation',
    description: 'Master complex workflow automation techniques',
    category: 'Workflows',
    difficulty: 'advanced',
    duration: 120,
    lessons: 15,
    instructor: 'Michael Rodriguez',
    rating: 4.9,
    enrolled: 89
  }
];

const mockLessons = [
  {
    id: 'lesson1',
    courseId: 'course1',
    title: 'What is AI Prompting?',
    description: 'Introduction to prompt engineering concepts',
    duration: 8,
    order: 1,
    type: 'video',
    completed: false
  },
  {
    id: 'lesson2',
    courseId: 'course1',
    title: 'Basic Prompt Structures',
    description: 'Learn how to structure effective prompts',
    duration: 12,
    order: 2,
    type: 'interactive',
    completed: false
  }
];

const mockTasks = [
  {
    id: 'task1',
    title: 'Review quarterly budget report',
    description: 'Go through Q4 financial data and prepare summary',
    priority: 'high',
    dueDate: new Date(2024, 1, 20).toISOString(),
    completed: false,
    category: 'work',
    userId: 'user1'
  },
  {
    id: 'task2',
    title: 'Schedule team meeting',
    description: 'Coordinate with team for project kickoff meeting',
    priority: 'medium',
    dueDate: new Date(2024, 1, 18).toISOString(),
    completed: true,
    category: 'meeting',
    userId: 'user1'
  }
];

const mockMeetings = [
  {
    id: 'meeting1',
    title: 'Product Planning Meeting',
    duration: 3600,
    participants: 5,
    date: new Date(2024, 1, 15).toISOString(),
    status: 'completed',
    transcription: 'This is a mock transcription of the product planning meeting...',
    summary: 'Product planning session focused on Q2 2024 roadmap.',
    actionItems: ['Finalize AI model selection', 'Create wireframes', 'Schedule user interviews']
  },
  {
    id: 'meeting2',
    title: 'Weekly Standup',
    duration: 1800,
    participants: 8,
    date: new Date(2024, 1, 12).toISOString(),
    status: 'completed',
    transcription: 'Team standup meeting covering progress updates...',
    summary: 'Weekly progress update. All teams on track.',
    actionItems: ['Deploy staging updates', 'Review security changes']
  }
];

const mockResearchSessions = [
  {
    id: 'research1',
    query: 'artificial intelligence in healthcare',
    summary: 'AI is transforming healthcare through diagnostic tools and personalized treatments.',
    keyPoints: [
      'Machine learning improves diagnostic accuracy by 15-30%',
      'AI-powered drug discovery reduces development time',
      'Predictive analytics helps prevent readmissions'
    ],
    sources: ['Nature Medicine', 'Healthcare AI Journal'],
    createdAt: new Date(2024, 1, 15).toISOString()
  }
];

const mockTranslations = [
  {
    id: 'trans1',
    sourceText: 'Bonjour, comment allez-vous?',
    targetText: 'Hello, how are you?',
    sourceLang: 'fr',
    targetLang: 'en',
    confidence: 98,
    createdAt: new Date(2024, 1, 16).toISOString(),
    type: 'text'
  }
];

const mockSupportTickets = [
  {
    id: 'ticket1',
    title: 'Unable to connect to VPN',
    description: 'Getting connection timeout error when trying to connect to company VPN',
    category: 'network',
    priority: 'medium',
    status: 'resolved',
    createdAt: new Date(2024, 1, 15).toISOString(),
    updatedAt: new Date(2024, 1, 16).toISOString(),
    solution: 'Updated VPN client to latest version and configured new server settings.'
  }
];

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
      generate: publicProcedure
        .input(z.object({ 
          prompt: z.string(), 
          style: z.string().optional(), 
          size: z.string().optional() 
        }))
        .mutation(async ({ input }) => {
          // Mock image generation
          await new Promise(resolve => setTimeout(resolve, 2000));
          return {
            id: Date.now().toString(),
            url: `https://picsum.photos/1024/1024?random=${Date.now()}`,
            prompt: input.prompt,
            style: input.style || 'realistic',
            createdAt: new Date().toISOString()
          };
        }),
    }),
    translateContent: router({
      textTranslator: router({
        isEnabled: publicProcedure.query(() => true),
        translate: publicProcedure
          .input(z.object({
            text: z.string(),
            sourceLang: z.string(),
            targetLang: z.string()
          }))
          .mutation(async ({ input }) => {
            // Mock translation
            await new Promise(resolve => setTimeout(resolve, 1000));
            const translation = {
              id: Date.now().toString(),
              sourceText: input.text,
              targetText: `[Translated from ${input.sourceLang} to ${input.targetLang}]: ${input.text}`,
              sourceLang: input.sourceLang,
              targetLang: input.targetLang,
              confidence: Math.floor(Math.random() * 10) + 90,
              createdAt: new Date().toISOString(),
              type: 'text' as const
            };
            mockTranslations.unshift(translation);
            return translation;
          }),
        getHistory: publicProcedure.query(() => mockTranslations),
      }),
      documentTranslator: router({
        isEnabled: publicProcedure.query(() => true),
      }),
    }),
    techSupport: router({
      isEnabled: publicProcedure.query(() => true),
             createTicket: publicProcedure
         .input(z.object({
           title: z.string(),
           description: z.string(),
           category: z.string(),
           priority: z.string().optional()
         }))
         .mutation(({ input }) => {
           const ticket = {
             id: Date.now().toString(),
             title: input.title,
             description: input.description,
             category: input.category,
             priority: input.priority || 'medium',
             status: 'open' as const,
             createdAt: new Date().toISOString(),
             updatedAt: new Date().toISOString(),
             solution: '' // Add empty solution field
           };
           mockSupportTickets.unshift(ticket);
           return ticket;
         }),
      getTickets: publicProcedure.query(() => mockSupportTickets),
      updateTicket: publicProcedure
        .input(z.object({
          ticketId: z.string(),
          status: z.string().optional(),
          solution: z.string().optional()
        }))
        .mutation(({ input }) => {
          const ticketIndex = mockSupportTickets.findIndex(t => t.id === input.ticketId);
                     if (ticketIndex >= 0) {
             mockSupportTickets[ticketIndex] = {
               ...mockSupportTickets[ticketIndex],
               status: input.status || mockSupportTickets[ticketIndex].status,
               solution: input.solution || mockSupportTickets[ticketIndex].solution,
               updatedAt: new Date().toISOString()
             };
             return mockSupportTickets[ticketIndex];
           }
          return null;
        }),
    }),
    research: router({
      search: publicProcedure
        .input(z.object({
          query: z.string(),
          sources: z.string().array().optional()
        }))
        .mutation(async ({ input }) => {
          // Mock research delay
          await new Promise(resolve => setTimeout(resolve, 2000));
          const session = {
            id: Date.now().toString(),
            query: input.query,
            summary: `Research summary for "${input.query}": Based on analysis of multiple sources, significant developments identified.`,
            keyPoints: [
              'Key finding 1 from research analysis',
              'Important trend identified across sources',
              'Notable development with implications',
              'Future outlook based on current data'
            ],
            sources: ['Academic Source 1', 'Industry Report', 'News Article'],
            results: [
              {
                id: '1',
                title: `Research Results for ${input.query}`,
                url: 'https://example.com/research1',
                snippet: 'Comprehensive analysis showing key developments in the field...',
                source: 'Academic Journal',
                relevanceScore: 95,
                type: 'academic' as const
              }
            ],
            createdAt: new Date().toISOString()
          };
          mockResearchSessions.unshift(session);
          return session;
        }),
      getHistory: publicProcedure.query(() => mockResearchSessions),
    }),
    meeting: router({
      getMeetings: publicProcedure.query(() => mockMeetings),
      getMeeting: publicProcedure
        .input(z.object({ meetingId: z.string() }))
        .query(({ input }) => {
          return mockMeetings.find(m => m.id === input.meetingId) || null;
        }),
             startRecording: publicProcedure
         .input(z.object({ title: z.string().optional() }))
         .mutation(({ input }) => {
           const meeting = {
             id: Date.now().toString(),
             title: input.title || `Meeting ${new Date().toLocaleDateString()}`,
             duration: 0,
             participants: Math.floor(Math.random() * 8) + 1,
             date: new Date().toISOString(),
             status: 'recording' as const,
             transcription: '',
             summary: '',
             actionItems: []
           };
           mockMeetings.unshift(meeting);
           return meeting;
         }),
      stopRecording: publicProcedure
        .input(z.object({ meetingId: z.string(), duration: z.number() }))
        .mutation(async ({ input }) => {
          // Mock processing delay
          await new Promise(resolve => setTimeout(resolve, 3000));
          const meetingIndex = mockMeetings.findIndex(m => m.id === input.meetingId);
          if (meetingIndex >= 0) {
            mockMeetings[meetingIndex] = {
              ...mockMeetings[meetingIndex],
              duration: input.duration,
              status: 'completed' as const,
              transcription: 'This is a mock transcription of your recorded meeting...',
              summary: 'Meeting summary: Key discussion points and next steps.',
              actionItems: ['Follow up on discussed items', 'Schedule next meeting']
            };
            return mockMeetings[meetingIndex];
          }
          return null;
        }),
    }),
    personalAssistant: router({
      isEnabled: publicProcedure.query(() => true),
      getTasks: publicProcedure.query(() => mockTasks),
      createTask: publicProcedure
        .input(z.object({
          title: z.string(),
          description: z.string().optional(),
          priority: z.string().optional(),
          dueDate: z.string().optional()
        }))
        .mutation(({ input }) => {
          const task = {
            id: Date.now().toString(),
            title: input.title,
            description: input.description || '',
            priority: input.priority || 'medium',
            dueDate: input.dueDate || new Date(Date.now() + 86400000).toISOString(),
            completed: false,
            category: 'work' as const,
            userId: 'user1'
          };
          mockTasks.unshift(task);
          return task;
        }),
      updateTask: publicProcedure
        .input(z.object({
          taskId: z.string(),
          completed: z.boolean().optional(),
          title: z.string().optional(),
          description: z.string().optional()
        }))
        .mutation(({ input }) => {
          const taskIndex = mockTasks.findIndex(t => t.id === input.taskId);
          if (taskIndex >= 0) {
            mockTasks[taskIndex] = {
              ...mockTasks[taskIndex],
              ...input
            };
            return mockTasks[taskIndex];
          }
          return null;
        }),
      generateEmail: publicProcedure
        .input(z.object({
          subject: z.string(),
          recipient: z.string(),
          context: z.string(),
          tone: z.string().optional()
        }))
        .mutation(async ({ input }) => {
          // Mock email generation delay
          await new Promise(resolve => setTimeout(resolve, 1000));
          return {
            id: Date.now().toString(),
            subject: input.subject,
            recipient: input.recipient,
            content: `Dear ${input.recipient.split('@')[0]},\n\n${input.context}\n\nBest regards,\n[Your name]`,
            tone: input.tone || 'formal',
            createdAt: new Date().toISOString()
          };
        }),
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

  // Academy endpoints
  academy: router({
    gamification: router({
      xp: publicProcedure.query(() => ({
        xp: 350,
        currentLevel: 3,
        currentLevelProgress: 75,
        xpNeededForNextLevel: 150,
      })),
    }),
    courses: router({
      getAll: publicProcedure.query(() => mockCourses),
      getCourse: publicProcedure
        .input(z.object({ courseId: z.string() }))
        .query(({ input }) => {
          return mockCourses.find(c => c.id === input.courseId) || null;
        }),
      enroll: publicProcedure
        .input(z.object({ courseId: z.string() }))
        .mutation(({ input }) => {
          // Mock enrollment
          return {
            success: true,
            enrolledAt: new Date().toISOString(),
            courseId: input.courseId
          };
        }),
      getProgress: publicProcedure
        .input(z.object({ courseId: z.string() }))
        .query(({ input }) => {
          // Mock progress data
          return {
            courseId: input.courseId,
            completedLessons: 3,
            totalLessons: 8,
            progress: 37.5,
            lastAccessed: new Date().toISOString()
          };
        }),
    }),
    lessons: router({
      getByCourse: publicProcedure
        .input(z.object({ courseId: z.string() }))
        .query(({ input }) => {
          return mockLessons.filter(l => l.courseId === input.courseId);
        }),
      getLesson: publicProcedure
        .input(z.object({ lessonId: z.string() }))
        .query(({ input }) => {
          return mockLessons.find(l => l.id === input.lessonId) || null;
        }),
      markComplete: publicProcedure
        .input(z.object({ lessonId: z.string() }))
        .mutation(({ input }) => {
          const lessonIndex = mockLessons.findIndex(l => l.id === input.lessonId);
          if (lessonIndex >= 0) {
            mockLessons[lessonIndex].completed = true;
            return { success: true, xpEarned: 25 };
          }
          return { success: false, xpEarned: 0 };
        }),
    }),
    achievements: router({
      getAll: publicProcedure.query(() => [
        {
          id: '1',
          title: 'First Steps',
          description: 'Complete your first lesson',
          icon: '🎯',
          earned: true,
          earnedAt: new Date(2024, 1, 10).toISOString()
        },
        {
          id: '2',
          title: 'Course Completion',
          description: 'Complete your first course',
          icon: '🏆',
          earned: true,
          earnedAt: new Date(2024, 1, 15).toISOString()
        },
        {
          id: '3',
          title: 'Speed Learner',
          description: 'Complete 5 lessons in one day',
          icon: '⚡',
          earned: false,
          progress: 3,
          requirement: 5
        },
        {
          id: '4',
          title: 'Knowledge Seeker',
          description: 'Enroll in 5 different courses',
          icon: '📚',
          earned: false,
          progress: 3,
          requirement: 5
        }
      ]),
    }),
  }),

  // Analytics endpoints
  analytics: router({
    usage: router({
      getOverview: publicProcedure.query(() => ({
        totalChats: 24,
        totalWorkflows: 3,
        totalImages: 12,
        totalTranslations: 8,
        thisWeek: {
          chats: 8,
          workflows: 1,
          images: 4,
          translations: 3
        }
      })),
      getModelUsage: publicProcedure.query(() => [
        { model: 'gpt-4o', usage: 156, percentage: 45 },
        { model: 'claude-3-5-sonnet', usage: 89, percentage: 26 },
        { model: 'gpt-4o-mini', usage: 67, percentage: 19 },
        { model: 'gemini-pro', usage: 34, percentage: 10 }
      ]),
    }),
    organization: router({
      getTeamActivity: publicProcedure.query(() => [
        { userId: 'user1', name: 'Demo User', activity: 89, lastActive: new Date().toISOString() },
        { userId: 'user2', name: 'Team Member 1', activity: 67, lastActive: new Date(Date.now() - 3600000).toISOString() },
        { userId: 'user3', name: 'Team Member 2', activity: 45, lastActive: new Date(Date.now() - 7200000).toISOString() }
      ]),
    }),
  }),
});

export type AppRouter = typeof appRouter; 