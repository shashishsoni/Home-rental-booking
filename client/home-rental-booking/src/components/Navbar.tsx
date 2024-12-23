import React, { useState } from "react";
import home from "../assets/home-transformed.png";
import { Person, Menu } from "@mui/icons-material";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { setLogout } from "@/redux/cache";
import { persistor } from "@/redux/storecache";
import { RootState } from "@/redux/storecache";

const Navbar: React.FC = () => {
  const [Dropdown, setDropdownMenu] = useState(false);
  //acess user data from reudux store
  const user = useSelector((state: RootState) => state.user?.user);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const profileImageUrl = user?.profileImagePath
    ? `http://localhost:3001/public/uploads/${user.profileImagePath}`
    : 'http://localhost:3001/public/uploads/default-profile.png';

  const handleLogout = async () => {
    try {
      // Dispatch logout action
      dispatch(setLogout());

      // Purge the persisted data and handle potential errors
      if (persistor) {
        await persistor.purge();
      } else {
        console.error("Persistor is not initialized.");
      }

      // Redirect to home after logout
      navigate("/");
    } catch (error) {
      console.error("Error during logout:", error);
    }
  };

  return (
    <nav className="absolute top-0 left-1/2 transform -translate-x-1/2 w-[95%] h-[8%] shadow-lg px-4 py-2 flex items-center justify-between z-50 bg-[rgba(255,255,255,0.1)] backdrop-filter backdrop-blur-lg rounded-full mt-4">
      {/* Left: Logo/Image */}
      <div className="flex items-center">
        <img
          src={home}// Replace with actual logo path
          alt="Logo"
          className="h-[75px] w-[130px] rounded-full"
        />
      </div>

      {/* Center: Glowing Search Bar */}
      <div className="flex-0 ">
        <div className="relative w-[130%]">
          <div className="overflow-hidden z-0 rounded-full relative p-2">
            <form role="form" className="relative flex z-50 bg-white rounded-full bg-[rgba(255,255,255,0.1)] backdrop-filter backdrop-blur-lg">
              <input
                type="text"
                placeholder="search..."
                className="flex-1 h-12 px-4 text-gray-950 placeholder-gray-950 bg-white rounded-l-full focus:outline-none bg-[rgba(255,255,255,0.1)] backdrop-filter backdrop-blur-lg "
              />
              <button className="h-12 px-8 font-semibold text-zinc-800 bg-[rgba(255,255,255,0.1)] backdrop-filter backdrop-blur-lg rounded-r-full hover:bg-indigo-300 focus:bg-indigo-300 focus:outline-none">
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

      {/* Right: Dropdown Menu */}
      <div className="relative">
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

          <button
            onClick={() => setDropdownMenu(!Dropdown)}
            className="flex items-center space-x-2 px-4 py-2 border-blue-400 text-white rounded-full focus:outline-none focus:ring-2 focus:ring-blue-300 bg-[rgba(255,255,255,0.1)] backdrop-filter backdrop-blur-lg"
          >
            <Menu />
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
            <div className={`absolute right-0 w-48 bg-[rgba(255,255,255,0.1)] backdrop-filter backdrop-blur-lg border border-gray-200 rounded-lg shadow-lg ${user ? 'mt-80' : 'mt-36'}`}>
              <ul className="py-1">
                {!user ? (
                  <>
                    <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer">
                      <Link to="/signup" onClick={() => navigate("/signup")}>Sign Up</Link>
                    </li>
                    <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer">
                      <Link to="/login" onClick={() => navigate("/login")}>Log In</Link>
                    </li>
                  </>
                ) : (
                  <>
                    <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer">
                      <Link to="">Trip List</Link>
                    </li>
                    <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer">
                      <Link to="">Wish List</Link>
                    </li>
                    <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer">
                      <Link to="">Property List</Link>
                    </li>
                    <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer">
                      <Link to="">Reservation List</Link>
                    </li>
                    <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer">
                      <Link to="/create-listing">Become A Host</Link>
                    </li>
                    <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer" onClick={handleLogout}>
                      <Link to="/">Log Out</Link>
                    </li>
                  </>
                )}
              </ul>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
