import React, { useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { Heart, ShoppingCart, Star } from 'lucide-react';

const ProductCard = ({ product }) => {
    const { addToCart } = useCart();
    const { toggleWishlist, isInWishlist } = useWishlist();
    const navigate = useNavigate();

    const isProcessing = useRef(false);

    const handleCardClick = () => {
        if (product?._id) {
            navigate(`/products/${product._id}`);
        }
    };

    const handleAddToCart = (e) => {
        e.stopPropagation();
        e.preventDefault();

        if (isProcessing.current) return;
        isProcessing.current = true;

        addToCart(product);

        setTimeout(() => {
            isProcessing.current = false;
        }, 500);
    };

    const handleToggleWishlist = (e) => {
        e.stopPropagation();
        e.preventDefault();

        if (isProcessing.current) return;
        isProcessing.current = true;

        toggleWishlist(product);

        setTimeout(() => {
            isProcessing.current = false;
        }, 500);
    };

    const inWishlist = isInWishlist(product?._id);

    const imageUrl = product?.image ||
        product?.images?.[0] ||
        `https://picsum.photos/seed/${product?._id || 'default'}/300/300`;

    const getBadgeStyle = () => {
        const badge = product?.badge;
        if (badge === 'Sale') return { bg: '#567C8D', color: '#FFFFFF' };
        if (badge === 'Hot') return { bg: '#2F4156', color: '#FFFFFF' };
        if (badge === 'Best') return { bg: '#C8D9E6', color: '#2F4156' };
        if (badge === 'New') return { bg: '#567C8D', color: '#FFFFFF' };
        return { bg: '#567C8D', color: '#FFFFFF' };
    };

    const badgeStyle = getBadgeStyle();

    return (
        <div
            className="product-card"
            onClick={handleCardClick}
            style={{
                backgroundColor: 'var(--color-white)',
                borderRadius: 'var(--radius-lg)',
                overflow: 'hidden',
                boxShadow: '0 4px 15px rgba(47, 65, 86, 0.06)',
                transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
                position: 'relative',
                cursor: 'pointer',
                border: '1px solid var(--color-border-light)',
                display: 'flex',
                flexDirection: 'column',
                height: '100%',
            }}
            onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-10px)';
                e.currentTarget.style.boxShadow = '0 20px 40px rgba(86, 124, 141, 0.15)';
            }}
            onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 4px 15px rgba(47, 65, 86, 0.06)';
            }}
        >
            {/* WISHLIST HEART */}
            <button
                onClick={handleToggleWishlist}
                className="product-wishlist-btn"
                style={{
                    position: 'absolute',
                    top: '12px',
                    right: '12px',
                    backgroundColor: inWishlist ? '#f0f5f8' : 'rgba(255,255,255,0.9)',
                    border: 'none',
                    borderRadius: '50%',
                    width: '36px',
                    height: '36px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    zIndex: 3,
                    boxShadow: '0 2px 8px rgba(47, 65, 86, 0.1)',
                    transition: 'all 0.3s ease',
                    flexShrink: 0,
                }}
            >
                <Heart
                    size={18}
                    fill={inWishlist ? '#567C8D' : 'none'}
                    color={inWishlist ? '#567C8D' : '#8A9BAB'}
                />
            </button>

            {/* BADGE */}
            {product?.badge && (
                <span
                    className="product-badge"
                    style={{
                        position: 'absolute',
                        top: '12px',
                        left: '12px',
                        backgroundColor: badgeStyle.bg,
                        color: badgeStyle.color,
                        padding: '4px 12px',
                        borderRadius: 'var(--radius-full)',
                        fontSize: '10px',
                        fontWeight: '700',
                        textTransform: 'uppercase',
                        letterSpacing: '0.5px',
                        zIndex: 2,
                    }}
                >
                    {product.badge}
                </span>
            )}

            {/* IMAGE */}
            <div className="product-image-wrapper" style={{ overflow: 'hidden' }}>
                <img
                    src={imageUrl}
                    alt={product?.name || 'Product'}
                    className="product-image"
                    style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                        transition: 'transform 0.4s',
                    }}
                />
            </div>

            {/* INFO */}
            <div className="product-info" style={{ padding: '16px', display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
                <h4
                    className="product-title"
                    style={{
                        fontSize: '14px',
                        fontWeight: '600',
                        marginBottom: '4px',
                        color: 'var(--color-text-primary)',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                        minHeight: '36px',
                    }}
                >
                    {product?.name || 'Product Name'}
                </h4>

                <div className="product-category" style={{ fontSize: '12px', color: 'var(--color-text-light)', marginBottom: '8px' }}>
                    {product?.category || 'General'}
                </div>

                {product?.rating && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginBottom: '8px' }}>
                        <Star size={14} fill="#F5A623" color="#F5A623" />
                        <span style={{ fontSize: '13px', fontWeight: '600', color: 'var(--color-text-primary)' }}>
                            {product.rating}
                        </span>
                        <span style={{ fontSize: '12px', color: 'var(--color-text-light)' }}>
                            ({product.reviewCount || 0})
                        </span>
                    </div>
                )}

                <div
                    className="product-bottom"
                    style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        marginTop: 'auto',
                        gap: '8px',
                        flexWrap: 'wrap',
                    }}
                >
                    <div className="product-price-wrapper">
                        {product?.originalPrice && product.originalPrice > product.price ? (
                            <>
                                <span className="product-price" style={{ fontSize: '18px', fontWeight: 'bold', color: 'var(--color-text-primary)' }}>
                                    ${product.price.toFixed(2)}
                                </span>
                                <span className="product-original-price" style={{
                                    fontSize: '13px',
                                    color: 'var(--color-text-light)',
                                    textDecoration: 'line-through',
                                    marginLeft: '6px',
                                }}>
                                    ${product.originalPrice.toFixed(2)}
                                </span>
                            </>
                        ) : (
                            <span className="product-price" style={{ fontSize: '18px', fontWeight: 'bold', color: 'var(--color-text-primary)' }}>
                                ${(product?.price || 0).toFixed(2)}
                            </span>
                        )}
                    </div>

                    <button
                        onClick={handleAddToCart}
                        className="product-add-btn"
                        style={{
                            backgroundColor: 'var(--color-teal)',
                            color: 'var(--color-white)',
                            border: 'none',
                            padding: '8px 14px',
                            borderRadius: 'var(--radius-full)',
                            fontSize: '12px',
                            fontWeight: '600',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '6px',
                            transition: 'all 0.3s ease',
                            flexShrink: 0,
                        }}
                    >
                        <ShoppingCart size={14} />
                        Add
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ProductCard;