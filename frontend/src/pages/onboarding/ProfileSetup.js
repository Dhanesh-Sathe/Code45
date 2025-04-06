import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { motion } from 'framer-motion';
import axios from 'axios';
import API_ENDPOINTS from '../../config/api';

export default function ProfileSetup() {
  const { user, updateUserProfile } = useAuth();
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [userType, setUserType] = useState('');
  const [profileImage, setProfileImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  // Get user_id from localStorage
  const userId = localStorage.getItem('user_id');

  useEffect(() => {
    // Check if user_id exists
    if (!userId) {
      console.error('No user ID found');
      setError('Session expired. Please login again.');
      navigate('/login');
      return;
    }
  }, [userId, navigate]);

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    phoneNumber: '',
    address: '',
    user_id: userId, // Initialize with userId
    
    // Student specific fields
    grade: '',
    school: '',
    dateOfBirth: '',
    parentName: '',
    parentEmail: '',
    parentPhone: '',

    // Parent specific fields
    number_of_children: '',
    children_names: '',
    occupation: '',
    relation_to_student: '',
    emergency_contact: '',
  });

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfileImage(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleError = (err) => {
    console.error('Profile setup error:', err);
    if (err.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      setError(err.response.data.detail || 
              err.response.data.message || 
              err.response.data.error || 
              'Failed to set up profile. Please try again.');
    } else if (err.request) {
      // The request was made but no response was received
      setError('No response from server. Please try again later.');
    } else {
      // Something happened in setting up the request that triggered an Error
      setError('Failed to set up profile. Please try again.');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!userId) {
      setError('No user ID found. Please login again.');
      navigate('/login');
      return;
    }

    setLoading(true);
    setError('');

    const endpoint = userType === 'student' 
      ? API_ENDPOINTS.STUDENT_PROFILE 
      : API_ENDPOINTS.PARENT_PROFILE;

    try {
      const formDataToSend = new FormData();
      
      if (userType === 'student') {
        // Store grade in localStorage before sending to API
        localStorage.setItem('userGrade', formData.grade);
        
        // Student profile fields
        formDataToSend.append('user_id', userId);
        formDataToSend.append('first_name', formData.firstName);
        formDataToSend.append('last_name', formData.lastName);
        formDataToSend.append('grade', formData.grade);
        formDataToSend.append('school_name', formData.school);
        formDataToSend.append('date_of_birth', formData.dateOfBirth);
        formDataToSend.append('phone_number', formData.phoneNumber);
        formDataToSend.append('address', formData.address);
        formDataToSend.append('parent_name', formData.parentName);
        formDataToSend.append('parent_email', formData.parentEmail);
        formDataToSend.append('parent_phone', formData.parentPhone);
      } else {
        // Parent profile fields
        formDataToSend.append('user_id', userId);
        formDataToSend.append('first_name', formData.firstName);
        formDataToSend.append('last_name', formData.lastName);
        formDataToSend.append('phone_number', formData.phoneNumber);
        formDataToSend.append('occupation', formData.occupation);
        formDataToSend.append('number_of_children', formData.number_of_children);
        formDataToSend.append('children_names', formData.children_names);
        formDataToSend.append('address', formData.address);
        formDataToSend.append('relation_to_student', formData.relation_to_student);
        formDataToSend.append('emergency_contact', formData.emergency_contact);
      }

      // Log the data being sent (for debugging)
      console.log('Sending data to:', endpoint);
      console.log('User ID being sent:', userId);
      
      for (let pair of formDataToSend.entries()) {
        console.log(pair[0] + ': ' + pair[1]);
      }

      const response = await axios.post(endpoint, formDataToSend, {
        headers: {
          'Content-Type': 'multipart/form-data',
        }
      });

      if (response.status === 201 || response.status === 200) {
        localStorage.setItem('userType', userType);
        if (updateUserProfile) {
          await updateUserProfile({
            ...response.data,
            userType,
          });
        }
        if (userType === 'student') {
          navigate('/learning-style-quiz');
        } else {
          navigate('/parent-dashboard');
        }
      }
    } catch (err) {
      handleError(err);
    } finally {
      setLoading(false);
    }
  };

  // Add error display in the UI
  const renderError = () => {
    if (!error) return null;
    
    return (
      <div className="mb-4 bg-red-50 border-l-4 border-red-400 p-4 rounded">
        <div className="flex">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="ml-3">
            <p className="text-sm text-red-700">{error}</p>
          </div>
        </div>
      </div>
    );
  };

  // Update the submit button to show loading state
  const renderSubmitButton = () => (
    <button
      type="submit"
      disabled={loading}
      className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
    >
      {loading ? (
        <span className="flex items-center">
          <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          Saving...
        </span>
      ) : (
        'Complete Profile Setup'
      )}
    </button>
  );

  const renderUserTypeSelection = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-white p-8 rounded-lg shadow-lg"
    >
      <h2 className="text-2xl font-bold text-center text-gray-900 mb-8">
        I am a...
      </h2>
      <div className="space-y-4">
        <button
          onClick={() => {
            setUserType('student');
            setStep(2);
          }}
          className="w-full p-4 text-left border rounded-lg hover:border-indigo-500 focus:outline-none focus:border-indigo-500 transition-colors duration-200"
        >
          <div className="flex items-center">
            <div className="ml-3">
              <div className="text-lg font-medium text-gray-900">Student</div>
              <div className="text-sm text-gray-500">I want to learn and grow</div>
            </div>
          </div>
        </button>

        <button
          onClick={() => {
            setUserType('parent');
            setStep(2);
          }}
          className="w-full p-4 text-left border rounded-lg hover:border-indigo-500 focus:outline-none focus:border-indigo-500 transition-colors duration-200"
        >
          <div className="flex items-center">
            <div className="ml-3">
              <div className="text-lg font-medium text-gray-900">Parent</div>
              <div className="text-sm text-gray-500">I want to monitor my child's progress</div>
            </div>
          </div>
        </button>
      </div>
    </motion.div>
  );

  const renderStudentForm = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-white p-6 sm:p-8 rounded-lg shadow-lg w-full max-w-lg mx-auto"
    >
      <h2 className="text-2xl font-bold text-center text-gray-900 mb-6">
        Student Profile Setup
      </h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Profile Image Section */}
        <div className="text-center mb-8">
          <div className="flex justify-center">
            <div className="relative">
              {imagePreview ? (
                <img
                  src={imagePreview}
                  alt="Profile preview"
                  className="w-32 h-32 rounded-full object-cover border-4 border-indigo-100"
                />
              ) : (
                <div className="w-32 h-32 rounded-full bg-indigo-50 flex items-center justify-center border-4 border-indigo-100">
                  <svg className="h-16 w-16 text-indigo-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
              )}
              <label className="absolute bottom-0 right-0 bg-indigo-600 rounded-full p-2 cursor-pointer hover:bg-indigo-700 transition-colors">
                <svg className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <input
                  type="file"
                  className="hidden"
                  onChange={handleImageChange}
                  accept="image/*"
                />
              </label>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {/* Basic Information */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
            <input
              type="text"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
            <input
              type="text"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              required
            />
          </div>
        </div>

        {/* Student Specific Information */}
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Grade</label>
            <select
              name="grade"
              value={formData.grade}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              required
            >
              <option value="">Select Grade</option>
              {[...Array(12)].map((_, i) => (
                <option key={i + 1} value={i + 1}>Grade {i + 1}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">School Name</label>
            <input
              type="text"
              name="school"
              value={formData.school}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Date of Birth</label>
            <input
              type="date"
              name="dateOfBirth"
              value={formData.dateOfBirth}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              required
            />
          </div>
        </div>

        {/* Contact Information */}
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
            <input
              type="tel"
              name="phoneNumber"
              value={formData.phoneNumber}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              placeholder="Enter your phone number"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
            <textarea
              name="address"
              value={formData.address}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              rows="2"
              placeholder="Enter your full address"
              required
            />
          </div>
        </div>

        {/* Parent Information */}
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Parent's Name</label>
            <input
              type="text"
              name="parentName"
              value={formData.parentName}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Parent's Email</label>
            <input
              type="email"
              name="parentEmail"
              value={formData.parentEmail}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Parent's Phone</label>
            <input
              type="tel"
              name="parentPhone"
              value={formData.parentPhone}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              required
            />
          </div>
        </div>

        {/* Submit Button */}
        <div className="mt-6">
          <button
            type="submit"
            disabled={loading}
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
          >
            {loading ? 'Setting up...' : 'Complete Setup'}
          </button>
        </div>
      </form>
    </motion.div>
  );

  const renderParentForm = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-white p-6 sm:p-8 rounded-lg shadow-lg w-full max-w-lg mx-auto"
    >
      <h2 className="text-2xl font-bold text-center text-gray-900 mb-6">
        Parent Profile Setup
      </h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Profile Image Section */}
        <div className="text-center mb-8">
          <div className="flex justify-center">
            <div className="relative">
              {imagePreview ? (
                <img
                  src={imagePreview}
                  alt="Profile preview"
                  className="w-32 h-32 rounded-full object-cover border-4 border-indigo-100"
                />
              ) : (
                <div className="w-32 h-32 rounded-full bg-indigo-50 flex items-center justify-center border-4 border-indigo-100">
                  <svg className="h-16 w-16 text-indigo-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
              )}
              <label
                htmlFor="profile-image"
                className="absolute bottom-0 right-0 bg-indigo-600 rounded-full p-2 cursor-pointer hover:bg-indigo-700 transition-colors duration-200 shadow-lg"
              >
                <svg className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <input
                  type="file"
                  id="profile-image"
                  className="hidden"
                  accept="image/*"
                  onChange={handleImageChange}
                />
              </label>
            </div>
          </div>
          <p className="mt-2 text-sm text-gray-500">Upload your profile picture</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {/* Basic Information */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
            <input
              type="text"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
            <input
              type="text"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
            <input
              type="tel"
              name="phoneNumber"
              value={formData.phoneNumber}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Occupation</label>
            <input
              type="text"
              name="occupation"
              value={formData.occupation}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              required
            />
          </div>
        </div>

        {/* Children Information */}
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Number of Children</label>
            <input
              type="number"
              name="number_of_children"
              value={formData.number_of_children}
              onChange={handleChange}
              min="1"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Children Names</label>
            <textarea
              name="children_names"
              value={formData.children_names}
              onChange={handleChange}
              placeholder="Enter children names separated by comma"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              rows="2"
              required
            />
          </div>
        </div>

        {/* Additional Information */}
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
            <textarea
              name="address"
              value={formData.address}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              rows="2"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Relation to Student</label>
            <select
              name="relation_to_student"
              value={formData.relation_to_student}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              required
            >
              <option value="">Select Relation</option>
              <option value="Mother">Mother</option>
              <option value="Father">Father</option>
              <option value="Guardian">Guardian</option>
              <option value="Other">Other</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Emergency Contact</label>
            <input
              type="tel"
              name="emergency_contact"
              value={formData.emergency_contact}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              required
            />
          </div>
        </div>

        {/* Form Actions */}
        <div className="flex justify-between pt-6">
          <button
            type="button"
            onClick={() => setStep(1)}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-colors duration-200"
          >
            Back
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-200 disabled:opacity-50"
          >
            {loading ? (
              <div className="flex items-center">
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Setting up...
              </div>
            ) : (
              'Complete Setup'
            )}
          </button>
        </div>
      </form>
    </motion.div>
  );

  if (!userId) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-50 to-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full mx-auto">
        {renderError()}
        {step === 1 && renderUserTypeSelection()}
        {step === 2 && (userType === 'student' ? renderStudentForm() : renderParentForm())}
      </div>
    </div>
  );
}























