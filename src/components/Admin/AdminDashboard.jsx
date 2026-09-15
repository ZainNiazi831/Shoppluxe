import React, { useState, useEffect } from 'react';
import {
    LayoutDashboard, Package, FolderTree,
    Boxes, ShoppingCart, Users, Star
} from 'lucide-react';
import './AdminNav.css';

// ===== Aapki saari admin files =====
import ProductManagement from './ProductManagement';
import CategoryManagement from './CategoryManagement';
import InventoryManagement from './InventoryManagement';
import OrderManagement from './OrderManagement';
import UserManagement from './UserManagement';
import ReviewManagement from './ReviewManagement';

const API_URL = 'import.meta.env.VITE_API_URL';

const AdminDashboard = () => {
    const [activeTab, setActiveTab] = useState('dashboard');

    const adminTabs = [
        { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard size={18} /> },
        { id: 'products', label: 'Products', icon: <Package size={18} /> },
        { id: 'categories', label: 'Categories', icon: <FolderTree size={18} /> },
        { id: 'inventory', label: 'Inventory', icon: <Boxes size={18} /> },
        { id: 'orders', label: 'Orders', icon: <ShoppingCart size={18} /> },
        { id: 'users', label: 'Users', icon: <Users size={18} /> },
        { id: 'reviews', label: 'Reviews', icon: <Star size={18} /> },
    ];

    const renderContent = () => {
        switch (activeTab) {
            case 'dashboard': return <DashboardHome />;
            case 'products': return <ProductManagement />;
            case 'categories': return <CategoryManagement />;
            case 'inventory': return <InventoryManagement />;
            case 'orders': return <OrderManagement />;
            case 'users': return <UserManagement />;
            case 'reviews': return <ReviewManagement />;
            default: return <DashboardHome />;
        }
    };

    return (
        <div style={{ backgroundColor: '#F8F7F4', minHeight: '100vh' }}>
            <div className="admin-nav-wrapper">
                <nav className="admin-nav">
                    {adminTabs.map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`admin-nav-item ${activeTab === tab.id ? 'active' : ''}`}
                        >
                            {tab.icon}
                            <span>{tab.label}</span>
                        </button>
                    ))}
                </nav>
            </div>

            <div style={{ padding: '24px', maxWidth: '1200px', margin: '0 auto' }}>
                {renderContent()}
            </div>
        </div>
    );
};

// ============ DASHBOARD HOME (MongoDB se live data) ============
const DashboardHome = () => {
    const [stats, setStats] = useState({
        products: 0,
        orders: 0,
        users: 0,
        revenue: 0
    });
    const [recentOrders, setRecentOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchStats();
        fetchRecentOrders();
    }, []);

    const fetchStats = async () => {
        try {
            const token = localStorage.getItem('token');

            // Products count
            const prodRes = await fetch(`${API_URL}/api/products`);
            const prodData = await prodRes.json();
            const productsCount = prodData.products?.length || 0;

            // Orders count
            const ordRes = await fetch(`${API_URL}/api/orders/admin/all`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const ordData = await ordRes.json();
            const ordersList = ordData.orders || [];
            const ordersCount = ordersList.length;
            const revenue = ordersList.reduce((sum, o) => sum + (o.total || 0), 0);

            // Users count
            const userRes = await fetch(`${API_URL}/api/users/admin/users`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const userData = await userRes.json();
            const usersCount = userData.users?.length || 0;

            setStats({
                products: productsCount,
                orders: ordersCount,
                users: usersCount,
                revenue: revenue
            });

            setRecentOrders(ordersList.slice(0, 5));
        } catch (err) {
            console.error('Error fetching stats:', err);
        } finally {
            setLoading(false);
        }
    };

    const fetchRecentOrders = async () => {
        // Already fetched in fetchStats
    };

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
        <>
            <div style={{ marginBottom: '24px' }}>
                <h1 style={{ fontSize: '28px', fontWeight: 800, color: '#2F4156', margin: 0 }}>
                    Admin Dashboard
                </h1>
                <p style={{ color: '#567C8D', marginTop: '4px' }}>
                    Welcome back! Here's what's happening with your store.
                </p>
            </div>

            {/* ===== STATS CARDS ===== */}
            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
                gap: '16px', marginBottom: '32px'
            }}>
                {[
                    { label: 'Total Products', value: loading ? '...' : stats.products, color: '#6366F1' },
                    { label: 'Total Orders', value: loading ? '...' : stats.orders, color: '#10B981' },
                    { label: 'Total Users', value: loading ? '...' : stats.users, color: '#F59E0B' },
                    { label: 'Total Revenue', value: loading ? '...' : `$${stats.revenue.toFixed(2)}`, color: '#EF4444' },
                ].map((stat, i) => (
                    <div key={i} style={{
                        background: 'white', borderRadius: '16px', padding: '20px',
                        boxShadow: '0 2px 12px rgba(47, 65, 86, 0.05)',
                        borderLeft: `4px solid ${stat.color}`
                    }}>
                        <p style={{ fontSize: '13px', color: '#8A9BAB', margin: 0, fontWeight: 600 }}>
                            {stat.label}
                        </p>
                        <p style={{ fontSize: '28px', fontWeight: 800, color: '#2F4156', margin: '8px 0 0 0' }}>
                            {stat.value}
                        </p>
                    </div>
                ))}
            </div>

            {/* ===== RECENT ORDERS ===== */}
            <div style={{
                background: 'white', borderRadius: '16px', padding: '24px',
                boxShadow: '0 2px 12px rgba(47, 65, 86, 0.05)'
            }}>
                <h2 style={{
                    fontSize: '18px', fontWeight: 700, color: '#2F4156',
                    marginBottom: '16px', margin: 0
                }}>
                    🕒 Recent Orders
                </h2>

                {loading ? (
                    <p style={{ color: '#8A9BAB', padding: '20px 0' }}>Loading...</p>
                ) : recentOrders.length === 0 ? (
                    <p style={{ color: '#8A9BAB', padding: '20px 0' }}>
                        Abhi tak koi order nahi aaya
                    </p>
                ) : (
                    <div style={{ marginTop: '16px' }}>
                        {recentOrders.map((o, i) => (
                            <div key={o._id || i} style={{
                                display: 'flex', justifyContent: 'space-between',
                                alignItems: 'center', padding: '12px 0',
                                borderBottom: i < recentOrders.length - 1 ? '1px solid #F0EDE7' : 'none'
                            }}>
                                <div>
                                    <p style={{ fontWeight: 600, color: '#2F4156', margin: 0, fontSize: '14px' }}>
                                        #{o.orderNumber}
                                    </p>
                                    <p style={{ fontSize: '12px', color: '#8A9BAB', margin: '2px 0 0 0' }}>
                                        {o.shippingAddress?.fullName || 'Customer'}
                                    </p>
                                </div>
                                <div style={{ textAlign: 'right' }}>
                                    <p style={{ fontWeight: 700, color: '#2F4156', margin: 0, fontSize: '14px' }}>
                                        ${o.total?.toFixed(2)}
                                    </p>
                                    <span style={{
                                        display: 'inline-block', padding: '2px 10px',
                                        borderRadius: '50px', fontSize: '11px',
                                        fontWeight: 600, marginTop: '2px',
                                        background: `${getStatusColor(o.orderStatus)}20`,
                                        color: getStatusColor(o.orderStatus)
                                    }}>
                                        {o.orderStatus}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </>
    );
};

export default AdminDashboard;