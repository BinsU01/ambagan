// Demo data for the presentation + README screenshots.
// Run from the server folder:  npm run seed
//
// Creates 3 DEMO accounts (not your real ones) and a "Boracay Trip" group with
// 4 expenses. Safe to run again: it rebuilds the demo group each time.
//
// Login after seeding:  demo.vince@ambagan.test / demo1234

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
];

// amount is in CENTAVOS (₱2,400.00 = 240000). Everyone splits equally.
const DEMO_EXPENSES = [
  { description: 'Samgyup dinner', amount: 240000, payer: 'Vince', daysAgo: 4 },
  { description: 'Van rental', amount: 450000, payer: 'Paolo', daysAgo: 3 },
  { description: 'Island hopping', amount: 360000, payer: 'Bea', daysAgo: 2 },
  { description: 'Jollibee', amount: 54000, payer: 'Vince', daysAgo: 1 },
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

  // Rebuild the demo group from scratch so re-running never duplicates it
  const old = await Group.find({ name: 'Boracay Trip', createdBy: users.Vince._id });
  for (const g of old) {
    await Expense.deleteMany({ groupId: g._id });
    await g.deleteOne();
  }

  const memberIds = Object.values(users).map((u) => u._id);
  const group = await Group.create({
    name: 'Boracay Trip',
    members: memberIds,
    createdBy: users.Vince._id,
  });

  for (const e of DEMO_EXPENSES) {
    await Expense.create({
      groupId: group._id,
      description: e.description,
      amount: e.amount,
      paidBy: users[e.payer]._id,
      splitAmong: memberIds,
      date: new Date(Date.now() - e.daysAgo * 24 * 60 * 60 * 1000),
    });
  }

  console.log('\nDemo data ready ✅');
  console.log('Group:   Boracay Trip (3 members, 4 expenses)');
  console.log(`Login:   ${DEMO_USERS[0].email}  /  ${PASSWORD}`);
  console.log('Expect:  Vince owes ₱740.00, Paolo gets back ₱820.00, Bea owes ₱80.00\n');

  await mongoose.disconnect();
}

seed().catch((err) => {
  console.error('Seed failed:', err.message);
  process.exit(1);
});
