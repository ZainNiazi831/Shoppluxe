import React, { createContext, useState, useContext, useEffect, useRef } from 'react';
import { Heart, HeartOff } from 'lucide-react';
import toast from 'react-hot-toast';

const WishlistContext = createContext();

export const useWishlist = () => useContext(WishlistContext);

export const WishlistProvider = ({ children }) => {
    const [wishlistItems, setWishlistItems] = useState([]);
    const isFirstRender = useRef(true);
    const toastShown = useRef({});

    // Load wishlist from localStorage
    useEffect(() => {
        const saved = localStorage.getItem('wishlist');
        if (saved) {
            try {
                setWishlistItems(JSON.parse(saved));
            } catch (error) {
                setWishlistItems([]);
            }
        }
        isFirstRender.current = false;
    }, []);

    // Save wishlist to localStorage
    useEffect(() => {
        if (isFirstRender.current) return;
        localStorage.setItem('wishlist', JSON.stringify(wishlistItems));
    }, [wishlistItems]);

    // Add to wishlist
    const addToWishlist = (product) => {
        if (!product || !product._id) return;

        // ✅ Check if we've already shown toast for this product recently
        const toastKey = `add-${product._id}`;
        if (toastShown.current[toastKey]) {
            return;
        }

        const exists = wishlistItems.find(item => item._id === product._id);
        if (exists) {
            return;
        }

        // ✅ Show toast ONCE
        toastShown.current[toastKey] = true;
        setTimeout(() => {
            toastShown.current[toastKey] = false;
        }, 1000);

        toast.success(`${product.name} added to wishlist`, {
            icon: <Heart size={20} color="#EF4444" fill="#EF4444" />,
        });

        setWishlistItems(prev => [...prev, product]);
    };

    // Remove from wishlist
    const removeFromWishlist = (productId) => {
        const item = wishlistItems.find(p => p._id === productId);
        if (!item) return;

        // ✅ Check if we've already shown toast for this product recently
        const toastKey = `remove-${productId}`;
        if (toastShown.current[toastKey]) {
            return;
        }

        toastShown.current[toastKey] = true;
        setTimeout(() => {
            toastShown.current[toastKey] = false;
        }, 1000);

        toast.success(`${item.name} removed from wishlist`, {
            icon: <HeartOff size={20} color="#8A9BAB" />,
        });

        setWishlistItems(prev => prev.filter(item => item._id !== productId));
    };

    // Toggle wishlist
    const toggleWishlist = (product) => {
        if (!product || !product._id) return;

        const exists = wishlistItems.find(item => item._id === product._id);
        if (exists) {
            removeFromWishlist(product._id);
        } else {
            addToWishlist(product);
        }
    };

    // Check if in wishlist
    const isInWishlist = (productId) => {
        return wishlistItems.some(item => item._id === productId);
    };

    // Get wishlist count
    const getWishlistCount = () => {
        return wishlistItems.length;
    };

    return (
        <WishlistContext.Provider value={{
            wishlistItems,
            addToWishlist,
            removeFromWishlist,
            toggleWishlist,
            isInWishlist,
            getWishlistCount
        }}>
            {children}
        </WishlistContext.Provider>
    );
};