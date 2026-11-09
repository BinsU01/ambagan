
const mongoose = require('mongoose');
const asyncHandler = require('../utils/asyncHandler');
const Expense = require('../models/Expense');

// GET /api/groups/:groupId/expenses
// Get all expenses, newest first
const getExpenses = asyncHandler(async (req, res) => {
  const expenses = await Expense.find({
    groupId: req.group._id,
  })
    .populate('paidBy', 'name email')
    .populate('splitAmong', 'name email')
    .sort({ date: -1, createdAt: -1 });

  res.status(200).json({
    success: true,
    count: expenses.length,
    expenses,
  });
});

// POST /api/groups/:groupId/expenses
const createExpense = asyncHandler(async (req, res) => {
  const { description, amount, paidBy, splitAmong, date } = req.body;

  if (!description || !description.trim()) {
    return res.status(400).json({
      message: 'Description is required',
    });
  }

  if (description.trim().length > 100) {
    return res.status(400).json({
      message: 'Description must be 100 characters or less',
    });
  }

  if (
    amount === undefined ||
    !Number.isInteger(amount) ||
    amount < 1
  ) {
    return res.status(400).json({
      message: 'Amount must be a valid centavos integer',
    });
  }

  if (!mongoose.isValidObjectId(paidBy)) {
    return res.status(400).json({
      message: 'Please select a valid payer',
    });
  }

  if (!Array.isArray(splitAmong) || splitAmong.length === 0) {
    return res.status(400).json({
      message: 'Select at least one member to split the expense',
    });
  }

  const groupMemberIds = req.group.members.map(
    (member) => member.toString()
  );

  const payerId = paidBy.toString();

  if (!groupMemberIds.includes(payerId)) {
    return res.status(400).json({
      message: 'The selected payer is not a member of this group',
    });
  }

  const uniqueSplitMembers = [...new Set(splitAmong.map(String))];

  const invalidMembers = uniqueSplitMembers.some(
    (id) =>
      !mongoose.isValidObjectId(id) ||
      !groupMemberIds.includes(id)
  );

  if (invalidMembers) {
    return res.status(400).json({
      message: 'One or more selected members are invalid',
    });
  }

  const expense = await Expense.create({
    groupId: req.group._id,
    description: description.trim(),
    amount,
    paidBy,
    splitAmong: uniqueSplitMembers,
    ...(date && { date }),
  });

  const populatedExpense = await Expense.findById(expense._id)
    .populate('paidBy', 'name email')
    .populate('splitAmong', 'name email');

  res.status(201).json({
    success: true,
    message: 'Expense created successfully',
    expense: populatedExpense,
  });
});

// DELETE /api/groups/:groupId/expenses/:expenseId
const deleteExpense = asyncHandler(async (req, res) => {
  const { expenseId } = req.params;

  if (!mongoose.isValidObjectId(expenseId)) {
    return res.status(400).json({
      message: 'Invalid expense ID',
    });
  }

  const expense = await Expense.findOneAndDelete({
    _id: expenseId,
    groupId: req.group._id,
  });

  if (!expense) {
    return res.status(404).json({
      message: 'Expense not found',
    });
  }

  res.status(204).send();
});

module.exports = {
  getExpenses,
  createExpense,
  deleteExpense,
};
