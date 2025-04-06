import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { Menu, X } from 'react-feather';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/');
      setIsMenuOpen(false);
    } catch (error) {
      console.error('Error during logout:', error);
    }
  };

  const NavLinks = () => (
    <>
      {user ? (
        <>
          <Link 
            to="/dashboard" 
            className="text-white hover:bg-indigo-700 px-3 py-2 rounded-md block"
            onClick={() => setIsMenuOpen(false)}
          >
            Dashboard
          </Link>
          <Link 
            to="/learning-path" 
            className="text-white hover:bg-indigo-700 px-3 py-2 rounded-md block"
            onClick={() => setIsMenuOpen(false)}
          >
            Learning Path
          </Link>
          <Link 
            to="/challenges" 
            className="text-white hover:bg-indigo-700 px-3 py-2 rounded-md block"
            onClick={() => setIsMenuOpen(false)}
          >
            Challenges
          </Link>
          <button
            onClick={handleLogout}
            className="text-white hover:bg-indigo-700 px-3 py-2 rounded-md block w-full text-left"
          >
            Logout
          </button>
        </>
      ) : (
        <>
          <Link 
            to="/login" 
            className="text-white hover:bg-indigo-700 px-3 py-2 rounded-md block"
            onClick={() => setIsMenuOpen(false)}
          >
            Login
          </Link>
          <Link 
            to="/signup" 
            className="text-white hover:bg-indigo-700 px-3 py-2 rounded-md block"
            onClick={() => setIsMenuOpen(false)}
          >
            Sign Up
          </Link>
        </>
      )}
    </>
  );

  return (
    <nav className="bg-indigo-600">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo and Brand Name */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2">
              <img 
                src="./images/logo.png" 
                alt="EduTrack Logo" 
                className="h-8 w-auto"
              />
              <span className="text-white font-bold text-xl hidden sm:block">
                EduTrack
              </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-4">
            <NavLinks />
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-white hover:bg-indigo-700 focus:outline-none"
            >
              {isMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-indigo-600 shadow-lg">
            <NavLinks />
          </div>
        </div>
      )}
    </nav>
  );
}



