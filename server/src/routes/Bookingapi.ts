import e, { Router, Request, Response } from 'express';
const router = Router();

import { Booking } from '../models/Booking';
import nodemailer from 'nodemailer';

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

// Configure nodemailer
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'your-email@gmail.com', // Replace with your email
    pass: 'your-app-password' // Replace with your app password
  }
});

// Add this new endpoint
router.post("/send-confirmation", async (req: Request, res: Response) => {
  try {
    const { email, listingTitle, startDate, endDate, amount, nights } = req.body;

    const mailOptions = {
      from: 'your-email@gmail.com',
      to: email,
      subject: 'Booking Confirmation - HomeRental',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #6366f1;">Booking Confirmed!</h1>
          <p>Thank you for booking with HomeRental. Your stay at ${listingTitle} has been confirmed.</p>
          
          <div style="background-color: #f3f4f6; padding: 20px; border-radius: 10px; margin: 20px 0;">
            <h2 style="color: #374151; margin-bottom: 10px;">Booking Details</h2>
            <p><strong>Check-in:</strong> ${new Date(startDate).toLocaleDateString()}</p>
            <p><strong>Check-out:</strong> ${new Date(endDate).toLocaleDateString()}</p>
            <p><strong>Duration:</strong> ${nights} nights</p>
            <p><strong>Total Amount:</strong> ₹${amount.toLocaleString()}</p>
          </div>
          
          <p>We hope you enjoy your stay!</p>
          <p>Best regards,<br>The HomeRental Team</p>
        </div>
      `
    };

    await transporter.sendMail(mailOptions);
    res.status(200).json({ message: 'Confirmation email sent' });
  } catch (error) {
    console.error('Error sending email:', error);
    res.status(500).json({ message: 'Failed to send confirmation email' });
  }
});

export default router;