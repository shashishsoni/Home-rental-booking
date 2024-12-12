import React from 'react';
import Navbar from '@/components/Navbar';
import Slide from '@/components/slide';
import Categories from '@/components/Categories';
import Listings from '../components/listings';

const HomePage = () => {
  // const userState = useSelector((state: any) => state.user);
  
  return (
    <div>
      <Navbar />
      <Slide />
      <Categories />
      <Listings />
    </div>
  );
};

export default HomePage;