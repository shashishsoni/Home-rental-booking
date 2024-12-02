import React from 'react';
import { useSelector } from 'react-redux';

const HomePage = () => {
  const userState = useSelector((state: any) => state.user);

  if (!userState?.user) {
    return <div>No user logged in</div>; // Handle if no user exists
  }

  return (
    <div>
      <h2>Welcome, {userState.user.firstname} {userState.user.lastname}</h2>
      <p>Email: {userState.user.Email}</p>
      {/* Render other user details here */}
    </div>
  );
};

export default HomePage;
