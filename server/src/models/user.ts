import { timeStamp } from "console"
import mongoose from "mongoose"

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
            unique: true
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
)

const User = mongoose.model("User", userSchema)
module.exports = User