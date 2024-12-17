
import React from "react";
import { useParams } from "react-router-dom";

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
        console.log("Fetched API data:", data); // Debug API data
        setListing(data.listing);
      } else {
        throw new Error("Failed to fetch data");
      }
    } catch (error) {
      console.error("Error fetching listing:", error);
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
    return <div>Loading...</div>;
  }

  if (!listing) {
    return <div>Error loading listing details</div>;
  }

  return (
    <div>
      {/* Title */}
      <h1>{listing.title || "No Title Available"}</h1>

      {/* Images */}
      <div>
        {listing.listingPhotoPaths?.length ? (
          listing.listingPhotoPaths.map((item) => (
            <img
              key={item}
              src={`http://localhost:3001/${item.replace("public", "")}`}
              alt="Listing"
            />
          ))
        ) : (
          <p>No images available</p>
        )}
      </div>

      {/* Location and Details */}
      <div>
        <h2>
          {listing.type || "Type not specified"} is in{" "}
          {listing.city || "Unknown City"}, {listing.province || "Unknown Province"}, {listing.country || "Unknown Country"}
        </h2>
        <p>
          {listing.guestCount || 0} guest{listing.guestCount !== 1 ? "s" : ""} -{" "}
          {listing.bedroomCount || 0} bedroom{listing.bedroomCount !== 1 ? "s" : ""} -{" "}
          {listing.bedCount || 0} bed{listing.bedCount !== 1 ? "s" : ""} -{" "}
          {listing.bathroomCount || 0} bathroom{listing.bathroomCount !== 1 ? "s" : ""}
        </p>
      </div>

      <hr />

      {/* Host Information */}
      {listing.creator ? (
        <div>
          <img
            src={`http://localhost:3001/${listing.creator.profileImagePath?.replace("public", "")}`}
            alt={listing.creator.firstname || "Host"}
          />
          <h3>
            Hosted by {listing.creator.firstname || "Unknown"} {listing.creator.lastname || ""}
          </h3>
        </div>
      ) : (
        <p>Host information is unavailable</p>
      )}

      <hr />

      {/* Description */}
      <h3>Description</h3>
      <p>{listing.description || "No description available"}</p>

      <hr />

      {/* Highlight */}
      <h3>{listing.highlight || "No Highlights"}</h3>
      <p>{listing.highlightDescription || "No highlight description available"}</p>
    </div>
  );
};

export default ListingDetail;
