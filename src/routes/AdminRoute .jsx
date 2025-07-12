import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";

export default function AdminRoute() {
  const user = useSelector((state) => state.auth.user);

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (!user.is_superuser) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
}
