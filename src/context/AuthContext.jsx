import React, { createContext, useState, useContext, useEffect } from 'react';
import { UserService } from '../services/api';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const currentUser = UserService.getCurrentUser();
        setUser(currentUser);
        setLoading(false);
    }, []);

    const register = async (name, email, password, phone) => {
        setError(null);
        const result = await UserService.register({ name, email, password, phone });
        if (result.success) {
            setUser(result.user);
        } else {
            setError(result.error);
        }
        return result;
    };

    const login = async (email, password) => {
        setError(null);
        const result = await UserService.login({ email, password });
        if (result.success) {
            setUser(result.user);
        } else {
            setError(result.error);
        }
        return result;
    };

    const logout = () => {
        UserService.logout();
        setUser(null);
        return { success: true };
    };

    const value = {
        user,
        loading,
        error,
        register,
        login,
        logout,
        isAuthenticated: !!user,
        isAdmin: user?.role === 'admin'
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};