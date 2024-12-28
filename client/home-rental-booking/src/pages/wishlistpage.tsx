import { useEffect, useMemo, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import Navbar from "../components/Navbar";
import ListingCard from "../components/listingcard";
import { setListings, setWishlist } from "../redux/cache";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { Listing as ListingType } from "../types/types";
import Footer from "../components/Footer";
import { selectWishlist, selectUser, selectAllListings } from '../redux/selectors';

interface Listing extends ListingType {
  _id: string;
  creator: {
    _id: string;
    firstname: string;
    lastname: string;
    profileImagePath: string;
    Email: string;
  };
  ListingPhotoPaths: string[];
  city: string;
  province: string;
  country: string;
  category: string;
  type: string;
  price: number;
}

const WishlistPage = () => {
  const dispatch = useDispatch();
  const user = useSelector(selectUser);
  const wishlist = useSelector(selectWishlist);
  const allListings = useSelector(selectAllListings);
  const [loading, setLoading] = useState(false);
  const initializeRef = useRef(false);

  // Single useEffect for localStorage management
  useEffect(() => {
    // Handle logout
    if (!user) {
      localStorage.removeItem("userWishlist");
      return;
    }

    // One-time initialization
    if (!initializeRef.current) {
      const savedWishlist = localStorage.getItem("userWishlist");
      if (savedWishlist) {
        try {
          const parsedWishlist = JSON.parse(savedWishlist);
          if (Array.isArray(parsedWishlist)) {
            dispatch(setWishlist(parsedWishlist));
          }
        } catch (error) {
          console.error("Error parsing wishlist from localStorage:", error);
        }
      }
      initializeRef.current = true;
      return;
    }

    // Debounced localStorage update
    const timeoutId = setTimeout(() => {
      if (Array.isArray(wishlist)) {
        localStorage.setItem("userWishlist", JSON.stringify(wishlist));
      }
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [user, wishlist, dispatch]);

  // Fetch listings if not in localStorage
  useEffect(() => {
    const fetchListings = async () => {
      if (!user || !wishlist?.length || loading) return;

      setLoading(true);
      try {
        // Load saved listings from localStorage
        const savedListings = localStorage.getItem("wishlistListings");
        const parsedSavedListings = savedListings
          ? JSON.parse(savedListings)
          : [];

        // Update Redux with saved listings first
        if (parsedSavedListings.length > 0) {
          dispatch(setListings(parsedSavedListings));
        }

        // Find listings that need to be fetched
        const missingListings = wishlist.filter(
          (id: string) =>
            !parsedSavedListings.some((listing: any) => listing._id === id)
        );

        if (missingListings.length > 0) {
          const newListings = await Promise.all(
            missingListings.map(async (listingId: string) => {
              try {
                const response = await fetch(`${import.meta.env.VITE_API_URL}/listing/${listingId}`);
                if (!response.ok) return null;
                const data = await response.json();

                if (!data?.listing) return null;
                const listing = data.listing;

                return {
                  ...listing,
                  ListingPhotoPaths:
                    listing.listingImages?.map((path: string) => {
                      const cleanPath = cleanImagePath(path);
                      return `${import.meta.env.VITE_API_URL}/${cleanPath}`;
                    }) || [],
                  creator: {
                    _id: listing.Creator?._id || listing.creator?._id,
                    firstname:
                      listing.Creator?.firstname ||
                      listing.creator?.firstname ||
                      "Unknown",
                    lastname:
                      listing.Creator?.lastname ||
                      listing.creator?.lastname ||
                      "Host",
                    Email:
                      listing.Creator?.Email || listing.creator?.Email || "",
                    profileImagePath: listing.Creator?.profileImagePath
                      ? `${import.meta.env.VITE_API_URL}/uploads/${listing.Creator.profileImagePath}`
                      : listing.creator?.profileImagePath
                      ? `${import.meta.env.VITE_API_URL}/uploads/${listing.creator.profileImagePath}`
                      : "/default-avatar.png",
                  },
                };
              } catch (error) {
                console.error(`Error fetching listing ${listingId}:`, error);
                return null;
              }
            })
          );

          const validNewListings = newListings.filter(Boolean);

          // Combine with existing listings, removing duplicates
          const allValidListings = [...parsedSavedListings];
          validNewListings.forEach((newListing) => {
            if (
              !allValidListings.some(
                (existing) => existing._id === newListing._id
              )
            ) {
              allValidListings.push(newListing);
            }
          });

          // Update both localStorage and Redux
          localStorage.setItem(
            "wishlistListings",
            JSON.stringify(allValidListings)
          );
          dispatch(setListings(allValidListings));
        }
      } catch (error) {
        console.error("Error in loadAndFetchListings:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchListings();
  }, [user, wishlist, dispatch, loading]);

  const wishlistListings = useMemo(() => {
    return allListings.filter((listing: any) => wishlist.includes(listing._id));
  }, [allListings, wishlist]);

  const [selectedListing, setSelectedListing] = useState<Listing | null>(null);

  const cleanImagePath = (path: string) => {
    return path.replace(/^\/?(public\/)?/, "");
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-black bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(120,119,198,0.3),rgba(255,255,255,0))]">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 py-32 text-center">
          <h1 className="text-4xl font-bold text-white mb-6">
            Please Login to View Your Wishlist
          </h1>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="min-h-screen bg-black bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(120,119,198,0.3),rgba(255,255,255,0))]">
        <Navbar />
        <div className="mb-12 max-w-full w-screen mx-auto px-4 py-32">
          <div className="text-center mb-16">
            <h1 className="text-5xl font-bold mb-4">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-400 via-pink-500 to-red-500">
                Your Wishlist
              </span>
            </h1>
            <p className="text-gray-400 text-lg">
              {wishlistListings.length}{" "}
              {wishlistListings.length === 1 ? "property" : "properties"} saved
            </p>
          </div>

          {!wishlistListings.length ? (
            <div className="text-center py-16 bg-white/5 backdrop-blur-lg rounded-2xl border border-white/10">
              <h2 className="text-2xl font-semibold text-white mb-4">
                Your wishlist is empty
              </h2>
              <p className="text-gray-400">
                Start saving your favorite properties!
              </p>
            </div>
          ) : (
            <div className="max-w-7xl items-center justify-center mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {wishlistListings.map((listing: any) => {
                if (!listing || !listing._id) return null;

                return (
                  <ListingCard
                    key={listing._id}
                    listingId={listing._id}
                    creator={listing.creator}
                    ListingPhotoPaths={listing.ListingPhotoPaths}
                    city={listing.city}
                    province={listing.province}
                    country={listing.country}
                    category={listing.category}
                    type={listing.type}
                    price={listing.price}
                  />
                );
              })}
            </div>
          )}

          {/* Sliding info panel */}
          <AnimatePresence>
            {selectedListing && (
              <motion.div
                initial={{ x: "100%" }}
                animate={{ x: 0 }}
                exit={{ x: "100%" }}
                transition={{ type: "spring", damping: 20 }}
                className="fixed right-0 top-0 h-full w-96 bg-black/90 backdrop-blur-lg border-l border-white/10 overflow-y-auto"
              >
                {/* Image Carousel */}
                <div className="relative h-64 w-full">
                  {selectedListing?.ListingPhotoPaths &&
                  selectedListing.ListingPhotoPaths.length > 0 ? (
                    <img
                      src={selectedListing.ListingPhotoPaths[0]}
                      alt="Property"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-gray-800 flex items-center justify-center">
                      <span className="text-gray-400">No image available</span>
                    </div>
                  )}
                  {/* Close button */}
                  <button
                    onClick={() => setSelectedListing(null)}
                    className="absolute top-4 right-4 p-2 bg-black/50 rounded-full text-white hover:bg-black/70"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-6 w-6"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                </div>

                {/* Host Info */}
                <div className="p-6">
                  <div className="flex items-center space-x-4 mb-6">
                    <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-white/10">
                      <img
                        src={selectedListing.creator?.profileImagePath || "/default-avatar.png"}
                        alt="Host"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-white">
                        {selectedListing.creator?.firstname}{" "}
                        {selectedListing.creator?.lastname}
                      </h3>
                      <p className="text-gray-400">Host</p>
                    </div>
                  </div>

                  {/* Property Details */}
                  <div className="space-y-4">
                    <div className="p-4 bg-white/5 rounded-lg">
                      <h4 className="text-lg font-semibold text-white mb-2">
                        Property Details
                      </h4>
                      <div className="space-y-2 text-gray-300">
                        <p className="flex items-center">
                          <span className="font-medium">Type:</span>
                          <span className="ml-2">{selectedListing.type}</span>
                        </p>
                        <p className="flex items-center">
                          <span className="font-medium">Category:</span>
                          <span className="ml-2">{selectedListing.category}</span>
                        </p>
                        <p className="flex items-center">
                          <span className="font-medium">Location:</span>
                          <span className="ml-2">
                            {selectedListing.city}, {selectedListing.country}
                          </span>
                        </p>
                        <p className="flex items-center">
                          <span className="font-medium">Price:</span>
                          <span className="ml-2">₹{selectedListing.price}/night</span>
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default WishlistPage;
