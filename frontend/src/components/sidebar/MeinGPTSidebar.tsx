import React, { useState } from 'react';
import { Link, useParams } from 'react-router';
import { motion, AnimatePresence } from 'framer-motion';
import { trpc } from '../../utils/trpc';
import {
  HomeIcon,
  ChatBubbleLeftIcon,
  Cog6ToothIcon,
  UserIcon,
  ChevronDownIcon,
  ChevronRightIcon,
  PlusIcon,
  BeakerIcon,
  // Remove TranslateIcon import as it doesn't exist
  DocumentDuplicateIcon,
  AcademicCapIcon,
} from '@heroicons/react/24/outline';
import {
  ChatBubbleLeftIcon as ChatBubbleLeftIconSolid,
  HomeIcon as HomeIconSolid,
  Cog6ToothIcon as Cog6ToothIconSolid,
  BeakerIcon as BeakerIconSolid,
  DocumentDuplicateIcon as DocumentDuplicateIconSolid,
  AcademicCapIcon as AcademicCapIconSolid,
  // Remove unused icons
} from '@heroicons/react/24/solid';

interface SidebarProps {
  isExpanded: boolean;
  setIsExpanded: (expanded: boolean) => void;
}

interface NavigationItem {
  name: string;
  href?: string;
  icon: React.ElementType;
  activeIcon: React.ElementType;
  children?: NavigationItem[];
  isActive?: boolean;
}

const MeinGPTSidebar: React.FC<SidebarProps> = ({ isExpanded, setIsExpanded }) => {
  const { organizationId } = useParams<{ organizationId: string }>();
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({});

  // Fix the tRPC route call
  const { data: recentChats } = trpc.chat.getChats.useQuery();
  const { data: workflows } = trpc.workflow.getWorkflows.useQuery();
  const { data: user } = trpc.user.me.useQuery();

  const toggleSection = (sectionName: string) => {
    setExpandedSections(prev => ({
      ...prev,
      [sectionName]: !prev[sectionName],
    }));
  };

  const navigation: NavigationItem[] = [
    {
      name: 'Dashboard',
      href: `/${organizationId}`,
      icon: HomeIcon,
      activeIcon: HomeIconSolid,
    },
    {
      name: 'Chats',
      icon: ChatBubbleLeftIcon,
      activeIcon: ChatBubbleLeftIconSolid,
      children: [
        { name: 'New Chat', href: `/${organizationId}/chats/new`, icon: PlusIcon, activeIcon: PlusIcon },
        ...(recentChats?.slice(0, 5).map((chat: any) => ({
          name: chat.title,
          href: `/${organizationId}/chats/${chat.id}`,
          icon: ChatBubbleLeftIcon,
          activeIcon: ChatBubbleLeftIconSolid,
        })) || []),
      ],
    },
    {
      name: 'Tools',
      icon: BeakerIcon,
      activeIcon: BeakerIconSolid,
      children: [
        { name: 'All Tools', href: `/${organizationId}/tools`, icon: BeakerIcon, activeIcon: BeakerIconSolid },
        { name: 'Research Assistant', href: `/${organizationId}/tools/research`, icon: DocumentDuplicateIcon, activeIcon: DocumentDuplicateIconSolid },
        { name: 'Image Factory', href: `/${organizationId}/tools/images`, icon: BeakerIcon, activeIcon: BeakerIconSolid },
        { name: 'Meeting Tools', href: `/${organizationId}/tools/meetings`, icon: ChatBubbleLeftIcon, activeIcon: ChatBubbleLeftIconSolid },
      ],
    },
    {
      name: 'Workflows',
      icon: DocumentDuplicateIcon,
      activeIcon: DocumentDuplicateIconSolid,
      children: [
        { name: 'All Workflows', href: `/${organizationId}/workflows`, icon: DocumentDuplicateIcon, activeIcon: DocumentDuplicateIconSolid },
        ...(workflows?.slice(0, 3).map((workflow: any) => ({
          name: workflow.name,
          href: `/${organizationId}/workflows/${workflow.id}`,
          icon: DocumentDuplicateIcon,
          activeIcon: DocumentDuplicateIconSolid,
        })) || []),
      ],
    },
    {
      name: 'Academy',
      href: `/${organizationId}/academy`,
      icon: AcademicCapIcon,
      activeIcon: AcademicCapIconSolid,
    },
    {
      name: 'Settings',
      icon: Cog6ToothIcon,
      activeIcon: Cog6ToothIconSolid,
      children: [
        { name: 'Organization', href: `/${organizationId}/settings`, icon: Cog6ToothIcon, activeIcon: Cog6ToothIconSolid },
        { name: 'Team', href: `/${organizationId}/settings/team`, icon: UserIcon, activeIcon: UserIcon },
        { name: 'Models', href: `/${organizationId}/settings/models`, icon: BeakerIcon, activeIcon: BeakerIconSolid },
        { name: 'Billing', href: `/${organizationId}/settings/billing`, icon: DocumentDuplicateIcon, activeIcon: DocumentDuplicateIconSolid },
      ],
    },
  ];

  return (
    <div className={`bg-gray-900 text-white transition-all duration-300 ${
      isExpanded ? 'w-64' : 'w-16'
    } flex flex-col h-full`}>
      {/* Header */}
      <div className="p-4 border-b border-gray-700">
        <div className="flex items-center justify-between">
          <div className={`transition-opacity duration-300 ${isExpanded ? 'opacity-100' : 'opacity-0'}`}>
            <h1 className="text-lg font-semibold text-white">DeinGPT</h1>
          </div>
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-1 rounded-lg hover:bg-gray-700 transition-colors"
          >
            <ChevronRightIcon className={`h-5 w-5 transition-transform duration-300 ${
              isExpanded ? 'rotate-180' : ''
            }`} />
          </button>
        </div>
      </div>

      {/* User Profile */}
      {isExpanded && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-4 border-b border-gray-700"
        >
          <div className="flex items-center space-x-3">
            <div className="bg-blue-600 rounded-full p-2">
              <UserIcon className="h-5 w-5" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-white truncate">
                {user?.name || 'Demo User'}
              </p>
              <p className="text-xs text-gray-400 truncate">
                {user?.email || 'demo@deingpt.com'}
              </p>
            </div>
          </div>
        </motion.div>
      )}

      {/* Quick Actions */}
      {isExpanded && (
        <div className="p-4 border-b border-gray-700">
          <Link
            to={`/${organizationId}/chats/new`}
            className="flex items-center justify-center w-full px-3 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
          >
            <PlusIcon className="h-4 w-4 mr-2" />
            New Chat
          </Link>
        </div>
      )}

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto p-4 space-y-2">
        {navigation.map((item) => (
          <div key={item.name}>
            {item.children ? (
              <div>
                <button
                  onClick={() => toggleSection(item.name)}
                  className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors group ${
                    expandedSections[item.name] ? 'bg-gray-700 text-white' : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                  }`}
                >
                  <item.icon className="h-5 w-5 mr-3" />
                  {isExpanded && (
                    <>
                      <span className="flex-1 text-left">{item.name}</span>
                      <ChevronDownIcon className={`h-4 w-4 transition-transform ${
                        expandedSections[item.name] ? 'rotate-180' : ''
                      }`} />
                    </>
                  )}
                </button>
                
                <AnimatePresence>
                  {expandedSections[item.name] && isExpanded && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="ml-6 mt-2 space-y-1"
                    >
                      {item.children.map((child: any) => (
                        <Link
                          key={child.name}
                          to={child.href}
                          className="flex items-center px-3 py-2 text-sm text-gray-400 rounded-lg hover:bg-gray-700 hover:text-white transition-colors"
                        >
                          <child.icon className="h-4 w-4 mr-3" />
                          {child.name}
                        </Link>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <Link
                to={item.href || '#'}
                className={`flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors group ${
                  item.isActive ? 'bg-blue-600 text-white' : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                }`}
              >
                <item.icon className="h-5 w-5 mr-3" />
                {isExpanded && <span>{item.name}</span>}
              </Link>
            )}
          </div>
        ))}
      </nav>

      {/* Footer */}
      {isExpanded && (
        <div className="p-4 border-t border-gray-700">
          <div className="text-xs text-gray-400 text-center">
            DeinGPT v1.0.0
          </div>
        </div>
      )}
    </div>
  );
};

export default MeinGPTSidebar; 