const API_BASE_URL = 'http://localhost:8000/api';

export const API_ENDPOINTS = {
  STUDENT_PROFILE: `${API_BASE_URL}/profile/student/`,
  PARENT_PROFILE: `${API_BASE_URL}/profile/parent/`,
  QUIZ_RESULTS: `${API_BASE_URL}/path/generate_learning_path/`,
};

export default API_ENDPOINTS;
