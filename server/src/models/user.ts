import mongoose, { Document, Schema } from 'mongoose';
import { IUser } from '../types/typess';

interface IUserDocument extends IUser, Document { }

const userSchema = new Schema<IUserDocument>({
  firstname: {
    type: String,
    required: true
  },
  lastname: {
    type: String,
    required: true
  },
  Email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
    validate: {
      validator: (value: string) => {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
      },
      message: 'Invalid email format'
    }
  },
  password: {
    type: String,
    required: true
  },
  profileImagePath: {
    type: String,
    required: false
  },
  tripList: {
    type: Schema.Types.Mixed,
    default: [],
  },
  WishList: {
    type: [mongoose.Schema.Types.ObjectId],
    ref: 'Listing',
    default: []
  },
  PropertyList: {
    type:  Schema.Types.Mixed,
    default: [],
  },
  ReservationList: {
    type:  Schema.Types.Mixed,
    default: [],
  },

}, {
  // Add this to ensure Mongoose uses the schema fields exactly as defined
  strict: true
});

userSchema.index({ Email: 1 }, { unique: true });

export const User = mongoose.model<IUserDocument>('User', userSchema);

// Explicitly create the index
User.createIndexes().then(() => {
  console.log('Indexes created successfully');
}).catch((err) => {
  console.error('Error creating indexes:', err);
});