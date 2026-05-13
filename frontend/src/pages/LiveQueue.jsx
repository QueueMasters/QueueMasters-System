import React, { useState, useEffect } from 'react';
import axios from 'axios';

const LiveQueue = () => {
    const [bookings, setBookings] = useState([]);

    const fetchQueue = async () => {
        try {
            const res = await axios.get('http://localhost:8080/api/bookings');
            setBookings(res.data);
        } catch (err) {
            console.error("Connection lost...");
        }
    };

    useEffect(() => {
        fetchQueue();
        const interval = setInterval(fetchQueue, 5000);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="tracker-container">
            <header className="tracker-header">
                <h1>Live Wash Status</h1>
                <p>Witbank Central - Real-time Updates</p>
            </header>

            <div className="status-board">
                {/* Column 1: Waiting */}
                <div className="status-column">
                    <h2 className="yellow-text">Waiting</h2>
                    {bookings.filter(b => b.status === "In Queue").map(car => (
                        <div key={car.id} className="car-ticket">
                            <span className="plate">{car.plateNumber}</span>
                            <span className="model">{car.carModel}</span>
                        </div>
                    ))}
                </div>

                {/* Column 2: Washing */}
                <div className="status-column">
                    <h2 className="blue-text">Washing</h2>
                    {bookings.filter(b => b.status === "Washing").map(car => (
                        <div key={car.id} className="car-ticket washing-anim">
                            <span className="plate">{car.plateNumber}</span>
                            <span className="model">{car.carModel}</span>
                        </div>
                    ))}
                </div>

                {/* Column 3: Ready for Collection */}
                <div className="status-column">
                    <h2 className="green-text">Ready</h2>
                    {bookings.filter(b => b.status === "Ready").map(car => (
                        <div key={car.id} className="car-ticket ready-pulse">
                            <span className="plate">{car.plateNumber}</span>
                            <span className="model">{car.carModel}</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default LiveQueue;