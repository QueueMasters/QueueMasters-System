import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Login = ({ setUserRole }) => {
    const [credentials, setCredentials] = useState({ username: '', password: '' });
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:8080/api/auth/login', credentials);
            const dbUser = response.data;

            localStorage.setItem('userRole', dbUser.role);
            localStorage.setItem('username', dbUser.username);
            setUserRole(dbUser.role);

            if (dbUser.role === 'ADMIN') {
                navigate('/reports');
            } else {
                navigate('/admin');
            }

        } catch (error) {
            console.error("Authentication Error:", error);
            alert("Wrong credentials! Access Denied.");
        }
    };

    return (
        <div className="booking-form">
            <h3>Staff System Access</h3>
            <form onSubmit={handleLogin}>
                <div style={{ marginBottom: '15px' }}>
                    <label style={{ display: 'block', fontSize: '0.8rem', color: '#64748b', marginBottom: '5px' }}>Username</label>
                    <input
                        type="text"
                        placeholder="Enter username"
                        onChange={e => setCredentials({...credentials, username: e.target.value})}
                        required
                    />
                </div>

                <div style={{ marginBottom: '25px' }}>
                    <label style={{ display: 'block', fontSize: '0.8rem', color: '#64748b', marginBottom: '5px' }}>Password</label>
                    <input
                        type="password"
                        placeholder="••••••••"
                        onChange={e => setCredentials({...credentials, password: e.target.value})}
                        required
                    />
                </div>

                <button type="submit" className="cta-button">Secure Login</button>
            </form>
        </div>
    );
};

export default Login;