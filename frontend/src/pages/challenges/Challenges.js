import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Users, 
  Award, 
  TrendingUp, 
  Clock, 
  Star,
  BookOpen,
  Code,
  HelpCircle // Replacing Brain with HelpCircle for quiz challenges
} from 'react-feather';
import axios from 'axios';

export default function Challenges() {
  const [challenges, setChallenges] = useState([]);
  const [activeChallenges, setActiveChallenges] = useState([]);
  const [completedChallenges, setCompletedChallenges] = useState([]);
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [loading, setLoading] = useState(true);

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
      opacity: 1,
      transition: { duration: 0.3 }
    }
  };

  useEffect(() => {
    // Fetch user's learning path from localStorage
    const learningPath = JSON.parse(localStorage.getItem('learningPath') || '{}');
    
    // Generate challenges based on learning path
    const generatedChallenges = generateChallenges(learningPath);
    setChallenges(generatedChallenges);
    
    // Filter active and completed challenges
    setActiveChallenges(generatedChallenges.filter(c => c.status === 'active'));
    setCompletedChallenges(generatedChallenges.filter(c => c.status === 'completed'));
    
    setLoading(false);
  }, []);

  const generateChallenges = (learningPath) => {
    // Sample challenge generation based on learning path
    const challengeTypes = [
      {
        type: 'peer',
        icon: <Users className="text-blue-500" />,
        colorClass: 'bg-blue-50 border-blue-200'
      },
      {
        type: 'quiz',
        icon: <HelpCircle className="text-purple-500" />, // Updated icon
        colorClass: 'bg-purple-50 border-purple-200'
      },
      {
        type: 'coding',
        icon: <Code className="text-green-500" />,
        colorClass: 'bg-green-50 border-green-200'
      },
      {
        type: 'project',
        icon: <BookOpen className="text-orange-500" />,
        colorClass: 'bg-orange-50 border-orange-200'
      }
    ];

    // Generate challenges based on recommended topics
    return (learningPath.recommended_topics || []).flatMap((topic, index) => {
      return challengeTypes.map((challengeType, typeIndex) => ({
        id: `${index}-${typeIndex}`,
        title: `${topic.name} ${challengeType.type.charAt(0).toUpperCase() + challengeType.type.slice(1)} Challenge`,
        description: `Master ${topic.name} through a ${challengeType.type} challenge`,
        type: challengeType.type,
        icon: challengeType.icon,
        colorClass: challengeType.colorClass,
        difficulty: ['Beginner', 'Intermediate', 'Advanced'][Math.floor(Math.random() * 3)],
        points: Math.floor(Math.random() * 500) + 100,
        timeLimit: `${Math.floor(Math.random() * 60) + 30} minutes`,
        participants: Math.floor(Math.random() * 50) + 10,
        status: Math.random() > 0.7 ? 'completed' : 'active',
        progress: Math.floor(Math.random() * 100)
      }));
    });
  };

  const handleJoinChallenge = async (challengeId) => {
    try {
      // Here you would typically make an API call to join the challenge
      console.log(`Joining challenge ${challengeId}`);
      // Update UI optimistically
      const updatedChallenges = challenges.map(challenge =>
        challenge.id === challengeId
          ? { ...challenge, status: 'active' }
          : challenge
      );
      setChallenges(updatedChallenges);
    } catch (error) {
      console.error('Error joining challenge:', error);
    }
  };

  const filterChallenges = () => {
    switch (selectedFilter) {
      case 'active':
        return challenges.filter(c => c.status === 'active');
      case 'completed':
        return challenges.filter(c => c.status === 'completed');
      case 'peer':
        return challenges.filter(c => c.type === 'peer');
      case 'quiz':
        return challenges.filter(c => c.type === 'quiz');
      case 'coding':
        return challenges.filter(c => c.type === 'coding');
      case 'project':
        return challenges.filter(c => c.type === 'project');
      default:
        return challenges;
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
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Learning Challenges</h1>
        <p className="text-gray-600">
          Engage in interactive challenges to enhance your learning journey
        </p>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center">
            <Award className="text-yellow-500 mr-2" />
            <span className="text-gray-700">Total Points</span>
          </div>
          <p className="text-2xl font-bold text-gray-800 mt-2">
            {completedChallenges.reduce((sum, c) => sum + c.points, 0)}
          </p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center">
            <TrendingUp className="text-green-500 mr-2" />
            <span className="text-gray-700">Active Challenges</span>
          </div>
          <p className="text-2xl font-bold text-gray-800 mt-2">
            {activeChallenges.length}
          </p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center">
            <Star className="text-purple-500 mr-2" />
            <span className="text-gray-700">Completed</span>
          </div>
          <p className="text-2xl font-bold text-gray-800 mt-2">
            {completedChallenges.length}
          </p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center">
            <Users className="text-blue-500 mr-2" />
            <span className="text-gray-700">Peer Challenges</span>
          </div>
          <p className="text-2xl font-bold text-gray-800 mt-2">
            {challenges.filter(c => c.type === 'peer').length}
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-2 mb-6">
        {['all', 'active', 'completed', 'peer', 'quiz', 'coding', 'project'].map(filter => (
          <button
            key={filter}
            onClick={() => setSelectedFilter(filter)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors
              ${selectedFilter === filter
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
          >
            {filter.charAt(0).toUpperCase() + filter.slice(1)}
          </button>
        ))}
      </div>

      {/* Challenges Grid */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
      >
        {filterChallenges().map(challenge => (
          <motion.div
            key={challenge.id}
            variants={itemVariants}
            className={`${challenge.colorClass} rounded-lg p-6 border transition-shadow hover:shadow-lg`}
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
                  <div
                    className="bg-blue-600 h-2 rounded-full"
                    style={{ width: `${challenge.progress}%` }}
                  ></div>
                </div>
                <span className="text-sm text-gray-600">{challenge.progress}% Complete</span>
              </div>
            )}

            <button
              onClick={() => handleJoinChallenge(challenge.id)}
              className={`w-full py-2 px-4 rounded-lg text-sm font-medium transition-colors
                ${challenge.status === 'completed'
                  ? 'bg-green-500 text-white cursor-not-allowed'
                  : 'bg-blue-600 text-white hover:bg-blue-700'
                }`}
              disabled={challenge.status === 'completed'}
            >
              {challenge.status === 'completed' ? 'Completed' : 'Join Challenge'}
            </button>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
}

