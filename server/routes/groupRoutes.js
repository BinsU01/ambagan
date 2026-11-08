const express = require('express');
const { protect } = require('../middleware/auth');
const { requireGroupMember } = require('../middleware/groupMember');
const { getMyGroups, createGroup, getGroup, addMember } = require('../controllers/groupController');
const { getBalances } = require('../controllers/balanceController');

const router = express.Router();

router.use(protect); // every group route needs a logged-in user

router.get('/', getMyGroups);
router.post('/', createGroup);
router.get('/:id', requireGroupMember, getGroup);
router.post('/:id/members', requireGroupMember, addMember);
router.get('/:id/balances', requireGroupMember, getBalances);

module.exports = router;
