import React, { useState, useEffect } from "react";
import { categories } from "@/data";

const Categories = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const backgroundImages = [
    "src/assets/imagehome.webp",
    "src/assets/imagehome2.jpg",
    "src/assets/imagehome1.avif",
  ];

  const categoryLayout = [
    [{ size: "large" }, { size: "large" }],
    [{ size: "large" }, { size: "large" }, { size: "large" }, { size: "large" }, { size: "large" }],
    [{ size: "large" }, { size: "large" }]
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % backgroundImages.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const getSizeClass = (size: string) => {
    switch (size) {
      case "large": return "w-60 h-60";
      case "medium": return "w-32 h-32";
      case "small": return "w-28 h-28";
      default: return "w-32 h-32";
    }
  };

  return (
    <div className="relative p-8 w-full mx-auto min-h-screen h-[130vh] overflow-hidden">
      {backgroundImages.map((img, index) => (
        <div
          key={index}
          className={`absolute inset-0 transition-opacity duration-1000
            ${index === currentSlide ? 'opacity-100' : 'opacity-0'}`}
        >
          <img src={img} alt="" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-black/60" />
        </div>
      ))}

      <div className="relative z-10">
        <h2 className="text-6xl font-bold text-center mb-6 text-white">
          Explore the top categories
        </h2>
        <p className="text-xl mb-8 text-white w-[70%] text-center m-auto">
          A home rental application showcasing "Explore Top Categories" provides users with diverse property options tailored to their preferences. This feature enhances user engagement by categorizing properties into appealing and visually distinct types.
          <br /><br/>
          For example, "Beachfront" properties offer coastal getaways, while "Countryside" listings promise serene, natural escapes. Adventurous users can opt for "Ski-in/out" or "Caves", while those seeking luxury can explore "Luxury" or "Iconic Cities". Each category includes a high-quality image and a unique description, such as "This property is near a lake!" for "Lakefront", ensuring clarity and engagement.
        </p>

        {categoryLayout.map((row, rowIndex) => (
          <div key={rowIndex} className="flex justify-center gap-8 mb-8">
            {row.map((item, colIndex) => {
              const categoryIndex = rowIndex * 5 + colIndex;
              if (categoryIndex < categories.length) {
                const category = categories[categoryIndex + 1];
                return (
                  <div key={colIndex} className="flex flex-col items-center">
                    <div className={`${getSizeClass(item.size)} rounded-full border-2 border-white/20 overflow-hidden flex items-center justify-center bg-white/10 backdrop-blur-sm shadow-lg hover:shadow-xl transition-shadow`}>
                      <img
                        src={category.img}
                        alt={category.label}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <p className="mt-2 text-sm font-medium text-white">
                      {category.label}
                    </p>
                  </div>
                );
              }
              return null;
            })}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Categories;