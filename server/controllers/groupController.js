// OWNER: Vince (Groups)
const Group = require('../models/Group');
const User = require('../models/User');
const Expense = require('../models/Expense');
const asyncHandler = require('../utils/asyncHandler');

const MEMBER_FIELDS = 'name email';

// Accepts ["a@x.com", "b@x.com"] or "a@x.com, b@x.com" and returns clean, unique, lowercase emails.
function normalizeEmails(input) {
  const list = Array.isArray(input) ? input : String(input || '').split(/[,\s]+/);
  return [...new Set(list.map((e) => String(e).trim().toLowerCase()).filter(Boolean))];
}

// GET /api/groups  -> groups the logged-in user belongs to, newest first,
// with expenseCount and totalSpent (centavos) for the cards.
const getMyGroups = asyncHandler(async (req, res) => {
  const groups = await Group.find({ members: req.user.id })
    .populate('members', MEMBER_FIELDS)
    .sort({ createdAt: -1 })
    .lean();

  const stats = await Expense.aggregate([
    { $match: { groupId: { $in: groups.map((g) => g._id) } } },
    { $group: { _id: '$groupId', expenseCount: { $sum: 1 }, totalSpent: { $sum: '$amount' } } },
  ]);
  const statsById = new Map(stats.map((s) => [String(s._id), s]));

  res.json({
    groups: groups.map((g) => ({
      ...g,
      expenseCount: statsById.get(String(g._id))?.expenseCount || 0,
      totalSpent: statsById.get(String(g._id))?.totalSpent || 0,
    })),
  });
});

// POST /api/groups  body: { name, memberEmails: ["a@x.com"] or "a@x.com, b@x.com" }
// The creator is always added as a member.
const createGroup = asyncHandler(async (req, res) => {
  const name = String(req.body.name || '').trim();
  if (!name) {
    return res.status(400).json({ message: 'Group name is required' });
  }

  const emails = normalizeEmails(req.body.memberEmails);
  const users = emails.length ? await User.find({ email: { $in: emails } }).select('_id email') : [];

  const foundEmails = new Set(users.map((u) => u.email));
  const missing = emails.filter((e) => !foundEmails.has(e));
  if (missing.length) {
    return res.status(404).json({
      message: `No Ambagan account for: ${missing.join(', ')}. They need to register first.`,
    });
  }

  const memberIds = [...new Set([req.user.id, ...users.map((u) => String(u._id))])];

  const group = await Group.create({ name, members: memberIds, createdBy: req.user.id });
  await group.populate('members', MEMBER_FIELDS);

  res.status(201).json({ group: { ...group.toObject(), expenseCount: 0, totalSpent: 0 } });
});

// GET /api/groups/:id  (requireGroupMember already loaded req.group)
const getGroup = asyncHandler(async (req, res) => {
  await req.group.populate([
    { path: 'members', select: MEMBER_FIELDS },
    { path: 'createdBy', select: 'name' },
  ]);
  res.json({ group: req.group });
});

// POST /api/groups/:id/members  body: { email }
const addMember = asyncHandler(async (req, res) => {
  const [email] = normalizeEmails(req.body.email);
  if (!email) {
    return res.status(400).json({ message: 'Email is required' });
  }

  const user = await User.findOne({ email }).select('_id');
  if (!user) {
    return res.status(404).json({ message: `No Ambagan account for ${email}. They need to register first.` });
  }

  const alreadyMember = req.group.members.some((m) => String(m) === String(user._id));
  if (alreadyMember) {
    return res.status(409).json({ message: 'That person is already in this group' });
  }

  req.group.members.push(user._id);
  await req.group.save();
  await req.group.populate('members', MEMBER_FIELDS);

  res.json({ group: req.group });
});

module.exports = { getMyGroups, createGroup, getGroup, addMember };
