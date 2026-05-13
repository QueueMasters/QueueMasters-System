import React from 'react';
import { useNavigate } from 'react-router-dom';

const Home = () => {
    const navigate = useNavigate();


    const selectService = (serviceName) => {
        // We pass the selection through the 'state' object in React Router
        navigate('/book', { state: { selectedService: serviceName } });
    };

    return (
        <div className="home-container">
            <div className="hero-section">
                <h1>Premium Car Care in Witbank</h1>
                <p>Professional washing while you wait. Track your car's progress in real-time.</p>
                <button className="cta-button" onClick={() => navigate('/book')}>
                    View All Services
                </button>
            </div>

            <div className="services-grid">
                {/* Each card now has an onClick event */}
                <div className="service-card" onClick={() => selectService('Standard Wash')}>
                    <h3>Standard Wash</h3>
                    <p className="price">R100</p>
                    <ul>
                        <li>Exterior Wash</li>
                        <li>Tire Shine</li>
                        <li>Windows Cleaned</li>
                    </ul>
                    <button className="select-btn">Select Standard</button>
                </div>

                <div className="service-card highlighted" onClick={() => selectService('Full Valet')}>
                    <h3>Full Valet</h3>
                    <p className="price">R350</p>
                    <ul>
                        <li>Full Interior Deep Clean</li>
                        <li>Engine Degrease</li>
                        <li>Wax & Polish</li>
                    </ul>
                    <button className="select-btn">Select Valet</button>
                </div>

                {/* THE FIX: Changed 'Engine Wash' to 'Engine Clean' to match Booking.jsx exactly */}
                <div className="service-card" onClick={() => selectService('Engine Clean')}>
                    <h3>Engine Clean</h3>
                    <p className="price">R150</p>
                    <ul>
                        <li>Degrease Engine Bay</li>
                        <li>High Pressure Clean</li>
                        <li>Protective Coating</li>
                    </ul>
                    <button className="select-btn">Select Engine</button>
                </div>
            </div>
        </div>
    );
};

export default Home;