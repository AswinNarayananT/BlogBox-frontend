import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import Register from "./pages/Register";
import Login from "./pages/Login";
import Home from "./pages/Home";
import PublicRoute from "./routes/PublicRoute ";
import ProtectedRoute from "./routes/ProtectedRoute ";
import AdminRoute from "./routes/AdminRoute ";
import CreateBlog from "./pages/CreateBlog";
import BlogDetail from "./pages/BlogDetail";
import AdminPage from "./pages/AdminPage";
import UserProfile from "./pages/UserProfile";
import MyBlogPage from "./pages/MyBlogPage";
import NotFound from "./pages/NotFound";

function App() {
  return (
    <Router>

      <Toaster position="top-right" reverseOrder={false} />
      
      <Routes>
        <Route path="/" element={<Home />} />

        <Route element={<PublicRoute />}>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Route>

        <Route element={<ProtectedRoute />}>
          <Route path="/blogs/:id" element={<BlogDetail />} />
          <Route path="/blogs/create" element={<CreateBlog />} />
          <Route path="/my-blogs" element={<MyBlogPage />} />
          <Route path="/profile" element={<UserProfile />} />
        </Route>
        
        <Route element={<AdminRoute />}>
          <Route path="/users/manage" element={<AdminPage />} />
        </Route>

        <Route path="*" element={<NotFound />} />
  
      </Routes>

    </Router>
  );
}

export default App;
