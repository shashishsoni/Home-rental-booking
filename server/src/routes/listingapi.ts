// Import required modules
import express, { Router, Request, Response } from 'express';
import multer from 'multer';
import mongoose from 'mongoose';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { User } from '../models/user';
import { Listing } from '../models/Listing';

// Create router
const router = Router();

// Setup paths
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const uploadsDir = path.join(__dirname, '..', 'public', 'uploads');

// Ensure uploads directory exists
if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
}

// Configure multer storage
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadsDir);
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, `listing-${uniqueSuffix}${path.extname(file.originalname)}`);
    },
});

const upload = multer({
    storage,
    limits: { fileSize: 10 * 1024 * 1024 }, // Limit file size to 10MB
    fileFilter: (req, file, cb) => {
        // No file type restrictions
        cb(null, true);
    },
});

// Create Listing Endpoint
router.post('/create', upload.array('listingImages'), async (req: Request, res: Response): Promise<void> => {
    try {
        // Extract data from request body
        const {
            Creator,
            type,
            category,
            streetaddress,
            apartment,
            city,
            province,
            country,
            guest,
            bedroom,
            bathroom,
            amenities,
            title,
            description,
            Highlights,
            Highlightdescription,
            price,
        } = req.body;

        // Validate required fields
        if (!Creator || !type || !category || !title || !price) {
            res.status(400).json({ message: 'Missing required fields' });
            return;
        }

        // Validate price
        if (isNaN(Number(price))) {
            res.status(400).json({ message: 'Price must be a valid number' });
            return;
        }

        // Debug request data
        console.log('Request body:', req.body);

        // Validate uploaded files
        const listingImages = req.files as Express.Multer.File[];
        if (!listingImages || listingImages.length === 0) {
            res.status(400).json({ message: 'No listing images uploaded' });
            return;
        }

        // Map image file paths
        const listingimagepath = listingImages.map(file => 
            `/public/uploads/${path.basename(file.path)}`
        );

        // Fetch user details to retrieve firstname
        const user = await User.findById(Creator);
        if (!user) {
            res.status(404).json({ message: 'Creator user not found' });
            return;
        }

        // Create new listing
        const newListing = new Listing({
            Creator,
            firstname: user.firstname,
            category,
            type,
            streetaddress,
            apartment,
            city,
            province,
            country,
            guest,
            bedroom,
            bathroom,
            amenities: amenities ? amenities.split(',') : [],
            listingImages: listingimagepath,
            title,
            description,
            Highlights,
            Highlightdescription,
            price,
        });

        // Save listing to database
        await newListing.save();

        res.status(201).json({ message: 'Listing created successfully', listing: newListing });
    } catch (err) {
        console.error('Error creating listing:', err);
        res.status(500).json({ message: 'Internal server error', error: (err as Error).message });
    }
});

// Get Listings Endpoint
router.get('/', async (req: Request, res: Response): Promise<void> => {
    const qCategory = req.query.category;
    try {
        let listings;
        if (qCategory) {
            listings = await Listing.find({ category: qCategory }).populate('Creator');
        } else {
            listings = await Listing.find().populate('Creator');
        }

        res.status(200).json({ listings });
    } catch (err) {
        console.error('Error fetching listings:', err);
        res.status(500).json({ message: 'Failed to fetch listings', error: (err as Error).message });
    }
});

router.get('/:listingId', async (req: Request, res: Response) => {
        try {
            const {listingId} = req.params;
            const listing = await Listing.findById(listingId)
            res.status(200).json({listing})
        } catch (err) {
            res.status(500).json({message: 'Failed to fetch listing', error: (err as Error).message})
        }
})

export default router;