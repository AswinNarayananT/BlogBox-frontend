import { useState } from "react";
import { Eye, EyeOff, Mail, Lock, LogIn, AlertCircle } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { login } from "../redux/auth/authThunk";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

export default function Login() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading } = useSelector((state) => state.auth);

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [rememberMe, setRememberMe] = useState(false);

  const validateForm = () => {
    const newErrors = {};
    if (!formData.email.trim()) newErrors.email = "Email is required";
    if (!formData.password.trim()) newErrors.password = "Password is required";
    if (formData.email && !/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email is invalid";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      const result = await dispatch(login(formData)).unwrap();
      toast.success(`Welcome back, ${result.username}!`);
      navigate("/");
    } catch (err) {
      toast.error(err || "Login failed");
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-black text-white">
      <Navbar />
      <main className="flex-grow flex items-center justify-center p-4">
        <div className="w-full max-w-md bg-gray-900/80 backdrop-blur-xl border border-gray-800 rounded-3xl p-10 shadow-2xl">
          <h1 className="text-4xl font-extrabold text-center bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent mb-4">
            Welcome Back
          </h1>
          <p className="text-center text-gray-400 mb-8">Sign in to your account</p>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
                Email Address
              </label>
              <div className="relative">
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-3 pl-12 bg-gray-800 border ${
                    errors.email ? "border-red-500" : "border-gray-700"
                  } rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-white transition`}
                  placeholder="Enter your email"
                />
                <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              </div>
              {errors.email && (
                <p className="mt-2 text-sm text-red-400 flex items-center gap-1">
                  <AlertCircle size={16} />
                  {errors.email}
                </p>
              )}
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-2">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-3 pl-12 pr-12 bg-gray-800 border ${
                    errors.password ? "border-red-500" : "border-gray-700"
                  } rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-white transition`}
                  placeholder="Enter your password"
                />
                <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
              {errors.password && (
                <p className="mt-2 text-sm text-red-400 flex items-center gap-1">
                  <AlertCircle size={16} />
                  {errors.password}
                </p>
              )}
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 text-white bg-gray-800 border-gray-700 rounded focus:ring-white focus:ring-2"
                />
                <span className="text-sm text-gray-300">Remember me</span>
              </label>
              <button type="button" className="text-sm text-gray-400 hover:text-white transition">
                Forgot password?
              </button>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 px-6 bg-white text-black font-semibold rounded-xl shadow-lg hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-400 disabled:opacity-50 disabled:cursor-not-allowed transition-all transform hover:scale-105 disabled:hover:scale-100"
            >
              {loading ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin"></div>
                  Signing In...
                </div>
              ) : (
                <div className="flex items-center justify-center gap-2">
                  <LogIn size={20} />
                  Sign In
                </div>
              )}
            </button>
          </form>

          <div className="text-center mt-8">
            <p className="text-gray-400">
              Don't have an account?{" "}
              <button
                type="button"
                onClick={() => navigate("/register")}
                className="text-white hover:text-gray-300 font-semibold transition"
              >
                Sign Up
              </button>
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}