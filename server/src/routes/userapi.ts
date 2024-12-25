import express, { Request, Response, Router, RequestHandler } from "express";
import { Booking } from "../models/Booking";
import { User } from "../models/user";
import { Listing } from "../models/Listing";

const router: Router = express.Router();

// get trip list
router.get("/:userId/trips", async (req, res) => {
    try {
        const userId = req.params.userId;
        const trips = await Booking.find({ customerId: userId }).sort({ createdAt: -1 });
        res.json({ trips });
    } catch (error) {
        console.error("Error fetching trips:", error);
        res.status(500).json({ message: "Failed to fetch trips" });
    }
});

// Toggle listing in wishlist (add or remove)
const toggleWishlist: RequestHandler = async (req, res) => {
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
        } else {
            user.WishList.push(listingId);
        }

        await user.save();

        res.json({
            success: true,
            message: isWishlisted ? "Removed from wishlist" : "Added to wishlist",
            wishlist: user.WishList
        });

    } catch (error) {
        console.error("Server Error in toggleWishlist:", error);
        res.status(500).json({ 
            message: "Failed to update wishlist",
            error: error instanceof Error ? error.message : String(error)
        });
    }
};

router.patch("/:userId/:listingId", toggleWishlist);

export default router;