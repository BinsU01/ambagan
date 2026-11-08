// Run: npm run test:balances
const assert = require('assert');
const { splitEqually, computeBalances, settleUp } = require('./balances');

// 1. Shares always add up exactly, even with leftover centavos
const shares = splitEqually(1000, ['a', 'b', 'c']);
assert.deepStrictEqual(shares.map((s) => s.share), [334, 333, 333]);
assert.strictEqual(shares.reduce((sum, s) => sum + s.share, 0), 1000);

// 2. The Boracay Trip sample from the mockups
const V = 'vince', P = 'paolo', B = 'bea';
const all = [V, P, B];
const expenses = [
  { description: 'Samgyup night', amount: 240000, paidBy: V, splitAmong: all },
  { description: 'Van rental', amount: 450000, paidBy: P, splitAmong: all },
  { description: 'Island hopping', amount: 360000, paidBy: B, splitAmong: all },
  { description: 'Jollibee run', amount: 54000, paidBy: V, splitAmong: all },
];

const balances = computeBalances(expenses, all);
const byId = Object.fromEntries(balances.map((b) => [b.userId, b.net]));
assert.strictEqual(byId[V], -74000); // owes ₱740
assert.strictEqual(byId[P], 82000); // gets back ₱820
assert.strictEqual(byId[B], -8000); // owes ₱80
assert.strictEqual(balances.reduce((s, b) => s + b.net, 0), 0);

const transfers = settleUp(balances);
assert.deepStrictEqual(transfers, [
  { from: V, to: P, amount: 74000 },
  { from: B, to: P, amount: 8000 },
]);

// 3. Expense split among only some members
const partial = computeBalances([{ amount: 1000, paidBy: V, splitAmong: [P, B] }], all);
const p = Object.fromEntries(partial.map((b) => [b.userId, b.net]));
assert.deepStrictEqual(p, { vince: 1000, paolo: -500, bea: -500 });

// 4. No expenses = everyone at zero, no transfers
assert.deepStrictEqual(settleUp(computeBalances([], all)), []);

console.log('All balance tests passed ✅');
