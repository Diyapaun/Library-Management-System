import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children, adminOnly = false }) => {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");

    // If not logged in, go to login
    if (!token) {
        return <Navigate to="/login" replace />;
    }

    // If trying to access admin page but is a regular user
    if (adminOnly && role !== 'admin') {
        return <Navigate to="/" replace />;
    }

    return children;
};

export default ProtectedRoute;