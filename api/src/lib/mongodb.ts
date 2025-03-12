import mongoose from 'mongoose';

const { MONGODB_URI } = process.env;

if (!MONGODB_URI) {
  throw new Error('MONGODB_URI is not defined');
}

export const connectToDatabase = async () => {
  await mongoose.connect(MONGODB_URI);
  console.log('Connected to MongoDB');
};
