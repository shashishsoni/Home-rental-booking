import express from 'express';
import bcrypt from "bcryptjs";
import multer from "multer";
import jwt from "jsonwebtoken";
import { User } from "../models/user";
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import fs from 'fs';
const router = express.Router();
// Get __dirname equivalent for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
// Upload directory setup
const uploadDir = path.join(__dirname, '../public/uploads');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
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
        }
        else {
            cb(new Error('Only .png, .jpg and .jpeg format allowed!'));
        }
    }
});
// User signup route
router.post("/signup", upload.single("profileImage"), async (req, res, next) => {
    try {
        const { firstname, lastname, Email, password, confirmPassword } = req.body;
        // Check for null or undefined Email explicitly
        if (!Email || Email.trim() === '') {
            res.status(400).json({
                message: "Email is required",
                missing: { Email: true }
            });
            return;
        }
        if (!firstname || !lastname || !password || !confirmPassword) {
            res.status(400).json({
                message: "Please fill all the required fields",
                missing: {
                    firstname: !firstname,
                    lastname: !lastname,
                    password: !password,
                    confirmPassword: !confirmPassword
                }
            });
            return;
        }
        // Validate Email format
        const EmailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!EmailRegex.test(Email)) {
            res.status(400).json({ message: "Invalid Email format" });
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
        // Check if user already exists - use trimmed, lowercase Email
        const normalizedEmail = Email.trim().toLowerCase();
        const existingUser = await User.findOne({ Email: normalizedEmail });
        if (existingUser) {
            // If file was uploaded, clean it up since we won't be using it
            if (req.file) {
                fs.unlink(req.file.path, (err) => {
                    if (err)
                        console.error('Error deleting uploaded file:', err);
                });
            }
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
            Email: normalizedEmail, // Use normalized Email
            password: hashedPassword,
            profileImagePath: req.file.filename
        });
        // Save the new user
        await newUser.save();
        res.status(201).json({ message: "User signed up successfully", user: newUser });
    }
    catch (err) {
        // Clean up uploaded file if there's an error
        if (req.file) {
            fs.unlink(req.file.path, (err) => {
                if (err)
                    console.error('Error deleting uploaded file:', err);
            });
        }
        console.error("Sign Up Error:", err);
        // Check if we haven't sent a response yet
        if (!res.headersSent) {
            if (err.code === 11000) {
                res.status(409).json({
                    message: "Email already exists",
                    error: "Duplicate Email address"
                });
            }
            else {
                res.status(500).json({
                    message: "Server error during signup",
                    error: err.message
                });
            }
        }
    }
});
router.post("/login", async (req, res) => {
    try {
        //take information from body page
        const { Email, password } = req.body;
        if (!Email || !password) {
            res.status(400).json({ message: "Email and password are required" });
            return;
        }
        const normalizedEmail = Email.toLowerCase().trim();
        //check the user exit or not 
        const user = await User.findOne({ Email: normalizedEmail });
        if (!user) {
            res.status(409).json({ message: "user does't exist" });
            return;
        }
        //than compare the password that is hased
        const ismatchpassword = await bcrypt.compare(password, user.password);
        if (!ismatchpassword) {
            res.status(400).json({ message: "Invalid Credentials" });
            return;
        }
        //generate jwt token after login
        const token = jwt.sign({ id: user._id }, process.env.JWT_SERCET, { expiresIn: "1h" });
        const { password: _, ...userWithoutpassword } = user.toObject();
        res.status(200).json({
            message: "login sucessfull",
            token,
            user: userWithoutpassword
        });
    }
    catch (err) {
        console.error("Error during login", err);
        res.status(500).json({ message: "internal server error" });
    }
});
export default router;
