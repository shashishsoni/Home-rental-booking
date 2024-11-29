import express from 'express'
import { Request, Response } from "express";
import { Router } from "express";
import bcrypt from "bcryptjs";
import multer from "multer";
import jwt from "jsonwebtoken";
import User from "../models/user"


const router = express.Router()

// Configuration for multer file upload
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "public/uploads/"); // Store in the 'uploads' folder
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname); // Use the original file name
  },
});

const upload = multer({ storage });

// User signup route
router.post("/signup", upload.single("profileImage"), async (req: Request, res: Response): Promise<void> => {
  try {
    const { firstname, lastname, email, password } = req.body;

    // Access the uploaded file via req.file
    const profileImage = req.file;

    if (!profileImage) {
      res.status(400).send("No file uploaded");
      return;
    }

    const profileImagePath = profileImage.path;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      res.status(409).json({ message: "User already exists" });
      return;
    }

    // Hash the password
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create a new user
    const newUser = new User({
      firstname,
      lastname,
      email,
      password: hashedPassword,
      profileImagePath,
    });

    // Save the new user
    await newUser.save();

    // Respond with success
    res.status(200).json({ message: "User signed up successfully", user: newUser });
  } catch (err: any) {
    res.status(500).json({ message: "Sign up failed!", error: err.message });
  }
});

export default router
