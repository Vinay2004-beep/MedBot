import React from 'react';
import { Navigate } from 'react-router-dom';

function isAuthenticated() {
  // Change this to your actual auth check (token, context, etc.)
  return !!localStorage.getItem('user');
}

export default function ProtectedRoute({ children }) {
  if (!isAuthenticated()) {
    return <Navigate to="/auth" replace />;
  }
  return children;
}
