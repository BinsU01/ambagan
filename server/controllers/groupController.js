// OWNER: Member 1
// Tip: use req.user.id for the logged-in user. req.group is already loaded
// (and membership checked) on routes that use requireGroupMember.

const asyncHandler = require('../utils/asyncHandler');
// const Group = require('../models/Group');
// const User = require('../models/User');

// GET /api/groups  -> groups where members contains req.user.id, newest first
const getMyGroups = asyncHandler(async (req, res) => {
  // TODO: Group.find({ members: req.user.id }).populate('members', 'name email').sort({ createdAt: -1 })
  res.status(501).json({ message: 'TODO (Member 1): getMyGroups' });
});

// POST /api/groups  body: { name, memberEmails: [] }
const createGroup = asyncHandler(async (req, res) => {
  // TODO: look up users by memberEmails, always include req.user.id,
  // create group with createdBy = req.user.id, respond 201
  res.status(501).json({ message: 'TODO (Member 1): createGroup' });
});

// GET /api/groups/:id
const getGroup = asyncHandler(async (req, res) => {
  // TODO: res.json(await req.group.populate('members', 'name email'))
  res.status(501).json({ message: 'TODO (Member 1): getGroup' });
});

// POST /api/groups/:id/members  body: { email }
const addMember = asyncHandler(async (req, res) => {
  // TODO: find user by email (404 if none), 409 if already a member, push + save
  res.status(501).json({ message: 'TODO (Member 1): addMember' });
});

module.exports = { getMyGroups, createGroup, getGroup, addMember };
