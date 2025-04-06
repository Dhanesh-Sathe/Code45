import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  Users, Award, TrendingUp, Clock, Star, AlertTriangle, BookOpen, 
  Target, Calendar, Book, Activity, Map, User, Brain, CheckCircle,
  ArrowLeft, RefreshCw, Bookmark, TrendingDown
} from 'react-feather';

const LearningPath = () => {
  const navigate = useNavigate();
  const [learningPath, setLearningPath] = useState(null);
  const [activeWeek, setActiveWeek] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.5, staggerChildren: 0.1 } }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  useEffect(() => {
    const loadLearningPath = () => {
      setLoading(true);
      const storedLearningPath = localStorage.getItem('learningPath');
      
      if (!storedLearningPath) {
        setError('No learning path found. Please complete the assessment quiz first.');
        setLoading(false);
        return;
      }

      try {
        const parsedPath = JSON.parse(storedLearningPath);
        if (!parsedPath || Object.keys(parsedPath).length === 0) {
          throw new Error('Invalid learning path data');
        }
        console.log('Loaded Learning Path:', parsedPath);
        setLearningPath(parsedPath);
        setError(null);
      } catch (error) {
        console.error('Error parsing learning path data:', error);
        setError('There was an error loading your learning path. Please try the assessment again.');
      } finally {
        setLoading(false);
      }
    };

    loadLearningPath();
  }, []);

  const handleRetakeAssessment = () => {
    navigate('/learning-style-quiz');
  };

  if (loading) {
    return (
      <div className="container mx-auto p-8 flex justify-center items-center min-h-screen">
        <div className="text-center">
          <RefreshCw className="animate-spin h-8 w-8 text-indigo-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading your personalized learning path...</p>
        </div>
      </div>
    );
  }

  if (error || !learningPath) {
    return (
      <div className="container mx-auto p-8">
        <div className="bg-white rounded-xl p-8 shadow-lg text-center">
          <AlertTriangle className="h-12 w-12 text-yellow-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold mb-4">Learning Path Not Available</h1>
          <p className="text-gray-600 mb-6">{error || 'Please complete the assessment quiz to generate your learning path.'}</p>
          <button
            onClick={handleRetakeAssessment}
            className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 transition-colors"
          >
            Take Assessment Quiz
          </button>
        </div>
      </div>
    );
  }

  const renderStudentProfile = () => (
    <motion.div variants={itemVariants} className="bg-gradient-to-r from-purple-600 to-indigo-600 rounded-xl p-6 text-white">
      <div className="flex justify-between items-start">
        <div>
          <h2 className="text-2xl font-bold mb-2 flex items-center">
            <User className="mr-2" /> Student Profile
          </h2>
          <p className="opacity-90">User ID: {learningPath?.learning_path?.student_info?.user_id || 'N/A'}</p>
          <p className="opacity-90">Username: {learningPath?.learning_path?.student_info?.username || 'N/A'}</p>
          <p className="opacity-90 mt-2">Learning Style: {learningPath?.learning_path?.perceived_learning_style || 'N/A'}</p>
        </div>
        <div className="text-right">
          <p className="text-lg opacity-90">
            Completion Time: {learningPath?.learning_path?.estimated_completion_time?.weeks || 'N/A'} weeks
          </p>
          <p className="text-sm opacity-80">
            Target Date: {learningPath?.learning_path?.estimated_completion_time?.estimated_completion_date 
              ? new Date(learningPath.learning_path.estimated_completion_time.estimated_completion_date).toLocaleDateString() 
              : 'N/A'}
          </p>
        </div>
      </div>
    </motion.div>
  );

  const renderDifficultyLevels = () => (
    <motion.div variants={itemVariants} className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
      <h2 className="text-xl font-semibold mb-4 flex items-center">
        <Target className="mr-2 text-indigo-600" /> Difficulty Levels
      </h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {Object.entries(learningPath?.learning_path?.difficulty_levels || {}).map(([subject, level]) => (
          <div key={subject} className="p-4 bg-gray-50 rounded-lg">
            <h3 className="font-semibold">{subject}</h3>
            <p className={`mt-2 text-sm ${
              level === 'Basic' ? 'text-green-600' :
              level === 'Intermediate' ? 'text-yellow-600' :
              'text-red-600'
            }`}>{level}</p>
          </div>
        ))}
      </div>
    </motion.div>
  );

  const renderStrengthsWeaknesses = () => (
    <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="bg-green-50 rounded-xl p-6 border border-green-100">
        <h3 className="text-xl font-semibold mb-4 flex items-center text-green-700">
          <Star className="mr-2" /> Strengths
        </h3>
        <ul className="space-y-2">
          {(learningPath?.learning_path?.strengths || []).map((strength, index) => (
            <li key={index} className="flex items-center text-green-600">
              <CheckCircle className="w-4 h-4 mr-2" /> {strength}
            </li>
          ))}
        </ul>
      </div>
      <div className="bg-red-50 rounded-xl p-6 border border-red-100">
        <h3 className="text-xl font-semibold mb-4 flex items-center text-red-700">
          <TrendingDown className="mr-2" /> Areas for Improvement
        </h3>
        <ul className="space-y-2">
          {(learningPath?.learning_path?.weaknesses || []).map((weakness, index) => (
            <li key={index} className="flex items-center text-red-600">
              <AlertTriangle className="w-4 h-4 mr-2" /> {weakness}
            </li>
          ))}
        </ul>
      </div>
    </motion.div>
  );

  const renderWeeklyPlan = () => (
    <motion.div variants={itemVariants} className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
      <h2 className="text-xl font-semibold mb-6 flex items-center">
        <Calendar className="mr-2 text-indigo-600" /> Weekly Study Plan
      </h2>
      <div className="space-y-4">
        {(learningPath?.learning_path?.study_plan || []).map((week) => (
          <div
            key={week.week}
            className={`p-4 rounded-lg cursor-pointer transition-all ${
              activeWeek === week.week ? 'bg-indigo-50 border-indigo-200' : 'bg-gray-50 border-gray-200'
            } border`}
            onClick={() => setActiveWeek(week.week)}
          >
            <h3 className="font-semibold text-lg mb-2">Week {week.week}</h3>
            {activeWeek === week.week && (
              <div className="space-y-3">
                <div>
                  <p className="font-medium text-indigo-700">Focus Areas:</p>
                  <ul className="list-disc list-inside ml-4">
                    {week.focus_areas.map((area, i) => (
                      <li key={i}>{area}</li>
                    ))}
                  </ul>
                </div>
                <div>
                  <p className="font-medium text-indigo-700">Activities:</p>
                  {week.activities.map((activity, i) => (
                    <div key={i} className="ml-4 mt-2 p-3 bg-white rounded-lg">
                      <p className="font-semibold">{activity.subject}</p>
                      <p className="text-sm text-gray-600">Topics: {activity.topics.join(', ')}</p>
                      <p className="text-sm text-gray-600">Hours: {activity.hours}</p>
                      <p className="text-sm text-gray-600">Practice Focus: {activity.practice_focus}</p>
                    </div>
                  ))}
                </div>
                <div>
                  <p className="font-medium text-indigo-700">Review Strategies:</p>
                  <ul className="list-disc list-inside ml-4">
                    {week.review_strategies.map((strategy, i) => (
                      <li key={i} className="text-gray-600">{strategy}</li>
                    ))}
                  </ul>
                </div>
                <div>
                  <p className="font-medium text-indigo-700">Milestone:</p>
                  <p className="ml-4 text-gray-600">{week.milestone_check}</p>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </motion.div>
  );

  const renderResources = () => (
    <motion.div variants={itemVariants} className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
      <h2 className="text-xl font-semibold mb-6 flex items-center">
        <BookOpen className="mr-2 text-indigo-600" /> Recommended Resources
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {(learningPath?.learning_path?.recommended_resources || []).map((resource, index) => (
          <a
            key={index}
            href={resource.url}
            target="_blank"
            rel="noopener noreferrer"
            className="block p-4 rounded-lg border border-gray-200 hover:border-indigo-300 transition-all"
          >
            <h3 className="font-semibold text-lg mb-2">{resource.name}</h3>
            <p className="text-sm text-gray-600 mb-2">{resource.alignment}</p>
            <div className="flex flex-wrap gap-2">
              <span className={`px-2 py-1 rounded-full text-xs ${
                resource.difficulty === 'Basic' ? 'bg-green-100 text-green-700' :
                resource.difficulty === 'Intermediate' ? 'bg-yellow-100 text-yellow-700' :
                'bg-red-100 text-red-700'
              }`}>
                {resource.difficulty}
              </span>
              <span className="px-2 py-1 rounded-full bg-blue-100 text-blue-700 text-xs">
                {resource.type}
              </span>
            </div>
          </a>
        ))}
      </div>
    </motion.div>
  );

  return (
    <div className="container mx-auto">
      <motion.div
        className="p-6 space-y-6"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Navigation Header */}
        <div className="flex justify-between items-center mb-6">
          <button
            onClick={() => navigate('/dashboard')}
            className="flex items-center text-gray-600 hover:text-indigo-600 transition-colors"
          >
            <ArrowLeft className="h-5 w-5 mr-2" />
            Back to Dashboard
          </button>
          <button
            onClick={handleRetakeAssessment}
            className="text-indigo-600 hover:text-indigo-700 transition-colors text-sm"
          >
            Retake Assessment
          </button>
        </div>

        {/* Main Content */}
        <div className="space-y-8">
          {renderStudentProfile()}
          {renderDifficultyLevels()}
          {renderStrengthsWeaknesses()}
          
          {/* Progress Overview */}
          <motion.div variants={itemVariants} className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
            <h2 className="text-xl font-semibold mb-4 flex items-center">
              <Activity className="mr-2 text-indigo-600" /> Learning Progress
            </h2>
            <div className="bg-gray-100 h-2 rounded-full">
              <div 
                className="bg-indigo-600 h-2 rounded-full"
                style={{ width: `${(activeWeek / (learningPath?.learning_path?.study_plan?.length || 1)) * 100}%` }}
              />
            </div>
            <p className="text-sm text-gray-600 mt-2">
              Week {activeWeek} of {learningPath?.learning_path?.study_plan?.length || 0}
            </p>
          </motion.div>

          {renderWeeklyPlan()}
          {renderResources()}
        </div>
      </motion.div>
    </div>
  );
};

export default LearningPath;



