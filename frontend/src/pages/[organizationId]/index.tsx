import React from 'react';
import { motion } from 'framer-motion';
import { trpc } from '../../utils/trpc';
import {
  ChatBubbleLeftIcon,
  UserIcon,
  CogIcon,
  // Remove unused icons
} from '@heroicons/react/24/outline';
import {
  ArrowTrendingUpIcon,
  ClockIcon,
  // Remove unused icons
} from '@heroicons/react/24/solid';

interface Chat {
  id: string;
  title: string;
  createdAt: string;
  organizationId: string;
  userId: string;
}

const OrganizationDashboard: React.FC = () => {
  // Fix the tRPC route calls to match the backend API
  const { data: organization } = trpc.organization.getOrganization.useQuery();
  const { data: user } = trpc.user.me.useQuery();
  const { data: chats } = trpc.chat.getChats.useQuery();

  // Mock analytics data
  const analyticsData = {
    totalChats: chats?.length || 0,
    totalTokens: 45680,
    averageResponseTime: 1.2,
    userSatisfaction: 4.8
  };

  // Quick actions
  const quickActions = [
    {
      name: 'New Chat',
      description: 'Start a conversation with AI',
      icon: ChatBubbleLeftIcon,
      href: '/chat/new',
      color: 'bg-blue-500'
    },
    {
      name: 'Upload Document',
      description: 'Add knowledge to your workspace',
      icon: UserIcon,
      href: '/documents/upload',
      color: 'bg-green-500'
    },
    {
      name: 'Team Settings',
      description: 'Manage your organization',
      icon: CogIcon,
      href: '/settings',
      color: 'bg-purple-500'
    }
  ];

  // Recent activity mock data
  const recentActivity = [
    {
      id: 1,
      type: 'chat',
      title: 'New chat started',
      description: 'Discussion about AI implementation',
      timestamp: '2 minutes ago',
      user: 'Demo User'
    },
    {
      id: 2,
      type: 'workflow',
      title: 'Workflow created',
      description: 'Email generation workflow',
      timestamp: '1 hour ago',
      user: 'Demo User'
    },
    {
      id: 3,
      type: 'document',
      title: 'Document uploaded',
      description: 'Product specification document',
      timestamp: '3 hours ago',
      user: 'Demo User'
    }
  ];

  // Fix the animation variants for framer-motion compatibility
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-6">
            <div className="md:flex md:items-center md:justify-between">
              <div className="flex-1 min-w-0">
                <h1 className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate">
                  Welcome back, {user?.name || 'Demo User'}!
                </h1>
                <p className="mt-1 text-sm text-gray-500">
                  Organization: {organization?.name || 'Demo Organization'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Analytics Cards */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
        >
          {[
            {
              title: 'Total Chats',
              value: analyticsData.totalChats,
              icon: ChatBubbleLeftIcon,
              color: 'text-blue-600 bg-blue-100',
              change: '+12%'
            },
            {
              title: 'Tokens Used',
              value: analyticsData.totalTokens.toLocaleString(),
              icon: ArrowTrendingUpIcon,
              color: 'text-green-600 bg-green-100',
              change: '+8%'
            },
            {
              title: 'Avg Response Time',
              value: `${analyticsData.averageResponseTime}s`,
              icon: ClockIcon,
              color: 'text-yellow-600 bg-yellow-100',
              change: '-5%'
            },
            {
              title: 'User Satisfaction',
              value: analyticsData.userSatisfaction,
              icon: UserIcon,
              color: 'text-purple-600 bg-purple-100',
              change: '+2%'
            }
          ].map((stat) => (
            <motion.div
              key={stat.title}
              variants={itemVariants}
              className="bg-white rounded-lg border border-gray-200 p-6"
            >
              <div className="flex items-center">
                <div className={`${stat.color} p-3 rounded-lg`}>
                  <stat.icon className="h-6 w-6" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                  <p className="text-2xl font-semibold text-gray-900">{stat.value}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Quick Actions */}
          <motion.div variants={itemVariants} className="bg-white rounded-lg border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
            <div className="space-y-3">
              {quickActions.map((action) => (
                <button
                  key={action.name}
                  className="w-full flex items-center p-3 text-left border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-colors"
                >
                  <div className={`${action.color} p-2 rounded-lg`}>
                    <action.icon className="h-5 w-5 text-white" />
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-gray-900">{action.name}</p>
                    <p className="text-xs text-gray-500">{action.description}</p>
                  </div>
                </button>
              ))}
            </div>
          </motion.div>

          {/* Recent Chats */}
          <motion.div variants={itemVariants} className="bg-white rounded-lg border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Recent Chats</h2>
            <div className="space-y-3">
              {chats?.slice(0, 5).map((chat: Chat) => (
                <div key={chat.id} className="flex items-center p-3 border border-gray-200 rounded-lg">
                  <ChatBubbleLeftIcon className="h-5 w-5 text-gray-400 mr-3" />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">{chat.title}</p>
                    <p className="text-xs text-gray-500">
                      {new Date(chat.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Recent Activity */}
          <motion.div variants={itemVariants} className="bg-white rounded-lg border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h2>
            <div className="space-y-3">
              {recentActivity.map((activity) => (
                <motion.div
                  key={activity.id}
                  variants={itemVariants}
                  className="flex items-start p-3 border border-gray-200 rounded-lg"
                >
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">{activity.title}</p>
                    <p className="text-xs text-gray-500">{activity.description}</p>
                    <p className="text-xs text-gray-400 mt-1">{activity.timestamp}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Getting Started */}
        <motion.div variants={itemVariants} className="mt-8 bg-white rounded-lg border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Getting Started</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <ChatBubbleLeftIcon className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className="text-sm font-medium text-gray-900 mb-2">Start Your First Chat</h3>
              <p className="text-xs text-gray-500">Begin a conversation with our AI assistant to explore its capabilities.</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <UserIcon className="h-6 w-6 text-green-600" />
              </div>
              <h3 className="text-sm font-medium text-gray-900 mb-2">Invite Team Members</h3>
              <p className="text-xs text-gray-500">Collaborate with your team by inviting them to your organization.</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <CogIcon className="h-6 w-6 text-purple-600" />
              </div>
              <h3 className="text-sm font-medium text-gray-900 mb-2">Customize Settings</h3>
              <p className="text-xs text-gray-500">Configure your workspace to match your team's workflow.</p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default OrganizationDashboard; 