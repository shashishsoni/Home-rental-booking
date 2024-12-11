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

// Custom error interface
interface CustomError extends Error {
  status?: number;
}

dotenv.config();

const app = express();

// CORS Options
const corsOptions = {
  origin: process.env.NODE_ENV === 'production' 
    ? process.env.FRONTEND_URL 
    : 'http://localhost:5173',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
  maxAge: 86400
};

// Middleware
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(compression());
app.use(helmet());
app.use((req, res, next) => {
  res.setHeader('Cross-Origin-Resource-Policy', 'same-origin');
  next();
});
app.use(helmet({
  contentSecurityPolicy: false,  // Temporarily disable CSP for debugging
  crossOriginEmbedderPolicy: false  // Disable CORP-related headers temporarily
}));
app.use('/public/uploads', (req, res, next) => {
  res.setHeader('Cross-Origin-Resource-Policy', 'cross-origin');
  res.setHeader('Cross-Origin-Embedder-Policy', 'require-corp'); 
  res.setHeader('Access-Control-Allow-Origin', '*');
  next();
});

// Get the __dirname equivalent for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Static file serving
app.use('/public/uploads', express.static(path.join(__dirname, '/public/uploads')));
console.log('Static files served from:', path.join(__dirname, 'uploads'));


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
// CORS Error Handler
const corsErrorHandler: ErrorRequestHandler = (err: CustomError, req: Request, res: Response, next: NextFunction): void => {
  if (err.name === 'CORSError') {
      res.status(403).json({
      error: 'CORS error',
      message: 'Cross-origin request blocked'
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
