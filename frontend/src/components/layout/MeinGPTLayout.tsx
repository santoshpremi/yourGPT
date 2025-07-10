import React, { useState } from 'react';
import { Outlet, useParams } from 'react-router';
import { motion } from 'framer-motion';
import { trpc } from '../../utils/trpc';
import MeinGPTSidebar from '../sidebar/MeinGPTSidebar';
import {
  MagnifyingGlassIcon,
  // Remove unused imports
} from '@heroicons/react/24/outline';
import { toast } from 'react-hot-toast';

const MeinGPTLayout: React.FC = () => {
  const { organizationId: _organizationId } = useParams<{ organizationId: string }>();
  const [sidebarExpanded, setSidebarExpanded] = useState(true);
  const [notificationOpen, setNotificationOpen] = useState(false);

  // tRPC queries
  const { data: user } = trpc.user.me.useQuery();
  const { data: organization } = trpc.organization.getOrganization.useQuery();

  // Keyboard shortcuts
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Command/Ctrl + K for search
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        // Open search modal
        toast.success('Search functionality coming soon!');
      }
      
      // Command/Ctrl + N for new chat
      if ((e.metaKey || e.ctrlKey) && e.key === 'n') {
        e.preventDefault();
        // Navigate to new chat
        toast.success('New chat functionality coming soon!');
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Page transition variants - fixed for framer-motion compatibility
  const pageTransition = {
    duration: 0.3
  };

  const pageVariants = {
    initial: { opacity: 0, y: 20 },
    in: { opacity: 1, y: 0 },
    out: { opacity: 0, y: -20 }
  };

  return (
    <div className="h-screen flex bg-gray-50">
      {/* Sidebar */}
      <MeinGPTSidebar 
        isExpanded={sidebarExpanded}
        setIsExpanded={setSidebarExpanded}
      />

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Navigation Bar */}
        <header className="bg-white border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            {/* Breadcrumbs */}
            <div className="flex items-center space-x-2 text-sm">
              <span className="text-gray-500">{organization?.name || 'Demo Organization'}</span>
              <span className="text-gray-300">/</span>
              <span className="text-gray-900">Dashboard</span>
            </div>

            {/* Search and Actions */}
            <div className="flex items-center space-x-4">
              {/* Search */}
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="Search... (⌘K)"
                  className="block w-64 pl-10 pr-3 py-2 border border-gray-300 rounded-lg leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-sm"
                />
              </div>

              {/* User Menu */}
              <div className="flex items-center space-x-3">
                <div className="text-right">
                  <div className="text-sm font-medium text-gray-900">{user?.name || 'Demo User'}</div>
                  <div className="text-xs text-gray-500">{user?.email || 'demo@deingpt.com'}</div>
                </div>
                <div className="h-8 w-8 bg-blue-600 rounded-full flex items-center justify-center">
                  <span className="text-sm font-medium text-white">
                    {(user?.name || 'Demo User').charAt(0)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-auto">
          <motion.div
            key={location.pathname}
            initial="initial"
            animate="in"
            exit="out"
            variants={pageVariants}
            transition={pageTransition}
            className="h-full"
          >
            <Outlet />
          </motion.div>
        </main>

        {/* Notification Toast */}
        {notificationOpen && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className="fixed bottom-4 right-4 bg-white rounded-lg shadow-lg border border-gray-200 p-4 max-w-sm"
          >
            <div className="flex items-start">
              <div className="flex-shrink-0">
                <div className="h-6 w-6 rounded-full bg-green-100 flex items-center justify-center">
                  <span className="text-green-600 text-sm">✓</span>
                </div>
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-900">
                  Welcome to DeinGPT!
                </p>
                <p className="mt-1 text-sm text-gray-500">
                  Your AI workspace is ready to use.
                </p>
              </div>
              <button
                onClick={() => setNotificationOpen(false)}
                className="ml-4 flex-shrink-0 text-gray-400 hover:text-gray-500"
              >
                <span className="sr-only">Close</span>
                ✕
              </button>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default MeinGPTLayout; 