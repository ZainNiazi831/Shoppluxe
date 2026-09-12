import React, { createContext, useState, useContext, useEffect } from 'react';
import { ShoppingCart, Trash2, CheckCircle, XCircle } from 'lucide-react';
import { validateCoupon, calculateDiscount } from '../data/coupons';
import toast from 'react-hot-toast';

const CartContext = createContext();

export const useCart = () => {
    const context = useContext(CartContext);
    if (!context) {
        throw new Error('useCart must be used within a CartProvider');
    }
    return context;
};

export const CartProvider = ({ children }) => {
    const [cartItems, setCartItems] = useState([]);
    const [appliedCoupon, setAppliedCoupon] = useState(null);
    const [cartTotal, setCartTotal] = useState({
        subtotal: 0,
        discount: 0,
        shipping: 0,
        total: 0,
    });

    // Load cart from localStorage
    useEffect(() => {
        const savedCart = localStorage.getItem('cart');
        const savedCoupon = localStorage.getItem('appliedCoupon');
        if (savedCart) {
            try {
                setCartItems(JSON.parse(savedCart));
            } catch (error) {
                setCartItems([]);
            }
        }
        if (savedCoupon) {
            try {
                setAppliedCoupon(JSON.parse(savedCoupon));
            } catch (error) {
                setAppliedCoupon(null);
            }
        }
    }, []);

    // Save cart and coupon to localStorage
    useEffect(() => {
        localStorage.setItem('cart', JSON.stringify(cartItems));
        if (appliedCoupon) {
            localStorage.setItem('appliedCoupon', JSON.stringify(appliedCoupon));
        } else {
            localStorage.removeItem('appliedCoupon');
        }
        calculateTotals();
    }, [cartItems, appliedCoupon]);

    const calculateTotals = () => {
        const subtotal = cartItems.reduce(
            (sum, item) => sum + (item.price || 0) * (item.quantity || 1),
            0
        );

        // Calculate discount
        let discount = 0;
        if (appliedCoupon) {
            discount = calculateDiscount(appliedCoupon, subtotal);
        }

        // Calculate shipping
        let shipping = subtotal > 100 ? 0 : 10;
        if (appliedCoupon && appliedCoupon.type === 'freeShipping') {
            shipping = 0;
        }

        const total = subtotal - discount + shipping;

        setCartTotal({
            subtotal,
            discount,
            shipping,
            total: Math.max(0, total),
        });
    };

    // Add to cart
    const addToCart = (product, quantity = 1) => {
        if (!product || !product._id) return;

        setCartItems((prevItems) => {
            const existingItem = prevItems.find((item) => item._id === product._id);

            if (existingItem) {
                return prevItems.map((item) =>
                    item._id === product._id
                        ? { ...item, quantity: (item.quantity || 0) + quantity }
                        : item
                );
            } else {
                return [...prevItems, { ...product, quantity }];
            }
        });

        toast.success(`${product.name} added to cart`, {
            icon: <ShoppingCart size={20} color="#10B981" />,
        });
    };

    // Remove from cart
    const removeFromCart = (productId) => {
        setCartItems((prevItems) => prevItems.filter((item) => item._id !== productId));
        toast.success('Item removed from cart', {
            icon: <Trash2 size={20} color="#EF4444" />,
        });
    };

    // Update quantity
    const updateQuantity = (productId, quantity) => {
        if (quantity < 1) {
            removeFromCart(productId);
            return;
        }
        setCartItems((prevItems) =>
            prevItems.map((item) =>
                item._id === productId ? { ...item, quantity } : item
            )
        );
    };

    // Clear cart
    const clearCart = () => {
        setCartItems([]);
        setAppliedCoupon(null);
        toast.success('Cart cleared', {
            icon: <CheckCircle size={20} color="#10B981" />,
        });
    };

    // ✅ Apply coupon
    const applyCoupon = (code) => {
        const subtotal = cartItems.reduce(
            (sum, item) => sum + (item.price || 0) * (item.quantity || 1),
            0
        );

        const result = validateCoupon(code, subtotal);

        if (result.valid) {
            setAppliedCoupon(result.coupon);
            toast.success(`Coupon "${result.coupon.code}" applied!`, {
                icon: <CheckCircle size={20} color="#10B981" />,
            });
            return { success: true, coupon: result.coupon };
        } else {
            toast.error(result.error, {
                icon: <XCircle size={20} color="#EF4444" />,
            });
            return { success: false, error: result.error };
        }
    };

    // ✅ Remove coupon
    const removeCoupon = () => {
        setAppliedCoupon(null);
        toast.success('Coupon removed');
    };

    // Get item count
    const getItemCount = () => {
        return cartItems.reduce((sum, item) => sum + (item.quantity || 1), 0);
    };

    const value = {
        cartItems,
        cartTotal,
        appliedCoupon,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        applyCoupon,
        removeCoupon,
        getItemCount,
    };

    return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};