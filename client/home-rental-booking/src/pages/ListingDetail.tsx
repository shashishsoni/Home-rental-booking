import React, { useState, useEffect, ReactNode } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { DateRange, RangeKeyDict } from "react-date-range";
import { facilities } from "../data";
import Loader from "../components/loader";
import Navbar from "../components/Navbar";

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
  apartment: string;
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
  highlightDescription: ReactNode;
  title: string;
  listingPhotoPaths: string[];
  type: string;
  city: string;
  province: string;
  country: string;
  guestCount: number;
  bedroomCount: number;
  bedCount: number;
  bathroomCount: number;
  description: string;
  highlight: string;
  highlightDesc: string;
  amenities: string[];
  price: number;
  creator: {
    profileImagePath?: string;
    firstName?: string;
    lastName?: string;
    _id: string;
  };
}

interface CustomDateRange {
  startDate: Date;
  endDate: Date;
  key: string;
}

const ListingDetails: React.FC = () => {
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [listing, setListing] = useState<Listing | null>(null);
  const { listingId } = useParams<{ listingId: string }>();
  const navigate = useNavigate();
  const customerId = useSelector((state: any) => state?.user?._id);

  const [dateRange, setDateRange] = useState<CustomDateRange[]>([
    {
      startDate: new Date(),
      endDate: new Date(),
      key: "selection",
    },
  ]);

  const dayCount = Math.max(
    1,
    Math.round(
      (dateRange[0].endDate.getTime() - dateRange[0].startDate.getTime()) /
        (1000 * 60 * 60 * 24)
    )
  );

  const totalPrice = listing ? listing.price * dayCount : 0;

  const parseAmenities = (amenities: string[]): string[] => {
    return amenities.map((amenity) => amenity.trim()).filter(Boolean);
  };

  const transformApiResponse = (data: { listing: APIListing }): Listing => {
    const cleanedAmenities = parseAmenities(data.listing.amenities);
    return {
      highlightDescription: data.listing.Highlightdescription,
      title: data.listing.title,
      listingPhotoPaths: data.listing.listingImages,
      type: data.listing.type,
      city: data.listing.city,
      province: data.listing.province,
      country: data.listing.country,
      guestCount: data.listing.guest,
      bedroomCount: data.listing.bedroom,
      bedCount: 1,
      bathroomCount: data.listing.bathroom,
      description: data.listing.description,
      highlight: data.listing.Highlights || "",
      highlightDesc: data.listing.Highlightdescription,
      amenities: cleanedAmenities,
      price: data.listing.price,
      creator: {
        profileImagePath: data.listing.creator?.profileImagePath || "",
        firstName: data.listing.creator?.firstName || "N/A",
        lastName: data.listing.creator?.lastName || "N/A",
        _id: data.listing.Creator || "",
      },
    };
  };

  useEffect(() => {
    const getListingDetails = async (): Promise<void> => {
      if (!listingId) {
        setError("No listing ID provided");
        setLoading(false);
        return;
      }
    
      try {
        console.log("Fetching listing details...");
        const response = await fetch(`http://localhost:3001/listing/${listingId}`);
        console.log(`Response status: ${response.status}`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        console.log("API response:", data);
        const transformedListing = transformApiResponse(data);
        setListing(transformedListing);
        setLoading(false);
      } catch (err: any) {
        console.error("Error fetching listing:", err.message);
        setError("Failed to load listing");
        setLoading(false);
      }
    };

    getListingDetails();
  }, [listingId]);

  const handleSelect = (rangesByKey: RangeKeyDict) => {
    const selection = rangesByKey.selection;
    if (selection.startDate && selection.endDate) {
      setDateRange([
        {
          startDate: selection.startDate,
          endDate: selection.endDate,
          key: "selection",
        },
      ]);
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
    <>
      <Navbar />
      <div className="mt-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Title Section */}
        <div className="mb-10">
          <h1 className="text-5xl font-bold text-gray-900 mb-5">
            {listing.title}
          </h1>
          <div className="flex items-center text-gray-600 space-x-4">
            <span className="inline-flex items-center px-4 py-2 rounded-full bg-gray-200 text-sm font-medium">
              {listing.type}
            </span>
            <span>•</span>
            <span className="text-lg">
              {listing.city}, {listing.province}, {listing.country}
            </span>
          </div>
        </div>

        {/* Image Gallery */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {listing.listingPhotoPaths.map((path, index) => (
            <img
              key={index}
              src={`http://localhost:3001${path}`}
              alt={`Listing photo ${index + 1}`}
              className="w-full h-[15rem] md:h-[30rem] object-cover rounded-lg"
            />
          ))}
        </div>

        {/* Details Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          <div className="lg:col-span-2 space-y-10">
            {/* Quick Info */}
            <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200">
              <div className="flex items-center space-x-6 text-gray-600">
                <div className="flex items-center">
                  <span className="mr-2 text-xl">👤</span>
                  {listing.guestCount} guests
                </div>
                <span>•</span>
                <div className="flex items-center">
                  <span className="mr-2 text-xl">🛌</span>
                  {listing.bedroomCount} bedrooms
                </div>
                <span>•</span>
                <div className="flex items-center">
                  <span className="mr-2 text-xl">🛁</span>
                  {listing.bathroomCount} bathrooms
                </div>
              </div>
            </div>

            {/* About the Place */}
            {listing.description && (
              <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200">
                <h3 className="text-3xl font-semibold mb-4">
                  About this Place
                </h3>
                <p className="text-gray-700 leading-loose">
                  {listing.description}
                </p>
              </div>
            )}

            {/* Highlights */}
            {listing.highlight && (
              <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200">
                <h3 className="text-3xl font-semibold mb-4">Highlights</h3>
                <p className="text-gray-700 leading-loose">
                  {listing.highlight}
                </p>
              </div>
            )}

            {/* Highlights */}
            {listing.highlight && (
              <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200">
                <h3 className="text-3xl font-semibold mb-4">
                  HighlightsDescription
                </h3>
                <p className="text-gray-700 leading-loose">
                  {listing.highlightDescription}
                </p>
              </div>
            )}

            {/* Amenities */}
            <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200">
              <h3 className="text-3xl font-semibold mb-6">
                What this Place Offers
              </h3>
              <div className="grid grid-cols-2 gap-6">
                {listing.amenities.map((item, index) => {
                  const facility = facilities.find((fac) => fac.name === item);
                  return (
                    <div key={index} className="flex items-center space-x-4">
                      <div className="w-10 h-10 flex items-center justify-center bg-gray-100 rounded-lg">
                        {facility?.icon || <span>Icon</span>}
                      </div>
                      <p className="text-gray-700">{facility?.name || item}</p>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Booking Section */}
          <div className="lg:col-span-1">
            <div className="sticky top-10">
              <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
                <div className="flex items-baseline justify-between mb-6">
                  <h2 className="text-3xl font-bold">${listing.price}</h2>
                  <span className="text-gray-500">/ night</span>
                </div>

                <DateRange
                  ranges={dateRange}
                  onChange={handleSelect}
                  minDate={new Date()}
                  className="mb-6 border border-gray-300 rounded-xl bg-gray-50 p-4 shadow-inner"
                />

                <div className="space-y-4 mb-6">
                  <div className="flex justify-between items-center text-gray-700">
                    <span>
                      ${listing.price} x {dayCount}{" "}
                      {dayCount === 1 ? "night" : "nights"}
                    </span>
                    <span>${totalPrice}</span>
                  </div>
                  <div className="border-t pt-4">
                    <div className="flex justify-between items-center font-semibold text-lg">
                      <span>Total</span>
                      <span>${totalPrice}</span>
                    </div>
                  </div>
                </div>

                <button
                  className={`w-full py-4 px-6 rounded-xl text-white font-semibold transition-all
                    ${
                      customerId
                        ? "bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 shadow-md hover:shadow-lg"
                        : "bg-gray-400 cursor-not-allowed"
                    }`}
                  onClick={() => {}}
                  disabled={!customerId}
                >
                  {customerId ? "Book Now" : "Please login to book"}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ListingDetails;
