const asyncHandler = require('../utils/asyncHandler');
const Expense = require('../models/Expense');
const { computeBalances, settleUp } = require('../utils/balances');

const getBalances = asyncHandler(async (req, res) => {
  // Get all expenses belonging to this group
  const expenses = await Expense.find({
    groupId: req.group._id,
  });

  // Get member IDs
  const memberIds = req.group.members.map((member) =>
    String(member._id || member)
  );

  // Compute each member's net balance
  const calculatedBalances = computeBalances(expenses, memberIds);

  // Compute who pays whom
  const calculatedTransfers = settleUp(calculatedBalances);

  // Populate member names
  await req.group.populate('members', 'name email');

  // Create a lookup for member details
  const memberMap = new Map(
    req.group.members.map((member) => [
      String(member._id),
      {
        _id: member._id,
        name: member.name,
        email: member.email,
      },
    ])
  );

  // Attach member information to balances
  const balances = calculatedBalances.map((balance) => ({
    user: memberMap.get(balance.userId) || {
      _id: balance.userId,
      name: 'Unknown Member',
    },
    net: balance.net,
  }));

  // Attach member information to transfers
  const transfers = calculatedTransfers.map((transfer) => ({
    from: memberMap.get(transfer.from) || {
      _id: transfer.from,
      name: 'Unknown Member',
    },
    to: memberMap.get(transfer.to) || {
      _id: transfer.to,
      name: 'Unknown Member',
    },
    amount: transfer.amount,
  }));

  res.status(200).json({
    balances,
    transfers,
  });
});

module.exports = { getBalances };