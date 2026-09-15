import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const API_URL = 'https://shoppluxe-production.up.railway.app';
const Orders = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const { user } = useAuth();

    useEffect(() => {
        fetchOrders();
    }, []);

    const fetchOrders = async () => {
        try {
            setLoading(true);
            const token = localStorage.getItem('token');
            const userId = user?.id || user?._id;

            if (!userId) {
                setLoading(false);
                return;
            }

            const res = await fetch(`${API_URL}/api/orders/user/${userId}`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const data = await res.json();

            if (data.success) {
                setOrders(data.orders || []);
            }
        } catch (err) {
            console.error('Error loading orders:', err);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div style={{ textAlign: 'center', padding: '50px' }}>
                <h2>🔄 Loading orders...</h2>
            </div>
        );
    }

    if (orders.length === 0) {
        return (
            <div style={{
                minHeight: '70vh',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '40px'
            }}>
                <h2 style={{ fontSize: '28px', color: '#666', marginBottom: '8px' }}>📭 No Orders Yet</h2>
                <p style={{ color: '#999', marginBottom: '20px' }}>You haven't placed any orders.</p>
                <Link to="/">
                    <button style={{
                        backgroundColor: '#6c63ff',
                        color: 'white',
                        border: 'none',
                        padding: '12px 32px',
                        borderRadius: '25px',
                        fontSize: '16px',
                        fontWeight: '600',
                        cursor: 'pointer'
                    }}>
                        Start Shopping →
                    </button>
                </Link>
            </div>
        );
    }

    return (
        <div style={{ maxWidth: '900px', margin: '0 auto', padding: '24px', minHeight: '70vh' }}>
            <h2 style={{ fontSize: '28px', fontWeight: 'bold', marginBottom: '24px', color: '#1a1a2e' }}>
                📋 My Orders ({orders.length})
            </h2>

            {orders.map((order, index) => (
                <div key={order._id || index} style={{
                    backgroundColor: 'white',
                    borderRadius: '12px',
                    padding: '20px',
                    marginBottom: '16px',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.06)'
                }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap' }}>
                        <div>
                            <p style={{ color: '#888', fontSize: '12px', marginBottom: '2px' }}>ORDER #</p>
                            <h4 style={{ fontSize: '16px', fontWeight: 'bold', color: '#1a1a2e' }}>
                                {order.orderNumber || order._id}
                            </h4>
                        </div>
                        <div style={{ textAlign: 'right' }}>
                            <p style={{ color: '#888', fontSize: '12px', marginBottom: '2px' }}>DATE</p>
                            <p style={{ fontSize: '14px', color: '#333' }}>
                                {new Date(order.createdAt).toLocaleDateString()}
                            </p>
                        </div>
                    </div>

                    <div style={{ borderTop: '1px solid #eee', margin: '12px 0', paddingTop: '12px' }}>
                        {order.items?.map((item, idx) => (
                            <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', padding: '4px 0', fontSize: '14px' }}>
                                <span>{item.name} × {item.quantity}</span>
                                <span>${(item.price * item.quantity).toFixed(2)}</span>
                            </div>
                        ))}
                    </div>

                    <div style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        paddingTop: '12px',
                        borderTop: '1px solid #eee',
                        alignItems: 'center'
                    }}>
                        <div>
                            <p style={{ fontSize: '12px', color: '#888' }}>
                                Payment: {order.paymentMethod === 'cod' ? 'Cash on Delivery' : 'Credit Card'}
                            </p>
                            <p style={{ fontSize: '12px', color: '#888' }}>
                                Status: <span style={{ fontWeight: '600', color: '#6c63ff' }}>
                                    {order.orderStatus}
                                </span>
                            </p>
                        </div>
                        <div style={{ textAlign: 'right' }}>
                            <p style={{ fontSize: '12px', color: '#888' }}>TOTAL</p>
                            <span style={{ fontSize: '20px', fontWeight: 'bold', color: '#6c63ff' }}>
                                ${order.total.toFixed(2)}
                            </span>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default Orders;