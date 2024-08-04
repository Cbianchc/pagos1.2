import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AuthProvider, useAuth } from './apps/contexts/authContext';
import { auth } from "./data/firebase";
import { signOut } from "firebase/auth";
import Home from './components/Home';
import Header from './components/Header';
import Signin from './apps/Signin/Signin';
import Login from './apps/Login/Login';
import JoinOffice from './apps/JoinOffice/JoinOffice';
import UserProfile from './apps/Profile/UserProfile';
import { ThemeProviderWrapper } from './apps/contexts/ThemeContext';

// import './App.css';

const App = () => {
  return (
    <AuthProvider>
      <ThemeProviderWrapper>
        <Router>
          <AppContent />
        </Router>
      </ThemeProviderWrapper>
    </AuthProvider>
  );
};

const AppContent = () => {
  const { user } = useAuth();
  const location = useLocation();

  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error("Error al cerrar sesión: ", error);
    }
  };

  //esto es para que header no aparezca en join-office, solo por que queda feo
  const shouldShowHeader = !['/join-office', '/signin', '/login'].includes(location.pathname);


  return (
    <>
      {user && shouldShowHeader && <Header handleLogout={handleLogout} />}
      <Routes>
        <Route path="/login" element={user ? <Navigate to="/" /> : <Login />} />
        <Route path="/signin" element={user ? <Navigate to="/" /> : <Signin />} />
        <Route path="/" element={user ? <Home /> : <Navigate to="/login" />} />
        <Route path="/join-office" element={user ? <JoinOffice /> : <Navigate to="/login" />} />
        <Route path="/profile" element={user ? <UserProfile /> : <Navigate to="/login" />} />
      </Routes>
    </>
  );
};

export default App;