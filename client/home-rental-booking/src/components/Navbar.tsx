import React, { useState } from "react";
import home from "../assets/home2.png";
import { Person, Menu } from "@mui/icons-material";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { setLogout } from "@/redux/cache";
import { persistor } from "@/redux/storecache";
import { RootState } from "@/redux/storecache";
import { Search } from "lucide-react";

const Navbar: React.FC = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  //acess user data from reudux store
  const user = useSelector((state: RootState) => state.user?.user);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const profileImageUrl = user?.profileImagePath
    ? `http://localhost:3001/uploads/${user.profileImagePath}`
    : "http://localhost:3001/public/uploads/default-profile.png";

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
    <div className="fixed top-0 left-0 right-0 px-6 py-4 z-50">
      <nav className="max-w-9xl mx-auto flex items-center justify-between h-20 px-8 bg-black/10 backdrop-blur-lg rounded-full border border-white/10">
        {/* Logo Section */}
        <div className="flex-1 flex items-center justify-start">
          <Link 
            to="/" 
            className="relative group"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-purple-500/30 via-blue-500/30 to-purple-500/30 rounded-full blur-xl group-hover:blur-2xl transition-all duration-500 animate-glow-pulse"></div>
            <img 
              src={home} 
              alt="Logo" 
              className="h-10 w-auto relative z-10 drop-shadow-[0_0_15px_rgba(255,255,255,0.5)] group-hover:scale-100 transition-transform duration-500" 
            />
          </Link>
        </div>

        {/* Search Section */}
        <div className="flex-1 flex items-center justify-center max-w-xl px-4">
          <div className="w-full relative group">
            {/* Static glowing border */}
            <div className="absolute -inset-[1.5px] rounded-full bg-gradient-to-r from-purple-600 via-blue-500 to-purple-600 opacity-70 blur-sm group-hover:opacity-100 transition-opacity duration-500"></div>
            
            {/* Search bar content */}
            <div className="relative flex bg-black/20 rounded-full border border-white/10 backdrop-blur-sm overflow-hidden">
              <input
                type="text"
                placeholder="Where to?"
                className="w-full h-12 pl-6 pr-4 bg-transparent text-white placeholder-white/60 rounded-l-full focus:outline-none transition-all"
              />
              <button className="h-12 px-8 font-medium text-white bg-gradient-to-r from-purple-500 to-blue-500 rounded-r-full hover:opacity-90 transition-opacity flex items-center gap-2">
                <Search size={18} />
                <span>Search</span>
              </button>
            </div>
          </div>
        </div>

        {/* Right Menu Section */}
        <div className="flex-1 flex items-center justify-end gap-4">
          <Link 
            to={user ? "/create-listing" : "/login"}
            className="px-5 py-2.5 text-white font-medium rounded-full bg-gradient-to-r from-purple-500 to-blue-500 hover:opacity-90 transition-all duration-300 shadow-lg"
          >
            Become a Host
          </Link>

          <div className="relative">
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 border border-white/20 text-white rounded-full transition-all duration-300"
            >
              <Menu className="w-5 h-5" />
              {user ? (
                <img
                  src={profileImageUrl}
                  alt="Profile"
                  className="h-8 w-8 rounded-full object-cover ring-2 ring-white/20"
                />
              ) : (
                <Person className="w-5 h-5" />
              )}
            </button>

            {isDropdownOpen && (
              <div className="absolute right-0 top-full mt-2 w-64 bg-black/90 backdrop-blur-xl border border-white/20 rounded-2xl shadow-lg overflow-hidden">
                {user && (
                  <div className="p-4 border-b border-white/10">
                    <div className="flex items-center gap-3">
                      <img
                        src={profileImageUrl}
                        alt="Profile"
                        className="h-12 w-12 rounded-full object-cover ring-2 ring-white/20"
                      />
                      <div className="flex flex-col">
                        <span className="text-white font-medium">
                          {user.firstname} {user.lastname}
                        </span>
                        <span className="text-white/60 text-sm">View profile</span>
                      </div>
                    </div>
                  </div>
                )}
                <ul className="py-1 divide-y divide-white/10">
                  {!user ? (
                    <>
                      <li>
                        <Link to="/signup" className="flex items-center px-6 py-3 text-white hover:bg-white/10 transition-colors">
                          <span className="text-sm font-medium">Sign Up</span>
                        </Link>
                      </li>
                      <li>
                        <Link to="/login" className="flex items-center px-6 py-3 text-white hover:bg-white/10 transition-colors">
                          <span className="text-sm font-medium">Log In</span>
                        </Link>
                      </li>
                    </>
                  ) : (
                    <>
                      <li>
                        <Link to={`/${user._id}/trips`} className="flex items-center px-6 py-3 text-white hover:bg-white/10 transition-colors">
                          <span className="text-sm font-medium">Your Trips</span>
                        </Link>
                      </li>
                      <li>
                        <Link to={`/${user._id}/wishlist`} className="flex items-center px-6 py-3 text-white hover:bg-white/10 transition-colors">
                          <span className="text-sm font-medium">Wishlist</span>
                        </Link>
                      </li>
                      <li>
                        <Link to="/properties" className="flex items-center px-6 py-3 text-white hover:bg-white/10 transition-colors">
                          <span className="text-sm font-medium">Your Properties</span>
                        </Link>
                      </li>
                      <li>
                        <Link to="/reservations" className="flex items-center px-6 py-3 text-white hover:bg-white/10 transition-colors">
                          <span className="text-sm font-medium">Your Reservations</span>
                        </Link>
                      </li>
                      <li>
                        <Link to="/create-listing" className="flex items-center px-6 py-3 text-white hover:bg-white/10 transition-colors">
                          <span className="text-sm font-medium">Become a Host</span>
                        </Link>
                      </li>
                      <li>
                        <button 
                          onClick={handleLogout}
                          className="w-full text-left px-6 py-3 text-red-400 hover:bg-white/10 transition-colors"
                        >
                          <span className="text-sm font-medium">Log Out</span>
                        </button>
                      </li>
                    </>
                  )}
                </ul>
              </div>
            )}
          </div>
        </div>
      </nav>
    </div>
  );
};

export default Navbar;
