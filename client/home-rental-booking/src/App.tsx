import { BrowserRouter, Routes, Route} from "react-router-dom";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import SignUpPage from "./pages/SignUpPage";
import LoadingWrapper from "./components/common/LoadingWrapper";
import CreateListing from "./pages/CreateListing";
import './App.css';
import ListingDetail from "./pages/ListingDetail";
import TripList from "./pages/TripList";
import WishlistPage from "./pages/wishlistpage";
import PropertiesPage from "./pages/propertiespage";
import ReservationPage from "./pages/reservationpage";
import SearchResults from './pages/SearchResults';



const App = () => {

  return (
    <LoadingWrapper>
      <BrowserRouter>
        <div className="min-h-screen bg-black">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignUpPage />} />
            <Route path="/create-Listing" element={<CreateListing />} />
            <Route path="/Listing/:listingId" element={<ListingDetail/>} />
            <Route path="/:userId/trips" element={<TripList/>} />
            <Route path="/:userId/wishlist" element={<WishlistPage />} />
            <Route path="/:userId/properties" element={<PropertiesPage />} />
            <Route path="/:userId/reservations" element={<ReservationPage />} />
            <Route path="/search" element={<SearchResults />} />
          </Routes>
        </div>
      </BrowserRouter>
    </LoadingWrapper>
  );
};

export default App;

