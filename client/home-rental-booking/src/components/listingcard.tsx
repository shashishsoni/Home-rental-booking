import React, { useState, useEffect, useMemo } from "react";
import { ListingCardProps } from "../types/types";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Heart } from "lucide-react";
import { setWishlist } from "../redux/cache";
import { selectWishlist } from "../redux/selectors";


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
  const [imageLoadError, setImageLoadError] = useState<boolean[]>(new Array(ListingPhotoPaths.length).fill(false));
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const user = useSelector((state: any) => state.user?.user);
  const token = useSelector((state: any) => state.user?.token);
  
  // Memoize the wishlist to prevent unnecessary re-renders
  const wishlist = useSelector(selectWishlist) || [];
  const isWishlisted = useMemo(() => wishlist.includes(listingId), [wishlist, listingId]);

  // Format image paths
  const formatImagePaths = (paths: string[]) => {
    return paths.map((path) => path.replace(/^\/?(public\/)?/, ''));
  };

  const formattedImagePaths = formatImagePaths(ListingPhotoPaths);

  const getImageUrl = (photoPath: string) => {
    // Remove any duplicate 'uploads/' and leading/trailing slashes
    const cleanPath = photoPath
      .replace(/^https?:\/\/[^\/]+\//, '') // Remove base URL if present
      .replace(/^uploads\/uploads\//, 'uploads/') // Remove duplicate uploads
      .replace(/^\/+|\/+$/g, ''); // Remove leading/trailing slashes

    return `${import.meta.env.VITE_API_URL}/${cleanPath}`;
  };

  // Auto-slide functionality
  useEffect(() => {
    if (formattedImagePaths.length > 1) {
      const interval = setInterval(() => {
        setCurrentIndex((prevIndex) => {
          let nextIndex = (prevIndex + 1) % formattedImagePaths.length;
          let attempts = 0;
          while (imageLoadError[nextIndex] && attempts < formattedImagePaths.length) {
            nextIndex = (nextIndex + 1) % formattedImagePaths.length;
            attempts++;
          }
          return nextIndex;
        });
      }, 3000);
      return () => clearInterval(interval);
    }
  }, [formattedImagePaths, imageLoadError]);

  const isOwnListing = user && creator && user._id === creator._id ? true : false;

  const handleFetch = async (url: string, options: RequestInit = {}) => {
    const response = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...(options.headers as Record<string, string>)
      }
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const contentType = response.headers.get('content-type');
    if (!contentType || !contentType.includes('application/json')) {
      throw new Error(`Invalid content type: ${contentType}`);
    }

    return response.json();
  };

  const handleWishlist = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();

    if (!user || !token) {
      navigate('/login');
      return;
    }

    try {
      const data = await handleFetch(`${import.meta.env.VITE_API_URL}/user/${user._id}/${listingId}`, {
        method: "PATCH",
        headers: {
          "Authorization": `Bearer ${token}`
        },
        credentials: 'include'
      });

      dispatch(setWishlist(data.wishlist));
    } catch (error) {
      console.error("Error updating wishlist:", error);
    }
  };

  // Reset image error state when photos change
  useEffect(() => {
    setImageLoadError(new Array(ListingPhotoPaths.length).fill(false));
  }, [ListingPhotoPaths]);

  const handleImageError = (index: number) => {
    // console.log('Image load error at index:', index);
    setImageLoadError(prev => {
      const newErrors = [...prev];
      newErrors[index] = true;
      return newErrors;
    });
  };

  // Function to get available images count
  const getAvailableImagesCount = () => {
    return ListingPhotoPaths.length - imageLoadError.filter(Boolean).length;
  };

  return (
    <div className="flex flex-col mt-4 md:mt-6 
      w-full max-w-full sm:max-w-full lg:max-w-full xl:max-w-full
      h-full md:h-full lg:h-full xl:h-full 
      bg-white border-2 border-gray-100 rounded-xl shadow-lg overflow-hidden 
      transition-all duration-300 hover:shadow-xl hover:border-gray-200 relative">
      {/* Heart Button */}
      <button
        onClick={handleWishlist}
        disabled={!user || isOwnListing}
        className={`absolute top-4 left-4 z-20 p-2.5 rounded-full 
          ${!user ? 'bg-gray-200/50 cursor-not-allowed' : 
            isOwnListing ? 'bg-gray-200/50 cursor-not-allowed' : 
            'bg-white/90 hover:bg-white shadow-md'} 
          backdrop-blur-sm transition-all duration-300`}
        title={isOwnListing ? "Can't wishlist your own listing" : ""}
      >
        <Heart 
          className={`w-5 h-5 ${
            isWishlisted ? 'fill-red-500 text-red-500' : 
            isOwnListing ? 'text-gray-400' : 'text-gray-600'
          }`} 
        />
      </button>

      {/* Image Slider with adjusted height */}
      <div className="relative h-[200px] md:h-[240px] lg:h-[280px] min-[1556px]:h-[300px] group">
        {getAvailableImagesCount() > 0 ? (
          <div
            className="absolute inset-0 flex transition-transform duration-500 ease-in-out"
            style={{ transform: `translateX(-${currentIndex * 100}%)` }}
          >
            {formattedImagePaths.map((photo, index) => (
              <div
                key={index}
                className="w-full flex-shrink-0 relative"
              >
                {!imageLoadError[index] ? (
                  <img
                    src={getImageUrl(photo)}
                    alt={`${city} property ${index + 1}`}
                    className="w-full h-full object-cover"
                    onError={() => handleImageError(index)}
                  />
                ) : null}
              </div>
            ))}
          </div>
        ) : (
          <div className="absolute inset-0 bg-gray-200 flex justify-center items-center">
            <p className="text-gray-500 text-sm md:text-base min-[1556px]:text-lg">No Images Available</p>
          </div>
        )}

        {/* Price tag with responsive sizing */}
        <div className="absolute top-4 right-4 bg-gradient-to-r from-emerald-500 to-green-600 
          px-3 md:px-4 py-1.5 md:py-2 rounded-full shadow-lg flex flex-col items-center text-white">
          <span className="text-base md:text-lg min-[1556px]:text-xl font-extrabold tracking-wide">
            ₹{price.toLocaleString()}/-
          </span>
          <span className="text-[10px] md:text-xs min-[1556px]:text-sm uppercase font-medium tracking-wider opacity-90">
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

      {/* Content Section with responsive spacing */}
      <div className="p-3 md:p-4 min-[1556px]:p-5 space-y-2 md:space-y-3 min-[1556px]:space-y-4 flex-grow">
        <div className="flex justify-between items-start">
          <div className="space-y-1 md:space-y-2">
            <div className="flex items-center space-x-2">
              <span className="text-[10px] md:text-xs min-[1556px]:text-sm font-medium text-gray-500 uppercase tracking-wider">
                Category
              </span>
              <span className="bg-emerald-50 text-emerald-700 text-[10px] md:text-xs min-[1556px]:text-sm font-semibold px-2 py-0.5 rounded">
                {category || "Miscellaneous"}
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-[10px] md:text-xs min-[1556px]:text-sm font-medium text-gray-500 uppercase tracking-wider">
                Type
              </span>
              <span className="bg-indigo-50 text-indigo-700 text-[10px] md:text-xs min-[1556px]:text-sm font-semibold px-2 py-0.5 rounded">
                {type || "N/A"}
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-2 md:space-x-3">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-4 w-4 md:h-5 md:w-5 text-gray-400"
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
          <p className="text-xs md:text-sm min-[1556px]:text-base text-gray-600">
            {city}, {province}, {country}
          </p>
        </div>
      </div>

      {/* Footer with responsive sizing */}
      <div className="px-3 md:px-4 min-[1556px]:px-5 py-3 md:py-4 border-t border-gray-100 flex justify-between items-center">
        <div className="flex items-center space-x-2 md:space-x-3">
          <div className="w-7 h-7 md:w-8 md:h-8 min-[1556px]:w-9 min-[1556px]:h-9 bg-gray-100 rounded-full flex items-center justify-center">
            <span className="text-xs md:text-sm min-[1556px]:text-base font-medium text-gray-700">
              {creator.firstname.charAt(0).toUpperCase()}
            </span>
          </div>
          <p className="text-xs md:text-sm min-[1556px]:text-base text-gray-600">
            By {creator.firstname} {creator.lastname}
          </p>
        </div>
        <a
          href={`/listing/${listingId}`}
          className="text-emerald-600 hover:text-emerald-800 font-medium text-xs md:text-sm min-[1556px]:text-base flex items-center group"
        >
          Details
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-3 w-3 md:h-4 md:w-4 ml-1 group-hover:translate-x-1 transition-transform"
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
