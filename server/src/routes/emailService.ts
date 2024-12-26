import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
    service: 'gmail', // Use your email service provider
    auth: {
        user: 'homerentalbooking@gmail.com', // Your email address
        pass: '1234567', // Your email password or app password
    },
});

export const sendEmailNotification = async (bookingDetails: {
    email: string;
    listingTitle: string;
    startDate: Date;
    endDate: Date;
    amount: number;
    nights: number;
}) => {
    try {
        const { email, listingTitle, startDate, endDate, amount, nights } = bookingDetails;

        const mailOptions = {
            from: 'homerentalbooking@gmail.com', // Sender address
            to: email, // Recipient address
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
            `,
        };

        await transporter.sendMail(mailOptions);
        console.log('Email notification sent successfully');
    } catch (error) {
        console.error('Error sending email notification:', error);
        throw new Error('Failed to send email notification');
    }
};
