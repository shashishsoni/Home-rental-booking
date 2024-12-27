import mongoose, { Schema } from "mongoose";
const bookingSchema = new mongoose.Schema({
    customerId: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    hostId: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    listingId: {
        type: Schema.Types.ObjectId,
        ref: "Listing",
        required: true,
    },
    startDate: {
        type: String,
        required: true,
    },
    endDate: {
        type: String,
        required: true,
    },
    totalPrice: {
        type: Number,
        required: true,
    },
}, { timestamps: true });
const Booking = mongoose.model("Booking", bookingSchema);
export { Booking };
