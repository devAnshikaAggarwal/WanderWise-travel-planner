const Budget = require('../models/Budget');
const Expense = require('../models/Expense');
const Trip = require('../models/Trip');

const verifyTripOwnership = async (tripId, userId) => {
  const trip = await Trip.findOne({ _id: tripId, userId });
  return trip;
};

const createBudget = async (req, res) => {
  try {
    const trip = await verifyTripOwnership(req.params.tripId, req.user.id);
    if (!trip) {
      return res.status(404).json({ message: 'Trip not found' });
    }

    const { totalBudget, currency } = req.body;
    if (!totalBudget) {
      return res.status(400).json({ message: 'Total budget amount is required' });
    }

    const existing = await Budget.findOne({ tripId: req.params.tripId });
    if (existing) {
      return res.status(400).json({ message: 'Budget already exists for this trip. Use update instead.' });
    }

    const budget = await Budget.create({
      tripId: req.params.tripId,
      totalBudget,
      currency: currency || 'USD',
    });

    res.status(201).json(budget);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const getBudget = async (req, res) => {
  try {
    const trip = await verifyTripOwnership(req.params.tripId, req.user.id);
    if (!trip) {
      return res.status(404).json({ message: 'Trip not found' });
    }

    const budget = await Budget.findOne({ tripId: req.params.tripId });
    if (!budget) {
      return res.status(404).json({ message: 'No budget set for this trip yet' });
    }

    const expenses = await Expense.find({ budgetId: budget._id }).sort({ date: -1 });

    res.json({
      budget,
      expenses,
      remaining: budget.totalBudget - budget.spent,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const updateBudget = async (req, res) => {
  try {
    const trip = await verifyTripOwnership(req.params.tripId, req.user.id);
    if (!trip) {
      return res.status(404).json({ message: 'Trip not found' });
    }

    const budget = await Budget.findOne({ tripId: req.params.tripId });
    if (!budget) {
      return res.status(404).json({ message: 'No budget set for this trip yet' });
    }

    const { totalBudget, currency } = req.body;
    if (totalBudget !== undefined) budget.totalBudget = totalBudget;
    if (currency !== undefined) budget.currency = currency;

    const updated = await budget.save();
    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const addExpense = async (req, res) => {
  try {
    const trip = await verifyTripOwnership(req.params.tripId, req.user.id);
    if (!trip) {
      return res.status(404).json({ message: 'Trip not found' });
    }

    const budget = await Budget.findOne({ tripId: req.params.tripId });
    if (!budget) {
      return res.status(404).json({ message: 'Set a budget for this trip before adding expenses' });
    }

    const { category, amount, note, date } = req.body;
    if (!category || !amount) {
      return res.status(400).json({ message: 'Category and amount are required' });
    }

    const expense = await Expense.create({
      budgetId: budget._id,
      category,
      amount,
      note,
      date,
    });

    budget.spent += amount;
    await budget.save();

    res.status(201).json(expense);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const deleteExpense = async (req, res) => {
  try {
    const trip = await verifyTripOwnership(req.params.tripId, req.user.id);
    if (!trip) {
      return res.status(404).json({ message: 'Trip not found' });
    }

    const budget = await Budget.findOne({ tripId: req.params.tripId });
    if (!budget) {
      return res.status(404).json({ message: 'Budget not found' });
    }

    const expense = await Expense.findOneAndDelete({ _id: req.params.expenseId, budgetId: budget._id });
    if (!expense) {
      return res.status(404).json({ message: 'Expense not found' });
    }

    budget.spent = Math.max(0, budget.spent - expense.amount);
    await budget.save();

    res.json({ message: 'Expense deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { createBudget, getBudget, updateBudget, addExpense, deleteExpense };