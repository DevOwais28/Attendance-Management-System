import React from 'react';
import useAppStore from './Store';
import { Navigate, useLocation } from 'react-router-dom';

const StudentProtectedRoutes = ({ children }) => {
  const { userId, userRole } = useAppStore();
  const location = useLocation();

  if (!userId) {
    return <Navigate to="/login" replace />;
  }

  // Students can only access report page, teachers can access both attendance and report
  if (userRole === 'student' && !location.pathname.includes('/report')) {
    return <Navigate to="/report" replace />;
  }

  // Allow both teachers and students to access these routes
  return children;
};

export default StudentProtectedRoutes;
