import bcrypt from 'bcrypt';
import { pool } from '../database/connection.js';

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

export default registerUser;