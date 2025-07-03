import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

const RoleBasedAdminRedirect = () => {
  const user = useSelector((state) => state.user.currentUser);

  if (!user) return <Navigate to="/login" replace />;

  if (user.role === "editor") {
    return <Navigate to="/admin/posts" replace />;
  }

  // admin ise dashboard gösterilsin
  return <Navigate to="/admin/dashboard" replace />;
};

export default RoleBasedAdminRedirect;
