import express, { NextFunction } from 'express'
import { Request, Response } from "express";
import { Router } from "express";
import bcrypt from "bcryptjs";
import multer from "multer";
import jwt from "jsonwebtoken";
import { User }from "../models/user"
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import fs from 'fs';

const router = express.Router()

// Get __dirname equivalent for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Upload directory setup
const uploadDir = path.join(__dirname, '../public/uploads');
if(!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, {recursive: true})
}

// Configuration for multer file upload
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir); // Store in the 'uploads' folder
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname); // Use the original file name
  },
});

const upload = multer({
  storage,
  limits: {
    fileSize: 15 * 1024 * 1024
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    if (extname && mimetype) {
      return cb(null, true);
    } else {
      cb(new Error('Only .png, .jpg and .jpeg format allowed!'));
    }
  }
});

interface MulterRequest extends Request {
  file?: Express.Multer.File;
}

// User signup route
router.post(
  "/signup",
  upload.single("profileImage"),
  async (req: MulterRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      // Debug: Log the entire request body and file
      console.log('Request Body:', req.body);
      console.log('Uploaded File:', req.file);
     
      const { firstname, lastname, email, password, confirmPassword } = req.body;
     
      if (!firstname || !lastname || !email || !password || !confirmPassword) {
        res.status(400).json({
          message: "Please fill all the required fields",
          missing: { firstname: !firstname, lastname: !lastname, email: !email,
                    password: !password, confirmPassword: !confirmPassword }
        });
        return;
      }

      // Validate passwords match
      if (password !== confirmPassword) {
        res.status(400).json({ message: "Passwords do not match." });
        return;
      }

      // Access the uploaded file
      if (!req.file) {
        res.status(400).json({ message: "Profile image is required" });
        return;
      }

      // Check if user already exists
      const existingUser = await User.findOne({ email: email.toLowerCase() });
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
        email: email.toLowerCase(),
        password: hashedPassword,
        profileImagePath: req.file.path.replace(/\\/g, '/')
      });

      // Save the new user
      await newUser.save();
      res.status(201).json({ message: "User signed up successfully", user: newUser });
    } catch (err: any) {
      console.error("Sign Up Error:", err);
      res.status(500).json({
        message: "Server error during signup",
        error: err.message
      });
    }
  }
);

export default router