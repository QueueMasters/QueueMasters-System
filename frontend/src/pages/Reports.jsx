import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Reports = () => {

    const [stats, setStats] = useState({
        totalCars: 0,
        projectedRevenue: 0,
        dailyTotal: 0,
        typeBreakdown: { Standard: 0, Valet: 0, Engine: 0 }
    });

    const fetchAllData = async () => {
        try {

            const liveRes = await axios.get('http://localhost:8080/api/bookings');
            const liveData = liveRes.data;


            const dailyRes = await axios.get('http://localhost:8080/api/bookings/daily-total');
            const dailyTotalValue = dailyRes.data;

            let projectedRev = 0;
            let counts = { Standard: 0, Valet: 0, Engine: 0 };

            liveData.forEach(car => {
                if (car.washType.includes("Standard")) { projectedRev += 100; counts.Standard++; }
                else if (car.washType.includes("Full Valet")) { projectedRev += 350; counts.Valet++; }
                else if (car.washType.includes("Engine")) { projectedRev += 150; counts.Engine++; }
            });

            setStats({
                totalCars: liveData.length,
                projectedRevenue: projectedRev,
                dailyTotal: dailyTotalValue,
                typeBreakdown: counts
            });
        } catch (err) {
            console.error("Error fetching branch analytics:", err);
        }
    };


    useEffect(() => {
        fetchAllData();
        const interval = setInterval(fetchAllData, 5000);
        return () => clearInterval(interval);
    }, []);

    const getPercentage = (count) => (stats.totalCars > 0 ? (count / stats.totalCars) * 100 : 0);

    return (
        <div className="reports-container">
            <header className="reports-header">
                <h1>Witbank Branch Analytics</h1>
                <p>Live Financial Oversight</p>
            </header>

            <div className="stats-grid">
                {/* PERSISTENT DAILY TOTAL (The one you wanted) */}
                <div className="stat-card money-focus">
                    <h3>Total Revenue for Today</h3>
                    <p className="stat-number">R {stats.dailyTotal.toFixed(2)}</p>
                    <small>{new Date().toLocaleDateString()} - Sales History</small>
                </div>

                {/* CURRENT QUEUE DATA */}
                <div className="stat-card">
                    <h3>Cars in Queue</h3>
                    <p className="stat-number">{stats.totalCars}</p>
                    <small>Projected: R {stats.projectedRevenue}</small>
                </div>
            </div>

            <div className="breakdown-section">
                <h2>Current Queue Composition</h2>
                <div className="bar-container">
                    <div className="bar-group">
                        <div className="bar-label">Standard Wash</div>
                        <div className="bar-bg">
                            <div className="bar-fill" style={{width: `${getPercentage(stats.typeBreakdown.Standard)}%`}}></div>
                        </div>
                    </div>

                    <div className="bar-group">
                        <div className="bar-label">Full Valet</div>
                        <div className="bar-bg">
                            <div className="bar-fill valet" style={{width: `${getPercentage(stats.typeBreakdown.Valet)}%`}}></div>
                        </div>
                    </div>

                    <div className="bar-group">
                        <div className="bar-label">Engine Clean</div>
                        <div className="bar-bg">
                            <div className="bar-fill engine" style={{width: `${getPercentage(stats.typeBreakdown.Engine)}%`}}></div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Reports;