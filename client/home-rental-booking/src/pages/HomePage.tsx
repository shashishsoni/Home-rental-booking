import React from 'react';
import Navbar from '@/components/Navbar';
import Slide from '@/components/slide';
import Categories from '@/components/Categories';

const HomePage = () => {
  // const userState = useSelector((state: any) => state.user);
  
  return (
    <div>
      <Navbar />
      <Slide />
      <Categories />
    </div>
  );
};

export default HomePage;