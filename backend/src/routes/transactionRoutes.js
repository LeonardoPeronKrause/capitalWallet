import express from 'express';
import { 
    transactionsList,
    createTransaction,
    deleteTransaction,
    editTransaction
} from '../controllers/transactionsList.js';

const router = express.Router() // express.Router() -> Works as a little-app for organize the routes separately

// GET - transactions
router.get('/', transactionsList); // When someone access GET /transactions, should calls the transactionsList function

// POST - transaction
router.post('/', createTransaction); // When someone access POST /transaction, should calls the createTransaction function

// DELETE - transactions/:id
router.delete('/:id', deleteTransaction); // When someone access DELETE /transactions/:id, should calls the deleteTransaction function

// PUT - transactions/:id
router.put('/:id', editTransaction);  // When someone access PUT /transactions/:id, should calls the editTransaction function

export default router; // Export the router to be use in the index.js