import React from 'react';
import imagehome2 from '../assets/imagehome2.jpg';

const SignUpPage = () => {
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
          <div className="w-1/2 relative bg-gray-100">
            <img
              src={imagehome2} // Your background image
              alt="Background"
              className="absolute inset-0 w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-white opacity-50 mix-blend-multiply z-10"></div> {/* Apply blend mode */}
          </div>

          {/* Right Part of the form (Form Content) */}
          <div className="w-1/2 p-6">
            <h1 className="text-2xl font-bold text-gray-800 mb-4 text-center">
              SignUp Page
            </h1>
            <p className="text-gray-600 mb-6 text-center">
            Find your perfect home, where comfort meets convenience. Sign up to explore endless possibilities
            </p>
            <form className="space-y-4">
              <input
                placeholder="First Name"
                name="firstname"
                required
                className="w-full px-4 py-2 border rounded-md text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
              <input
                placeholder="Last Name"
                name="lastname"
                required
                className="w-full px-4 py-2 border rounded-md text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
              <input
                type="email"
                placeholder="Email address"
                className="w-full px-4 py-2 border rounded-md text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
              <input
                type="password"
                placeholder="Set password"
                className="w-full px-4 py-2 border rounded-md text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
              <input
                placeholder="Confirm Password"
                name="confirmPassword"
                required
                type="password"
                className="w-full px-4 py-2 border rounded-md text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
              <input
                id="profile-image"
                name="profileImage"
                accept="image/*"
                style={{ display: "none" }}
                type="file"
                required
                className="hidden"
              />
              <label htmlFor="profile-image" className="flex items-center justify-center cursor-pointer text-center mt-4 bg-purple-300 p-2 rounded-md hover:bg-purple-400">
                <img src="/assets/addImage.png" alt="" className="mr-2 w-6" />
                <p className="text-gray-700">Upload Your Photo</p>
              </label>
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
