import { categories } from "@/data";
import React from "react";

const Categories = () => {
  const categoryLayout = [
    [{ size: "large" }, { size: "large" }],
    [{ size: "large" }, { size: "large" }, { size: "large" }],
    [{ size: "large" }, { size: "large" }]
  ];

  const getSizeClass = (size: string) => {
    switch (size) {
      case "large": return "w-80 h-80";
      case "medium": return "w-32 h-32";
      case "small": return "w-28 h-28";
      default: return "w-32 h-32";
    }
  };

  return (
    <div className="p-8 max-w-4xl mx-auto">
      {/* Explore the top categories heading */}
      <h2 className="text-4xl font-bold text-center mb-6">Explore the top categories</h2>
      
      {/* Home Rentals Sentence */}
      <p className="text-xl text-center mb-8 text-gray-700"> Our "Top Categories" section features a variety of rental options, including luxury apartments, affordable housing, and vacation rentals for short-term stays. We understand that every renter has different priorities, so we’ve designed categories that focus on location, budget, and amenities, making your search as easy as possible. Discover properties with essential features like pet-friendly options, spacious layouts, and proximity to schools, workspaces, or entertainment hubs.</p>

      {/* Category Layout */}
      {categoryLayout.map((row, rowIndex) => (
        <div key={rowIndex} className="flex justify-center gap-8 mb-8">
          {row.map((item, colIndex) => {
            const categoryIndex = rowIndex * 3 + colIndex; // Calculate the index for categories array starting from 1
            if (categoryIndex < categories.length) {
              const category = categories[categoryIndex + 1 ]; // Get the correct category based on index
              return (
                <div key={colIndex} className="flex flex-col items-center">
                  <div className={`${getSizeClass(item.size)} rounded-full border-2 border-gray-300 overflow-hidden flex items-center justify-center bg-white shadow-md hover:shadow-lg transition-shadow`}>
                    <img
                      src={category.img || "/api/placeholder/150/150"}
                      alt={category.label}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <p className="mt-2 text-sm font-medium text-gray-700">{category.label}</p>
                </div>
              );
            }
            return null;
          })}
        </div>
      ))}
    </div>
  );
};

export default Categories;
