import { Routes, Route } from 'react-router';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { trpc } from './utils/trpc';
import { httpBatchLink } from '@trpc/client';
import { Toaster } from 'react-hot-toast';

// Layout and main pages
import MeinGPTLayout from './components/layout/MeinGPTLayout';
import OrganizationDashboard from './pages/[organizationId]/index';
import MeinGPTChatInterface from './components/chat/MeinGPTChatInterface';

// Import existing sophisticated pages
import ToolsPage from './pages/ToolsPage';
import WorkflowsPage from './pages/WorkflowsPage';

// Create a stable query client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      gcTime: 10 * 60 * 1000, // 10 minutes
    },
  },
});

// Create tRPC client
const trpcClient = trpc.createClient({
  links: [
    httpBatchLink({
      url: 'http://localhost:3001/api/trpc',
    }),
  ],
});

// Tool Pages Components
const ResearchAssistantPage = () => (
  <div className="h-full bg-white p-6">
    <div className="max-w-4xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Research Assistant</h1>
        <p className="text-gray-600">AI-powered research and web search capabilities</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 className="font-semibold text-blue-900 mb-3">🔍 Academic Research</h3>
          <p className="text-blue-700 text-sm mb-4">Find scholarly articles, analyze research papers</p>
          <button className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700">
            Start Research
          </button>
        </div>
        <div className="bg-green-50 border border-green-200 rounded-lg p-6">
          <h3 className="font-semibold text-green-900 mb-3">📊 Market Analysis</h3>
          <p className="text-green-700 text-sm mb-4">Analyze trends, competitor research</p>
          <button className="w-full bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700">
            Analyze Market
          </button>
        </div>
      </div>
    </div>
  </div>
);

const ImageFactoryPage = () => (
  <div className="h-full bg-white p-6">
    <div className="max-w-4xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Image Factory</h1>
        <p className="text-gray-600">Create, edit, and enhance images with AI</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-purple-50 border border-purple-200 rounded-lg p-6 text-center">
          <div className="text-3xl mb-3">🎨</div>
          <h3 className="font-semibold text-purple-900 mb-2">Generate</h3>
          <p className="text-purple-700 text-sm mb-4">Create images from text</p>
          <button className="w-full bg-purple-600 text-white py-2 px-4 rounded-lg hover:bg-purple-700">
            Generate
          </button>
        </div>
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 text-center">
          <div className="text-3xl mb-3">✏️</div>
          <h3 className="font-semibold text-blue-900 mb-2">Edit</h3>
          <p className="text-blue-700 text-sm mb-4">Modify existing images</p>
          <button className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700">
            Edit
          </button>
        </div>
        <div className="bg-green-50 border border-green-200 rounded-lg p-6 text-center">
          <div className="text-3xl mb-3">⚡</div>
          <h3 className="font-semibold text-green-900 mb-2">Enhance</h3>
          <p className="text-green-700 text-sm mb-4">Improve quality</p>
          <button className="w-full bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700">
            Enhance
          </button>
        </div>
      </div>
    </div>
  </div>
);

const MeetingToolsPage = () => (
  <div className="h-full bg-white p-6">
    <div className="max-w-4xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Meeting Tools</h1>
        <p className="text-gray-600">Transcribe, summarize, and analyze meetings</p>
      </div>
      <div className="space-y-6">
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 className="font-semibold text-blue-900 mb-3">🎤 Live Transcription</h3>
          <p className="text-blue-700 text-sm mb-4">Real-time meeting transcription</p>
          <button className="bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700">
            Start Recording
          </button>
        </div>
        <div className="bg-green-50 border border-green-200 rounded-lg p-6">
          <h3 className="font-semibold text-green-900 mb-3">📝 Smart Summaries</h3>
          <p className="text-green-700 text-sm mb-4">AI-generated meeting summaries with action items</p>
          <button className="bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700">
            Upload Recording
          </button>
        </div>
      </div>
    </div>
  </div>
);

// Settings Pages
const OrganizationSettings = () => (
  <div className="h-full bg-white p-6">
    <div className="max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Organization Settings</h1>
      <div className="space-y-6">
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h3 className="font-semibold text-gray-900 mb-4">Organization Details</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Organization Name</label>
              <input type="text" className="w-full px-3 py-2 border border-gray-300 rounded-lg" defaultValue="Demo Organization" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Industry</label>
              <select className="w-full px-3 py-2 border border-gray-300 rounded-lg">
                <option>Technology</option>
                <option>Healthcare</option>
                <option>Finance</option>
                <option>Education</option>
              </select>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
);

const TeamSettings = () => (
  <div className="h-full bg-white p-6">
    <div className="max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Team Management</h1>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h3 className="font-semibold text-gray-900">Team Members</h3>
          <button className="bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700">
            Invite Member
          </button>
        </div>
        <div className="bg-white border border-gray-200 rounded-lg">
          <div className="p-4 border-b">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-medium">
                  DU
                </div>
                <div className="ml-3">
                  <p className="font-medium text-gray-900">Demo User</p>
                  <p className="text-sm text-gray-500">demo@deingpt.com</p>
                </div>
              </div>
              <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">Admin</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
);

// Academy Page
const AcademyPage = () => (
  <div className="h-full bg-white p-6">
    <div className="max-w-4xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">DeinGPT Academy</h1>
        <p className="text-gray-600">Learn to master AI productivity tools</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 className="font-semibold text-blue-900 mb-3">🚀 Getting Started</h3>
          <p className="text-blue-700 text-sm mb-4">Learn the basics of AI assistance</p>
          <button className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700">
            Start Course
          </button>
        </div>
        <div className="bg-green-50 border border-green-200 rounded-lg p-6">
          <h3 className="font-semibold text-green-900 mb-3">🎯 Advanced Prompting</h3>
          <p className="text-green-700 text-sm mb-4">Master prompt engineering</p>
          <button className="w-full bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700">
            Learn More
          </button>
        </div>
        <div className="bg-purple-50 border border-purple-200 rounded-lg p-6">
          <h3 className="font-semibold text-purple-900 mb-3">🏆 Certifications</h3>
          <p className="text-purple-700 text-sm mb-4">Earn AI productivity certificates</p>
          <button className="w-full bg-purple-600 text-white py-2 px-4 rounded-lg hover:bg-purple-700">
            View Certificates
          </button>
        </div>
      </div>
    </div>
  </div>
);

// Main App Component
function App() {
  return (
    <trpc.Provider client={trpcClient} queryClient={queryClient}>
      <QueryClientProvider client={queryClient}>
        <Toaster position="top-right" />
        <Routes>
          {/* Organization-based routes */}
          <Route path="/:organizationId" element={<MeinGPTLayout />}>
            {/* Dashboard */}
            <Route index element={<OrganizationDashboard />} />
            
            {/* Chat routes */}
            <Route path="chats/:chatId" element={<MeinGPTChatInterface chatId="" organizationId="" />} />
            <Route path="chats/new" element={<MeinGPTChatInterface organizationId="" />} />
            
            {/* Tools routes */}
            <Route path="tools" element={<ToolsPage />} />
            <Route path="tools/research" element={<ResearchAssistantPage />} />
            <Route path="tools/images" element={<ImageFactoryPage />} />
            <Route path="tools/meetings" element={<MeetingToolsPage />} />
            
            {/* Workflows */}
            <Route path="workflows" element={<WorkflowsPage />} />
            
            {/* Academy/Learning */}
            <Route path="academy" element={<AcademyPage />} />
            
            {/* Settings routes */}
            <Route path="settings" element={<OrganizationSettings />} />
            <Route path="settings/team" element={<TeamSettings />} />
            <Route path="settings/models" element={<div className="p-6 bg-white h-full"><h1 className="text-2xl font-bold">Model Settings</h1><p>Configure AI models and preferences</p></div>} />
            <Route path="settings/billing" element={<div className="p-6 bg-white h-full"><h1 className="text-2xl font-bold">Billing & Usage</h1><p>Manage subscription and usage</p></div>} />
          </Route>
          
          {/* Authentication routes */}
          <Route path="/auth/login" element={
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
              <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8">
                <h1 className="text-2xl font-bold text-center mb-6">Sign in to DeinGPT</h1>
                <div className="space-y-4">
                  <input type="email" placeholder="Email" className="w-full px-3 py-2 border border-gray-300 rounded-lg" />
                  <input type="password" placeholder="Password" className="w-full px-3 py-2 border border-gray-300 rounded-lg" />
                  <button className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700">Sign In</button>
                </div>
              </div>
            </div>
          } />
          
          {/* Landing page */}
          <Route path="/" element={
            <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
              <div className="text-center max-w-4xl mx-auto px-6">
                <h1 className="text-5xl font-bold text-gray-900 mb-6">Welcome to DeinGPT</h1>
                <p className="text-xl text-gray-600 mb-8">Your AI-powered productivity platform for teams</p>
                <div className="space-x-4">
                  <a href="/demo" className="bg-blue-600 text-white py-3 px-8 rounded-lg hover:bg-blue-700 inline-block">
                    Try Demo
                  </a>
                  <a href="/auth/login" className="bg-white text-blue-600 border border-blue-600 py-3 px-8 rounded-lg hover:bg-blue-50 inline-block">
                    Sign In
                  </a>
                </div>
              </div>
            </div>
          } />
        </Routes>
      </QueryClientProvider>
    </trpc.Provider>
  );
}

export default App; 