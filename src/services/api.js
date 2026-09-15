import axios from 'axios';

const API_URL = 'import.meta.env.VITE_API_URL/api';

const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// ============ PRODUCT SERVICE ============
export const ProductService = {
    getAll: async (filters = {}) => {
        try {
            const params = new URLSearchParams();
            Object.keys(filters).forEach(key => {
                if (filters[key]) params.append(key, filters[key]);
            });
            const response = await api.get(`/products?${params}`);
            return response.data;
        } catch (error) {
            return {
                success: false,
                error: error.response?.data?.error || 'Failed to fetch products'
            };
        }
    },

    getById: async (id) => {
        try {
            const response = await api.get(`/products/${id}`);
            return response.data;
        } catch (error) {
            return {
                success: false,
                error: error.response?.data?.error || 'Failed to fetch product'
            };
        }
    },

    getCategories: async () => {
        try {
            const response = await api.get('/products/categories/all');
            return response.data;
        } catch (error) {
            return {
                success: false,
                error: error.response?.data?.error || 'Failed to fetch categories'
            };
        }
    }
};

// ============ USER SERVICE ============
export const UserService = {
    register: async (userData) => {
        try {
            const response = await api.post('/users/register', userData);
            if (response.data.success) {
                localStorage.setItem('token', response.data.token);
                localStorage.setItem('user', JSON.stringify(response.data.user));
            }
            return response.data;
        } catch (error) {
            return {
                success: false,
                error: error.response?.data?.error || 'Registration failed'
            };
        }
    },

    login: async (credentials) => {
        try {
            const response = await api.post('/users/login', credentials);
            if (response.data.success) {
                localStorage.setItem('token', response.data.token);
                localStorage.setItem('user', JSON.stringify(response.data.user));
            }
            return response.data;
        } catch (error) {
            return {
                success: false,
                error: error.response?.data?.error || 'Login failed'
            };
        }
    },

    logout: () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        return { success: true };
    },

    getCurrentUser: () => {
        const user = localStorage.getItem('user');
        return user ? JSON.parse(user) : null;
    },

    getToken: () => localStorage.getItem('token'),

    isAuthenticated: () => !!localStorage.getItem('token'),

    // ✅ Forgot Password
    forgotPassword: async (email) => {
        try {
            const response = await api.post('/users/forgot-password', { email });
            return response.data;
        } catch (error) {
            return {
                success: false,
                error: error.response?.data?.error || 'Failed to send reset link'
            };
        }
    },

    // ✅ Reset Password
    resetPassword: async (token, newPassword) => {
        try {
            const response = await api.post(`/users/reset-password/${token}`, { newPassword });
            return response.data;
        } catch (error) {
            return {
                success: false,
                error: error.response?.data?.error || 'Failed to reset password'
            };
        }
    },

    // ✅ Get Profile
    getProfile: async () => {
        try {
            const response = await api.get('/users/profile');
            return response.data;
        } catch (error) {
            return {
                success: false,
                error: error.response?.data?.error || 'Failed to fetch profile'
            };
        }
    },

    // ✅ Update Profile
    updateProfile: async (userData) => {
        try {
            const response = await api.put('/users/profile', userData);
            if (response.data.success) {
                const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
                localStorage.setItem('user', JSON.stringify({
                    ...currentUser,
                    ...response.data.user
                }));
            }
            return response.data;
        } catch (error) {
            return {
                success: false,
                error: error.response?.data?.error || 'Failed to update profile'
            };
        }
    },

    // ✅ Change Password
    changePassword: async (currentPassword, newPassword) => {
        try {
            const response = await api.put('/users/change-password', {
                currentPassword,
                newPassword
            });
            return response.data;
        } catch (error) {
            return {
                success: false,
                error: error.response?.data?.error || 'Failed to change password'
            };
        }
    },

    // ✅ Get Addresses
    getAddresses: async () => {
        try {
            const response = await api.get('/users/addresses');
            return response.data;
        } catch (error) {
            return {
                success: false,
                error: error.response?.data?.error || 'Failed to fetch addresses'
            };
        }
    },

    // ✅ Add Address
    addAddress: async (addressData) => {
        try {
            const response = await api.post('/users/addresses', addressData);
            return response.data;
        } catch (error) {
            return {
                success: false,
                error: error.response?.data?.error || 'Failed to add address'
            };
        }
    },

    // ✅ Update Address
    updateAddress: async (addressId, addressData) => {
        try {
            const response = await api.put(`/users/addresses/${addressId}`, addressData);
            return response.data;
        } catch (error) {
            return {
                success: false,
                error: error.response?.data?.error || 'Failed to update address'
            };
        }
    },

    // ✅ Delete Address
    deleteAddress: async (addressId) => {
        try {
            const response = await api.delete(`/users/addresses/${addressId}`);
            return response.data;
        } catch (error) {
            return {
                success: false,
                error: error.response?.data?.error || 'Failed to delete address'
            };
        }
    },

    // ✅ Set Default Address
    setDefaultAddress: async (addressId) => {
        try {
            const response = await api.put(`/users/addresses/${addressId}/default`);
            return response.data;
        } catch (error) {
            return {
                success: false,
                error: error.response?.data?.error || 'Failed to set default address'
            };
        }
    }
};

// ============ ORDER SERVICE ============
export const OrderService = {
    create: async (orderData) => {
        try {
            const response = await api.post('/orders', orderData);
            return response.data;
        } catch (error) {
            return {
                success: false,
                error: error.response?.data?.error || 'Failed to create order'
            };
        }
    },

    getUserOrders: async (userId) => {
        try {
            const response = await api.get(`/orders/user/${userId}`);
            return response.data;
        } catch (error) {
            return {
                success: false,
                error: error.response?.data?.error || 'Failed to fetch orders'
            };
        }
    }
};

// ============ REVIEW SERVICE ============
export const ReviewService = {
    // Get reviews for a product (public)
    getProductReviews: async (productId) => {
        try {
            const response = await api.get(`/reviews/product/${productId}`);
            return response.data;
        } catch (error) {
            return {
                success: false,
                error: error.response?.data?.error || 'Failed to fetch reviews'
            };
        }
    },

    // Add review (customer)
    addReview: async (reviewData) => {
        try {
            const response = await api.post('/reviews', reviewData);
            return response.data;
        } catch (error) {
            return {
                success: false,
                error: error.response?.data?.error || 'Failed to add review'
            };
        }
    },

    // Update own review
    updateReview: async (reviewId, reviewData) => {
        try {
            const response = await api.put(`/reviews/${reviewId}`, reviewData);
            return response.data;
        } catch (error) {
            return {
                success: false,
                error: error.response?.data?.error || 'Failed to update review'
            };
        }
    },

    // Delete own review
    deleteReview: async (reviewId) => {
        try {
            const response = await api.delete(`/reviews/${reviewId}`);
            return response.data;
        } catch (error) {
            return {
                success: false,
                error: error.response?.data?.error || 'Failed to delete review'
            };
        }
    },

    // ✅ Admin: Get all reviews
    getAllReviews: async () => {
        try {
            const response = await api.get('/reviews/admin/all');
            return response.data;
        } catch (error) {
            return {
                success: false,
                error: error.response?.data?.error || 'Failed to fetch reviews'
            };
        }
    },

    // ✅ Admin: Update review status
    updateReviewStatus: async (reviewId, status) => {
        try {
            const response = await api.put(`/reviews/admin/${reviewId}/status`, { status });
            return response.data;
        } catch (error) {
            return {
                success: false,
                error: error.response?.data?.error || 'Failed to update review status'
            };
        }
    },

    // ✅ Admin: Delete review
    deleteReviewAdmin: async (reviewId) => {
        try {
            const response = await api.delete(`/reviews/admin/${reviewId}`);
            return response.data;
        } catch (error) {
            return {
                success: false,
                error: error.response?.data?.error || 'Failed to delete review'
            };
        }
    }
};

// ============ CATEGORY SERVICE ============
export const CategoryService = {
    getAll: async () => {
        try {
            const response = await api.get('/categories');
            return response.data;
        } catch (error) {
            return {
                success: false,
                error: error.response?.data?.error || 'Failed to fetch categories'
            };
        }
    },

    getById: async (id) => {
        try {
            const response = await api.get(`/categories/${id}`);
            return response.data;
        } catch (error) {
            return {
                success: false,
                error: error.response?.data?.error || 'Failed to fetch category'
            };
        }
    },

    create: async (data) => {
        try {
            const response = await api.post('/categories', data);
            return response.data;
        } catch (error) {
            return {
                success: false,
                error: error.response?.data?.error || 'Failed to create category'
            };
        }
    },

    update: async (id, data) => {
        try {
            const response = await api.put(`/categories/${id}`, data);
            return response.data;
        } catch (error) {
            return {
                success: false,
                error: error.response?.data?.error || 'Failed to update category'
            };
        }
    },

    delete: async (id) => {
        try {
            const response = await api.delete(`/categories/${id}`);
            return response.data;
        } catch (error) {
            return {
                success: false,
                error: error.response?.data?.error || 'Failed to delete category'
            };
        }
    }
};