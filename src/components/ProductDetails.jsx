import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { ProductService } from '../services/api';
import {
    ArrowLeft,
    Star,
    ShoppingCart,
    Heart,
    Minus,
    Plus,
    Truck,
    ShieldCheck,
    RotateCcw,
    Package,
} from 'lucide-react';
import toast from 'react-hot-toast';
import ProductCard from './ProductCard';
import Reviews from './Reviews';

const ProductDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { addToCart } = useCart();
    const { toggleWishlist, isInWishlist } = useWishlist();

    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [quantity, setQuantity] = useState(1);
    const [selectedImage, setSelectedImage] = useState(0);
    const [relatedProducts, setRelatedProducts] = useState([]);

    // Featured (hardcoded) products — for prod_* IDs
    const featuredProducts = [
        { _id: 'prod_1', name: 'Phone Holder Sakti', price: 29.90, originalPrice: 39.90, rating: 5.0, reviewCount: 128, image: 'https://images.unsplash.com/photo-1586953208448-b95a79798f07?w=600&h=600&fit=crop', images: ['https://images.unsplash.com/photo-1586953208448-b95a79798f07?w=600&h=600&fit=crop'], badge: 'Hot', category: 'Accessories', description: 'High-quality phone holder with premium materials. Perfect for your desk or car. Adjustable grip and 360-degree rotation.', stockQuantity: 50, sku: 'ACC-001', status: 'active' },
        { _id: 'prod_2', name: 'Headsound Pro', price: 12.00, originalPrice: 19.99, rating: 5.0, reviewCount: 243, image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&h=600&fit=crop', images: ['https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&h=600&fit=crop'], badge: 'Sale', category: 'Audio', description: 'Premium sound quality headphones with active noise cancellation and long battery life.', stockQuantity: 100, sku: 'AUD-002', status: 'active' },
        { _id: 'prod_3', name: 'Aduku Cleaner', price: 29.90, rating: 4.4, reviewCount: 96, image: 'https://images.unsplash.com/photo-1527515637462-cff94eecc1ac?w=600&h=600&fit=crop', images: ['https://images.unsplash.com/photo-1527515637462-cff94eecc1ac?w=600&h=600&fit=crop'], badge: 'Best', category: 'Home', description: 'Powerful and efficient cleaner for all your home needs. Lightweight and easy to use.', stockQuantity: 75, sku: 'HM-003', status: 'active' },
        { _id: 'prod_4', name: 'CCTV Security', price: 50.00, originalPrice: 69.99, rating: 4.8, reviewCount: 75, image: 'https://images.unsplash.com/photo-1558002038-1055907df827?w=600&h=600&fit=crop', images: ['https://images.unsplash.com/photo-1558002038-1055907df827?w=600&h=600&fit=crop'], badge: 'New', category: 'Security', description: 'Advanced CCTV security system with HD recording and night vision.', stockQuantity: 30, sku: 'SEC-004', status: 'active' },
        { _id: 'prod_5', name: 'Stuffus Peker 32', price: 9.90, rating: 5.0, reviewCount: 58, image: 'https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?w=600&h=600&fit=crop', images: ['https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?w=600&h=600&fit=crop'], badge: 'Sale', category: 'Tools', description: 'Compact and versatile tool for everyday use. Durable construction.', stockQuantity: 200, sku: 'TL-005', status: 'active' },
        { _id: 'prod_6', name: 'Stuffus R175', price: 34.10, originalPrice: 49.99, rating: 4.8, reviewCount: 112, image: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=600&h=600&fit=crop', images: ['https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=600&h=600&fit=crop'], badge: 'Hot', category: 'Electronics', description: 'High-performance electronic device with modern features and sleek design.', stockQuantity: 45, sku: 'EL-006', status: 'active' },
        { _id: 'prod_7', name: 'Gaming Chair Pro', price: 199.99, originalPrice: 249.99, rating: 4.9, reviewCount: 156, image: 'https://images.unsplash.com/photo-1598550476439-6847785fcea6?w=600&h=600&fit=crop', images: ['https://images.unsplash.com/photo-1598550476439-6847785fcea6?w=600&h=600&fit=crop'], badge: 'New', category: 'Gaming', description: 'Ergonomic gaming chair with lumbar support and RGB lighting.', stockQuantity: 20, sku: 'GM-007', status: 'active' },
        { _id: 'prod_8', name: 'Smart LED Lamp', price: 39.99, originalPrice: 49.99, rating: 4.7, reviewCount: 89, image: 'https://images.unsplash.com/photo-1540932239986-30128078f3c5?w=600&h=600&fit=crop', images: ['https://images.unsplash.com/photo-1540932239986-30128078f3c5?w=600&h=600&fit=crop'], badge: 'Sale', category: 'Home', description: 'Smart LED lamp with app control and millions of colors.', stockQuantity: 60, sku: 'HM-008', status: 'active' }
    ];

    useEffect(() => {
        loadProduct();
    }, [id]);

    const loadProduct = async () => {
        setLoading(true);
        setError(null);

        try {
            if (id && id.startsWith('prod_')) {
                const foundProduct = featuredProducts.find(p => p._id === id);
                if (foundProduct) {
                    setProduct(foundProduct);
                    setSelectedImage(0);
                    setQuantity(1);
                    const related = featuredProducts
                        .filter(p => p.category === foundProduct.category && p._id !== id)
                        .slice(0, 4);
                    setRelatedProducts(related);
                    setLoading(false);
                    return;
                } else {
                    setError('Product not found');
                    setLoading(false);
                    return;
                }
            }

            const result = await ProductService.getById(id);
            if (result.success) {
                setProduct(result.product);
                setSelectedImage(0);
                setQuantity(1);
                loadRelatedProducts(result.product.category, result.product._id);
            } else {
                setError(result.error || 'Product not found');
            }
        } catch (err) {
            console.error('Error loading product:', err);
            setError('Failed to load product');
        }
        setLoading(false);
    };

    const loadRelatedProducts = async (category, currentId) => {
        try {
            const result = await ProductService.getAll({ category });
            if (result.success) {
                const related = result.products
                    .filter(p => p._id !== currentId)
                    .slice(0, 4);
                setRelatedProducts(related);
            }
        } catch (err) {
            console.error('Error loading related products:', err);
        }
    };

    const handleIncrement = () => {
        if (product && quantity < (product.stockQuantity || 10)) {
            setQuantity(prev => prev + 1);
        } else {
            toast.error('Maximum stock reached');
        }
    };

    const handleDecrement = () => {
        if (quantity > 1) {
            setQuantity(prev => prev - 1);
        }
    };

    const handleAddToCart = () => {
        if (!product) return;
        if (product.stockQuantity <= 0) {
            toast.error('Product is out of stock');
            return;
        }
        addToCart(product, quantity);
    };

    const handleToggleWishlist = () => {
        if (product) {
            toggleWishlist(product);
        }
    };

    if (loading) {
        return (
            <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '40px 24px' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '40px' }}>
                    <div style={{ height: '500px', backgroundColor: 'var(--color-sky-blue)', borderRadius: 'var(--radius-lg)', animation: 'pulse 1.5s ease-in-out infinite' }} />
                    <div>
                        <div style={{ height: '40px', backgroundColor: 'var(--color-sky-blue)', borderRadius: '8px', marginBottom: '16px', width: '70%' }} />
                        <div style={{ height: '24px', backgroundColor: 'var(--color-sky-blue)', borderRadius: '8px', marginBottom: '16px', width: '40%' }} />
                        <div style={{ height: '80px', backgroundColor: 'var(--color-sky-blue)', borderRadius: '8px' }} />
                    </div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div style={{ maxWidth: '600px', margin: '80px auto', padding: '40px', textAlign: 'center' }}>
                <h2 style={{ fontSize: '24px', color: 'var(--color-text-primary)', marginBottom: '16px' }}>
                    ❌ {error}
                </h2>
                <button
                    onClick={() => navigate('/products')}
                    style={{ padding: '12px 28px', background: 'var(--color-teal)', color: 'white', border: 'none', borderRadius: 'var(--radius-full)', fontWeight: '600', cursor: 'pointer' }}
                >
                    Back to Products
                </button>
            </div>
        );
    }

    if (!product) return null;

    const inWishlist = isInWishlist(product._id);
    const inStock = product.stockQuantity > 0;
    const images = product.images && product.images.length > 0
        ? product.images
        : ['https://picsum.photos/seed/' + product._id + '/600/600'];

    return (
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '24px', backgroundColor: 'var(--color-bg-primary)' }}>

            {/* BACK BUTTON */}
            <Link to="/products" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', color: 'var(--color-teal)', textDecoration: 'none', fontSize: '14px', fontWeight: '500', marginBottom: '24px' }}>
                <ArrowLeft size={18} />
                Back to Products
            </Link>

            {/* PRODUCT DETAILS GRID */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '40px', marginBottom: '60px', backgroundColor: 'white', borderRadius: 'var(--radius-xl)', padding: '32px', boxShadow: '0 4px 15px rgba(47, 65, 86, 0.06)' }}>

                {/* LEFT: IMAGE GALLERY */}
                <div>
                    <div style={{ width: '100%', height: '500px', backgroundColor: 'var(--color-bg-primary)', borderRadius: 'var(--radius-lg)', overflow: 'hidden', marginBottom: '16px' }}>
                        <img src={images[selectedImage]} alt={product.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    </div>

                    {images.length > 1 && (
                        <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
                            {images.map((img, index) => (
                                <div key={index} onClick={() => setSelectedImage(index)} style={{ width: '80px', height: '80px', borderRadius: 'var(--radius-md)', overflow: 'hidden', cursor: 'pointer', border: selectedImage === index ? '3px solid var(--color-teal)' : '2px solid var(--color-border)' }}>
                                    <img src={img} alt={`View ${index + 1}`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* RIGHT: PRODUCT INFO */}
                <div>
                    <div style={{ display: 'inline-block', padding: '4px 12px', backgroundColor: 'var(--color-sky-blue)', color: 'var(--color-navy)', borderRadius: 'var(--radius-full)', fontSize: '12px', fontWeight: '600', marginBottom: '12px' }}>
                        {product.category}
                    </div>

                    <h1 style={{ fontSize: '32px', fontWeight: '800', color: 'var(--color-text-primary)', marginBottom: '12px', lineHeight: 1.2 }}>
                        {product.name}
                    </h1>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
                        <div style={{ display: 'flex', gap: '2px' }}>
                            {[1, 2, 3, 4, 5].map((star) => (
                                <Star key={star} size={18} fill={star <= (product.rating || 0) ? '#F5A623' : 'none'} color="#F5A623" />
                            ))}
                        </div>
                        <span style={{ fontSize: '14px', fontWeight: '600', color: 'var(--color-text-primary)' }}>
                            {product.rating || 0}
                        </span>
                        <span style={{ fontSize: '14px', color: 'var(--color-text-light)' }}>
                            ({product.reviewCount || 0} reviews)
                        </span>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px', paddingBottom: '20px', borderBottom: '1px solid var(--color-border)', flexWrap: 'wrap' }}>
                        <span style={{ fontSize: '36px', fontWeight: '800', color: 'var(--color-teal)' }}>
                            ${(product.price || 0).toFixed(2)}
                        </span>

                        {product.originalPrice && product.originalPrice > product.price && (
                            <>
                                <span style={{ fontSize: '20px', color: 'var(--color-text-light)', textDecoration: 'line-through' }}>
                                    ${product.originalPrice.toFixed(2)}
                                </span>
                                <span style={{ padding: '4px 10px', backgroundColor: '#FFE5E5', color: '#DC2626', borderRadius: 'var(--radius-full)', fontSize: '12px', fontWeight: '700' }}>
                                    Save {Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}%
                                </span>
                            </>
                        )}
                    </div>

                    <div style={{ marginBottom: '20px' }}>
                        {inStock ? (
                            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '8px 16px', backgroundColor: '#E8F5E9', color: '#2E7D32', borderRadius: 'var(--radius-full)', fontSize: '14px', fontWeight: '600' }}>
                                <Package size={16} />
                                In Stock ({product.stockQuantity} units available)
                            </div>
                        ) : (
                            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '8px 16px', backgroundColor: '#FFEBEE', color: '#C62828', borderRadius: 'var(--radius-full)', fontSize: '14px', fontWeight: '600' }}>
                                ❌ Out of Stock
                            </div>
                        )}
                    </div>

                    <div style={{ marginBottom: '24px' }}>
                        <h3 style={{ fontSize: '16px', fontWeight: '700', color: 'var(--color-text-primary)', marginBottom: '8px' }}>
                            📝 Description
                        </h3>
                        <p style={{ fontSize: '14px', color: 'var(--color-text-secondary)', lineHeight: '1.7' }}>
                            {product.description || 'No description available.'}
                        </p>
                    </div>

                    <div style={{ marginBottom: '24px', padding: '16px', backgroundColor: 'var(--color-bg-primary)', borderRadius: 'var(--radius-md)' }}>
                        <h3 style={{ fontSize: '16px', fontWeight: '700', color: 'var(--color-text-primary)', marginBottom: '12px' }}>
                            📋 Product Details
                        </h3>
                        <div style={{ display: 'grid', gap: '8px' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px' }}>
                                <span style={{ color: 'var(--color-text-light)' }}>SKU:</span>
                                <span style={{ fontWeight: '600', color: 'var(--color-text-primary)' }}>{product.sku || 'N/A'}</span>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px' }}>
                                <span style={{ color: 'var(--color-text-light)' }}>Category:</span>
                                <span style={{ fontWeight: '600', color: 'var(--color-text-primary)' }}>{product.category}</span>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px' }}>
                                <span style={{ color: 'var(--color-text-light)' }}>Stock:</span>
                                <span style={{ fontWeight: '600', color: 'var(--color-text-primary)' }}>{product.stockQuantity || 0} units</span>
                            </div>
                        </div>
                    </div>

                    <div style={{ marginBottom: '24px' }}>
                        <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', color: 'var(--color-text-primary)', marginBottom: '8px' }}>
                            Quantity
                        </label>
                        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '12px', border: '2px solid var(--color-border)', borderRadius: 'var(--radius-full)', padding: '4px' }}>
                            <button onClick={handleDecrement} disabled={quantity <= 1} style={{ width: '36px', height: '36px', borderRadius: '50%', border: 'none', backgroundColor: quantity <= 1 ? 'var(--color-border)' : 'var(--color-sky-blue)', color: 'var(--color-navy)', cursor: quantity <= 1 ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <Minus size={18} />
                            </button>
                            <span style={{ fontSize: '18px', fontWeight: '700', minWidth: '40px', textAlign: 'center', color: 'var(--color-text-primary)' }}>
                                {quantity}
                            </span>
                            <button onClick={handleIncrement} disabled={quantity >= (product.stockQuantity || 10)} style={{ width: '36px', height: '36px', borderRadius: '50%', border: 'none', backgroundColor: 'var(--color-sky-blue)', color: 'var(--color-navy)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <Plus size={18} />
                            </button>
                        </div>
                    </div>

                    <div style={{ display: 'flex', gap: '12px', marginBottom: '24px' }}>
                        <button onClick={handleAddToCart} disabled={!inStock} style={{ flex: 1, padding: '16px 32px', backgroundColor: inStock ? 'var(--color-teal)' : 'var(--color-border)', color: 'white', border: 'none', borderRadius: 'var(--radius-full)', fontSize: '16px', fontWeight: '700', cursor: inStock ? 'pointer' : 'not-allowed', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', transition: 'all 0.3s ease', boxShadow: inStock ? '0 4px 15px rgba(86, 124, 141, 0.3)' : 'none' }}
                            onMouseEnter={(e) => { if (inStock) { e.currentTarget.style.backgroundColor = 'var(--color-navy)'; e.currentTarget.style.transform = 'translateY(-2px)'; } }}
                            onMouseLeave={(e) => { if (inStock) { e.currentTarget.style.backgroundColor = 'var(--color-teal)'; e.currentTarget.style.transform = 'translateY(0)'; } }}
                        >
                            <ShoppingCart size={20} />
                            {inStock ? 'Add to Cart' : 'Out of Stock'}
                        </button>

                        <button onClick={handleToggleWishlist} style={{ width: '56px', height: '56px', borderRadius: '50%', border: '2px solid var(--color-border)', backgroundColor: inWishlist ? '#FFE5E5' : 'white', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.3s ease' }}
                            onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
                            onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
                        >
                            <Heart size={24} fill={inWishlist ? '#DC2626' : 'none'} color={inWishlist ? '#DC2626' : 'var(--color-teal)'} />
                        </button>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px', padding: '16px', backgroundColor: 'var(--color-bg-primary)', borderRadius: 'var(--radius-md)' }}>
                        <div style={{ textAlign: 'center' }}>
                            <Truck size={20} color="var(--color-teal)" style={{ marginBottom: '4px' }} />
                            <div style={{ fontSize: '11px', color: 'var(--color-text-secondary)', fontWeight: '600' }}>
                                Free Shipping
                            </div>
                        </div>
                        <div style={{ textAlign: 'center' }}>
                            <RotateCcw size={20} color="var(--color-teal)" style={{ marginBottom: '4px' }} />
                            <div style={{ fontSize: '11px', color: 'var(--color-text-secondary)', fontWeight: '600' }}>
                                30-Day Returns
                            </div>
                        </div>
                        <div style={{ textAlign: 'center' }}>
                            <ShieldCheck size={20} color="var(--color-teal)" style={{ marginBottom: '4px' }} />
                            <div style={{ fontSize: '11px', color: 'var(--color-text-secondary)', fontWeight: '600' }}>
                                Secure Payment
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* REVIEWS */}
            <Reviews
                productId={product._id}
                product={product}
                onReviewAdded={() => {
                    loadProduct();
                }}
            />

            {/* RELATED PRODUCTS */}
            {relatedProducts.length > 0 && (
                <div style={{ marginTop: '60px' }}>
                    <h2 className="section-title" style={{ marginBottom: '24px' }}>
                        🔄 Related Products
                    </h2>
                    <div className="products-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px' }}>
                        {relatedProducts.map((prod) => (
                            <ProductCard key={prod._id} product={prod} />
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default ProductDetails;  