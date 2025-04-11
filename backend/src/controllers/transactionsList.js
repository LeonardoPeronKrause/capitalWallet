import { pool } from '../database/connection.js'; // Allows to send queries from database

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
const createTransaction = async (req, res) => {
    const { type, description, value, date } = req.body; // Desestructure the requisition body 

    try {
        if (!type || !value) {
            return res.status(400).json({ error: 'Type and Value are mandatory!' });
        }

        const query = `
        INSERT INTO transactions (type, description, value, date)
        VALUES ($1, $2, $3, $4, $5)     -- ($1, $2...) its to avoid SQL INJECTION
        RETURNING *;  -- make the database return the created data
        `;

        // Allows that the placeholders changed by real values
        const values = [type, description, value, date]; 

        // Execute the query SQL using pool
        const result = await pool.query(query, values);
        
        // Return that transaction was created with status 201
        res.send(201).json(result.rows); 

    } catch (err) {
        // If anything was wrong, shows the error on console        
        console.error('Erro when create transaction: ', err);

        // return the error with status 500
        res.status(500).json({ error: 'Error when searching transactions'});
    }
}

const deleteTransaction = async (req, res) => {

}

const editTransaction = async (req, res) => {

}

export {
    transactionsList,
    createTransaction,
    deleteTransaction,
    editTransaction
};