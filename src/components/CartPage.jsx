import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { Trash2, Plus, Minus, ShoppingCart, Tag, X, CheckCircle } from 'lucide-react';

const CartPage = () => {
    const { cartItems, cartTotal, appliedCoupon, removeFromCart, updateQuantity, clearCart, applyCoupon, removeCoupon } = useCart();
    const [couponCode, setCouponCode] = useState('');

    const handleApplyCoupon = (e) => {
        e.preventDefault();
        if (!couponCode.trim()) {
            return;
        }
        const result = applyCoupon(couponCode.trim());
        if (result.success) {
            setCouponCode('');
        }
    };

    // Empty cart
    if (cartItems.length === 0) {
        return (
            <div style={{
                minHeight: '70vh',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '40px'
            }}>
                <ShoppingCart size={64} color="#ccc" />
                <h2 style={{ color: '#666', marginTop: '20px' }}>Your Cart is Empty</h2>
                <p style={{ color: '#999', marginBottom: '20px' }}>Looks like you haven't added any items yet.</p>
                <Link to="/">
                    <button style={{
                        backgroundColor: 'var(--color-teal)',
                        color: 'white',
                        border: 'none',
                        padding: '12px 32px',
                        borderRadius: 'var(--radius-full)',
                        fontSize: '16px',
                        fontWeight: '600',
                        cursor: 'pointer'
                    }}>
                        Continue Shopping →
                    </button>
                </Link>
            </div>
        );
    }

    return (
        <div style={{
            maxWidth: '900px',
            margin: '0 auto',
            padding: '24px',
            minHeight: '70vh'
        }}>
            <h2 style={{ fontSize: '28px', fontWeight: 'bold', marginBottom: '24px', color: 'var(--color-text-primary)' }}>
                🛒 Shopping Cart ({cartItems.length} items)
            </h2>

            {/* Cart Items */}
            <div style={{ marginBottom: '24px' }}>
                {cartItems.map((item) => (
                    <div key={item._id} style={{
                        display: 'flex',
                        alignItems: 'center',
                        padding: '16px',
                        backgroundColor: 'white',
                        borderRadius: 'var(--radius-lg)',
                        marginBottom: '12px',
                        boxShadow: '0 2px 8px rgba(47, 65, 86, 0.06)',
                        gap: '16px',
                        flexWrap: 'wrap'
                    }}>
                        <img
                            src={item.image || item.images?.[0] || 'https://via.placeholder.com/80x80'}
                            alt={item.name}
                            style={{
                                width: '80px',
                                height: '80px',
                                objectFit: 'cover',
                                borderRadius: 'var(--radius-md)'
                            }}
                        />

                        <div style={{ flex: 1, minWidth: '120px' }}>
                            <h4 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '4px' }}>
                                {item.name}
                            </h4>
                            <span style={{ fontSize: '14px', color: 'var(--color-text-light)' }}>
                                {item.category || 'General'}
                            </span>
                            <div style={{ fontSize: '18px', fontWeight: 'bold', color: 'var(--color-text-primary)', marginTop: '4px' }}>
                                ${((item.price || 0) * (item.quantity || 1)).toFixed(2)}
                            </div>
                        </div>

                        {/* Quantity */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <button
                                onClick={() => updateQuantity(item._id, (item.quantity || 1) - 1)}
                                style={{
                                    backgroundColor: '#f0f2f5',
                                    border: 'none',
                                    borderRadius: '50%',
                                    width: '32px',
                                    height: '32px',
                                    cursor: 'pointer',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center'
                                }}
                            >
                                <Minus size={16} />
                            </button>
                            <span style={{ fontSize: '16px', fontWeight: '600', minWidth: '24px', textAlign: 'center' }}>
                                {item.quantity || 1}
                            </span>
                            <button
                                onClick={() => updateQuantity(item._id, (item.quantity || 1) + 1)}
                                style={{
                                    backgroundColor: '#f0f2f5',
                                    border: 'none',
                                    borderRadius: '50%',
                                    width: '32px',
                                    height: '32px',
                                    cursor: 'pointer',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center'
                                }}
                            >
                                <Plus size={16} />
                            </button>
                        </div>

                        <button
                            onClick={() => removeFromCart(item._id)}
                            style={{
                                backgroundColor: 'transparent',
                                border: 'none',
                                color: '#dc2626',
                                cursor: 'pointer',
                                padding: '8px'
                            }}
                        >
                            <Trash2 size={20} />
                        </button>
                    </div>
                ))}
            </div>

            {/* ✅ COUPON CODE */}
            <div style={{
                backgroundColor: 'white',
                borderRadius: 'var(--radius-lg)',
                padding: '20px',
                marginBottom: '24px',
                boxShadow: '0 4px 15px rgba(47, 65, 86, 0.06)',
            }}>
                <h3 style={{
                    fontSize: '16px',
                    fontWeight: '700',
                    marginBottom: '12px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    color: 'var(--color-text-primary)',
                }}>
                    <Tag size={18} color="var(--color-teal)" />
                    Coupon Code
                </h3>

                {appliedCoupon ? (
                    <div style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        padding: '12px 16px',
                        backgroundColor: '#E8F5E9',
                        borderRadius: 'var(--radius-md)',
                        border: '1px solid #A5D6A7',
                    }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <CheckCircle size={20} color="#2E7D32" />
                            <div>
                                <p style={{ fontSize: '14px', fontWeight: '700', color: '#2E7D32' }}>
                                    {appliedCoupon.code} applied!
                                </p>
                                <p style={{ fontSize: '12px', color: '#2E7D32' }}>
                                    {appliedCoupon.description}
                                </p>
                            </div>
                        </div>
                        <button
                            onClick={removeCoupon}
                            style={{
                                background: 'transparent',
                                border: 'none',
                                cursor: 'pointer',
                                padding: '4px',
                                color: '#2E7D32',
                            }}
                        >
                            <X size={18} />
                        </button>
                    </div>
                ) : (
                    <form onSubmit={handleApplyCoupon} style={{ display: 'flex', gap: '8px' }}>
                        <input
                            type="text"
                            value={couponCode}
                            onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                            placeholder="Enter coupon code (e.g., SAVE10)"
                            style={{
                                flex: 1,
                                padding: '12px 16px',
                                border: '1px solid var(--color-border)',
                                borderRadius: 'var(--radius-md)',
                                fontSize: '14px',
                                outline: 'none',
                                textTransform: 'uppercase',
                            }}
                        />
                        <button
                            type="submit"
                            style={{
                                padding: '12px 24px',
                                backgroundColor: 'var(--color-teal)',
                                color: 'white',
                                border: 'none',
                                borderRadius: 'var(--radius-md)',
                                fontSize: '14px',
                                fontWeight: '700',
                                cursor: 'pointer',
                            }}
                        >
                            Apply
                        </button>
                    </form>
                )}

                {/* Available Coupons Hint */}
                {!appliedCoupon && (
                    <div style={{ marginTop: '12px', display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                        <span style={{ fontSize: '12px', color: 'var(--color-text-light)' }}>Available:</span>
                        {['SAVE10', 'SAVE20', 'FLAT50', 'FREESHIP'].map((code) => (
                            <button
                                key={code}
                                type="button"
                                onClick={() => setCouponCode(code)}
                                style={{
                                    padding: '2px 10px',
                                    fontSize: '11px',
                                    fontWeight: '600',
                                    backgroundColor: 'var(--color-sky-blue)',
                                    color: 'var(--color-navy)',
                                    border: 'none',
                                    borderRadius: 'var(--radius-full)',
                                    cursor: 'pointer',
                                }}
                            >
                                {code}
                            </button>
                        ))}
                    </div>
                )}
            </div>

            {/* Order Summary */}
            <div style={{
                backgroundColor: 'white',
                borderRadius: 'var(--radius-lg)',
                padding: '24px',
                boxShadow: '0 4px 15px rgba(47, 65, 86, 0.06)',
            }}>
                <h3 style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '16px' }}>
                    Order Summary
                </h3>

                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0' }}>
                    <span>Subtotal ({cartItems.reduce((sum, item) => sum + (item.quantity || 1), 0)} items)</span>
                    <span>${cartTotal.subtotal.toFixed(2)}</span>
                </div>

                {cartTotal.discount > 0 && (
                    <div style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        padding: '8px 0',
                        color: '#2E7D32',
                        fontWeight: '600',
                    }}>
                        <span>Discount ({appliedCoupon?.code})</span>
                        <span>-${cartTotal.discount.toFixed(2)}</span>
                    </div>
                )}

                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid var(--color-border)' }}>
                    <span>Shipping</span>
                    <span>{cartTotal.shipping === 0 ? 'FREE' : `$${cartTotal.shipping.toFixed(2)}`}</span>
                </div>

                <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    padding: '16px 0',
                    fontSize: '20px',
                    fontWeight: 'bold',
                }}>
                    <span>Total</span>
                    <span style={{ color: 'var(--color-teal)' }}>${cartTotal.total.toFixed(2)}</span>
                </div>

                <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                    <Link to="/" style={{ flex: 1 }}>
                        <button style={{
                            width: '100%',
                            padding: '14px',
                            backgroundColor: 'var(--color-bg-primary)',
                            border: 'none',
                            borderRadius: 'var(--radius-md)',
                            fontSize: '16px',
                            fontWeight: '600',
                            cursor: 'pointer',
                            color: 'var(--color-text-primary)',
                        }}>
                            ← Continue Shopping
                        </button>
                    </Link>
                    <button
                        onClick={clearCart}
                        style={{
                            padding: '14px 24px',
                            backgroundColor: '#FFEBEE',
                            color: '#DC2626',
                            border: 'none',
                            borderRadius: 'var(--radius-md)',
                            fontSize: '16px',
                            fontWeight: '600',
                            cursor: 'pointer'
                        }}
                    >
                        Clear Cart
                    </button>
                    <Link to="/checkout" style={{ flex: 2 }}>
                        <button style={{
                            width: '100%',
                            padding: '14px',
                            backgroundColor: 'var(--color-teal)',
                            color: 'white',
                            border: 'none',
                            borderRadius: 'var(--radius-md)',
                            fontSize: '16px',
                            fontWeight: '600',
                            cursor: 'pointer',
                        }}>
                            Proceed to Checkout →
                        </button>
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default CartPage;