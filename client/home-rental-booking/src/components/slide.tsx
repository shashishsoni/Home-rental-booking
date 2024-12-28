import React, { useEffect, useState } from "react";
import slide1 from '../assets/slide1.jpg';
import imagehome2 from '../assets/imagehome2.jpg';
import slide3 from '../assets/slide3.jpg';

const Carousel: React.FC = () => {
  const slides = [
    slide1,
    imagehome2,
    slide3,
  ];

  const [currentIndex, setCurrentIndex] = useState(0);

  // Auto-slide effect
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % slides.length);
    }, 3000); // Slide every 3 seconds
    return () => clearInterval(interval); // Cleanup interval
  }, [slides.length]);

  return (
    <div className="relative w-full h-screen overflow-hidden">
      {/* Slider */}
      <div
        className="flex transition-transform ease-linear duration-1000"
        style={{ transform: `translateX(-${currentIndex * 100}%)` }}
      >
        {slides.map((src, index) => (
          <div key={index} className="flex-shrink-0 w-full h-screen">
            <img
              src={src}
              alt={`Slide ${index + 1}`}
              className="w-full h-full object-cover"
            />
          </div>
        ))}
      </div>

      {/* Overlay Text and Buttons */}
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center text-white bg-black/50">
        <h1 className="text-4xl md:text-6xl font-bold mb-4">
        "Find your perfect stay—where comfort meets convenience, and every booking feels like coming home."
        </h1>
        <p className="text-lg md:text-xl mb-6">
          Explore the world through stunning visuals.
        </p>
        <div className="space-x-4">
          <button className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg">
            Learn More
          </button>
          <button className="px-6 py-3 bg-gray-800 hover:bg-gray-900 text-white font-semibold rounded-lg">
            Get Started
          </button>
        </div>
      </div>

      {/* Indicators */}
      <div className="absolute bottom-5 left-1/2 transform -translate-x-1/2 flex space-x-2">
        {slides.map((_, index) => (
          <button
            key={index}
            className={`w-4 h-4 rounded-full ${
              currentIndex === index ? "bg-white" : "bg-gray-300"
            }`}
            onClick={() => setCurrentIndex(index)}
          ></button>
        ))}
      </div>
    </div>
  );
};

export default Carousel;
