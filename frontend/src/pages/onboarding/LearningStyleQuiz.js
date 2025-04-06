import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { motion } from 'framer-motion';
import API_ENDPOINTS from '../../config/api';
import quizData from './data.json';

export default function LearningStyleQuiz() {
  const navigate = useNavigate();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [userGrade, setUserGrade] = useState(null);
  const [quizQuestions, setQuizQuestions] = useState([]);

  // Get user data from localStorage
  const userId = localStorage.getItem('user_id');
  const userType = localStorage.getItem('userType');

  useEffect(() => {
    const initializeQuiz = () => {
      try {
        // Get grade from localStorage
        const storedGrade = localStorage.getItem('userGrade');
        
        if (!storedGrade) {
          console.warn('Grade not found in localStorage');
          setUserGrade("8");
          setQuizQuestions(quizData["8"] || []);
          return;
        }

        // Set the grade and corresponding questions from data.json
        setUserGrade(storedGrade);
        if (quizData[storedGrade]) {
          setQuizQuestions(quizData[storedGrade]);
        } else {
          console.warn(`Grade ${storedGrade} not found in quiz data, falling back to grade 8`);
          setQuizQuestions(quizData["8"] || []);
        }
      } catch (err) {
        console.error('Error initializing quiz:', err);
        setUserGrade("8");
        setQuizQuestions(quizData["8"] || []);
      }
    };

    initializeQuiz();
  }, []);

  const handleAnswer = (questionId, selectedOption) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: selectedOption
    }));
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);
      setError('');

      const userId = parseInt(localStorage.getItem('user_id'));
      const responses = quizQuestions.map(question => ({
        question: question.question,
        selectedOption: answers[question.id],
        answer: answers[question.id] === question.correctAnswer ? "correct" : "incorrect"
      }));

      const quizData = {
        user_id: userId,
        responses: responses
      };

      const response = await axios.post(API_ENDPOINTS.QUIZ_RESULTS, quizData);
      
      // Log the full response to debug the structure
      console.log('Full API Response:', response);
      console.log('Learning Path from API:', response.data);
      
      // FIXED: Extract the data correctly based on the API response structure
      // The API returns an object with a 'learning_path' property that contains the actual learning path data
      const learningPathData = response.data.learning_path || response.data;
      
      // Extract the IDs properly from the response
      // The main ID is at the top level of the response.data object
      const learningPathId = response.data.id || (response.data.learning_path && response.data.learning_path.id);
      const studentId = userId;
      
      console.log('Extracted IDs:', { learningPathId, studentId });
      
      if (learningPathId) {
        // Store both the full learning path and the ID
        localStorage.setItem('learningPath', JSON.stringify(response.data));
        localStorage.setItem('learning_path_id', learningPathId.toString());
        localStorage.setItem('student_id', studentId.toString());
        
        navigate('/learning-path');
      } else {
        throw new Error('Learning path ID not found in the response');
      }
    } catch (error) {
      console.error('API Error:', error);
      setError('Failed to submit quiz results. Please try again.');
      setLoading(false);
    }
  };

  // Check if all questions are answered before allowing submission
  const isQuizComplete = () => {
    return quizQuestions.every(question => {
      const hasAnswer = !!answers[question.id];
      if (!hasAnswer) {
        console.log('Missing answer for question:', question.id);
      }
      return hasAnswer;
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white shadow rounded-lg p-6">
          {/* Progress bar */}
          <div className="mb-6">
            <div className="h-2 bg-gray-200 rounded-full">
              <motion.div 
                className="h-2 bg-indigo-600 rounded-full"
                initial={{ width: 0 }}
                animate={{ 
                  width: `${(currentQuestion / quizQuestions.length) * 100}%` 
                }}
                transition={{ duration: 0.3 }}
              />
            </div>
            <p className="text-sm text-gray-600 mt-2">
              Question {currentQuestion + 1} of {quizQuestions.length}
            </p>
          </div>

          {/* Current Question */}
          {quizQuestions.length > 0 && currentQuestion < quizQuestions.length && (
            <motion.div 
              className="space-y-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-gray-900">
                  {quizQuestions[currentQuestion].question}
                </h2>
                <span className="px-2 py-1 text-sm rounded bg-gray-100 text-gray-600">
                  {quizQuestions[currentQuestion].subject}
                </span>
              </div>
              <div className="space-y-3">
                {quizQuestions[currentQuestion].options.map((option, index) => (
                  <motion.button
                    key={index}
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.99 }}
                    onClick={() => handleAnswer(quizQuestions[currentQuestion].id, option)}
                    className={`w-full text-left p-4 rounded-lg border transition-colors ${
                      answers[quizQuestions[currentQuestion].id] === option
                        ? 'border-indigo-500 bg-indigo-50'
                        : 'border-gray-200 hover:border-indigo-500'
                    }`}
                  >
                    {option}
                  </motion.button>
                ))}
              </div>
            </motion.div>
          )}

          {/* Error message */}
          {error && (
            <div className="mt-4 p-3 bg-red-100 text-red-700 rounded-md">
              {error}
            </div>
          )}

          {/* Navigation buttons */}
          <div className="mt-6 flex justify-between">
            <button
              onClick={() => setCurrentQuestion(prev => Math.max(0, prev - 1))}
              disabled={currentQuestion === 0}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md disabled:opacity-50"
            >
              Previous
            </button>
            {currentQuestion === quizQuestions.length - 1 ? (
              <button
                onClick={handleSubmit}
                disabled={loading || !isQuizComplete()}
                className={`px-4 py-2 text-sm font-medium text-white rounded-md ${
                  isQuizComplete() && !loading
                    ? 'bg-indigo-600 hover:bg-indigo-700'
                    : 'bg-gray-400 cursor-not-allowed'
                }`}
              >
                {loading ? 'Submitting...' : 'Submit Quiz'}
              </button>
            ) : (
              <button
                onClick={() => setCurrentQuestion(prev => Math.min(quizQuestions.length - 1, prev + 1))}
                className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700"
              >
                Next
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}