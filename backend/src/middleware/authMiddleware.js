import jwt from 'jsonwebtoken';
import dotenv from 'dotenv'; // To load environment variables from .env (like JWT_SECRET)

dotenv.config(); // Load the environment variables

// Authentication Middleware
const authMiddleware = (req, res, next) => {
    // Get the request header called "authorization", where the token normally comes from, in the format: 'Authorization: Bearer <token>'
    const authHeader = req.headers.authorization;

    // Check if the header exists and starts with "Bearer"
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ error: 'Authorization token missing or invalid.' });
    }

    // If the header is correct, split the string by spaces and get only the token.
    // (e.g.: "Bearer abc.def.ghi" -> gets "abc.def.ghi")
    const token = authHeader.split(' ')[1];

    try {
        // Try to verify the token using JWT_SECRET (secret key)
        // If its valid, JWT returns a decoded user data
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
        // Put the decoded data inside the request (req.user)
        req.user = decoded; // This allows us to access req.user.id, req.user.email, etc. In the next steps (like in the controller).

        // All good? Call next() to continue to the next middleware or protected route.
        next();
    } catch (err) {
        return res.status(403).json({ error: 'Invalid token.' });
    }
};

export default authMiddleware;