import React from 'react';
import { Link } from 'react-router-dom';
import { Mail, Phone, MapPin, Send } from 'lucide-react';
import myLogo2 from '../assets/Logo2.png';

const Footer = () => {
    const currentYear = new Date().getFullYear();

    const socialIcons = [
        {
            label: 'Facebook',
            href: '#',
            svg: (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                </svg>
            ),
        },
        {
            label: 'Twitter',
            href: '#',
            svg: (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" />
                </svg>
            ),
        },
        {
            label: 'Instagram',
            href: '#',
            svg: (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zm0 10.162a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
                </svg>
            ),
        },
        {
            label: 'YouTube',
            href: '#',
            svg: (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                </svg>
            ),
        },
    ];

    return (
        <footer style={{
            backgroundColor: '#2F4156',
            color: '#FFFFFF',
            fontFamily: 'Inter, sans-serif',
            marginTop: '60px',
        }}>

            {/* ============ NEWSLETTER SECTION ============ */}
            <div style={{
                backgroundColor: '#243447',
                padding: '48px 24px',
                borderBottom: '1px solid rgba(255,255,255,0.08)',
            }}>
                <div style={{
                    maxWidth: '1200px',
                    margin: '0 auto',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    gap: '32px',
                    flexWrap: 'wrap',
                }}>
                    <div style={{ flex: 1, minWidth: '280px' }}>
                        <h3 style={{
                            fontFamily: 'Montserrat, sans-serif',
                            fontSize: '24px',
                            fontWeight: 800,
                            marginBottom: '8px',
                            letterSpacing: '-0.02em',
                            color: '#FFFFFF',
                        }}>
                            📧 Subscribe to Our Newsletter
                        </h3>
                        <p style={{
                            fontSize: '14px',
                            color: 'rgba(255,255,255,0.7)',
                            margin: 0,
                            lineHeight: 1.6,
                        }}>
                            Get 10% off your first order + exclusive deals delivered to your inbox.
                        </p>
                    </div>

                    <form
                        onSubmit={(e) => { e.preventDefault(); alert('Subscribed!'); }}
                        style={{
                            display: 'flex',
                            gap: '8px',
                            flex: 1,
                            minWidth: '280px',
                            maxWidth: '450px',
                        }}
                    >
                        <input
                            type="email"
                            placeholder="Enter your email"
                            required
                            style={{
                                flex: 1,
                                padding: '14px 20px',
                                borderRadius: '50px',
                                border: 'none',
                                fontSize: '14px',
                                fontFamily: 'Inter, sans-serif',
                                outline: 'none',
                                minWidth: 0,
                            }}
                        />
                        <button
                            type="submit"
                            style={{
                                padding: '14px 28px',
                                backgroundColor: '#C8D9E6',
                                color: '#2F4156',
                                border: 'none',
                                borderRadius: '50px',
                                fontSize: '14px',
                                fontWeight: 700,
                                cursor: 'pointer',
                                fontFamily: 'Inter, sans-serif',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '8px',
                                transition: 'all 0.2s ease',
                                whiteSpace: 'nowrap',
                            }}
                            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#FFFFFF'}
                            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#C8D9E6'}
                        >
                            Subscribe <Send size={16} />
                        </button>
                    </form>
                </div>
            </div>

            {/* ============ MAIN FOOTER ============ */}
            <div className="footer-main" style={{
                maxWidth: '1200px',
                margin: '0 auto',
                padding: '56px 24px 32px',
            }}>

                <div className="footer-grid" style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                    gap: '40px',
                    marginBottom: '48px',
                    alignItems: 'start',
                }}>

                    {/* ============ BRAND COLUMN ============ */}
                    <div className="footer-brand-column" style={{ minWidth: '220px' }}>
                        {/* Logo */}
                        <div style={{
                            height: '18px',
                            display: 'flex',
                            alignItems: 'center',
                            marginBottom: '20px',
                            overflow: 'visible',
                        }}>
                            <Link
                                to="/"
                                style={{
                                    display: 'inline-block',
                                    lineHeight: 0,
                                }}
                            >
                                <img
                                    src={myLogo2}
                                    alt="SHOPPLUXE"
                                    style={{
                                        height: '100px',
                                        width: 'auto',
                                        maxWidth: '300px',
                                        objectFit: 'contain',
                                        display: 'block',
                                        marginTop: '-5px',
                                    }}
                                />
                            </Link>
                        </div>

                        {/* Contact Info */}
                        <div className="footer-contact" style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '13px', color: 'rgba(255,255,255,0.7)' }}>
                                <Mail size={16} color="#C8D9E6" />
                                support@shoppluxe.com
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '13px', color: 'rgba(255,255,255,0.7)' }}>
                                <Phone size={16} color="#C8D9E6" />
                                +92 316 485 6831
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '13px', color: 'rgba(255,255,255,0.7)' }}>
                                <MapPin size={16} color="#C8D9E6" />
                                Karachi, Pakistan
                            </div>
                        </div>

                        {/* Social Icons */}
                        <div className="footer-social" style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
                            {socialIcons.map(({ label, href, svg }) => (
                                <a
                                    key={label}
                                    href={href}
                                    aria-label={label}
                                    style={{
                                        width: '40px',
                                        height: '40px',
                                        borderRadius: '50%',
                                        backgroundColor: 'rgba(255,255,255,0.08)',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        transition: 'all 0.2s ease',
                                        color: '#C8D9E6',
                                    }}
                                    onMouseEnter={(e) => {
                                        e.currentTarget.style.backgroundColor = '#C8D9E6';
                                        e.currentTarget.style.color = '#2F4156';
                                        e.currentTarget.style.transform = 'translateY(-3px)';
                                    }}
                                    onMouseLeave={(e) => {
                                        e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.08)';
                                        e.currentTarget.style.color = '#C8D9E6';
                                        e.currentTarget.style.transform = 'translateY(0)';
                                    }}
                                >
                                    {svg}
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* ============ QUICK LINKS ============ */}
                    <div>
                        <h4 style={{
                            fontFamily: 'Montserrat, sans-serif',
                            fontSize: '14px',
                            fontWeight: 800,
                            marginBottom: '20px',
                            letterSpacing: '1px',
                            textTransform: 'uppercase',
                            color: '#FFFFFF',
                            lineHeight: 1.3,
                            marginTop: 0,
                        }}>
                            Quick Links
                        </h4>
                        <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '12px' }}>
                            {[
                                { label: 'Home', path: '/' },
                                { label: 'Shop', path: '/products' },
                                { label: 'Wishlist', path: '/wishlist' },
                                { label: 'Cart', path: '/cart' },
                            ].map((link) => (
                                <li key={link.label}>
                                    <Link
                                        to={link.path}
                                        style={{
                                            fontSize: '14px',
                                            color: 'rgba(255,255,255,0.7)',
                                            textDecoration: 'none',
                                            transition: 'all 0.2s ease',
                                            display: 'inline-block',
                                        }}
                                        onMouseEnter={(e) => {
                                            e.currentTarget.style.color = '#C8D9E6';
                                            e.currentTarget.style.transform = 'translateX(4px)';
                                        }}
                                        onMouseLeave={(e) => {
                                            e.currentTarget.style.color = 'rgba(255,255,255,0.7)';
                                            e.currentTarget.style.transform = 'translateX(0)';
                                        }}
                                    >
                                        {link.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* ============ CUSTOMER SERVICE ============ */}
                    <div>
                        <h4 style={{
                            fontFamily: 'Montserrat, sans-serif',
                            fontSize: '14px',
                            fontWeight: 800,
                            marginBottom: '20px',
                            letterSpacing: '1px',
                            textTransform: 'uppercase',
                            color: '#FFFFFF',
                            lineHeight: 1.3,
                            marginTop: 0,
                        }}>
                            Customer Service
                        </h4>
                        <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '12px' }}>
                            {[
                                'FAQs',
                                'Shipping Policy',
                                'Returns & Refunds',
                                'Privacy Policy',
                                'Terms & Conditions',
                            ].map((label) => (
                                <li key={label}>
                                    <a
                                        href="#"
                                        style={{
                                            fontSize: '14px',
                                            color: 'rgba(255,255,255,0.7)',
                                            textDecoration: 'none',
                                            transition: 'all 0.2s ease',
                                            display: 'inline-block',
                                        }}
                                        onMouseEnter={(e) => {
                                            e.currentTarget.style.color = '#C8D9E6';
                                            e.currentTarget.style.transform = 'translateX(4px)';
                                        }}
                                        onMouseLeave={(e) => {
                                            e.currentTarget.style.color = 'rgba(255,255,255,0.7)';
                                            e.currentTarget.style.transform = 'translateX(0)';
                                        }}
                                    >
                                        {label}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* ============ MY ACCOUNT ============ */}
                    <div>
                        <h4 style={{
                            fontFamily: 'Montserrat, sans-serif',
                            fontSize: '14px',
                            fontWeight: 800,
                            marginBottom: '20px',
                            letterSpacing: '1px',
                            textTransform: 'uppercase',
                            color: '#FFFFFF',
                            lineHeight: 1.3,
                            marginTop: 0,
                        }}>
                            My Account
                        </h4>
                        <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '12px' }}>
                            {[
                                { label: 'My Account', path: '/profile' },
                                { label: 'Order History', path: '/orders' },
                                { label: 'Wishlist', path: '/wishlist' },
                                { label: 'Login / Register', path: '/login' },
                            ].map((link) => (
                                <li key={link.label}>
                                    <Link
                                        to={link.path}
                                        style={{
                                            fontSize: '14px',
                                            color: 'rgba(255,255,255,0.7)',
                                            textDecoration: 'none',
                                            transition: 'all 0.2s ease',
                                            display: 'inline-block',
                                        }}
                                        onMouseEnter={(e) => {
                                            e.currentTarget.style.color = '#C8D9E6';
                                            e.currentTarget.style.transform = 'translateX(4px)';
                                        }}
                                        onMouseLeave={(e) => {
                                            e.currentTarget.style.color = 'rgba(255,255,255,0.7)';
                                            e.currentTarget.style.transform = 'translateX(0)';
                                        }}
                                    >
                                        {link.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                </div>

                {/* ============ BOTTOM BAR ============ */}
                <div style={{
                    paddingTop: '24px',
                    borderTop: '1px solid rgba(255,255,255,0.08)',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    flexWrap: 'wrap',
                    gap: '16px',
                }}>
                    <p style={{
                        fontSize: '13px',
                        color: 'rgba(255,255,255,0.6)',
                        margin: 0,
                        fontFamily: 'Inter, sans-serif',
                    }}>
                        © {currentYear} <span style={{ color: '#C8D9E6', fontWeight: 700 }}>SHOPPLUXE</span>. All Rights Reserved.
                    </p>

                    <div style={{ display: 'flex', gap: '24px', alignItems: 'center', flexWrap: 'wrap' }}>
                        <a href="#" style={{ fontSize: '13px', color: 'rgba(255,255,255,0.6)', textDecoration: 'none' }}>
                            Terms of Service
                        </a>
                        <span style={{ color: 'rgba(255,255,255,0.2)' }}>|</span>
                        <a href="#" style={{ fontSize: '13px', color: 'rgba(255,255,255,0.6)', textDecoration: 'none' }}>
                            Privacy Policy
                        </a>
                    </div>
                </div>
            </div>

            {/* ============ RESPONSIVE STYLES ============ */}
            <style>{`
        @media (max-width: 768px) {
          footer h3 {
            font-size: 20px !important;
          }
          footer form {
            flex-direction: column !important;
          }
          footer form button {
            justify-content: center !important;
          }

          /* ===== BRAND COLUMN CENTRE ===== */
          .footer-brand-column {
            display: flex !important;
            flex-direction: column !important;
            align-items: center !important;
            text-align: center !important;
            min-width: 100% !important;
          }
          .footer-brand-column > div:first-child {
            justify-content: center !important;
          }
          .footer-brand-column > div:first-child a {
            display: block !important;
          }
          .footer-brand-column img {
            margin: 0 auto !important;
            margin-top: -40px !important;
          }

          /* Contact info centre */
          .footer-contact {
            align-items: center !important;
            justify-content: center !important;
          }
          .footer-contact > div {
            justify-content: center !important;
            text-align: center !important;
          }

          /* Social icons centre */
          .footer-social {
            justify-content: center !important;
          }

          /* All headings centre */
          footer h4 {
            text-align: center !important;
          }

          /* All links centre */
          footer ul {
            align-items: center !important;
            text-align: center !important;
          }
          footer ul li {
            text-align: center !important;
            width: 100% !important;
          }
          footer ul li a {
            text-align: center !important;
          }

          /* Bottom bar centre */
          footer > div:last-child > div:last-child {
            justify-content: center !important;
            text-align: center !important;
          }
        }
      `}</style>
        </footer>
    );
};

export default Footer;