import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { WishlistProvider } from './context/WishlistContext';
import { Toaster } from 'react-hot-toast';
import { CheckCircle, CircleX } from 'lucide-react';
import ProtectedRoute from './components/common/ProtectedRoute';
import Navbar from './components/Navbar';
import Home from './components/Home';
import ProductList from './components/ProductList';
import ProductDetails from './components/ProductDetails';
import Login from './components/Auth/Login';
import Register from './components/Auth/Register';
import ForgotPassword from './components/Auth/ForgotPassword';
import CartPage from './components/CartPage';
import Checkout from './components/Checkout';
import Orders from './components/Orders';
import Profile from './components/Profile';
import Addresses from './components/Addresses';
import AdminDashboard from './components/Admin/AdminDashboard';
import WishlistPage from './components/WishlistPage';

function App() {
    return (
        <BrowserRouter>
            <AuthProvider>
                <CartProvider>
                    <WishlistProvider>
                        <Toaster
                            position="top-right"
                            toastOptions={{
                                style: {
                                    background: '#2F4156',
                                    color: 'white',
                                    borderRadius: '12px',
                                    padding: '16px',
                                    fontSize: '14px',
                                    fontWeight: '500',
                                },
                                success: {
                                    duration: 3000,
                                    icon: (
                                        <CheckCircle
                                            size={22}
                                            color="#10B981"
                                            strokeWidth={2.5}
                                        />
                                    ),
                                },
                                error: {
                                    duration: 4000,
                                    icon: (
                                        <CircleX
                                            size={22}
                                            color="#EF4444"
                                            strokeWidth={2.5}
                                        />
                                    ),
                                },
                                loading: {
                                    duration: Infinity,
                                },
                            }}
                        />

                        <Navbar />

                        <Routes>
                            <Route path="/" element={<Home />} />
                            <Route path="/products" element={<ProductList />} />
                            <Route path="/products/:id" element={<ProductDetails />} />
                            <Route path="/login" element={<Login />} />
                            <Route path="/register" element={<Register />} />
                            <Route path="/forgot-password" element={<ForgotPassword />} />

                            <Route path="/cart" element={
                                <ProtectedRoute>
                                    <CartPage />
                                </ProtectedRoute>
                            } />

                            <Route path="/checkout" element={
                                <ProtectedRoute>
                                    <Checkout />
                                </ProtectedRoute>
                            } />

                            <Route path="/orders" element={
                                <ProtectedRoute>
                                    <Orders />
                                </ProtectedRoute>
                            } />

                            <Route path="/profile" element={
                                <ProtectedRoute>
                                    <Profile />
                                </ProtectedRoute>
                            } />

                            <Route path="/profile/addresses" element={
                                <ProtectedRoute>
                                    <Addresses />
                                </ProtectedRoute>
                            } />

                            <Route path="/admin" element={
                                <ProtectedRoute adminOnly={true}>
                                    <AdminDashboard />
                                </ProtectedRoute>
                            } />

                            <Route path="/wishlist" element={
                                <ProtectedRoute>
                                    <WishlistPage />
                                </ProtectedRoute>
                            } />
                        </Routes>
                    </WishlistProvider>
                </CartProvider>
            </AuthProvider>
        </BrowserRouter>
    );
}

export default App;