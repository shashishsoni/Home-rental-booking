import React from 'react';
import { useSelector } from 'react-redux';
import Navbar from '@/components/Navbar';

const HomePage = () => {
  const userState = useSelector((state: any) => state.user);
  
  return (
    <div>
      <Navbar />
      <main className="container mx-auto p-4">
        {/* Common content visible to all users */}
        <h1 className="text-2xl font-bold mb-4">Welcome to Our Site</h1>
        
        {/* Conditional content based on user state */}
        {userState?.user ? (
          <div>
            <p>Welcome back, {userState.user.name}!</p>
            {/* Add logged-in user specific content here */}
          </div>
        ) : (
          <div>
            <p>Explore our site or sign in to access more features</p>
            {/* Add non-logged-in user specific content here */}
          </div>
        )}
      </main>
    </div>
  );
};

export default HomePage;