import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { UserService } from '../../services/api';
import { Mail, ArrowLeft, KeyRound, CheckCircle } from 'lucide-react';
import toast from 'react-hot-toast';

const ForgotPassword = () => {
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [step, setStep] = useState('request'); // 'request' | 'reset' | 'success'
    const [resetToken, setResetToken] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const navigate = useNavigate();

    // Step 1: Request reset link
    const handleRequestReset = async (e) => {
        e.preventDefault();
        setLoading(true);

        const result = await UserService.forgotPassword(email);

        if (result.success) {
            setResetToken(result.resetToken);
            setStep('reset');
            toast.success('Email verified! Set your new password.');
        } else {
            toast.error(result.error);
        }

        setLoading(false);
    };

    // Step 2: Set new password
    const handleResetPassword = async (e) => {
        e.preventDefault();

        if (newPassword !== confirmPassword) {
            toast.error('Passwords do not match');
            return;
        }

        if (newPassword.length < 6) {
            toast.error('Password must be at least 6 characters');
            return;
        }

        setLoading(true);

        const result = await UserService.resetPassword(resetToken, newPassword);

        if (result.success) {
            setStep('success');
            toast.success('Password reset successfully!');
            setTimeout(() => navigate('/login'), 3000);
        } else {
            toast.error(result.error);
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
            padding: '20px',
        }}>
            <div style={{
                backgroundColor: 'white',
                padding: '40px',
                borderRadius: 'var(--radius-xl)',
                boxShadow: '0 8px 32px rgba(47, 65, 86, 0.08)',
                width: '100%',
                maxWidth: '450px',
            }}>

                {/* ===== STEP 1: REQUEST RESET ===== */}
                {step === 'request' && (
                    <>
                        <div style={{
                            width: '64px',
                            height: '64px',
                            borderRadius: '50%',
                            background: 'var(--color-sky-blue)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            margin: '0 auto 20px',
                        }}>
                            <KeyRound size={32} color="var(--color-teal)" />
                        </div>

                        <h2 style={{
                            fontSize: '26px',
                            fontWeight: '800',
                            textAlign: 'center',
                            color: 'var(--color-text-primary)',
                            marginBottom: '8px',
                        }}>
                            Forgot Password?
                        </h2>

                        <p style={{
                            fontSize: '14px',
                            textAlign: 'center',
                            color: 'var(--color-text-light)',
                            marginBottom: '24px',
                            lineHeight: 1.6,
                        }}>
                            Enter your registered email and we'll help you reset your password.
                        </p>

                        <form onSubmit={handleRequestReset}>
                            <div style={{ marginBottom: '20px' }}>
                                <label style={{
                                    display: 'block',
                                    fontSize: '14px',
                                    fontWeight: '600',
                                    color: 'var(--color-text-primary)',
                                    marginBottom: '8px',
                                }}>
                                    Email Address
                                </label>
                                <div style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    backgroundColor: 'var(--color-bg-primary)',
                                    borderRadius: 'var(--radius-md)',
                                    padding: '12px 16px',
                                    gap: '10px',
                                    border: '1px solid var(--color-border)',
                                }}>
                                    <Mail size={18} color="var(--color-teal)" />
                                    <input
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        placeholder="youremail@example.com"
                                        required
                                        style={{
                                            border: 'none',
                                            backgroundColor: 'transparent',
                                            outline: 'none',
                                            fontSize: '14px',
                                            width: '100%',
                                            color: 'var(--color-text-primary)',
                                        }}
                                    />
                                </div>
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
                                    fontSize: '15px',
                                    fontWeight: '700',
                                    cursor: loading ? 'not-allowed' : 'pointer',
                                    transition: 'all 0.3s ease',
                                    boxShadow: loading ? 'none' : '0 4px 15px rgba(86, 124, 141, 0.3)',
                                }}
                            >
                                {loading ? 'Verifying...' : 'Send Reset Link'}
                            </button>
                        </form>

                        <div style={{
                            marginTop: '24px',
                            textAlign: 'center',
                        }}>
                            <Link
                                to="/login"
                                style={{
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    gap: '6px',
                                    color: 'var(--color-teal)',
                                    textDecoration: 'none',
                                    fontSize: '14px',
                                    fontWeight: '500',
                                }}
                            >
                                <ArrowLeft size={16} />
                                Back to Login
                            </Link>
                        </div>
                    </>
                )}

                {/* ===== STEP 2: RESET PASSWORD ===== */}
                {step === 'reset' && (
                    <>
                        <div style={{
                            width: '64px',
                            height: '64px',
                            borderRadius: '50%',
                            background: 'var(--color-sky-blue)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            margin: '0 auto 20px',
                        }}>
                            <KeyRound size={32} color="var(--color-teal)" />
                        </div>

                        <h2 style={{
                            fontSize: '26px',
                            fontWeight: '800',
                            textAlign: 'center',
                            color: 'var(--color-text-primary)',
                            marginBottom: '8px',
                        }}>
                            Set New Password
                        </h2>

                        <p style={{
                            fontSize: '14px',
                            textAlign: 'center',
                            color: 'var(--color-text-light)',
                            marginBottom: '24px',
                        }}>
                            Email verified: <strong>{email}</strong>
                        </p>

                        <form onSubmit={handleResetPassword}>
                            <div style={{ marginBottom: '16px' }}>
                                <label style={{
                                    display: 'block',
                                    fontSize: '14px',
                                    fontWeight: '600',
                                    color: 'var(--color-text-primary)',
                                    marginBottom: '8px',
                                }}>
                                    New Password
                                </label>
                                <input
                                    type="password"
                                    value={newPassword}
                                    onChange={(e) => setNewPassword(e.target.value)}
                                    placeholder="Min 6 characters"
                                    required
                                    minLength={6}
                                    style={{
                                        width: '100%',
                                        padding: '12px 16px',
                                        border: '1px solid var(--color-border)',
                                        borderRadius: 'var(--radius-md)',
                                        fontSize: '14px',
                                        outline: 'none',
                                        backgroundColor: 'var(--color-bg-primary)',
                                    }}
                                />
                            </div>

                            <div style={{ marginBottom: '20px' }}>
                                <label style={{
                                    display: 'block',
                                    fontSize: '14px',
                                    fontWeight: '600',
                                    color: 'var(--color-text-primary)',
                                    marginBottom: '8px',
                                }}>
                                    Confirm New Password
                                </label>
                                <input
                                    type="password"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    placeholder="Confirm password"
                                    required
                                    style={{
                                        width: '100%',
                                        padding: '12px 16px',
                                        border: '1px solid var(--color-border)',
                                        borderRadius: 'var(--radius-md)',
                                        fontSize: '14px',
                                        outline: 'none',
                                        backgroundColor: 'var(--color-bg-primary)',
                                    }}
                                />
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
                                    fontSize: '15px',
                                    fontWeight: '700',
                                    cursor: loading ? 'not-allowed' : 'pointer',
                                    transition: 'all 0.3s ease',
                                    boxShadow: loading ? 'none' : '0 4px 15px rgba(86, 124, 141, 0.3)',
                                }}
                            >
                                {loading ? 'Resetting...' : 'Reset Password'}
                            </button>
                        </form>

                        <div style={{
                            marginTop: '24px',
                            textAlign: 'center',
                        }}>
                            <button
                                onClick={() => {
                                    setStep('request');
                                    setNewPassword('');
                                    setConfirmPassword('');
                                }}
                                style={{
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    gap: '6px',
                                    color: 'var(--color-teal)',
                                    background: 'none',
                                    border: 'none',
                                    cursor: 'pointer',
                                    fontSize: '14px',
                                    fontWeight: '500',
                                }}
                            >
                                <ArrowLeft size={16} />
                                Back
                            </button>
                        </div>
                    </>
                )}

                {/* ===== STEP 3: SUCCESS ===== */}
                {step === 'success' && (
                    <>
                        <div style={{
                            width: '80px',
                            height: '80px',
                            borderRadius: '50%',
                            background: '#E8F5E9',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            margin: '0 auto 20px',
                        }}>
                            <CheckCircle size={48} color="#2E7D32" />
                        </div>

                        <h2 style={{
                            fontSize: '26px',
                            fontWeight: '800',
                            textAlign: 'center',
                            color: 'var(--color-text-primary)',
                            marginBottom: '12px',
                        }}>
                            Password Reset!
                        </h2>

                        <p style={{
                            fontSize: '14px',
                            textAlign: 'center',
                            color: 'var(--color-text-light)',
                            marginBottom: '24px',
                            lineHeight: 1.6,
                        }}>
                            Your password has been reset successfully. You can now login with your new password.
                        </p>

                        <Link to="/login" style={{ textDecoration: 'none' }}>
                            <button
                                style={{
                                    width: '100%',
                                    padding: '14px',
                                    backgroundColor: 'var(--color-teal)',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: 'var(--radius-full)',
                                    fontSize: '15px',
                                    fontWeight: '700',
                                    cursor: 'pointer',
                                    transition: 'all 0.3s ease',
                                    boxShadow: '0 4px 15px rgba(86, 124, 141, 0.3)',
                                }}
                            >
                                Go to Login
                            </button>
                        </Link>
                    </>
                )}

            </div>
        </div>
    );
};

export default ForgotPassword;