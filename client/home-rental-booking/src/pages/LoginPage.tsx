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

    // Validation for empty fields
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
    seterror(null); // Clear previous errors

    try {
      // Make the API request
      const response = await fetch("http://localhost:3001/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ Email: Email.trim(), password: password.trim() }), // Trim inputs before sending
      });

      // Check for successful response
      if (!response.ok) {
        const data = await response.json();
        seterror(data.message || "Invalid email or password");
        return;
      }

      // Successful login
      const data = await response.json();

      if (data.token && data.user) {
        console.log("Dispatching setLogin with data:", { user: data.user, token: data.token });
        dispatch(setLogin({ user: data.user, token: data.token }));
        navigate("/"); // Redirect to the home page after successful login
      } else {
        seterror("Invalid email or password");
      }
    } catch (err: any) {
      console.log("Login failed", err.message);
      seterror("An error occurred. Please try again.");
    } finally {
      setLogging(false); // Reset loading state
    }
  };

  return (
    <div className="w-screen h-screen flex">
      {/* Left Section */}
      <div className="w-3/4 relative">
        <img
          src={home3}
          alt="Background"
          className="absolute inset-0 w-full h-full object-cover"
        />
      </div>

      {/* Center Form */}
      <div className="absolute inset-0 flex items-center justify-center z-20 ">
        <div className="bg-white p-3 rounded-xl shadow-lg w-3/5 h-[700px] flex">
          {/* Left Part of the form (Transparent) */}
          <div className="w-1/2 relative bg-gray-100 overflow-hidden">
            <img
              src={home3} // Your background image
              alt="Background"
              className="absolute inset-0 w-full h-full object-cover transform scale-[140%] hover:scale-130 transition-transform translate-x-[-60px] translate-y-[0px]"
            />
            <div className="absolute inset-0 bg-white opacity-50 mix-blend-multiply z-10"></div>
          </div>

          {/* Right Part of the form (Form Content) */}
          <div className="w-1/2 p-6 m-auto">
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
                className="w-full px-4 py-2 border rounded-md text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
              <input
              value={password}
              onChange={(e) => setpassword(e.target.value)}
                type="password"
                placeholder="password"
                className="w-full px-4 py-2 border rounded-md text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
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
      <div className="w-2/5 relative bg-[#3E6BA6]">
        <div className="absolute inset-0 flex items-center justify-center">
          {/* Right content goes here if needed */}
        </div>
      </div>
    </div>
  )
}

export default LoginPage
