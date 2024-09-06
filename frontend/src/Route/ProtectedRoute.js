import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';

// const ProtectedRoute = ({ children }) => {
//   const { loading, isAuthenticated } = useSelector((state) => state.user);
//   const allowedRoutes = ['/products', '/products/:keyword','/home']; 
//   console.log("Loading:", loading);
//   console.log("Is Authenticated:", isAuthenticated);

//   if (loading) {
//     return <div>Loading...</div>; 
//   }

//   // if (allowedRoutes.some((route) => window.location.pathname.startsWith(route))) {
//   //   return children;
//   // }
//   return isAuthenticated ? children : <Navigate to="/login" replace />;
// };

// // export default ProtectedRoute;
// const ProtectedRoute = ({ children }) => {
//   const { isAuthenticated, loading } = useSelector((state) => state.user);

//   if (loading) {
//     return <div>Loading...</div>; 
//   }

//   if (isAuthenticated) {
//     return children;
//   } else {
//     return <Navigate to="/login" replace />;
//   }
// };
// export default ProtectedRoute;



const ProtectedRoute = ({ children, adminRoute = false }) => {
  const { isAuthenticated, loading, user } = useSelector((state) => state.user);

  if (loading) {
    return <div>Loading...</div>; 
  }

  if (isAuthenticated) {
    if (adminRoute && user?.role !== 'admin') {
      // Redirect to home if user is not an admin but trying to access an admin route
      return <Navigate to="/home" replace />;
    }
    return children;
  } else {
    return <Navigate to="/login" replace />;
  }
};

export default ProtectedRoute;
