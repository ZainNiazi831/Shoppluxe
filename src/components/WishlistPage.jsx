import React from 'react';
import { Link } from 'react-router-dom';
import { useWishlist } from '../context/WishlistContext';
import { useCart } from '../context/CartContext';
import { Heart, ShoppingBag, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';

const WishlistPage = () => {
    const { wishlistItems, removeFromWishlist } = useWishlist();
    const { addToCart } = useCart();

    const handleMoveToCart = (product) => {
        addToCart(product);
        removeFromWishlist(product._id);
        toast.success(`🛒 ${product.name} moved to cart`);
    };

    if (wishlistItems.length === 0) {
        return (
            <div style={{
                minHeight: '70vh',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '40px',
                textAlign: 'center'
            }}>
                <Heart size={64} color="#ccc" />
                <h2 style={{ color: '#666', marginTop: '20px' }}>Your Wishlist is Empty</h2>
                <p style={{ color: '#999', marginBottom: '20px' }}>
                    Start adding products you love!
                </p>
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
        <div style={{
            maxWidth: '900px',
            margin: '0 auto',
            padding: '24px',
            minHeight: '70vh'
        }}>
            <h2 style={{ fontSize: '28px', fontWeight: 'bold', marginBottom: '24px', color: '#1a1a2e' }}>
                ❤️ My Wishlist ({wishlistItems.length} items)
            </h2>

            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
                gap: '20px'
            }}>
                {wishlistItems.map((item) => (
                    <div key={item._id} style={{
                        backgroundColor: 'white',
                        borderRadius: '16px',
                        overflow: 'hidden',
                        boxShadow: '0 4px 15px rgba(0,0,0,0.06)',
                        transition: 'transform 0.3s, box-shadow 0.3s',
                        position: 'relative'
                    }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.transform = 'translateY(-6px)';
                            e.currentTarget.style.boxShadow = '0 12px 30px rgba(108,99,255,0.15)';
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.transform = 'translateY(0)';
                            e.currentTarget.style.boxShadow = '0 4px 15px rgba(0,0,0,0.06)';
                        }}>

                        {/* Remove Button */}
                        <button
                            onClick={() => removeFromWishlist(item._id)}
                            style={{
                                position: 'absolute',
                                top: '8px',
                                right: '8px',
                                backgroundColor: 'rgba(255,255,255,0.9)',
                                border: 'none',
                                borderRadius: '50%',
                                width: '32px',
                                height: '32px',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                zIndex: 2,
                                color: '#dc2626',
                                boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                            }}
                        >
                            <Trash2 size={16} />
                        </button>

                        <img
                            src={item.image || item.images?.[0] || `https://picsum.photos/seed/${item._id}/300/300`}
                            alt={item.name}
                            style={{
                                width: '100%',
                                height: '200px',
                                objectFit: 'cover'
                            }}
                        />

                        <div style={{ padding: '16px' }}>
                            <h4 style={{
                                fontSize: '14px',
                                fontWeight: '600',
                                marginBottom: '4px',
                                color: '#1a1a2e'
                            }}>
                                {item.name}
                            </h4>
                            <p style={{ fontSize: '12px', color: '#888', marginBottom: '8px' }}>
                                {item.category || 'General'}
                            </p>
                            <div style={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center'
                            }}>
                                <span style={{ fontSize: '18px', fontWeight: 'bold', color: '#1a1a2e' }}>
                                    ${(item.price || 0).toFixed(2)}
                                </span>
                                <button
                                    onClick={() => handleMoveToCart(item)}
                                    style={{
                                        backgroundColor: '#6c63ff',
                                        color: 'white',
                                        border: 'none',
                                        padding: '8px 16px',
                                        borderRadius: '25px',
                                        fontSize: '12px',
                                        fontWeight: '600',
                                        cursor: 'pointer',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '4px',
                                        transition: 'all 0.3s ease'
                                    }}
                                    onMouseEnter={(e) => {
                                        e.currentTarget.style.backgroundColor = '#5a52d5';
                                        e.currentTarget.style.transform = 'scale(1.05)';
                                    }}
                                    onMouseLeave={(e) => {
                                        e.currentTarget.style.backgroundColor = '#6c63ff';
                                        e.currentTarget.style.transform = 'scale(1)';
                                    }}
                                >
                                    <ShoppingBag size={14} /> Move to Cart
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default WishlistPage;