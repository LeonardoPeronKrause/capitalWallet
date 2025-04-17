import jwt from 'jsonwebtoken'; // To generate a JWT token
import bcrypt from 'bcrypt';
import { pool } from '../database/connection.js';

// Register User
const registerUser = async (req, res) => {
    // Receive the data of frontend
    const { name, email, password } = req.body; 

    try {
        if (!name || !email || !password) {
            return res.status(400).json({ error: 'Name, email and password are required.' });
        }

        // Check if email already registered
        const existingUser = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
        if (existingUser.rows.length > 0) {
            return res.status(409).json({ error: 'Email already registered.' })
        }

        // Here we use the bcrypt lib to transform the password into a secure hash, before saving it to the database. The number 10 is the complexity level (the higher, the more secure and slower).
        const hashedPassword = await bcrypt.hash(password, 10);

        // Insert the user into the database
        const result = await pool.query(
            'INSERT INTO users (name, email, password) VALUES ($1, $2, $3) RETURNING id, name, email',
            [name, email, hashedPassword]
        );

        return res.status(201).json({
            message: 'User registered successfully!',
            user: result.rows[0]
        });
    } catch (error) {
        console.error('Error registered user:', error);
        res.status(500).json({ error: 'Internal server error.' });
    }
};

// User login
const loginUser = async (req, res) => {

    // Gets the email and password of the body requisition
    const { email, password } = req.body;

    try {
        // Check if both was send
        if (!email || !password) {
            return res.status(400).json({ message: 'Email and password are required.'});
        }

        // Search user on database by email
        const userResult = await pool.query('SELECT * FROM users WHERE email = $1', [email]);

        // If dont have user with that email
        if (userResult.rows.length === 0) {
            return res.status(401).json({ error: 'Invalid email or password.'});
        }

        // Get the first (and only) user returned  
        const user = userResult.rows[0];

        // Compares the submitted password with the hash saved in the database 
        const validPassword = await bcrypt.compare(password, user.password);

        // If the password is incorrect
        if (!validPassword) {
            return res.status(401).json({ error: 'Invalid email or password.'});
        }

        // If you have reached this point, your email and password was correct
        // Generates the JWT token with the user data (minus the password!)
        const token = jwt.sign(
            { id: user.id, name: user.name, email: user.email },
            process.env.JWT_SECRET, // Secret key thats in the .env file
            { expiresIn: '2h' } // token expiration time (2 hours)
        );

        // Return the token from frontend
        return res.status(200).json({ message: 'Login seccessful!', token });
    } catch (error) {
        console.error('Login error:', error);
        return res.status(500).json({ error: 'Internal server error.' });
    }
};

export { registerUser, loginUser };