import React, { useState } from 'react';
import { 
  PlusIcon, 
  TrashIcon,
  Cog6ToothIcon,
  PlayIcon,
  DocumentTextIcon,
  ChatBubbleLeftRightIcon,
  PhotoIcon,
  MagnifyingGlassIcon,
  BoltIcon
} from '@heroicons/react/24/outline';
import { motion } from 'framer-motion';

interface WorkflowStep {
  id: string;
  type: 'input' | 'ai-chat' | 'image-gen' | 'research' | 'transform' | 'output';
  title: string;
  description: string;
  config: Record<string, any>;
  position: { x: number; y: number };
}

interface WorkflowConnection {
  from: string;
  to: string;
}

interface Workflow {
  id: string;
  name: string;
  description: string;
  steps: WorkflowStep[];
  connections: WorkflowConnection[];
}

const WorkflowBuilder: React.FC = () => {
  const [workflow, setWorkflow] = useState<Workflow>({
    id: '1',
    name: 'Content Creation Pipeline',
    description: 'Automated content creation workflow',
    steps: [
      {
        id: 'step-1',
        type: 'input',
        title: 'Topic Input',
        description: 'Enter the topic for content creation',
        config: { inputType: 'text', placeholder: 'Enter topic...' },
        position: { x: 50, y: 100 }
      },
      {
        id: 'step-2',
        type: 'ai-chat',
        title: 'Content Outline',
        description: 'Generate content outline using AI',
        config: { model: 'gpt-4o', prompt: 'Create a detailed outline for: {input}' },
        position: { x: 300, y: 100 }
      },
      {
        id: 'step-3',
        type: 'ai-chat',
        title: 'Write Content',
        description: 'Generate full content based on outline',
        config: { model: 'gpt-4o', prompt: 'Write detailed content based on this outline: {step-2}' },
        position: { x: 550, y: 100 }
      }
    ],
    connections: [
      { from: 'step-1', to: 'step-2' },
      { from: 'step-2', to: 'step-3' }
    ]
  });

  const [selectedStep, setSelectedStep] = useState<string | null>(null);
  const [isRunning, setIsRunning] = useState(false);

  const stepTypes = [
    {
      type: 'input',
      title: 'Input',
      description: 'Collect user input',
      icon: DocumentTextIcon,
      color: 'blue'
    },
    {
      type: 'ai-chat',
      title: 'AI Chat',
      description: 'Process with AI model',
      icon: ChatBubbleLeftRightIcon,
      color: 'green'
    },
    {
      type: 'image-gen',
      title: 'Image Generation',
      description: 'Generate images with AI',
      icon: PhotoIcon,
      color: 'purple'
    },
    {
      type: 'research',
      title: 'Research',
      description: 'Web search and research',
      icon: MagnifyingGlassIcon,
      color: 'orange'
    },
    {
      type: 'transform',
      title: 'Transform',
      description: 'Process and transform data',
      icon: BoltIcon,
      color: 'yellow'
    },
    {
      type: 'output',
      title: 'Output',
      description: 'Display or export results',
      icon: DocumentTextIcon,
      color: 'gray'
    }
  ];

  const addStep = (type: string) => {
    const newStep: WorkflowStep = {
      id: `step-${Date.now()}`,
      type: type as any,
      title: stepTypes.find(t => t.type === type)?.title || 'New Step',
      description: stepTypes.find(t => t.type === type)?.description || '',
      config: {},
      position: { 
        x: Math.random() * 400 + 100, 
        y: Math.random() * 300 + 150 
      }
    };

    setWorkflow(prev => ({
      ...prev,
      steps: [...prev.steps, newStep]
    }));
  };

  const deleteStep = (stepId: string) => {
    setWorkflow(prev => ({
      ...prev,
      steps: prev.steps.filter(step => step.id !== stepId),
      connections: prev.connections.filter(conn => conn.from !== stepId && conn.to !== stepId)
    }));
  };

  const updateStep = (stepId: string, updates: Partial<WorkflowStep>) => {
    setWorkflow(prev => ({
      ...prev,
      steps: prev.steps.map(step => 
        step.id === stepId ? { ...step, ...updates } : step
      )
    }));
  };

  const connectSteps = (fromId: string, toId: string) => {
    if (fromId === toId) return;
    
    const connectionExists = workflow.connections.some(
      conn => conn.from === fromId && conn.to === toId
    );
    
    if (connectionExists) return;

    setWorkflow(prev => ({
      ...prev,
      connections: [...prev.connections, { from: fromId, to: toId }]
    }));
  };

  const runWorkflow = async () => {
    setIsRunning(true);
    
    // Mock workflow execution
    setTimeout(() => {
      setIsRunning(false);
      alert('Workflow executed successfully!');
    }, 3000);
  };

  const getStepIcon = (type: string) => {
    const stepType = stepTypes.find(t => t.type === type);
    return stepType?.icon || DocumentTextIcon;
  };

  const getStepColor = (type: string) => {
    const stepType = stepTypes.find(t => t.type === type);
    const colors = {
      blue: 'border-blue-500 bg-blue-50 text-blue-700',
      green: 'border-green-500 bg-green-50 text-green-700',
      purple: 'border-purple-500 bg-purple-50 text-purple-700',
      orange: 'border-orange-500 bg-orange-50 text-orange-700',
      yellow: 'border-yellow-500 bg-yellow-50 text-yellow-700',
      gray: 'border-gray-500 bg-gray-50 text-gray-700'
    };
    return colors[stepType?.color as keyof typeof colors] || colors.gray;
  };

  return (
    <div className="h-full bg-gray-50 p-6 overflow-auto">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6 bg-white rounded-lg shadow-sm border p-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 mb-2">{workflow.name}</h1>
              <p className="text-gray-600">{workflow.description}</p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={runWorkflow}
                disabled={isRunning}
                className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 disabled:opacity-50 flex items-center gap-2"
              >
                {isRunning ? (
                  <>
                    <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full" />
                    Running...
                  </>
                ) : (
                  <>
                    <PlayIcon className="w-4 h-4" />
                    Run Workflow
                  </>
                )}
              </button>
              <button className="border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50">
                Save
              </button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Step Palette */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h2 className="text-lg font-semibold mb-4">Step Types</h2>
              <div className="space-y-3">
                {stepTypes.map((stepType) => (
                  <motion.button
                    key={stepType.type}
                    onClick={() => addStep(stepType.type)}
                    className="w-full text-left p-3 border border-gray-200 rounded-lg hover:border-gray-300 hover:bg-gray-50 transition-colors"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <div className="flex items-center gap-3">
                      <stepType.icon className="w-5 h-5 text-gray-600" />
                      <div>
                        <div className="font-medium text-sm text-gray-900">{stepType.title}</div>
                        <div className="text-xs text-gray-500">{stepType.description}</div>
                      </div>
                    </div>
                  </motion.button>
                ))}
              </div>
            </div>
          </div>

          {/* Workflow Canvas */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-sm border p-6 h-[600px] relative overflow-hidden">
              <h2 className="text-lg font-semibold mb-4">Workflow Canvas</h2>
              
              {/* Canvas Area */}
              <div className="relative w-full h-full bg-gray-50 rounded-lg border-2 border-dashed border-gray-300 overflow-auto">
                {/* Connection Lines */}
                <svg className="absolute inset-0 w-full h-full pointer-events-none">
                  {workflow.connections.map((connection, index) => {
                    const fromStep = workflow.steps.find(s => s.id === connection.from);
                    const toStep = workflow.steps.find(s => s.id === connection.to);
                    
                    if (!fromStep || !toStep) return null;
                    
                    return (
                      <line
                        key={index}
                        x1={fromStep.position.x + 120}
                        y1={fromStep.position.y + 40}
                        x2={toStep.position.x}
                        y2={toStep.position.y + 40}
                        stroke="#6B7280"
                        strokeWidth="2"
                        markerEnd="url(#arrowhead)"
                      />
                    );
                  })}
                  <defs>
                    <marker
                      id="arrowhead"
                      markerWidth="10"
                      markerHeight="7"
                      refX="10"
                      refY="3.5"
                      orient="auto"
                    >
                      <polygon
                        points="0 0, 10 3.5, 0 7"
                        fill="#6B7280"
                      />
                    </marker>
                  </defs>
                </svg>

                {/* Workflow Steps */}
                {workflow.steps.map((step) => {
                  const StepIcon = getStepIcon(step.type);
                  
                  return (
                    <motion.div
                      key={step.id}
                      className={`absolute w-32 h-20 border-2 rounded-lg cursor-pointer transition-all ${
                        selectedStep === step.id 
                          ? 'ring-2 ring-blue-500 ring-offset-2' 
                          : ''
                      } ${getStepColor(step.type)}`}
                      style={{
                        left: step.position.x,
                        top: step.position.y
                      }}
                      onClick={() => setSelectedStep(step.id)}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      drag
                      onDragEnd={(_event, info) => {
                        const newX = Math.max(0, step.position.x + info.offset.x);
                        const newY = Math.max(0, step.position.y + info.offset.y);
                        updateStep(step.id, {
                          position: { x: newX, y: newY }
                        });
                      }}
                    >
                      <div className="p-2 h-full flex flex-col">
                        <div className="flex items-center gap-2 mb-1">
                          <StepIcon className="w-4 h-4" />
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              deleteStep(step.id);
                            }}
                            className="ml-auto text-red-500 hover:text-red-700"
                          >
                            <TrashIcon className="w-3 h-3" />
                          </button>
                        </div>
                        <div className="text-xs font-medium truncate">{step.title}</div>
                        <div className="text-xs opacity-75 truncate">{step.description}</div>
                      </div>
                    </motion.div>
                  );
                })}

                {/* Drop Zone Message */}
                {workflow.steps.length === 0 && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center text-gray-500">
                      <PlusIcon className="w-12 h-12 mx-auto mb-4 opacity-50" />
                      <p>Drag step types here to build your workflow</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Properties Panel */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Cog6ToothIcon className="w-5 h-5" />
                Properties
              </h2>
              
              {selectedStep ? (
                <div className="space-y-4">
                  {(() => {
                    const step = workflow.steps.find(s => s.id === selectedStep);
                    if (!step) return null;

                    return (
                      <>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Step Title
                          </label>
                          <input
                            type="text"
                            value={step.title}
                            onChange={(e) => updateStep(step.id, { title: e.target.value })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Description
                          </label>
                          <textarea
                            value={step.description}
                            onChange={(e) => updateStep(step.id, { description: e.target.value })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                            rows={3}
                          />
                        </div>

                        {/* Type-specific configuration */}
                        {step.type === 'ai-chat' && (
                          <>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">
                                AI Model
                              </label>
                              <select
                                value={step.config.model || 'gpt-4o'}
                                onChange={(e) => updateStep(step.id, { 
                                  config: { ...step.config, model: e.target.value }
                                })}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                              >
                                <option value="gpt-4o">GPT-4o</option>
                                <option value="gpt-4o-mini">GPT-4o Mini</option>
                                <option value="claude-3-5-sonnet">Claude 3.5 Sonnet</option>
                                <option value="gemini-pro">Gemini Pro</option>
                              </select>
                            </div>

                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">
                                Prompt Template
                              </label>
                              <textarea
                                value={step.config.prompt || ''}
                                onChange={(e) => updateStep(step.id, { 
                                  config: { ...step.config, prompt: e.target.value }
                                })}
                                placeholder="Enter your prompt template..."
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                                rows={4}
                              />
                              <div className="text-xs text-gray-500 mt-1">
                                Use {`{input}`} to reference previous step outputs
                              </div>
                            </div>
                          </>
                        )}

                        {step.type === 'input' && (
                          <>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">
                                Input Type
                              </label>
                              <select
                                value={step.config.inputType || 'text'}
                                onChange={(e) => updateStep(step.id, { 
                                  config: { ...step.config, inputType: e.target.value }
                                })}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                              >
                                <option value="text">Text</option>
                                <option value="number">Number</option>
                                <option value="file">File Upload</option>
                                <option value="image">Image Upload</option>
                              </select>
                            </div>

                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">
                                Placeholder
                              </label>
                              <input
                                type="text"
                                value={step.config.placeholder || ''}
                                onChange={(e) => updateStep(step.id, { 
                                  config: { ...step.config, placeholder: e.target.value }
                                })}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                              />
                            </div>
                          </>
                        )}

                        {/* Connection Management */}
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Connect to Step
                          </label>
                          <select
                            onChange={(e) => {
                              if (e.target.value) {
                                connectSteps(step.id, e.target.value);
                                e.target.value = '';
                              }
                            }}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          >
                            <option value="">Select step to connect...</option>
                            {workflow.steps
                              .filter(s => s.id !== step.id)
                              .map(s => (
                                <option key={s.id} value={s.id}>
                                  {s.title}
                                </option>
                              ))}
                          </select>
                        </div>
                      </>
                    );
                  })()}
                </div>
              ) : (
                <div className="text-center text-gray-500 py-8">
                  <Cog6ToothIcon className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>Select a step to configure its properties</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WorkflowBuilder; 