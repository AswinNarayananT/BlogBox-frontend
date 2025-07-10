import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import Register from "./pages/Register";
import Login from "./pages/Login";
import Home from "./pages/Home";
import CreateBlog from "./pages/CreateBlog";
import BlogDetail from "./pages/BlogDetail";

function App() {
  return (
    <Router>

      <Toaster position="top-right" reverseOrder={false} />
      
      <Routes>
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<Home />} />
        <Route path="/blogs/create" element={<CreateBlog />} />
        <Route path="/blogs/:id" element={<BlogDetail />} />
      </Routes>

    </Router>
  );
}

export default App;
