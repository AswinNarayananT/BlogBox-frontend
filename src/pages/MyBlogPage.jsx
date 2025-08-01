import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import MyBlogs from "../components/MyBlog";

export default function MyBlogPage() {
  return (
    <div className="min-h-screen bg-black text-white">
      <Navbar />
      <MyBlogs />
      <Footer />
    </div>
  );
}
