import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { addTrip } from "@/redux/cache";
import { useSelector, useDispatch } from "react-redux";
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
import { motion } from "framer-motion";
import { fadeIn } from "../utils/animations";
import Footer from '../components/Footer';
import PaymentModal from '../components/PaymentModal';


interface APIListing {
  _id: string;
  title: string;
  category: string;
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
  Creator: {
    _id: string;
    firstname: string;
    lastname: string;
  };
  parsedCreator: {
    _id: string;
    firstname: string;
    lastname: string;
    profileImagePath: string;
  };
}

interface Listing {
  _id: string;
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
    _id: string;
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
  const userId = useSelector((state: any) => state.user?.user?._id);
  const token = useSelector((state: any) => state.user?.token);
  const state = useSelector((state: any) => state);
  const dispatch = useDispatch();

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
  const [showPaymentModal, setShowPaymentModal] = useState(false);

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

    .rdrCalendar {
      width: 100%;
      max-width: 100%;
    }
    .rdrCalendarWrapper {
      width: 100%;
      max-width: 100%;
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
      margin: 0px 0 0 11px;
    }
  `;

  // Log state changes
  useEffect(() => {
    
  }, [state]);

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
          `${import.meta.env.VITE_API_URL}/listing/${listingId}`
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
  const transformApiResponse = (data: { listing: APIListing }): Listing => {
    

    return {
      _id: data.listing._id,
      title: data.listing.title || "",
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
        _id: data.listing.Creator._id,
        profileImagePath: data.listing.parsedCreator?.profileImagePath
          ? `/uploads/${data.listing.parsedCreator.profileImagePath}`
          : "/uploads/default-profile.png",
        firstname: data.listing.parsedCreator?.firstname || "Unknown",
        lastname: data.listing.parsedCreator?.lastname || "",
      },
    };
  };

  const handleImageNavigation = (direction: "prev" | "next") => {
    if (!listing?.images.length) return;
    
    if (direction === "prev") {
      setCurrentImageIndex(prev => 
        prev === 0 ? listing.images.length - 1 : prev - 1
      );
    } else {
      setCurrentImageIndex(prev => 
        prev === listing.images.length - 1 ? 0 : prev + 1
      );
    }
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex(
        (prevIndex) => (prevIndex + 1) % (listing?.images.length || 1)
      );
    }, 3000); // 3000ms = 3 seconds

    // Clean up interval on component unmount
    return () => clearInterval(interval);
  }, [listing?.images.length]);

  // Handle date range selection
  const handleSelect = (rangesByKey: RangeKeyDict) => {
    const { startDate, endDate } = rangesByKey.selection;
    if (startDate && endDate) {
      setDateRange([{ startDate, endDate, key: "selection" }]);
    }
  };

  const handleSubmit = async () => {
    if (!userId || !dateRange[0].startDate || !dateRange[0].endDate) return;
    setShowPaymentModal(true);
  };

  const handlePaymentSuccess = async () => {
    try {
      if (!listing || !userId || !token) return;

      const bookingData = {
        customerId: userId,
        hostId: listing.creator._id,
        listingId: listing._id,
        startDate: dateRange[0].startDate.toISOString(),
        endDate: dateRange[0].endDate.toISOString(),
        totalPrice: totalPrice
      };

      const response = await fetch(`${import.meta.env.VITE_API_URL}/bookings/create`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(bookingData)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to create booking');
      }

      const newBooking = await response.json();
      dispatch(addTrip(newBooking));

    
      navigate(`/${userId}/trips`);
    } catch (error) {
      console.error('Error creating booking:', error);
      // Add user feedback here
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
    <div className="min-h-screen bg-black bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(120,119,198,0.3),rgba(255,255,255,0))] flex flex-col">
      <Navbar />
      <div className="mb-12 w-screen max-w-full mx-auto px-4 mt-32 pl-12 pr-12">
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
        <motion.div 
          variants={fadeIn('up', 0.2)}
          initial="hidden"
          animate="show"
          className="shadow-[0_15px_10px_rgba(255,255,255,0.6)] mb-12 mt-12 p-8 bg-white/80 backdrop-blur-xl rounded-3xl border border-white/20 
            hover:shadow-[0_20px_40px_rgba(120,119,198,0.3)] transition-all duration-500 hover:scale-[1.02] group"
        >
          <div className="flex items-center gap-8">
            <div className="relative group-hover:scale-110 transition-transform duration-500">
              <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full blur-xl opacity-75 group-hover:opacity-100 transition-opacity duration-500" />
              <img
                src={listing?.creator.profileImagePath ? 
                  `${import.meta.env.VITE_API_URL}/uploads/${listing.creator.profileImagePath.replace(/^.*[\\\/]/, '')}` : 
                  'default-profile.jpg'
                }
                alt={`${listing?.creator.firstname} ${listing?.creator.lastname}`}
                className="relative w-24 h-24 rounded-full object-cover border-4 border-white shadow-xl z-10"
              />
              <div className="absolute -bottom-2 -right-2 w-7 h-7 bg-green-500 rounded-full border-2 border-white shadow-lg z-20 animate-pulse" />
            </div>
            <div className="space-y-3">
              <h3 className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
                Hosted by {listing?.creator.firstname} {listing?.creator.lastname}
              </h3>
              <div className="flex items-center gap-3">
                <span className="inline-flex px-4 py-1.5 rounded-lg bg-gradient-to-r from-purple-500 to-blue-500 text-white text-sm font-medium shadow-lg">
                  Superhost
                </span>
                <span className="text-gray-500">·</span>
                <span className="text-gray-600 font-medium group-hover:text-purple-600 transition-colors">
                  5 years hosting
                </span>
              </div>
            </div>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-12">
            {/* Image Gallery */}
            <div className="relative rounded-3xl overflow-hidden 
              w-full aspect-[4/3] sm:aspect-[16/9] lg:aspect-[2/1]
              max-w-[1200px]
              mx-auto shadow-[0_15px_10px_rgba(255,255,255,0.6)] group">
              <div className="flex h-full relative"
                style={{ 
                  transform: `translateX(-${currentImageIndex * 100}%)`,
                  transition: 'transform 700ms ease-out'
                }}>
                {listing?.images.map((photo, index) => (
                  <div key={index} 
                    className="w-full h-full flex-shrink-0">
                    <img
                      src={`${import.meta.env.VITE_API_URL}/uploads/${photo.replace(/^.*[\\\/]/, '')}`}
                      alt={`Listing photo ${index + 1}`}
                      className="w-full h-full object-cover"
                      loading="lazy"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = '/placeholder-image.jpg';
                      }}
                    />
                  </div>
                ))}
              </div>

              {/* Navigation Controls - Updated for better mobile experience */}
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center 
                gap-2 sm:gap-3 
                bg-white/90 backdrop-blur-md rounded-full 
                px-3 py-1.5 sm:px-4 sm:py-2 md:px-6 md:py-3
                shadow-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <button
                  onClick={() => handleImageNavigation("prev")}
                  className="p-1 sm:p-2 hover:bg-gray-100 rounded-full transition-all duration-300 hover:scale-110"
                >
                  <ChevronLeft className="w-4 h-4 sm:w-6 sm:h-6 text-gray-700" />
                </button>
                <span className="font-semibold px-2 sm:px-4 text-sm sm:text-base text-gray-800">
                  {currentImageIndex + 1} / {listing?.images.length}
                </span>
                <button
                  onClick={() => handleImageNavigation("next")}
                  className="p-1 sm:p-2 hover:bg-gray-100 rounded-full transition-all duration-300 hover:scale-110"
                >
                  <ChevronRight className="w-4 h-4 sm:w-6 sm:h-6 text-gray-700" />
                </button>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {[
                {
                  icon: <Users className="w-6 h-6" />,
                  label: "Guests",
                  value: listing?.guestCount,
                  gradient: "from-blue-500 to-purple-500"
                },
                {
                  icon: <Bed className="w-6 h-6" />,
                  label: "Bedrooms",
                  value: listing?.bedroomCount,
                  gradient: "from-purple-500 to-pink-500"
                },
                {
                  icon: <Bath className="w-6 h-6" />,
                  label: "Bathrooms",
                  value: listing?.bathroomCount,
                  gradient: "from-pink-500 to-red-500"
                },
              ].map((stat, index) => (
                <motion.div
                  key={index}
                  variants={fadeIn('up', 0.1 * (index + 1))}
                  initial="hidden"
                  animate="show"
                  className="group bg-white/80 backdrop-blur-xl p-6 rounded-xl border border-white/20 
                    hover:shadow-[0_20px_40px_rgba(120,119,198,0.2)] transition-all duration-500 
                    hover:scale-105 cursor-pointer"
                >
                  <div className="flex items-center gap-4">
                    <div className={`p-3 rounded-xl bg-gradient-to-r ${stat.gradient} text-white 
                      group-hover:scale-110 transition-transform duration-500 shadow-lg`}>
                      {stat.icon}
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 font-medium group-hover:text-purple-500 transition-colors">
                        {stat.label}
                      </p>
                      <p className="text-3xl font-extrabold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
                        {stat.value}
                      </p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Description */}
            <motion.div 
              variants={fadeIn('up', 0.3)}
              initial="hidden"
              animate="show"
              className="bg-white/80 backdrop-blur-xl rounded-3xl border border-white/20 p-10 space-y-6 
                hover:shadow-[0_20px_40px_rgba(120,119,198,0.2)] transition-all duration-500 
                hover:scale-[1.01] group"
            >
              <h2 className="text-4xl font-extrabold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent tracking-tight font-poppins">
                About this place
              </h2>
              <p className="text-gray-800 text-lg leading-relaxed font-roboto group-hover:text-gray-900 transition-colors">
                {listing?.description}
              </p>
            </motion.div>

            {/* Highlights */}
            {listing?.highlight && (
              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-3xl p-8 space-y-6  transition-all duration-300 shadow-[0_15px_10px_rgba(255,255,255,0.6)]">
                <h2 className="text-4xl font-extrabold text-black tracking-tight font-inter">
                  Highlights
                </h2>
                <p className="text-black text-xl font-medium leading-relaxed font-inter">
                  {listing.highlight}
                </p>
                {listing.highlightDescription && (
                  <p className="text-black text-lg font-light leading-relaxed font-inter">
                    {listing.highlightDescription}
                  </p>
                )}
              </div>
            )}

            <div className="space-y-10 p-8 bg-white rounded-3xl shadow-[0_15px_10px_rgba(255,255,255,0.6)] transition-all duration-300">
              <h2 className="text-4xl font-extrabold text-gray-900 font-poppins tracking-tight">
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
                        className="border border-black  flex items-center space-x-4 p-6 bg-white rounded-xl transition-all duration-300 transform hover:-translate-y-1"
                      >
                        <div className="text-blue-500 text-2xl">
                          {facility?.icon || "🔵"}
                        </div>
                        <span className="text-gray-800 font-medium text-lg font-roboto">
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
            <div className="sticky top-28 bg-white rounded-2xl border border-gray-200 shadow-2xl p-4 sm:p-6 lg:p-8 space-y-6">
              {/* Price Section */}
              <div className="flex flex-col 2xl:flex-row 2xl:items-center 2xl:justify-start 2xl:gap-14
                mb-2 sm:mb-2 md:mb-2 lg:mb-2 xl:mb-2 2xl:mb-2
                p-2 sm:p-2.5 md:p-3 lg:p-3.5 xl:p-4 2xl:p-4
                max-w-full">
                <div className="flex items-baseline gap-1 sm:gap-1.5 md:gap-2 lg:gap-2.5 xl:gap-3">
                  <span className="text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl 2xl:text-5xl 
                    font-extrabold text-gray-900 whitespace-nowrap">
                    ₹{listing?.price}
                  </span>
                  <span className="text-xs sm:text-sm md:text-base lg:text-lg xl:text-xl 2xl:text-xl 
                    text-gray-500 whitespace-nowrap">
                    / night
                  </span>
                </div>

                {/* Rating - Moves to right at 2xl breakpoint with increased gap */}
                <div className="flex items-center 
                  gap-1 sm:gap-1.5 md:gap-2 lg:gap-2 xl:gap-2.5
                  px-2 sm:px-2.5 md:px-3 lg:px-3.5 xl:px-4 
                  py-1 sm:py-1.5 md:py-2 lg:py-2 xl:py-2
                  rounded-full bg-gradient-to-r from-blue-100 via-blue-200 to-blue-300
                  w-fit 2xl:mt-0">
                  <Star className="w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5 lg:w-5 lg:h-5 xl:w-6 xl:h-6 
                    text-yellow-400" />
                  <span className="font-semibold text-blue-900 
                    text-xs sm:text-sm md:text-base lg:text-lg xl:text-lg 2xl:text-lg">
                    4.9
                  </span>
                </div>
              </div>

              {/* Date Range Picker */}
              <div className="mb-8">
                <DateRange
                  ranges={dateRange}
                  onChange={handleSelect}
                  showDateDisplay={false}
                  minDate={new Date()}
                  rangeColors={["#3b82f6"]}
                  className="border border-gray-300 rounded-xl overflow-hidden shadow-lg
                    [&_.rdrCalendarWrapper]:!w-full [&_.rdrCalendarWrapper]:!max-w-full
                    [&_.rdrMonth]:!w-full [&_.rdrMonth]:!max-w-full
                    [&_.rdrMonthAndYearWrapper]:!w-full [&_.rdrMonthAndYearWrapper]:!max-w-full
                    [&_.rdrMonthAndYearWrapper]:!px-2 [&_.rdrMonthAndYearWrapper]:!py-1
                    [&_.rdrWeekDays]:!grid [&_.rdrWeekDays]:!grid-cols-7 [&_.rdrWeekDays]:!gap-0 [&_.rdrWeekDays]:!px-2
                    [&_.rdrDays]:!grid [&_.rdrDays]:!grid-cols-7 [&_.rdrDays]:!gap-0 [&_.rdrDays]:!p-2
                    [&_.rdrWeekDay]:!w-full [&_.rdrWeekDay]:!text-center
                    [&_.rdrDay]:!w-full [&_.rdrDay]:!aspect-square
                    [&_.rdrDayNumber]:!w-full [&_.rdrDayNumber]:!h-full [&_.rdrDayNumber]:!p-1
                    [&_.rdrDayNumber]:[&>span]:!w-full [&_.rdrDayNumber]:[&>span]:!h-full
                    [&_.rdrDayNumber]:[&>span]:!flex [&_.rdrDayNumber]:[&>span]:!items-center [&_.rdrDayNumber]:[&>span]:!justify-center
                    [&_span]:!text-sm"
                />
              </div>

              {/* Price Breakdown */}
              <div className="space-y-4 pt-6 border-t border-gray-200">
                <div className="flex justify-between text-gray-700 text-lg">
                  <span>
                    ₹{listing?.price} × {dayCount} nights
                  </span>
                  <span>₹{totalPrice}</span>
                </div>
                <div className="flex justify-between text-xl font-bold text-gray-800">
                  <span>Total</span>
                  <span>₹{totalPrice}</span>
                </div>
              </div>

              {/* Reserve Button */}
              <button
                className={`w-full mt-8 py-4 rounded-xl font-semibold text-lg transition-all duration-300 ease-in-out ${
                  userId
                    ? "bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-2xl hover:shadow-xl transform hover:translate-y-1"
                    : "bg-gray-100 text-gray-400 cursor-not-allowed"
                }`}
                disabled={!userId}
                onClick={() => {
                  if (userId) {
                    handleSubmit();
                  }
                }}
              >
                {userId ? "Reserve Now" : "Log in to Book"}
              </button>
            </div>
          </div>
        </div>
      </div>
      <Footer />
      <PaymentModal
        isOpen={showPaymentModal}
        onClose={() => setShowPaymentModal(false)}
        onSuccess={handlePaymentSuccess}
        amount={totalPrice}
        listingTitle={listing?.title || 'Property'}
        startDate={dateRange[0].startDate}
        endDate={dateRange[0].endDate}
        nights={dayCount}
      />
    </div>
  );
};

export default ListingDetails;