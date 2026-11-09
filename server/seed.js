// Demo data for the presentation + README screenshots.
// Run from the server folder:  node seed.js
//
// Creates 5 DEMO accounts (not your real ones) and 4 groups with realistic
// expenses. Safe to run again: it rebuilds every group created by the demo
// Vince account, so leftover test groups disappear too.
//
// Login after seeding:  demo.vince@ambagan.test / demo1234
// Boracay Trip numbers are unchanged: Vince owes 740, Paolo gets back 820, Bea owes 80.

require('dotenv').config();
const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');
const connectDB = require('./config/db');
const User = require('./models/User');
const Group = require('./models/Group');
const Expense = require('./models/Expense');

const PASSWORD = 'demo1234';

const DEMO_USERS = [
  { name: 'Vince', email: 'demo.vince@ambagan.test' },
  { name: 'Paolo', email: 'demo.paolo@ambagan.test' },
  { name: 'Bea', email: 'demo.bea@ambagan.test' },
  { name: 'Mika', email: 'demo.mika@ambagan.test' },
  { name: 'Jun', email: 'demo.jun@ambagan.test' },
];

// amount is in CENTAVOS (₱2,400.00 = 240000).
// `split` is optional: names of who shares it. Leave it out to split among the whole group.
// Groups are created in this order, and the app lists newest first,
// so Boracay Trip (last) shows at the top.
const DEMO_GROUPS = [
  {
    name: 'Tito Ramon Birthday Dinner',
    members: ['Vince', 'Paolo', 'Mika'],
    expenses: [
      { description: 'Lechon belly', amount: 185000, payer: 'Paolo', daysAgo: 19 },
      { description: 'Cake from Red Ribbon', amount: 89000, payer: 'Mika', daysAgo: 19 },
      { description: 'Softdrinks and ice', amount: 24500, payer: 'Vince', daysAgo: 19 },
    ],
  },
  {
    name: 'Dorm Groceries',
    members: ['Vince', 'Mika', 'Jun'],
    expenses: [
      { description: 'Rice 25kg', amount: 142000, payer: 'Jun', daysAgo: 14 },
      { description: 'Canned goods and noodles', amount: 98000, payer: 'Mika', daysAgo: 12 },
      { description: 'Cooking oil and eggs', amount: 61500, payer: 'Vince', daysAgo: 9 },
      { description: 'Water refill (5 gallons)', amount: 22500, payer: 'Jun', daysAgo: 6 },
      { description: 'Dishwashing soap and sponges', amount: 18000, payer: 'Mika', daysAgo: 3 },
    ],
  },
  {
    name: 'Baguio Roadtrip',
    members: ['Vince', 'Paolo', 'Bea', 'Jun'],
    expenses: [
      { description: 'Gas to Baguio', amount: 320000, payer: 'Paolo', daysAgo: 10 },
      { description: 'Toll fees (NLEX and SCTEX)', amount: 78000, payer: 'Jun', daysAgo: 10 },
      { description: 'Hotel (2 nights)', amount: 640000, payer: 'Bea', daysAgo: 9 },
      { description: 'Strawberry taho and snacks', amount: 36000, payer: 'Vince', daysAgo: 9 },
      { description: 'Dinner at Camp John Hay', amount: 285000, payer: 'Vince', daysAgo: 8 },
      { description: 'Pasalubong (peanut brittle)', amount: 54000, payer: 'Bea', daysAgo: 8, split: ['Bea', 'Jun'] },
    ],
  },
  {
    name: 'Boracay Trip',
    members: ['Vince', 'Paolo', 'Bea'],
    expenses: [
      { description: 'Samgyup dinner', amount: 240000, payer: 'Vince', daysAgo: 4 },
      { description: 'Van rental', amount: 450000, payer: 'Paolo', daysAgo: 3 },
      { description: 'Island hopping', amount: 360000, payer: 'Bea', daysAgo: 2 },
      { description: 'Jollibee', amount: 54000, payer: 'Vince', daysAgo: 1 },
    ],
  },
];

async function seed() {
  await connectDB();

  const passwordHash = await bcrypt.hash(PASSWORD, 10);

  // Create the demo users (or reuse them if they already exist)
  const users = {};
  for (const u of DEMO_USERS) {
    let doc = await User.findOne({ email: u.email });
    if (!doc) doc = await User.create({ ...u, passwordHash });
    users[u.name] = doc;
  }

  // Wipe every group the demo Vince created (demo groups + any leftover test groups)
  const old = await Group.find({ createdBy: users.Vince._id });
  for (const g of old) {
    await Expense.deleteMany({ groupId: g._id });
    await g.deleteOne();
  }

  let expenseCount = 0;
  for (const g of DEMO_GROUPS) {
    const memberIds = g.members.map((n) => users[n]._id);
    const group = await Group.create({
      name: g.name,
      members: memberIds,
      createdBy: users.Vince._id,
    });

    for (const e of g.expenses) {
      const splitIds = (e.split || g.members).map((n) => users[n]._id);
      await Expense.create({
        groupId: group._id,
        description: e.description,
        amount: e.amount,
        paidBy: users[e.payer]._id,
        splitAmong: splitIds,
        date: new Date(Date.now() - e.daysAgo * 24 * 60 * 60 * 1000),
      });
      expenseCount += 1;
    }
  }

  console.log('\nDemo data ready ✅');
  console.log(`Groups:  ${DEMO_GROUPS.length} (${DEMO_GROUPS.map((g) => g.name).join(', ')})`);
  console.log(`Expenses: ${expenseCount} in total`);
  console.log(`Login:   ${DEMO_USERS[0].email}  /  ${PASSWORD}`);
  console.log('Boracay Trip: Vince owes ₱740.00, Paolo gets back ₱820.00, Bea owes ₱80.00\n');

  await mongoose.disconnect();
}

seed().catch((err) => {
  console.error('Seed failed:', err.message);
  process.exit(1);
});
