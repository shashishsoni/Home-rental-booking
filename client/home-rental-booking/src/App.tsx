import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import SignUpPage from "./pages/SignUpPage";
import './App.css';
import { useState, useEffect } from "react";

const App = () => {
  // Accessing user state from Redux
  const userState = useSelector((state: any) => state.user);
  const [isLoading, setLoading] = useState(true);

  useEffect(() => {
    if (userState?.user !== null) {
      setLoading(false); // Stop loading once user data is available
    }
  }, [userState]); // Run when userState changes

  if (isLoading) {
    return <div>Loading...</div>; // Show loading until userState is ready
  }

  return (
    <BrowserRouter>
      <Routes>
        {/* Redirect to Login if no user is logged in */}
        <Route 
          path="/" 
          element={userState?.user ? <HomePage /> : <Navigate to="/Login" />} 
        />
        
        {/* Route for Login */}
        <Route path="/Login" element={<LoginPage />} />
        
        {/* Route for SignUp */}
        <Route path="/SignUp" element={<SignUpPage />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
