import { Listing } from './src/models/listing.js';
import { User } from './src/models/user.js';
import mongoose from 'mongoose';

const MONGODB_URI = "mongodb+srv://HomeRental:root@shashish.oucqq.mongodb.net/HomeRental?retryWrites=true&w=majority&appName=shashish";

async function migrateListings() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');

    const listings = await Listing.find({});
    console.log(`Found ${listings.length} listings to process`);
    
    for (const listing of listings) {
      if (typeof listing.Creator === 'string') {
        const user = await User.findById(listing.Creator);
        
        if (user) {
          await Listing.findByIdAndUpdate(listing._id, {
            Creator: user._id
          });
          console.log(`Updated listing ${listing._id} with creator info`);
        }
      }
    }
    
    console.log('Migration completed successfully');
  } catch (error) {
    console.error('Migration failed:', error);
  } finally {
    await mongoose.connection.close();
    console.log('Database connection closed');
  }
}

migrateListings().then(() => {
  console.log('Migration script finished');
}).catch(err => {
  console.error('Migration script failed:', err);
});