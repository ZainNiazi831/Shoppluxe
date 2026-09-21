import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import {
    ShoppingCart, Heart, CircleUser, Search, X,
    LogOut, ChevronDown, Crown, LogIn, UserPlus, Menu,
    Home, ShoppingBag, User, Package
} from 'lucide-react';
import myLogo from '../assets/Logo.png';

const Navbar = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const { user, logout, isAuthenticated } = useAuth();
    const { getItemCount } = useCart();
    const { getWishlistCount } = useWishlist();
    const navigate = useNavigate();
    const profileRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (profileRef.current && !profileRef.current.contains(event.target)) {
                setIsProfileOpen(false);
            }
        };
        if (isProfileOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [isProfileOpen]);

    const handleSearch = (e) => {
        e.preventDefault();
        if (searchTerm.trim()) {
            navigate(`/products?search=${searchTerm}`);
            setSearchTerm('');
            setIsMobileMenuOpen(false);
        }
    };

    const closeProfileDropdown = () => {
        setIsProfileOpen(false);
    };

    return (
        <>
            <style>{`
        .navbar {
          position: sticky;
          top: 0;
          z-index: 9999;
          background: white;
          padding: 10px 24px;
          box-shadow: 0 2px 20px rgba(47, 65, 86, 0.05);
        }
        .navbar-inner {
          max-width: 1200px;
          margin: 0 auto;
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 20px;
        }
        .navbar-logo img { height: 60px; }
        .navbar-search {
          flex: 1;
          max-width: 450px;
          display: flex;
          align-items: center;
          background: var(--color-sky-blue, #C8D9E6);
          border-radius: 50px;
          padding: 10px 20px;
          gap: 10px;
        }
        .navbar-search input {
          border: none;
          background: transparent;
          outline: none;
          width: 100%;
          font-size: 14px;
        }
        .navbar-icons {
          display: flex;
          align-items: center;
          gap: 10px;
        }
        .nav-icon-btn {
          position: relative;
          padding: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .nav-badge {
          position: absolute;
          top: 0;
          right: 0;
          background: var(--color-teal, #567C8D);
          color: white;
          border-radius: 50%;
          padding: 2px 7px;
          font-size: 10px;
          font-weight: 600;
        }
        .nav-avatar {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          background: var(--color-teal, #567C8D);
          color: white;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: bold;
        }
        .dropdown-item {
          padding: 10px 16px;
          display: flex;
          gap: 10px;
          align-items: center;
          cursor: pointer;
          border-radius: 6px;
          transition: background 0.2s ease;
          text-decoration: none;
          color: inherit;
          font-size: 14px;
        }
        .dropdown-item:hover {
          background: #f5f5f5;
        }
        .mobile-menu-btn {
          display: none;
          background: transparent;
          border: none;
          cursor: pointer;
          padding: 8px;
        }
        .mobile-menu {
          display: none;
          flex-direction: column;
          gap: 4px;
          padding: 16px 0;
          border-top: 1px solid #eee;
          margin-top: 10px;
        }
        .mobile-menu.open { display: flex; }
        .mobile-menu a, .mobile-menu button {
          display: flex;
          align-items: center;
          gap: 14px;
          padding: 14px 16px;
          border-radius: 12px;
          text-decoration: none;
          color: var(--color-navy, #2F4156);
          font-weight: 500;
          background: transparent;
          border: none;
          cursor: pointer;
          width: 100%;
          text-align: left;
          font-size: 15px;
          transition: background 0.2s ease;
        }
        .mobile-menu a:hover, .mobile-menu button:hover {
          background: #F5EFEB;
        }
        .mobile-menu a svg, .mobile-menu button svg {
          flex-shrink: 0;
          color: var(--color-teal, #567C8D);
        }
        @media (max-width: 768px) {
          .navbar { padding: 10px 16px; }
          .navbar-logo img { height: 45px; }
          .navbar-search { display: none; }
          .navbar-icons { display: none; }
          .mobile-menu-btn { display: flex; }
        }
      `}</style>

            <nav className="navbar">
                <div className="navbar-inner">

                    {/* LOGO */}
                    <Link to="/" className="navbar-logo">
                        <img src={myLogo} alt="SHOPPLUXE" />
                    </Link>

                    {/* DESKTOP SEARCH */}
                    <form onSubmit={handleSearch} className="navbar-search">
                        <Search size={20} color="var(--color-teal)" />
                        <input
                            type="text"
                            placeholder="Search for products..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </form>

                    {/* DESKTOP ICONS */}
                    <div className="navbar-icons">
                        {/* ✅ Products Link */}
                        <Link
                            to="/products"
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '6px',
                                padding: '8px 16px',
                                borderRadius: '50px',
                                textDecoration: 'none',
                                color: 'var(--color-navy)',
                                fontWeight: 600,
                                fontSize: '14px',
                                transition: 'all 0.2s ease',
                            }}
                            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--color-sky-blue)'}
                            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                        >
                            <ShoppingBag size={18} />
                            Products
                        </Link>

                        <Link to="/wishlist" className="nav-icon-btn">
                            <Heart size={24} color="var(--color-teal)" />
                            {getWishlistCount() > 0 && (
                                <span className="nav-badge">{getWishlistCount()}</span>
                            )}
                        </Link>

                        <Link to="/cart" className="nav-icon-btn">
                            <ShoppingCart size={24} color="var(--color-teal)" />
                            {getItemCount() > 0 && (
                                <span className="nav-badge">{getItemCount()}</span>
                            )}
                        </Link>

                        {isAuthenticated ? (
                            <div ref={profileRef} style={{ position: 'relative' }}>
                                <button
                                    onClick={() => setIsProfileOpen(!isProfileOpen)}
                                    style={{ background: 'transparent', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}
                                >
                                    <div className="nav-avatar">
                                        {user?.name?.charAt(0).toUpperCase()}
                                    </div>
                                    <ChevronDown size={16} />
                                </button>

                                {isProfileOpen && (
                                    <div style={{
                                        position: 'absolute', top: '110%', right: 0, background: 'white',
                                        borderRadius: '8px', padding: '8px',
                                        boxShadow: '0 20px 60px rgba(0,0,0,0.15)', minWidth: '220px', zIndex: 10000
                                    }}>
                                        <div style={{ padding: '12px 16px', borderBottom: '1px solid #eee' }}>
                                            <p style={{ fontWeight: 600, margin: 0 }}>{user?.name}</p>
                                            <p style={{ fontSize: '12px', color: 'gray', margin: 0 }}>{user?.email}</p>
                                        </div>

                                        <Link to="/profile" className="dropdown-item" onClick={closeProfileDropdown}>
                                            <CircleUser size={18} /> My Profile
                                        </Link>

                                        <Link to="/orders" className="dropdown-item" onClick={closeProfileDropdown}>
                                            <Package size={18} /> My Orders
                                        </Link>

                                        {user?.role === 'admin' && (
                                            <Link to="/admin" className="dropdown-item" onClick={closeProfileDropdown}>
                                                <Crown size={18} color="#F5A623" /> Admin Dashboard
                                            </Link>
                                        )}

                                        <div
                                            className="dropdown-item"
                                            onClick={() => { closeProfileDropdown(); logout(); }}
                                            style={{ color: 'red' }}
                                        >
                                            <LogOut size={18} /> Logout
                                        </div>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <div style={{ display: 'flex', gap: '8px' }}>
                                <Link to="/login">
                                    <button style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '8px 16px', borderRadius: '50px', border: '1px solid var(--color-teal)', background: 'transparent', cursor: 'pointer' }}>
                                        <LogIn size={16} /> Login
                                    </button>
                                </Link>
                                <Link to="/register">
                                    <button style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '8px 16px', borderRadius: '50px', border: 'none', background: 'var(--color-teal)', color: 'white', cursor: 'pointer' }}>
                                        <UserPlus size={16} /> Register
                                    </button>
                                </Link>
                            </div>
                        )}
                    </div>

                    {/* MOBILE MENU BUTTON */}
                    <button
                        className="mobile-menu-btn"
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                    >
                        {isMobileMenuOpen ? <X size={28} color="var(--color-teal)" /> : <Menu size={28} color="var(--color-teal)" />}
                    </button>
                </div>

                {/* MOBILE MENU PANEL */}
                <div className={`mobile-menu ${isMobileMenuOpen ? 'open' : ''}`}>
                    <form onSubmit={handleSearch} style={{
                        display: 'flex', alignItems: 'center',
                        background: 'var(--color-sky-blue)', borderRadius: '50px',
                        padding: '10px 20px', gap: '10px', marginBottom: '8px'
                    }}>
                        <Search size={18} color="var(--color-teal)" />
                        <input
                            type="text"
                            placeholder="Search products..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            style={{ border: 'none', background: 'transparent', outline: 'none', width: '100%' }}
                        />
                    </form>

                    <Link to="/" onClick={() => setIsMobileMenuOpen(false)}>
                        <Home size={20} /> Home
                    </Link>
                    <Link to="/products" onClick={() => setIsMobileMenuOpen(false)}>
                        <ShoppingBag size={20} /> Products
                    </Link>
                    <Link to="/wishlist" onClick={() => setIsMobileMenuOpen(false)}>
                        <Heart size={20} /> Wishlist ({getWishlistCount()})
                    </Link>
                    <Link to="/cart" onClick={() => setIsMobileMenuOpen(false)}>
                        <ShoppingCart size={20} /> Cart ({getItemCount()})
                    </Link>

                    {isAuthenticated ? (
                        <>
                            <Link to="/profile" onClick={() => setIsMobileMenuOpen(false)}>
                                <User size={20} /> My Profile
                            </Link>
                            <Link to="/orders" onClick={() => setIsMobileMenuOpen(false)}>
                                <Package size={20} /> My Orders
                            </Link>
                            {user?.role === 'admin' && (
                                <Link to="/admin" onClick={() => setIsMobileMenuOpen(false)}>
                                    <Crown size={20} /> Admin Dashboard
                                </Link>
                            )}
                            <button onClick={() => { logout(); setIsMobileMenuOpen(false); }} style={{ color: '#DC2626' }}>
                                <LogOut size={20} color="#DC2626" /> Logout
                            </button>
                        </>
                    ) : (
                        <>
                            <Link to="/login" onClick={() => setIsMobileMenuOpen(false)}>
                                <LogIn size={20} /> Login
                            </Link>
                            <Link to="/register" onClick={() => setIsMobileMenuOpen(false)}>
                                <UserPlus size={20} /> Register
                            </Link>
                        </>
                    )}
                </div>
            </nav>
        </>
    );
};

export default Navbar;