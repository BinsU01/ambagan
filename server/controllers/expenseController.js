// OWNER: Member 2
// Mounted at /api/groups/:groupId/expenses, so req.params.groupId is available
// and req.group is already loaded with membership checked.

const asyncHandler = require('../utils/asyncHandler');
// const Expense = require('../models/Expense');

// GET /api/groups/:groupId/expenses  -> newest first
const getExpenses = asyncHandler(async (req, res) => {
  // TODO: Expense.find({ groupId: req.group._id })
  //         .populate('paidBy', 'name').populate('splitAmong', 'name')
  //         .sort({ date: -1, createdAt: -1 })
  res.status(501).json({ message: 'TODO (Member 2): getExpenses' });
});

// POST /api/groups/:groupId/expenses
// body: { description, amount (in centavos, integer), paidBy, splitAmong: [userIds], date? }
const createExpense = asyncHandler(async (req, res) => {
  // TODO: check paidBy and every splitAmong id are members of req.group (400 if not),
  // then Expense.create({...}) and respond 201
  res.status(501).json({ message: 'TODO (Member 2): createExpense' });
});

// DELETE /api/groups/:groupId/expenses/:expenseId
const deleteExpense = asyncHandler(async (req, res) => {
  // TODO: findOneAndDelete({ _id: expenseId, groupId: req.group._id }), 404 if null, 204 on success
  res.status(501).json({ message: 'TODO (Member 2): deleteExpense' });
});

module.exports = { getExpenses, createExpense, deleteExpense };
