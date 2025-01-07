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
      <div className="min-h-screen flex flex-col bg-black bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(120,119,198,0.3),rgba(255,255,255,0))] bg-fixed overflow-x-hidden">
        <Navbar />
        <div className="flex-grow w-full max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
          <div className="text-center mb-16">
            <h1 className="text-5xl font-bold mb-4">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-400 via-pink-500 to-red-500">
                Your Wishlist
              </span>
            </h1>
            <p className="text-gray-400 text-lg">
              {wishlistListings.length} {wishlistListings.length === 1 ? "property" : "properties"} saved
            </p>
          </div>

          {/* Grid Layout */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
            {wishlistListings.map((listing: any) => (
              <div key={listing._id} className="flex justify-center">
                <ListingCard
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
              </div>
            ))}
          </div>
        </div>
        <Footer />
      </div>
    </>
  );
};

export default WishlistPage;
