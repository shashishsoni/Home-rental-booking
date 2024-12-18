import React from "react";
import { useParams } from "react-router-dom";
import { facilities } from "../data";

const ListingDetail = () => {
  const [loading, setLoading] = React.useState(true);
  const [listing, setListing] = React.useState<Listing | null>(null);
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
      <div className="flex justify-center items-center h-screen text-lg">Loading...</div>
    );
  }

  if (!listing) {
    return (
      <div className="flex justify-center items-center h-screen text-lg text-red-500">Error loading listing details</div>
    );
  }

  return (
    <div className="container mx-auto px-6 py-10 bg-white rounded-lg shadow-xl space-y-8">
      {/* Title */}
      <h1 className="text-4xl font-bold text-gray-900">{listing.title || "No Title Available"}</h1>

      {/* Listing Images */}
      <div className="flex flex-wrap gap-6">
        {listing.listingPhotoPaths.length > 0 ? (
          listing.listingPhotoPaths.map((image, index) => (
            <div key={index} className="w-full sm:w-1/2 md:w-1/3 lg:w-1/4">
              <img
                src={`http://localhost:3001/public${image.replace("public", "").replace("//", "/")}`}
                alt="Listing"
                className="w-full h-64 object-cover rounded-lg shadow-md transform transition-all hover:scale-105"
              />
            </div>
          ))
        ) : (
          <p>No images available</p>
        )}
      </div>

      {/* Location and Details */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold text-gray-800">
          {listing.type} in {listing.city}, {listing.province}, {listing.country}
        </h2>
        <p className="text-gray-600">
          {listing.guestCount} guest{listing.guestCount !== 1 ? 's' : ''} • {listing.bedroomCount} bedroom{listing.bedroomCount !== 1 ? 's' : ''} • {listing.bedCount} bed{listing.bedCount !== 1 ? 's' : ''} • {listing.bathroomCount} bathroom{listing.bathroomCount !== 1 ? 's' : ''}
        </p>
      </div>

      <hr className="my-6 border-gray-300" />

      {/* Host Information */}
      {listing.creator ? (
        <div className="flex items-center space-x-6">
          <img
            src={`http://localhost:3001/${listing.creator.profileImagePath.replace("public", "")}`}
            alt="Host"
            className="w-20 h-20 rounded-full border-4 border-gray-200 shadow-md"
          />
          <div>
            <h3 className="font-semibold text-gray-800">
              Hosted by {listing.creator.firstname} {listing.creator.lastname}
            </h3>
          </div>
        </div>
      ) : (
        <p>Host information is unavailable</p>
      )}

      <hr className="my-6 border-gray-300" />

      {/* Description */}
      <div>
        <h3 className="text-2xl font-semibold text-gray-800">Description</h3>
        <p className="text-gray-600">{listing.description || "No description available"}</p>
      </div>

      <hr className="my-6 border-gray-300" />

      {/* Highlight */}
      <div>
        <h3 className="text-2xl font-semibold text-gray-800">{listing.highlight || "No Highlights"}</h3>
        <p className="text-gray-600">{listing.highlightDescription || "No highlight description available"}</p>
      </div>

      <hr className="my-6 border-gray-300" />

      {/* Amenities */}
      <div>
        <h2 className="text-2xl font-semibold text-gray-800">What this place offers</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6 mt-6">
          {listing.amenities.map((item, index) => (
            <div key={index} className="flex items-center space-x-4 text-gray-800 hover:text-gray-600 transition-all transform hover:scale-105">
              <div className="text-xl">{facilities.find((facility) => facility.name === item.name)?.icon}</div>
              <p className="text-sm">{item.name}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ListingDetail;
