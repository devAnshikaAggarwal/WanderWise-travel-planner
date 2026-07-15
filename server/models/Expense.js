const mongoose = require("mongoose");

const expenseSchema = new mongoose.Schema({
  budgetId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Budget",
    required: true,
  },
  category: { type: String, required: true },
  amount: { type: Number, required: true },
  note: { type: String },
  date: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Expense", expenseSchema);
