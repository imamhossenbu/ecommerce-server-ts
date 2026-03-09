import mongoose from 'mongoose';
import app from './app';
import dotenv from 'dotenv';
import connectDB from './app/config/db';

dotenv.config();

const port = process.env.PORT || 5001;

async function main() {
  try {
    await connectDB();
    app.listen(port, () => {
      console.log(`🚀 Server is running on port ${port}`);
    });
  } catch (err) {
    console.error('❌ Failed to connect to DB:', err);
  }
}

main();