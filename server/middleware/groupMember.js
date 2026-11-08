const mongoose = require('mongoose');
const Group = require('../models/Group');
const asyncHandler = require('../utils/asyncHandler');

// Use AFTER protect. Loads the group from :groupId (or :id) and makes sure
// the logged-in user is a member. Sets req.group for the controller.
const requireGroupMember = asyncHandler(async (req, res, next) => {
  const groupId = req.params.groupId || req.params.id;

  if (!mongoose.isValidObjectId(groupId)) {
    return res.status(400).json({ message: 'Invalid group id' });
  }

  const group = await Group.findById(groupId);
  if (!group) {
    return res.status(404).json({ message: 'Group not found' });
  }

  const isMember = group.members.some((m) => m.toString() === req.user.id);
  if (!isMember) {
    return res.status(403).json({ message: 'You are not a member of this group' });
  }

  req.group = group;
  next();
});

module.exports = { requireGroupMember };
