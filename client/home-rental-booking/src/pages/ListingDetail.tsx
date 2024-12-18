import { useParams } from "react-router-dom";
import { facilities } from "../data";
import React, { useState } from 'react';
import { Heart, Share2, MapPin, Users, Bed, Bath, Star, Shield } from 'lucide-react';

const ListingDetail = () => {
  const [loading, setLoading] = useState(true);
  const [listing, setListing] = useState<Listing | null>(null);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const { listingId } = useParams();

  interface Listing {
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
    amenities: {
      id: number;
      name: string;
      icon: string;
    }[];
    creator: {
      profileImagePath: string;
      firstname: string;
      lastname: string;
    } | null;
    description: string;
    highlight: string;
    highlightDescription: string;
  }

  const getlistingdetail = async () => {
    try {
      const response = await fetch(`http://localhost:3001/listing/${listingId}`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      });
  
      if (response.ok) {
        const data = await response.json();
        console.log("Raw API data:", data); // Debugging raw API response
  
        if (!data || !data.listing) {
          console.error("Unexpected API response structure:", data);
          return;
        }
  
        const rawListing = data.listing;
        const normalizedListing = {
          title: rawListing.title || "No Title",
          listingPhotoPaths: Array.isArray(rawListing.listingImages) ? rawListing.listingImages : [],
          type: rawListing.type || "Not Specified",
          city: rawListing.city || "Unknown City",
          province: rawListing.province || "Unknown Province",
          country: rawListing.country || "Unknown Country",
          guestCount: rawListing.guest || 0,
          bedroomCount: rawListing.bedroom || 0,
          bedCount: rawListing.bed || 0,
          bathroomCount: rawListing.bathroom || 0,
          amenities: Array.isArray(rawListing.amenities)
            ? rawListing.amenities.map((amenity: string) => ({
                id: Math.random(),
                name: amenity.replace(/["\[\]]/g, "").trim(),
                icon: facilities.find((facility) => facility.name === amenity)?.icon || "",
              }))
            : [],
          creator: rawListing.Creator
            ? {
                profileImagePath: rawListing.creator?.profileImagePath || "",
                firstname: rawListing.creator?.firstname || "Unknown",
                lastname: rawListing.creator?.lastname || "",
              }
            : null,
          description: rawListing.description || "No Description",
          highlight: "Highlights",
          highlightDescription: rawListing.Highlightdescription || "No Highlight Description",
        };
  
        console.log("Normalized Listing Data:", normalizedListing); // Debugging normalized data
        setListing(normalizedListing);
      } else {
        console.error("Failed to fetch listing details, status:", response.status);
        setListing(null);
      }
    } catch (error) {
      console.error("Error fetching listing:", error);
      setListing(null);
    } finally {
      setLoading(false);
    }
  };
  

  React.useEffect(() => {
    getlistingdetail();
  }, [listingId]);

  React.useEffect(() => {
    console.log("Updated listings state:", listing); // Debug state update
  }, [listing]);

  if (loading) {
    return (
      <div className="fixed inset-0 flex justify-center items-center bg-gray-100 z-50">
        <div className="animate-pulse text-2xl text-blue-600">Loading your perfect getaway...</div>
      </div>
    );
  }

  if (!listing) {
    return (
      <div className="min-h-screen bg-gray-100 flex flex-col justify-center items-center text-center p-6">
        <h2 className="text-3xl font-bold text-red-500 mb-4">Oops! Listing Not Found</h2>
        <p className="text-gray-600">We couldn't retrieve the details for this listing. Please try again later.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header with Title and Actions */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-4xl font-extrabold text-gray-900">{listing.title}</h1>
          <div className="flex space-x-4">
            <button className="text-gray-600 hover:text-gray-900 transition">
              <Share2 className="w-6 h-6" />
            </button>
            <button className="text-gray-600 hover:text-red-600 transition">
              <Heart className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Image Gallery */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-10">
          {listing.listingPhotoPaths.length > 0 && (
            <>
              <div className="md:row-span-2">
                <img 
                  src={`http://localhost:3001/public${listing.listingPhotoPaths[activeImageIndex].replace("public", "").replace("//", "/")}`} 
                  alt="Main Listing" 
                  className="w-full h-full object-cover rounded-2xl shadow-lg"
                />
              </div>
              <div className="hidden md:grid grid-cols-2 gap-4">
                {listing.listingPhotoPaths.slice(1, 3).map((image, index) => (
                  <img 
                    key={index}
                    src={`http://localhost:3001/public${image.replace("public", "").replace("//", "/")}`} 
                    alt={`Listing view ${index + 2}`}
                    className="w-full h-48 object-cover rounded-xl hover:opacity-80 transition cursor-pointer"
                    onClick={() => setActiveImageIndex(index + 1)}
                  />
                ))}
              </div>
            </>
          )}
        </div>

        {/* Listing Details Container */}
        <div className="grid md:grid-cols-3 gap-10">
          {/* Left Column - Detailed Information */}
          <div className="md:col-span-2 space-y-8">
            {/* Location and Basic Info */}
            <div className="bg-white p-6 rounded-xl shadow-md">
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="text-2xl font-bold text-gray-800 flex items-center">
                    <MapPin className="w-6 h-6 mr-2 text-blue-500" />
                    {listing.type} in {listing.city}, {listing.province}
                  </h2>
                  <p className="text-gray-600 mt-2 flex items-center space-x-4">
                    <Users className="w-5 h-5 text-gray-500" /> {listing.guestCount} guests
                    <Bed className="w-5 h-5 text-gray-500 ml-4" /> {listing.bedroomCount} bedrooms
                    <Bath className="w-5 h-5 text-gray-500 ml-4" /> {listing.bathroomCount} bathrooms
                  </p>
                </div>
                {listing.creator && (
                  <img 
                    src={`http://localhost:3001/${listing.creator.profileImagePath.replace("public", "")}`} 
                    alt="Host" 
                    className="w-16 h-16 rounded-full border-4 border-blue-100 shadow-md"
                  />
                )}
              </div>
            </div>

            {/* Description */}
            <div className="bg-white p-6 rounded-xl shadow-md">
              <h3 className="text-xl font-semibold text-gray-800 mb-4">About this place</h3>
              <p className="text-gray-600 leading-relaxed">{listing.description}</p>
            </div>

            {/* Amenities */}
            <div className="bg-white p-6 rounded-xl shadow-md">
              <h3 className="text-xl font-semibold text-gray-800 mb-6">What this place offers</h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {listing.amenities.map((item, index) => (
                  <div 
                    key={index} 
                    className="flex items-center space-x-3 text-gray-700 hover:bg-blue-50 p-2 rounded-lg transition"
                  >
                    <span className="text-xl">
                      {facilities.find((facility) => facility.name === item.name)?.icon}
                    </span>
                    <span className="text-sm">{item.name}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column - Booking Card */}
          <div className="hidden md:block">
            <div className="sticky top-10 bg-white rounded-xl shadow-xl p-6 border-t-4 border-blue-500">
              <div className="flex justify-between items-center mb-6">
                <div>
                  <span className="text-2xl font-bold text-gray-800">$150</span>
                  <span className="text-gray-600 ml-2">/ night</span>
                </div>
                <div className="flex items-center text-yellow-500">
                  <Star className="w-5 h-5 fill-current" />
                  <span className="ml-2 text-gray-800">4.8 (42 reviews)</span>
                </div>
              </div>
              
              <div className="space-y-4">
                <div className="flex justify-between border rounded-lg p-3">
                  <input 
                    type="date" 
                    className="w-full text-gray-600 focus:outline-none" 
                    placeholder="Check-in" 
                  />
                </div>
                <div className="flex justify-between border rounded-lg p-3">
                  <input 
                    type="date" 
                    className="w-full text-gray-600 focus:outline-none" 
                    placeholder="Check-out" 
                  />
                </div>
                <div className="flex justify-between border rounded-lg p-3">
                  <select className="w-full text-gray-600 focus:outline-none">
                    <option>1 Guest</option>
                    <option>2 Guests</option>
                    <option>3 Guests</option>
                    <option>4 Guests</option>
                  </select>
                </div>
              </div>

              <button className="w-full bg-blue-600 text-white py-3 rounded-lg mt-6 hover:bg-blue-700 transition flex items-center justify-center">
                Reserve
                <Shield className="w-5 h-5 ml-2" />
              </button>

              <p className="text-center text-gray-500 mt-4 text-sm">
                You won't be charged yet
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ListingDetail;
