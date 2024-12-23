import express, { Request, Response } from "express";
import { Booking } from "../models/Booking";

const router = express.Router();

// get trip list
router.get('/:userId/trips', async(req: Request, res: Response) => {
    try {
        const { userId } = req.params;
        const trips = await Booking.find({ customerId: userId }).populate('customerId hostId listingId');
        res.status(200).json(trips);
    } catch (error) {
        console.error("Error fetching trips:", error);
        res.status(500).json({message: "Failed to fetch trips", error: error });
    }
});

export default router;