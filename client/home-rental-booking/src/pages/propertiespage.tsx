import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Listing } from "../types/types";
import Navbar from "../components/Navbar";
import ListingCard from "../components/listingcard";
import { setProperties } from "../redux/cache";
import Footer from '../components/Footer';
import { selectUser, selectToken, selectProperties} from '../redux/selectors';

const PropertiesPage = () => {
  const dispatch = useDispatch();
  const user = useSelector(selectUser);
  const token = useSelector(selectToken);
  const properties = useSelector(selectProperties);

  useEffect(() => {
    let isMounted = true;

    const fetchProperties = async () => {
      if (!user?._id) return;
        
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/user/${user._id}/properties`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        });

        if (!response.ok) {
          throw new Error('Failed to fetch properties');
        }

        const data = await response.json();
        if (isMounted) {
          const properties = data.properties.map((property: any) => ({
            ...property,
            ListingPhotoPaths: property.listingImages?.map((path: string) => {
              const cleanPath = path.replace(/^\/?(public\/)?/, '');
              return `${import.meta.env.VITE_API_URL}/${cleanPath}`;
            }) || [],
            creator: {
              _id: property.Creator?._id || user._id,
              firstname: property.Creator?.firstname || user.firstname,
              lastname: property.Creator?.lastname || user.lastname,
              Email: property.Creator?.Email || user.Email,
              profileImagePath: property.Creator?.profileImagePath
                ? `${import.meta.env.VITE_API_URL}/uploads/${property.Creator.profileImagePath}`
                : '/default-avatar.png'
            }
          }));
          dispatch(setProperties(properties));
        }
      } catch (error) {
        console.error("Error fetching properties:", error);
      }
    };

    fetchProperties();

    return () => {
      isMounted = false;
    };
  }, [user?._id, dispatch, token]);

  if (!user) {
    return (
      <div className="min-h-screen flex flex-col bg-black bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(120,119,198,0.3),rgba(255,255,255,0))] bg-fixed overflow-x-hidden">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 py-32 text-center">
          <h1 className="text-4xl font-bold text-white mb-6">
            Please Login to View Your Properties
          </h1>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-black bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(120,119,198,0.3),rgba(255,255,255,0))] bg-fixed overflow-x-hidden">
      <Navbar />
      <main className="flex-grow flex items-center justify-center w-full py-16 sm:py-24 lg:py-32 px-4">
        <div className="w-full max-w-[1400px] mx-auto">
          <div className="text-center mb-8 sm:mb-12 lg:mb-16">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-400 via-pink-500 to-red-500">
                Your Properties
              </span>
            </h1>
            <p className="text-gray-400 text-base sm:text-lg">
              {properties.length} {properties.length === 1 ? 'property' : 'properties'} listed
            </p>
          </div>

          {!properties.length ? (
            <div className="text-center py-12 sm:py-16 bg-white/5 backdrop-blur-lg rounded-2xl border border-white/10 max-w-2xl mx-auto">
              <h2 className="text-xl sm:text-2xl font-semibold text-white mb-4">You haven't listed any properties yet</h2>
              <p className="text-gray-400">Start hosting by creating your first listing!</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
              {properties.map((listing: Listing) => (
                <div key={listing._id} className="flex justify-center">
                  <ListingCard
                    listingId={listing._id}
                    creator={listing.creator}
                    ListingPhotoPaths={listing.ListingPhotoPaths}
                    city={listing.city}
                    province={listing.province}
                    country={listing.country}
                    category={listing.category}
                    type={listing.type}
                    price={listing.price}
                  />
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default PropertiesPage;
