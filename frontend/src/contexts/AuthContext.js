import { createContext, useContext, useState } from 'react';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  const login = (userData) => {
    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('user_id');
    localStorage.removeItem('userType');
    setUser(null);
  };

  const updateUserProfile = (profileData) => {
    setUser(prevUser => ({
      ...prevUser,
      ...profileData
    }));
  };

  const value = {
    user,
    login,
    logout,
    updateUserProfile
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}

