export interface FormDataState {
  firstname: string;
  lastname: string;
  Email: string;
  password: string;
  confirmPassword: string;
  profileImage: null | File;
  message?: string; 
}

export interface Trip {
  _id: string;
  customerId: string;
  hostId: string;
  listingId: string;
  startDate: string;
  endDate: string;
  totalPrice: number;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface UserState {
  user: any;
  token: string | null;
  profileImagePath: string | null;
  listings: Listing[];
  wishlist: string[];
}


export interface Listing {
  _id: string;
  creator: Creator;
  parsedCreator: {
    firstname: string;
    lastname: string;
    profileImagePath: string | null;
  };
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

export interface Creator {
  _id: string;
  firstname: string;
  lastname: string;
}

export interface ListingCardProps {
  listingId: string;
  creator: Creator;
  ListingPhotoPaths: string[];
  city: string;
  province?: string; 
  country: string;
  category: string;
  type: string;
  price: number;
}
