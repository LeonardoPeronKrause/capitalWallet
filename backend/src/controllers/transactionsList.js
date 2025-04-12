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
        VALUES ($1, $2, $3, $4)     -- ($1, $2...) its to avoid SQL INJECTION
        RETURNING *;  -- make the database return the created data
        `;

        // Allows that the placeholders changed by real values
        const values = [type, description, value, date]; 

        // Execute the query SQL using pool
        const result = await pool.query(query, values);
        
        // Return that transaction was created with status 201
        res.status(201).json(result.rows); 

    } catch (err) {
        // If anything was wrong, shows the error on console        
        console.error('Erro when create transaction: ', err);

        // return the error with status 500
        res.status(500).json({ error: 'Error when searching transactions'});
    }
}

const deleteTransaction = async (req, res) => {
    const { id } = req.params; // Get the id from URL

    try {
        const query = 'DELETE FROM transactions WHERE id = $1 RETURNING *;';
        
        // Using the pool to conect with database to makes the query run
        const result = await pool.query(query, [id]); // [id] replace $1 with the actual ID value from the URL

        // ID did not exist
        if (result.rowCount === 0) { 
            return res.status(404).json({ error: 'Transaction not found!' });
        }

        // Successfull message
        res.status(200).json({ mesage: 'Transaction deleted successfully!' });

    } catch (err) { // If any error occurs (ex: database down, invalid id), the catch block captures the error. 
        console.error('Error when deleting transaction:', err);
        res.status(500).json({ error: 'Error when deleting transaction' });
    }
};

const editTransaction = async (req, res) => {

}

export {
    transactionsList,
    createTransaction,
    deleteTransaction,
    editTransaction
};