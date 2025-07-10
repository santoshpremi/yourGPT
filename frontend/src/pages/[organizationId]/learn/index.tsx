import React, { useState } from 'react';
import { trpc } from '../../../utils/trpc';
import { 
  AcademicCapIcon, 
  StarIcon, 
  TrophyIcon,
  BookOpenIcon,
  ClockIcon,
  ChartBarIcon,
  PlayIcon,
  CheckCircleIcon
} from '@heroicons/react/24/outline';
import { motion } from 'framer-motion';

interface Course {
  id: string;
  title: string;
  description: string;
  category: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  duration: number; // in minutes
  lessons: number;
  completed: number;
  progress: number;
  instructor: string;
  rating: number;
  enrolled: boolean;
  thumbnail: string;
}

interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  earned: boolean;
  earnedAt?: Date;
  progress?: number;
  requirement?: number;
}

const LearnPage: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  
  const { data: gamificationData } = trpc.academy.gamification.xp.useQuery();

  const [courses, setCourses] = useState<Course[]>([
    {
      id: '1',
      title: 'Introduction to AI Prompting',
      description: 'Learn the fundamentals of effective AI prompt engineering to get better results from AI models.',
      category: 'AI Basics',
      difficulty: 'beginner',
      duration: 45,
      lessons: 8,
      completed: 6,
      progress: 75,
      instructor: 'Dr. Sarah Chen',
      rating: 4.8,
      enrolled: true,
      thumbnail: 'https://picsum.photos/400/200?random=1'
    },
    {
      id: '2',
      title: 'Advanced Workflow Automation',
      description: 'Master complex workflow automation techniques to boost your productivity.',
      category: 'Workflows',
      difficulty: 'advanced',
      duration: 120,
      lessons: 15,
      completed: 0,
      progress: 0,
      instructor: 'Michael Rodriguez',
      rating: 4.9,
      enrolled: false,
      thumbnail: 'https://picsum.photos/400/200?random=2'
    },
    {
      id: '3',
      title: 'AI Ethics and Best Practices',
      description: 'Understanding responsible AI usage and ethical considerations in the workplace.',
      category: 'Ethics',
      difficulty: 'intermediate',
      duration: 90,
      lessons: 12,
      completed: 12,
      progress: 100,
      instructor: 'Dr. Emma Thompson',
      rating: 4.7,
      enrolled: true,
      thumbnail: 'https://picsum.photos/400/200?random=3'
    },
    {
      id: '4',
      title: 'Data Analysis with AI Tools',
      description: 'Learn how to leverage AI for data analysis and visualization tasks.',
      category: 'Data Science',
      difficulty: 'intermediate',
      duration: 75,
      lessons: 10,
      completed: 3,
      progress: 30,
      instructor: 'Alex Johnson',
      rating: 4.6,
      enrolled: true,
      thumbnail: 'https://picsum.photos/400/200?random=4'
    },
    {
      id: '5',
      title: 'Creative Writing with AI',
      description: 'Enhance your creative writing skills using AI as a collaborative partner.',
      category: 'Creative',
      difficulty: 'beginner',
      duration: 60,
      lessons: 9,
      completed: 0,
      progress: 0,
      instructor: 'Lisa Park',
      rating: 4.5,
      enrolled: false,
      thumbnail: 'https://picsum.photos/400/200?random=5'
    },
    {
      id: '6',
      title: 'AI in Business Strategy',
      description: 'Strategic implementation of AI tools in business processes and decision making.',
      category: 'Business',
      difficulty: 'advanced',
      duration: 150,
      lessons: 18,
      completed: 0,
      progress: 0,
      instructor: 'Robert Kim',
      rating: 4.8,
      enrolled: false,
      thumbnail: 'https://picsum.photos/400/200?random=6'
    }
  ]);

  const [achievements] = useState<Achievement[]>([
    {
      id: '1',
      title: 'First Steps',
      description: 'Complete your first lesson',
      icon: '🎯',
      earned: true,
      earnedAt: new Date(2024, 1, 10)
    },
    {
      id: '2',
      title: 'Course Completion',
      description: 'Complete your first course',
      icon: '🏆',
      earned: true,
      earnedAt: new Date(2024, 1, 15)
    },
    {
      id: '3',
      title: 'Speed Learner',
      description: 'Complete 5 lessons in one day',
      icon: '⚡',
      earned: false,
      progress: 3,
      requirement: 5
    },
    {
      id: '4',
      title: 'Knowledge Seeker',
      description: 'Enroll in 5 different courses',
      icon: '📚',
      earned: false,
      progress: 3,
      requirement: 5
    },
    {
      id: '5',
      title: 'Perfectionist',
      description: 'Score 95% or higher on 10 quizzes',
      icon: '⭐',
      earned: false,
      progress: 7,
      requirement: 10
    },
    {
      id: '6',
      title: 'Master Learner',
      description: 'Complete 10 courses',
      icon: '🎓',
      earned: false,
      progress: 1,
      requirement: 10
    }
  ]);

  const categories = [
    { id: 'all', name: 'All Courses', count: courses.length },
    { id: 'AI Basics', name: 'AI Basics', count: courses.filter(c => c.category === 'AI Basics').length },
    { id: 'Workflows', name: 'Workflows', count: courses.filter(c => c.category === 'Workflows').length },
    { id: 'Ethics', name: 'Ethics', count: courses.filter(c => c.category === 'Ethics').length },
    { id: 'Data Science', name: 'Data Science', count: courses.filter(c => c.category === 'Data Science').length },
    { id: 'Creative', name: 'Creative', count: courses.filter(c => c.category === 'Creative').length },
    { id: 'Business', name: 'Business', count: courses.filter(c => c.category === 'Business').length }
  ];

  const filteredCourses = selectedCategory === 'all' 
    ? courses 
    : courses.filter(course => course.category === selectedCategory);

  const enrolledCourses = courses.filter(course => course.enrolled);
  const completedCourses = courses.filter(course => course.progress === 100);
  const earnedAchievements = achievements.filter(achievement => achievement.earned);

  const getDifficultyColor = (difficulty: string) => {
    const colors = {
      beginner: 'text-green-600 bg-green-100',
      intermediate: 'text-yellow-600 bg-yellow-100',
      advanced: 'text-red-600 bg-red-100'
    };
    return colors[difficulty as keyof typeof colors] || 'text-gray-600 bg-gray-100';
  };

  const enrollInCourse = (courseId: string) => {
    setCourses(prev => prev.map(course => 
      course.id === courseId ? { ...course, enrolled: true } : course
    ));
  };

  return (
    <div className="h-full bg-gray-50 p-6 overflow-auto">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <AcademicCapIcon className="w-8 h-8 text-purple-600" />
            <h1 className="text-3xl font-bold text-gray-900">DeinGPT Academy</h1>
          </div>
          <p className="text-gray-600">Master AI productivity tools with interactive courses and hands-on learning</p>
        </div>

        {/* Stats Dashboard */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          {/* XP and Level */}
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                <StarIcon className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900">{gamificationData?.xp || 0}</div>
                <div className="text-sm text-gray-500">Experience Points</div>
              </div>
            </div>
            <div className="mt-3">
              <div className="flex items-center justify-between text-sm mb-1">
                <span>Level {gamificationData?.currentLevel || 1}</span>
                <span>{gamificationData?.currentLevelProgress || 0}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-purple-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${gamificationData?.currentLevelProgress || 0}%` }}
                />
              </div>
              <div className="text-xs text-gray-500 mt-1">
                {gamificationData?.xpNeededForNextLevel || 0} XP to next level
              </div>
            </div>
          </div>

          {/* Enrolled Courses */}
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                <BookOpenIcon className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900">{enrolledCourses.length}</div>
                <div className="text-sm text-gray-500">Enrolled Courses</div>
              </div>
            </div>
          </div>

          {/* Completed Courses */}
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                <CheckCircleIcon className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900">{completedCourses.length}</div>
                <div className="text-sm text-gray-500">Completed</div>
              </div>
            </div>
          </div>

          {/* Achievements */}
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-yellow-100 rounded-full flex items-center justify-center">
                <TrophyIcon className="w-5 h-5 text-yellow-600" />
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900">{earnedAchievements.length}</div>
                <div className="text-sm text-gray-500">Achievements</div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            {/* Categories */}
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h2 className="text-lg font-semibold mb-4">Categories</h2>
              <div className="space-y-2">
                {categories.map((category) => (
                  <button
                    key={category.id}
                    onClick={() => setSelectedCategory(category.id)}
                    className={`w-full text-left p-3 rounded-lg transition-colors ${
                      selectedCategory === category.id
                        ? 'bg-purple-100 text-purple-800 border border-purple-200'
                        : 'hover:bg-gray-50 border border-transparent'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-medium">{category.name}</span>
                      <span className="text-sm text-gray-500">{category.count}</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Recent Achievements */}
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <TrophyIcon className="w-5 h-5 text-yellow-600" />
                Achievements
              </h2>
              <div className="space-y-3">
                {achievements.slice(0, 5).map((achievement) => (
                  <div
                    key={achievement.id}
                    className={`p-3 rounded-lg border ${
                      achievement.earned 
                        ? 'border-yellow-200 bg-yellow-50' 
                        : 'border-gray-200 bg-gray-50'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="text-2xl">{achievement.icon}</div>
                      <div className="flex-1">
                        <div className={`font-medium ${
                          achievement.earned ? 'text-yellow-800' : 'text-gray-600'
                        }`}>
                          {achievement.title}
                        </div>
                        <div className="text-xs text-gray-500">{achievement.description}</div>
                        {!achievement.earned && achievement.progress && achievement.requirement && (
                          <div className="mt-1">
                            <div className="text-xs text-gray-500 mb-1">
                              {achievement.progress}/{achievement.requirement}
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-1">
                              <div 
                                className="bg-purple-600 h-1 rounded-full"
                                style={{ width: `${(achievement.progress / achievement.requirement) * 100}%` }}
                              />
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3 space-y-6">
            {/* In Progress Courses */}
            {enrolledCourses.filter(course => course.progress > 0 && course.progress < 100).length > 0 && (
              <div className="bg-white rounded-lg shadow-sm border p-6">
                <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <ChartBarIcon className="w-5 h-5 text-blue-600" />
                  Continue Learning
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {enrolledCourses
                    .filter(course => course.progress > 0 && course.progress < 100)
                    .slice(0, 2)
                    .map((course) => (
                      <motion.div
                        key={course.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="border border-gray-200 rounded-lg p-4 hover:border-gray-300 transition-colors"
                      >
                        <div className="flex items-start gap-3">
                          <img
                            src={course.thumbnail}
                            alt={course.title}
                            className="w-16 h-12 object-cover rounded"
                          />
                          <div className="flex-1">
                            <h3 className="font-medium text-gray-900 mb-1">{course.title}</h3>
                            <div className="text-sm text-gray-500 mb-2">
                              {course.completed}/{course.lessons} lessons completed
                            </div>
                            <div className="mb-3">
                              <div className="flex items-center justify-between text-sm mb-1">
                                <span className="text-gray-600">Progress</span>
                                <span className="text-blue-600 font-medium">{course.progress}%</span>
                              </div>
                              <div className="w-full bg-gray-200 rounded-full h-2">
                                <div 
                                  className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                                  style={{ width: `${course.progress}%` }}
                                />
                              </div>
                            </div>
                            <button className="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700 flex items-center gap-1">
                              <PlayIcon className="w-3 h-3" />
                              Continue
                            </button>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                </div>
              </div>
            )}

            {/* Course Grid */}
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold">
                  {selectedCategory === 'all' ? 'All Courses' : `${selectedCategory} Courses`}
                </h2>
                <div className="text-sm text-gray-500">
                  {filteredCourses.length} courses available
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredCourses.map((course) => (
                  <motion.div
                    key={course.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="border border-gray-200 rounded-lg overflow-hidden hover:border-gray-300 transition-colors"
                  >
                    <img
                      src={course.thumbnail}
                      alt={course.title}
                      className="w-full h-32 object-cover"
                    />
                    
                    <div className="p-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className={`text-xs px-2 py-1 rounded-full ${getDifficultyColor(course.difficulty)}`}>
                          {course.difficulty}
                        </span>
                        <div className="flex items-center gap-1">
                          <StarIcon className="w-3 h-3 text-yellow-500 fill-current" />
                          <span className="text-xs text-gray-600">{course.rating}</span>
                        </div>
                      </div>
                      
                      <h3 className="font-medium text-gray-900 mb-2">{course.title}</h3>
                      <p className="text-sm text-gray-600 mb-3 line-clamp-2">{course.description}</p>
                      
                      <div className="flex items-center gap-4 text-xs text-gray-500 mb-3">
                        <span className="flex items-center gap-1">
                          <ClockIcon className="w-3 h-3" />
                          {course.duration}m
                        </span>
                        <span className="flex items-center gap-1">
                          <BookOpenIcon className="w-3 h-3" />
                          {course.lessons} lessons
                        </span>
                      </div>

                      <div className="text-xs text-gray-500 mb-3">
                        Instructor: {course.instructor}
                      </div>

                      {course.enrolled ? (
                        <div className="space-y-3">
                          {course.progress > 0 && (
                            <div>
                              <div className="flex items-center justify-between text-sm mb-1">
                                <span className="text-gray-600">Progress</span>
                                <span className="text-blue-600 font-medium">{course.progress}%</span>
                              </div>
                              <div className="w-full bg-gray-200 rounded-full h-2">
                                <div 
                                  className="bg-blue-600 h-2 rounded-full"
                                  style={{ width: `${course.progress}%` }}
                                />
                              </div>
                            </div>
                          )}
                          <button className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 flex items-center justify-center gap-2">
                            {course.progress === 100 ? (
                              <>
                                <CheckCircleIcon className="w-4 h-4" />
                                Completed
                              </>
                            ) : course.progress > 0 ? (
                              <>
                                <PlayIcon className="w-4 h-4" />
                                Continue
                              </>
                            ) : (
                              <>
                                <PlayIcon className="w-4 h-4" />
                                Start Course
                              </>
                            )}
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => enrollInCourse(course.id)}
                          className="w-full border border-blue-600 text-blue-600 py-2 px-4 rounded hover:bg-blue-50"
                        >
                          Enroll Now
                        </button>
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LearnPage; 