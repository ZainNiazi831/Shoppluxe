import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const API_URL = 'https://shoppluxe-production.up.railway.app';

const Checkout = () => {
    const navigate = useNavigate();
    const { cartItems, cartTotal, clearCart } = useCart();
    const { user } = useAuth();

    const [formData, setFormData] = useState({
        fullName: user?.name || '',
        email: user?.email || '',
        phone: '',
        address: '',
        city: '',
        state: '',
        zipCode: '',
        country: 'Pakistan'
    });

    const [shippingMethod, setShippingMethod] = useState('standard');
    const [paymentMethod, setPaymentMethod] = useState('cod');
    const [loading, setLoading] = useState(false);
    const [orderPlaced, setOrderPlaced] = useState(false);
    const [orderNumber, setOrderNumber] = useState('');

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    // ✅ Calculate shipping cost
    const getShippingCost = () => {
        if (shippingMethod === 'express') return 20;
        if (shippingMethod === 'overnight') return 35;
        return 10;
    };

    const shippingCost = getShippingCost();
    const totalAmount = cartTotal.subtotal + shippingCost - (cartTotal.discount || 0);

    // ✅ PLACE ORDER - MongoDB mein save karein
    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validation
        if (!formData.fullName || !formData.email || !formData.phone ||
            !formData.address || !formData.city || !formData.state || !formData.zipCode) {
            toast.error('Please fill all required fields');
            return;
        }

        setLoading(true);

        try {
            const token = localStorage.getItem('token');
            const userId = user?.id || user?._id;

            // Order data prepare karein (MongoDB schema ke mutabiq)
            const orderData = {
                userId: userId,
                orderNumber: 'ORD-' + Date.now(),
                items: cartItems.map(item => ({
                    productId: item._id,
                    name: item.name,
                    price: item.price,
                    quantity: item.quantity,
                    image: item.image || item.images?.[0] || ''
                })),
                subtotal: cartTotal.subtotal,
                shippingFee: shippingCost,
                discount: cartTotal.discount || 0,
                total: totalAmount,
                shippingAddress: {
                    fullName: formData.fullName,
                    phone: formData.phone,
                    addressLine: formData.address,
                    city: formData.city,
                    state: formData.state,
                    postalCode: formData.zipCode,
                    country: formData.country
                },
                paymentMethod: paymentMethod,
                paymentStatus: 'pending',
                orderStatus: 'pending'
            };

            console.log('📤 Sending order to MongoDB:', orderData);

            // ✅ Backend ko bhejo
            const response = await fetch(`${API_URL}/api/orders`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(orderData)
            });

            const data = await response.json();
            console.log('📥 Response:', data);

            if (data.success) {
                setOrderNumber(data.order.orderNumber);
                setOrderPlaced(true);
                clearCart();
                toast.success('Order placed successfully!');
            } else {
                toast.error(data.error || 'Failed to place order');
            }
        } catch (err) {
            console.error('❌ Order error:', err);
            toast.error('Server se connect nahi ho pa raha');
        } finally {
            setLoading(false);
        }
    };

    // ===== EMPTY CART =====
    if (cartItems.length === 0 && !orderPlaced) {
        return (
            <div style={{
                minHeight: '70vh', display: 'flex', flexDirection: 'column',
                alignItems: 'center', justifyContent: 'center', padding: '40px'
            }}>
                <h2 style={{ color: '#666' }}>Your Cart is Empty</h2>
                <p style={{ color: '#999' }}>Add some items before checking out.</p>
                <button
                    onClick={() => navigate('/')}
                    style={{
                        backgroundColor: '#6c63ff', color: 'white', border: 'none',
                        padding: '12px 32px', borderRadius: '25px',
                        fontSize: '16px', fontWeight: '600', cursor: 'pointer',
                        marginTop: '20px'
                    }}
                >
                    Continue Shopping →
                </button>
            </div>
        );
    }

    // ===== ORDER CONFIRMATION =====
    if (orderPlaced) {
        return (
            <div style={{
                maxWidth: '600px', margin: '40px auto', padding: '40px',
                backgroundColor: 'white', borderRadius: '16px',
                boxShadow: '0 8px 32px rgba(0,0,0,0.08)', textAlign: 'center'
            }}>
                <div style={{ fontSize: '64px', marginBottom: '16px' }}>🎉</div>
                <h2 style={{ color: '#1a1a2e', marginBottom: '8px' }}>Order Placed Successfully!</h2>
                <p style={{ color: '#666', marginBottom: '24px' }}>
                    Thank you for your order. We'll send you a confirmation email shortly.
                </p>
                <div style={{
                    backgroundColor: '#f0f2f5', padding: '16px',
                    borderRadius: '8px', marginBottom: '24px'
                }}>
                    <p style={{ color: '#888', fontSize: '14px', marginBottom: '4px' }}>Order Number</p>
                    <p style={{ fontSize: '20px', fontWeight: 'bold', color: '#1a1a2e' }}>{orderNumber}</p>
                </div>
                <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
                    <button
                        onClick={() => navigate('/orders')}
                        style={{
                            padding: '12px 24px', backgroundColor: '#6c63ff',
                            color: 'white', border: 'none', borderRadius: '8px',
                            fontSize: '16px', fontWeight: '600', cursor: 'pointer'
                        }}
                    >
                        View My Orders
                    </button>
                    <button
                        onClick={() => navigate('/')}
                        style={{
                            padding: '12px 24px', backgroundColor: '#f0f2f5',
                            color: '#333', border: 'none', borderRadius: '8px',
                            fontSize: '16px', fontWeight: '600', cursor: 'pointer'
                        }}
                    >
                        Continue Shopping
                    </button>
                </div>
            </div>
        );
    }

    // ===== CHECKOUT FORM =====
    return (
        <div style={{
            maxWidth: '900px', margin: '0 auto', padding: '24px', minHeight: '70vh'
        }}>
            <h2 style={{ fontSize: '28px', fontWeight: 'bold', marginBottom: '24px', color: '#1a1a2e' }}>
                📦 Checkout
            </h2>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
                {/* LEFT: Shipping Form */}
                <div>
                    <form onSubmit={handleSubmit}>
                        <h3 style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '16px', color: '#1a1a2e' }}>
                            Shipping Address
                        </h3>

                        <div style={{ marginBottom: '12px' }}>
                            <input
                                type="text" name="fullName" placeholder="Full Name *"
                                value={formData.fullName} onChange={handleChange} required
                                style={{
                                    width: '100%', padding: '12px', border: '1px solid #ddd',
                                    borderRadius: '8px', fontSize: '14px', outline: 'none'
                                }}
                            />
                        </div>

                        <div style={{ marginBottom: '12px' }}>
                            <input
                                type="email" name="email" placeholder="Email *"
                                value={formData.email} onChange={handleChange} required
                                style={{
                                    width: '100%', padding: '12px', border: '1px solid #ddd',
                                    borderRadius: '8px', fontSize: '14px', outline: 'none'
                                }}
                            />
                        </div>

                        <div style={{ marginBottom: '12px' }}>
                            <input
                                type="tel" name="phone" placeholder="Phone Number *"
                                value={formData.phone} onChange={handleChange} required
                                style={{
                                    width: '100%', padding: '12px', border: '1px solid #ddd',
                                    borderRadius: '8px', fontSize: '14px', outline: 'none'
                                }}
                            />
                        </div>

                        <div style={{ marginBottom: '12px' }}>
                            <input
                                type="text" name="address" placeholder="Street Address *"
                                value={formData.address} onChange={handleChange} required
                                style={{
                                    width: '100%', padding: '12px', border: '1px solid #ddd',
                                    borderRadius: '8px', fontSize: '14px', outline: 'none'
                                }}
                            />
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                            <input
                                type="text" name="city" placeholder="City *"
                                value={formData.city} onChange={handleChange} required
                                style={{
                                    width: '100%', padding: '12px', border: '1px solid #ddd',
                                    borderRadius: '8px', fontSize: '14px', outline: 'none',
                                    marginBottom: '12px'
                                }}
                            />
                            <input
                                type="text" name="state" placeholder="State *"
                                value={formData.state} onChange={handleChange} required
                                style={{
                                    width: '100%', padding: '12px', border: '1px solid #ddd',
                                    borderRadius: '8px', fontSize: '14px', outline: 'none',
                                    marginBottom: '12px'
                                }}
                            />
                        </div>

                        <div style={{ marginBottom: '12px' }}>
                            <input
                                type="text" name="zipCode" placeholder="ZIP Code *"
                                value={formData.zipCode} onChange={handleChange} required
                                style={{
                                    width: '100%', padding: '12px', border: '1px solid #ddd',
                                    borderRadius: '8px', fontSize: '14px', outline: 'none'
                                }}
                            />
                        </div>

                        <div style={{ marginBottom: '12px' }}>
                            <input
                                type="text" name="country" placeholder="Country"
                                value={formData.country} onChange={handleChange}
                                style={{
                                    width: '100%', padding: '12px', border: '1px solid #ddd',
                                    borderRadius: '8px', fontSize: '14px', outline: 'none'
                                }}
                            />
                        </div>

                        {/* Shipping Method */}
                        <h3 style={{ fontSize: '18px', fontWeight: 'bold', marginTop: '24px', marginBottom: '16px', color: '#1a1a2e' }}>
                            Shipping Method
                        </h3>
                        <div style={{ marginBottom: '12px' }}>
                            {[
                                { value: 'standard', label: 'Standard (5-7 days) - $10.00' },
                                { value: 'express', label: 'Express (2-3 days) - $20.00' },
                                { value: 'overnight', label: 'Overnight (1 day) - $35.00' }
                            ].map(opt => (
                                <label key={opt.value} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px', cursor: 'pointer' }}>
                                    <input
                                        type="radio" value={opt.value}
                                        checked={shippingMethod === opt.value}
                                        onChange={(e) => setShippingMethod(e.target.value)}
                                    />
                                    <span>{opt.label}</span>
                                </label>
                            ))}
                        </div>

                        {/* Payment Method */}
                        <h3 style={{ fontSize: '18px', fontWeight: 'bold', marginTop: '24px', marginBottom: '16px', color: '#1a1a2e' }}>
                            Payment Method
                        </h3>
                        <div style={{ marginBottom: '12px' }}>
                            {[
                                { value: 'cod', label: 'Cash on Delivery' },
                                { value: 'credit_card', label: 'Credit Card (Mock Payment)' }
                            ].map(opt => (
                                <label key={opt.value} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px', cursor: 'pointer' }}>
                                    <input
                                        type="radio" value={opt.value}
                                        checked={paymentMethod === opt.value}
                                        onChange={(e) => setPaymentMethod(e.target.value)}
                                    />
                                    <span>{opt.label}</span>
                                </label>
                            ))}
                        </div>

                        {/* PLACE ORDER BUTTON */}
                        <button
                            type="submit" disabled={loading}
                            style={{
                                width: '100%', padding: '14px',
                                backgroundColor: loading ? '#9ca3af' : '#6c63ff',
                                color: 'white', border: 'none', borderRadius: '8px',
                                fontSize: '16px', fontWeight: '600',
                                cursor: loading ? 'not-allowed' : 'pointer',
                                marginTop: '16px'
                            }}
                        >
                            {loading ? 'Placing Order...' : '✅ Place Order'}
                        </button>
                    </form>
                </div>

                {/* RIGHT: Order Summary */}
                <div>
                    <h3 style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '16px', color: '#1a1a2e' }}>
                        Order Summary
                    </h3>
                    <div style={{
                        backgroundColor: 'white', borderRadius: '12px',
                        padding: '20px', boxShadow: '0 2px 8px rgba(0,0,0,0.06)'
                    }}>
                        {cartItems.map((item) => (
                            <div key={item._id} style={{
                                display: 'flex', justifyContent: 'space-between',
                                padding: '8px 0', borderBottom: '1px solid #f0f2f5'
                            }}>
                                <span>{item.name} × {item.quantity}</span>
                                <span>${(item.price * item.quantity).toFixed(2)}</span>
                            </div>
                        ))}

                        <div style={{ marginTop: '12px' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0' }}>
                                <span>Subtotal</span>
                                <span>${cartTotal.subtotal.toFixed(2)}</span>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0' }}>
                                <span>Shipping</span>
                                <span>${shippingCost.toFixed(2)}</span>
                            </div>
                            <div style={{
                                display: 'flex', justifyContent: 'space-between',
                                padding: '16px 0', borderTop: '2px solid #eee',
                                fontSize: '20px', fontWeight: 'bold'
                            }}>
                                <span>Total</span>
                                <span style={{ color: '#6c63ff' }}>${totalAmount.toFixed(2)}</span>
                            </div>
                        </div>
                    </div>

                    <button
                        onClick={() => navigate('/cart')}
                        style={{
                            width: '100%', padding: '12px', backgroundColor: '#f0f2f5',
                            border: 'none', borderRadius: '8px', fontSize: '16px',
                            fontWeight: '600', cursor: 'pointer', marginTop: '12px'
                        }}
                    >
                        ← Back to Cart
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Checkout;