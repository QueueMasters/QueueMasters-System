import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

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
                <Link to="/tracker">Live Queue</Link>

                {userRole && <Link to="/admin">Dashboard</Link>}

                {userRole === 'ADMIN' && (
                    <>
                        <Link to="/reports">Analytics</Link>
                        <Link to="/manage-staff">Management</Link>
                        <Link to="/signup" style={{ color: 'var(--accent)' }}>+ Staff</Link>
                    </>
                )}

                {!userRole ? (
                    <Link to="/login" className="login-link" style={{
                        background: 'rgba(255,255,255,0.1)',
                        padding: '8px 16px',
                        borderRadius: '8px'
                    }}>Staff Login</Link>
                ) : (
                    <button onClick={handleLogout} className="btn-delete" style={{
                        marginLeft: '20px',
                        background: 'transparent',
                        border: '1px solid rgba(255,255,255,0.3)',
                        color: 'white',
                        padding: '6px 12px'
                    }}>Logout</button>
                )}
            </div>
        </nav>
    );
};

export default Navbar;