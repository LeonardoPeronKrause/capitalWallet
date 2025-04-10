import { pool } from '../database/connection'; // Allows to send queries from database

// GET /transactions
const transactionsList = async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM transactions ORDER BY date DESC');
        res.status(200).json(result.rows);
    } catch (err) {
        console.error('Error when searching transactions', err);
        res.status(500).json({ error: 'Error when searching transactions'});
    }
}

// POST / transactions
const createTransaction = async(req, res) => {
    
}

exports = {
    transactionsList,
    createTransaction,
};