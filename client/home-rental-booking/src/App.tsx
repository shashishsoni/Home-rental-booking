import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "./redux/storecache"; // Adjust import if RootState is defined elsewhere
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import SignUpPage from "./pages/SignUpPage";
import LoadingWrapper from "./components/common/LoadingWrapper";
import './App.css';

const App = () => {
  // Accessing user state from Redux
  const userState = useSelector((state: RootState) => state.user);

  return (
    <LoadingWrapper>
      <BrowserRouter>
        <Routes>
          {/* Always show HomePage */}
          <Route 
            path="/" 
            element={<HomePage />} 
          />
          
          {/* Route for Login */}
          <Route path="/login" element={<LoginPage />} />
          
          {/* Route for SignUp */}
          <Route path="/signup" element={<SignUpPage />} />
        </Routes>
      </BrowserRouter>
    </LoadingWrapper>
  );
};

export default App;

