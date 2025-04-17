import express from 'express';
import { registerUser, loginUser } from '../controllers/usersController.js';

const router = express.Router();

// POST - /users/register
router.post('/register', registerUser);

// POST - /users/login
router.post('/login', loginUser);

export default router;