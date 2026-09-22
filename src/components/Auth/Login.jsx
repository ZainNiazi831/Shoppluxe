import React, { useState } from 'react';
import { useNavigate, Link, Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const { login, currentUser, userData, loading: authLoading } = useAuth();
    const navigate = useNavigate();

    // ✅ Agar auth check ho raha hai, to loading dikhao
    if (authLoading) {
        return (
            <div style={{
                minHeight: '100vh',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: 'var(--color-bg-primary)',
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
        setLoading(true);
        const result = await login(email, password);
        if (result.success) {
            // ✅ Login successful — role ke hisaab se redirect
            if (result.user?.role === 'admin') {
                navigate('/admin');
            } else {
                navigate('/');
            }
        } else {
            setError(result.error);
        }
        setLoading(false);
    };

    return (
        <div style={{
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: 'var(--color-bg-primary)',
            padding: '20px'
        }}>
            <div style={{
                backgroundColor: 'white',
                padding: '40px',
                borderRadius: 'var(--radius-xl)',
                boxShadow: '0 8px 32px rgba(47, 65, 86, 0.08)',
                width: '100%',
                maxWidth: '400px'
            }}>
                <h2 style={{ fontSize: '28px', fontWeight: 'bold', marginBottom: '8px', color: 'var(--color-text-primary)' }}>
                    Welcome Back! 👋
                </h2>
                <p style={{ color: 'var(--color-text-light)', marginBottom: '24px' }}>Please login to your account</p>

                {error && (
                    <div style={{
                        backgroundColor: '#fee2e2',
                        color: '#dc2626',
                        padding: '12px',
                        borderRadius: 'var(--radius-md)',
                        marginBottom: '16px',
                        fontSize: '14px'
                    }}>
                        ❌ {error}
                    </div>
                )}

                <form onSubmit={handleSubmit}>
                    <div style={{ marginBottom: '16px' }}>
                        <label style={{ display: 'block', fontWeight: '500', marginBottom: '6px', color: 'var(--color-text-primary)' }}>
                            Email Address
                        </label>
                        <input
                            type="email"
                            placeholder="john@example.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            style={{
                                width: '100%',
                                padding: '12px 16px',
                                border: '1px solid var(--color-border)',
                                borderRadius: 'var(--radius-md)',
                                fontSize: '14px',
                                outline: 'none',
                                transition: 'border-color 0.3s'
                            }}
                            onFocus={(e) => e.currentTarget.style.borderColor = 'var(--color-teal)'}
                            onBlur={(e) => e.currentTarget.style.borderColor = 'var(--color-border)'}
                        />
                    </div>

                    <div style={{ marginBottom: '12px' }}>
                        <label style={{ display: 'block', fontWeight: '500', marginBottom: '6px', color: 'var(--color-text-primary)' }}>
                            Password
                        </label>
                        <input
                            type="password"
                            placeholder="Enter password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            style={{
                                width: '100%',
                                padding: '12px 16px',
                                border: '1px solid var(--color-border)',
                                borderRadius: 'var(--radius-md)',
                                fontSize: '14px',
                                outline: 'none',
                                transition: 'border-color 0.3s'
                            }}
                            onFocus={(e) => e.currentTarget.style.borderColor = 'var(--color-teal)'}
                            onBlur={(e) => e.currentTarget.style.borderColor = 'var(--color-border)'}
                        />
                    </div>

                    {/* FORGOT PASSWORD LINK */}
                    <div style={{ textAlign: 'right', marginBottom: '24px' }}>
                        <Link
                            to="/forgot-password"
                            style={{
                                fontSize: '13px',
                                color: 'var(--color-teal)',
                                textDecoration: 'none',
                                fontWeight: '500',
                            }}
                        >
                            Forgot Password?
                        </Link>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        style={{
                            width: '100%',
                            padding: '14px',
                            backgroundColor: loading ? 'var(--color-border)' : 'var(--color-teal)',
                            color: 'white',
                            border: 'none',
                            borderRadius: 'var(--radius-full)',
                            fontSize: '16px',
                            fontWeight: '600',
                            cursor: loading ? 'not-allowed' : 'pointer',
                            transition: 'all 0.3s ease'
                        }}
                    >
                        {loading ? 'Logging in...' : 'Login →'}
                    </button>
                </form>

                <p style={{ textAlign: 'center', marginTop: '20px', color: 'var(--color-text-light)' }}>
                    Don't have an account?{' '}
                    <Link to="/register" style={{ color: 'var(--color-teal)', textDecoration: 'none', fontWeight: '500' }}>
                        Sign up
                    </Link>
                </p>
            </div>
        </div>
    );
};

export default Login;