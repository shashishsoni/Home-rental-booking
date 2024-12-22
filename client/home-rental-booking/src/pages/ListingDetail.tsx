import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { DateRange, RangeKeyDict } from "react-date-range";
import {
  Users,
  Bed,
  Bath,
  MapPin,
  Heart,
  Share2,
  Star,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { facilities } from "../data";
import Navbar from "../components/Navbar";
import Loader from "../components/loader";
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";

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
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
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

  const customDatePickerStyles = `
    .rdrCalendarWrapper {
      background: white;
      border-radius: 1rem;
      font-size: 1rem;
    }
    .rdrDateDisplayWrapper {
      background-color: transparent;
    }
    .rdrDateDisplay {
      margin: 0.5rem;
    }
    .rdrSelected, .rdrInRange, .rdrStartEdge, .rdrEndEdge {
      background: #3b82f6;
      color: white;
    }
    .rdrDayHovered {
      background: #93c5fd !important;
      color: white !important;
    }
    .rdrNextPrevButton {
      background: #f3f4f6;
      border-radius: 50%;
      width: 32px;
      height: 32px;
      margin: 0 0.5rem;
    }
    .rdrNextPrevButton:hover {
      background: #e5e7eb;
    }
    .rdrPprevButton i {
      border-color: transparent #4b5563 transparent transparent;
    }
    .rdrNextButton i {
      border-color: transparent transparent transparent #4b5563;
    }
  `;

  useEffect(() => {
    const styleSheet = document.createElement("style");
    styleSheet.type = "text/css";
    styleSheet.innerText = customDatePickerStyles;
    document.head.appendChild(styleSheet);

    return () => {
      document.head.removeChild(styleSheet);
    };
  }, []);

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

  const handleImageNavigation = (direction: "prev" | "next") => {
    if (!listing) return;

    if (direction === "prev") {
      setCurrentImageIndex((prev) =>
        prev === 0 ? listing.images.length - 1 : prev - 1
      );
    } else {
      setCurrentImageIndex((prev) =>
        prev === listing.images.length - 1 ? 0 : prev + 1
      );
    }
  };

  // Handle date range selection
  const handleSelect = (rangesByKey: RangeKeyDict) => {
    const { startDate, endDate } = rangesByKey.selection;
    if (startDate && endDate) {
      setDateRange([{ startDate, endDate, key: "selection" }]);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 pt-24 pb-16">
          <div className="flex justify-center items-center">
            <Loader />
          </div>
        </div>
      </div>
    );
  }

  if (error || !listing) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="flex items-center justify-center pt-24">
          <div className="bg-white p-8 rounded-lg shadow-lg text-center">
            <h2 className="text-2xl font-bold text-red-600 mb-4">
              {error || "Listing not found"}
            </h2>
            <button
              onClick={() => navigate(-1)}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Go Back
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-[100%] min-h-screen bg-black shadow-[0_25px_50px_-12px_rgba(0,0,0,0.25)] p-9">
      <Navbar />
      <div className="mx-auto px-4 mt-20 pb-20">
        {/* Main Header */}
        <div className="mb-6 space-y-8">
          <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-6">
            <div className="space-y-4">
              <div className="flex-col items-center gap-4">
                <h1 className="text-4xl md:text-7xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-blue-100 via-blue-600 to-indigo-800 tracking-tight [text-shadow:_0_8px_16px_rgba(255,255,255,0.6)]">
                  {listing?.title}
                </h1>
                <br />
                <span className="inline-flex items-center px-4 py-1.5 rounded-full bg-gradient-to-r from-blue-500 to-blue-400 text-white font-medium tracking-wide text-sm shadow-[0_15px_10px_rgba(255,255,255,0.6)] transition-all">
                  {listing.type}
                </span>
              </div>
            </div>{" "}
            <div className="flex gap-4 mt-[-35px] md:mb-0">
              <button className="group flex items-center gap-2 px-6 py-2.5 rounded-full bg-white border border-gray-200 shadow-[0_15px_10px_rgba(255,255,255,0.6)] transition-all duration-200">
                <Share2 className="w-4 h-4" />
                <span className="font-medium">Share</span>
              </button>
              <button className="group flex items-center gap-2 px-6 py-2.5 rounded-full bg-white border border-gray-200 shadow-[0_15px_10px_rgba(255,255,255,0.6)] transition-all duration-200">
                <Heart className="w-4 h-4" />
                <span className="font-medium">Save</span>
              </button>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div className="flex items-center gap-5 text-gray-800">
              <div className="shadow-[0_15px_10px_rgba(255,255,255,0.6)] p-3 rounded-full bg-gradient-to-r from-blue-400 via-blue-100 to-blue-400 sshadow-[0_15px_10px_rgba(255,255,255,0.6)] ring-2 ring-blue-300">
                <MapPin className="w-7 h-7 text-blue-500" />
              </div>
              <span className="text-lg font-semibold bg-gradient-to-r from-blue-100 to-blue-300 text-transparent bg-clip-text tracking-tight relative ">
                {`${listing?.city}, ${listing?.province}, ${listing?.country}`}
              </span>
            </div>
            <div className="shadow-[0_15px_10px_rgba(255,255,255,0.6)] flex items-center gap-4 px-5 py-3 rounded-full bg-gradient-to-r from-white to-gray-50 border border-gray-200 transition-shadow duration-200">
              <div className="flex items-center justify-center w-8 h-8 rounded-full bg-yellow-100 shadow-[0_15px_10px_rgba(255,255,255,0.6)]">
                <Star className="w-5 h-5 text-yellow-500" />
              </div>
              <span className="font-semibold text-lg text-gray-800">4.9</span>
              <span className="text-sm text-gray-600">(128 reviews)</span>
            </div>
          </div>
        </div>

        {/* Host Information */}
        <div className="shadow-[0_15px_10px_rgba(255,255,255,0.6)] mb-12 mt-12 p-8 bg-white rounded-3xl border border-gray-300 transition-all duration-300 ease-in-out">
          <div className="flex items-center gap-8">
            {/* Profile Image */}
            <div className="relative">
              <img
                src={`http://localhost:3001/public${listing?.creator.profileImagePath}`}
                alt={`${listing?.creator.firstname} ${listing?.creator.lastname}`}
                className="w-24 h-24 rounded-full object-cover border-4 border-gray-100 shadow-md"
              />
              <div className="absolute -bottom-2 -right-2 w-7 h-7 bg-green-500 rounded-full border-2 border-gray-100 shadow-sm"></div>
            </div>
            {/* Host Details */}
            <div className="space-y-3">
              <h3 className="text-2xl font-bold text-gray-900">
                Hosted by {listing?.creator.firstname}{" "}
                {listing?.creator.lastname}
              </h3>
              <p className="text-gray-700 flex items-center gap-3">
                <span className="inline-flex px-4 py-1.5 rounded-lg bg-purple-200 text-purple-800 text-sm font-medium">
                  Superhost
                </span>
                <span className="text-gray-500">·</span>
                <span className="text-gray-600 font-medium">
                  5 years hosting
                </span>
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-12">
            {/* Image Gallery */}
            <div className="relative rounded-3xl overflow-hidden w-[1130px] h-[600px] shadow-[0_15px_10px_rgba(255,255,255,0.6)]">
              <img
                src={`http://localhost:3001${listing?.images[currentImageIndex]}`}
                alt={`View ${currentImageIndex + 1}`}
                className="w-full h-full object-fill"
              />
              {/* Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
              {/* Navigation Controls */}
              <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-3 bg-white/90 backdrop-blur-sm rounded-full px-6 py-3 shadow-xl">
                <button
                  onClick={() => handleImageNavigation("prev")}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <span className="font-semibold px-3">
                  {currentImageIndex + 1} / {listing?.images.length}
                </span>
                <button
                  onClick={() => handleImageNavigation("next")}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 ">
              {[
                {
                  icon: (
                    <Users className="w-6 h-6 shadow-[0_15px_10px_rgba(255,255,255,0.6)]" />
                  ),
                  label: "Guests",
                  value: listing?.guestCount,
                },
                {
                  icon: (
                    <Bed className="w-6 h-6 shadow-[0_15px_10px_rgba(255,255,255,0.6)]" />
                  ),
                  label: "Bedrooms",
                  value: listing?.bedroomCount,
                },
                {
                  icon: (
                    <Bath className="w-6 h-6 shadow-[0_15px_10px_rgba(255,255,255,0.6)]" />
                  ),
                  label: "Bathrooms",
                  value: listing?.bathroomCount,
                },
              ].map((stat, index) => (
                <div
                  key={index}
                  className="group bg-white p-6 rounded-xl border border-gray-200 transition-shadow duration-300 shadow-[0_15px_10px_rgba(255,255,255,0.6)]"
                >
                  <div className="flex items-center gap-4">
                    <div className="p-3 rounded-xl bg-gradient-to-r from-blue-100 to-blue-300 text-blue-600 group-hover:scale-110 transition-transform">
                      {stat.icon}
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 font-semibold">
                        {stat.label}
                      </p>
                      <p className="text-3xl font-extrabold text-gray-800">
                        {stat.value}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Description */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8 space-y-6">
              <h2 className="text-3xl font-bold">About this place</h2>
              <p className="text-gray-600 text-lg leading-relaxed">
                {listing?.description}
              </p>
            </div>

            {/* Highlights */}
            {listing?.highlight && (
              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-8 space-y-6">
                <h2 className="text-3xl font-bold text-blue-900">Highlights</h2>
                <p className="text-blue-800 text-xl font-medium">
                  {listing.highlight}
                </p>
                {listing.highlightDescription && (
                  <p className="text-blue-700 text-lg">
                    {listing.highlightDescription}
                  </p>
                )}
              </div>
            )}

            {/* Amenities */}
            <div className="space-y-10 p-8">
              <h2 className="text-3xl font-bold text-gray-800">
                What this place offers
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-8">
                {listing.amenities
                  .map((item) => {
                    try {
                      return JSON.parse(item.replace(/'/g, '"')).trim();
                    } catch (e) {
                      return item.replace(/^['"\[]+|['"\]]+$/g, "").trim();
                    }
                  })
                  .map((cleanedItem, index) => {
                    const facility = facilities.find(
                      (f) => f.name.toLowerCase() === cleanedItem.toLowerCase()
                    );

                    return (
                      <div
                        key={index}
                        className="flex items-center space-x-6 p-6 bg-white rounded-2xl shadow-md hover:shadow-lg hover:bg-gray-50 transition-all duration-300 transform hover:-translate-y-1"
                      >
                        <div className="text-gray-700 text-2xl">
                          {facility?.icon || "🔵"}
                        </div>
                        <span className="text-gray-700 font-semibold text-lg">
                          {facility?.name || cleanedItem}
                        </span>
                      </div>
                    );
                  })}
              </div>
            </div>
          </div>

          {/* Right Column - Booking Card */}
          <div className="lg:col-span-1">
            <div className="sticky top-28 bg-white rounded-2xl border border-gray-200 shadow-xl p-8">
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-baseline gap-2">
                  <span className="text-4xl font-bold">${listing?.price}</span>
                  <span className="text-gray-500 text-lg">/ night</span>
                </div>
                <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-gray-50">
                  <Star className="w-5 h-5 text-yellow-400" />
                  <span className="font-semibold">4.9</span>
                </div>
              </div>

              <div className="mb-8">
                <DateRange
                  ranges={dateRange}
                  onChange={handleSelect}
                  showDateDisplay={false}
                  minDate={new Date()}
                  rangeColors={["#3b82f6"]}
                  className="border border-gray-200 rounded-xl overflow-hidden shadow-sm"
                />
              </div>

              <div className="space-y-4 pt-6 border-t border-gray-200">
                <div className="flex justify-between text-gray-600 text-lg">
                  <span>
                    ${listing?.price} × {dayCount} nights
                  </span>
                  <span>${totalPrice}</span>
                </div>
                <div className="flex justify-between text-xl font-bold">
                  <span>Total</span>
                  <span>${totalPrice}</span>
                </div>
              </div>

              <button
                className={`w-full mt-8 py-4 rounded-xl font-semibold text-lg transition-all duration-300 ${
                  customerId
                    ? "bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
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
  );
};

export default ListingDetails;
