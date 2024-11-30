import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    firstname: {
      type: String,
      required: true,
      trim: true
    },
    lastname: {
      type: String,
      required: true,
      trim: true
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true
    },
    password: {
      type: String,
      required: true
    },
    profilepathImage: {
      type: String,
      default: "",
    },
    tripList: {
      type: Array,
      default: [],
    },
    WishList: {
      type: Array,
      default: [],
    },
    PropertyList: {
      type: Array,
      default: [],
    },
    ReservationList: {
      type: Array,
      default: [],
    },
  },
  { timestamps: true }
);


export const User = mongoose.model('User', userSchema);
export default User;
