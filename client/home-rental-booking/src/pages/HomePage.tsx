import React from 'react';
import { useSelector } from 'react-redux';
import Navbar from '@/components/Navbar';

const HomePage = () => {
  const userState = useSelector((state: any) => state.user);

  if (!userState?.user) {
    return <div>No user logged in</div>;
  }

  return (
    <>
      <Navbar />
    </>
  );
};

export default HomePage;
