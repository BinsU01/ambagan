const express = require('express');
const { protect } = require('../middleware/auth');
const { requireGroupMember } = require('../middleware/groupMember');
const { getExpenses, createExpense, deleteExpense } = require('../controllers/expenseController');

// mergeParams lets us read :groupId from the parent path
const router = express.Router({ mergeParams: true });

router.use(protect, requireGroupMember);

router.get('/', getExpenses);
router.post('/', createExpense);
router.delete('/:expenseId', deleteExpense);

module.exports = router;
