import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { getCurrentUser } from "../redux/auth/authThunk";
import BlogLoader from "../components/BlogLoader";

export default function AdminRoute() {
  const dispatch = useDispatch();
  const location = useLocation();

  const { user, loading, error } = useSelector((state) => state.auth);
  const [checked, setChecked] = useState(false);
  const [redirectPath, setRedirectPath] = useState(null);

  useEffect(() => {
    if (!user && !checked) {
      dispatch(getCurrentUser()).finally(() => setChecked(true));
    } else {
      setChecked(true);
    }
  }, [dispatch, user, checked]);

  useEffect(() => {
    if (checked && !loading) {
      if (!user || !user.is_active) {
        setRedirectPath("/login");
      } else if (!user.is_superuser) {
        setRedirectPath("/");
      }
    }
  }, [checked, loading, user]);

  if (loading || !checked) return <BlogLoader />;
  if (redirectPath) return <Navigate to={redirectPath} replace state={{ from: location }} />;

  return <Outlet />;
}
