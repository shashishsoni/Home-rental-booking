import express from "express";
import { Booking } from "../models/Booking.js";
import { User } from "../models/user.js";
import { Listing } from "../models/Listing.js";
const router = express.Router();
// get trip list
router.get("/:userId/trips", async (req, res) => {
    try {
        const userId = req.params.userId;
        const trips = await Booking.find({ customerId: userId }).sort({ createdAt: -1 });
        res.json({ trips });
    }
    catch (error) {
        console.error("Error fetching trips:", error);
        res.status(500).json({ message: "Failed to fetch trips" });
    }
});
// Toggle listing in wishlist (add or remove)
const toggleWishlist = async (req, res) => {
    try {
        const { userId, listingId } = req.params;
        const user = await User.findById(userId);
        const listing = await Listing.findById(listingId);
        if (!user || !listing) {
            res.status(404).json({ message: "User or listing not found" });
            return;
        }
        // Ensure WishList is initialized
        if (!Array.isArray(user.WishList)) {
            user.WishList = [];
        }
        const isWishlisted = user.WishList.includes(listingId);
        if (isWishlisted) {
            user.WishList = user.WishList.filter(id => id.toString() !== listingId);
        }
        else {
            user.WishList.push(listingId);
        }
        await user.save();
        res.json({
            success: true,
            message: isWishlisted ? "Removed from wishlist" : "Added to wishlist",
            wishlist: user.WishList
        });
    }
    catch (error) {
        console.error("Server Error in toggleWishlist:", error);
        res.status(500).json({
            message: "Failed to update wishlist",
            error: error instanceof Error ? error.message : String(error)
        });
    }
};
router.patch("/:userId/:listingId", toggleWishlist);
// get properties list
router.get("/:userId/properties", async (req, res) => {
    try {
        const userId = req.params.userId;
        const properties = await Listing.find({ Creator: userId })
            .populate('Creator', 'firstname lastname Email profileImagePath');
        res.json({ properties });
    }
    catch (error) {
        console.error("Error fetching properties:", error);
        res.status(500).json({ message: "Failed to fetch properties" });
    }
});
// get reservations list (bookings made by the user on other people's listings)
router.get("/:userId/reservations", async (req, res) => {
    try {
        const userId = req.params.userId;
        const reservations = await Booking.find({ customerId: userId })
            .populate({
            path: 'listingId',
            select: 'title city country listingImages price Creator',
            populate: {
                path: 'Creator',
                model: 'User',
                select: 'firstname lastname Email profileImagePath'
            }
        })
            .sort({ createdAt: -1 });
        const formattedReservations = reservations.map(booking => ({
            _id: booking._id,
            host: booking.listingId.Creator,
            listingId: {
                _id: booking.listingId._id,
                title: booking.listingId.title,
                city: booking.listingId.city,
                country: booking.listingId.country,
                listingImages: booking.listingId.listingImages,
                price: booking.listingId.price
            },
            startDate: booking.startDate,
            endDate: booking.endDate,
            totalPrice: booking.totalPrice,
            createdAt: booking.createdAt
        }));
        res.json({ reservations: formattedReservations });
    }
    catch (error) {
        console.error("Error fetching reservations:", error);
        res.status(500).json({ message: "Failed to fetch reservations" });
    }
});
// Add this new endpoint to get user details
router.get("/:userId/details", (async (req, res) => {
    try {
        const userId = req.params.userId;
        const user = await User.findById(userId);
        const listingsCount = await Listing.countDocuments({ Creator: userId });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        res.json({
            _id: user._id,
            firstname: user.firstname,
            lastname: user.lastname,
            Email: user.Email,
            profileImagePath: user.profileImagePath,
            listings: listingsCount,
            phone: "+91 98765 43210",
            whatsapp: "919876543210",
            rating: 4.8,
            totalReviews: 24
        });
    }
    catch (error) {
        console.error("Error fetching user details:", error);
        res.status(500).json({ message: "Failed to fetch user details" });
    }
}));
export default router;
