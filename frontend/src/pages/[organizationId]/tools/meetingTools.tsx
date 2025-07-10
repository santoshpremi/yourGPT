import React, { useState } from 'react';
import { trpc } from '../../../utils/trpc';
import { 
  MicrophoneIcon, 
  DocumentTextIcon, 
  PlayIcon, 
  PauseIcon,
  StopIcon,
  CloudArrowUpIcon,
  ClockIcon,
  UsersIcon
} from '@heroicons/react/24/outline';
import { motion } from 'framer-motion';

interface Meeting {
  id: string;
  title: string;
  duration: number;
  participants: number;
  date: Date;
  status: 'recording' | 'processing' | 'completed';
  transcription?: string;
  summary?: string;
  actionItems?: string[];
}

const MeetingToolsPage: React.FC = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [selectedMeeting, setSelectedMeeting] = useState<Meeting | null>(null);
  const [meetings, setMeetings] = useState<Meeting[]>([
    {
      id: '1',
      title: 'Product Planning Meeting',
      duration: 3600,
      participants: 5,
      date: new Date(2024, 0, 15),
      status: 'completed',
      transcription: 'This is a mock transcription of the product planning meeting. We discussed the new feature roadmap for Q2 2024, including the integration of AI tools and workflow automation. The team agreed on the priority features and timeline.',
      summary: 'Product planning session focused on Q2 2024 roadmap. Key decisions made on AI integration and workflow features.',
      actionItems: [
        'Finalize AI model selection by next Friday',
        'Create detailed wireframes for workflow builder',
        'Schedule user interviews for validation'
      ]
    },
    {
      id: '2',
      title: 'Weekly Standup',
      duration: 1800,
      participants: 8,
      date: new Date(2024, 0, 12),
      status: 'completed',
      transcription: 'Team standup meeting covering progress updates from each team member. Backend team reported completion of API endpoints, frontend team shared UI component updates.',
      summary: 'Weekly progress update. All teams on track with current sprint goals.',
      actionItems: [
        'Deploy staging environment updates',
        'Review code changes for security'
      ]
    },
    {
      id: '3',
      title: 'Client Presentation',
      duration: 2700,
      participants: 3,
      date: new Date(2024, 0, 10),
      status: 'processing'
    }
  ]);

  const { data: productConfig } = trpc.productConfig.get.useQuery();

  React.useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isRecording) {
      interval = setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isRecording]);

  const handleStartRecording = () => {
    setIsRecording(true);
    setRecordingTime(0);
  };

  const handleStopRecording = () => {
    setIsRecording(false);
    
    // Create new meeting record
    const newMeeting: Meeting = {
      id: Date.now().toString(),
      title: `Meeting ${new Date().toLocaleDateString()}`,
      duration: recordingTime,
      participants: Math.floor(Math.random() * 10) + 1,
      date: new Date(),
      status: 'processing'
    };
    
    setMeetings(prev => [newMeeting, ...prev]);
    setRecordingTime(0);
    
    // Mock processing
    setTimeout(() => {
      setMeetings(prev => prev.map(meeting => 
        meeting.id === newMeeting.id 
          ? {
              ...meeting,
              status: 'completed' as const,
              transcription: 'This is a mock transcription of your recorded meeting. The AI has processed the audio and converted it to text with high accuracy.',
              summary: 'Meeting summary: Key discussion points covered project updates and next steps.',
              actionItems: ['Follow up on discussed items', 'Schedule next review meeting']
            }
          : meeting
      ));
    }, 5000);
  };

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
  };

  const formatDuration = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    
    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    }
    return `${minutes}m`;
  };

  return (
    <div className="h-full bg-gray-50 p-6 overflow-auto">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <MicrophoneIcon className="w-8 h-8 text-blue-600" />
            <h1 className="text-3xl font-bold text-gray-900">Meeting Tools</h1>
          </div>
          <p className="text-gray-600">Record, transcribe, and summarize your meetings with AI</p>
          <div className="mt-2 flex items-center gap-4 text-sm text-gray-500">
            <span className="flex items-center gap-1">
              <span className={`w-2 h-2 rounded-full ${productConfig?.meetingTranscription ? 'bg-green-500' : 'bg-red-500'}`} />
              Transcription: {productConfig?.meetingTranscription ? 'Enabled' : 'Disabled'}
            </span>
            <span className="flex items-center gap-1">
              <span className={`w-2 h-2 rounded-full ${productConfig?.meetingSummarizer ? 'bg-green-500' : 'bg-red-500'}`} />
              Summarization: {productConfig?.meetingSummarizer ? 'Enabled' : 'Disabled'}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Recording Panel */}
          <div className="lg:col-span-1 space-y-6">
            {/* Live Recording */}
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <MicrophoneIcon className="w-5 h-5 text-blue-600" />
                Live Recording
              </h2>

              <div className="text-center space-y-4">
                {/* Recording Status */}
                <div className={`w-24 h-24 mx-auto rounded-full flex items-center justify-center ${
                  isRecording ? 'bg-red-100 border-4 border-red-500' : 'bg-gray-100 border-4 border-gray-300'
                }`}>
                  <MicrophoneIcon className={`w-10 h-10 ${isRecording ? 'text-red-600' : 'text-gray-400'}`} />
                </div>

                {/* Timer */}
                <div className="text-2xl font-mono font-bold text-gray-900">
                  {formatTime(recordingTime)}
                </div>

                {/* Recording Indicator */}
                {isRecording && (
                  <div className="flex items-center justify-center gap-2 text-red-600">
                    <div className="w-2 h-2 bg-red-600 rounded-full animate-pulse" />
                    <span className="text-sm font-medium">Recording...</span>
                  </div>
                )}

                {/* Controls */}
                <div className="flex justify-center gap-3">
                  {!isRecording ? (
                    <button
                      onClick={handleStartRecording}
                      className="bg-red-600 text-white p-3 rounded-full hover:bg-red-700 transition-colors"
                    >
                      <PlayIcon className="w-6 h-6" />
                    </button>
                  ) : (
                    <>
                      <button
                        onClick={() => setIsRecording(false)}
                        className="bg-yellow-600 text-white p-3 rounded-full hover:bg-yellow-700 transition-colors"
                      >
                        <PauseIcon className="w-6 h-6" />
                      </button>
                      <button
                        onClick={handleStopRecording}
                        className="bg-gray-600 text-white p-3 rounded-full hover:bg-gray-700 transition-colors"
                      >
                        <StopIcon className="w-6 h-6" />
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>

            {/* Upload File */}
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <CloudArrowUpIcon className="w-5 h-5 text-gray-600" />
                Upload Recording
              </h3>
              
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors cursor-pointer">
                <CloudArrowUpIcon className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                <p className="text-sm text-gray-600 mb-2">Drop your audio/video file here</p>
                <p className="text-xs text-gray-500">Supports MP3, MP4, WAV, MOV</p>
                <button className="mt-3 bg-blue-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-700">
                  Choose File
                </button>
              </div>
            </div>
          </div>

          {/* Meetings List */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h2 className="text-lg font-semibold mb-4">Recent Meetings</h2>
              
              <div className="space-y-4">
                {meetings.map((meeting) => (
                  <motion.div
                    key={meeting.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                      selectedMeeting?.id === meeting.id
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                    onClick={() => setSelectedMeeting(meeting)}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-medium text-gray-900">{meeting.title}</h3>
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        meeting.status === 'completed' ? 'bg-green-100 text-green-800' :
                        meeting.status === 'processing' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-blue-100 text-blue-800'
                      }`}>
                        {meeting.status}
                      </span>
                    </div>
                    
                    <div className="flex items-center gap-4 text-sm text-gray-500">
                      <span className="flex items-center gap-1">
                        <ClockIcon className="w-4 h-4" />
                        {formatDuration(meeting.duration)}
                      </span>
                      <span className="flex items-center gap-1">
                        <UsersIcon className="w-4 h-4" />
                        {meeting.participants} participants
                      </span>
                      <span>{meeting.date.toLocaleDateString()}</span>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Meeting Details */}
            {selectedMeeting && (
              <div className="bg-white rounded-lg shadow-sm border p-6">
                <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <DocumentTextIcon className="w-5 h-5 text-blue-600" />
                  {selectedMeeting.title}
                </h2>

                {selectedMeeting.status === 'processing' ? (
                  <div className="text-center py-8">
                    <div className="animate-spin w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full mx-auto mb-4" />
                    <p className="text-gray-600">Processing meeting content...</p>
                  </div>
                ) : selectedMeeting.status === 'completed' ? (
                  <div className="space-y-6">
                    {/* Summary */}
                    <div>
                      <h3 className="font-medium text-gray-900 mb-2">Summary</h3>
                      <p className="text-gray-700 bg-gray-50 p-3 rounded-lg">{selectedMeeting.summary}</p>
                    </div>

                    {/* Action Items */}
                    <div>
                      <h3 className="font-medium text-gray-900 mb-2">Action Items</h3>
                      <ul className="space-y-2">
                        {selectedMeeting.actionItems?.map((item, index) => (
                          <li key={index} className="flex items-start gap-2">
                            <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0" />
                            <span className="text-gray-700">{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Transcription */}
                    <div>
                      <h3 className="font-medium text-gray-900 mb-2">Full Transcription</h3>
                      <div className="bg-gray-50 p-4 rounded-lg max-h-96 overflow-y-auto">
                        <p className="text-gray-700 whitespace-pre-wrap">{selectedMeeting.transcription}</p>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-3 pt-4 border-t">
                      <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
                        Export PDF
                      </button>
                      <button className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700">
                        Share
                      </button>
                      <button className="border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50">
                        Edit Notes
                      </button>
                    </div>
                  </div>
                ) : null}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MeetingToolsPage; 