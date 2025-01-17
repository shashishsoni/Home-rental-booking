import mongoose, { model, Schema } from "mongoose";

// Listing schema definition
const listingSchema = new mongoose.Schema(
  {
    Creator: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    category: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      required: true,
    },
    streetaddress: {
      type: String,
      required: true,
    },
    apartment: {
      type: String,
      required: true,
    },
    city: {
      type: String,
      required: true,
    },
    province: {
      type: String,
      required: true,
    },
    country: {
      type: String,
      required: true,
    },
    guest: {
      type: Number,
      required: true,
    },
    bedroom: {
      type: Number,
      required: true,
    },
    bathroom: {
      type: Number,
      required: true,
    },
    bed: {
      type: Number,
      required: true,
    },
    amenities: {
      type: [String],
      required: true,
    },
    listingImages: {
      type: [String],
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    Highlights: {
      type: String,
      required: true,
    },
    Highlightdescription: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
  },
  { timestamps: true }
);

export const Listing = mongoose.model("Listing", listingSchema);
