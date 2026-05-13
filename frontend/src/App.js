import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import axios from 'axios';
import './App.css';

import Navbar from './Navbar';
import Home from './pages/Home';
import Booking from './pages/Booking';
import LiveQueue from './pages/LiveQueue';
import Admin from './pages/Admin';
import Reports from './pages/Reports';
import Login from './pages/Login';
import Signup from './pages/Signup';
import ManageStaff from './pages/ManageStaff';

function App() {
  const [userRole, setUserRole] = useState(localStorage.getItem('userRole'));

  useEffect(() => {
    const checkBackend = async () => {
      try {
        await axios.get('http://localhost:8080/api/bookings');
      } catch (err) {
        console.error("Backend offline...");
      }
    };
    checkBackend();
  }, []);

  const ProtectedRoute = ({ children, allowedRoles }) => {
    if (!userRole) return <Navigate to="/login" />;
    if (!allowedRoles.includes(userRole)) return <Navigate to="/" />;
    return children;
  };

  return (
      <Router>
        <div className="App">
          <Navbar userRole={userRole} setUserRole={setUserRole} />
          <main>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/book" element={<Booking />} />
              <Route path="/tracker" element={<LiveQueue />} />
              <Route path="/login" element={<Login setUserRole={setUserRole} />} />

              <Route path="/admin" element={
                <ProtectedRoute allowedRoles={['WASHER', 'ADMIN']}>
                  <Admin />
                </ProtectedRoute>
              } />

              <Route path="/manage-staff" element={
                <ProtectedRoute allowedRoles={['ADMIN']}>
                  <ManageStaff />
                </ProtectedRoute>
              } />

              <Route path="/reports" element={
                <ProtectedRoute allowedRoles={['ADMIN']}>
                  <Reports />
                </ProtectedRoute>
              } />

              {/* Admin-Only Registration */}
              <Route path="/signup" element={
                <ProtectedRoute allowedRoles={['ADMIN']}>
                  <Signup />
                </ProtectedRoute>
              } />

              <Route path="*" element={<Navigate to="/" />} />
            </Routes>
          </main>
          <footer style={{ textAlign: 'center', padding: '20px', color: '#64748b', fontSize: '0.8rem' }}>
            &copy; 2026 QueueMasters | Witbank Central Branch
          </footer>
        </div>
      </Router>
  );
}

export default App;