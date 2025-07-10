// ToolsPage.tsx
import { Link } from "react-router-dom";
import { trpc } from "../lib/api/trpc/trpc";

export default function ToolsPage() {
  const { data: enabledModels, isLoading: modelsLoading } = trpc.modelConfig.getEnabled.useQuery();
  const { data: imageModels, isLoading: imageLoading } = trpc.tools.images.listConfigured.useQuery();
  const { data: textTranslationEnabled } = trpc.tools.translateContent.textTranslator.isEnabled.useQuery();
  const { data: docTranslationEnabled } = trpc.tools.translateContent.documentTranslator.isEnabled.useQuery();
  const { data: techSupportEnabled } = trpc.tools.techSupport.isEnabled.useQuery();

  const tools = [
    {
      name: "Image Generation",
      description: "Create images from text descriptions using AI",
      icon: "🎨",
      enabled: imageModels && imageModels.length > 0,
      models: imageModels || [],
    },
    {
      name: "Research Assistant",
      description: "Get help with research and web searches",
      icon: "🔍",
      enabled: enabledModels?.includes("sonar"),
      models: ["Perplexity Sonar"],
    },
    {
      name: "Meeting Tools",
      description: "Transcribe and summarize meetings",
      icon: "🎤",
      enabled: enabledModels?.includes("gemini-1.5-pro"),
      models: ["Gemini 1.5 Pro"],
    },
    {
      name: "Tech Support",
      description: "Get technical support and troubleshooting help",
      icon: "🛠️",
      enabled: techSupportEnabled,
      models: ["GPT-4o"],
    },
    {
      name: "Text Translation",
      description: "Translate text between different languages",
      icon: "🌐",
      enabled: textTranslationEnabled,
      models: ["GPT-4o"],
    },
    {
      name: "Document Translation",
      description: "Translate entire documents",
      icon: "📄",
      enabled: docTranslationEnabled,
      models: ["GPT-4o"],
    },
  ];

  if (modelsLoading || imageLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">Loading AI tools...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <header className="mb-8">
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold text-gray-900">AI Tools</h1>
            <Link
              to="/"
              className="bg-gray-600 hover:bg-gray-700 text-white font-medium py-2 px-4 rounded-lg transition-colors"
            >
              Back to Home
            </Link>
          </div>
        </header>

        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Enabled AI Models
          </h2>
          <div className="flex flex-wrap gap-2">
            {enabledModels?.map((model) => (
              <span
                key={model}
                className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800"
              >
                {model}
              </span>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tools.map((tool) => (
            <div
              key={tool.name}
              className={`bg-white rounded-lg shadow-md p-6 ${
                tool.enabled ? 'border-green-200 border-2' : 'border-gray-200 border opacity-60'
              }`}
            >
              <div className="flex items-center mb-4">
                <div className="text-3xl mr-3">{tool.icon}</div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    {tool.name}
                  </h3>
                  <div className="flex items-center">
                    <span
                      className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                        tool.enabled
                          ? 'bg-green-100 text-green-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}
                    >
                      {tool.enabled ? 'Enabled' : 'Disabled'}
                    </span>
                  </div>
                </div>
              </div>
              
              <p className="text-gray-600 mb-4">{tool.description}</p>
              
              <div className="mb-4">
                <h4 className="text-sm font-medium text-gray-700 mb-2">Models:</h4>
                <div className="flex flex-wrap gap-1">
                  {tool.models.map((model) => (
                    <span
                      key={model}
                      className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-gray-100 text-gray-700"
                    >
                      {model}
                    </span>
                  ))}
                </div>
              </div>
              
              <button
                className={`w-full py-2 px-4 rounded-lg font-medium transition-colors ${
                  tool.enabled
                    ? 'bg-blue-600 hover:bg-blue-700 text-white'
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
                disabled={!tool.enabled}
              >
                {tool.enabled ? 'Use Tool' : 'Not Available'}
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
} 