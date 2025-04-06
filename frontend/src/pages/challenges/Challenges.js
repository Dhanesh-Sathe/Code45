import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Users, 
  Award, 
  TrendingUp, 
  Clock, 
  Star,
  BookOpen,
  Code,
  HelpCircle,
  AlertCircle
} from 'react-feather';
import { useNavigate } from 'react-router-dom';

export default function Challenges() {
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [loading, setLoading] = useState(false);
  
  const navigate = useNavigate();

  // Static challenge data
  const staticChallenges = [
    {
      id: '1',
      title: 'JavaScript Basics Quiz',
      description: 'Test your knowledge of JavaScript fundamentals',
      type: 'quiz',
      icon: <HelpCircle className="text-purple-500" />,
      colorClass: 'bg-purple-50 border-purple-200',
      difficulty: 'Beginner',
      points: 100,
      timeLimit: '30 minutes',
      participants: 25,
      status: 'active',
      progress: 0,
      topic: 'JavaScript'
    },
    {
      id: '2',
      title: 'React Components Challenge',
      description: 'Build a reusable React component from scratch',
      type: 'coding',
      icon: <Code className="text-green-500" />,
      colorClass: 'bg-green-50 border-green-200',
      difficulty: 'Intermediate',
      points: 250,
      timeLimit: '45 minutes',
      participants: 15,
      status: 'active',
      progress: 30,
      topic: 'React'
    },
    {
      id: '3',
      title: 'Peer Code Review',
      description: 'Review and provide feedback on peer code',
      type: 'peer',
      icon: <Users className="text-blue-500" />,
      colorClass: 'bg-blue-50 border-blue-200',
      difficulty: 'Intermediate',
      points: 150,
      timeLimit: '60 minutes',
      participants: 20,
      status: 'completed',
      progress: 100,
      topic: 'Code Review'
    },
    {
      id: '4',
      title: 'Portfolio Project',
      description: 'Create a personal portfolio website',
      type: 'project',
      icon: <BookOpen className="text-orange-500" />,
      colorClass: 'bg-orange-50 border-orange-200',
      difficulty: 'Advanced',
      points: 500,
      timeLimit: '120 minutes',
      participants: 30,
      status: 'active',
      progress: 60,
      topic: 'Web Development'
    }
  ];

  const [challenges] = useState(staticChallenges);
  const activeChallenges = challenges.filter(c => c.status === 'active');
  const completedChallenges = challenges.filter(c => c.status === 'completed');

  const handleJoinChallenge = async (challengeId) => {
    const challenge = challenges.find(c => c.id === challengeId);
    
    switch (challenge.type) {
      case 'quiz':
        navigate(`/quiz/${challengeId}`);
        break;
      case 'coding':
        navigate(`/coding-challenge/${challengeId}`);
        break;
      case 'peer':
        navigate(`/peer-challenge/${challengeId}`);
        break;
      case 'project':
        navigate(`/project/${challengeId}`);
        break;
      default:
        break;
    }
  };

  const filterChallenges = useMemo(() => {
    switch (selectedFilter) {
      case 'active':
        return challenges.filter(c => c.status === 'active');
      case 'completed':
        return challenges.filter(c => c.status === 'completed');
      case 'peer':
      case 'quiz':
      case 'coding':
      case 'project':
        return challenges.filter(c => c.type === selectedFilter);
      default:
        return challenges;
    }
  }, [challenges, selectedFilter]);

  // Animation variants
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
      opacity: 1
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      {/* Header Section */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Learning Challenges</h1>
        <p className="text-gray-600">
          Engage in interactive challenges to enhance your learning journey
        </p>
      </motion.div>

      {/* Stats Overview */}
      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8"
      >
        {[
          {
            icon: <Award className="text-yellow-500" />,
            label: "Total Points",
            value: completedChallenges.reduce((sum, c) => sum + c.points, 0)
          },
          {
            icon: <TrendingUp className="text-green-500" />,
            label: "Active Challenges",
            value: activeChallenges.length
          },
          {
            icon: <Star className="text-purple-500" />,
            label: "Completed",
            value: completedChallenges.length
          },
          {
            icon: <Users className="text-blue-500" />,
            label: "Peer Challenges",
            value: challenges.filter(c => c.type === 'peer').length
          }
        ].map((stat, index) => (
          <motion.div
            key={index}
            variants={itemVariants}
            className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow"
          >
            <div className="flex items-center">
              {stat.icon}
              <span className="text-gray-700 ml-2">{stat.label}</span>
            </div>
            <p className="text-2xl font-bold text-gray-800 mt-2">
              {stat.value}
            </p>
          </motion.div>
        ))}
      </motion.div>

      {/* Filters */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-wrap gap-2 mb-6"
      >
        {['all', 'active', 'completed', 'peer', 'quiz', 'coding', 'project'].map(filter => (
          <button
            key={filter}
            onClick={() => setSelectedFilter(filter)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200
              ${selectedFilter === filter
                ? 'bg-blue-600 text-white shadow-md transform scale-105'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
          >
            {filter.charAt(0).toUpperCase() + filter.slice(1)}
          </button>
        ))}
      </motion.div>

      {/* Challenges Grid */}
      <AnimatePresence>
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {filterChallenges.map(challenge => (
            <motion.div
              key={challenge.id}
              variants={itemVariants}
              layoutId={challenge.id}
              className={`${challenge.colorClass} rounded-lg p-6 border transition-all hover:shadow-lg`}
            >
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center">
                  {challenge.icon}
                  <span className="ml-2 text-sm font-medium text-gray-500">
                    {challenge.type.toUpperCase()}
                  </span>
                </div>
                <span className={`px-2 py-1 rounded-full text-xs font-medium
                  ${challenge.status === 'completed' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'}`}>
                  {challenge.status.toUpperCase()}
                </span>
              </div>

              <h3 className="text-lg font-semibold text-gray-800 mb-2">{challenge.title}</h3>
              <p className="text-gray-600 text-sm mb-4">{challenge.description}</p>

              <div className="space-y-2 mb-4">
                <div className="flex items-center text-sm text-gray-600">
                  <Star className="w-4 h-4 mr-2" />
                  <span>Difficulty: {challenge.difficulty}</span>
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <Award className="w-4 h-4 mr-2" />
                  <span>{challenge.points} Points</span>
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <Clock className="w-4 h-4 mr-2" />
                  <span>{challenge.timeLimit}</span>
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <Users className="w-4 h-4 mr-2" />
                  <span>{challenge.participants} Participants</span>
                </div>
              </div>

              {challenge.status === 'active' && (
                <div className="mb-4">
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <motion.div
                      className="bg-blue-600 h-2 rounded-full"
                      initial={{ width: 0 }}
                      animate={{ width: `${challenge.progress}%` }}
                      transition={{ duration: 0.5 }}
                    />
                  </div>
                  <span className="text-sm text-gray-600">{challenge.progress}% Complete</span>
                </div>
              )}

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleJoinChallenge(challenge.id)}
                className={`w-full py-2 px-4 rounded-lg text-sm font-medium transition-colors
                  ${challenge.status === 'completed'
                    ? 'bg-green-500 text-white cursor-not-allowed'
                    : 'bg-blue-600 text-white hover:bg-blue-700'
                  }`}
                disabled={challenge.status === 'completed' || loading}
              >
                {loading ? 'Loading...' : challenge.status === 'completed' ? 'Completed' : 'Join Challenge'}
              </motion.button>
            </motion.div>
          ))}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}




