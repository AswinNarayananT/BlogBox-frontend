import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getCurrentUser } from "../redux/auth/authThunk";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import BlogFeed from "../components/BlogFeed";

export default function Home() {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user); 

  useEffect(() => {
    const token = localStorage.getItem("access_token");
    if (token && !user) {
      dispatch(getCurrentUser());
    }
  }, [dispatch, user]);

  return (
    <div className="min-h-screen bg-black text-white">
      <Navbar />
      <BlogFeed />
      <Footer />
    </div>
  );
}

