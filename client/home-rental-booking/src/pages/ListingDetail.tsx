import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { DateRange, RangeKeyDict } from "react-date-range";
import Navbar from "../components/Navbar";
import Loader from "../components/loader";
import { facilities } from "../data";
import { FaUsers, FaBed, FaBath, FaMapPin } from "react-icons/fa";
import { FaStar as Star } from "react-icons/fa";

interface APIListing {
  _id: string;
  Creator: string;
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
  creator: {
    profileImagePath?: string;
    firstName?: string;
    lastName?: string;
  };
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
    profileImagePath?: string;
    firstName?: string;
    lastName?: string;
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

        const response = await fetch(`http://localhost:3001/listing/${listingId}`);
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
    amenities: data.listing.amenities.map((amenity) => amenity.trim()).filter(Boolean),
    price: data.listing.price,
    images: data.listing.listingImages,
    creator: {
      profileImagePath: data.listing.creator?.profileImagePath || "",
      firstName: data.listing.creator?.firstName || "N/A",
      lastName: data.listing.creator?.lastName || "N/A",
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
          <h2 className="text-xl font-bold text-red-600">{error || "Listing not found"}</h2>
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
    <div className="h-full min-h-screen">
      <Navbar />
      
      {/* Hero Section */}
      <div className=" bg-white px-4 sm:px-6 lg:px-8 max-w-8xl mx-auto">
        <div className="pt-8 pb-12">
          <div className="mt-20 flex items-center space-x-2 text-sm text-gray-500 mb-4">
            <FaMapPin className="w-4 h-4" />
            <span>{`${listing.city}, ${listing.province}, ${listing.country}`}</span>
          </div>
          
          <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-6">{listing.title}</h1>
          
          {/* Host Info */}
          <div className="flex items-center space-x-4">
            <img
              src={`http://localhost:3001${listing.creator?.profileImagePath}`}
              alt={`${listing.creator?.firstName} ${listing.creator?.lastName}`}
              className="w-12 h-12 rounded-full object-cover ring-2 ring-gray-100"
            />
            <div>
              <p className="font-medium text-gray-900">
                {listing.creator?.firstName} {listing.creator?.lastName}
              </p>
              <p className="text-sm text-gray-500">Superhost</p>
            </div>
          </div>
        </div>

        {/* Image Gallery */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
          {listing.images.map((path, index) => (
            <div key={index} className={`${index === 0 ? 'col-span-2 row-span-2' : ''}`}>
              <img
                src={`http://localhost:3001${path}`}
                alt={`Listing view ${index + 1}`}
                className="w-full h-full object-cover rounded-2xl"
              />
            </div>
          ))}
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 pb-16">
          {/* Left Column - Details */}
          <div className="lg:col-span-2 space-y-12">
            {/* Quick Stats */}
            <div className="flex items-center justify-between p-6 rounded-2xl bg-gray-50">
              <div className="flex items-center space-x-3">
                <FaUsers className="w-5 h-5 text-gray-700" />
                <span className="font-medium">{listing.guestCount} guests</span>
              </div>
              <div className="flex items-center space-x-3">
                <FaBed className="w-5 h-5 text-gray-700" />
                <span className="font-medium">{listing.bedroomCount} bedrooms</span>
              </div>
              <div className="flex items-center space-x-3">
                <FaBath className="w-5 h-5 text-gray-700" />
                <span className="font-medium">{listing.bathroomCount} baths</span>
              </div>
            </div>

            {/* Description */}
            <div className="space-y-6">
              <h2 className="text-2xl font-semibold">About this place</h2>
              <p className="text-gray-600 leading-relaxed">{listing.description}</p>
            </div>

            {/* Highlights */}
            {listing.highlight && (
              <div className="space-y-6">
                <h2 className="text-2xl font-semibold">What makes this place special</h2>
                <div className="p-6 rounded-2xl bg-gray-50">
                  <p className="text-gray-600">{listing.highlight}</p>
                  {listing.highlightDescription && (
                    <p className="mt-4 text-gray-600">{listing.highlightDescription}</p>
                  )}
                </div>
              </div>
            )}

            {/* Amenities */}
            <div className="space-y-6">
              <h2 className="text-2xl font-semibold">What this place offers</h2>
              <div className="grid grid-cols-2 gap-6">
                {listing.amenities.map((item, index) => {
                  const facility = facilities.find((f) => f.name === item);
                  return (
                    <div key={index} className="flex items-center space-x-4 p-4 rounded-xl hover:bg-gray-50 transition-colors">
                      <div className="text-gray-700">{facility?.icon || "🔵"}</div>
                      <span className="text-gray-600">{facility?.name || item}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Right Column - Booking */}
          <div className="lg:col-span-1">
            <div className="sticky top-24">
              <div className="rounded-2xl border border-gray-200 shadow-lg overflow-hidden">
                <div className="p-6">
                  <div className="flex items-baseline justify-between mb-6">
                    <div className="flex items-baseline space-x-1">
                      <span className="text-3xl font-bold">${listing.price}</span>
                      <span className="text-gray-500">night</span>
                    </div>
                    <div className="flex items-center space-x-1 text-sm">
                      <Star className="w-4 h-4 fill-current text-yellow-400" />
                      <span className="font-medium">4.9</span>
                    </div>
                  </div>

                  <DateRange
                    ranges={dateRange}
                    onChange={handleSelect}
                    minDate={new Date()}
                    className="mb-6"
                  />

                  <div className="space-y-4">
                    <div className="flex justify-between py-3">
                      <span className="text-gray-600">
                        ${listing.price} × {dayCount} {dayCount === 1 ? "night" : "nights"}
                      </span>
                      <span className="font-medium">${totalPrice}</span>
                    </div>
                    
                    <div className="border-t pt-4">
                      <div className="flex justify-between items-center">
                        <span className="font-semibold text-lg">Total</span>
                        <span className="font-semibold text-lg">${totalPrice}</span>
                      </div>
                    </div>
                  </div>

                  <button
                    className={`w-full mt-6 py-4 px-6 rounded-xl font-medium text-base transition-all
                      ${customerId
                        ? "bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white shadow-md hover:shadow-lg"
                        : "bg-gray-100 text-gray-400 cursor-not-allowed"
                      }`}
                    disabled={!customerId}
                  >
                    {customerId ? "Reserve now" : "Please login to book"}
                  </button>
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
