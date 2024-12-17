export interface FormDataState {
  firstname: string;
  lastname: string;
  Email: string;
  password: string;
  confirmPassword: string;
  profileImage: null | File;
  message?: string; 
}

export interface UserState {
  user: {
    _id: string;
    firstname: string;
    lastname: string;
    Email: string;
    profileImagePath: string;
  } | null;
  token: string | null;
  profileImagePath: string | null;
  listings: Listing[];
}

export interface Listing {
  _id: string;
  creator: string;
  title: string;
  description: string;
  price: number;
  images: string[];         
  ListingPhotoPaths: string[]; 
  city: string;               
  province: string;           
  country: string;            
  category: string;           
  type: string; 
  guestCount: number;
  bedroomCount: number;
  bedCount: number;
  bathroomCount: number;
  amenities: string[];
  highlight: string;
  highlightDescription: string;
}

export interface ListingCardProps {
  listingId: string;
  creator: string;
  ListingPhotoPaths: string[];
  city: string;
  province?: string; 
  country: string;
  category: string;
  type: string;
  price: number;
}
