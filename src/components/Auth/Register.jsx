import React, { useState } from 'react';
import { useNavigate, Link, Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const Register = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
        phone: ''
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);
    const { register, currentUser, userData, loading: authLoading } = useAuth();
    const navigate = useNavigate();

    // ✅ Agar auth check ho raha hai, to loading dikhao
    if (authLoading) {
        return (
            <div style={{
                minHeight: '100vh',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: '#f5f7fb',
            }}>
                <p>Loading...</p>
            </div>
        );
    }

    // ✅ Agar already logged in hai, to redirect karo
    if (currentUser) {
        // Admin hai → Admin Dashboard
        if (userData?.role === 'admin') {
            return <Navigate to="/admin" replace />;
        }
        // Customer hai → Home
        return <Navigate to="/" replace />;
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess(false);

        if (formData.password !== formData.confirmPassword) {
            setError('Passwords do not match');
            return;
        }
        if (formData.password.length < 6) {
            setError('Password must be at least 6 characters');
            return;
        }

        setLoading(true);
        const result = await register(
            formData.name,
            formData.email,
            formData.password,
            formData.phone
        );

        if (result.success) {
            setSuccess(true);
            setFormData({
                name: '',
                email: '',
                password: '',
                confirmPassword: '',
                phone: ''
            });
            setTimeout(() => {
                navigate('/login');
            }, 2000);
        } else {
            setError(result.error);
        }
        setLoading(false);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    return (
        <div style={{
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: '#f5f7fb',
            padding: '20px'
        }}>
            <div style={{
                backgroundColor: 'white',
                padding: '40px',
                borderRadius: '16px',
                boxShadow: '0 8px 32px rgba(0,0,0,0.08)',
                width: '100%',
                maxWidth: '400px'
            }}>
                <h2 style={{ fontSize: '28px', fontWeight: 'bold', marginBottom: '8px', color: '#1a1a2e' }}>
                    Create Account 🎉
                </h2>
                <p style={{ color: '#666', marginBottom: '24px' }}>Join us and start shopping!</p>

                {success && (
                    <div style={{
                        backgroundColor: '#d1fae5',
                        color: '#065f46',
                        padding: '12px',
                        borderRadius: '8px',
                        marginBottom: '16px',
                        fontSize: '14px',
                        textAlign: 'center'
                    }}>
                        ✅ Account created successfully! Redirecting to login...
                    </div>
                )}

                {error && (
                    <div style={{
                        backgroundColor: '#fee2e2',
                        color: '#dc2626',
                        padding: '12px',
                        borderRadius: '8px',
                        marginBottom: '16px',
                        fontSize: '14px'
                    }}>
                        ❌ {error}
                    </div>
                )}

                <form onSubmit={handleSubmit}>
                    <div style={{ marginBottom: '14px' }}>
                        <label style={{ display: 'block', fontWeight: '500', marginBottom: '6px', color: '#333' }}>
                            Full Name
                        </label>
                        <input
                            type="text"
                            name="name"
                            placeholder="John Doe"
                            value={formData.name}
                            onChange={handleChange}
                            required
                            style={{
                                width: '100%',
                                padding: '12px 16px',
                                border: '1px solid #ddd',
                                borderRadius: '8px',
                                fontSize: '14px',
                                outline: 'none',
                                transition: 'border-color 0.3s'
                            }}
                            onFocus={(e) => e.currentTarget.style.borderColor = '#6c63ff'}
                            onBlur={(e) => e.currentTarget.style.borderColor = '#ddd'}
                        />
                    </div>

                    <div style={{ marginBottom: '14px' }}>
                        <label style={{ display: 'block', fontWeight: '500', marginBottom: '6px', color: '#333' }}>
                            Email Address
                        </label>
                        <input
                            type="email"
                            name="email"
                            placeholder="john@example.com"
                            value={formData.email}
                            onChange={handleChange}
                            required
                            style={{
                                width: '100%',
                                padding: '12px 16px',
                                border: '1px solid #ddd',
                                borderRadius: '8px',
                                fontSize: '14px',
                                outline: 'none',
                                transition: 'border-color 0.3s'
                            }}
                            onFocus={(e) => e.currentTarget.style.borderColor = '#6c63ff'}
                            onBlur={(e) => e.currentTarget.style.borderColor = '#ddd'}
                        />
                    </div>

                    <div style={{ marginBottom: '14px' }}>
                        <label style={{ display: 'block', fontWeight: '500', marginBottom: '6px', color: '#333' }}>
                            Phone (Optional)
                        </label>
                        <input
                            type="tel"
                            name="phone"
                            placeholder="555-123-4567"
                            value={formData.phone}
                            onChange={handleChange}
                            style={{
                                width: '100%',
                                padding: '12px 16px',
                                border: '1px solid #ddd',
                                borderRadius: '8px',
                                fontSize: '14px',
                                outline: 'none',
                                transition: 'border-color 0.3s'
                            }}
                            onFocus={(e) => e.currentTarget.style.borderColor = '#6c63ff'}
                            onBlur={(e) => e.currentTarget.style.borderColor = '#ddd'}
                        />
                    </div>

                    <div style={{ marginBottom: '14px' }}>
                        <label style={{ display: 'block', fontWeight: '500', marginBottom: '6px', color: '#333' }}>
                            Password (min 6 characters)
                        </label>
                        <input
                            type="password"
                            name="password"
                            placeholder="Create password"
                            value={formData.password}
                            onChange={handleChange}
                            required
                            style={{
                                width: '100%',
                                padding: '12px 16px',
                                border: '1px solid #ddd',
                                borderRadius: '8px',
                                fontSize: '14px',
                                outline: 'none',
                                transition: 'border-color 0.3s'
                            }}
                            onFocus={(e) => e.currentTarget.style.borderColor = '#6c63ff'}
                            onBlur={(e) => e.currentTarget.style.borderColor = '#ddd'}
                        />
                    </div>

                    <div style={{ marginBottom: '24px' }}>
                        <label style={{ display: 'block', fontWeight: '500', marginBottom: '6px', color: '#333' }}>
                            Confirm Password
                        </label>
                        <input
                            type="password"
                            name="confirmPassword"
                            placeholder="Confirm password"
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            required
                            style={{
                                width: '100%',
                                padding: '12px 16px',
                                border: '1px solid #ddd',
                                borderRadius: '8px',
                                fontSize: '14px',
                                outline: 'none',
                                transition: 'border-color 0.3s'
                            }}
                            onFocus={(e) => e.currentTarget.style.borderColor = '#6c63ff'}
                            onBlur={(e) => e.currentTarget.style.borderColor = '#ddd'}
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading || success}
                        style={{
                            width: '100%',
                            padding: '14px',
                            backgroundColor: loading || success ? '#9ca3af' : '#6c63ff',
                            color: 'white',
                            border: 'none',
                            borderRadius: '8px',
                            fontSize: '16px',
                            fontWeight: '600',
                            cursor: loading || success ? 'not-allowed' : 'pointer',
                            transition: 'background-color 0.3s'
                        }}
                    >
                        {loading ? 'Creating account...' : success ? '✅ Account Created!' : 'Create Account →'}
                    </button>
                </form>

                <p style={{ textAlign: 'center', marginTop: '20px', color: '#666' }}>
                    Already have an account?{' '}
                    <Link to="/login" style={{ color: '#6c63ff', textDecoration: 'none', fontWeight: '500' }}>
                        Login
                    </Link>
                </p>
            </div>
        </div>
    );
};

export default Register;