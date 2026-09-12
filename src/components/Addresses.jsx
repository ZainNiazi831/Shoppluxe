import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { UserService } from '../services/api';
import {
    MapPin,
    Plus,
    Edit3,
    Trash2,
    CheckCircle,
    X,
    ArrowLeft,
    Save,
} from 'lucide-react';
import toast from 'react-hot-toast';

const Addresses = () => {
    const [addresses, setAddresses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [saving, setSaving] = useState(false);

    const [formData, setFormData] = useState({
        fullName: '',
        phone: '',
        addressLine: '',
        city: '',
        state: '',
        postalCode: '',
        country: 'Pakistan',
        isDefault: false
    });

    useEffect(() => {
        loadAddresses();
    }, []);

    const loadAddresses = async () => {
        setLoading(true);
        try {
            const result = await UserService.getAddresses();
            if (result.success) {
                setAddresses(result.addresses || []);
            } else {
                toast.error(result.error);
            }
        } catch (error) {
            toast.error('Failed to load addresses');
        }
        setLoading(false);
    };

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const resetForm = () => {
        setFormData({
            fullName: '',
            phone: '',
            addressLine: '',
            city: '',
            state: '',
            postalCode: '',
            country: 'Pakistan',
            isDefault: false
        });
        setEditingId(null);
        setShowForm(false);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);

        let result;
        if (editingId) {
            result = await UserService.updateAddress(editingId, formData);
        } else {
            result = await UserService.addAddress(formData);
        }

        if (result.success) {
            toast.success(editingId ? 'Address updated!' : 'Address added!');
            setAddresses(result.addresses || []);
            resetForm();
        } else {
            toast.error(result.error);
        }

        setSaving(false);
    };

    const handleEdit = (address) => {
        setFormData({
            fullName: address.fullName || '',
            phone: address.phone || '',
            addressLine: address.addressLine || '',
            city: address.city || '',
            state: address.state || '',
            postalCode: address.postalCode || '',
            country: address.country || 'Pakistan',
            isDefault: address.isDefault || false
        });
        setEditingId(address.id || address._id);
        setShowForm(true);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleDelete = async (addressId) => {
        if (!window.confirm('Delete this address?')) return;

        const result = await UserService.deleteAddress(addressId);
        if (result.success) {
            toast.success('Address deleted');
            setAddresses(result.addresses || []);
        } else {
            toast.error(result.error);
        }
    };

    const handleSetDefault = async (addressId) => {
        const result = await UserService.setDefaultAddress(addressId);
        if (result.success) {
            toast.success('Default address updated');
            setAddresses(result.addresses || []);
        } else {
            toast.error(result.error);
        }
    };

    if (loading) {
        return (
            <div style={{ maxWidth: '900px', margin: '0 auto', padding: '40px 24px' }}>
                <h1 style={{ fontSize: '28px', marginBottom: '24px' }}>📍 My Addresses</h1>
                <div style={{
                    backgroundColor: 'white',
                    borderRadius: '16px',
                    padding: '40px',
                    animation: 'pulse 1.5s ease-in-out infinite'
                }}>
                    <div style={{ height: '100px', backgroundColor: 'var(--color-sky-blue)', borderRadius: '8px' }} />
                </div>
            </div>
        );
    }

    return (
        <div style={{ maxWidth: '900px', margin: '0 auto', padding: '24px', minHeight: '70vh' }}>

            <Link to="/profile" style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                color: 'var(--color-teal)',
                textDecoration: 'none',
                fontSize: '14px',
                fontWeight: '500',
                marginBottom: '16px',
            }}>
                <ArrowLeft size={18} />
                Back to Profile
            </Link>

            <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '24px',
                flexWrap: 'wrap',
                gap: '12px',
            }}>
                <h1 style={{
                    fontSize: '32px',
                    fontWeight: '800',
                    color: 'var(--color-text-primary)',
                }}>
                    📍 My Addresses
                </h1>

                <button
                    onClick={() => {
                        resetForm();
                        setShowForm(!showForm);
                    }}
                    style={{
                        padding: '12px 24px',
                        backgroundColor: showForm ? 'var(--color-sky-blue)' : 'var(--color-teal)',
                        color: showForm ? 'var(--color-navy)' : 'white',
                        border: 'none',
                        borderRadius: 'var(--radius-full)',
                        fontSize: '14px',
                        fontWeight: '600',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        transition: 'all 0.3s ease',
                    }}
                >
                    {showForm ? <X size={18} /> : <Plus size={18} />}
                    {showForm ? 'Cancel' : 'Add New Address'}
                </button>
            </div>

            {showForm && (
                <div style={{
                    backgroundColor: 'white',
                    borderRadius: 'var(--radius-xl)',
                    padding: '28px',
                    marginBottom: '24px',
                    boxShadow: '0 4px 15px rgba(47, 65, 86, 0.06)',
                }}>
                    <h3 style={{
                        fontSize: '20px',
                        fontWeight: '700',
                        color: 'var(--color-text-primary)',
                        marginBottom: '20px',
                    }}>
                        {editingId ? '✏️ Edit Address' : '➕ Add New Address'}
                    </h3>

                    <form onSubmit={handleSubmit}>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '16px' }}>

                            <div>
                                <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', color: 'var(--color-text-primary)', marginBottom: '6px' }}>
                                    Full Name *
                                </label>
                                <input
                                    type="text"
                                    name="fullName"
                                    value={formData.fullName}
                                    onChange={handleChange}
                                    required
                                    style={{
                                        width: '100%',
                                        padding: '12px',
                                        border: '1px solid var(--color-border)',
                                        borderRadius: 'var(--radius-md)',
                                        fontSize: '14px',
                                        outline: 'none',
                                    }}
                                />
                            </div>

                            <div>
                                <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', color: 'var(--color-text-primary)', marginBottom: '6px' }}>
                                    Phone Number *
                                </label>
                                <input
                                    type="tel"
                                    name="phone"
                                    value={formData.phone}
                                    onChange={handleChange}
                                    required
                                    style={{
                                        width: '100%',
                                        padding: '12px',
                                        border: '1px solid var(--color-border)',
                                        borderRadius: 'var(--radius-md)',
                                        fontSize: '14px',
                                        outline: 'none',
                                    }}
                                />
                            </div>
                        </div>

                        <div style={{ marginTop: '16px' }}>
                            <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', color: 'var(--color-text-primary)', marginBottom: '6px' }}>
                                Street Address *
                            </label>
                            <input
                                type="text"
                                name="addressLine"
                                value={formData.addressLine}
                                onChange={handleChange}
                                required
                                placeholder="House/Flat No, Street, Area"
                                style={{
                                    width: '100%',
                                    padding: '12px',
                                    border: '1px solid var(--color-border)',
                                    borderRadius: 'var(--radius-md)',
                                    fontSize: '14px',
                                    outline: 'none',
                                }}
                            />
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '16px', marginTop: '16px' }}>
                            <div>
                                <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', color: 'var(--color-text-primary)', marginBottom: '6px' }}>
                                    City *
                                </label>
                                <input
                                    type="text"
                                    name="city"
                                    value={formData.city}
                                    onChange={handleChange}
                                    required
                                    style={{
                                        width: '100%',
                                        padding: '12px',
                                        border: '1px solid var(--color-border)',
                                        borderRadius: 'var(--radius-md)',
                                        fontSize: '14px',
                                        outline: 'none',
                                    }}
                                />
                            </div>

                            <div>
                                <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', color: 'var(--color-text-primary)', marginBottom: '6px' }}>
                                    State/Province *
                                </label>
                                <input
                                    type="text"
                                    name="state"
                                    value={formData.state}
                                    onChange={handleChange}
                                    required
                                    style={{
                                        width: '100%',
                                        padding: '12px',
                                        border: '1px solid var(--color-border)',
                                        borderRadius: 'var(--radius-md)',
                                        fontSize: '14px',
                                        outline: 'none',
                                    }}
                                />
                            </div>

                            <div>
                                <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', color: 'var(--color-text-primary)', marginBottom: '6px' }}>
                                    Postal Code *
                                </label>
                                <input
                                    type="text"
                                    name="postalCode"
                                    value={formData.postalCode}
                                    onChange={handleChange}
                                    required
                                    style={{
                                        width: '100%',
                                        padding: '12px',
                                        border: '1px solid var(--color-border)',
                                        borderRadius: 'var(--radius-md)',
                                        fontSize: '14px',
                                        outline: 'none',
                                    }}
                                />
                            </div>

                            <div>
                                <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', color: 'var(--color-text-primary)', marginBottom: '6px' }}>
                                    Country *
                                </label>
                                <input
                                    type="text"
                                    name="country"
                                    value={formData.country}
                                    onChange={handleChange}
                                    required
                                    style={{
                                        width: '100%',
                                        padding: '12px',
                                        border: '1px solid var(--color-border)',
                                        borderRadius: 'var(--radius-md)',
                                        fontSize: '14px',
                                        outline: 'none',
                                    }}
                                />
                            </div>
                        </div>

                        <div style={{ marginTop: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <input
                                type="checkbox"
                                name="isDefault"
                                checked={formData.isDefault}
                                onChange={handleChange}
                                id="isDefault"
                                style={{ width: '18px', height: '18px', cursor: 'pointer' }}
                            />
                            <label htmlFor="isDefault" style={{ fontSize: '14px', fontWeight: '500', cursor: 'pointer' }}>
                                Set as default address
                            </label>
                        </div>

                        <div style={{ marginTop: '24px', display: 'flex', gap: '12px' }}>
                            <button
                                type="submit"
                                disabled={saving}
                                style={{
                                    padding: '12px 28px',
                                    backgroundColor: saving ? 'var(--color-border)' : 'var(--color-teal)',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: 'var(--radius-full)',
                                    fontSize: '14px',
                                    fontWeight: '700',
                                    cursor: saving ? 'not-allowed' : 'pointer',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '8px',
                                }}
                            >
                                <Save size={18} />
                                {saving ? 'Saving...' : editingId ? 'Update Address' : 'Save Address'}
                            </button>

                            <button
                                type="button"
                                onClick={resetForm}
                                style={{
                                    padding: '12px 28px',
                                    backgroundColor: 'var(--color-bg-primary)',
                                    color: 'var(--color-text-primary)',
                                    border: '1px solid var(--color-border)',
                                    borderRadius: 'var(--radius-full)',
                                    fontSize: '14px',
                                    fontWeight: '600',
                                    cursor: 'pointer',
                                }}
                            >
                                Cancel
                            </button>
                        </div>
                    </form>
                </div>
            )}

            {addresses.length === 0 ? (
                <div style={{
                    backgroundColor: 'white',
                    borderRadius: 'var(--radius-xl)',
                    padding: '60px 40px',
                    textAlign: 'center',
                    boxShadow: '0 4px 15px rgba(47, 65, 86, 0.06)',
                }}>
                    <MapPin size={64} color="var(--color-text-light)" style={{ marginBottom: '20px' }} />
                    <h3 style={{
                        fontSize: '20px',
                        fontWeight: '700',
                        color: 'var(--color-text-primary)',
                        marginBottom: '8px',
                    }}>
                        No Addresses Yet
                    </h3>
                    <p style={{
                        fontSize: '14px',
                        color: 'var(--color-text-light)',
                        marginBottom: '20px',
                    }}>
                        Add your first address to get started
                    </p>
                    <button
                        onClick={() => setShowForm(true)}
                        style={{
                            padding: '12px 28px',
                            backgroundColor: 'var(--color-teal)',
                            color: 'white',
                            border: 'none',
                            borderRadius: 'var(--radius-full)',
                            fontSize: '14px',
                            fontWeight: '700',
                            cursor: 'pointer',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '8px',
                        }}
                    >
                        <Plus size={18} />
                        Add Address
                    </button>
                </div>
            ) : (
                <div style={{ display: 'grid', gap: '16px' }}>
                    {addresses.map((address) => (
                        <div
                            key={address.id || address._id}
                            style={{
                                backgroundColor: 'white',
                                borderRadius: 'var(--radius-xl)',
                                padding: '24px',
                                boxShadow: '0 4px 15px rgba(47, 65, 86, 0.06)',
                                border: address.isDefault
                                    ? '2px solid var(--color-teal)'
                                    : '1px solid var(--color-border)',
                                position: 'relative',
                            }}
                        >
                            {address.isDefault && (
                                <div style={{
                                    position: 'absolute',
                                    top: '16px',
                                    right: '16px',
                                    padding: '4px 12px',
                                    backgroundColor: 'var(--color-teal)',
                                    color: 'white',
                                    borderRadius: 'var(--radius-full)',
                                    fontSize: '11px',
                                    fontWeight: '700',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '4px',
                                }}>
                                    <CheckCircle size={12} />
                                    DEFAULT
                                </div>
                            )}

                            <div style={{ display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
                                <div style={{
                                    width: '48px',
                                    height: '48px',
                                    borderRadius: '50%',
                                    backgroundColor: 'var(--color-sky-blue)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    flexShrink: 0,
                                }}>
                                    <MapPin size={24} color="var(--color-teal)" />
                                </div>

                                <div style={{ flex: 1 }}>
                                    <h4 style={{
                                        fontSize: '16px',
                                        fontWeight: '700',
                                        color: 'var(--color-text-primary)',
                                        marginBottom: '6px',
                                    }}>
                                        {address.fullName}
                                    </h4>
                                    <p style={{ fontSize: '14px', color: 'var(--color-text-secondary)', marginBottom: '4px', lineHeight: 1.6 }}>
                                        {address.addressLine}<br />
                                        {address.city}, {address.state} {address.postalCode}<br />
                                        {address.country}
                                    </p>
                                    <p style={{ fontSize: '14px', color: 'var(--color-text-secondary)', marginBottom: '12px' }}>
                                        📱 {address.phone}
                                    </p>

                                    <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                                        <button
                                            onClick={() => handleEdit(address)}
                                            style={{
                                                padding: '8px 16px',
                                                backgroundColor: 'var(--color-sky-blue)',
                                                color: 'var(--color-navy)',
                                                border: 'none',
                                                borderRadius: 'var(--radius-full)',
                                                fontSize: '13px',
                                                fontWeight: '600',
                                                cursor: 'pointer',
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: '6px',
                                            }}
                                        >
                                            <Edit3 size={14} />
                                            Edit
                                        </button>

                                        {!address.isDefault && (
                                            <button
                                                onClick={() => handleSetDefault(address.id || address._id)}
                                                style={{
                                                    padding: '8px 16px',
                                                    backgroundColor: 'transparent',
                                                    color: 'var(--color-teal)',
                                                    border: '1px solid var(--color-teal)',
                                                    borderRadius: 'var(--radius-full)',
                                                    fontSize: '13px',
                                                    fontWeight: '600',
                                                    cursor: 'pointer',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    gap: '6px',
                                                }}
                                            >
                                                <CheckCircle size={14} />
                                                Set as Default
                                            </button>
                                        )}

                                        <button
                                            onClick={() => handleDelete(address.id || address._id)}
                                            style={{
                                                padding: '8px 16px',
                                                backgroundColor: '#FFEBEE',
                                                color: '#DC2626',
                                                border: 'none',
                                                borderRadius: 'var(--radius-full)',
                                                fontSize: '13px',
                                                fontWeight: '600',
                                                cursor: 'pointer',
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: '6px',
                                            }}
                                        >
                                            <Trash2 size={14} />
                                            Delete
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Addresses;