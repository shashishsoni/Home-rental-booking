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