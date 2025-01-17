import { useEffect, useState } from "react";
import { categories } from "../data";
import ListingCard from "./listingcard";
import Loader from "./loader";
import { useDispatch, useSelector } from "react-redux";
import { setListings } from "@/redux/cache";
import { RootState } from "../redux/storecache";
import { Listing } from "@/types/types";

const Listings = () => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);
  const [slectedCategory, setSelectedCategory] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");

  const listings = useSelector((state: RootState) => state.user.listings);

  const getFeedlisting = async () => {
    try {
      const baseUrl = import.meta.env.VITE_API_URL || 'https://home-rental-booking.onrender.com';
      const url = new URL(
        slectedCategory !== "All"
          ? `/listing?category=${slectedCategory}`
          : '/listing',
        baseUrl
      ).toString();

      const response = await fetch(url, {
        method: "GET",
        credentials: "include",
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'Origin': window.location.origin,
          'X-Requested-With': 'XMLHttpRequest'
        }
      });

      if (!response.ok) {
        const text = await response.text();
        console.error('Response error:', {
          status: response.status,
          statusText: response.statusText,
          body: text
        });
        throw new Error(`HTTP error! status: ${response.status}, body: ${text}`);
      }

      const data = await response.json();

      // Sanitize data before updating Redux store
      const sanitizedListings = data.listings.map((listing: any) => ({
        _id: listing._id,
        creator: {
          _id: listing.Creator?._id || listing.Creator,
          firstname: listing.Creator?.firstname || "Unknown",
          lastname: listing.Creator?.lastname || "",
        },
        parsedCreator: listing.Creator
          ? {
              firstname: listing.Creator.firstname || "Unknown",
              lastname: listing.Creator.lastname || "",
              profileImagePath: listing.Creator.profileImagePath || null,
            }
          : {
              firstname: "Unknown",
              lastname: "",
              profileImagePath: null,
            },
        title: listing.title || "Untitled",
        description: listing.description || "No description provided.",
        price: listing.price || 0,
        ListingPhotoPaths: listing.listingImages?.map((img: string) => {
          // Remove any duplicate 'uploads/' and clean the path
          const cleanPath = img
            .replace(/^uploads\/uploads\//, 'uploads/')
            .replace(/^\/+|\/+$/g, '');
          return `${baseUrl}/${cleanPath}`;
        }) || [],
        city: listing.city || "Unknown city",
        province: listing.province || "Unknown province",
        country: listing.country || "Unknown country",
        category: listing.category || "Miscellaneous",
        type: listing.type || "N/A",
        guestCount: listing.guest || 0,
        bedroomCount: listing.bedroom || 0,
        bedCount: listing.bed || 0,
        bathroomCount: listing.bathroom || 0,
        amenities: listing.amenities || [],
        highlight: listing.Highlights || "No highlights provided.",
        highlightDescription:
          listing.Highlightdescription || "No highlight description provided.",
      }));

      dispatch(setListings(sanitizedListings));
      setLoading(false);
    } catch (error) {
      console.error("Failed to fetch listings:", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    getFeedlisting();
  }, [slectedCategory]);

  const filteredCategories = categories.filter((category) =>
    category.label.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="relative min-h-screen flex flex-col items-center overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-800 via-black to-gray-900 opacity-90">
        <div className="absolute w-96 h-96 bg-blue-500 rounded-full opacity-30 blur-3xl animate-pulse top-10 left-20"></div>
        <div className="absolute w-80 h-80 bg-pink-500 rounded-full opacity-30 blur-3xl animate-pulse animation-delay-2000 bottom-10 right-20"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 p-6 w-full max-w-full flex flex-col items-center m-10">
        <h3 className="text-white font-serif text-2xl m-4 underline decoration-blue-500 decoration-2">
          Filter Your Choice
        </h3>

        {/* Search Bar */}
        <div className="mb-6 w-full max-w-3xl">
          <input
            type="text"
            placeholder="Search categories..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-2 rounded-lg border bg-white border-gray-300 shadow-md focus:ring-2 focus:ring-blue-400 focus:outline-none text-gray-800"
          />
        </div>

        {/* Category Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 gap-6 w-full max-w-6xl">
          {filteredCategories.map((Category, index) => (
            <div
              key={index}
              className="bg-white shadow-lg hover:shadow-2xl rounded-lg p-6 flex flex-col items-center text-center transition-all duration-300 transform hover:scale-105 hover:-translate-y-1"
              onClick={() => setSelectedCategory(Category.label)}
            >
              {Category.img ? (
                <img
                  src={Category.img}
                  alt={Category.label}
                  className="w-16 h-16 object-cover rounded-full mb-3"
                />
              ) : (
                <div className="text-5xl text-blue-500 mb-4">
                  {typeof Category.icon === "function" ? (
                    <Category.icon />
                  ) : (
                    Category.icon
                  )}
                </div>
              )}
              <p className="text-gray-700 font-semibold text-lg">
                {Category.label}
              </p>
              {Category.description && (
                <p className="text-gray-500 text-sm mt-2">
                  {Category.description}
                </p>
              )}
            </div>
          ))}
        </div>

        {/* No Results Found */}
        {filteredCategories.length === 0 && (
          <p className="text-gray-400 mt-10">No categories found.</p>
        )}

        {/* Listings */}
        <div className="mb-12 w-[95%] mx-auto">
          <h1 className="text-2xl text-white text-center font-bold mt-28 mb-8">Listings</h1>
          {loading ? (
            <Loader />
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {listings && listings.length > 0 ? (
                listings.map(({ _id, creator, ...rest }: Listing) => (
                  <div key={_id} className="flex justify-center">
                    <ListingCard
                      listingId={_id}
                      creator={creator}
                      {...rest}
                    />
                  </div>
                ))
              ) : (
                <p className="text-white col-span-4">No listings available.</p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Listings;
