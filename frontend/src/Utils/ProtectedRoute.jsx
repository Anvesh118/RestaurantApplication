// /Utils/ProtectedRoute.jsx
import React from 'react';
import { Navigate } from 'react-router-dom';

const isTokenValid = () => {
    const token = localStorage.getItem("token");
    if (!token) return false;

    try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        const expiry = payload.exp;
        const now = Math.floor(Date.now() / 1000);
        return expiry > now;
    } catch (err) {
        return false;
    }
};

const ProtectedRoute = ({ children }) => {
    return isTokenValid() ? children : <Navigate to="/login" />;
};

export default ProtectedRoute;
