import React, { useState } from 'react';
import { trpc } from '../../../utils/trpc';
import { 
  WrenchScrewdriverIcon, 
  ExclamationTriangleIcon, 
  CheckCircleIcon,
  ComputerDesktopIcon,
  DevicePhoneMobileIcon,
  GlobeAltIcon,
  ClockIcon,
  ChatBubbleLeftRightIcon
} from '@heroicons/react/24/outline';
import { motion } from 'framer-motion';

interface SupportTicket {
  id: string;
  title: string;
  description: string;
  category: 'hardware' | 'software' | 'network' | 'security' | 'general';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  status: 'open' | 'in-progress' | 'resolved' | 'closed';
  createdAt: Date;
  updatedAt: Date;
  solution?: string;
}

interface DiagnosticResult {
  id: string;
  name: string;
  status: 'pass' | 'fail' | 'warning';
  details: string;
  recommendation?: string;
}

const TechSupportPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'new-ticket' | 'tickets' | 'diagnostics' | 'kb'>('new-ticket');
  const [issueDescription, setIssueDescription] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('general');
  const [isRunningDiagnostics, setIsRunningDiagnostics] = useState(false);
  
  const [tickets, setTickets] = useState<SupportTicket[]>([
    {
      id: '1',
      title: 'Unable to connect to VPN',
      description: 'Getting connection timeout error when trying to connect to company VPN from home network.',
      category: 'network',
      priority: 'medium',
      status: 'resolved',
      createdAt: new Date(2024, 1, 15),
      updatedAt: new Date(2024, 1, 16),
      solution: 'Updated VPN client to latest version and configured new server settings. Connection now working properly.'
    },
    {
      id: '2',
      title: 'Laptop running slowly',
      description: 'Computer has been very slow lately, taking long time to start up and open applications.',
      category: 'hardware',
      priority: 'medium',
      status: 'in-progress',
      createdAt: new Date(2024, 1, 14),
      updatedAt: new Date(2024, 1, 17)
    },
    {
      id: '3',
      title: 'Email sync issues',
      description: 'Emails not syncing properly across devices. Some emails missing on mobile.',
      category: 'software',
      priority: 'low',
      status: 'open',
      createdAt: new Date(2024, 1, 16),
      updatedAt: new Date(2024, 1, 16)
    }
  ]);

  const [diagnosticResults, setDiagnosticResults] = useState<DiagnosticResult[]>([
    {
      id: '1',
      name: 'Internet Connection',
      status: 'pass',
      details: 'Connection speed: 150 Mbps down, 25 Mbps up',
    },
    {
      id: '2',
      name: 'DNS Resolution',
      status: 'pass',
      details: 'All DNS queries resolving correctly',
    },
    {
      id: '3',
      name: 'System Memory',
      status: 'warning',
      details: 'Memory usage at 85% (13.6 GB / 16 GB)',
      recommendation: 'Consider closing unused applications or upgrading RAM'
    },
    {
      id: '4',
      name: 'Disk Space',
      status: 'pass',
      details: 'Available space: 245 GB / 512 GB (48% used)',
    },
    {
      id: '5',
      name: 'System Updates',
      status: 'fail',
      details: '3 critical security updates pending',
      recommendation: 'Install pending updates immediately for security'
    }
  ]);

  const { data: techSupportEnabled } = trpc.tools.techSupport.isEnabled.useQuery();

  const categories = [
    { id: 'hardware', name: 'Hardware', icon: ComputerDesktopIcon, description: 'Computer, devices, peripherals' },
    { id: 'software', name: 'Software', icon: DevicePhoneMobileIcon, description: 'Applications, operating system' },
    { id: 'network', name: 'Network', icon: GlobeAltIcon, description: 'Internet, WiFi, connectivity' },
    { id: 'security', name: 'Security', icon: ExclamationTriangleIcon, description: 'Passwords, malware, privacy' },
    { id: 'general', name: 'General', icon: ChatBubbleLeftRightIcon, description: 'Other technical issues' }
  ];

  const createTicket = async () => {
    if (!issueDescription.trim()) return;

    const newTicket: SupportTicket = {
      id: Date.now().toString(),
      title: issueDescription.substring(0, 50) + (issueDescription.length > 50 ? '...' : ''),
      description: issueDescription,
      category: selectedCategory as any,
      priority: 'medium',
      status: 'open',
      createdAt: new Date(),
      updatedAt: new Date()
    };

    setTickets(prev => [newTicket, ...prev]);
    setIssueDescription('');
    
    // Mock AI analysis
    setTimeout(() => {
      setTickets(prev => prev.map(ticket => 
        ticket.id === newTicket.id 
          ? { 
              ...ticket, 
              status: 'in-progress' as const,
              solution: 'AI is analyzing your issue and will provide a solution soon...'
            }
          : ticket
      ));
    }, 2000);
  };

  const runDiagnostics = async () => {
    setIsRunningDiagnostics(true);
    
    // Mock diagnostic delay
    setTimeout(() => {
      setIsRunningDiagnostics(false);
      // Refresh diagnostic results with new timestamp
      setDiagnosticResults(prev => prev.map(result => ({
        ...result,
        // Randomly change some statuses for demo
        status: Math.random() > 0.8 ? 
          (result.status === 'pass' ? 'warning' : 'pass') : 
          result.status
      })));
    }, 3000);
  };

  const getStatusColor = (status: string) => {
    const colors = {
      open: 'text-blue-600 bg-blue-100',
      'in-progress': 'text-yellow-600 bg-yellow-100',
      resolved: 'text-green-600 bg-green-100',
      closed: 'text-gray-600 bg-gray-100'
    };
    return colors[status as keyof typeof colors] || 'text-gray-600 bg-gray-100';
  };

  const getPriorityColor = (priority: string) => {
    const colors = {
      low: 'text-green-600 bg-green-100',
      medium: 'text-yellow-600 bg-yellow-100',
      high: 'text-orange-600 bg-orange-100',
      urgent: 'text-red-600 bg-red-100'
    };
    return colors[priority as keyof typeof colors] || 'text-gray-600 bg-gray-100';
  };

  const getDiagnosticColor = (status: string) => {
    const colors = {
      pass: 'text-green-600',
      warning: 'text-yellow-600',
      fail: 'text-red-600'
    };
    return colors[status as keyof typeof colors] || 'text-gray-600';
  };

  const tabs = [
    { id: 'new-ticket', name: 'New Ticket', icon: ExclamationTriangleIcon },
    { id: 'tickets', name: 'My Tickets', icon: ClockIcon },
    { id: 'diagnostics', name: 'System Check', icon: WrenchScrewdriverIcon },
    { id: 'kb', name: 'Knowledge Base', icon: ChatBubbleLeftRightIcon }
  ];

  const knowledgeBaseArticles = [
    {
      id: '1',
      title: 'How to fix slow computer performance',
      category: 'Hardware',
      views: 1250,
      helpfulVotes: 89
    },
    {
      id: '2',
      title: 'Troubleshooting VPN connection issues',
      category: 'Network',
      views: 892,
      helpfulVotes: 76
    },
    {
      id: '3',
      title: 'Setting up two-factor authentication',
      category: 'Security',
      views: 654,
      helpfulVotes: 92
    },
    {
      id: '4',
      title: 'Email configuration for mobile devices',
      category: 'Software',
      views: 543,
      helpfulVotes: 68
    }
  ];

  return (
    <div className="h-full bg-gray-50 p-6 overflow-auto">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <WrenchScrewdriverIcon className="w-8 h-8 text-orange-600" />
            <h1 className="text-3xl font-bold text-gray-900">Tech Support</h1>
          </div>
          <p className="text-gray-600">AI-powered technical support and system diagnostics</p>
          <div className="mt-2 flex items-center gap-2 text-sm text-gray-500">
            <span className={`w-2 h-2 rounded-full ${techSupportEnabled ? 'bg-green-500' : 'bg-red-500'}`} />
            Tech Support: {techSupportEnabled ? 'Enabled' : 'Disabled'}
          </div>
        </div>

        {/* Tabs */}
        <div className="mb-6">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`py-2 px-1 border-b-2 font-medium text-sm flex items-center gap-2 ${
                    activeTab === tab.id
                      ? 'border-orange-500 text-orange-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <tab.icon className="w-4 h-4" />
                  {tab.name}
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* New Ticket Tab */}
        {activeTab === 'new-ticket' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <ExclamationTriangleIcon className="w-5 h-5 text-orange-600" />
                Create Support Ticket
              </h2>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Issue Category
                  </label>
                  <div className="grid grid-cols-1 gap-2">
                    {categories.map((category) => (
                      <label key={category.id} className="flex items-center gap-3 p-3 border rounded-lg cursor-pointer hover:border-gray-300">
                        <input
                          type="radio"
                          name="category"
                          value={category.id}
                          checked={selectedCategory === category.id}
                          onChange={(e) => setSelectedCategory(e.target.value)}
                          className="w-4 h-4 text-orange-600 border-gray-300 focus:ring-orange-500"
                        />
                        <category.icon className="w-5 h-5 text-gray-500" />
                        <div>
                          <div className="font-medium text-sm text-gray-900">{category.name}</div>
                          <div className="text-xs text-gray-500">{category.description}</div>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Describe your issue
                  </label>
                  <textarea
                    value={issueDescription}
                    onChange={(e) => setIssueDescription(e.target.value)}
                    placeholder="Please provide as much detail as possible about the issue you're experiencing..."
                    className="w-full h-32 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent resize-none"
                  />
                </div>

                <button
                  onClick={createTicket}
                  disabled={!issueDescription.trim()}
                  className="w-full bg-orange-600 text-white py-3 px-4 rounded-lg hover:bg-orange-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  <ExclamationTriangleIcon className="w-4 h-4" />
                  Submit Support Request
                </button>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h2 className="text-lg font-semibold mb-4">Quick Help</h2>
              
              <div className="space-y-4">
                <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <h3 className="font-medium text-blue-900 mb-2">Before submitting a ticket:</h3>
                  <ul className="text-sm text-blue-800 space-y-1">
                    <li>• Try restarting your device</li>
                    <li>• Check if others are experiencing the same issue</li>
                    <li>• Run system diagnostics below</li>
                    <li>• Search our knowledge base</li>
                  </ul>
                </div>

                <button
                  onClick={() => setActiveTab('diagnostics')}
                  className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700"
                >
                  Run System Diagnostics
                </button>

                <button
                  onClick={() => setActiveTab('kb')}
                  className="w-full border border-gray-300 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-50"
                >
                  Browse Knowledge Base
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Tickets Tab */}
        {activeTab === 'tickets' && (
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <h2 className="text-lg font-semibold mb-4">Support Tickets ({tickets.length})</h2>
            
            <div className="space-y-4">
              {tickets.map((ticket) => (
                <motion.div
                  key={ticket.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-4 border border-gray-200 rounded-lg hover:border-gray-300 transition-colors"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="font-medium text-gray-900">{ticket.title}</h3>
                      <p className="text-sm text-gray-600 mt-1">{ticket.description}</p>
                    </div>
                    <div className="flex gap-2 ml-4">
                      <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(ticket.status)}`}>
                        {ticket.status}
                      </span>
                      <span className={`text-xs px-2 py-1 rounded-full ${getPriorityColor(ticket.priority)}`}>
                        {ticket.priority}
                      </span>
                    </div>
                  </div>
                  
                  {ticket.solution && (
                    <div className="mb-3 p-3 bg-green-50 border border-green-200 rounded-lg">
                      <h4 className="font-medium text-green-900 text-sm mb-1">Solution:</h4>
                      <p className="text-sm text-green-800">{ticket.solution}</p>
                    </div>
                  )}
                  
                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <div className="flex items-center gap-4">
                      <span>Category: {ticket.category}</span>
                      <span>Created: {ticket.createdAt.toLocaleDateString()}</span>
                      <span>Updated: {ticket.updatedAt.toLocaleDateString()}</span>
                    </div>
                    <div className="flex gap-2">
                      <button className="text-blue-600 hover:text-blue-700">View Details</button>
                      {ticket.status === 'resolved' && (
                        <button className="text-green-600 hover:text-green-700">Mark as Helpful</button>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {/* Diagnostics Tab */}
        {activeTab === 'diagnostics' && (
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold flex items-center gap-2">
                  <WrenchScrewdriverIcon className="w-5 h-5 text-orange-600" />
                  System Diagnostics
                </h2>
                <button
                  onClick={runDiagnostics}
                  disabled={isRunningDiagnostics}
                  className="bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  {isRunningDiagnostics ? (
                    <>
                      <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full" />
                      Running...
                    </>
                  ) : (
                    <>
                      <WrenchScrewdriverIcon className="w-4 h-4" />
                      Run Diagnostics
                    </>
                  )}
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {diagnosticResults.map((result) => (
                  <motion.div
                    key={result.id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="p-4 border border-gray-200 rounded-lg"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-medium text-gray-900">{result.name}</h3>
                      <div className={`w-3 h-3 rounded-full ${
                        result.status === 'pass' ? 'bg-green-500' :
                        result.status === 'warning' ? 'bg-yellow-500' :
                        'bg-red-500'
                      }`} />
                    </div>
                    
                    <p className="text-sm text-gray-600 mb-2">{result.details}</p>
                    
                    {result.recommendation && (
                      <div className="text-xs text-orange-600 bg-orange-50 p-2 rounded">
                        <strong>Recommendation:</strong> {result.recommendation}
                      </div>
                    )}
                    
                    <div className={`text-xs font-medium mt-2 ${getDiagnosticColor(result.status)}`}>
                      {result.status.toUpperCase()}
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Knowledge Base Tab */}
        {activeTab === 'kb' && (
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <ChatBubbleLeftRightIcon className="w-5 h-5 text-orange-600" />
              Knowledge Base
            </h2>
            
            <div className="mb-6">
              <input
                type="text"
                placeholder="Search articles..."
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {knowledgeBaseArticles.map((article) => (
                <motion.div
                  key={article.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-4 border border-gray-200 rounded-lg hover:border-gray-300 transition-colors cursor-pointer"
                >
                  <h3 className="font-medium text-gray-900 mb-2">{article.title}</h3>
                  
                  <div className="flex items-center justify-between text-sm text-gray-500">
                    <span className="bg-gray-100 px-2 py-1 rounded text-xs">{article.category}</span>
                    <div className="flex items-center gap-3">
                      <span>{article.views} views</span>
                      <span className="flex items-center gap-1">
                        <CheckCircleIcon className="w-3 h-3" />
                        {article.helpfulVotes}% helpful
                      </span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TechSupportPage; 