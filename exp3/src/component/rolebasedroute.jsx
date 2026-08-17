import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";

function RoleBasedRoute({ allowedRoles, children }) {
  const { user, isAuthenticated } = useSelector(
    (state) => state.auth
  );

  // User login nahi hai
  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  // User ka role allowed nahi hai
  if (!allowedRoles.includes(user?.role)) {
    return <Navigate to="/dashboard" replace />;
  }

  // Role allowed hai
  return children;
}

export default RoleBasedRoute;