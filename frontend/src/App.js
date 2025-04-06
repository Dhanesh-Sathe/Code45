import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import Home from './pages/Home';
import Login from './pages/auth/Login';
import Signup from './pages/auth/Signup';
import ProfileSetup from './pages/onboarding/ProfileSetup';
import LearningStyleQuiz from './pages/onboarding/LearningStyleQuiz';
import DiagnosticTest from './pages/onboarding/DiagnosticTest';
import Dashboard from './pages/dashboard/Dashboard';
import LearningPath from './pages/learning/LearningPath';
import Challenges from './pages/challenges/Challenges';
import ProtectedRoute from './components/auth/ProtectedRoute';
import ParentDashboard from './pages/dashboard/ParentDashboard';
import { AuthProvider } from './contexts/AuthContext';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen flex flex-col">
          <Navbar />
          <main className="flex-grow">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route 
                path="/profile-setup" 
                element={
                  <ProtectedRoute>
                    <ProfileSetup />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/learning-style-quiz" 
                element={
                  // <ProtectedRoute>
                    <LearningStyleQuiz />
                  // </ProtectedRoute>
                } 
              />
              <Route 
                path="/diagnostic-test" 
                element={
                  <ProtectedRoute>
                    <DiagnosticTest />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/dashboard" 
                element={
                  <ProtectedRoute>
                    <Dashboard />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/learning-path" 
                element={
                  <ProtectedRoute>
                    <LearningPath />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/challenges" 
                element={
                  <ProtectedRoute>
                    <Challenges />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/parent-dashboard" 
                element={
                  <ProtectedRoute>
                    <ParentDashboard />
                  </ProtectedRoute>
                } 
              />
            </Routes>
          </main>
          <Footer />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;

