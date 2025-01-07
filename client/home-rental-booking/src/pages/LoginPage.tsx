import { FormEvent, useState } from "react"
import home3 from "../assets/home3.jpg"
import { setLogin } from "@/redux/cache"
import { useNavigate } from "react-router-dom"
import { useDispatch } from "react-redux"
import { Link } from "react-router-dom"
import Navbar from "../components/Navbar"
import Footer from "../components/Footer"



function LoginPage() {
  const [Email, setEmail] = useState("");
  const [password, setpassword] = useState("");
  const [error, seterror] = useState<string | null>(null);
  const [Logging, setLogging] = useState(false);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!Email.trim() && !password.trim()) {
      seterror("Email and password are required");
      return;
    }
    if (!Email.trim()) {
      seterror("Email is required");
      return;
    }
    if (!password.trim()) {
      seterror("Password is required");
      return;
    }
    setLogging(true);
    seterror(null);
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ Email: Email.trim(), password: password.trim() }),
      });
      if (!response.ok) {
        const data = await response.json();
        seterror(data.message || "Invalid email or password");
        return;
      }
      const data = await response.json();
      if (data.token && data.user) {
        localStorage.setItem('user', JSON.stringify(data.user)); // Add this line
  
        dispatch(setLogin({ user: data.user, token: data.token }));
        navigate("/");
      } else {
        seterror("Invalid email or password");
      }
    } catch (err: any) {
      console.log("Login failed", err.message);
      seterror("An error occurred. Please try again.");
    } finally {
      setLogging(false);
    }
};

  return (
    <div className="min-h-screen flex flex-col bg-black bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(120,119,198,0.3),rgba(255,255,255,0))] bg-fixed overflow-x-hidden">
      <Navbar />
      <div className="flex-grow flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md">
          <div className="bg-white/10 backdrop-blur-lg p-8 rounded-2xl shadow-xl border border-white/20">
            <h2 className="text-3xl font-bold text-white mb-6 text-center">
              Welcome Back
            </h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <input
                value={Email}
                onChange={(e) => setEmail(e.target.value)}
                type="email"
                placeholder="Email address"
                className="w-full px-4 py-2 border rounded-md text-black focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
              <input
                value={password}
                onChange={(e) => setpassword(e.target.value)}
                type="password"
                placeholder="password"
                className="w-full px-4 py-2 border rounded-md text-black focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
              {error && (
                <p className="text-red-500 text-sm text-center bg-red-50 p-2 rounded">
                  {error}
                </p>
              )}
              <button
                type="submit"
                className="w-full bg-[#A7CDE0] text-white py-2 rounded-md hover:bg-[#3E6BA6] mt-6"
              >
                {Logging ? "Logging in..." : "Login"}
              </button>
            </form>
            <div className="mt-6 text-center">
              <p className="text-gray-400">
                Don't have an account?{" "}
                <Link to="/signup" className="text-purple-400 hover:text-purple-300">
                  Sign up
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  )
}

export default LoginPage
