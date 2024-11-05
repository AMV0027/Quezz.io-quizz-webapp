// src/App.jsx
import React from 'react';
import { Navigate, Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import { AuthProvider, useAuth } from './config/AuthContext';
import CreateQuiz from './pages/CreateQuiz';
import Home from './pages/Home';
import Info from './pages/Info';
import JoinQuiz from './pages/JoinQuiz';
import Login from './pages/Login';
import './styles.css';

const App = () => {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/home" element={<Home />} />
          <Route path='/info' element={<Info />} />
          <Route path="/create-quiz" element={<ProtectedRoute><CreateQuiz /></ProtectedRoute>} />
          <Route path="/join-quiz" element={<ProtectedRoute><JoinQuiz /></ProtectedRoute>} />
        </Routes>
      </Router>
    </AuthProvider>
  );
};

const ProtectedRoute = ({ children }) => {
  const { user } = useAuth();
  return user ? children : <Navigate to="/" />;
};

export default App;
