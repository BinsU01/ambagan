// OWNER: Member 3
// The math is already done and tested in utils/balances.js.
// Your job: load the expenses, call the helpers, and send names along with the numbers.

const asyncHandler = require('../utils/asyncHandler');
// const Expense = require('../models/Expense');
// const { computeBalances, settleUp } = require('../utils/balances');

// GET /api/groups/:id/balances
// Response idea: { balances: [{ user: {_id, name}, net }], transfers: [{ from, to, amount }] }
const getBalances = asyncHandler(async (req, res) => {
  // TODO:
  // 1. const expenses = await Expense.find({ groupId: req.group._id });
  // 2. const memberIds = req.group.members.map(String);
  // 3. const balances = computeBalances(expenses, memberIds);
  // 4. const transfers = settleUp(balances);
  // 5. populate member names (await req.group.populate('members', 'name')) and respond
  res.status(501).json({ message: 'TODO (Member 3): getBalances' });
});

module.exports = { getBalances };
