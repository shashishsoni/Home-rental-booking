import e, { Router, Request, Response } from 'express';
import multer from 'multer';
import { Listing } from '../models/Listing';
import { User } from '../models/user';

// Configure multer
const router = Router();
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname);
    },
});

const upload = multer({ storage });

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

        const listingImages = req.files as Express.Multer.File[];
        if (!listingImages) {
            res.status(404).json({ message: 'File not uploaded' });
            return;
        }

        const listingimagepath = listingImages.map((file) => file.path);

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
        if(qCategory){
            listings = await Listing.find({category: qCategory}).populate('Creator');
        } else {
            listings = await Listing.find();
        }

        res.status(200).json({ listings });
    } catch (err) {
        res.status(500).json({ message: 'Failed to fetch Listing', error: (err as Error).message });
        console.log(err);
    }
});

export default router;