import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import BlogFeed from "../components/BlogFeed";

export default function Home() {
  return (
    <div className="min-h-screen bg-black text-white">
      <Navbar />
      <BlogFeed />
      <Footer />
    </div>
  );
}
