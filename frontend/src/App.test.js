import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, Navigate, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './App.css';


import Admin from './pages/Admin';
import LiveQueue from './pages/LiveQueue';
import Reports from './pages/Reports';
import Login from './pages/Login';
import Home from './pages/Home';


const Navbar = ({ userRole, setUserRole }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.clear();
    setUserRole(null);
    navigate('/login');
  };

  return (
      <nav className="navbar">
        <div className="nav-logo">WITBANK QUEUEMASTER</div>
        <div className="nav-links">
          <Link to="/">Home</Link>
          <Link to="/tracker">TV View</Link>

          {/* Visible to anyone logged in (Washer or Admin) */}
          {userRole && <Link to="/admin">Staff Admin</Link>}

          {/* Strictly for the Administrator only */}
          {userRole === 'ADMIN' && <Link to="/reports">Financials</Link>}

          {!userRole ? (
              <Link to="/login" className="login-link">Staff Login</Link>
          ) : (
              <button onClick={handleLogout} className="btn-delete" style={{marginLeft: '15px'}}>Logout</button>
          )}
        </div>
      </nav>
  );
};


const AdminRoute = ({ children }) => {
  const role = localStorage.getItem('userRole');
  return role === 'ADMIN' ? children : <Navigate to="/login" />;
};

function App() {
  const [bookings, setBookings] = useState([]);
  const [userRole, setUserRole] = useState(localStorage.getItem('userRole'));

  const fetchBookings = async () => {
    try {
      const res = await axios.get('http://localhost:8080/api/bookings');
      setBookings(res.data);
    } catch (err) {
      console.error("Backend Connection Error: Check if Spring Boot is running.");
    }
  };

  useEffect(() => {
    fetchBookings();
    const interval = setInterval(fetchBookings, 5000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const handleStorageChange = () => {
      setUserRole(localStorage.getItem('userRole'));
    };
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  return (
      <Router>
        <div className="App">
          {/* Pass role state to Navbar for real-time UI updates */}
          <Navbar userRole={userRole} setUserRole={setUserRole} />

          <div className="content-area">
            <Routes>
              {/* Public Access */}
              <Route path="/" element={<Home />} />
              <Route path="/tracker" element={<LiveQueue bookings={bookings} />} />
              <Route path="/login" element={<Login onLogin={() => setUserRole(localStorage.getItem('userRole'))} />} />

              {/* Staff Access (Any logged-in user) */}
              <Route path="/admin" element={
                userRole ? <Admin /> : <Navigate to="/login" />
              } />

              {/* Restricted Access (Administrator only) */}
              <Route path="/reports" element={
                <AdminRoute>
                  <Reports />
                </AdminRoute>
              } />

              {/* Fallback */}
              <Route path="*" element={<Navigate to="/" />} />
            </Routes>
          </div>

          <footer className="footer">
            <p>&copy; 2026 QueueMaster Witbank | Full-Stack Enterprise Project</p>
          </footer>
        </div>
      </Router>
  );
}

export default App;