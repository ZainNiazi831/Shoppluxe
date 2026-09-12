// ✅ Available coupons (mock data)
export const COUPONS = {
    'SAVE10': {
        code: 'SAVE10',
        type: 'percentage',
        value: 10,
        minOrder: 0,
        description: '10% off on all orders',
    },
    'SAVE20': {
        code: 'SAVE20',
        type: 'percentage',
        value: 20,
        minOrder: 100,
        description: '20% off on orders above $100',
    },
    'FLAT50': {
        code: 'FLAT50',
        type: 'fixed',
        value: 50,
        minOrder: 200,
        description: '$50 off on orders above $200',
    },
    'FREESHIP': {
        code: 'FREESHIP',
        type: 'freeShipping',
        value: 0,
        minOrder: 0,
        description: 'Free shipping on your order',
    },
};

// ✅ Validate coupon
export const validateCoupon = (code, subtotal) => {
    if (!code) {
        return { valid: false, error: 'Please enter a coupon code' };
    }

    const coupon = COUPONS[code.toUpperCase()];

    if (!coupon) {
        return { valid: false, error: 'Invalid coupon code' };
    }

    if (subtotal < coupon.minOrder) {
        return {
            valid: false,
            error: `Minimum order of $${coupon.minOrder} required for this coupon`,
        };
    }

    return { valid: true, coupon };
};

// ✅ Calculate discount
export const calculateDiscount = (coupon, subtotal) => {
    if (!coupon) return 0;

    if (coupon.type === 'percentage') {
        return (subtotal * coupon.value) / 100;
    }
    if (coupon.type === 'fixed') {
        return Math.min(coupon.value, subtotal);
    }
    return 0;
};