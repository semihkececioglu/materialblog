import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";

const AdminRoute = ({ children }) => {
  const user = useSelector((state) => state.user.currentUser);

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Sadece admin ve editor girebilir
  if (user.role !== "admin" && user.role !== "editor") {
    return <Navigate to="/" replace />;
  }

  return children || <Outlet />;
};

export default AdminRoute;
