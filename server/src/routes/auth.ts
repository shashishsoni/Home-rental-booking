import express, { NextFunction } from 'express'
import { Request, Response } from "express";
import { Router } from "express";
import bcrypt from "bcryptjs";
import multer from "multer";
import jwt from "jsonwebtoken";
import { User }from "../models/user"
import { Sign } from 'crypto';


const router = express.Router()

// Configuration for multer file upload
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "src/public/uploads/"); // Store in the 'uploads' folder
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname); // Use the original file name
  },
});

const upload = multer({ storage });

// User signup route
router.post(
  "/signup",
  upload.single("profileImage"),
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { firstname, lastname, Email, password, confirmpassword } = req.body;

      // Validate required fields
      if (!firstname || !lastname || !Email || !password || !confirmpassword) {
        res.status(400).json({ message: "Please fill all the required fields" });
        return; // Stop further execution
      }

      // Validate passwords match
      if (password !== confirmpassword) {
        res.status(400).json({ message: "Passwords do not match." });
        return; // Stop further execution
      }

      // Access the uploaded file
      const profileImage = req.file;
      if (!profileImage) {
        res.status(400).json({ message: "No file uploaded" });
        return; // Stop further execution
      }

      const profileImagePath = profileImage.path;

      // Check if user already exists
      const existingUser = await User.findOne({ Email });
      if (existingUser) {
        res.status(409).json({ message: "User already exists" });
        return; // Stop further execution
      }

      // Hash the password
      const salt = await bcrypt.genSalt();
      const hashedPassword = await bcrypt.hash(password, salt);

      // Create a new user
      const newUser = new User({
        firstname,
        lastname,
        Email,
        password: hashedPassword,
        profileImagePath,
      });

      // Save the new user
      await newUser.save();

      // Respond with success
      res.status(201).json({ message: "User signed up successfully", user: newUser });
    } catch (err: any) {
      console.error("Sign Up Error", err);
      next(err); // Pass the error to the error-handling middleware
    }
  }
);


export default router
