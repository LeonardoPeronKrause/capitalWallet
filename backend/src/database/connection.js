import pkg from 'pg'; 
import dotenv from 'dotenv';

dotenv.config(); // Active the .env variables

const { Pool } = pkg;

// Create a connection pool with PostgreSQL
export const pool = new Pool({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE
});