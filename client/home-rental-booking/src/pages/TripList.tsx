import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Loader, Calendar, MapPin, Clock, IndianRupee } from "lucide-react";
import Navbar from "@/components/Navbar";
import { Trip } from "../types/types";
import { setTripList } from "../redux/cache";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { fadeIn } from "../utils/animations";
import Footer from '../components/Footer';

interface TripWithListing extends Trip {
  listing?: {
    title: string;
    images: string[];
    city: string;
    province: string;
    country: string;
  };
}

const TripList: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [tripsWithDetails, setTripsWithDetails] = useState<TripWithListing[]>([]);
  const dispatch = useDispatch();
  const userId = useSelector((state: any) => state.user?.user?._id);
  const token = useSelector((state: any) => state.user?.token);
  const [currentImageIndexes, setCurrentImageIndexes] = useState<{ [key: string]: number }>({});
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTripsWithDetails = async () => {
      if (!userId || !token) {
        setLoading(false);
        return;
      }

      try {
        

        const response = await fetch(`${import.meta.env.VITE_API_URL}/user/${userId}/trips`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch trips');
        }

        const data = await response.json();
        

        if (data.trips && Array.isArray(data.trips)) {
          const sortedTrips = data.trips.sort((a: Trip, b: Trip) => 
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          );

          // Fetch listing details for each trip
          const tripsWithListingDetails = await Promise.all(
            sortedTrips.map(async (trip: Trip) => {
              try {
                const listingResponse = await fetch(
                  `${import.meta.env.VITE_API_URL}/listing/${trip.listingId}`
                );
                if (listingResponse.ok) {
                  const listingData = await listingResponse.json();
                  return {
                    ...trip,
                    listing: {
                      title: listingData.listing.title,
                      images: listingData.listing.listingImages,
                      city: listingData.listing.city,
                      province: listingData.listing.province,
                      country: listingData.listing.country,
                    },
                  };
                }
              } catch (error) {
                console.error(`Error fetching listing ${trip.listingId}:`, error);
              }
              return trip;
            })
          );

          setTripsWithDetails(tripsWithListingDetails);
          dispatch(setTripList(sortedTrips));
        }
      } catch (error) {
        console.error('Failed to fetch trips:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTripsWithDetails();
  }, [userId, token, dispatch]);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndexes(prev => {
        const newIndexes = { ...prev };
        tripsWithDetails.forEach(trip => {
          if (trip.listing?.images?.length) {
            newIndexes[trip._id] = ((prev[trip._id] || 0) + 1) % trip.listing.images.length;
          }
        });
        return newIndexes;
      });
    }, 5000); // Change image every 5 seconds

    return () => clearInterval(interval);
  }, [tripsWithDetails]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-purple-50 to-blue-100">
        <div className="p-8 backdrop-blur-lg bg-white/30 rounded-2xl">
          <Loader className="w-8 h-8 animate-spin text-purple-600" />
        </div>
      </div>
    );
  }

  if (!tripsWithDetails || tripsWithDetails.length === 0) {
    return (
      <div className="w-screen max-w-full min-h-screen bg-black bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(120,119,198,0.3),rgba(255,255,255,0))] flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center w-full">
          <div className="w-full max-w-7xl px-4">
            <h1 className="text-4xl font-bold mb-8 text-white text-center">Your Trips</h1>
            <div className="backdrop-blur-lg bg-white/10 p-12 rounded-2xl text-center text-gray-200">
              No trips found. Start your journey today!
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(120,119,198,0.3),rgba(255,255,255,0))] flex flex-col">
      <Navbar />
      <div className="mb-12 w-screen p-4 sm:p-8">
        {/* Enhanced Hero Section */}
        <div className="text-center mt-24 mb-16 relative">
          <h1 className="text-7xl font-bold mb-4 relative z-10">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 animate-text">
              Your Journeys
            </span>
          </h1>
          <p className="text-xl text-gray-400 tracking-wide">
            {tripsWithDetails.length} {tripsWithDetails.length === 1 ? 'adventure' : 'adventures'} awaiting
          </p>
          <div className="absolute inset-0 blur-3xl bg-gradient-to-r from-purple-500/20 via-transparent to-pink-500/20 animate-pulse" />
        </div>

        <div className="w-full space-y-12">
          {tripsWithDetails.map((trip, index) => (
            <motion.div
              key={trip._id}
              variants={fadeIn('right', 2 * (index + 1))}
              initial="hidden"
              animate="show"
              onClick={() => navigate(`/listing/${trip.listingId}`)}
              className="w-full group relative bg-black/40 backdrop-blur-xl rounded-3xl overflow-hidden 
                shadow-[0_8px_40px_-12px_rgba(0,0,0,0.6)] 
                hover:shadow-[0_20px_60px_-12px_rgba(120,119,198,0.5)] 
                transition-all duration-500 border border-white/10
                cursor-pointer"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 to-pink-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              
              <div className="flex flex-col md:flex-row w-full h-full relative">
                {/* Enhanced Image Section with Slideshow */}
                <div className="md:w-1/2 h-96 md:h-[600px] relative overflow-hidden">
                  {trip.listing?.images && trip.listing.images.length > 0 ? (
                    <div className="relative w-full h-full">
                      {trip.listing.images.map((image, imgIndex) => (
                        <img
                          key={imgIndex}
                          src={`${import.meta.env.VITE_API_URL}/uploads/${image.replace(/^.*[\\\/]/, '')}`}
                          alt={`${trip.listing?.title} - ${imgIndex + 1}`}
                          className="absolute inset-0 w-full h-full object-cover transform transition-all duration-1000"
                          style={{
                            opacity: imgIndex === (currentImageIndexes[trip._id] || 0) ? 1 : 0,
                            transform: `scale(${imgIndex === (currentImageIndexes[trip._id] || 0) ? 1.1 : 1})`,
                            zIndex: imgIndex === (currentImageIndexes[trip._id] || 0) ? 1 : 0
                          }}
                        />
                      ))}
                      {/* Image Navigation Dots */}
                      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2 z-10">
                        {trip.listing.images.map((_, imgIndex) => (
                          <button
                            key={imgIndex}
                            onClick={() => setCurrentImageIndexes(prev => ({
                              ...prev,
                              [trip._id]: imgIndex
                            }))}
                            className={`w-2 h-2 rounded-full transition-all duration-300 
                              ${imgIndex === (currentImageIndexes[trip._id] || 0)
                                ? 'bg-white w-4'
                                : 'bg-white/50 hover:bg-white/80'}`}
                          />
                        ))}
                      </div>
                      {/* Navigation Arrows */}
                      <button
                        onClick={() => setCurrentImageIndexes(prev => ({
                          ...prev,
                          [trip._id]: ((prev[trip._id] || 0) - 1 + trip.listing!.images.length) % trip.listing!.images.length
                        }))}
                        className="absolute left-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/30 hover:bg-black/50 text-white/80 hover:text-white transition-all z-10"
                      >
                        ←
                      </button>
                      <button
                        onClick={() => setCurrentImageIndexes(prev => ({
                          ...prev,
                          [trip._id]: ((prev[trip._id] || 0) + 1) % trip.listing!.images.length
                        }))}
                        className="absolute right-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/30 hover:bg-black/50 text-white/80 hover:text-white transition-all z-10"
                      >
                        →
                      </button>
                      <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                    </div>
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-gray-900 to-gray-800 flex items-center justify-center">
                      <span className="text-gray-400">No image available</span>
                    </div>
                  )}
                </div>

                {/* Enhanced Content Section */}
                <div className="md:w-1/2 p-8 flex flex-col justify-between">
                  <div>
                    {/* Title and Location */}
                    <div className="mb-8">
                      <h2 className="text-4xl font-bold text-white mb-4 group-hover:text-purple-400 transition-colors duration-300">
                        {trip.listing?.title || "Unnamed Location"}
                      </h2>
                      <div className="flex items-center text-gray-300">
                        <MapPin className="w-5 h-5 mr-3 text-purple-400" />
                        <span className="text-lg font-light">
                          {trip.listing?.city}, {trip.listing?.province}, {trip.listing?.country}
                        </span>
                      </div>
                    </div>

                    {/* Dates and Price */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div className="bg-white/5 backdrop-blur-lg p-6 rounded-2xl border border-white/10 hover:border-purple-500/50 transition-colors duration-300">
                        <div className="flex items-center space-x-4">
                          <div className="p-3 bg-green-500/10 rounded-xl">
                            <Calendar className="w-6 h-6 text-green-400" />
                          </div>
                          <div>
                            <p className="text-gray-400 text-sm font-medium uppercase tracking-wider">Check in</p>
                            <p className="text-white text-lg font-medium">
                              {new Date(trip.startDate).toLocaleDateString('en-US', {
                                weekday: 'short',
                                month: 'short',
                                day: 'numeric'
                              })}
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="bg-white/5 backdrop-blur-lg p-6 rounded-2xl border border-white/10 hover:border-purple-500/50 transition-colors duration-300">
                        <div className="flex items-center space-x-4">
                          <div className="p-3 bg-red-500/10 rounded-xl">
                            <Calendar className="w-6 h-6 text-red-400" />
                          </div>
                          <div>
                            <p className="text-gray-400 text-sm font-medium uppercase tracking-wider">Check out</p>
                            <p className="text-white text-lg font-medium">
                              {new Date(trip.endDate).toLocaleDateString('en-US', {
                                weekday: 'short',
                                month: 'short',
                                day: 'numeric'
                              })}
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="bg-white/5 backdrop-blur-lg p-6 rounded-2xl border border-white/10 hover:border-purple-500/50 transition-colors duration-300">
                        <div className="flex items-center space-x-4">
                          <div className="p-3 bg-purple-500/10 rounded-xl">
                            <IndianRupee className="w-6 h-6 text-purple-400" />
                          </div>
                          <div>
                            <p className="text-gray-400 text-sm font-medium uppercase tracking-wider">Total</p>
                            <p className="text-white text-lg font-medium">
                              ₹{trip.totalPrice.toLocaleString()}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Booking Info */}
                  <div className="mt-8 pt-6 border-t border-white/10">
                    <div className="flex items-center text-gray-400">
                      <Clock className="w-4 h-4 mr-2" />
                      <p className="text-sm">
                        Booked on {new Date(trip.createdAt).toLocaleString('en-US', {
                          month: 'long',
                          day: 'numeric',
                          year: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default TripList;