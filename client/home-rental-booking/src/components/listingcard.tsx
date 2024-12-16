import React, { useState, useEffect } from "react";
import { ListingCardProps } from "../types/types";

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
        setCurrentIndex(
          (prevIndex) => (prevIndex + 1) % ListingPhotoPaths.length
        );
      }, 3000);
      return () => clearInterval(interval);
    }
  }, [ListingPhotoPaths]);

  return (
    <div className="relative w-[400px] mt-6 bg-white border-2 border-gray-100 rounded-xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-xl hover:border-gray-200">
      {/* Image Slider with Overlay */}
      <div className="relative h-[300px] group">
        {ListingPhotoPaths.length > 0 ? (
          <div
            className="absolute inset-0 flex transition-transform duration-500 ease-in-out"
            style={{ transform: `translateX(-${currentIndex * 100}%)` }}
          >
            {ListingPhotoPaths.map((photo, index) => (
              <div
                key={index}
                className="w-full flex-shrink-0 relative"
                style={{
                  backgroundImage: `url(http://localhost:3001${photo})`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                }}
              />
            ))}
          </div>
        ) : (
          <div className="absolute inset-0 bg-gray-200 flex justify-center items-center">
            <p className="text-gray-500 text-lg">No Images Available</p>
          </div>
        )}

        {/* Absolute Positioning for Price */}
        <div className="absolute top-4 right-4 bg-gradient-to-r from-emerald-500 to-green-600 px-4 py-2 rounded-full shadow-lg flex flex-col items-center text-white">
          <span className="text-lg font-extrabold tracking-wide">
            ₹{price.toLocaleString()}/-
          </span>
          <span className="text-xs uppercase font-medium tracking-wider opacity-90">
            Per Night
          </span>
        </div>

        {/* Navigation Dots */}
        {ListingPhotoPaths.length > 1 && (
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
            {ListingPhotoPaths.map((_, index) => (
              <button
                key={index}
                className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
                  index === currentIndex
                    ? "bg-white ring-2 ring-emerald-500 scale-125"
                    : "bg-white/50 hover:bg-white/80"
                }`}
                onClick={() => setCurrentIndex(index)}
              />
            ))}
          </div>
        )}
      </div>

      {/* Content Section */}
      <div className="p-5 space-y-4">
        <div className="flex justify-between items-start">
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <span className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                Category
              </span>
              <span className="bg-emerald-50 text-emerald-700 text-xs font-semibold px-2.5 py-1 rounded">
                {category || "Miscellaneous"}
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                Type
              </span>
              <span className="bg-indigo-50 text-indigo-700 text-xs font-semibold px-2.5 py-1 rounded">
                {type || "N/A"}
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 text-gray-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
            />
          </svg>
          <p className="text-sm text-gray-600">
            {city}, {province}, {country}
          </p>
        </div>
      </div>

      {/* Footer */}
      <div className="px-5 py-4 border-t border-gray-100 flex justify-between items-center">
        <div className="flex items-center space-x-3">
          <div className="w-9 h-9 bg-gray-100 rounded-full flex items-center justify-center">
            <span className="text-sm font-medium text-gray-700">
              {creator.charAt(0).toUpperCase()}
            </span>
          </div>
          <p className="text-sm text-gray-600">By {creator}</p>
        </div>
        <a
          href={`/listing/${listingId}`}
          className="text-emerald-600 hover:text-emerald-800 font-medium text-sm flex items-center group"
        >
          Details
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-4 w-4 ml-1 group-hover:translate-x-1 transition-transform"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M13 7l5 5m0 0l-5 5m5-5H6"
            />
          </svg>
        </a>
      </div>
    </div>
  );
};

export default ListingCard;
