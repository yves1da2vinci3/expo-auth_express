// index.js
import express from 'express';
import connectDB from './config/db.js';
import dotenv from 'dotenv'
import authRoutes from './routes/authRoutes.js'
import morgan from 'morgan'
dotenv.config()
const app = express();
const PORT = 3000;

// Connect to MongoDB
connectDB();

// Middleware
app.use(express.json());
app.use(morgan('dev'))

// Routes
app.use('/api/auth',authRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
