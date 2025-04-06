import React, { useState, useEffect } from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, 
  LineChart, Line, PieChart, Pie, Cell, ResponsiveContainer,
  RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis,
  AreaChart, Area
} from 'recharts';
import { 
  Activity, 
  Target, 
  Zap, 
  Award, 
  TrendingUp, 
  BookOpen, 
  Book,  // Add this
  Clock, 
  Star 
} from 'react-feather';
import { motion } from 'framer-motion';

const ParentDashboard = () => {
  const [selectedChild, setSelectedChild] = useState(null);
  const [timeRange, setTimeRange] = useState('week');
  const [isLoading, setIsLoading] = useState(true);

  // Color palette
  const colors = {
    primary: '#4F46E5',
    secondary: '#10B981',
    accent: '#F59E0B',
    success: '#059669',
    warning: '#D97706',
    danger: '#DC2626',
    background: '#F3F4F6',
    gradients: {
      blue: ['#4F46E5', '#818CF8'],
      green: ['#10B981', '#34D399'],
      orange: ['#F59E0B', '#FBBF24'],
    }
  };

  useEffect(() => {
    // Simulate data loading
    setTimeout(() => setIsLoading(false), 1000);
  }, []);

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        duration: 0.5,
        when: "beforeChildren",
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1,
      transition: { duration: 0.5 }
    }
  };

  // Enhanced mock data
  const data = {
    children: [
      { id: 1, name: "John Doe", grade: "8th Grade" },
      { id: 2, name: "Jane Doe", grade: "6th Grade" }
    ],
    performance: {
      subjects: [
        { name: 'Mathematics', score: 85, average: 75, improvement: 5 },
        { name: 'Science', score: 92, average: 78, improvement: 8 },
        { name: 'English', score: 88, average: 80, improvement: 3 },
        { name: 'History', score: 78, average: 72, improvement: 4 }
      ],
      weeklyProgress: [
        { day: 'Mon', hours: 2.5, tasks: 8, focus: 85 },
        { day: 'Tue', hours: 3.0, tasks: 10, focus: 90 },
        { day: 'Wed', hours: 2.0, tasks: 6, focus: 75 },
        { day: 'Thu', hours: 3.5, tasks: 12, focus: 95 },
        { day: 'Fri', hours: 2.8, tasks: 9, focus: 88 }
      ],
      skillMatrix: [
        { skill: 'Problem Solving', value: 80 },
        { skill: 'Critical Thinking', value: 85 },
        { skill: 'Communication', value: 75 },
        { skill: 'Teamwork', value: 90 },
        { skill: 'Time Management', value: 70 }
      ]
    },
    learningAnalytics: {
      timeDistribution: [
        { name: 'Active Learning', value: 40 },
        { name: 'Practice', value: 35 },
        { name: 'Assessment', value: 25 }
      ],
      focusMetrics: [
        { time: '8AM', score: 85 },
        { time: '10AM', score: 95 },
        { time: '12PM', score: 75 },
        { time: '2PM', score: 90 },
        { time: '4PM', score: 80 }
      ]
    }
  };

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-4 rounded-lg shadow-lg border">
          <p className="font-semibold">{label}</p>
          {payload.map((entry, index) => (
            <p key={index} style={{ color: entry.color }}>
              {`${entry.name}: ${entry.value}`}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <motion.div 
      className="p-2 sm:p-6 space-y-4 sm:space-y-6 bg-gray-50"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Header Section */}
      <motion.div 
        className="flex flex-col sm:flex-row justify-between items-start sm:items-center bg-white p-4 sm:p-6 rounded-xl shadow-sm gap-4"
        variants={itemVariants}
      >
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">Parent Dashboard</h1>
          <p className="text-gray-600">Comprehensive Learning Analytics</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 w-full sm:w-auto">
          <select 
            className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 transition-all w-full sm:w-auto"
            onChange={(e) => setSelectedChild(e.target.value)}
          >
            <option value="">Select Child</option>
            {data.children.map(child => (
              <option key={child.id} value={child.id}>
                {child.name} - {child.grade}
              </option>
            ))}
          </select>
          <select 
            className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 transition-all w-full sm:w-auto"
            onChange={(e) => setTimeRange(e.target.value)}
          >
            <option value="week">This Week</option>
            <option value="month">This Month</option>
            <option value="quarter">This Quarter</option>
            <option value="year">This Year</option>
          </select>
        </div>
      </motion.div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {[
          { 
            title: 'Overall Progress',
            value: '88%',
            icon: <Activity className="text-indigo-500" />,
            change: '+5%',
            description: 'Above average performance'
          },
          {
            title: 'Focus Score',
            value: '92%',
            icon: <Target className="text-green-500" />,
            change: '+3%',
            description: 'Excellent concentration'
          },
          {
            title: 'Learning Streak',
            value: '15 days',
            icon: <Zap className="text-yellow-500" />,
            change: '+2 days',
            description: 'Consistent learning pattern'
          },
          {
            title: 'Achievements',
            value: '12 new',
            icon: <Award className="text-purple-500" />,
            change: '+3 this week',
            description: 'Outstanding performance'
          }
        ].map((stat, index) => (
          <motion.div
            key={index}
            variants={itemVariants}
            className="bg-white rounded-xl shadow-sm p-4 sm:p-6 transform hover:scale-105 transition-all duration-300"
          >
            <div className="flex justify-between items-start">
              <div>
                <p className="text-gray-500 text-sm">{stat.title}</p>
                <h3 className="text-xl sm:text-2xl font-bold mt-1">{stat.value}</h3>
                <p className="text-xs sm:text-sm text-gray-600 mt-2">{stat.description}</p>
              </div>
              {stat.icon}
            </div>
            <div className="mt-2 text-sm text-green-600 flex items-center">
              <TrendingUp size={16} className="mr-1" />
              {stat.change}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Main Analytics Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        {/* Subject Performance */}
        <motion.div 
          variants={itemVariants}
          className="bg-white rounded-xl shadow-sm p-4 sm:p-6"
        >
          <h2 className="text-lg sm:text-xl font-semibold mb-4 sm:mb-6 flex items-center">
            <BookOpen className="mr-2 text-indigo-500" />
            Subject Performance
          </h2>
          <div className="h-[250px] sm:h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data.performance.subjects}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip content={<CustomTooltip />} />
                <Legend wrapperStyle={{ fontSize: '12px' }} />
                <Bar 
                  dataKey="score" 
                  fill={colors.primary}
                  radius={[4, 4, 0, 0]}
                  animationBegin={0}
                  animationDuration={1500}
                />
                <Bar 
                  dataKey="average" 
                  fill={colors.secondary}
                  radius={[4, 4, 0, 0]}
                  animationBegin={300}
                  animationDuration={1500}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Skill Matrix */}
        <motion.div 
          variants={itemVariants}
          className="bg-white rounded-xl shadow-sm p-4 sm:p-6"
        >
          <h2 className="text-lg sm:text-xl font-semibold mb-4 sm:mb-6 flex items-center">
            <Book className="mr-2 text-green-500" />
            Skill Matrix
          </h2>
          <div className="h-[250px] sm:h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart data={data.performance.skillMatrix}>
                <PolarGrid stroke="#e2e8f0" />
                <PolarAngleAxis dataKey="skill" tick={{ fontSize: 12 }} />
                <PolarRadiusAxis tick={{ fontSize: 12 }} />
                <Radar
                  name="Skills"
                  dataKey="value"
                  stroke={colors.primary}
                  fill={colors.primary}
                  fillOpacity={0.6}
                />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Focus Metrics */}
        <motion.div 
          variants={itemVariants}
          className="bg-white rounded-xl shadow-sm p-4 sm:p-6"
        >
          <h2 className="text-lg sm:text-xl font-semibold mb-4 sm:mb-6 flex items-center">
            <Target className="mr-2 text-yellow-500" />
            Focus Metrics
          </h2>
          <div className="h-[250px] sm:h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data.learningAnalytics.focusMetrics}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="time" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip content={<CustomTooltip />} />
                <Area
                  type="monotone"
                  dataKey="score"
                  stroke={colors.accent}
                  fill={colors.accent}
                  fillOpacity={0.2}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Time Distribution */}
        <motion.div 
          variants={itemVariants}
          className="bg-white rounded-xl shadow-sm p-4 sm:p-6"
        >
          <h2 className="text-lg sm:text-xl font-semibold mb-4 sm:mb-6 flex items-center">
            <Clock className="mr-2 text-purple-500" />
            Learning Time Distribution
          </h2>
          <div className="h-[250px] sm:h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data.learningAnalytics.timeDistribution}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius="80%"
                  animationBegin={0}
                  animationDuration={1500}
                >
                  {data.learningAnalytics.timeDistribution.map((entry, index) => (
                    <Cell 
                      key={index} 
                      fill={Object.values(colors.gradients)[index][0]}
                    />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
                <Legend wrapperStyle={{ fontSize: '12px' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </motion.div>
      </div>

      {/* Recommendations Section */}
      <motion.div 
        variants={itemVariants}
        className="bg-white rounded-xl shadow-sm p-4 sm:p-6"
      >
        <h2 className="text-lg sm:text-xl font-semibold mb-4 sm:mb-6 flex items-center">
          <Star className="mr-2 text-yellow-500" />
          Personalized Recommendations
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
          {[
            {
              title: "Mathematics Focus",
              description: "Schedule additional practice for algebra concepts",
              priority: "high",
              action: "Review practice sets",
              icon: <Book className="text-red-500" />
            },
            {
              title: "Study Schedule",
              description: "Optimize study time during peak focus hours",
              priority: "medium",
              action: "Adjust schedule",
              icon: <Clock className="text-yellow-500" />
            },
            {
              title: "Skill Development",
              description: "Focus on improving problem-solving skills",
              priority: "low",
              action: "Try new exercises",
              icon: <Book className="text-green-500" />
            }
          ].map((rec, index) => (
            <motion.div
              key={index}
              className={`p-4 rounded-lg border-l-4 ${
                rec.priority === 'high' 
                  ? 'border-l-red-500 bg-red-50' 
                  : rec.priority === 'medium'
                  ? 'border-l-yellow-500 bg-yellow-50'
                  : 'border-l-green-500 bg-green-50'
              }`}
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.2 }}
            >
              <div className="flex items-start gap-3">
                {rec.icon}
                <div>
                  <h3 className="font-semibold text-sm sm:text-base">{rec.title}</h3>
                  <p className="text-xs sm:text-sm text-gray-600 mt-1">{rec.description}</p>
                  <button className="mt-2 sm:mt-3 text-xs sm:text-sm font-medium text-indigo-600 hover:text-indigo-800">
                    {rec.action} →
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
};

export default ParentDashboard;





