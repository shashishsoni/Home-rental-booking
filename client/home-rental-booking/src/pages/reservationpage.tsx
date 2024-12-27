import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import Navbar from "../components/Navbar";
import { Loader } from "lucide-react";
import { setReservation } from "../redux/cache";
import { useNavigate } from "react-router-dom";
import Footer from "../components/Footer";

interface Reservation {
  _id: string;
  host: {
    _id: string;
    firstname: string;
    lastname: string;
    Email: string;
    profileImagePath: string;
  };
  listingId: {
    _id: string;
    title: string;
    city: string;
    country: string;
    listingImages: string[];
    price: number;
  };
  startDate: string;
  endDate: string;
  totalPrice: number;
  createdAt: string;
}

interface OwnerDetails {
  _id: string;
  firstname: string;
  lastname: string;
  Email: string;
  profileImagePath: string;
  listings?: number;
  phone: string;
  whatsapp: string;
  rating: number;
  totalReviews: number;
}

const ReservationPage = () => {
  const dispatch = useDispatch();
  const user = useSelector((state: any) => state.user?.user);
  const token = useSelector((state: any) => state.user?.token);
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentImageIndexes, setCurrentImageIndexes] = useState<{ [key: string]: number }>({});
  const [showContactInfo, setShowContactInfo] = useState<string | null>(null);
  const [ownerDetails, setOwnerDetails] = useState<OwnerDetails | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchReservations = async () => {
      if (!user?._id) return;

      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/user/${user._id}/reservations`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (!response.ok) throw new Error('Failed to fetch reservations');
        
        const data = await response.json();
        dispatch(setReservation(data.reservations));
        setReservations(data.reservations);
      } catch (error) {
        console.error("Error fetching reservations:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchReservations();
  }, [user?._id, token, dispatch]);

  useEffect(() => {
    const intervals: NodeJS.Timeout[] = [];
    
    reservations.forEach((reservation) => {
      if (reservation.listingId.listingImages.length > 1) {
        const interval = setInterval(() => {
          setCurrentImageIndexes(prev => ({
            ...prev,
            [reservation._id]: ((prev[reservation._id] || 0) + 1) % reservation.listingId.listingImages.length
          }));
        }, 3000);
        intervals.push(interval);
      }
    });

    return () => intervals.forEach(interval => clearInterval(interval));
  }, [reservations]);

  const handleContactOwner = async (hostId: string) => {
    setIsLoading(true);
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/user/${hostId}/details`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setOwnerDetails(data);
        setShowContactInfo(hostId);
      }
    } catch (error) {
      console.error("Error fetching owner details:", error);
    } finally {
      setIsLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-black bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(120,119,198,0.3),rgba(255,255,255,0))]">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 py-32 text-center">
          <h1 className="text-4xl font-bold text-white mb-6">
            Please Login to View Your Reservations
          </h1>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-black bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(120,119,198,0.3),rgba(255,255,255,0))]">
        <Navbar />
        <div className="h-[calc(100vh-80px)] flex items-center justify-center">
          <Loader className="w-8 h-8 animate-spin text-purple-500" />
        </div>
      </div>
    );
  }

  return (
    <>
    <div className="min-h-screen bg-black bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(120,119,198,0.3),rgba(255,255,255,0))]">
      <Navbar />
      <div className="mb-12 container w-screen max-w-full mx-auto px-4 py-32">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold mb-4">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-400 via-pink-500 to-red-500">
              Your Reservations
            </span>
          </h1>
          <p className="text-gray-400 text-lg">
            {reservations.length} {reservations.length === 1 ? 'reservation' : 'reservations'} to manage
          </p>
        </div>

        {!reservations.length ? (
          <div className="text-center py-16 bg-white/5 backdrop-blur-lg rounded-2xl border border-white/10 max-w-2xl mx-auto">
            <h2 className="text-2xl font-semibold text-white mb-4">No reservations yet</h2>
            <p className="text-gray-400">You don't have any active reservations for your properties.</p>
          </div>
        ) : (
          <div className="grid gap-8 max-w-7xl mx-auto">
            {reservations.map((reservation) => (
              <div 
                key={reservation._id}
                className="bg-white/5 backdrop-blur-lg rounded-2xl border border-white/10 overflow-hidden hover:bg-white/10 transition-all duration-300 transform hover:scale-[1.02] hover:shadow-2xl w-full h-[400px]"
              >
                <div className="flex h-full">
                  {/* Listing Images Carousel */}
                  <div className="w-1/3 relative overflow-hidden bg-gray-900">
                    <div 
                      className="flex h-[400px] transition-transform duration-700 ease-out"
                      style={{ 
                        transform: `translateX(-${currentImageIndexes[reservation._id] || 0}00%)`,
                        width: `${reservation.listingId.listingImages.length * 100}%`
                      }}
                    >
                      {reservation.listingId.listingImages.map((image, index) => (
                        <div
                          key={index}
                          className="relative w-full h-[400px] flex-shrink-0"
                        >
                          <img
                            src={`${import.meta.env.VITE_API_URL}/${image.replace(/^\/?(public\/)?/, '')}`}
                            alt={`${reservation.listingId.title} - Image ${index + 1}`}
                            className="absolute inset-0 w-full h-full object-cover"
                            style={{ 
                              maxHeight: '400px',
                              width: '450px'
                            }}
                          />
                          <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-transparent to-transparent" />
                        </div>
                      ))}
                    </div>
                    
                    {/* Image Navigation Dots */}
                    <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2">
                      {reservation.listingId.listingImages.map((_, index) => (
                        <button
                          key={index}
                          onClick={() => setCurrentImageIndexes(prev => ({
                            ...prev,
                            [reservation._id]: index
                          }))}
                          className={`w-2 h-2 rounded-full transition-all duration-300 ${
                            index === (currentImageIndexes[reservation._id] || 0)
                              ? 'bg-white scale-125'
                              : 'bg-white/50 hover:bg-white/75'
                          }`}
                        />
                      ))}
                    </div>
                  </div>

                  {/* Content Section - Keep your existing content section but update some styles */}
                  <div className="w-2/3 p-8 flex flex-col justify-between">
                    <div className="flex flex-col gap-6">
                      {/* Host Info */}
                      <div className="flex items-center gap-4">
                        <div className="relative group">
                          <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full blur group-hover:blur-md transition-all duration-300" />
                          <img
                            src={`${import.meta.env.VITE_API_URL}/uploads/${reservation.host.profileImagePath}`}
                            alt={`${reservation.host.firstname}'s profile`}
                            className="w-16 h-16 rounded-full object-cover relative z-10 ring-2 ring-white/20"
                            style={{
                              objectFit: 'cover',
                              objectPosition: 'center'
                            }}
                          />
                        </div>
                        <div>
                          <h3 className="text-white font-medium text-lg">
                            {reservation.host.firstname} {reservation.host.lastname}
                          </h3>
                          <p className="text-gray-400">{reservation.host.Email}</p>
                        </div>
                      </div>

                      {/* Listing Details */}
                      <div className="space-y-4">
                        <h4 className="text-2xl font-bold text-white line-clamp-2">
                          {reservation.listingId.title}
                        </h4>
                        <div className="flex flex-wrap gap-3">
                          <span className="px-3 py-1 bg-white/10 rounded-full text-gray-300 text-sm">
                            {reservation.listingId.city}, {reservation.listingId.country}
                          </span>
                          <span className="px-3 py-1 bg-emerald-500/10 text-emerald-400 rounded-full text-sm">
                            ₹{reservation.totalPrice.toLocaleString()}
                          </span>
                        </div>
                      </div>

                      {/* Dates */}
                      <div className="flex items-center gap-4 text-sm text-gray-400">
                        <div className="flex items-center gap-2 bg-white/5 px-3 py-2 rounded-lg">
                          <span className="w-2 h-2 bg-green-500 rounded-full" />
                          {new Date(reservation.startDate).toLocaleDateString()}
                        </div>
                        <span className="text-white">→</span>
                        <div className="flex items-center gap-2 bg-white/5 px-3 py-2 rounded-lg">
                          <span className="w-2 h-2 bg-red-500 rounded-full" />
                          {new Date(reservation.endDate).toLocaleDateString()}
                        </div>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-4 mt-6">
                      <button 
                        onClick={() => handleContactOwner(reservation.host._id)}
                        disabled={isLoading}
                        className="flex-1 px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl hover:from-purple-600 hover:to-pink-600 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                      >
                        {isLoading ? (
                          <Loader className="w-5 h-5 animate-spin mx-auto" />
                        ) : (
                          'Contact Owner'
                        )}
                      </button>
                      <button 
                        onClick={() => navigate(`/listing/${reservation.listingId._id}`)}
                        className="flex-1 px-6 py-3 bg-white/10 text-white rounded-xl hover:bg-white/20 transition-all duration-300"
                      >
                        View Details
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Contact Info Modal */}
      {showContactInfo && ownerDetails && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl border border-white/20 p-8 max-w-md w-full mx-4 relative animate-fade-in">
            {/* Close Button */}
            <button 
              onClick={() => setShowContactInfo(null)}
              className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
            >
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            {/* Owner Profile */}
            <div className="flex items-center gap-4 mb-6">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full blur" />
                <img
                  src={`${import.meta.env.VITE_API_URL}/uploads/${ownerDetails.profileImagePath}`}
                  alt={`${ownerDetails.firstname}'s profile`}
                  className="w-20 h-20 rounded-full object-cover relative z-10 ring-2 ring-white/20"
                />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-white">
                  {ownerDetails.firstname} {ownerDetails.lastname}
                </h3>
                <p className="text-gray-400">Property Owner</p>
              </div>
            </div>

            {/* Contact Information */}
            <div className="space-y-4">
              <div className="bg-white/5 rounded-xl p-4">
                <h4 className="text-sm font-medium text-gray-400 mb-2">Contact Information</h4>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-purple-500/10 rounded-lg">
                      <svg className="w-5 h-5 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <a href={`mailto:${ownerDetails.Email}`} className="text-white hover:text-purple-400 transition-colors">
                      {ownerDetails.Email}
                    </a>
                  </div>
                  {ownerDetails.phone && (
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-blue-500/10 rounded-lg">
                        <svg className="w-5 h-5 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                        </svg>
                      </div>
                      <a href={`tel:${ownerDetails.phone}`} className="text-white hover:text-blue-400 transition-colors">
                        {ownerDetails.phone}
                      </a>
                    </div>
                  )}
                  {ownerDetails.whatsapp && (
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-green-500/10 rounded-lg">
                        <svg className="w-5 h-5 text-green-400" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                        </svg>
                      </div>
                      <a 
                        href={`https://wa.me/${ownerDetails.whatsapp}`} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-white hover:text-green-400 transition-colors"
                      >
                        WhatsApp
                      </a>
                    </div>
                  )}
                </div>
              </div>

              {/* Additional Information */}
              <div className="bg-white/5 rounded-xl p-4">
                <h4 className="text-sm font-medium text-gray-400 mb-2">Additional Information</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-3 bg-white/5 rounded-lg">
                    <p className="text-2xl font-bold text-white">{ownerDetails.listings || 0}</p>
                    <p className="text-sm text-gray-400">Properties Listed</p>
                  </div>
                  <div className="text-center p-3 bg-white/5 rounded-lg">
                    <p className="text-2xl font-bold text-white">4.8</p>
                    <p className="text-sm text-gray-400">Rating</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
    <Footer/>
    </>
  );
};

export default ReservationPage;
