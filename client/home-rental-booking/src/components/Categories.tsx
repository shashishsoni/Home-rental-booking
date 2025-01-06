import { useState, useEffect } from "react";
import { categories } from "@/data";
import imageHome from '../assets/imagehome.webp';
import imageHome2 from '../assets/imagehome2.jpg';
import imageHome1 from '../assets/imagehome1.avif';
import '../index.css';

const Categories = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const backgroundImages = [
    imageHome,
    imageHome1,
    imageHome2
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
      case "large": return "w-24 h-24 md:w-32 md:h-32 lg:w-44 lg:h-44 min-[1556px]:w-55 min-[1556px]:h-55";
      case "medium": return "w-20 h-20 md:w-24 md:h-24 lg:w-28 lg:h-28 min-[1556px]:w-32 min-[1556px]:h-32";
      case "small": return "w-16 h-16 md:w-20 md:h-20 lg:w-24 lg:h-24 min-[1556px]:w-28 min-[1556px]:h-28";
      default: return "w-20 h-20 md:w-24 md:h-24 lg:w-28 lg:h-28 min-[1556px]:w-32 min-[1556px]:h-32";
    }
  };

  return (
    <div className="relative p-4 md:p-6 lg:p-8 w-full mx-auto min-h-[700px] max-h-[130vh] overflow-hidden">
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
        <h2 className="text-2xl md:text-3xl lg:text-4xl min-[1556px]:text-6xl font-bold text-center mb-3 md:mb-4 min-[1556px]:mb-6 text-white underline">
          Explore the top categories
        </h2>
        <p className="text-sm md:text-base lg:text-lg min-[1556px]:text-xl mb-4 md:mb-6 min-[1556px]:mb-8 text-white w-[95%] md:w-[85%] lg:w-[80%] min-[1556px]:w-[70%] text-center m-auto max-h-[20vh] overflow-y-auto scrollbar-hide">
          A home rental application showcasing "Explore Top Categories" provides users with diverse property options tailored to their preferences. This feature enhances user engagement by categorizing properties into appealing and visually distinct types.
          <br className="hidden md:block" />
          <br className="hidden md:block" />
          For example, "Beachfront" properties offer coastal getaways, while "Countryside" listings promise serene, natural escapes. Adventurous users can opt for "Ski-in/out" or "Caves", while those seeking luxury can explore "Luxury" or "Iconic Cities". Each category includes a high-quality image and a unique description, such as "This property is near a lake!" for "Lakefront", ensuring clarity and engagement.
        </p>

        {categoryLayout.map((row, rowIndex) => (
          <div 
            key={rowIndex} 
            className="flex flex-wrap justify-center gap-2 md:gap-4 lg:gap-6 min-[1556px]:gap-8 mb-2 md:mb-4 min-[1556px]:mb-6"
          >
            {row.map((item, colIndex) => {
              const categoryIndex = rowIndex * 5 + colIndex;
              if (categoryIndex < categories.length) {
                const category = categories[categoryIndex + 1];
                return (
                  <div key={colIndex} className="flex flex-col items-center">
                    <div className={`relative ${getSizeClass(item.size)} rounded-full border-2 border-white/20 overflow-hidden flex items-center justify-center bg-white/10 backdrop-blur-sm shadow-lg hover:shadow-xl cursor-pointer`}>
                      <img
                        src={category.img}
                        alt={category.label}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-full scale-100 hover:scale-90 transition-all duration-300 ease-in-out">
                        <p className="text-xs md:text-sm lg:text-base min-[1556px]:text-lg text-white text-center font-medium px-2">
                          {category.label}
                        </p>
                      </div>
                    </div>
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
