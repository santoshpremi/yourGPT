import React, { Fragment, useState, useEffect } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { motion } from 'framer-motion';
import {
  MagnifyingGlassIcon,
  XMarkIcon,
  ChatBubbleLeftIcon,
  DocumentTextIcon,
  Cog6ToothIcon,
  UserIcon,
  ClockIcon,
  CommandLineIcon,
} from '@heroicons/react/24/outline';
import { trpc } from '../../utils/trpc';
// Remove unused import

interface RouteModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface SearchResult {
  id: string;
  title: string;
  description: string;
  type: 'chat' | 'document' | 'workflow' | 'user' | 'setting';
  href: string;
  icon: React.ElementType;
  timestamp?: string;
}

interface Chat {
  id: string;
  title: string;
  createdAt: string;
  organizationId: string;
  userId: string;
}

interface Workflow {
  id: string;
  name: string;
  description: string;
  steps: any[];
  inputs: any[];
  index: number;
  departmentId: string;
  includedDocuments: any[];
  modelOverride: string | null;
  allowDocumentUpload: boolean;
}

const RouteModal: React.FC<RouteModalProps> = ({ isOpen, onClose }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  // Remove unused location variable

  // Mock data for search results
  const { data: chats } = trpc.chat.getChats.useQuery();
  const { data: workflows } = trpc.workflow.getWorkflows.useQuery();

  // Generate search results based on query
  useEffect(() => {
    if (!searchQuery.trim()) {
      // Show recent items when no search query
      const recentResults: SearchResult[] = [
        {
          id: '1',
          title: 'Recent Chat: AI Development',
          description: 'Discussion about AI implementation strategies',
          type: 'chat',
          href: '/demo/chat/1',
          icon: ChatBubbleLeftIcon,
          timestamp: '2 hours ago'
        },
        {
          id: '2',
          title: 'Organization Settings',
          description: 'Manage your organization preferences',
          type: 'setting',
          href: '/demo/settings',
          icon: Cog6ToothIcon,
        },
        {
          id: '3',
          title: 'Team Management',
          description: 'Add and manage team members',
          type: 'user',
          href: '/demo/settings/team',
          icon: UserIcon,
        }
      ];
      setSearchResults(recentResults);
    } else {
      // Filter based on search query
      const query = searchQuery.toLowerCase();
      const filteredResults: SearchResult[] = [];

      // Search in chats
      chats?.forEach((chat: Chat) => {
        if (chat.title.toLowerCase().includes(query)) {
          filteredResults.push({
            id: chat.id,
            title: chat.title,
            description: `Chat from ${new Date(chat.createdAt).toLocaleDateString()}`,
            type: 'chat',
            href: `/demo/chat/${chat.id}`,
            icon: ChatBubbleLeftIcon,
          });
        }
      });

      // Search in workflows
      workflows?.forEach((workflow: Workflow) => {
        if (workflow.name.toLowerCase().includes(query)) {
          filteredResults.push({
            id: workflow.id,
            title: workflow.name,
            description: workflow.description,
            type: 'workflow',
            href: `/demo/workflows/${workflow.id}`,
            icon: DocumentTextIcon,
          });
        }
      });

      // Add static search results
      const staticResults = [
        {
          id: 'settings',
          title: 'Settings',
          description: 'Organization and account settings',
          type: 'setting' as const,
          href: '/demo/settings',
          icon: Cog6ToothIcon,
        },
        {
          id: 'new-chat',
          title: 'New Chat',
          description: 'Start a new conversation with AI',
          type: 'chat' as const,
          href: '/demo/chat/new',
          icon: ChatBubbleLeftIcon,
        }
      ].filter(item => 
        item.title.toLowerCase().includes(query) || 
        item.description.toLowerCase().includes(query)
      );

      setSearchResults([...filteredResults, ...staticResults]);
    }
    setSelectedIndex(0);
  }, [searchQuery, chats, workflows]);

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;

      switch (e.key) {
        case 'ArrowDown':
          e.preventDefault();
          setSelectedIndex(prev => 
            prev < searchResults.length - 1 ? prev + 1 : prev
          );
          break;
        case 'ArrowUp':
          e.preventDefault();
          setSelectedIndex(prev => prev > 0 ? prev - 1 : prev);
          break;
        case 'Enter':
          e.preventDefault();
          if (searchResults[selectedIndex]) {
            // Navigate to selected result
            window.location.href = searchResults[selectedIndex].href;
            onClose();
          }
          break;
        case 'Escape':
          onClose();
          break;
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, searchResults, selectedIndex, onClose]);

  // Reset search when modal opens
  useEffect(() => {
    if (isOpen) {
      setSearchQuery('');
      setSelectedIndex(0);
    }
  }, [isOpen]);

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'chat':
        return 'text-blue-600 bg-blue-100';
      case 'document':
      case 'workflow':
        return 'text-green-600 bg-green-100';
      case 'setting':
        return 'text-gray-600 bg-gray-100';
      case 'user':
        return 'text-purple-600 bg-purple-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  return (
    <Transition show={isOpen} as={Fragment}>
      <Dialog onClose={onClose} className="relative z-50">
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black bg-opacity-25" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-start justify-center p-4 pt-[10vh]">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-2xl bg-white rounded-lg shadow-xl">
                {/* Search Input */}
                <div className="relative p-4 border-b border-gray-200">
                  <div className="flex items-center">
                    <MagnifyingGlassIcon className="h-5 w-5 text-gray-400 mr-3" />
                    <input
                      type="text"
                      placeholder="Search for chats, workflows, settings..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="flex-1 outline-none text-lg placeholder-gray-500"
                      autoFocus
                    />
                    <button
                      onClick={onClose}
                      className="ml-3 p-1 rounded-lg hover:bg-gray-100"
                    >
                      <XMarkIcon className="h-5 w-5 text-gray-500" />
                    </button>
                  </div>
                </div>

                {/* Search Results */}
                <div className="max-h-96 overflow-y-auto">
                  {searchResults.length > 0 ? (
                    <div className="p-2">
                      {searchResults.map((result, index) => {
                        const Icon = result.icon;
                        return (
                          <motion.a
                            key={result.id}
                            href={result.href}
                            onClick={onClose}
                            className={`flex items-center w-full p-3 rounded-lg transition-colors ${
                              index === selectedIndex
                                ? 'bg-blue-50 border border-blue-200'
                                : 'hover:bg-gray-50'
                            }`}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.05 }}
                          >
                            <div className={`p-2 rounded-lg ${getTypeColor(result.type)} mr-3`}>
                              <Icon className="h-5 w-5" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="font-medium text-gray-900 truncate">
                                {result.title}
                              </p>
                              <p className="text-sm text-gray-500 truncate">
                                {result.description}
                              </p>
                            </div>
                            {result.timestamp && (
                              <div className="flex items-center text-xs text-gray-400 ml-3">
                                <ClockIcon className="h-3 w-3 mr-1" />
                                {result.timestamp}
                              </div>
                            )}
                          </motion.a>
                        );
                      })}
                    </div>
                  ) : searchQuery.trim() ? (
                    <div className="p-8 text-center">
                      <MagnifyingGlassIcon className="h-8 w-8 text-gray-400 mx-auto mb-3" />
                      <p className="text-gray-500">No results found for "{searchQuery}"</p>
                    </div>
                  ) : (
                    <div className="p-8 text-center">
                      <CommandLineIcon className="h-8 w-8 text-gray-400 mx-auto mb-3" />
                      <p className="text-gray-500">Type to search...</p>
                    </div>
                  )}
                </div>

                {/* Footer */}
                <div className="p-3 border-t border-gray-200 bg-gray-50 rounded-b-lg">
                  <div className="flex justify-between text-xs text-gray-500">
                    <div className="flex items-center space-x-4">
                      <span className="flex items-center">
                        <kbd className="px-2 py-1 bg-gray-200 rounded text-xs mr-1">↑↓</kbd>
                        Navigate
                      </span>
                      <span className="flex items-center">
                        <kbd className="px-2 py-1 bg-gray-200 rounded text-xs mr-1">↵</kbd>
                        Select
                      </span>
                    </div>
                    <span className="flex items-center">
                      <kbd className="px-2 py-1 bg-gray-200 rounded text-xs mr-1">ESC</kbd>
                      Close
                    </span>
                  </div>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};

export default RouteModal; 