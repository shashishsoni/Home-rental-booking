import Navbar from "@/components/Navbar";
import { Loader } from "lucide-react";
import React from "react";
import { useState } from "react";
import { useSelector } from "react-redux";

const TripList = () => {
  const [loading, setLoading] = useState(true);
  const userId = useSelector((state: any) => state.user.user._id);
  const triplist = useSelector((state: any) => state.user.user.triplist);

  const gettriplist = async () => {
    try {
        const response = await fetch(`http://localhost:3001/user/${userId}/trips`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        const data = await response.json();
    } catch (error) {
        console.error(error);
    }
  }

  return loading ? (
    <Loader />
  ) : (
    <>
      <Navbar />
      <h1 className="">Your Trip List</h1>
      <div></div>
    </>
  );
};

export default TripList;
