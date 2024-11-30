import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  firstname: { 
    type: String, 
    required: true 
  },
  lastname: { 
    type: String, 
    required: true 
  },
  email: { 
    type: String, 
    required: true, 
    unique: true,
    trim: true,
    lowercase: true,
    validate: {
      validator: function(v: string) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
      },
      message: (props: any) => `${props.value} is not a valid email!`
    }
  },
  password: { 
    type: String, 
    required: true 
  },
  profileImagePath: { 
    type: String, 
    required: true 
  }
}, {
  // Add this to ensure Mongoose uses the schema fields exactly as defined
  strict: true
});

// Add this before creating the model to ensure indexes are created properly
userSchema.set('collection', 'users');

// Create the model
export const User = mongoose.model('User', userSchema);

// Explicitly create the index
User.createIndexes().then(() => {
  console.log('Indexes created successfully');
}).catch((err) => {
  console.error('Error creating indexes:', err);
});