import React, { useState, useEffect } from 'react';
import { Search, Shield, User } from 'lucide-react';

const API_URL = import.meta.env.VITE_API_URL;

const UserManagement = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [error, setError] = useState('');

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            setLoading(true);
            setError('');

            const token = localStorage.getItem('token');

            const response = await fetch(`${API_URL}/api/users/admin/users`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            const data = await response.json();

            if (data.success) {
                setUsers(data.users || []);
            } else {
                setError(data.error || 'Failed to load users');
            }
        } catch (err) {
            setError('Server se connect nahi ho pa raha');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const filtered = users.filter(u =>
        u.name?.toLowerCase().includes(search.toLowerCase()) ||
        u.email?.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div>
            <div style={{ marginBottom: '24px' }}>
                <h1 style={{ fontSize: '24px', fontWeight: 800, color: '#2F4156', margin: 0 }}>
                    Users Management
                </h1>
                <p style={{ color: '#567C8D', marginTop: '4px', fontSize: '14px' }}>
                    Total: {users.length} users
                </p>
            </div>

            {/* Search */}
            <div style={{
                display: 'flex', alignItems: 'center', gap: '10px',
                background: 'white', borderRadius: '50px',
                padding: '10px 20px', marginBottom: '20px',
                boxShadow: '0 2px 12px rgba(47, 65, 86, 0.05)'
            }}>
                <Search size={18} color="#8A9BAB" />
                <input
                    type="text"
                    placeholder="Search users..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    style={{ border: 'none', outline: 'none', flex: 1, fontSize: '14px' }}
                />
            </div>

            {/* Error */}
            {error && (
                <div style={{
                    background: '#FEE2E2', color: '#EF4444',
                    padding: '16px', borderRadius: '12px', marginBottom: '20px'
                }}>
                    ⚠️ {error}
                </div>
            )}

            {/* Content */}
            {loading ? (
                <p style={{ textAlign: 'center', color: '#8A9BAB', padding: '40px' }}>Loading users...</p>
            ) : filtered.length === 0 ? (
                <div style={{
                    background: 'white', borderRadius: '16px', padding: '60px',
                    textAlign: 'center', color: '#8A9BAB'
                }}>
                    <p style={{ fontSize: '16px', fontWeight: 600 }}>👥 Koi user nahi mila</p>
                    <p style={{ fontSize: '13px' }}>Total users: {users.length}</p>
                </div>
            ) : (
                <div style={{ background: 'white', borderRadius: '16px', overflow: 'hidden', boxShadow: '0 2px 12px rgba(47, 65, 86, 0.05)' }}>
                    {filtered.map((u, i) => (
                        <div key={u._id || i} style={{
                            display: 'flex', alignItems: 'center', gap: '14px',
                            padding: '14px 18px',
                            borderBottom: i < filtered.length - 1 ? '1px solid #F0EDE7' : 'none'
                        }}>
                            {/* Avatar */}
                            <div style={{
                                width: '44px',
                                height: '44px',
                                minWidth: '44px',
                                borderRadius: '50%',
                                background: '#567C8D',
                                color: 'white',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontWeight: 'bold',
                                fontSize: '16px',
                                flexShrink: 0
                            }}>
                                {u.name?.charAt(0).toUpperCase() || '?'}
                            </div>

                            {/* Info */}
                            <div style={{ flex: 1, minWidth: 0 }}>
                                <p style={{
                                    fontWeight: 600,
                                    color: '#2F4156',
                                    margin: 0,
                                    fontSize: '14px',
                                    overflow: 'hidden',
                                    textOverflow: 'ellipsis',
                                    whiteSpace: 'nowrap'
                                }}>
                                    {u.name}
                                </p>
                                <p style={{
                                    fontSize: '12px',
                                    color: '#8A9BAB',
                                    margin: '2px 0 0 0',
                                    overflow: 'hidden',
                                    textOverflow: 'ellipsis',
                                    whiteSpace: 'nowrap'
                                }}>
                                    {u.email}
                                </p>
                            </div>

                            {/* Role Badge */}
                            <span style={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: '4px',
                                padding: '6px 12px',
                                borderRadius: '50px',
                                fontSize: '11px',
                                fontWeight: 600,
                                background: u.role === 'admin' ? '#FEF3C7' : '#E0E7FF',
                                color: u.role === 'admin' ? '#F59E0B' : '#6366F1',
                                minWidth: '80px',
                                height: '26px',
                                flexShrink: 0,
                                textTransform: 'capitalize'
                            }}>
                                {u.role === 'admin' ? <Shield size={12} /> : <User size={12} />}
                                {u.role}
                            </span>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default UserManagement;