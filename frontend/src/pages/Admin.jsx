import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Admin = () => {
    const [bookings, setBookings] = useState([]);
    const [pastSales, setPastSales] = useState([]);
    const [showArchive, setShowArchive] = useState(false);

    const [editingId, setEditingId] = useState(null);
    const [editData, setEditData] = useState({ plateNumber: '', carModel: '', phoneNumber: '' });

    const userRole = localStorage.getItem('userRole');

    const fetchBookings = async () => {
        try {
            const res = await axios.get('http://localhost:8080/api/bookings');
            setBookings(res.data);
        } catch (err) { console.error("Fetch error"); }
    };

    const fetchDatabaseArchive = async () => {
        try {
            const res = await axios.get('http://localhost:8080/api/bookings/all-sales');
            setPastSales(res.data);
            setShowArchive(true);
        } catch (err) { alert("Archive error"); }
    };

    useEffect(() => { fetchBookings(); }, []);

    const startEdit = (car) => {
        setEditingId(car.id);
        setEditData({
            plateNumber: car.plateNumber,
            carModel: car.carModel,
            phoneNumber: car.phoneNumber || ''
        });
    };

    const handleUpdateCar = async (id) => {
        try {
            await axios.put(`http://localhost:8080/api/bookings/${id}`, editData);
            setEditingId(null);
            fetchBookings();
        } catch (err) { alert("Update failed"); }
    };

    const handleNextStage = async (id) => {
        await axios.put(`http://localhost:8080/api/bookings/${id}/next`);
        fetchBookings();
    };

    const handleComplete = async (id) => {
        if (userRole !== 'ADMIN') return;
        if (window.confirm("Release vehicle?")) {
            await axios.delete(`http://localhost:8080/api/bookings/${id}/complete`);
            fetchBookings();
            if (showArchive) fetchDatabaseArchive();
        }
    };

    const handleClearArchive = async () => {
        if (userRole !== 'ADMIN') return;
        if (window.confirm("Wipe database?")) {
            try {
                await axios.delete('http://localhost:8080/api/bookings/clear-archive');
                setPastSales([]);
                setShowArchive(false);
            } catch (err) { alert("Wipe failed"); }
        }
    };

    return (
        <div className="admin-container">
            <header style={{ marginBottom: '30px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                    <h2 style={{ fontSize: '1.8rem', fontWeight: '800', margin: 0 }}>Staff Dashboard</h2>
                    <p style={{ color: '#94a3b8', fontSize: '0.9rem', marginTop: '10px' }}>
                        Authority: <span style={{ color: '#10b981', fontWeight: 'bold' }}>{userRole}</span>
                    </p>
                </div>
                {userRole === 'ADMIN' && (
                    <button className="cta-button" onClick={fetchDatabaseArchive} style={{ background: '#334155', border: '1px solid #3b82f6' }}>
                        📂 Fetch Database Archive
                    </button>
                )}
            </header>

            <h3>Live Operations (Active Queue)</h3>
            <table className="admin-table">
                <thead>
                <tr>
                    <th>Plate</th>
                    <th>Model</th>
                    <th>Contact</th>
                    <th>Status</th>
                    <th>Actions</th>
                </tr>
                </thead>
                <tbody>
                {bookings.map(car => (
                    <tr key={car.id}>
                        <td>
                            {editingId === car.id ? (
                                <input
                                    value={editData.plateNumber}
                                    onChange={(e) => setEditData({...editData, plateNumber: e.target.value.toUpperCase()})}
                                />
                            ) : (
                                <strong style={{ color: '#3b82f6' }}>{car.plateNumber}</strong>
                            )}
                        </td>
                        <td>
                            {editingId === car.id ? (
                                <input
                                    value={editData.carModel}
                                    onChange={(e) => setEditData({...editData, carModel: e.target.value})}
                                />
                            ) : (
                                <span style={{ color: 'black' }}>{car.carModel}</span>
                            )}
                        </td>
                        <td>
                            {editingId === car.id ? (
                                <input
                                    value={editData.phoneNumber}
                                    onChange={(e) => setEditData({...editData, phoneNumber: e.target.value})}
                                />
                            ) : (
                                <span style={{ color: '#94a3b8', fontFamily: 'monospace' }}>{car.phoneNumber}</span>
                            )}
                        </td>
                        <td><span className={`status-pill ${car.status.toLowerCase().replace(' ', '')}`}>{car.status}</span></td>
                        <td>
                            {editingId === car.id ? (
                                <div style={{ display: 'flex', gap: '5px' }}>
                                    <button onClick={() => handleUpdateCar(car.id)} className="cta-button" style={{ padding: '5px 12px' }}>Save</button>
                                    <button onClick={() => setEditingId(null)} className="btn-delete" style={{ padding: '5px 12px' }}>Cancel</button>
                                </div>
                            ) : (
                                <div style={{ display: 'flex', gap: '8px' }}>
                                    {car.status !== "Ready" && (
                                        <button className="cta-button" onClick={() => handleNextStage(car.id)} style={{ padding: '5px 12px' }}>Next</button>
                                    )}
                                    {userRole === 'ADMIN' && (
                                        <>
                                            <button onClick={() => startEdit(car)} style={{ background: '#334155', color: '#fff', border: 'none', borderRadius: '4px', padding: '5px 12px', cursor: 'pointer' }}>Edit</button>
                                            <button className="btn-delete" onClick={() => handleComplete(car.id)} style={{ padding: '5px 12px' }}>Release</button>
                                        </>
                                    )}
                                </div>
                            )}
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>

            {showArchive && (
                <div style={{ marginTop: '50px', padding: '20px', borderTop: '2px solid #334155' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
                        <h3 style={{ color: '#3b82f6', margin: 0 }}>Sales Archive</h3>
                        <div>
                            <button
                                onClick={handleClearArchive}
                                className="btn-delete"
                                style={{
                                    background: '#ef4444',
                                    color: '#ffffff',
                                    fontWeight: '800',
                                    marginRight: '15px',
                                    border: 'none'
                                }}
                            >
                                ⚠️ Wipe Archive
                            </button>
                            <button onClick={() => setShowArchive(false)} style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', fontWeight: 'bold' }}>
                                [x] Close
                            </button>
                        </div>
                    </div>
                    <table className="admin-table">
                        <thead>
                        <tr>
                            <th>Date</th>
                            <th>Plate</th>
                            <th>Service</th>
                            <th>Revenue</th>
                        </tr>
                        </thead>
                        <tbody>
                        {pastSales.map((sale, index) => (
                            <tr key={index}>
                                <td>{sale.date}</td>
                                <td>{sale.plateNumber}</td>
                                <td>{sale.washType}</td>
                                <td style={{ color: '#10b981', fontWeight: 'bold' }}>R {sale.amount.toFixed(2)}</td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default Admin;