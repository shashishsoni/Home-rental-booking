import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { DateRange, RangeKeyDict } from "react-date-range";
import Navbar from "../components/Navbar";
import Loader from "../components/loader";
import { facilities } from "../data";
import { FaUsers, FaBed, FaBath, FaMapPin} from "react-icons/fa";
import { FaStar as Star } from "react-icons/fa";

interface APIListing {
  _id: string;
  creator: string;
  parsedCreator: {
    firstname: string;
    lastname: string;
    profileImagePath: string;
  };
  title: string;
  type: string;
  city: string;
  province: string;
  country: string;
  guest: number;
  bedroom: number;
  bathroom: number;
  description: string;
  Highlights: string;
  Highlightdescription: string;
  amenities: string[];
  price: number;
  listingImages: string[];
}

interface Listing {
  title: string;
  type: string;
  city: string;
  province: string;
  country: string;
  guestCount: number;
  bedroomCount: number;
  bathroomCount: number;
  description: string;
  highlight: string;
  highlightDescription: string;
  amenities: string[];
  price: number;
  images: string[];
  creator: {
    profileImagePath: string;
    firstname: string;
    lastname: string;
  };
}

interface CustomDateRange {
  startDate: Date;
  endDate: Date;
  key: string;
}

const ListingDetails: React.FC = () => {
  const { listingId } = useParams<{ listingId: string }>();
  const navigate = useNavigate();
  const customerId = useSelector((state: any) => state.user?._id);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [listing, setListing] = useState<Listing | null>(null);
  const [dateRange, setDateRange] = useState<CustomDateRange[]>([
    {
      startDate: new Date(),
      endDate: new Date(),
      key: "selection",
    },
  ]);

  console.log(listing);

  // Calculate total days and price
  const dayCount = Math.max(
    1,
    Math.round(
      (dateRange[0].endDate.getTime() - dateRange[0].startDate.getTime()) /
        (1000 * 60 * 60 * 24)
    )
  );
  const totalPrice = listing ? listing.price * dayCount : 0;

  // Fetch listing details
  useEffect(() => {
    const fetchListingDetails = async () => {
      try {
        if (!listingId) throw new Error("Listing ID is missing");

        const response = await fetch(
          `http://localhost:3001/listing/${listingId}`
        );
        if (!response.ok) throw new Error("Failed to fetch listing");

        const data = await response.json();
        const transformedListing = transformApiResponse(data);
        setListing(transformedListing);
        setLoading(false);
      } catch (err: any) {
        setError(err.message || "An error occurred");
        setLoading(false);
      }
    };

    fetchListingDetails();
  }, [listingId]);

  // Transform API response to match Listing interface
  const transformApiResponse = (data: { listing: APIListing }): Listing => ({
    title: data.listing.title,
    type: data.listing.type,
    city: data.listing.city,
    province: data.listing.province,
    country: data.listing.country,
    guestCount: data.listing.guest,
    bedroomCount: data.listing.bedroom,
    bathroomCount: data.listing.bathroom,
    description: data.listing.description,
    highlight: data.listing.Highlights || "",
    highlightDescription: data.listing.Highlightdescription || "",
    amenities: data.listing.amenities
      .map((amenity) => amenity.trim())
      .filter(Boolean),
    price: data.listing.price,
    images: data.listing.listingImages,
    creator: {
      profileImagePath: data.listing.parsedCreator?.profileImagePath
        ? `/uploads/${data.listing.parsedCreator.profileImagePath}`
        : "/uploads/default-profile.png", // Default image
      firstname: data.listing.parsedCreator?.firstname || "Unknown",
      lastname: data.listing.parsedCreator?.lastname || "",
    },
  });

  // Handle date range selection
  const handleSelect = (rangesByKey: RangeKeyDict) => {
    const { startDate, endDate } = rangesByKey.selection;
    if (startDate && endDate) {
      setDateRange([{ startDate, endDate, key: "selection" }]);
    }
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="flex justify-center items-center min-h-screen">
          <Loader />
        </div>
      </>
    );
  }

  if (error || !listing) {
    return (
      <>
        <Navbar />
        <div className="flex flex-col items-center justify-center min-h-screen">
          <h2 className="text-xl font-bold text-red-600">
            {error || "Listing not found"}
          </h2>
          <button
            onClick={() => navigate(-1)}
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Go Back
          </button>
        </div>
      </>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-gray-50 to-white">
      <Navbar />
      <div className="mt-24 flex-grow">
        <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8">
          {/* Location and Title Section */}
          <div className="pt-10 pb-8">
            <div className="inline-flex items-center gap-2 bg-blue-50/80 rounded-full px-4 py-1.5 mb-4">
              <span className="text-blue-600 font-medium capitalize">{listing.type}</span>
              <span className="text-gray-300">•</span>
              <div className="flex items-center gap-2">
                <FaMapPin className="w-4 h-4 text-blue-600" />
                <span className="text-gray-600">{`${listing.city}, ${listing.province}, ${listing.country}`}</span>
              </div>
            </div>
  
            <h1 className="text-4xl font-bold text-gray-900 mb-6">{listing.title}</h1>
  
            {/* Host Info */}
            <div className="flex items-center gap-4">
              {listing.creator.profileImagePath ? (
                <img
                  src={`http://localhost:3001/public${listing.creator.profileImagePath}`}
                  alt={`${listing.creator.firstname} ${listing.creator.lastname}`}
                  className="w-12 h-12 rounded-full object-cover border-2 border-gray-100"
                />
              ) : (
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 text-white rounded-full flex items-center justify-center">
                  <span className="text-lg font-semibold">
                    {listing.creator.firstname.charAt(0).toUpperCase()}
                  </span>
                </div>
              )}
              <div>
                <p className="text-lg font-medium text-gray-900">
                  {listing.creator.firstname} {listing.creator.lastname}
                </p>
                <p className="text-sm text-blue-600 font-medium">Superhost</p>
              </div>
            </div>
          </div>
  
          {/* Image Gallery */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12 h-[500px]">
            {listing.images.map((path, index) => (
              <div
                key={index}
                className={`relative group rounded-xl overflow-hidden ${
                  index === 0 ? "col-span-2 row-span-2" : ""
                }`}
              >
                <img
                  src={`http://localhost:3001${path}`}
                  alt={`Listing view ${index + 1}`}
                  className="w-full h-full object-cover transition duration-300 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/10 group-hover:to-black/20 transition duration-300" />
              </div>
            ))}
          </div>
  
          {/* Main Content */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column */}
            <div className="lg:col-span-2 space-y-10">
              {/* Quick Stats */}
              <div className="grid grid-cols-3 gap-4">
                {[
                  { icon: <FaUsers className="w-6 h-6" />, label: "Guests", value: listing.guestCount },
                  { icon: <FaBed className="w-6 h-6" />, label: "Bedrooms", value: listing.bedroomCount },
                  { icon: <FaBath className="w-6 h-6" />, label: "Bathrooms", value: listing.bathroomCount }
                ].map((stat, index) => (
                  <div key={index} className="bg-white/50 backdrop-blur-sm p-4 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition duration-300">
                    <div className="flex items-center gap-4">
                      <div className="p-3 bg-blue-50 rounded-lg text-blue-600">
                        {stat.icon}
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">{stat.label}</p>
                        <p className="text-xl font-semibold text-gray-900">{stat.value}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
  
              {/* Description */}
              <div className="bg-white/50 backdrop-blur-sm p-6 rounded-xl border border-gray-100 shadow-sm">
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">About this place</h2>
                <p className="text-gray-600 leading-relaxed">{listing.description}</p>
              </div>
  
              {/* Highlights */}
              {listing.highlight && (
                <div className="bg-gradient-to-br from-blue-50/80 to-indigo-50/80 backdrop-blur-sm p-6 rounded-xl border border-blue-100">
                  <h2 className="text-2xl font-semibold text-gray-900 mb-4">What makes this place special</h2>
                  <p className="text-gray-700">{listing.highlight}</p>
                  {listing.highlightDescription && (
                    <p className="mt-4 text-gray-600">{listing.highlightDescription}</p>
                  )}
                </div>
              )}
  
              {/* Amenities */}
            <div className="space-y-6">
              <h2 className="text-2xl font-semibold">What this place offers</h2>
              <div className="grid grid-cols-2 gap-6">
                {/* Clean and map amenities */}
                {listing.amenities
                  .map((item) => {
                    try {
                      // Parse and clean amenity strings
                      return JSON.parse(item.replace(/'/g, '"')).trim();
                    } catch (e) {
                      // Fallback for improperly formatted strings
                      return item.replace(/^['"\[]+|['"\]]+$/g, "").trim();
                    }
                  })
                  .map((cleanedItem, index) => {
                    // Match cleaned amenities with facilities
                    const facility = facilities.find(
                      (f) => f.name.toLowerCase() === cleanedItem.toLowerCase()
                    );

                    return (
                      <div
                        key={index}
                        className="flex items-center space-x-4 p-4 rounded-xl hover:bg-gray-50 transition-colors transform hover:scale-105"
                      >
                        <div className="text-gray-700 text-xl">
                          {facility?.icon || "🔵"}
                        </div>
                        <span className="text-gray-600 font-medium">
                          {facility?.name || cleanedItem}
                        </span>
                      </div>
                    );
                  })}
              </div>
            </div>
          </div>
  
            {/* Right Column - Booking */}
            <div className="lg:col-span-1">
              <div className="sticky top-24">
                <div className="bg-white/70 backdrop-blur-sm rounded-xl border border-gray-200 shadow-lg overflow-hidden">
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-6">
                      <div className="flex items-baseline gap-1">
                        <span className="text-3xl font-bold text-gray-900">${listing.price}</span>
                        <span className="text-gray-500">night</span>
                      </div>
                      <div className="inline-flex items-center gap-1.5 bg-blue-50 px-3 py-1.5 rounded-lg">
                        <Star className="w-4 h-4 text-yellow-400" />
                        <span className="font-medium text-gray-700">4.9</span>
                      </div>
                    </div>
  
                    <div className="[&_.rdrCalendarWrapper]:bg-white/80 [&_.rdrDateDisplayWrapper]:bg-transparent [&_.rdrMonthAndYearPickers_select]:bg-gray-50 [&_.rdrMonthAndYearPickers_select]:border-gray-200 [&_.rdrMonth]:p-0 [&_.rdrDay]:bg-transparent [&_.rdrDayNumber]:text-gray-700 [&_.rdrDayNumber]:font-medium [&_.rdrSelected]:bg-transparent [&_.rdrStartEdge]:bg-blue-600 [&_.rdrEndEdge]:bg-blue-600 [&_.rdrInRange]:bg-blue-50 [&_.rdrDayDisabled]:bg-transparent [&_.rdrDayDisabled_.rdrDayNumber_span]:text-gray-300">
                      <DateRange
                        ranges={dateRange}
                        onChange={handleSelect}
                        showDateDisplay={false}
                        minDate={new Date()}
                        className="mb-6"
                        rangeColors={['#2563EB']}
                      />
                    </div>
  
                    <div className="space-y-4 pt-4 border-t border-gray-100">
                      <div className="flex justify-between text-gray-600">
                        <span>${listing.price} × {dayCount} {dayCount === 1 ? "night" : "nights"}</span>
                        <span className="font-medium">${totalPrice}</span>
                      </div>
                      <div className="flex justify-between text-lg font-semibold text-gray-900">
                        <span>Total</span>
                        <span>${totalPrice}</span>
                      </div>
                    </div>
  
                    <button
                      className={`w-full mt-6 py-4 px-6 rounded-xl font-medium text-base transition-all
                        ${customerId
                          ? "bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-md hover:shadow-lg"
                          : "bg-gray-100 text-gray-400 cursor-not-allowed"
                        }`}
                      disabled={!customerId}
                    >
                      {customerId ? "Reserve Now" : "Sign in to Book"}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ListingDetails;
