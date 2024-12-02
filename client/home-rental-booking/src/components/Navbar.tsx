import React, { useEffect, useState } from "react";
import home from "../assets/home.png";
import { Person, Menu } from "@mui/icons-material";

// Define the type for the user state
interface User {
  profileImagePath?: string;
}

const Navbar: React.FC = () => {
  const [Dropdown, setDropdownMenu] = useState(false);

  // Define the user state with the correct type
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    setUser({
      profileImagePath: 'Screenshot 2024-12-02 215000.png',  // Replace with actual test image name or path
    });
  }, []);

  // Construct the profile image URL with a fallback if the image path is not provided
  const profileImageUrl = user?.profileImagePath
    ? `http://localhost:3001/public/uploads/${user.profileImagePath}`
    : 'http://localhost:3001/public/uploads/default-profile.png'; // Fallback image

    console.log('User:', user);  // Check the user data
  console.log('Profile Image URL:', profileImageUrl); 

  return (
    <nav className="fixed top-0 left-0 w-full bg-white shadow-lg px-4 py-2 flex items-center justify-between z-50">
      {/* Left: Logo/Image */}
      <div className="flex items-center">
        <img
          src={home}
          alt="Logo"
          className="h-[75px] w-[130px] rounded-full"
        />
      </div>

      {/* Center: Glowing Search Bar */}
      <div className="flex-0 mx-4">
        <div className="relative w-full">
          <div className="overflow-hidden z-0 rounded-full relative p-2">
            <form role="form" className="relative flex z-50 bg-white rounded-full">
              <input
                type="text"
                placeholder="enter your search here"
                className="rounded-full flex-1 px-6 py-2 text-gray-700 focus:outline-none"
              />
              <button className="bg-indigo-500 text-white rounded-full font-semibold px-8 py-4 hover:bg-indigo-400 focus:bg-indigo-600 focus:outline-none">
                Search
              </button>
            </form>
            <div className="glow glow-1 z-10 animate-glow1 bg-pink-400 rounded-full w-120 h-120 -top-10 -left-10 absolute"></div>
            <div className="glow glow-2 z-20 animate-glow2 bg-purple-400 rounded-full w-120 h-120 -top-10 -left-10 absolute"></div>
            <div className="glow glow-3 z-30 animate-glow3 bg-yellow-400 rounded-full w-120 h-120 -top-10 -left-10 absolute"></div>
            <div className="glow glow-4 z-40 animate-glow4 bg-blue-400 rounded-full w-120 h-120 -top-10 -left-10 absolute"></div>
          </div>
        </div>
      </div>

      {/* Center: "Become a Host" Link */}
      <div className="flex items-center space-x-4">
        {user ? (
          <a href="/create-listing" className="text-blue-500 hover:text-blue-700">
            Become a Host
          </a>
        ) : (
          <a href="/login" className="text-blue-500 hover:text-blue-700">
            Become a Host
          </a>
        )}
      </div>

      {/* Right: Dropdown Menu */}
      <div className="relative">
        <button
          onClick={() => setDropdownMenu(!Dropdown)}
          className="flex items-center space-x-2 px-4 py-2 bg-blue-500 text-white rounded-full focus:outline-none focus:ring-2 focus:ring-blue-300"
        >
          <Menu />
          {/* If user is not logged in, display the Person icon, else display the profile image */}
          {!user ? (
            <Person />
          ) : (
            <img
              src={profileImageUrl}
              alt="Profile"
              className="h-10 w-10 rounded-full object-cover"
            />
          )}
        </button>

        {/* Dropdown Items */}
        {Dropdown && (
          <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg">
            <ul className="py-1">
              <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer">Profile</li>
              <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer">Settings</li>
              <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer">Logout</li>
            </ul>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
