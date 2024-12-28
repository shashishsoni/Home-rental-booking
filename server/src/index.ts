import express, { Request, Response, NextFunction, ErrorRequestHandler } from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/auth';
import listingRoutes from './routes/listingapi';
import errorHandler from './middleware/errorHandler';
import compression from 'compression';
import helmet from 'helmet';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import path from 'path';
import bookingRoutes from './routes/Bookingapi';
import userRouters from './routes/userapi';

dotenv.config();

const app = express();

// CORS Options
const corsOptions = {
  origin: ['http://localhost:5173','https://home-rental-booking-3d5e-qg50emgqm-shashishsonis-projects.vercel.app'], // Allow the front-end URL for development (change for production)
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true, // Enable cookies and credentials
  maxAge: 86400,      // Cache preflight response for 24 hours
};

// Middleware
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(compression());
app.use(helmet.contentSecurityPolicy({
  directives: {
    defaultSrc: ["'self'"],
    scriptSrc: ["'self'", "'unsafe-inline'", "'unsafe-eval'", "https://home-rental-booking-1.onrender.com"],
    imgSrc: ["'self'", "data:", "https://home-rental-booking-1.onrender.com"],
    // Add other directives as needed
  },
}));

// Serve Static Files with CORP headers
const __dirname = dirname(fileURLToPath(import.meta.url));
app.use('/uploads', express.static(path.join(__dirname, 'public', 'uploads'), {
  setHeaders: (res) => {
    res.setHeader('Cross-Origin-Resource-Policy', 'cross-origin');  // Allow cross-origin resource sharing
    res.setHeader('Cross-Origin-Embedder-Policy', 'require-corp');  // Ensure proper embedder policy
    res.setHeader('Access-Control-Allow-Origin', ['http://localhost:5173', 'https://home-rental-booking-3d5e-qg50emgqm-shashishsonis-projects.vercel.app']);  // Allow the front-end URL
    res.setHeader('Access-Control-Allow-Methods', 'GET, HEAD, OPTIONS');  // Allow only GET and OPTIONS methods
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');  // Allow necessary headers
    res.setHeader('Access-Control-Allow-Credentials', 'true');
  }
}));

console.log('Static files served from:', path.join(__dirname, 'public', 'uploads'));

// MongoDB Connection
mongoose.connect(process.env.MONGO_DB || 'mongodb://localhost:27017/home-rental')
  .then(async () => {
    try {
      await mongoose.connection.collection('users').dropIndex("email_1");
      console.log("Successfully dropped the email index");
    } catch (err) {
      console.log("No email index to drop, moving on...");
    }
    console.log('Connected to MongoDB');
  })
  .catch((error) => {
    console.error('MongoDB connection error:', error);
  });

// Enable CORS for all routes
app.options('*', cors(corsOptions));

// Routes
app.use('/auth', authRoutes);
app.use('/listing', listingRoutes);
app.use('/bookings', bookingRoutes);
app.use('/user', userRouters);

// CORS Error Handler
interface CustomError extends Error {
  name: string;
}

const corsErrorHandler: ErrorRequestHandler = (err: CustomError, req: Request, res: Response, next: NextFunction): void => {
  if (err.name === 'CORSError') {
    res.status(403).json({
      error: 'CORS error',
      message: 'Cross-origin request blocked',
    });
    return;
  }
  next(err); // Pass error to next handler if it's not CORS-related
};

// Apply CORS error handler middleware
app.use(corsErrorHandler);

// General Error Handler
app.use(errorHandler);

// Server setup
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});