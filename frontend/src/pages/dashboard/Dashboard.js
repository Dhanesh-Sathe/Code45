import React, { useState, useEffect, useRef } from 'react';
import { RefreshCw, CheckCircle, Clock, AlertCircle, BookOpen, FileText, Layers } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../../styles/chat.css';

const Dashboard = () => {
  const [learningPathId, setLearningPathId] = useState(null);
  const [studentId, setStudentId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [taskData, setTaskData] = useState(null);
  const [learningResources, setLearningResources] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);
  
  // New state variables for chat
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([{
    role: 'assistant',
    content: 'Hello! I\'m your study assistant. How can I help you today?'
  }]);
  const [input, setInput] = useState('');
  const [image, setImage] = useState(null);
  const [isTyping, setIsTyping] = useState(false);
  const [imagePreviewing, setImagePreviewing] = useState(null);
  
  // Refs
  const fileInputRef = useRef(null);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  const navigate = useNavigate();

  const fetchTasksAndResources = async (pathId, studId) => {
    setLoading(true);
    setError(null);
    
    try {
      // Fetch both resources in parallel using Promise.all
      const [tasksResponse, resourcesResponse] = await Promise.all([
        fetch('http://localhost:8000/api/tasks/create-tasks/', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            learning_path_id: pathId,
            student_id: studId
          })
        }),
        fetch(`http://localhost:8000/api/tasks/learning-resources/${pathId}/`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          }
        })
      ]);

      if (!tasksResponse.ok || !resourcesResponse.ok) {
        throw new Error('Failed to fetch data');
      }

      const [tasksData, resourcesData] = await Promise.all([
        tasksResponse.json(),
        resourcesResponse.json()
      ]);

      setTaskData(tasksData);
      setLearningResources(resourcesData);
      setSuccess(`Successfully loaded tasks and resources`);
      setLastUpdated(new Date());

      // Handle quiz tasks if present
      const quizTasks = tasksData.tasks?.filter(task => task.task.task_type === 'quiz');
      if (quizTasks?.length > 0) {
        localStorage.setItem('current_quizzes', JSON.stringify(quizTasks));
      }

    } catch (err) {
      setError(err.message || 'An error occurred while fetching data');
      console.error("API Error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // More robust approach to retrieve IDs
    const retrieveIds = () => {
      const pathId = localStorage.getItem('learning_path_id');
      const studId = localStorage.getItem('student_id');
      
      console.log('Dashboard - Initial IDs:', { pathId, studId });

      if (pathId && studId) {
        setLearningPathId(pathId);
        setStudentId(studId);
        // Fetch data immediately when IDs are available
        fetchTasksAndResources(pathId, studId);
        return true;
      }
      
      // Try to recover IDs from learning path data
      const learningPathData = localStorage.getItem('learningPath');
      if (learningPathData) {
        try {
          const parsedPath = JSON.parse(learningPathData);
          console.log('Dashboard - Parsed Learning Path:', parsedPath);
          
          // Log the specific ID at the root level
          console.log('Learning path ID from response:', parsedPath.id);

          // Check multiple possible locations for the IDs
          let extractedPathId = null;
          let extractedStudentId = null;
          
          // ID is at the root level in the API response
          extractedPathId = parsedPath.id;
          
          // Student ID could be in different locations based on the response structure
          if (parsedPath.user_id) {
            extractedStudentId = parsedPath.user_id;
          } else if (parsedPath.student_info && parsedPath.student_info.user_id) {
            extractedStudentId = parsedPath.student_info.user_id;
          } else if (parsedPath.learning_path && parsedPath.learning_path.student_info) {
            extractedStudentId = parsedPath.learning_path.student_info.user_id;
          }

          console.log('Dashboard - Extracted IDs:', { extractedPathId, extractedStudentId });
          
          if (extractedPathId && extractedStudentId) {
            localStorage.setItem('learning_path_id', extractedPathId.toString());
            localStorage.setItem('student_id', extractedStudentId.toString());
            setLearningPathId(extractedPathId);
            setStudentId(extractedStudentId);
            // Fetch data immediately when IDs are extracted
            fetchTasksAndResources(extractedPathId, extractedStudentId);
            return true;
          }
        } catch (error) {
          console.error('Error parsing learning path data:', error);
        }
      }
      
      return false;
    };
    
    if (!retrieveIds()) {
      console.log('Redirecting to learning path - Missing IDs');
      navigate('/learning-path');
    }
  }, [navigate]);

  const handleQuizStart = (quizId) => {
    // Navigate to quiz page with the quiz ID
    navigate(/quiz/`${quizId}`);
  };

  // Helper function to get task type icon
  const getTaskTypeIcon = (taskType) => {
    switch (taskType) {
      case 'quiz':
        return <BookOpen className="h-5 w-5 text-blue-500" />;
      case 'assignment':
        return <FileText className="h-5 w-5 text-green-500" />;
      case 'interactive':
        return <Layers className="h-5 w-5 text-purple-500" />;
      default:
        return <FileText className="h-5 w-5 text-gray-500" />;
    }
  };

  // Helper function to get status badge
  const getStatusBadge = (status) => {
    switch (status) {
      case 'pending':
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">Pending</span>;
      case 'in_progress':
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">In Progress</span>;
      case 'completed':
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">Completed</span>;
      default:
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">Unknown</span>;
    }
  };

  // Add this new component to display resources
  const ResourceSection = ({ title, resources }) => (
    <div className="mb-8 bg-white rounded-xl p-6 shadow-lg border border-gray-100">
      <h3 className="text-xl font-semibold mb-4 text-indigo-700">{title}</h3>
      
      {/* YouTube Videos Section */}
      <div className="mb-6">
        <h4 className="text-lg font-medium mb-3 flex items-center text-red-600">
          <i className="fab fa-youtube mr-2"></i> YouTube Videos
        </h4>
        <div className="grid grid-cols-1 gap-4">
          {resources.youtube_videos.map((video, index) => (
            <a
              key={index}
              href={video.url}
              target="_blank"
              rel="noopener noreferrer"
              className="block p-4 rounded-lg border border-gray-200 hover:border-red-300 transition-all hover:bg-red-50"
            >
              <h5 className="font-semibold text-gray-800">{video.title}</h5>
              {video.description && (
                <p className="text-sm text-gray-600 mt-2">{video.description}</p>
              )}
            </a>
          ))}
        </div>
      </div>

      {/* Tutorials Section */}
      <div>
        <h4 className="text-lg font-medium mb-3 flex items-center text-blue-600">
          <i className="fas fa-book mr-2"></i> Tutorials
        </h4>
        <div className="grid grid-cols-1 gap-4">
          {resources.tutorials.map((tutorial, index) => (
            <a
              key={index}
              href={tutorial.url}
              target="_blank"
              rel="noopener noreferrer"
              className="block p-4 rounded-lg border border-gray-200 hover:border-blue-300 transition-all hover:bg-blue-50"
            >
              <h5 className="font-semibold text-gray-800">{tutorial.title}</h5>
              {tutorial.description && (
                <p className="text-sm text-gray-600 mt-2">{tutorial.description}</p>
              )}
            </a>
          ))}
        </div>
      </div>
    </div>
  );

  // New chat-related functions
  const handleChatSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim() && !image) return;
   
    const userMessage = { 
      role: 'user', 
      content: input,
      image: imagePreviewing 
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);
   
    try {
      const formData = new FormData();
      formData.append('message', input);
      if (image) formData.append('image', image);
     
      const response = await axios.post('http://localhost:8001/api/chat/', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
     
      setTimeout(() => {
        setMessages(prev => [...prev, { role: 'assistant', content: response.data.answer }]);
        setIsTyping(false);
      }, 700);
    } catch (error) {
      setTimeout(() => {
        setMessages(prev => [...prev, {
          role: 'assistant',
          content: 'Sorry, I encountered an error. Please try again.'
        }]);
        setIsTyping(false);
      }, 700);
    }
   
    setImage(null);
    setImagePreviewing(null);
  };

  const handleFileChange = (e) => {
    if (e.target.files[0]) {
      setImage(e.target.files[0]);
      setImagePreviewing(URL.createObjectURL(e.target.files[0]));
    }
  };

  const handleClearImage = () => {
    setImage(null);
    setImagePreviewing(null);
  };

  const renderMessage = (content) => {
    return {
      __html: content
        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
        .replace(/\*(.*?)\*/g, '<em>$1</em>')
        .replace(/`([^`]+)`/g, '<code>$1</code>')
        .replace(/\n/g, '<br />')
    };
  };

  return (
    <div className="container mx-auto p-4 max-w-4xl relative">
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-2">Task Dashboard</h1>
        <p className="text-gray-600">View your tasks and learning resources</p>
      </div>

      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <div className="mb-6">
          <h2 className="text-lg font-medium mb-4">Learning Path Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Learning Path ID</label>
              <input
                type="text"
                value={learningPathId || ''}
                readOnly
                className="block w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-md shadow-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Student ID</label>
              <input
                type="text"
                value={studentId || ''}
                readOnly
                className="block w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-md shadow-sm"
              />
            </div>
          </div>
        </div>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          <div className="flex items-center">
            <AlertCircle className="h-5 w-5 mr-2" />
            <span>{error}</span>
          </div>
        </div>
      )}

      {success && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
          <div className="flex items-center">
            <CheckCircle className="h-5 w-5 mr-2" />
            <div>
              <p>{success}</p>
              {lastUpdated && (
                <p className="text-sm mt-1">Created at: {lastUpdated.toLocaleTimeString()}</p>
              )}
            </div>
          </div>
        </div>
      )}

      {taskData && taskData.tasks && taskData.tasks.length > 0 && (
        <div className="mt-8">
          <h2 className="text-xl font-semibold mb-4">Created Tasks</h2>
          <div className="grid gap-4">
            {taskData.tasks.map((taskItem) => (
              <div key={taskItem.id} className="bg-white rounded-lg shadow mb-4 overflow-hidden">
                <div className="p-4 pb-2 flex flex-row items-start justify-between">
                  <div className="flex items-start">
                    <div className="mr-3">
                      {getTaskTypeIcon(taskItem.task.task_type)}
                    </div>
                    <div>
                      <h3 className="text-lg font-medium">{taskItem.task.title}</h3>
                      <p className="text-gray-600 mt-1">{taskItem.task.description}</p>
                      <div className="mt-2">
                        {getStatusBadge(taskItem.status)}
                      </div>
                    </div>
                  </div>
                  <div>
                    {taskItem.task.task_type === 'quiz' && (
                      <button
                        onClick={() => handleQuizStart(taskItem.id)}
                        className="bg-blue-500 hover:bg-blue-600 text-white py-1 px-3 rounded text-sm"
                      >
                        Start Quiz
                      </button>
                    )}
                  </div>
                </div>
                <div className="px-4 py-2 bg-gray-50 border-t flex justify-between items-center text-sm text-gray-500">
                  <div className="flex items-center">
                    <Clock className="h-4 w-4 mr-1" />
                    <span>Created: {new Date(taskItem.created_at).toLocaleString()}</span>
                  </div>
                  {taskItem.due_date && (
                    <div>
                      Due: {new Date(taskItem.due_date).toLocaleDateString()}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {learningResources && (
        <div className="mt-8">
          <h2 className="text-2xl font-bold mb-6 flex items-center">
            <BookOpen className="mr-2 text-indigo-600" />
            Learning Resources
          </h2>
          
          {Object.entries(learningResources.resources).map(([topic, resources]) => (
            <ResourceSection key={topic} title={topic} resources={resources} />
          ))}
        </div>
      )}

      {/* Add chat system */}
      <div className="chat-system">
        <img
          src="./images/chatbot.png"
          alt="Chat Assistant"
          className="chatbot-icon fixed bottom-8 right-8 w-12 h-12 cursor-pointer rounded-full shadow-lg"
          onClick={() => setIsOpen(!isOpen)}
        />
       
        <div className={`chat-popup fixed bottom-24 right-8 w-96 bg-white rounded-lg shadow-xl ${isOpen ? 'show' : 'hidden'}`}>
          <div className="chat-header bg-indigo-600 text-white p-4 rounded-t-lg flex justify-between items-center">
            <h3 className="font-semibold">Study Assistant</h3>
            <button onClick={() => setIsOpen(false)} className="text-2xl">&times;</button>
          </div>
         
          <div className="messages h-96 overflow-y-auto p-4">
            {messages.map((msg, i) => (
              <div key={i} className={`message ${msg.role} mb-4 ${msg.role === 'assistant' ? 'bg-gray-100' : 'bg-indigo-50'} rounded-lg p-3`}>
                {msg.image && <img src={msg.image} alt="Uploaded content" className="max-w-full rounded-lg mb-2" />}
                <p dangerouslySetInnerHTML={renderMessage(msg.content)} />
              </div>
            ))}
            {isTyping && (
              <div className="typing-indicator flex space-x-2 p-3">
                <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></span>
                <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-100"></span>
                <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-200"></span>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
         
          {imagePreviewing && (
            <div className="image-preview p-2 border-t">
              <div className="relative inline-block">
                <img src={imagePreviewing} alt="Preview" className="max-h-32 rounded" />
                <button onClick={handleClearImage} className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center">&times;</button>
              </div>
            </div>
          )}
         
          <form onSubmit={handleChatSubmit} className="chat-input border-t p-4 flex items-center gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type your question..."
              ref={inputRef}
              className="flex-1 border rounded-lg px-3 py-2 focus:outline-none focus:border-indigo-500"
            />
            <button
              type="button"
              onClick={() => fileInputRef.current.click()}
              className="text-gray-500 hover:text-indigo-600"
              title="Upload image"
            >
              📎
            </button>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept="image/*"
              className="hidden"
            />
            <button 
              type="submit" 
              className={`px-4 py-2 rounded-lg ${(!input.trim() && !image) ? 'bg-gray-300' : 'bg-indigo-600 hover:bg-indigo-700'} text-white`}
              disabled={!input.trim() && !image}
            >
              Send
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;


