import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import PrivateRoute from './components/PrivateRoute.jsx';
import Layout from './components/Layout.jsx';
import Login from './pages/Login.jsx';
import Register from './pages/Register.jsx';
import Dashboard from './pages/Dashboard.jsx';
import Tasks from './pages/Tasks.jsx';
import Categories from './pages/Categories.jsx';
import Users from './pages/Users.jsx';
import { isAuthenticated } from './api/client.js';
import './App.css';

function AppContent() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const tokens = JSON.parse(localStorage.getItem('tokens') || '{}');
    if (tokens.accessToken) {
      try {
        const payload = JSON.parse(atob(tokens.accessToken.split('.')[1]));
        setUser({ id: payload.sub, role: payload.role });
      } catch {}
    }
  }, []);

  return (
    <Routes>
      <Route path="/login" element={isAuthenticated() ? <Navigate to="/" /> : <Login />} />
      <Route path="/register" element={isAuthenticated() ? <Navigate to="/" /> : <Register />} />
      <Route path="/" element={<PrivateRoute><Layout user={user}><Dashboard /></Layout></PrivateRoute>} />
      <Route path="/tasks" element={<PrivateRoute><Layout user={user}><Tasks /></Layout></PrivateRoute>} />
      <Route path="/categories" element={<PrivateRoute><Layout user={user}><Categories /></Layout></PrivateRoute>} />
      <Route path="/users" element={<PrivateRoute><Layout user={user}><Users /></Layout></PrivateRoute>} />
    </Routes>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}
