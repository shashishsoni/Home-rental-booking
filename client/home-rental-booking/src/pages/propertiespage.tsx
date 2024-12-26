import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Listing } from "../types/types";
import Navbar from "../components/Navbar";
import ListingCard from "../components/listingcard";
import { setProperties } from "../redux/cache";
import Footer from '../components/Footer';

const PropertiesPage = () => {
  const dispatch = useDispatch();
  const user = useSelector((state: any) => state.user?.user);
  const token = useSelector((state: any) => state.user?.token);

  useEffect(() => {
    let isMounted = true;

    const fetchProperties = async () => {
      if (!user?._id) return;
        
      try {
        const response = await fetch(`http://localhost:3001/user/${user._id}/properties`, {
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
              return `http://localhost:3001/${cleanPath}`;
            }) || [],
            creator: {
              _id: property.Creator?._id || user._id,
              firstname: property.Creator?.firstname || user.firstname,
              lastname: property.Creator?.lastname || user.lastname,
              Email: property.Creator?.Email || user.Email,
              profileImagePath: property.Creator?.profileImagePath
                ? `http://localhost:3001/uploads/${property.Creator.profileImagePath}`
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

  const properties = useSelector((state: any) => state.user?.properties || []);

  if (!user) {
    return (
      <div className="min-h-screen bg-black bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(120,119,198,0.3),rgba(255,255,255,0))] flex flex-col">
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
    <div className="min-h-screen bg-black bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(120,119,198,0.3),rgba(255,255,255,0))] flex flex-col">
      <Navbar />
      <div className="mb-12 w-screen max-w-full container mx-auto px-4 py-32 flex flex-col items-center">
        <div className="text-center mb-16 w-full">
          <h1 className="text-5xl font-bold mb-4">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-400 via-pink-500 to-red-500">
              Your Properties
            </span>
          </h1>
          <p className="text-gray-400 text-lg">
            {properties.length} {properties.length === 1 ? 'property' : 'properties'} listed
          </p>
        </div>

        {!properties.length ? (
          <div className="text-center py-16 bg-white/5 backdrop-blur-lg rounded-2xl border border-white/10 w-full max-w-2xl mx-auto">
            <h2 className="text-2xl font-semibold text-white mb-4">You haven't listed any properties yet</h2>
            <p className="text-gray-400">Start hosting by creating your first listing!</p>
          </div>
        ) : (
          <div className="flex items-center justify-center w-full">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 items-center place-items-center">
              {properties.map((listing: Listing) => (
                <ListingCard
                  key={listing._id}
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
              ))}
            </div>
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default PropertiesPage;
