import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AuthProvider, useAuth } from './apps/contexts/authContext';
import { auth } from "./data/firebase";
import { signOut } from "firebase/auth";

import Signin from './apps/Signin/Signin';
import Login from './apps/Login/Login';

import Home from './components/Home';
import Header from './components/Header';
import JoinOffice from './apps/JoinOffice/JoinOffice';
import UserProfile from './apps/Profile/UserProfile';

import RadiosArg from './apps/Radios/RadiosArg';
import Claves from './apps/Claves/Claves';
import Contador from './apps/Contador/Contador';
import Cumples from './apps/Cumples/Cumples';

import './App.css';

const App = () => {
  return (
    <AuthProvider>
      <Router>
        <AppContent />
      </Router>
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
        <Route path="/contador" element={user ? <Contador /> : <Navigate to="/login" />} />
        <Route path="/cumples" element={user ? <Cumples /> : <Navigate to="/login" />} />
        <Route path="/claves" element={user ? <Claves /> : <Navigate to="/login" />} />
        <Route path="/radios" element={user ? <RadiosArg /> : <Navigate to="/login" />} />
        <Route path="/join-office" element={user ? <JoinOffice /> : <Navigate to="/login" />} />
        <Route path="/profile" element={user ? <UserProfile /> : <Navigate to="/login" />} />
      </Routes>
    </>
  );
};

// export default App;


// Procesando todo:
// (4)[{… }, {… }, {… }, {… }]
// 0:
//   cobrando: "1212"
// completed: false
// formaPago:"sesión"
// formapago:"sesión"
// id:"HCkvLn4Nr4Ece7vQuGhp"
// notas:[{… }]
// pagos:Array(1)
// 0:
// fechaPago:"31/7/2024"
// formaPago:"efectivo"
// montoPagado:"1212"
// pagoId:17226453323 