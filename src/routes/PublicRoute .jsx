import { useSelector } from "react-redux";
import { Navigate, Outlet, useLocation } from "react-router-dom";

export default function PublicRoute() {
  const user = useSelector((state) => state.auth.user);
  const location = useLocation();

  if (user) {
    
    const from = location.state?.from?.pathname || "/";
    return <Navigate to={from} replace />;
  }

  return <Outlet />;
}
