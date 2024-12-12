import React from "react";
import { categories } from "../data";

const Listings = () => {
  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-2xl md:text-4xl font-bold text-center text-gray-800 mb-8">
        Explore Categories
      </h1>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
        {categories.map((Category, index) => (
          <div
            key={index}
            className="bg-white shadow-md hover:shadow-xl rounded-lg p-4 flex flex-col items-center text-center transition-all duration-300"
          >
            {/* Handle different structures */}
            {Category.img ? (
              <img
                src={Category.img}
                alt={Category.label}
                className="w-16 h-16 object-cover rounded-full mb-3"
              />
            ) : (
              <div className="text-4xl text-blue-500 mb-2">
                {typeof Category.icon === "function" ? <Category.icon /> : Category.icon}
              </div>
            )}
            <p className="text-gray-700 font-semibold text-sm">{Category.label}</p>
            {Category.description && (
              <p className="text-gray-500 text-xs mt-2">{Category.description}</p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Listings;
