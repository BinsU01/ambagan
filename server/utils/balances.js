// All amounts are integers in CENTAVOS. No floating-point math anywhere.

/**
 * Split an amount equally. Leftover centavos go to the first people in the list,
 * so the shares always add up to exactly `amount`.
 * splitEqually(1000, ['a','b','c']) -> [{a,334},{b,333},{c,333}]
 */
function splitEqually(amount, userIds) {
  const n = userIds.length;
  if (n === 0) return [];
  const base = Math.floor(amount / n);
  const remainder = amount - base * n;
  return userIds.map((id, i) => ({
    userId: String(id),
    share: base + (i < remainder ? 1 : 0),
  }));
}

/**
 * Net balance per member: (what they paid) - (what they owe).
 * Positive = gets money back. Negative = owes money. All nets sum to 0.
 */
function computeBalances(expenses, memberIds) {
  const net = new Map(memberIds.map((id) => [String(id), 0]));

  for (const e of expenses) {
    const payer = String(e.paidBy?._id || e.paidBy);
    net.set(payer, (net.get(payer) || 0) + e.amount);

    const splitIds = e.splitAmong.map((u) => String(u?._id || u));
    for (const { userId, share } of splitEqually(e.amount, splitIds)) {
      net.set(userId, (net.get(userId) || 0) - share);
    }
  }

  return [...net.entries()].map(([userId, value]) => ({ userId, net: value }));
}

/**
 * "Who pays whom": greedy matching of the biggest debtor with the biggest creditor.
 * Good enough (near-optimal) for small groups.
 * Returns [{ from, to, amount }].
 */
function settleUp(balances) {
  const creditors = balances.filter((b) => b.net > 0).map((b) => ({ ...b })).sort((a, b) => b.net - a.net);
  const debtors = balances.filter((b) => b.net < 0).map((b) => ({ ...b })).sort((a, b) => a.net - b.net);

  const transfers = [];
  let i = 0;
  let j = 0;

  while (i < debtors.length && j < creditors.length) {
    const amount = Math.min(-debtors[i].net, creditors[j].net);
    transfers.push({ from: debtors[i].userId, to: creditors[j].userId, amount });

    debtors[i].net += amount;
    creditors[j].net -= amount;

    if (debtors[i].net === 0) i++;
    if (creditors[j].net === 0) j++;
  }

  return transfers;
}

module.exports = { splitEqually, computeBalances, settleUp };
