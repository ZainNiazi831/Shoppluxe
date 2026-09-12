import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Truck, RotateCcw, Shield } from 'lucide-react';
import '../index.css';

const Hero = () => {
    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
            className="hero-section"
            style={{
                background: 'linear-gradient(135deg, #2F4156 0%, #567C8D 100%)',
                borderRadius: '24px',
                padding: '50px 40px',
                marginBottom: '40px',
                position: 'relative',
                overflow: 'hidden',
                color: '#FFFFFF',
            }}
        >
            {/* Decorative Circles */}
            <div style={{
                position: 'absolute',
                top: '-100px',
                right: '-100px',
                width: '400px',
                height: '400px',
                borderRadius: '50%',
                background: 'rgba(86, 124, 141, 0.2)',
            }} />
            <div style={{
                position: 'absolute',
                bottom: '-150px',
                left: '-150px',
                width: '500px',
                height: '500px',
                borderRadius: '50%',
                background: 'rgba(47, 65, 86, 0.15)',
            }} />

            <div style={{ position: 'relative', zIndex: 1 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap' }}>
                    <div style={{ maxWidth: '600px', flex: 1 }}>
                        {/* ✅ Heading - Montserrat */}
                        <motion.h1
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.2, duration: 0.6 }}
                            className="hero-title"
                            style={{
                                fontFamily: 'Montserrat, sans-serif',
                                fontSize: '52px',
                                fontWeight: 900,
                                lineHeight: 1.1,
                                letterSpacing: '-0.03em',
                                marginBottom: '16px',
                                color: '#FFFFFF',
                            }}
                        >
                            Everything.
                            <br />
                            <span style={{ color: '#C8D9E6' }}>
                                For Everyone.
                            </span>
                        </motion.h1>

                        {/* ✅ Paragraph - Inter */}
                        <motion.p
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.4, duration: 0.6 }}
                            style={{
                                fontFamily: 'Inter, sans-serif',
                                fontSize: '16px',
                                fontWeight: 400,
                                opacity: 0.9,
                                marginBottom: '28px',
                                lineHeight: 1.6,
                                color: '#FFFFFF',
                                maxWidth: '500px',
                            }}
                        >
                            Best Quality, Best Prices! Discover a wide range of top-quality products handpicked just for you.
                        </motion.p>

                        {/* ✅ Button - Inter */}
                        <motion.div
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.6, duration: 0.6 }}
                        >
                            <button
                                style={{
                                    fontFamily: 'Inter, sans-serif',
                                    background: '#C8D9E6',
                                    color: '#2F4156',
                                    border: 'none',
                                    padding: '16px 32px',
                                    borderRadius: '50px',
                                    fontSize: '14px',
                                    fontWeight: 700,
                                    letterSpacing: '0.05em',
                                    cursor: 'pointer',
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    gap: '10px',
                                    transition: 'all 0.3s ease',
                                    boxShadow: '0 4px 20px rgba(47, 65, 86, 0.3)',
                                }}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.transform = 'scale(1.05)';
                                    e.currentTarget.style.background = '#FFFFFF';
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.transform = 'scale(1)';
                                    e.currentTarget.style.background = '#C8D9E6';
                                }}
                            >
                                SHOP NOW <ArrowRight size={18} />
                            </button>
                        </motion.div>
                    </div>

                    {/* Hero Images */}
                    <motion.div
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ delay: 0.3, duration: 0.6 }}
                        className="hero-images"
                        style={{
                            display: 'flex',
                            gap: '16px',
                            flexWrap: 'wrap',
                            marginTop: '16px',
                        }}
                    >
                        <img
                            src="https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=200&h=200&fit=crop"
                            alt="Shopping"
                            style={{
                                width: '120px',
                                height: '120px',
                                borderRadius: '50%',
                                objectFit: 'cover',
                                border: '4px solid rgba(255,255,255,0.2)',
                            }}
                        />
                        <img
                            src="https://images.unsplash.com/photo-1606923829579-0cb981a83e2e?w=200&h=200&fit=crop"
                            alt="Products"
                            style={{
                                width: '120px',
                                height: '120px',
                                borderRadius: '50%',
                                objectFit: 'cover',
                                border: '4px solid rgba(255,255,255,0.2)',
                            }}
                        />
                    </motion.div>
                </div>

                {/* ✅ Trust Badges - Inter */}
                <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.8, duration: 0.6 }}
                    style={{
                        fontFamily: 'Inter, sans-serif',
                        display: 'flex',
                        gap: '32px',
                        marginTop: '36px',
                        paddingTop: '24px',
                        borderTop: '1px solid rgba(255,255,255,0.1)',
                        flexWrap: 'wrap',
                        justifyContent: 'center'
                    }}
                >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', color: '#FFFFFF' }}>
                        <Truck size={18} color="#C8D9E6" />
                        <span style={{ opacity: 0.9, fontWeight: 500 }}>FREE SHIPPING on orders $50+</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', color: '#FFFFFF' }}>
                        <RotateCcw size={18} color="#C8D9E6" />
                        <span style={{ opacity: 0.9, fontWeight: 500 }}>30-day return policy</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', color: '#FFFFFF' }}>
                        <Shield size={18} color="#C8D9E6" />
                        <span style={{ opacity: 0.9, fontWeight: 500 }}>100% secure checkout</span>
                    </div>
                </motion.div>
            </div>
        </motion.div>
    );
};

export default Hero;