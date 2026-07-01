const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const {
  createBudget,
  getBudget,
  updateBudget,
  addExpense,
  deleteExpense,
} = require('../controllers/budgetController');

router.post('/:tripId', protect, createBudget);
router.get('/:tripId', protect, getBudget);
router.put('/:tripId', protect, updateBudget);
router.post('/:tripId/expense', protect, addExpense);
router.delete('/:tripId/expense/:expenseId', protect, deleteExpense);

module.exports = router;