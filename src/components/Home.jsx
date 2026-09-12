import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
    Star,
    ArrowRight,
    Phone,
    Music,
    Home as HomeIcon,
    HardDrive,
    ShoppingBag,
    Flame,
} from 'lucide-react';
import { ProductService } from '../services/api';
import ProductCard from './ProductCard';
import Hero from './Hero';
import Footer from './Footer';
import '../index.css';

const Home = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    const categories = [
        {
            name: 'For Home',
            icon: <HomeIcon size={24} />,
            color: '#567C8D',
            image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=300&fit=crop'
        },
        {
            name: 'For Music',
            icon: <Music size={24} />,
            color: '#567C8D',
            image: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=400&h=300&fit=crop'
        },
        {
            name: 'For Phone',
            icon: <Phone size={24} />,
            color: '#567C8D',
            image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400&h=300&fit=crop'
        },
        {
            name: 'For Storage',
            icon: <HardDrive size={24} />,
            color: '#567C8D',
            image: 'https://images.unsplash.com/photo-1597852074816-d933c7d2b988?w=400&h=300&fit=crop'
        },
        {
            name: 'For Gaming',
            icon: <ShoppingBag size={24} />,
            color: '#2F4156',
            image: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=400&h=300&fit=crop'
        },
    ];

    const featuredProducts = [
        {
            _id: 'prod_1',
            name: 'Phone Holder Sakti',
            price: 29.90,
            originalPrice: 39.90,
            rating: 5.0,
            reviewCount: 128,
            image: 'https://images.unsplash.com/photo-1586953208448-b95a79798f07?w=400&h=400&fit=crop',
            badge: 'Hot',
            category: 'Accessories'
        },
        {
            _id: 'prod_2',
            name: 'Headsound Pro',
            price: 12.00,
            originalPrice: 19.99,
            rating: 5.0,
            reviewCount: 243,
            image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=400&fit=crop',
            badge: 'Sale',
            category: 'Audio'
        },
        {
            _id: 'prod_3',
            name: 'Aduku Cleaner',
            price: 29.90,
            rating: 4.4,
            reviewCount: 96,
            image: 'https://images.unsplash.com/photo-1527515637462-cff94eecc1ac?w=400&h=400&fit=crop',
            badge: 'Best',
            category: 'Home'
        },
        {
            _id: 'prod_4',
            name: 'CCTV Security',
            price: 50.00,
            originalPrice: 69.99,
            rating: 4.8,
            reviewCount: 75,
            image: 'https://images.unsplash.com/photo-1558002038-1055907df827?w=400&h=400&fit=crop',
            badge: 'New',
            category: 'Security'
        },
        {
            _id: 'prod_5',
            name: 'Stuffus Peker 32',
            price: 9.90,
            rating: 5.0,
            reviewCount: 58,
            image: 'https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?w=400&h=400&fit=crop',
            badge: 'Sale',
            category: 'Tools'
        },
        {
            _id: 'prod_6',
            name: 'Stuffus R175',
            price: 34.10,
            originalPrice: 49.99,
            rating: 4.8,
            reviewCount: 112,
            image: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=400&h=400&fit=crop',
            badge: 'Hot',
            category: 'Electronics'
        },
        {
            _id: 'prod_7',
            name: 'Gaming Chair Pro',
            price: 199.99,
            originalPrice: 249.99,
            rating: 4.9,
            reviewCount: 156,
            image: 'https://images.unsplash.com/photo-1598550476439-6847785fcea6?w=400&h=400&fit=crop',
            badge: 'New',
            category: 'Gaming'
        },
        {
            _id: 'prod_8',
            name: 'Smart LED Lamp',
            price: 39.99,
            originalPrice: 49.99,
            rating: 4.7,
            reviewCount: 89,
            image: 'https://images.unsplash.com/photo-1540932239986-30128078f3c5?w=400&h=400&fit=crop',
            badge: 'Sale',
            category: 'Home'
        }
    ];

    useEffect(() => {
        loadProducts();
    }, []);

    const loadProducts = async () => {
        setLoading(true);
        const result = await ProductService.getAll();
        if (result.success) {
            setProducts(result.products);
        }
        setLoading(false);
    };

    const recommendations = products.length > 0 ? products.slice(0, 4) : featuredProducts.slice(0, 4);

    if (loading) {
        return (
            <div style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
                <div className="products-grid">
                    {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                        <div key={i} style={{
                            backgroundColor: 'white',
                            borderRadius: '16px',
                            padding: '16px',
                            animation: 'pulse 1.5s ease-in-out infinite',
                            border: '1px solid var(--color-border)',
                        }}>
                            <div style={{ height: '200px', backgroundColor: 'var(--color-sky-blue)', borderRadius: '8px', marginBottom: '12px' }} />
                            <div style={{ height: '20px', backgroundColor: 'var(--color-sky-blue)', borderRadius: '8px', marginBottom: '8px', width: '70%' }} />
                            <div style={{ height: '16px', backgroundColor: 'var(--color-sky-blue)', borderRadius: '8px', width: '50%' }} />
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    return (
        <div style={{ backgroundColor: 'var(--color-bg-primary)', minHeight: '100vh' }}>

            <main style={{ maxWidth: '1200px', margin: '0 auto', padding: '24px' }}>

                <Hero />

                {/* ===== CATEGORIES ===== */}
                <div style={{ marginBottom: '48px' }}>
                    <h3 className="section-title">Browse by Category</h3>
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))',
                        gap: '16px'
                    }}>
                        {categories.map((cat, index) => (
                            <div key={index} style={{
                                backgroundColor: 'var(--color-white)',
                                borderRadius: 'var(--radius-lg)',
                                overflow: 'hidden',
                                cursor: 'pointer',
                                transition: 'all 0.3s ease',
                                boxShadow: '0 4px 15px rgba(47, 65, 86, 0.06)',
                                border: '1px solid var(--color-border)',
                            }}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.transform = 'translateY(-6px)';
                                    e.currentTarget.style.boxShadow = '0 12px 30px rgba(86, 124, 141, 0.15)';
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.transform = 'translateY(0)';
                                    e.currentTarget.style.boxShadow = '0 4px 15px rgba(47, 65, 86, 0.06)';
                                }}>
                                <img
                                    src={cat.image}
                                    alt={cat.name}
                                    style={{ width: '100%', height: '140px', objectFit: 'cover' }}
                                />
                                <div style={{ padding: '14px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                                    <div style={{
                                        width: '32px',
                                        height: '32px',
                                        borderRadius: 'var(--radius-md)',
                                        backgroundColor: cat.color,
                                        color: 'var(--color-white)',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center'
                                    }}>
                                        {cat.icon}
                                    </div>
                                    <span style={{ fontSize: '13px', fontWeight: '600', color: 'var(--color-text-primary)' }}>{cat.name}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* ===== NEW ARRIVAL | BEST SELLER TABS ===== */}
                <div style={{
                    display: 'flex',
                    gap: '24px',
                    marginBottom: '20px',
                    borderBottom: '2px solid var(--color-border)',
                    paddingBottom: '12px',
                    overflowX: 'auto',
                }}>
                    <span style={{
                        fontSize: '18px',
                        fontWeight: 'bold',
                        color: 'var(--color-teal)',
                        borderBottom: '3px solid var(--color-teal)',
                        paddingBottom: '10px',
                        marginBottom: '-14px',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        whiteSpace: 'nowrap',
                    }}>
                        <Flame size={20} color="#EF4444" />
                        New Arrival
                    </span>
                    <span style={{
                        fontSize: '18px',
                        fontWeight: '500',
                        color: 'var(--color-text-light)',
                        cursor: 'pointer',
                        paddingBottom: '10px',
                        marginBottom: '-14px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        whiteSpace: 'nowrap',
                    }}>
                        <Star size={20} fill="#F5A623" color="#F5A623" />
                        Best Seller
                    </span>
                </div>

                {/* ===== FEATURED PRODUCTS ===== */}
                <div className="products-grid" style={{ marginBottom: '48px' }}>
                    {featuredProducts.map((product) => (
                        <ProductCard key={product._id} product={product} />
                    ))}
                </div>

                {/* ===== RECOMMENDATIONS ===== */}
                <div style={{ marginBottom: '48px' }}>
                    <h3 className="section-title">💡 Explore our recommendations</h3>
                    <div className="products-grid">
                        {recommendations.map((product, index) => (
                            <ProductCard key={product._id || index} product={product} />
                        ))}
                    </div>
                </div>

            </main>

            {/* ===== FOOTER ===== */}
            <Footer />

        </div>
    );
};

export default Home;