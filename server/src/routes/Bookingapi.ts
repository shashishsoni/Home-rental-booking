import e, { Router, Request, Response } from 'express';
const router = Router();

import { Booking } from '../models/Booking';

interface BookingRequest{
    customerId: string;
    hostId: string;
    listingId: string;
    startDate: Date;
    endDate: Date;
    totalPrice: number;
}

// create booking
router.post(
    '/create',
    async (req: Request<{}, {}, BookingRequest>, res: Response): Promise<void> => {
        try {
            console.log("Incoming request body:", req.body);

            const { customerId, hostId, listingId, startDate, endDate, totalPrice } = req.body;

            if (!customerId || !hostId || !listingId || !startDate || !endDate || !totalPrice) {
                console.error("Validation error: Missing required fields");
                res.status(400).json({ message: "All fields are required" });
                return;
            }

            const newBooking = new Booking({
                customerId,
                hostId,
                listingId,
                startDate,
                endDate,
                totalPrice,
            });

            console.log("Saving new booking:", newBooking);
            await newBooking.save();
            res.status(201).json(newBooking);
        } catch (error) {
            console.error("Error creating booking:", error); // Log the actual error
            res.status(500).json({ message: "Failed to create a booking" });
        }
    }
);

export default router;