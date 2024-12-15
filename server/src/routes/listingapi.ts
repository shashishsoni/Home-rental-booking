import e, { Router, Request, Response } from 'express';
import multer from 'multer';
import { Listing } from '../models/Listing';
import { User } from '../models/user';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';




// Configure multer
const router = Router();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Create public/uploads directory if it doesn't exist
const uploadsDir = path.join(__dirname, '..', 'public', 'uploads');
if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
}

// Configure multer to store in public/uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadsDir);
    },
    filename: (req, file, cb) => {
        // Add timestamp to prevent filename conflicts
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, `listing-${uniqueSuffix}${path.extname(file.originalname)}`);
    }
});

const upload = multer({
    storage,
    fileFilter: (req, file, cb) => {
        const allowedTypes = ['image/jpeg', 'image/png', 'image/gif'];
        if (allowedTypes.includes(file.mimetype)) {
            cb(null, true);
        } else {
            cb(new Error('Only .png, .jpg and .gif formats are allowed!'));
        }
    },
});


// Creating listing
router.post('/create', upload.array('listingImages'), async (req: Request, res: Response): Promise<void> => {
    try {
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

        console.log('Received listing data:', {
            category,
            type,
            // other fields
        });
        const listingImages = req.files as Express.Multer.File[];
        if (!listingImages) {
            res.status(404).json({ message: 'File not uploaded' });
            return;
        }

        const listingimagepath = listingImages.map(file => 
            `/public/uploads/${path.basename(file.path)}`
        );


        // Retrieve user details to get `firstname`
        const user = await User.findById(Creator);
        if (!user) {
            res.status(404).json({ message: 'User not found' });
            return;
        }

        const newlisting = new Listing({
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
            amenities,
            listingImages: listingimagepath,
            title,
            description,
            Highlights,
            Highlightdescription,
            price,
        });
    
        await newlisting.save();

        res.status(201).json({ message: 'Listing created successfully' });
    } catch (err) {
        res.status(500).json({ message: 'Listing not created', error: (err as Error).message });
        console.log(err);
    }
});

// get listing on frontend through api
router.get("/", async (req: Request, res: Response): Promise<void> => {
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
        res.status(500).json({ message: 'Failed to fetch Listing', error: (err as Error).message });
        console.log(err);
    }
});

export default router;