import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  let valid = true;
  if (!token) valid = false;
  else {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      if (!payload || !payload.roles || !Array.isArray(payload.roles)) valid = false;
    } catch {
      valid = false;
    }
  }
  if (!valid) {
    localStorage.removeItem('token');
    return <Navigate to="/login" replace />;
  }
  return children;
};

export default ProtectedRoute;
