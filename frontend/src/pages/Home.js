import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { motion } from 'framer-motion';

export default function Home() {
  const { user } = useAuth();

  const fadeIn = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6 }
  };

  const features = [
    {
      icon: "🎯",
      title: "Personalized Learning",
      description: "AI-driven curriculum that adapts to your learning style and pace.",
      color: "from-indigo-500 to-purple-500"
    },
    {
      icon: "🤝",
      title: "Peer Challenges",
      description: "Engage in collaborative learning through interactive peer challenges.",
      color: "from-blue-500 to-indigo-500"
    },
    {
      icon: "📊",
      title: "Progress Tracking",
      description: "Visual insights into your learning journey with detailed analytics.",
      color: "from-purple-500 to-pink-500"
    }
  ];

  return (
    <div className="bg-gradient-to-b from-indigo-50 to-white min-h-screen">
      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <motion.div 
          className="text-center"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h1 className="text-4xl tracking-tight font-extrabold text-gray-900 sm:text-5xl md:text-6xl">
            <motion.span 
              className="block bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              Transform Your Learning
            </motion.span>
            <motion.span 
              className="block text-indigo-600 mt-2"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
            >
              With AI-Powered Education
            </motion.span>
          </h1>
          <motion.p 
            className="mt-3 max-w-md mx-auto text-base text-gray-500 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.9 }}
          >
            Personalized learning paths, interactive challenges, and real-time feedback
            to help you master STEM subjects at your own pace.
          </motion.p>

          <motion.div 
            className="mt-5 max-w-md mx-auto sm:flex sm:justify-center md:mt-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2 }}
          >
            {!user ? (
              <>
                <div className="rounded-md shadow">
                  <Link
                    to="/signup"
                    className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 transform hover:scale-105 transition-all duration-200 md:py-4 md:text-lg md:px-10"
                  >
                    Get Started
                  </Link>
                </div>
                <div className="mt-3 sm:mt-0 sm:ml-3">
                  <Link
                    to="/login"
                    className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-indigo-600 bg-white hover:bg-gray-50 transform hover:scale-105 transition-all duration-200 md:py-4 md:text-lg md:px-10"
                  >
                    Login
                  </Link>
                </div>
              </>
            ) : (
              <div className="rounded-md shadow">
                <Link
                  to="/dashboard"
                  className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 transform hover:scale-105 transition-all duration-200 md:py-4 md:text-lg md:px-10"
                >
                  Go to Dashboard
                </Link>
              </div>
            )}
          </motion.div>
        </motion.div>
      </div>

      {/* Features Section */}
      <div className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            className="text-center mb-12"
            {...fadeIn}
          >
            <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
              Why Choose Our Platform?
            </h2>
            <p className="mt-4 text-lg text-gray-500">
              Experience the future of education with our innovative features
            </p>
          </motion.div>

          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                className="relative group"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.2 }}
              >
                <div className="bg-white rounded-lg shadow-lg overflow-hidden transform group-hover:scale-105 transition-all duration-300">
                  <div className={`bg-gradient-to-r ${feature.color} p-6`}>
                    <div className="text-4xl mb-4">{feature.icon}</div>
                    <h3 className="text-lg font-medium text-white">{feature.title}</h3>
                    <p className="mt-2 text-white opacity-90">
                      {feature.description}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <motion.div 
        className="bg-gradient-to-r from-indigo-50 to-purple-50 py-16"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
            <div className="text-center">
              <div className="text-4xl font-bold text-indigo-600">10K+</div>
              <div className="mt-2 text-gray-600">Active Students</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-indigo-600">500+</div>
              <div className="mt-2 text-gray-600">Interactive Courses</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-indigo-600">95%</div>
              <div className="mt-2 text-gray-600">Success Rate</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-indigo-600">24/7</div>
              <div className="mt-2 text-gray-600">Support Available</div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
