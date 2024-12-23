import e, { Router, Request, Response } from 'express';
const router = Router();

import { Booking } from '../models/Booking';

// create booking
router.post('/create', async(req: Request, res: Response) => {
    try {
        const { customerId, hostId, listingId, startDate, endDate, totalPrice } = req.body;
        const newbooking = new Booking({ customerId, hostId, listingId, startDate, endDate, totalPrice });
        await newbooking.save();
        res.status(200).json(newbooking);
    } catch (error) {
        res.status(500).json({message: "Failed to create a booking", error: error });
    }
}) 

export default router;