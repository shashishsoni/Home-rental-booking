import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    firstname: {
      type: String,
      required: true
    },
    lastname: {
      type: String,
      required: true
    },
    Email: {
      type: String,
      required: true,
      unique: true,
      match: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, // Email format validation
    },
    password: {
      type: String,
      required: true
    },
    confirmpassword: {
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

// Adding instance method to compare password and confirmpassword
userSchema.methods.isPasswordValid = function () {
  return this.password === this.confirmpassword;
};

export const User = mongoose.model('User', userSchema);
export default User;
