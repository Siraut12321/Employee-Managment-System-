import mongoose from 'mongoose';

let isConnected = false;

const connectDB = async (): Promise<void> => {
  if (isConnected) return;
  const uri = process.env.MONGODB_URI as string;
  await mongoose.connect(uri);
  isConnected = true;
  console.log('MongoDB connected');
};

export default connectDB;
