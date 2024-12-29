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
  properties: Listing[];
  reservations: any[];
}


export interface Listing {
  _id: string;
  creator: {
    _id: string;
    firstname: string;
    lastname: string;
    profileImagePath?: string;
  };
  title: string;
  description: string;
  price: number;
  ListingPhotoPaths: string[];
  city: string;
  province: string;
  country: string;
  category: string;
  type: string;
  guest: number;
  bedroom: number;
  bathroom: number;
  amenities: string[];
  Highlights?: string;
  Highlightdescription?: string;
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

export interface Booking {
  _id: string;
  customerId: {
    _id: string;
    firstname: string;
    lastname: string;
    Email: string;
    profileImagePath: string;
  };
  listingId: {
    _id: string;
    title: string;
    city: string;
    country: string;
    listingImages: string[];
    price: number;
  };
  startDate: string;
  endDate: string;
  totalPrice: number;
  createdAt: string;
}
