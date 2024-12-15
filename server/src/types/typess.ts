export interface IUser {
    firstname: string;
    lastname: string;
    Email: string;
    password: string;
    profileImagePath?: string;
    tripList: any[];
    WishList: any[];
    PropertyList: any[];
    ReservationList: any[];
  }

  export interface Ilisting {
    Creator: string;
    firstname: string;
    category: string;
    type: string;
    streetaddress: string;
    apartment: string;
    city: string;
    province: string;
    country: string;
    guest: number;
    bedroom: number;
    bathroom: number;
    amenities: string;
    listingImages: string[];
    title: string;
    description: string;
    Highlights: string;
    Highlightdescription: string;
    price: number;
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
  }