// Import required modules
import express, { Router, Request, Response, RequestHandler } from "express";
import multer from "multer";
import mongoose from "mongoose";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { User } from "../models/user";
import { Listing } from "../models/Listing";

// Create router
const router = Router();

// Setup paths
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const uploadsDir = path.join(__dirname, "..", "public", "uploads");

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
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
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
router.post(
  "/create",
  upload.array("listingImages"),
  async (req: Request, res: Response): Promise<void> => {
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
        bed,
        amenities,
        title,
        description,
        Highlights,
        Highlightdescription,
        price,
      } = req.body;

      // Validate required fields
      if (!Creator || !type || !category || !title || !price) {
        res.status(400).json({ message: "Missing required fields" });
        return;
      }

      // Validate price
      if (isNaN(Number(price))) {
        res.status(400).json({ message: "Price must be a valid number" });
        return;
      }

      // Validate uploaded files
      const listingImages = req.files as Express.Multer.File[];
      if (!listingImages || listingImages.length === 0) {
        res.status(400).json({ message: "No listing images uploaded" });
        return;
      }

      // Map image file paths
      const listingimagepath = listingImages.map(
        (file) => `/public/uploads/${path.basename(file.path)}`
      );

      // Fetch user details to retrieve firstname
      const user = await User.findById(Creator);
      if (!user) {
        res.status(404).json({ message: "Creator user not found" });
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
        bed,
        amenities: amenities ? amenities.split(",") : [],
        listingImages: listingimagepath,
        title,
        description,
        Highlights,
        Highlightdescription,
        price,
      });

      // Save listing to database
      await newListing.save();

      res
        .status(201)
        .json({ message: "Listing created successfully", listing: newListing });
    } catch (err) {
      console.error("Error creating listing:", err);
      res.status(500).json({
        message: "Internal server error",
        error: (err as Error).message,
      });
    }
  }
);

// Get Listings Endpoint
router.get("/", async (req: Request, res: Response): Promise<void> => {
  const qCategory = req.query.category;
  try {
    let listings;
    if (qCategory) {
      listings = await Listing.find({ category: qCategory }).populate(
        "Creator",
        "_id firstname lastname profileImagePath"
      );
    } else {
      listings = await Listing.find().populate(
        "Creator",
        "_id firstname lastname profileImagePath"
      );
    }

    const transformedListings = listings.map((listing) => {
      const listingObj = listing.toJSON();
      const creator = listing.Creator as any;

      // Handle case where Creator is just an ID (old data)
      if (typeof creator === "string") {
        return {
          ...listingObj,
          creator: {
            _id: creator,
            firstname: "Unknown",
            lastname: "",
            profileImagePath: "/uploads/default-profile.png",
          },
        };
      }

      // Handle populated Creator object (new data)
      return {
        ...listingObj,
        creator: {
          _id: creator._id,
          firstname: creator.firstname || "Unknown",
          lastname: creator.lastname || "",
          profileImagePath:
            creator.profileImagePath || "/uploads/default-profile.png",
        },
      };
    });

    res.status(200).json({ listings: transformedListings });
  } catch (err) {
    console.error("Error fetching listings:", err);
    res.status(500).json({
      message: "Failed to fetch listings",
      error: (err as Error).message,
    });
  }
});

// Search endpoint
router.get("/search", (async (req: Request, res: Response) => {
  try {
    const query = req.query.q as string;
    if (!query) {
      res.status(400).json({ message: "Search query is required" });
      return;
    }

    const listings = await Listing.find({
      $or: [
        { category: { $regex: query, $options: "i" } },
        { type: { $regex: query, $options: "i" } },
        { city: { $regex: query, $options: "i" } },
        { country: { $regex: query, $options: "i" } },
        { title: { $regex: query, $options: "i" } },
      ],
    }).populate("Creator", "_id firstname lastname profileImagePath");

    res.json({
      listings: listings.map((listing) => {
        const creator = listing.Creator as any;
        return {
          _id: listing._id,
          title: listing.title || "",
          category: listing.category || "",
          type: listing.type || "",
          city: listing.city || "",
          country: listing.country || "",
          price: listing.price || 0,
          listingImages: listing.listingImages || [],
          Creator: {
            _id: creator._id,
            firstname: creator.firstname || "Unknown",
            lastname: creator.lastname || "",
            profileImagePath: creator.profileImagePath || "default-profile.png",
          },
        };
      }),
    });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ message: "Failed to search listings" });
  }
}) as RequestHandler);

// Then the listingId route
router.get("/:listingId", async (req: Request, res: Response) => {
  try {
    const { listingId } = req.params;

    // Find the listing and populate the Creator field
    const listing = await Listing.findById(listingId).populate("Creator");

    if (!listing) {
      res.status(404).json({ message: "Listing not found" });
      return;
    }

    // Parse the Creator field to handle old data structure
    const creator = listing.Creator as any;

    // Handle both old and new data structures
    const parsedCreator =
      typeof creator === "string"
        ? {
            _id: creator,
            profileImagePath: "/uploads/default-profile.png",
            firstname: "Unknown",
            lastname: "",
          }
        : {
            _id: creator._id,
            profileImagePath:
              creator.profileImagePath || "/uploads/default-profile.png",
            firstname: creator.firstname || "Unknown",
            lastname: creator.lastname || "",
          };

    // Return the data with parsedCreator
    res.status(200).json({
      listing: {
        ...listing.toJSON(),
        parsedCreator,
      },
    });
  } catch (err) {
    console.error("Error fetching listing:", err);
    res.status(500).json({
      message: "Failed to fetch listing",
      error: (err as Error).message,
    });
  }
});

export default router;
