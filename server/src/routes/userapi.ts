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
        
        // Add error logging
        console.log('Attempting to update wishlist:', { userId, listingId });
        
        const user = await User.findById(userId);
        const listing = await Listing.findById(listingId);

        if (!user || !listing) {
            console.log('Not found:', { user: !!user, listing: !!listing });
            res.status(404).json({ message: "User or listing not found" });
            return;
        }

        // Ensure WishList is initialized
        if (!Array.isArray(user.WishList)) {
            user.WishList = [];
        }

        const favoriteListing = user.WishList.find(
            (item) => item?.toString() === listingId
        );

        if (favoriteListing) {
            user.WishList = user.WishList.filter(
                (item) => item?.toString() !== listingId
            );
        } else {
            user.WishList.push(listingId); // Use listingId directly instead of listing._id
        }

        await user.save();
        res.json({
            message: favoriteListing ? "Listing removed from wishlist" : "Listing added to wishlist",
            isWishlisted: !favoriteListing,
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