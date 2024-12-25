import express, { Request, Response } from "express";
import { Booking } from "../models/Booking";

const router = express.Router();

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

export default router;