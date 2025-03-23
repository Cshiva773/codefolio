import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ condition, redirectTo, element }) => {
  return condition ? element : <Navigate to={redirectTo} />;
};

export default ProtectedRoute;