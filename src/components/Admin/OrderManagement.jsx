import React, { useState, useEffect } from 'react';
import { Search, Eye } from 'lucide-react';

const OrderManagement = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [error, setError] = useState('');

    useEffect(() => {
        fetchOrders();
    }, []);

    const fetchOrders = async () => {
        try {
            setLoading(true);
            setError('');

            const token = localStorage.getItem('token');

            const response = await fetch('import.meta.env.VITE_API_URL/api/orders/admin/all', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            const data = await response.json();

            if (data.success) {
                setOrders(data.orders || []);
            } else {
                setError(data.error || 'Failed to load orders');
            }
        } catch (err) {
            setError('Server se connect nahi ho pa raha');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const filtered = orders.filter(o =>
        o.orderNumber?.toLowerCase().includes(search.toLowerCase())
    );

    const getStatusColor = (status) => {
        const colors = {
            pending: '#F59E0B',
            confirmed: '#6366F1',
            processing: '#8B5CF6',
            shipped: '#3B82F6',
            delivered: '#10B981',
            cancelled: '#EF4444',
        };
        return colors[status] || '#8A9BAB';
    };

    return (
        <div>
            <div style={{ marginBottom: '24px' }}>
                <h1 style={{ fontSize: '24px', fontWeight: 800, color: '#2F4156', margin: 0 }}>
                    Orders Management
                </h1>
                <p style={{ color: '#567C8D', marginTop: '4px', fontSize: '14px' }}>
                    Total: {orders.length} orders
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
                    placeholder="Search orders..."
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
                <p style={{ textAlign: 'center', color: '#8A9BAB', padding: '40px' }}>Loading orders...</p>
            ) : filtered.length === 0 ? (
                <div style={{
                    background: 'white', borderRadius: '16px', padding: '60px',
                    textAlign: 'center', color: '#8A9BAB'
                }}>
                    <p style={{ fontSize: '16px', fontWeight: 600 }}>🛒 Koi order nahi mila</p>
                    <p style={{ fontSize: '13px' }}>Total orders: {orders.length}</p>
                </div>
            ) : (
                <div style={{ background: 'white', borderRadius: '16px', overflow: 'hidden', boxShadow: '0 2px 12px rgba(47, 65, 86, 0.05)' }}>
                    {filtered.map((o, i) => (
                        <div key={o._id || i} style={{
                            display: 'flex', alignItems: 'center', gap: '16px',
                            padding: '16px 20px',
                            borderBottom: i < filtered.length - 1 ? '1px solid #F0EDE7' : 'none'
                        }}>
                            <div style={{ flex: 1 }}>
                                <p style={{ fontWeight: 600, color: '#2F4156', margin: 0 }}>
                                    #{o.orderNumber || o._id?.slice(-8)}
                                </p>
                                <p style={{ fontSize: '13px', color: '#8A9BAB', margin: 0 }}>
                                    {o.userId?.name || o.shippingAddress?.fullName || 'Customer'} • ${o.total}
                                </p>
                            </div>
                            <span style={{
                                padding: '4px 12px', borderRadius: '50px',
                                fontSize: '12px', fontWeight: 600,
                                background: `${getStatusColor(o.orderStatus)}20`,
                                color: getStatusColor(o.orderStatus)
                            }}>
                                {o.orderStatus}
                            </span>
                            <button style={{ background: 'transparent', border: 'none', cursor: 'pointer', padding: '8px' }}>
                                <Eye size={18} color="#6366F1" />
                            </button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default OrderManagement;