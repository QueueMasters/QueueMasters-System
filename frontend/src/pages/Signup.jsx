import React, { useState } from 'react';
import axios from 'axios';

const Signup = () => {
    const [formData, setFormData] = useState({
        username: '',
        password: '',
        role: 'WASHER'
    });

    const userRole = localStorage.getItem('userRole');

    const handleSignup = async (e) => {
        e.preventDefault();

        if (userRole !== 'ADMIN') {
            alert("CRITICAL ERROR: Unauthorized Attempt. Only System Administrators are permitted to register new staff members.");
            return;
        }

        try {
            await axios.post('http://localhost:8080/api/auth/register', formData);
            alert(`SUCCESS: ${formData.role} account created for ${formData.username}.`);
            setFormData({ username: '', password: '', role: 'WASHER' });
        } catch (error) {
            alert("SYSTEM ERROR: Registration failed. Ensure the backend is active and the username is unique.");
        }
    };

    if (userRole !== 'ADMIN') {
        return (
            <div className="admin-container" style={{ textAlign: 'center', marginTop: '100px' }}>
                <div style={{
                    background: '#fff1f2',
                    border: '1px solid #fecdd3',
                    padding: '40px',
                    borderRadius: '24px',
                    maxWidth: '500px',
                    margin: '0 auto'
                }}>
                    <h2 style={{ color: '#e11d48', fontWeight: '800', fontSize: '2rem', margin: '0 0 10px 0' }}>403</h2>
                    <h3 style={{ color: '#0f172a', margin: '0 0 10px 0' }}>ACCESS FORBIDDEN</h3>
                    <p style={{ color: '#64748b', fontSize: '0.95rem', lineHeight: '1.5' }}>
                        Your current authority level does not permit user registration.
                        Please contact the System Administrator to add new staff.
                    </p>
                    <button
                        onClick={() => window.history.back()}
                        style={{
                            marginTop: '20px',
                            padding: '10px 20px',
                            background: '#0f172a',
                            color: 'white',
                            border: 'none',
                            borderRadius: '8px',
                            cursor: 'pointer'
                        }}
                    >
                        Return to Safety
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="booking-form">
            <h3>Register New Staff</h3>
            <form onSubmit={handleSignup}>
                <div style={{ marginBottom: '15px' }}>
                    <label style={{ display: 'block', fontSize: '0.8rem', color: '#64748b', marginBottom: '5px' }}>Staff Username</label>
                    <input
                        type="text"
                        placeholder="e.g. jdoe_staff"
                        value={formData.username}
                        onChange={e => setFormData({...formData, username: e.target.value})}
                        required
                    />
                </div>

                <div style={{ marginBottom: '15px' }}>
                    <label style={{ display: 'block', fontSize: '0.8rem', color: '#64748b', marginBottom: '5px' }}>Access Password</label>
                    <input
                        type="password"
                        placeholder="••••••••"
                        value={formData.password}
                        onChange={e => setFormData({...formData, password: e.target.value})}
                        required
                    />
                </div>

                <div style={{ marginBottom: '25px' }}>
                    <label style={{ display: 'block', fontSize: '0.8rem', color: '#64748b', marginBottom: '5px' }}>Assign Authority Level</label>
                    <select
                        value={formData.role}
                        onChange={e => setFormData({...formData, role: e.target.value})}
                    >
                        <option value="WASHER">WASHER (Yard & Operations)</option>
                        <option value="ADMIN">ADMIN (Management & Finance)</option>
                    </select>
                </div>

                <button type="submit" className="cta-button">Register Account</button>
            </form>
        </div>
    );
};

export default Signup;