import React, { useState, useEffect } from 'react';
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
  const [currentIndex, setCurrentIndex] = useState(0);

  // Auto-slide functionality
  useEffect(() => {
    if (ListingPhotoPaths.length > 1) {
      const interval = setInterval(() => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % ListingPhotoPaths.length);
      }, 3000); // Change slide every 3 seconds

      return () => clearInterval(interval);
    }
  }, [ListingPhotoPaths]);

  return (
    <div className="relative bg-white shadow-lg rounded-lg rounded-t-full overflow-hidden max-w-sm mx-auto mt-28">
      {/* Slider */}
      <div className="relative h-96 w-80 overflow-hidden">
        <div
          className="slider flex transition-transform duration-500 ease-in-out "
          style={{ transform: `translateX(-${currentIndex * 100}%)` }}
        >
          {ListingPhotoPaths.length > 0 ? (
            ListingPhotoPaths.map((photo, index) => (
              <div
                key={index}
                className="w-full flex-shrink-0 bg-cover bg-center"
                style={{
                  backgroundImage: `url(http://localhost:3001${photo})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  height: '500px',
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
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  index === currentIndex ? 'bg-gray-800' : 'bg-gray-300'
                }`}
                onClick={() => setCurrentIndex(index)}
              ></button>
            ))}
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
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
