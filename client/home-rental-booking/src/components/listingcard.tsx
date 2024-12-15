import React from 'react';
import { ListingCardProps } from '../types/types';

const ListingCard: React.FC<ListingCardProps> = ({
  listingId,
  creator,
  ListingPhotoPaths = [],
  city,
  province,
  country,
  category,
  type,
  price,
}) => {
  console.log("Props in ListingCard:", {
    listingId,
    creator,
    ListingPhotoPaths,
    city,
    province,
    country,
    category,
    type,
    price,
  });

  return (
    <div className="relative bg-white shadow-lg rounded-lg overflow-hidden max-w-sm mx-auto">
      {/* Slider */}
      <div className="relative h-48 overflow-hidden">
        <div className="slider flex transition-transform duration-500 ease-in-out">
          {ListingPhotoPaths.length > 0 ? (
            ListingPhotoPaths.map((photo, index) => (
              <div
                key={index}
                className="w-full flex-shrink-0 bg-cover bg-center"
                style={{
                  backgroundImage: `url(http://localhost:3001${photo})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  height: '200px',
                }}
              ></div>
            ))
          ) : (
            <div className="w-full h-full flex justify-center items-center bg-gray-300">
              <p>No Images Available</p>
            </div>
          )}
        </div>

        {/* Dots for Navigation */}
        <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex space-x-2">
          {ListingPhotoPaths.length > 0 &&
            ListingPhotoPaths.map((_, index) => (
              <button
                key={index}
                className="w-3 h-3 rounded-full bg-gray-300 hover:bg-gray-500 transition-all duration-300"
              ></button>
            ))}
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        {/* Display category with a fallback */}
        <h3 className="text-xl font-semibold text-gray-800 bg-yellow-200">
          {category || "Miscellaneous"}
        </h3>
        <p className="text-sm text-gray-500">
          {city}, {province}, {country}
        </p>
        <p className="mt-2 text-lg font-bold text-green-600">${price}</p>
      </div>

      {/* Footer */}
      <div className="flex justify-between items-center p-4 bg-gray-100 border-t">
        <p className="text-sm text-gray-600">By {creator}</p>
        <a
          href={`/listing/${listingId}`}
          className="text-blue-500 hover:underline font-medium"
        >
          View Details
        </a>
      </div>
    </div>
  );
};

export default ListingCard;
