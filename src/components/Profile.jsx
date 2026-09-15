import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { UserService } from '../services/api';
import {
    User as UserIcon,
    Mail,
    Phone,
    Edit3,
    Lock,
    Package,
    Heart,
    MapPin,
    LogOut,
    Save,
    X,
} from 'lucide-react';
import toast from 'react-hot-toast';

const API_URL = import.meta.env.VITE_API_URL;

const Profile = () => {
    const { logout, user } = useAuth();
    const { getItemCount } = useCart();
    const { getWishlistCount } = useWishlist();
    const navigate = useNavigate();

    const [loading, setLoading] = useState(true);
    const [profile, setProfile] = useState(null);
    const [orders, setOrders] = useState([]);

    const [isEditing, setIsEditing] = useState(false);
    const [isChangingPassword, setIsChangingPassword] = useState(false);
    const [saving, setSaving] = useState(false);

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: ''
    });

    const [passwordData, setPasswordData] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    });

    useEffect(() => {
        loadProfile();
        loadOrders();
    }, []);

    const loadProfile = async () => {
        setLoading(true);
        try {
            const result = await UserService.getProfile();
            if (result.success) {
                setProfile(result.user);
                setFormData({
                    name: result.user.name || '',
                    email: result.user.email || '',
                    phone: result.user.phone || ''
                });
            } else {
                toast.error(result.error);
            }
        } catch (error) {
            toast.error('Failed to load profile');
        }
        setLoading(false);
    };

    // ✅ Orders MongoDB se fetch karein
    const loadOrders = async () => {
        try {
            const token = localStorage.getItem('token');
            const savedUser = localStorage.getItem('user');
            const userData = savedUser ? JSON.parse(savedUser) : null;
            const userId = userData?.id || userData?._id || user?.id || user?._id;

            if (!userId) {
                setOrders([]);
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
            setOrders([]);
        }
    };

    const handleProfileChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handlePasswordChange = (e) => {
        const { name, value } = e.target;
        setPasswordData(prev => ({ ...prev, [name]: value }));
    };

    const handleSaveProfile = async (e) => {
        e.preventDefault();
        setSaving(true);

        const result = await UserService.updateProfile(formData);

        if (result.success) {
            toast.success('Profile updated successfully!');
            setProfile(result.user);
            setIsEditing(false);
        } else {
            toast.error(result.error);
        }

        setSaving(false);
    };

    const handleSavePassword = async (e) => {
        e.preventDefault();

        if (passwordData.newPassword !== passwordData.confirmPassword) {
            toast.error('Passwords do not match');
            return;
        }

        if (passwordData.newPassword.length < 6) {
            toast.error('Password must be at least 6 characters');
            return;
        }

        setSaving(true);

        const result = await UserService.changePassword(
            passwordData.currentPassword,
            passwordData.newPassword
        );

        if (result.success) {
            toast.success('Password changed successfully!');
            setIsChangingPassword(false);
            setPasswordData({
                currentPassword: '',
                newPassword: '',
                confirmPassword: ''
            });
        } else {
            toast.error(result.error);
        }

        setSaving(false);
    };

    const handleLogout = () => {
        if (window.confirm('Are you sure you want to logout?')) {
            logout();
            navigate('/');
        }
    };

    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    // Loading state
    if (loading) {
        return (
            <div style={{ maxWidth: '900px', margin: '0 auto', padding: '40px 24px' }}>
                <div style={{
                    backgroundColor: 'white',
                    borderRadius: '16px',
                    padding: '40px',
                    boxShadow: '0 4px 15px rgba(47, 65, 86, 0.06)',
                }}>
                    <div style={{
                        height: '80px',
                        backgroundColor: '#C8D9E6',
                        borderRadius: '50%',
                        width: '80px',
                        marginBottom: '20px',
                    }} />
                    <div style={{
                        height: '30px',
                        backgroundColor: '#C8D9E6',
                        borderRadius: '8px',
                        width: '50%',
                        marginBottom: '12px',
                    }} />
                    <div style={{
                        height: '20px',
                        backgroundColor: '#C8D9E6',
                        borderRadius: '8px',
                        width: '30%',
                    }} />
                </div>
            </div>
        );
    }

    return (
        <div style={{ maxWidth: '900px', margin: '0 auto', padding: '24px', minHeight: '70vh' }}>

            {/* PAGE HEADER */}
            <h1 style={{
                fontSize: '32px',
                fontWeight: '800',
                color: '#2F4156',
                marginBottom: '24px',
            }}>
                👤 My Account
            </h1>

            {/* PROFILE CARD */}
            <div style={{
                backgroundColor: 'white',
                borderRadius: '16px',
                padding: '32px',
                boxShadow: '0 4px 15px rgba(47, 65, 86, 0.06)',
                marginBottom: '24px',
            }}>

                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '20px',
                    flexWrap: 'wrap',
                    marginBottom: '24px',
                    paddingBottom: '24px',
                    borderBottom: '1px solid #E5E7EB',
                }}>
                    {/* Avatar */}
                    <div style={{
                        width: '80px',
                        height: '80px',
                        borderRadius: '50%',
                        background: '#567C8D',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'white',
                        fontSize: '32px',
                        fontWeight: '800',
                        flexShrink: 0,
                    }}>
                        {profile?.name?.charAt(0).toUpperCase() || 'U'}
                    </div>

                    {/* Info */}
                    <div style={{ flex: 1, minWidth: '200px' }}>
                        <h2 style={{
                            fontSize: '24px',
                            fontWeight: '700',
                            color: '#2F4156',
                            marginBottom: '4px',
                        }}>
                            {profile?.name}
                        </h2>
                        <p style={{
                            fontSize: '14px',
                            color: '#567C8D',
                            marginBottom: '4px',
                        }}>
                            {profile?.email}
                        </p>
                        {profile?.phone && (
                            <p style={{
                                fontSize: '14px',
                                color: '#8A9BAB',
                                marginBottom: '4px',
                            }}>
                                📱 {profile.phone}
                            </p>
                        )}
                        <p style={{
                            fontSize: '12px',
                            color: '#8A9BAB',
                        }}>
                            Member since: {formatDate(profile?.createdAt)}
                        </p>
                    </div>

                    {/* Action Buttons */}
                    <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                        <button
                            onClick={() => {
                                setIsEditing(!isEditing);
                                setIsChangingPassword(false);
                            }}
                            style={{
                                padding: '10px 20px',
                                backgroundColor: isEditing ? '#C8D9E6' : '#567C8D',
                                color: isEditing ? '#2F4156' : 'white',
                                border: 'none',
                                borderRadius: '50px',
                                fontSize: '14px',
                                fontWeight: '600',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '6px',
                            }}
                        >
                            {isEditing ? <X size={16} /> : <Edit3 size={16} />}
                            {isEditing ? 'Cancel' : 'Edit Profile'}
                        </button>

                        <button
                            onClick={() => {
                                setIsChangingPassword(!isChangingPassword);
                                setIsEditing(false);
                            }}
                            style={{
                                padding: '10px 20px',
                                backgroundColor: isChangingPassword ? '#C8D9E6' : '#2F4156',
                                color: isChangingPassword ? '#2F4156' : 'white',
                                border: 'none',
                                borderRadius: '50px',
                                fontSize: '14px',
                                fontWeight: '600',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '6px',
                            }}
                        >
                            {isChangingPassword ? <X size={16} /> : <Lock size={16} />}
                            {isChangingPassword ? 'Cancel' : 'Change Password'}
                        </button>
                    </div>
                </div>

                {/* EDIT PROFILE FORM */}
                {isEditing && (
                    <form onSubmit={handleSaveProfile} style={{ marginBottom: '24px' }}>
                        <h3 style={{
                            fontSize: '18px',
                            fontWeight: '700',
                            color: '#2F4156',
                            marginBottom: '16px',
                        }}>
                            ✏️ Edit Profile
                        </h3>

                        <div style={{ marginBottom: '16px' }}>
                            <label style={{
                                display: 'block',
                                fontSize: '14px',
                                fontWeight: '600',
                                color: '#2F4156',
                                marginBottom: '6px',
                            }}>Full Name</label>
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleProfileChange}
                                required
                                style={{
                                    width: '100%',
                                    padding: '12px 16px',
                                    border: '1px solid #E5E7EB',
                                    borderRadius: '8px',
                                    fontSize: '14px',
                                    outline: 'none',
                                    backgroundColor: '#F5EFEB',
                                }}
                            />
                        </div>

                        <div style={{ marginBottom: '16px' }}>
                            <label style={{
                                display: 'block',
                                fontSize: '14px',
                                fontWeight: '600',
                                color: '#2F4156',
                                marginBottom: '6px',
                            }}>Email</label>
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleProfileChange}
                                required
                                style={{
                                    width: '100%',
                                    padding: '12px 16px',
                                    border: '1px solid #E5E7EB',
                                    borderRadius: '8px',
                                    fontSize: '14px',
                                    outline: 'none',
                                    backgroundColor: '#F5EFEB',
                                }}
                            />
                        </div>

                        <div style={{ marginBottom: '20px' }}>
                            <label style={{
                                display: 'block',
                                fontSize: '14px',
                                fontWeight: '600',
                                color: '#2F4156',
                                marginBottom: '6px',
                            }}>Phone</label>
                            <input
                                type="tel"
                                name="phone"
                                value={formData.phone}
                                onChange={handleProfileChange}
                                placeholder="Optional"
                                style={{
                                    width: '100%',
                                    padding: '12px 16px',
                                    border: '1px solid #E5E7EB',
                                    borderRadius: '8px',
                                    fontSize: '14px',
                                    outline: 'none',
                                    backgroundColor: '#F5EFEB',
                                }}
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={saving}
                            style={{
                                padding: '12px 28px',
                                backgroundColor: saving ? '#E5E7EB' : '#567C8D',
                                color: 'white',
                                border: 'none',
                                borderRadius: '50px',
                                fontSize: '14px',
                                fontWeight: '700',
                                cursor: saving ? 'not-allowed' : 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '8px',
                            }}
                        >
                            <Save size={18} />
                            {saving ? 'Saving...' : 'Save Changes'}
                        </button>
                    </form>
                )}

                {/* CHANGE PASSWORD FORM */}
                {isChangingPassword && (
                    <form onSubmit={handleSavePassword} style={{ marginBottom: '24px' }}>
                        <h3 style={{
                            fontSize: '18px',
                            fontWeight: '700',
                            color: '#2F4156',
                            marginBottom: '16px',
                        }}>
                            🔒 Change Password
                        </h3>

                        <div style={{ marginBottom: '16px' }}>
                            <label style={{
                                display: 'block',
                                fontSize: '14px',
                                fontWeight: '600',
                                color: '#2F4156',
                                marginBottom: '6px',
                            }}>Current Password</label>
                            <input
                                type="password"
                                name="currentPassword"
                                value={passwordData.currentPassword}
                                onChange={handlePasswordChange}
                                required
                                style={{
                                    width: '100%',
                                    padding: '12px 16px',
                                    border: '1px solid #E5E7EB',
                                    borderRadius: '8px',
                                    fontSize: '14px',
                                    outline: 'none',
                                    backgroundColor: '#F5EFEB',
                                }}
                            />
                        </div>

                        <div style={{ marginBottom: '16px' }}>
                            <label style={{
                                display: 'block',
                                fontSize: '14px',
                                fontWeight: '600',
                                color: '#2F4156',
                                marginBottom: '6px',
                            }}>New Password</label>
                            <input
                                type="password"
                                name="newPassword"
                                value={passwordData.newPassword}
                                onChange={handlePasswordChange}
                                required
                                minLength={6}
                                style={{
                                    width: '100%',
                                    padding: '12px 16px',
                                    border: '1px solid #E5E7EB',
                                    borderRadius: '8px',
                                    fontSize: '14px',
                                    outline: 'none',
                                    backgroundColor: '#F5EFEB',
                                }}
                            />
                        </div>

                        <div style={{ marginBottom: '20px' }}>
                            <label style={{
                                display: 'block',
                                fontSize: '14px',
                                fontWeight: '600',
                                color: '#2F4156',
                                marginBottom: '6px',
                            }}>Confirm New Password</label>
                            <input
                                type="password"
                                name="confirmPassword"
                                value={passwordData.confirmPassword}
                                onChange={handlePasswordChange}
                                required
                                style={{
                                    width: '100%',
                                    padding: '12px 16px',
                                    border: '1px solid #E5E7EB',
                                    borderRadius: '8px',
                                    fontSize: '14px',
                                    outline: 'none',
                                    backgroundColor: '#F5EFEB',
                                }}
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={saving}
                            style={{
                                padding: '12px 28px',
                                backgroundColor: saving ? '#E5E7EB' : '#2F4156',
                                color: 'white',
                                border: 'none',
                                borderRadius: '50px',
                                fontSize: '14px',
                                fontWeight: '700',
                                cursor: saving ? 'not-allowed' : 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '8px',
                            }}
                        >
                            <Lock size={18} />
                            {saving ? 'Changing...' : 'Change Password'}
                        </button>
                    </form>
                )}

                {/* PROFILE INFO */}
                {!isEditing && !isChangingPassword && (
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                        gap: '16px',
                    }}>
                        <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '12px',
                            padding: '12px 16px',
                            backgroundColor: '#F5EFEB',
                            borderRadius: '8px',
                        }}>
                            <UserIcon size={20} color="#567C8D" />
                            <div>
                                <div style={{ fontSize: '12px', color: '#8A9BAB' }}>Name</div>
                                <div style={{ fontSize: '14px', fontWeight: '600', color: '#2F4156' }}>
                                    {profile?.name}
                                </div>
                            </div>
                        </div>

                        <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '12px',
                            padding: '12px 16px',
                            backgroundColor: '#F5EFEB',
                            borderRadius: '8px',
                        }}>
                            <Mail size={20} color="#567C8D" />
                            <div>
                                <div style={{ fontSize: '12px', color: '#8A9BAB' }}>Email</div>
                                <div style={{ fontSize: '14px', fontWeight: '600', color: '#2F4156' }}>
                                    {profile?.email}
                                </div>
                            </div>
                        </div>

                        <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '12px',
                            padding: '12px 16px',
                            backgroundColor: '#F5EFEB',
                            borderRadius: '8px',
                        }}>
                            <Phone size={20} color="#567C8D" />
                            <div>
                                <div style={{ fontSize: '12px', color: '#8A9BAB' }}>Phone</div>
                                <div style={{ fontSize: '14px', fontWeight: '600', color: '#2F4156' }}>
                                    {profile?.phone || 'Not set'}
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* QUICK STATS */}
            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
                gap: '16px',
                marginBottom: '24px',
            }}>
                <div style={{
                    backgroundColor: 'white',
                    padding: '20px',
                    borderRadius: '16px',
                    boxShadow: '0 4px 15px rgba(47, 65, 86, 0.06)',
                    textAlign: 'center',
                }}>
                    <Package size={28} color="#567C8D" style={{ marginBottom: '8px' }} />
                    <div style={{ fontSize: '24px', fontWeight: '800', color: '#2F4156' }}>
                        {orders.length}
                    </div>
                    <div style={{ fontSize: '12px', color: '#8A9BAB' }}>Orders</div>
                </div>

                <div style={{
                    backgroundColor: 'white',
                    padding: '20px',
                    borderRadius: '16px',
                    boxShadow: '0 4px 15px rgba(47, 65, 86, 0.06)',
                    textAlign: 'center',
                }}>
                    <Heart size={28} color="#567C8D" style={{ marginBottom: '8px' }} />
                    <div style={{ fontSize: '24px', fontWeight: '800', color: '#2F4156' }}>
                        {getWishlistCount()}
                    </div>
                    <div style={{ fontSize: '12px', color: '#8A9BAB' }}>Wishlist</div>
                </div>

                <div style={{
                    backgroundColor: 'white',
                    padding: '20px',
                    borderRadius: '16px',
                    boxShadow: '0 4px 15px rgba(47, 65, 86, 0.06)',
                    textAlign: 'center',
                }}>
                    <Package size={28} color="#567C8D" style={{ marginBottom: '8px' }} />
                    <div style={{ fontSize: '24px', fontWeight: '800', color: '#2F4156' }}>
                        {getItemCount()}
                    </div>
                    <div style={{ fontSize: '12px', color: '#8A9BAB' }}>Cart Items</div>
                </div>
            </div>

            {/* QUICK ACTIONS */}
            <div style={{
                backgroundColor: 'white',
                borderRadius: '16px',
                padding: '24px',
                boxShadow: '0 4px 15px rgba(47, 65, 86, 0.06)',
            }}>
                <h3 style={{
                    fontSize: '18px',
                    fontWeight: '700',
                    color: '#2F4156',
                    marginBottom: '16px',
                }}>
                    ⚡ Quick Actions
                </h3>

                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
                    gap: '12px',
                }}>
                    <Link to="/orders" style={{ textDecoration: 'none' }}>
                        <div style={{
                            padding: '16px',
                            backgroundColor: '#F5EFEB',
                            borderRadius: '8px',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '12px',
                            cursor: 'pointer',
                        }}>
                            <Package size={20} color="#567C8D" />
                            <span style={{ fontSize: '14px', fontWeight: '600', color: '#2F4156' }}>
                                My Orders
                            </span>
                        </div>
                    </Link>

                    <Link to="/wishlist" style={{ textDecoration: 'none' }}>
                        <div style={{
                            padding: '16px',
                            backgroundColor: '#F5EFEB',
                            borderRadius: '8px',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '12px',
                            cursor: 'pointer',
                        }}>
                            <Heart size={20} color="#567C8D" />
                            <span style={{ fontSize: '14px', fontWeight: '600', color: '#2F4156' }}>
                                Wishlist
                            </span>
                        </div>
                    </Link>

                    <Link to="/cart" style={{ textDecoration: 'none' }}>
                        <div style={{
                            padding: '16px',
                            backgroundColor: '#F5EFEB',
                            borderRadius: '8px',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '12px',
                            cursor: 'pointer',
                        }}>
                            <Package size={20} color="#567C8D" />
                            <span style={{ fontSize: '14px', fontWeight: '600', color: '#2F4156' }}>
                                My Cart
                            </span>
                        </div>
                    </Link>

                    <Link to="/profile/addresses" style={{ textDecoration: 'none' }}>
                        <div style={{
                            padding: '16px',
                            backgroundColor: '#F5EFEB',
                            borderRadius: '8px',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '12px',
                            cursor: 'pointer',
                        }}>
                            <MapPin size={20} color="#567C8D" />
                            <span style={{ fontSize: '14px', fontWeight: '600', color: '#2F4156' }}>
                                My Addresses
                            </span>
                        </div>
                    </Link>

                    <div
                        onClick={handleLogout}
                        style={{
                            padding: '16px',
                            backgroundColor: '#FFEBEE',
                            borderRadius: '8px',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '12px',
                            cursor: 'pointer',
                        }}
                    >
                        <LogOut size={20} color="#DC2626" />
                        <span style={{ fontSize: '14px', fontWeight: '600', color: '#DC2626' }}>
                            Logout
                        </span>
                    </div>
                </div>
            </div>

        </div>
    );
};

export default Profile;