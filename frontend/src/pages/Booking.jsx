import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';

const Booking = () => {
    const location = useLocation();
    const navigate = useNavigate();


    const [formData, setFormData] = useState({
        plateNumber: '',
        carModel: '',
        phoneNumber: '', // Kept this so the SMS alert still works!
        washType: location.state?.selectedService || 'Standard Wash'
    });


    useEffect(() => {
        if (location.state?.selectedService) {
            setFormData(prev => ({ ...prev, washType: location.state.selectedService }));
        }
    }, [location.state]);

    const handleSubmit = async (e) => {
        e.preventDefault();


        if (formData.phoneNumber.length < 10) {
            alert("Please enter a valid 10-digit South African phone number (e.g., 082...).");
            return;
        }

        try {

            const response = await axios.post('http://localhost:8080/api/bookings', formData);

            alert(`Added to Queue! Ticket ID: ${response.data.id}`);


            navigate('/tracker');
        } catch (error) {
            console.error("Booking failed:", error);
            alert("Server connection error. Is the Backend running?");
        }
    };

    return (
        <div className="booking-container">
            <h2>Witbank Premium Auto-Care</h2>

            <form onSubmit={handleSubmit} className="booking-form">
                <h3>New Wash Entry</h3>

                <div className="input-group">
                    <label>Phone Number (For Ready Alert)</label>
                    <input
                        type="tel"
                        placeholder="e.g. 082 123 4567"
                        value={formData.phoneNumber}
                        onChange={(e) => setFormData({...formData, phoneNumber: e.target.value})}
                        required
                    />
                </div>

                <div className="input-group">
                    <label>Number Plate</label>
                    <input
                        type="text"
                        placeholder="e.g. MP 123"
                        value={formData.plateNumber}
                        onChange={(e) => setFormData({...formData, plateNumber: e.target.value.toUpperCase()})}
                        required
                    />
                </div>

                <div className="input-group">
                    <label>Car Model</label>
                    <input
                        type="text"
                        placeholder="e.g. VW Golf"
                        value={formData.carModel}
                        onChange={(e) => setFormData({...formData, carModel: e.target.value})}
                        required
                    />
                </div>

                <div className="input-group">
                    <label>Select Service</label>
                    <select
                        value={formData.washType}
                        onChange={(e) => setFormData({...formData, washType: e.target.value})}
                    >
                        <option value="Standard Wash">Standard Wash (R100)</option>
                        <option value="Full Valet">Full Valet (R350)</option>
                        <option value="Engine Clean">Engine Clean (R150)</option>
                    </select>
                </div>

                <button type="submit" className="cta-button">Add to Queue</button>
            </form>
        </div>
    );
};

export default Booking;