import express from 'express';
import { 
    transactionsList,
    createTransaction,
    deleteTransaction,
    updateTransaction
} from '../controllers/transactionsList.js';
import authMiddleware from '../middleware/authMiddleware.js';

const router = express.Router() // express.Router() -> Works as a mini-app to organize routes separately

// GET - List all transactions (Protected)
router.get('/', authMiddleware, transactionsList); // GET /transactions, calls transactionsList only if authenticated

// POST - Create a transaction (Protected)
router.post('/', authMiddleware, createTransaction); // POST /transaction, calls createTransaction only if authenticated

// DELETE - Delete a transaction by ID (Protected)
router.delete('/:id', authMiddleware, deleteTransaction); // DELETE /transactions/:id, calls deleteTransaction only if authenticated

// PUT - Update transaction by ID (Protected)
router.put('/:id', authMiddleware, updateTransaction);  // PUT /transactions/:id, calls updateTransaction only if authenticated

export default router; // Export the router to be used in index.js