import React, { useState } from 'react';
import { 
  MagnifyingGlassIcon, 
  DocumentTextIcon, 
  LinkIcon,
  BookmarkIcon,
  ShareIcon,
  ClockIcon,
  GlobeAltIcon,
  AcademicCapIcon
} from '@heroicons/react/24/outline';
import { motion } from 'framer-motion';

interface ResearchResult {
  id: string;
  title: string;
  url: string;
  snippet: string;
  source: string;
  relevanceScore: number;
  type: 'web' | 'academic' | 'news' | 'document';
  timestamp: Date;
}

interface ResearchSession {
  id: string;
  query: string;
  results: ResearchResult[];
  summary: string;
  keyPoints: string[];
  sources: string[];
  createdAt: Date;
}

const ResearchAssistantPage: React.FC = () => {
  const [query, setQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [selectedTypes, setSelectedTypes] = useState<string[]>(['web', 'academic', 'news']);
  const [currentSession, setCurrentSession] = useState<ResearchSession | null>(null);
  const [savedSessions, setSavedSessions] = useState<ResearchSession[]>([
    {
      id: '1',
      query: 'artificial intelligence in healthcare',
      results: [],
      summary: 'AI is transforming healthcare through diagnostic tools, personalized treatments, and operational efficiency improvements.',
      keyPoints: [
        'Machine learning improves diagnostic accuracy by 15-30%',
        'AI-powered drug discovery reduces development time by 2-3 years',
        'Predictive analytics helps prevent hospital readmissions',
        'Natural language processing streamlines medical documentation'
      ],
      sources: ['Nature Medicine', 'Healthcare AI Journal', 'Medical News Today'],
      createdAt: new Date(2024, 0, 15)
    },
    {
      id: '2',
      query: 'sustainable energy solutions 2024',
      results: [],
      summary: 'Latest developments in renewable energy focus on storage solutions, grid integration, and cost reduction.',
      keyPoints: [
        'Battery storage costs decreased 70% since 2020',
        'Solar efficiency reached record 26% in commercial panels',
        'Green hydrogen production scaling globally',
        'Smart grid technology enables better energy distribution'
      ],
      sources: ['Nature Energy', 'Renewable Energy World', 'IEA Reports'],
      createdAt: new Date(2024, 0, 12)
    }
  ]);

  const mockResults: ResearchResult[] = [
    {
      id: '1',
      title: 'The Future of Artificial Intelligence in Business Applications',
      url: 'https://example.com/ai-business',
      snippet: 'Artificial intelligence is revolutionizing business operations across industries. From automated customer service to predictive analytics, AI technologies are providing unprecedented opportunities for efficiency and growth.',
      source: 'Business Tech Review',
      relevanceScore: 95,
      type: 'web',
      timestamp: new Date()
    },
    {
      id: '2',
      title: 'Machine Learning Algorithms for Enterprise Solutions',
      url: 'https://academic.example.com/ml-enterprise',
      snippet: 'This research paper examines the implementation of machine learning algorithms in enterprise environments, focusing on scalability, security, and performance optimization.',
      source: 'Journal of Computer Science',
      relevanceScore: 88,
      type: 'academic',
      timestamp: new Date()
    },
    {
      id: '3',
      title: 'Latest AI Breakthrough: New Neural Network Architecture',
      url: 'https://news.example.com/ai-breakthrough',
      snippet: 'Researchers have developed a new neural network architecture that shows 40% improvement in processing efficiency while maintaining accuracy levels.',
      source: 'Tech News Daily',
      relevanceScore: 82,
      type: 'news',
      timestamp: new Date()
    }
  ];

  const searchTypes = [
    { id: 'web', name: 'Web Search', icon: GlobeAltIcon, description: 'General web content' },
    { id: 'academic', name: 'Academic', icon: AcademicCapIcon, description: 'Research papers & journals' },
    { id: 'news', name: 'News', icon: DocumentTextIcon, description: 'Latest news articles' },
    { id: 'document', name: 'Documents', icon: DocumentTextIcon, description: 'Internal documents' }
  ];

  const handleSearch = async () => {
    if (!query.trim()) return;

    setIsSearching(true);
    
    // Mock search delay
    setTimeout(() => {
      const newSession: ResearchSession = {
        id: Date.now().toString(),
        query,
        results: mockResults.filter(result => selectedTypes.includes(result.type)),
        summary: `Research summary for "${query}": Based on the analysis of ${mockResults.length} sources, the current trends and developments show significant progress in the field.`,
        keyPoints: [
          'Key finding 1 from the research analysis',
          'Important trend identified across multiple sources',
          'Notable development with industry implications',
          'Future outlook based on current data'
        ],
        sources: mockResults.map(r => r.source),
        createdAt: new Date()
      };
      
      setCurrentSession(newSession);
      setSavedSessions(prev => [newSession, ...prev]);
      setIsSearching(false);
    }, 2000);
  };

  const toggleSearchType = (type: string) => {
    setSelectedTypes(prev => 
      prev.includes(type) 
        ? prev.filter(t => t !== type)
        : [...prev, type]
    );
  };

  const getTypeIcon = (type: string) => {
    const searchType = searchTypes.find(t => t.id === type);
    return searchType?.icon || DocumentTextIcon;
  };

  const getTypeColor = (type: string) => {
    const colors = {
      web: 'text-blue-600',
      academic: 'text-purple-600',
      news: 'text-green-600',
      document: 'text-orange-600'
    };
    return colors[type as keyof typeof colors] || 'text-gray-600';
  };

  return (
    <div className="h-full bg-gray-50 p-6 overflow-auto">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <MagnifyingGlassIcon className="w-8 h-8 text-blue-600" />
            <h1 className="text-3xl font-bold text-gray-900">Research Assistant</h1>
          </div>
          <p className="text-gray-600">AI-powered research with web search, academic papers, and document analysis</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Search Panel */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <MagnifyingGlassIcon className="w-5 h-5 text-blue-600" />
                New Research
              </h2>

              {/* Search Input */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Research Topic
                </label>
                <textarea
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="What would you like to research? e.g., 'latest developments in renewable energy'"
                  className="w-full h-20 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                />
              </div>

              {/* Search Types */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Search Sources
                </label>
                <div className="space-y-2">
                  {searchTypes.map((type) => (
                    <label key={type.id} className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={selectedTypes.includes(type.id)}
                        onChange={() => toggleSearchType(type.id)}
                        className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                      />
                      <type.icon className="w-4 h-4 text-gray-500" />
                      <span className="text-sm text-gray-700">{type.name}</span>
                      <span className="text-xs text-gray-500">({type.description})</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Search Button */}
              <button
                onClick={handleSearch}
                disabled={!query.trim() || isSearching}
                className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isSearching ? (
                  <>
                    <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full" />
                    Researching...
                  </>
                ) : (
                  <>
                    <MagnifyingGlassIcon className="w-4 h-4" />
                    Start Research
                  </>
                )}
              </button>
            </div>

            {/* Recent Searches */}
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <ClockIcon className="w-5 h-5 text-gray-600" />
                Recent Research
              </h3>
              
              <div className="space-y-3">
                {savedSessions.slice(0, 5).map((session) => (
                  <button
                    key={session.id}
                    onClick={() => setCurrentSession(session)}
                    className="w-full text-left p-3 border border-gray-200 rounded-lg hover:border-gray-300 hover:bg-gray-50 transition-colors"
                  >
                    <div className="font-medium text-sm text-gray-900 truncate">{session.query}</div>
                    <div className="text-xs text-gray-500 mt-1">{session.createdAt.toLocaleDateString()}</div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Results Panel */}
          <div className="lg:col-span-2 space-y-6">
            {currentSession ? (
              <>
                {/* Research Summary */}
                <div className="bg-white rounded-lg shadow-sm border p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-semibold flex items-center gap-2">
                      <DocumentTextIcon className="w-5 h-5 text-blue-600" />
                      Research Summary
                    </h2>
                    <div className="flex gap-2">
                      <button className="text-gray-500 hover:text-gray-700">
                        <BookmarkIcon className="w-5 h-5" />
                      </button>
                      <button className="text-gray-500 hover:text-gray-700">
                        <ShareIcon className="w-5 h-5" />
                      </button>
                    </div>
                  </div>

                  <div className="mb-4">
                    <h3 className="text-sm font-medium text-gray-900 mb-2">Query: "{currentSession.query}"</h3>
                    <p className="text-gray-700 bg-blue-50 p-3 rounded-lg">{currentSession.summary}</p>
                  </div>

                  {/* Key Points */}
                  <div className="mb-4">
                    <h3 className="font-medium text-gray-900 mb-2">Key Findings</h3>
                    <ul className="space-y-2">
                      {currentSession.keyPoints.map((point, index) => (
                        <li key={index} className="flex items-start gap-2">
                          <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0" />
                          <span className="text-gray-700 text-sm">{point}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Sources */}
                  <div>
                    <h3 className="font-medium text-gray-900 mb-2">Sources ({currentSession.sources.length})</h3>
                    <div className="flex flex-wrap gap-2">
                      {currentSession.sources.map((source, index) => (
                        <span key={index} className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs">
                          {source}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Detailed Results */}
                <div className="bg-white rounded-lg shadow-sm border p-6">
                  <h2 className="text-lg font-semibold mb-4">Detailed Results ({currentSession.results.length})</h2>
                  
                  <div className="space-y-4">
                    {currentSession.results.map((result) => {
                      const TypeIcon = getTypeIcon(result.type);
                      return (
                        <motion.div
                          key={result.id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="border border-gray-200 rounded-lg p-4 hover:border-gray-300 transition-colors"
                        >
                          <div className="flex items-start justify-between mb-2">
                            <div className="flex items-center gap-2">
                              <TypeIcon className={`w-4 h-4 ${getTypeColor(result.type)}`} />
                              <span className="text-xs font-medium text-gray-500 uppercase">{result.type}</span>
                              <span className="text-xs text-gray-400">•</span>
                              <span className="text-xs text-gray-500">{result.source}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <div className="text-xs text-gray-500">Relevance:</div>
                              <div className="text-xs font-medium text-blue-600">{result.relevanceScore}%</div>
                            </div>
                          </div>
                          
                          <h3 className="font-medium text-gray-900 mb-2 hover:text-blue-600 cursor-pointer">
                            {result.title}
                          </h3>
                          
                          <p className="text-gray-700 text-sm mb-3">{result.snippet}</p>
                          
                          <div className="flex items-center justify-between">
                            <a 
                              href={result.url} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="flex items-center gap-1 text-sm text-blue-600 hover:text-blue-700"
                            >
                              <LinkIcon className="w-4 h-4" />
                              View Source
                            </a>
                            <div className="flex gap-2">
                              <button className="text-gray-500 hover:text-gray-700">
                                <BookmarkIcon className="w-4 h-4" />
                              </button>
                              <button className="text-gray-500 hover:text-gray-700">
                                <ShareIcon className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>
                </div>
              </>
            ) : (
              <div className="bg-white rounded-lg shadow-sm border p-12 text-center">
                <MagnifyingGlassIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">Start Your Research</h3>
                <p className="text-gray-500">Enter a topic or question to begin AI-powered research</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResearchAssistantPage; 