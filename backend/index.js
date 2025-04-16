// Entry point of the app

import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

import transactionRoutes from './src/routes/transactionRoutes.js';
import registerUser from './src/controllers/usersController.js';

dotenv.config();

const app = express();
app.use(cors());    // Allows comunication with the frontend
app.use(express.json()); // Allow reading a JSON in the request body

app.use('/transactions', transactionRoutes); // All of the routes goes to the 'transactionRoutes'
app.use('/register', registerUser);

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
