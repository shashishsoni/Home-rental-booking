import { FormEvent, useState } from "react"
import home3 from "../assets/home3.jpg"
import { setLogin } from "@/redux/cache"
import { useNavigate } from "react-router-dom"
import { useDispatch } from "react-redux"



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
    <div className="w-screen h-screen flex">
      {/* Left Section */}
      <div className="hidden lg:block lg:w-3/4 relative">
        <img
          src={home3}
          alt="Background"
          className="absolute inset-0 w-full h-full object-cover"
        />
      </div>

      {/* Center Form */}
      <div className="absolute inset-0 flex items-center justify-center z-20">
        <div className="bg-white p-3 rounded-xl shadow-lg w-[95%] md:w-4/5 lg:w-3/5 h-[80%] max-h-screen flex flex-col lg:flex-row">
          {/* Left Part of the form (Transparent) */}
          <div className="hidden lg:block lg:w-1/2 relative bg-gray-100 overflow-hidden">
            <img
              src={home3}
              alt="Background"
              className="absolute inset-0 w-full h-full object-cover transform scale-[140%] hover:scale-130 transition-transform translate-x-[-60px] translate-y-[0px]"
            />
            <div className="absolute inset-0 bg-white opacity-50 mix-blend-multiply z-10"></div>
          </div>

          {/* Right Part of the form (Form Content) */}
          <div className="w-full lg:w-1/2 p-4 lg:p-6 m-auto">
            <h1 className="text-2xl font-bold text-gray-800 mb-4 text-center">
              LogIn Page
            </h1>
            <p className="text-gray-600 mb-6 text-center">
            Welcome Home: Your journey to the perfect rental begins here.
            </p>
            <form className="space-y-4" onSubmit={handleSubmit}>
              
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
            <p className="text-sm text-gray-400 mt-4 text-center">
              By signing up I agree to the{" "}
              <a href="#" className="text-purple-600 underline">
                terms & conditions
              </a>{" "}
              and{" "}
              <a href="#" className="text-purple-600 underline">
                privacy policy
              </a>
            </p>
            <p className="mt-6 text-gray-500 text-center">
              Don't Have an Account?{" "}
              <a href="/SignUp" className="text-purple-600 underline">
                Sign Up
              </a>
            </p>
          </div>
        </div>
      </div>

      {/* Right Section */}
      <div className="hidden lg:block lg:w-2/5 relative bg-[#3E6BA6]">
        <div className="absolute inset-0 flex items-center justify-center">
          {/* Right content goes here if needed */}
        </div>
      </div>
    </div>
  )
}

export default LoginPage
