import dotenv from 'dotenv';
dotenv.config();

import mongoose from 'mongoose';
import app from './app';
import { config } from './config';

const start = async () => {
  try {
    const mongoUri = process.env.MONGO_URI || config.mongoUri;
    await mongoose.connect(mongoUri);
    console.log('Connected to MongoDB');

    const port = process.env.PORT || config.port;
    app.listen(port, () => console.log(`Server listening on ${port}`));
  } catch (err) {
    console.error('Failed to start server', err);
    process.exit(1);
  }
};

start();