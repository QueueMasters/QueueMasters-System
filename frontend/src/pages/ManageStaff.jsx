import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ManageStaff = () => {
    const [staffList, setStaffList] = useState([]);
    const [bossUsername, setBossUsername] = useState('');
    const [editingId, setEditingId] = useState(null);
    const [editData, setEditData] = useState({ username: '', role: '' });

    const userRole = localStorage.getItem('userRole');
    const currentUsername = localStorage.getItem('username');

    const fetchStaff = async () => {
        try {
            const res = await axios.get('http://localhost:8080/api/users');
            const users = res.data;
            const originalAdmin = users
                .filter(u => u.role === 'ADMIN')
                .sort((a, b) => a.id - b.id)[0];

            if (originalAdmin) setBossUsername(originalAdmin.username);
            setStaffList(users);
        } catch (err) {
            console.error("Backend connection error");
        }
    };

    useEffect(() => { fetchStaff(); }, []);

    const startEdit = (staff) => {
        setEditingId(staff.id);
        setEditData({ username: staff.username, role: staff.role });
    };

    const handleUpdate = async (id) => {
        try {
            await axios.put(`http://localhost:8080/api/users/${id}`, editData);
            setEditingId(null);
            fetchStaff();
        } catch (err) {
            alert("Update failed");
        }
    };

    const handleRemoveStaff = async (id, username) => {
        if (userRole !== 'ADMIN') return;
        if (window.confirm(`Delete ${username}?`)) {
            try {
                await axios.delete(`http://localhost:8080/api/users/${id}`);
                fetchStaff();
            } catch (err) {
                alert("Delete failed");
            }
        }
    };

    return (
        <div className="admin-container">
            <header style={{ marginBottom: '30px' }}>
                <h2>QueueMasters HR & Security</h2>
                <p>Authority: <span style={{ color: '#00cc66', fontWeight: 'bold' }}>{userRole}</span></p>
            </header>

            <table className="admin-table">
                <thead style={{ background: '#333', color: 'white' }}>
                <tr>
                    <th>Username</th>
                    <th>Role</th>
                    <th>Actions</th>
                </tr>
                </thead>
                <tbody>
                {staffList.map(staff => (
                    <tr key={staff.id}>
                        <td>
                            {editingId === staff.id ? (
                                <input
                                    type="text"
                                    value={editData.username}
                                    onChange={(e) => setEditData({...editData, username: e.target.value})}
                                />
                            ) : (
                                <strong>{staff.username}</strong>
                            )}
                        </td>
                        <td>
                            {editingId === staff.id ? (
                                <select
                                    value={editData.role}
                                    onChange={(e) => setEditData({...editData, role: e.target.value})}
                                >
                                    <option value="WASHER">WASHER</option>
                                    <option value="ADMIN">ADMIN</option>
                                </select>
                            ) : (
                                staff.role
                            )}
                        </td>
                        <td>
                            {staff.username === bossUsername ? (
                                <span style={{ color: '#ffcc00' }}>👑 Founder</span>
                            ) : editingId === staff.id ? (
                                <>
                                    <button
                                        onClick={() => handleUpdate(staff.id)}
                                        style={{ background: '#00cc66', color: 'white', marginRight: '5px', padding: '5px 10px', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
                                    >
                                        Save
                                    </button>
                                    <button
                                        onClick={() => setEditingId(null)}
                                        style={{ padding: '5px 10px', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
                                    >
                                        Cancel
                                    </button>
                                </>
                            ) : (
                                <>
                                    <button
                                        onClick={() => startEdit(staff)}
                                        style={{ marginRight: '5px', padding: '5px 10px', cursor: 'pointer' }}
                                    >
                                        Edit
                                    </button>
                                    {staff.username !== currentUsername && (
                                        <button
                                            onClick={() => handleRemoveStaff(staff.id, staff.username)}
                                            className="btn-delete"
                                            style={{ background: '#ff1a1a', color: 'white', padding: '5px 10px', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
                                        >
                                            Delete
                                        </button>
                                    )}
                                </>
                            )}
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
};

export default ManageStaff;