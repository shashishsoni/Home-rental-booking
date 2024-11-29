import { useEffect, useState } from 'react';
import imagehome2 from '../assets/imagehome2.jpg';
import { FormDataState } from '../types/types'
import 'url-polyfill';
import { useNavigate } from 'react-router-dom';

const SignUpPage = () => {
  const [formData, SetFromData] = useState<FormDataState>({
    firstname: "",
    lastname: "",
    email: "",
    password: "",
    confirmPassword: "",
    profileImage: null,
  })

  const HandleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, files } = e.target
    SetFromData((prev) => ({
      ...prev,
      [name]: name === "profileImage" ? files![0] : value,
    }));
  };

  const [passwordMatch, setPasswordMatch] = useState(true)

  useEffect(() => {
    setPasswordMatch(formData.password === formData.confirmPassword || formData.confirmPassword === "")
  }, [formData.password, formData.confirmPassword])

  const navigate = useNavigate()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      const signup_form = new FormData()

      for (const key in formData) {
        const value = formData[key as keyof FormDataState]
        if (value !== null) {
          signup_form.append(key, value instanceof File ? value : value.toString());
        }
      }

      const response = await fetch("http://localhost:3333/auth/signup", {
        method: "POST",
        body: signup_form
      })

      if (response.ok) {
        navigate("/login")
      }
    } catch (err) {
      if (err instanceof Error) {
        console.error("Registration failed:", err.message);
      } else {
        console.error("An unexpected error occurred");
      }
    }
  }

  return (
    <div className="w-screen h-screen flex">
      {/* Left Section */}
      <div className="w-3/4 relative">
        <img
          src={imagehome2}
          alt="Background"
          className="absolute inset-0 w-full h-full object-cover"
        />
      </div>

      {/* Center Form */}
      <div className="absolute inset-0 flex items-center justify-center z-20">
        <div className="bg-white p-3 rounded-xl shadow-lg w-3/5 h-[700px] flex">
          {/* Left Part of the form (Transparent) */}
          <div className="w-1/2 relative bg-gray-100 overflow-hidden">
            <img
              src={imagehome2} // Your background image
              alt="Background"
              className="absolute inset-0 w-full h-full object-cover transform scale-[140%] hover:scale-130 transition-transform translate-x-[-60px] translate-y-[0px]"
            />
            <div className="absolute inset-0 bg-white opacity-50 mix-blend-multiply z-10"></div>
          </div>

          {/* Right Part of the form (Form Content) */}
          <div className="w-1/2 p-6">
            <h1 className="text-2xl font-bold text-gray-800 mb-4 text-center">
              SignUp Page
            </h1>
            <p className="text-gray-600 mb-6 text-center">
              Find your perfect home, where comfort meets convenience. Sign up to explore endless possibilities
            </p>
            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                onChange={HandleChange}
                value={formData.firstname}
                placeholder="First Name"
                name="firstname"
                required
                className="w-full px-4 py-2 border rounded-md text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
              <input
                onChange={HandleChange}
                value={formData.lastname}
                placeholder="Last Name"
                name="lastname"
                required
                className="w-full px-4 py-2 border rounded-md text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
              <input
                onChange={HandleChange}
                type="email"
                name="email"
                required
                value={formData.email}
                placeholder="Email address"
                className="w-full px-4 py-2 border rounded-md text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
              <input
                onChange={HandleChange}
                type="password"
                name="password"
                required
                value={formData.password}
                placeholder="Set password"
                className="w-full px-4 py-2 border rounded-md text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
              <input
                onChange={HandleChange}
                value={formData.confirmPassword}
                placeholder="Confirm Password"
                name="confirmPassword"
                required
                type="password"
                className="w-full px-4 py-2 border rounded-md text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
              <input
                onChange={HandleChange}
                id="profile-image"
                name="profileImage"
                accept="image/*"
                style={{ display: "none" }}
                type="file"
                // required
                className="hidden"
              />
              <label htmlFor="profile-image" className="flex items-center justify-center cursor-pointer text-center mt-4 bg-purple-300 p-2 rounded-md hover:bg-purple-400">
                <img src="/assets/addImage.png" alt="" className="mr-2 w-6" />
                <p className="text-gray-700">Upload Your Photo</p>
              </label>

              {formData.profileImage && (
                <img src={formData.profileImage ? URL.createObjectURL(formData.profileImage) : ""}
                  style={{ maxWidth: "80px", display: "flex", alignItems: "center", margin: "8px auto -5px" }}
                  alt="" />
              )}

              <button
                type="submit"
                className="w-full bg-purple-600 text-white py-2 rounded-md hover:bg-purple-700 mt-6"
              >
                Sign up free
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
              Already a user?{" "}
              <a href="/login" className="text-purple-600 underline">
                Log in
              </a>
            </p>
          </div>
        </div>
      </div>

      {/* Right Section */}
      <div className="w-2/5 relative bg-[#62371B]">
        <div className="absolute inset-0 flex items-center justify-center">
          {/* Right content goes here if needed */}
        </div>
      </div>
    </div>
  );
};

export default SignUpPage;


