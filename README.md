# ambagan 🪙

> Ambag lang, walang utang na limot.

Ambagan is a MERN expense splitter for barkadas. Create a group, log shared expenses, and see who owes whom.

**Stack:** MongoDB Atlas · Express · React (Vite) · Node.js · JWT auth · bcrypt

---

## Features

- Register / log in (passwords hashed with bcrypt, JWT sessions)
- My Groups: list your groups and create new ones
- Group page: members, expense history (newest first), balances panel
- Add Expense: description, amount, who paid, who it's split among
- Balances: net per member + simplified "who pays whom" transfers
- Money stored in **centavos** (integers) to avoid floating-point errors

<!-- TODO before demo: add screenshots here -->

---

## Setup

### 1. Clone and install

```bash
git clone <repo-url>
cd ambagan
cd server && npm install
cd ../client && npm install
```

### 2. Environment variables

```bash
cd server
cp .env.example .env
```

Fill in `server/.env`:

| Variable | What it is |
| --- | --- |
| `MONGO_URI` | MongoDB Atlas connection string (ask the team lead, don't post it in the group chat) |
| `JWT_SECRET` | Any long random string |
| `PORT` | `5000` |
| `CLIENT_URL` | `http://localhost:5173` |

### 3. Run (two terminals)

```bash
# terminal 1
cd server && npm run dev     # API on http://localhost:5000

# terminal 2
cd client && npm run dev     # app on http://localhost:5173
```

Check the API is up: http://localhost:5000/api/health

### 4. Test the balance math

```bash
cd server && npm run test:balances
```

---

## API

All routes except register/login need `Authorization: Bearer <token>`.

| Method | Route | Description | Status |
| --- | --- | --- | --- |
| POST | `/api/auth/register` | Create account | ✅ done |
| POST | `/api/auth/login` | Log in | ✅ done |
| GET | `/api/auth/me` | Current user | ✅ done |
| GET | `/api/groups` | My groups | Member 1 |
| POST | `/api/groups` | Create group | Member 1 |
| GET | `/api/groups/:id` | Group details | Member 1 |
| POST | `/api/groups/:id/members` | Add member by email | Member 1 |
| GET | `/api/groups/:groupId/expenses` | Expense history | Member 2 |
| POST | `/api/groups/:groupId/expenses` | Add expense | Member 2 |
| DELETE | `/api/groups/:groupId/expenses/:expenseId` | Delete expense | Member 2 |
| GET | `/api/groups/:id/balances` | Balances + transfers | Member 3 |

Group and expense routes already check that you're logged in **and** a member of the group (`middleware/groupMember.js`).

---

## Project structure

```
server/
  config/db.js            MongoDB connection
  models/                 User, Group, Expense (Mongoose schemas + validation)
  middleware/             auth (JWT), groupMember, errorHandler
  controllers/            logic per feature
  routes/                 URL -> controller
  utils/balances.js       split / net balance / settle-up math (tested)
client/src/
  api/client.js           axios instance (adds token automatically)
  context/AuthContext.jsx login, register, logout, current user
  components/             Navbar, ProtectedRoute, Spinner
  pages/                  Login, Register, MyGroups, GroupPage, AddExpense
  utils/money.js          formatPeso(), toCentavos()
  styles/index.css        design tokens (colors, fonts) + shared styles
```

---

## Team workflow

| Member | Owns |
| --- | --- |
| Member 1 | `groupController.js`, `MyGroups.jsx` |
| Member 2 | `expenseController.js`, `AddExpense.jsx`, `components/ExpenseList.jsx` |
| Member 3 | `balanceController.js`, `components/BalancesPanel.jsx`, responsive + loading states |

Rules:

1. **Work on your own branch:** `git checkout -b feature/groups` (or `feature/expenses`, `feature/balances`)
2. **Commit small and often**, with clear messages: `feat: create group endpoint`, `fix: balance rounding`
3. `git pull origin main` before you start, and merge into `main` when your feature works
4. **Never commit `.env`**
