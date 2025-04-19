import { pool } from '../database/connection.js'; // Allows to send queries from database

// GET /transactions
const transactionsList = async (req, res) => {
    const userId = req.user.id; // Get user ID from authenticated request

    try {
        const result = await pool.query(
            'SELECT * FROM transactions WHERE user_id = $1 ORDER BY date DESC',
            [userId]
        );
        res.status(200).json(result.rows);
    } catch (err) {
        console.error('Error when searching transactions', err);
        res.status(500).json({ error: 'Error when searching transactions'});
    }
}

// POST / transactions
const createTransaction = async (req, res) => {
    const userId = req.user.id;
    const { type, description, value, date } = req.body; // Desestructure the requisition body 

    try {
        if (!type || !value) {
            return res.status(400).json({ error: 'Type and Value are mandatory!' });
        }

        const query = `
        INSERT INTO transactions (type, description, value, date, user_id)
        VALUES ($1, $2, $3, $4, $5)     -- ($1, $2...) its to avoid SQL INJECTION
        RETURNING *;  -- make the database return the created data
        `;

        // Allows that the placeholders changed by real values
        const values = [type, description, value, date, userId]; 

        // Execute the query SQL using pool
        const result = await pool.query(query, values);
        
        // Return that transaction was created with status 201
        res.status(201).json(result.rows); 

    } catch (err) {
        // If anything was wrong, shows the error on console        
        console.error('Erro when create transaction: ', err);

        // return the error with status 500
        res.status(500).json({ error: 'Error when creating transactions'});
    }
}

// DELETE / transactions:id
const deleteTransaction = async (req, res) => {
    const { id } = req.params; // Get the id from URL
    const userId = req.user.id;

    try {
        const query = `
            DELETE FROM transactions
            WHERE id = $1 AND user_id = $2
            RETURNING *;
        `;
        
        // Using the pool to conect with database to makes the query run
        const result = await pool.query(query, [id, userId]); // [id] replace $1 with the actual ID value from the URL

        // ID did not exist
        if (result.rowCount === 0) { 
            return res.status(404).json({ error: 'Transaction not found!' });
        }

        // Successfull message
        res.status(200).json({ message: 'Transaction deleted successfully!' });

    } catch (err) { // If any error occurs (ex: database down, invalid id), the catch block captures the error. 
        console.error('Error when deleting transaction:', err);
        res.status(500).json({ error: 'Error when deleting transaction' });
    }
};

// PUT / transactions:id
const updateTransaction = async (req, res) => {
    const { id } = req.params; // Get the id from URL
    const { type, description, value, date } = req.body; // Get the new data of the requisition body
    const userId = req.user.id;

    try {
        // Check if the values are valid!
        if (!type || !value || !date) {
            return res.status(400).json({ error: 'Type, Value and Date should be valid values!' });
        }

        // Criate the SQL query with placeholders to avoid SQL injection
        const query = `
            UPDATE transactions
            SET type = $1, description = $2, value = $3, date = $4
            WHERE id = $5 AND user_id = $6
            RETURNING *;
        `;
        // Defines the values that will replace the placeholders
        const values = [ type, description, value, date, id, userId ];

        // Execute the query
        const result = await pool.query(query, values);

        // ID did not exist
        if (result.rowCount === 0) {
            return res.status(404).json({ error: 'Transaction not found!' });
        }
        
        // Return the successfull on the transaction
        res.status(200).json({ message: 'Transaction update!', transaction: result.rows[0] });
    } catch (err) {
        console.error('Error when updating transaction:', err);
        res.status(500).json({ error: 'Error when updating transaction.' });
    }
};

export {
    transactionsList,
    createTransaction,
    deleteTransaction,
    updateTransaction
};