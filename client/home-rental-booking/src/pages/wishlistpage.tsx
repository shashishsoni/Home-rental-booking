import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Listing } from "../types/types";
import Navbar from "../components/Navbar";
import { Loader } from "lucide-react";
import ListingCard from "../components/listingcard";

const WishlistPage = () => {
  const [loading, setLoading] = useState(true);
  const [wishlistItems, setWishlistItems] = useState<Listing[]>([]);
  const user = useSelector((state: any) => state.user?.user);
  const wishlist = useSelector((state: any) => state.user?.wishlist || []);

  useEffect(() => {
    const fetchWishlistItems = async () => {
      if (!wishlist?.length) {
        setLoading(false);
        return;
      }

      try {
        const items = await Promise.all(
          wishlist.map(async (listingId: string) => {
            try {
              const response = await fetch(`http://localhost:3001/listing/${listingId}`);
              if (!response.ok) {
                console.error(`Failed to fetch listing ${listingId}`);
                return null;
              }
              const data = await response.json();
              return data.listing;
            } catch (error) {
              console.error(`Error fetching listing ${listingId}:`, error);
              return null;
            }
          })
        );

        // Filter out any null results and update state
        setWishlistItems(items.filter((item): item is Listing => item !== null));
      } catch (error) {
        console.error("Error fetching wishlist items:", error);
      } finally {
        setLoading(false);
      }
    };

    if (user && wishlist) {
      fetchWishlistItems();
    }
  }, [wishlist, user]);

  if (!user) {
    return (
      <div className="min-h-screen bg-black bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(120,119,198,0.3),rgba(255,255,255,0))]">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 py-32 text-center">
          <h1 className="text-4xl font-bold text-white mb-6">Please Login to View Your Wishlist</h1>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-black bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(120,119,198,0.3),rgba(255,255,255,0))]">
        <Navbar />
        <div className="flex items-center justify-center min-h-[80vh]">
          <Loader className="w-8 h-8 animate-spin text-purple-500" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(120,119,198,0.3),rgba(255,255,255,0))]">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 py-32">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold mb-4">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-400 via-pink-500 to-red-500">
              Your Wishlist
            </span>
          </h1>
          <p className="text-gray-400 text-lg">
            {wishlistItems.length} {wishlistItems.length === 1 ? 'property' : 'properties'} saved
          </p>
        </div>

        {wishlistItems.length === 0 ? (
          <div className="text-center py-16 bg-white/5 backdrop-blur-lg rounded-2xl border border-white/10">
            <h2 className="text-2xl font-semibold text-white mb-4">Your wishlist is empty</h2>
            <p className="text-gray-400">Start saving your favorite properties!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {wishlistItems.map((listing) => (
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
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default WishlistPage;
