import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import userRouter from './routes/user.js';
import authRouter from './routes/auth.js';
import listingRouter from './routes/listing.js';
import cookieParser from 'cookie-parser';
import path from 'path';
dotenv.config();
const MONGO_URL = "mongodb+srv://abinet:anamo26@cluster0.kgqvgrz.mongodb.net/?retryWrites=true&w=majority"

mongoose
  .connect(MONGO_URL)
  .then(() => {
    console.log('Connected to MongoDB!');
  })
  .catch((err) => {
    console.log(err);
  });

  const __dirname = path.resolve();

const app = express();

app.use(express.json());

app.use(cookieParser());

app.listen(3000, () => {
  console.log('Server is running on port 3000!');
});

app.use('/api/user', userRouter);
app.use('/api/auth', authRouter);
app.use('/api/listing', listingRouter);


app.use(express.static(path.join(__dirname, '/client/dist')));

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'client', 'dist', 'index.html'));
})

app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';
  return res.status(statusCode).json({
    success: false,
    statusCode,
    message,
  });
});
