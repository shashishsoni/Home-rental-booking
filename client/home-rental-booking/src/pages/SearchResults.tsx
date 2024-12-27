import  { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { fadeIn } from "../utils/animations";
import Navbar from "../components/Navbar";
import { Loader } from "lucide-react";
import { useDispatch, useSelector } from 'react-redux';
import { setSearchResults, setSearchLoading, setSearchError } from '../redux/cache';
import { RootState } from '../redux/storecache';
import { MapPin } from "lucide-react";
import Footer from '../components/Footer';

interface Listing {
  _id: string;
  title: string;
  category: string;
  type: string;
  city: string;
  country: string;
  price: number;
  listingImages: string[];
  Creator: {
    firstname: string;
    lastname: string;
    profileImagePath: string;
  };
}

const SearchResults = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  const navigate = useNavigate();
  const searchQuery = new URLSearchParams(location.search).get("q");
  
  // Get state from Redux instead of local state
  const { searchResults: listings, loading, error } = useSelector(
    (state: RootState) => state.search as { 
      searchResults: Listing[],
      loading: boolean,
      error: string | null 
    }
  );

  // Add this state for image slideshow
  const [currentImageIndexes, setCurrentImageIndexes] = useState<{ [key: string]: number }>({});

  useEffect(() => {
    const fetchSearchResults = async () => {
      dispatch(setSearchLoading(true));
      dispatch(setSearchError(null));
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/listing/search?q=${searchQuery}`, {
          headers: {
            'Content-Type': 'application/json'
          }
        });
        
        if (!response.ok) {
          throw new Error('Failed to fetch search results');
        }
        
        const data = await response.json();
        dispatch(setSearchResults(data.listings || []));
      } catch (error) {
        console.error("Error fetching search results:", error);
        dispatch(setSearchError('Failed to fetch search results'));
      } finally {
        dispatch(setSearchLoading(false));
      }
    };

    if (searchQuery) {
      fetchSearchResults();
    } else {
      dispatch(setSearchLoading(false));
    }
  }, [searchQuery, dispatch]);

  // Add this effect for image slideshow
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndexes(prev => {
        const newIndexes = { ...prev };
        listings.forEach(listing => {
          if (listing.listingImages?.length) {
            newIndexes[listing._id] = ((prev[listing._id] || 0) + 1) % listing.listingImages.length;
          }
        });
        return newIndexes;
      });
    }, 3000); // Change image every 3 seconds

    return () => clearInterval(interval);
  }, [listings]);

  if (loading) {
    return (
      <div className="min-h-screen bg-black">
        <Navbar />
        <div className="flex items-center justify-center h-[calc(100vh-80px)]">
          <Loader className="w-8 h-8 animate-spin text-purple-500" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-black">
        <Navbar />
        <div className="flex items-center justify-center h-[calc(100vh-80px)] text-white">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(120,119,198,0.3),rgba(255,255,255,0))] flex flex-col">
      <Navbar />
      <div className="mb-12 flex flex-col items-center w-screen max-w-full min-h-screen pt-24 px-4">
        <div className="text-center mb-10 w-full">
          <h1 className="mt-12 text-4xl font-bold text-white mb-4">
            Search Results for "{searchQuery}"
          </h1>
          <p className="text-gray-400">
            Found {listings.length} {listings.length === 1 ? 'listing' : 'listings'}
          </p>
        </div>

        <div className="w-full max-w-[1400px] mx-auto mb-12">
          <div className="grid grid-cols-3 gap-8 place-items-center">
            {listings.map((listing, index) => (
              <motion.div
                key={listing._id}
                variants={fadeIn('up', 0.1 * (index + 1))}
                initial="hidden"
                animate="show"
                onClick={() => navigate(`/listing/${listing._id}`)}
                className="border border-white/20 w-full max-w-[400px] group relative bg-black/40 backdrop-blur-xl rounded-3xl overflow-hidden 
                  hover:shadow-[0_20px_60px_-12px_rgba(120,119,198,0.5)] 
                  transition-all duration-500 cursor-pointer"
              >
                <div className="items-center relative h-[300px] overflow-hidden">
                  <div 
                    className="flex transition-transform duration-700 ease-out h-full"
                    style={{ 
                      transform: `translateX(-${(currentImageIndexes[listing._id] || 0) * 100}%)`,
                      width: `${listing.listingImages.length * 100}%`
                    }}
                  >
                    {listing.listingImages.map((image: string, imgIndex: number) => (
                      <div
                        key={imgIndex}
                        className="relative w-full h-full flex-shrink-0"
                      >
                        <img
                          src={image?.startsWith('http') 
                            ? image 
                            : `${import.meta.env.VITE_API_URL}/uploads/${image?.replace(/^.*[\\\/]/, '')}`
                          }
                          alt={`${listing.title} - Image ${imgIndex + 1}`}
                          className="w-[405px] h-[300px] object-fill"
                          onError={(e) => {
                            e.currentTarget.src = '/placeholder-house.jpg'
                          }}
                        />
                      </div>
                    ))}
                  </div>

                  <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-10">
                    {listing.listingImages.map((_: string, imgIndex: number) => (
                      <button
                        key={imgIndex}
                        onClick={(e) => {
                          e.stopPropagation();
                          setCurrentImageIndexes(prev => ({
                            ...prev,
                            [listing._id]: imgIndex
                          }));
                        }}
                        className={`w-2 h-2 rounded-full transition-all duration-300 ${
                          imgIndex === (currentImageIndexes[listing._id] || 0)
                            ? 'bg-white scale-125'
                            : 'bg-white/50 hover:bg-white/75'
                        }`}
                      />
                    ))}
                  </div>

                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent opacity-50 group-hover:opacity-70 transition-opacity duration-500" />
                  
                  <div className="absolute top-4 right-4 bg-white/10 backdrop-blur-md px-4 py-2 rounded-full border border-white/20">
                    <span className="text-white font-bold">₹{listing.price.toLocaleString()}</span>
                    <span className="text-white/70 text-sm">/night</span>
                  </div>
                </div>

                <div className="p-6 space-y-4">
                  <div>
                    <h3 className="text-2xl font-bold text-white mb-2 group-hover:text-purple-400 transition-colors">
                      {listing.title}
                    </h3>
                    <div className="flex items-center text-gray-400">
                      <MapPin className="w-4 h-4 mr-2 text-purple-400" />
                      <span>{listing.city}, {listing.country}</span>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    <span className="px-3 py-1 bg-purple-500/20 rounded-full text-purple-400 text-sm border border-purple-500/20">
                      {listing.category}
                    </span>
                    <span className="px-3 py-1 bg-blue-500/20 rounded-full text-blue-400 text-sm border border-blue-500/20">
                      {listing.type}
                    </span>
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t border-white/10">
                    <div className="flex items-center space-x-3">
                      <div className="relative">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-r from-purple-500 to-pink-500" />
                        <img
                          src={listing.Creator.profileImagePath.startsWith('http') 
                            ? listing.Creator.profileImagePath 
                            : `${import.meta.env.VITE_API_URL}/uploads/${listing.Creator.profileImagePath}`
                          }
                          alt={`${listing.Creator.firstname} ${listing.Creator.lastname}`}
                          className="absolute inset-0 w-10 h-10 rounded-full object-cover border-2 border-white"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            if (!target.src.includes('default-avatar.png')) {
                              target.src = '/default-avatar.png';
                            }
                          }}
                        />
                      </div>
                      <div>
                        <p className="text-white font-medium">
                          {listing.Creator.firstname} {listing.Creator.lastname || ''}
                        </p>
                        <p className="text-gray-400 text-sm">Host</p>
                      </div>
                    </div>
                    
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/listing/${listing._id}`);
                      }}
                      className="px-4 py-2 bg-white/10 hover:bg-white/20 rounded-full text-white text-sm transition-colors duration-300"
                    >
                      View Details
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default SearchResults; 