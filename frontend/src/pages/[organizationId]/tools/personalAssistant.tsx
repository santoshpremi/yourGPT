import React, { useState } from 'react';
import { trpc } from '../../../utils/trpc';
import { 
  UserIcon, 
  CalendarIcon, 
  EnvelopeIcon,
  CheckCircleIcon,
  ClockIcon,
  PlusIcon,
  BellIcon
} from '@heroicons/react/24/outline';
import { motion } from 'framer-motion';

interface Task {
  id: string;
  title: string;
  description: string;
  priority: 'low' | 'medium' | 'high';
  dueDate: Date;
  completed: boolean;
  category: 'work' | 'personal' | 'meeting' | 'email';
}

interface ScheduleEvent {
  id: string;
  title: string;
  startTime: Date;
  endTime: Date;
  type: 'meeting' | 'task' | 'reminder';
  description?: string;
}

interface EmailDraft {
  id: string;
  subject: string;
  recipient: string;
  content: string;
  tone: 'formal' | 'casual' | 'friendly';
  createdAt: Date;
}

const PersonalAssistantPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'tasks' | 'schedule' | 'emails'>('dashboard');
  const [newTaskInput, setNewTaskInput] = useState('');
  const [emailSubject, setEmailSubject] = useState('');
  const [emailRecipient, setEmailRecipient] = useState('');
  const [emailContext, setEmailContext] = useState('');
  const [emailTone, setEmailTone] = useState<'formal' | 'casual' | 'friendly'>('professional' as any);

  const [tasks, setTasks] = useState<Task[]>([
    {
      id: '1',
      title: 'Review quarterly budget report',
      description: 'Go through Q4 financial data and prepare summary',
      priority: 'high',
      dueDate: new Date(2024, 1, 20),
      completed: false,
      category: 'work'
    },
    {
      id: '2',
      title: 'Schedule team meeting',
      description: 'Coordinate with team for project kickoff meeting',
      priority: 'medium',
      dueDate: new Date(2024, 1, 18),
      completed: true,
      category: 'meeting'
    },
    {
      id: '3',
      title: 'Draft client proposal',
      description: 'Create proposal for new client project',
      priority: 'high',
      dueDate: new Date(2024, 1, 22),
      completed: false,
      category: 'work'
    }
  ]);

  const [schedule] = useState<ScheduleEvent[]>([
    {
      id: '1',
      title: 'Team Standup',
      startTime: new Date(2024, 1, 17, 9, 0),
      endTime: new Date(2024, 1, 17, 9, 30),
      type: 'meeting',
      description: 'Daily team sync meeting'
    },
    {
      id: '2',
      title: 'Client Call',
      startTime: new Date(2024, 1, 17, 14, 0),
      endTime: new Date(2024, 1, 17, 15, 0),
      type: 'meeting',
      description: 'Project review with client'
    },
    {
      id: '3',
      title: 'Review budget report',
      startTime: new Date(2024, 1, 17, 16, 0),
      endTime: new Date(2024, 1, 17, 17, 0),
      type: 'task',
      description: 'Complete quarterly budget analysis'
    }
  ]);

  const [emailDrafts, setEmailDrafts] = useState<EmailDraft[]>([
    {
      id: '1',
      subject: 'Project Update - Q1 Milestones',
      recipient: 'team@company.com',
      content: 'Hi Team,\n\nI hope this email finds you well. I wanted to provide an update on our Q1 project milestones...',
      tone: 'formal',
      createdAt: new Date(2024, 1, 16)
    }
  ]);

  const { data: productConfig } = trpc.productConfig.get.useQuery();

  const createTask = () => {
    if (!newTaskInput.trim()) return;

    const newTask: Task = {
      id: Date.now().toString(),
      title: newTaskInput,
      description: '',
      priority: 'medium',
      dueDate: new Date(Date.now() + 24 * 60 * 60 * 1000), // Tomorrow
      completed: false,
      category: 'work'
    };

    setTasks(prev => [newTask, ...prev]);
    setNewTaskInput('');
  };

  const toggleTask = (taskId: string) => {
    setTasks(prev => prev.map(task => 
      task.id === taskId ? { ...task, completed: !task.completed } : task
    ));
  };

  const generateEmail = () => {
    if (!emailSubject || !emailRecipient || !emailContext) return;

    const newDraft: EmailDraft = {
      id: Date.now().toString(),
      subject: emailSubject,
      recipient: emailRecipient,
      content: `Dear ${emailRecipient.split('@')[0]},\n\n${emailContext}\n\nBest regards,\n[Your name]`,
      tone: emailTone,
      createdAt: new Date()
    };

    setEmailDrafts(prev => [newDraft, ...prev]);
    setEmailSubject('');
    setEmailRecipient('');
    setEmailContext('');
  };

  const getPriorityColor = (priority: string) => {
    const colors = {
      low: 'text-green-600 bg-green-100',
      medium: 'text-yellow-600 bg-yellow-100',
      high: 'text-red-600 bg-red-100'
    };
    return colors[priority as keyof typeof colors] || 'text-gray-600 bg-gray-100';
  };

  const getEventTypeColor = (type: string) => {
    const colors = {
      meeting: 'text-blue-600 bg-blue-100',
      task: 'text-green-600 bg-green-100',
      reminder: 'text-purple-600 bg-purple-100'
    };
    return colors[type as keyof typeof colors] || 'text-gray-600 bg-gray-100';
  };

  const tabs = [
    { id: 'dashboard', name: 'Dashboard', icon: UserIcon },
    { id: 'tasks', name: 'Tasks', icon: CheckCircleIcon },
    { id: 'schedule', name: 'Schedule', icon: CalendarIcon },
    { id: 'emails', name: 'Email Assistant', icon: EnvelopeIcon }
  ];

  const upcomingTasks = tasks.filter(task => !task.completed).slice(0, 3);
  const todayEvents = schedule.filter(event => 
    event.startTime.toDateString() === new Date().toDateString()
  );

  return (
    <div className="h-full bg-gray-50 p-6 overflow-auto">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <UserIcon className="w-8 h-8 text-green-600" />
            <h1 className="text-3xl font-bold text-gray-900">Personal Assistant</h1>
          </div>
          <p className="text-gray-600">AI-powered productivity assistant for task management, scheduling, and communication</p>
          <div className="mt-2 flex items-center gap-2 text-sm text-gray-500">
            <span className={`w-2 h-2 rounded-full ${productConfig?.personalAssistant ? 'bg-green-500' : 'bg-red-500'}`} />
            Personal Assistant: {productConfig?.personalAssistant ? 'Enabled' : 'Disabled'}
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
                      ? 'border-green-500 text-green-600'
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

        {/* Dashboard */}
        {activeTab === 'dashboard' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Today's Overview */}
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <ClockIcon className="w-5 h-5 text-green-600" />
                Today's Overview
              </h2>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                  <div>
                    <div className="text-sm font-medium text-gray-900">Upcoming Tasks</div>
                    <div className="text-xs text-gray-500">{upcomingTasks.length} pending</div>
                  </div>
                  <div className="text-2xl font-bold text-blue-600">{upcomingTasks.length}</div>
                </div>
                
                <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                  <div>
                    <div className="text-sm font-medium text-gray-900">Today's Events</div>
                    <div className="text-xs text-gray-500">{todayEvents.length} scheduled</div>
                  </div>
                  <div className="text-2xl font-bold text-green-600">{todayEvents.length}</div>
                </div>
                
                <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
                  <div>
                    <div className="text-sm font-medium text-gray-900">Email Drafts</div>
                    <div className="text-xs text-gray-500">{emailDrafts.length} saved</div>
                  </div>
                  <div className="text-2xl font-bold text-purple-600">{emailDrafts.length}</div>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <PlusIcon className="w-5 h-5 text-green-600" />
                Quick Actions
              </h2>
              
              <div className="space-y-3">
                <button 
                  onClick={() => setActiveTab('tasks')}
                  className="w-full text-left p-3 border border-gray-200 rounded-lg hover:border-gray-300 hover:bg-gray-50 transition-colors"
                >
                  <div className="font-medium text-sm text-gray-900">Create New Task</div>
                  <div className="text-xs text-gray-500">Add a task to your todo list</div>
                </button>
                
                <button 
                  onClick={() => setActiveTab('schedule')}
                  className="w-full text-left p-3 border border-gray-200 rounded-lg hover:border-gray-300 hover:bg-gray-50 transition-colors"
                >
                  <div className="font-medium text-sm text-gray-900">Schedule Meeting</div>
                  <div className="text-xs text-gray-500">Add event to your calendar</div>
                </button>
                
                <button 
                  onClick={() => setActiveTab('emails')}
                  className="w-full text-left p-3 border border-gray-200 rounded-lg hover:border-gray-300 hover:bg-gray-50 transition-colors"
                >
                  <div className="font-medium text-sm text-gray-900">Draft Email</div>
                  <div className="text-xs text-gray-500">AI-assisted email writing</div>
                </button>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <BellIcon className="w-5 h-5 text-green-600" />
                Recent Activity
              </h2>
              
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full mt-2" />
                  <div>
                    <div className="text-sm font-medium text-gray-900">Task completed</div>
                    <div className="text-xs text-gray-500">Schedule team meeting - 2 hours ago</div>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mt-2" />
                  <div>
                    <div className="text-sm font-medium text-gray-900">Email drafted</div>
                    <div className="text-xs text-gray-500">Project update email - 5 hours ago</div>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-purple-500 rounded-full mt-2" />
                  <div>
                    <div className="text-sm font-medium text-gray-900">Event scheduled</div>
                    <div className="text-xs text-gray-500">Client call - Yesterday</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tasks Tab */}
        {activeTab === 'tasks' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg shadow-sm border p-6">
                <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <PlusIcon className="w-5 h-5 text-green-600" />
                  Create Task
                </h2>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Task Description</label>
                    <textarea
                      value={newTaskInput}
                      onChange={(e) => setNewTaskInput(e.target.value)}
                      placeholder="What needs to be done?"
                      className="w-full h-20 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent resize-none"
                    />
                  </div>
                  
                  <button
                    onClick={createTask}
                    disabled={!newTaskInput.trim()}
                    className="w-full bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Add Task
                  </button>
                </div>
              </div>
            </div>

            <div className="lg:col-span-2">
              <div className="bg-white rounded-lg shadow-sm border p-6">
                <h2 className="text-lg font-semibold mb-4">Task List ({tasks.filter(t => !t.completed).length} pending)</h2>
                
                <div className="space-y-3">
                  {tasks.map((task) => (
                    <motion.div
                      key={task.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`p-4 border rounded-lg transition-colors ${
                        task.completed ? 'border-green-200 bg-green-50' : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex items-start gap-3 flex-1">
                          <button
                            onClick={() => toggleTask(task.id)}
                            className={`mt-1 w-5 h-5 rounded border-2 flex items-center justify-center ${
                              task.completed 
                                ? 'border-green-500 bg-green-500 text-white' 
                                : 'border-gray-300 hover:border-green-500'
                            }`}
                          >
                            {task.completed && <CheckCircleIcon className="w-3 h-3" />}
                          </button>
                          
                          <div className="flex-1">
                            <h3 className={`font-medium ${
                              task.completed ? 'text-gray-500 line-through' : 'text-gray-900'
                            }`}>
                              {task.title}
                            </h3>
                            {task.description && (
                              <p className="text-sm text-gray-500 mt-1">{task.description}</p>
                            )}
                            <div className="flex items-center gap-2 mt-2">
                              <span className={`text-xs px-2 py-1 rounded-full ${getPriorityColor(task.priority)}`}>
                                {task.priority}
                              </span>
                              <span className="text-xs text-gray-500">
                                Due: {task.dueDate.toLocaleDateString()}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Schedule Tab */}
        {activeTab === 'schedule' && (
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <CalendarIcon className="w-5 h-5 text-green-600" />
              Today's Schedule
            </h2>
            
            <div className="space-y-4">
              {schedule.map((event) => (
                <motion.div
                  key={event.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="flex items-center gap-4 p-4 border border-gray-200 rounded-lg hover:border-gray-300 transition-colors"
                >
                  <div className="text-center min-w-[80px]">
                    <div className="text-sm font-medium text-gray-900">
                      {event.startTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </div>
                    <div className="text-xs text-gray-500">
                      {event.endTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </div>
                  </div>
                  
                  <div className="flex-1">
                    <h3 className="font-medium text-gray-900">{event.title}</h3>
                    {event.description && (
                      <p className="text-sm text-gray-500 mt-1">{event.description}</p>
                    )}
                  </div>
                  
                  <span className={`text-xs px-2 py-1 rounded-full ${getEventTypeColor(event.type)}`}>
                    {event.type}
                  </span>
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {/* Email Assistant Tab */}
        {activeTab === 'emails' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <EnvelopeIcon className="w-5 h-5 text-green-600" />
                Draft New Email
              </h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Subject</label>
                  <input
                    type="text"
                    value={emailSubject}
                    onChange={(e) => setEmailSubject(e.target.value)}
                    placeholder="Email subject"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Recipient</label>
                  <input
                    type="email"
                    value={emailRecipient}
                    onChange={(e) => setEmailRecipient(e.target.value)}
                    placeholder="recipient@example.com"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Context/Points to Cover</label>
                  <textarea
                    value={emailContext}
                    onChange={(e) => setEmailContext(e.target.value)}
                    placeholder="What should this email be about? Key points to include..."
                    className="w-full h-24 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent resize-none"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Tone</label>
                  <select
                    value={emailTone}
                    onChange={(e) => setEmailTone(e.target.value as any)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  >
                    <option value="formal">Formal</option>
                    <option value="casual">Casual</option>
                    <option value="friendly">Friendly</option>
                  </select>
                </div>
                
                <button
                  onClick={generateEmail}
                  disabled={!emailSubject || !emailRecipient || !emailContext}
                  className="w-full bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Generate Email Draft
                </button>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h2 className="text-lg font-semibold mb-4">Recent Drafts</h2>
              
              <div className="space-y-4">
                {emailDrafts.map((draft) => (
                  <motion.div
                    key={draft.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-4 border border-gray-200 rounded-lg hover:border-gray-300 transition-colors"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="font-medium text-gray-900 truncate">{draft.subject}</h3>
                      <span className="text-xs text-gray-500 ml-2">{draft.createdAt.toLocaleDateString()}</span>
                    </div>
                    
                    <div className="text-sm text-gray-600 mb-2">To: {draft.recipient}</div>
                    
                    <div className="text-sm text-gray-700 bg-gray-50 p-3 rounded max-h-32 overflow-y-auto">
                      {draft.content}
                    </div>
                    
                    <div className="flex items-center justify-between mt-3">
                      <span className="text-xs px-2 py-1 bg-gray-100 text-gray-600 rounded">{draft.tone}</span>
                      <div className="flex gap-2">
                        <button className="text-sm text-blue-600 hover:text-blue-700">Edit</button>
                        <button className="text-sm text-green-600 hover:text-green-700">Send</button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PersonalAssistantPage; 