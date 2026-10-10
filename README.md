# 💎 Ledgerly — Boutique MERN Stack Expense Management System

> A human-crafted, high-performance financial management application featuring **sleek glassmorphic aesthetics**, **Web Audio API interactive acoustic feedback**, **strict Indian Rupee (₹) formatting**, and a **clean monorepo architecture** optimized for seamless GitHub deployment.

---

## 📑 Table of Contents

- [Overview](#-overview)
- [Key Features](#-key-features)
- [Design & UX Architecture (Glassmorphism)](#-design--ux-architecture-glassmorphism)
- [Interactive Audio Cues (Web Audio API)](#-interactive-audio-cues-web-audio-api)
- [Technology Stack](#-technology-stack)
- [Monorepo Project Structure](#-monorepo-project-structure)
- [Git Optimization & GitHub Push Readiness](#-git-optimization--github-push-readiness)
- [Environment Configuration](#-environment-configuration)
- [Installation & Quick Start](#-installation--quick-start)
- [REST API Endpoints Reference](#-rest-api-endpoints-reference)
- [Seed Data & Demo Records](#-seed-data--demo-records)
- [License](#-license)

---

## 🌟 Overview

**Ledgerly** is built to break away from generic AI templates. It delivers a boutique, modern fintech dashboard inspired by high-end wealth management tools. Every monetary figure is strictly formatted in Indian Rupees (**₹**) with standard Indian grouping separators (e.g., `₹ 12,500`, `₹ 1,25,000`).

The application features:
1. **Interactive Glassmorphic UI**: Semi-transparent frosted glass cards with `backdrop-blur-md`, delicate white/slate borders, and ambient background radial glow orbs.
2. **Synthesized Audio Micro-Interactions**: Zero external asset dependencies; lightweight browser-native Web Audio API sounds for actions like adding, updating, or deleting records.
3. **Full-Stack Integration Layer**: Express.js REST API with Mongoose and MongoDB, plus graceful client/server fallbacks when developing offline.

---

## ✨ Key Features

- **Summary Analytics Cards**:
  - **Total Spent (₹)**: Lifetime volume and transaction counts.
  - **Current Month Spend**: Outflow comparisons against previous cycles with percentage delta badges.
  - **Category Breakdown**: Proportional horizontal bar distribution and active sector counts.
  - **Ticket Average & Peak Outflow**: Mean transaction size and largest single expense.
- **Interactive Data Table & Mobile Cards**:
  - Full CRUD operations with instant UI reactivity.
  - Live search across vendor descriptions, notes, and payment methods.
  - Multi-category filtering and custom date range filters (This Month, Last 30 Days, Last Month, Custom Date Range).
  - Sorting by date, outflow amount (₹), and category.
  - Multi-row selection for bulk deletions.
  - CSV export for reporting and analysis.
- **Indian Rupee (₹) Strict Formatting**:
  - Standard Indian comma conventions: `₹ 24,500`, `₹ 1,25,000`.
  - Quick amount increment chips in modal (`+₹500`, `+₹1,000`, `+₹5,000`).
- **Snappy Micro-Animations**:
  - Modal scale-in, slide-down alerts, smooth drawer transitions, hover glows.

---

## 🎨 Design & UX Architecture (Glassmorphism)

- **Frosted Glass Cards (`.glass-card`)**:
  - Light mode: `bg-white/75 backdrop-blur-xl border border-white/80 shadow-[0_10px_30px_-10px_rgba(0,0,0,0.05)]`
  - Dark mode: `bg-slate-900/65 backdrop-blur-xl border border-white/10 shadow-[0_15px_35px_-10px_rgba(0,0,0,0.5)]`
- **Ambient Radiant Glow Orbs**: Soft radial mesh gradients (`emerald-500`, `indigo-500`, `cyan-500`) placed with `blur-3xl` behind frosted surfaces to produce natural visual depth.
- **Theme Support**: Flawless light and dark mode switching, persisted to `localStorage`.

---

## 🔊 Interactive Audio Cues (Web Audio API)

All sounds are generated purely via the browser's native **Web Audio API** (`AudioContext`), ensuring zero latency and zero external MP3/WAV download requirements:

| Action | Sound Characteristics | Musical Profile |
| :--- | :--- | :--- |
| **Add Expense** | Warm ascending chime chord | Pentatonic/triad arpeggio (C5 → E5 → G5 → C6) with soft exponential decay |
| **Update Expense** | Snappy modern double blip | F#5 to C#6 crisp electronic feedback |
| **Delete Expense** | Gentle downward pitch whoosh | Lowpass filtered downward sweep (260 Hz → 75 Hz) |
| **Micro Click / Tab** | Soft tactile click | High-frequency 8 ms micro-pop |
| **Audio Toggle** | Master Mute / Unmute | Controlled via speaker icon in the top navigation bar |

---

## 🛠 Technology Stack

- **Frontend**:
  - React 19 (Vite)
  - Tailwind CSS with custom glassmorphism utilities
  - Lucide React Icons
  - Axios HTTP Client
- **Backend**:
  - Node.js & Express.js
  - MongoDB & Mongoose
  - CORS, Dotenv, Morgan Logger
- **Tooling**:
  - Concurrently (single-command full-stack development)
  - Nodemon (backend live reload)

---

## 📁 Monorepo Project Structure

```text
├── backend/                        # Node.js Express & MongoDB REST API
│   ├── config/
│   │   └── db.js                   # Mongoose connection & fallback status
│   ├── controllers/
│   │   └── expenseController.js    # Aggregations, CRUD, filtering logic
│   ├── data/
│   │   └── seedData.js             # Boutique INR seed dataset
│   ├── middleware/
│   │   ├── errorHandler.js         # Centralized error & 404 handler
│   │   └── validate.js             # Request body validation
│   ├── models/
│   │   └── Expense.js              # Mongoose schema with indexes
│   ├── routes/
│   │   └── expenseRoutes.js        # REST endpoints
│   ├── scripts/
│   │   └── seed.js                 # CLI seeder script (`npm run seed`)
│   ├── .env.example                # Backend environment template
│   ├── .gitignore                  # Backend exclusion rules
│   ├── package.json
│   └── server.js                   # Express application entrypoint
│
├── frontend/                       # Vite + React + Tailwind Client
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   │   ├── common/             # Badges, EmptyState, Toast, Skeletons
│   │   │   ├── dashboard/          # SummaryCards (₹ stats, breakdown)
│   │   │   ├── expenses/           # Table, Filters, Add/Edit & Delete Modals
│   │   │   └── layout/             # Glass Navbar & Mobile Drawer
│   │   ├── constants/              # Categories & Payment Methods
│   │   ├── context/                # ExpenseContext & Global State
│   │   ├── services/               # Axios API client & Offline Sync
│   │   ├── utils/                  # Indian Rupee formatters & Web Audio API
│   │   ├── App.jsx                 # Dashboard shell with ambient glows
│   │   ├── index.css               # Glassmorphism utilities & theme tokens
│   │   └── main.jsx
│   ├── .env.example                # Frontend environment template
│   ├── .gitignore                  # Frontend exclusion rules
│   ├── package.json
│   ├── tailwind.config.js
│   └── vite.config.js
│
├── .gitignore                      # Comprehensive root gitignore
├── package.json                    # Monorepo orchestration scripts
└── README.md                       # Complete documentation
```

---

## 🛡 Git Optimization & GitHub Push Readiness

The repository includes comprehensive `.gitignore` files at the **root**, **`/backend`**, and **`/frontend`** directories.

### Excluded by Default:
- `node_modules/` (All root and nested directories)
- `.env` & `.env.*` (All private credentials and secrets)
- `dist/`, `build/` (All client build outputs)
- Logs, OS files (`.DS_Store`, `Thumbs.db`), and IDE metadata

### Ready to Push to GitHub in 3 Simple Commands:

```bash
# 1. Initialize git
git init

# 2. Stage all clean source files
git add .

# 3. Create initial commit
git commit -m "feat: complete MERN stack expense tracker with glassmorphism and audio cues"

# 4. Link your GitHub repository and push
git remote add origin https://github.com/<your-username>/<your-repo-name>.git
git branch -M main
git push -u origin main
```

---

## ⚙ Environment Configuration

### Backend (`/backend/.env`)
Create a `.env` file in `/backend` (or copy from `.env.example`):
```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://127.0.0.1:27017/expense_tracker
CLIENT_URL=http://localhost:5173
```

### Frontend (`/frontend/.env`)
Create a `.env` file in `/frontend` (or copy from `.env.example`):
```env
VITE_API_BASE_URL=http://localhost:5000/api
```

---

## 🚀 Installation & Quick Start

### 1. Install All Dependencies
From the repository root, install dependencies for the root, backend, and frontend with a single command:
```bash
npm run install:all
```

### 2. Seed the MongoDB Database
Ensure your MongoDB server is running (e.g. `mongod` or MongoDB Atlas), then run:
```bash
npm run seed
```

### 3. Launch Both Backend & Frontend Concurrently
```bash
npm run dev
```

- **Frontend Client**: [http://localhost:5173](http://localhost:5173)
- **Backend API**: [http://localhost:5000](http://localhost:5000)
- **Health Check**: [http://localhost:5000/api/health](http://localhost:5000/api/health)

### Running Separately (Optional):
```bash
# Start backend server only
npm run server

# Start frontend client only
npm run client
```

---

## 📡 REST API Endpoints Reference

Base URL: `http://localhost:5000/api`

| Method | Endpoint | Description | Query / Body Parameters |
| :--- | :--- | :--- | :--- |
| `GET` | `/health` | Check service health & DB status | None |
| `GET` | `/expenses` | Retrieve filtered expenses | `search`, `category`, `startDate`, `endDate`, `sortBy`, `page`, `limit` |
| `GET` | `/expenses/stats` | Aggregate financial statistics (INR) | None |
| `GET` | `/expenses/:id` | Retrieve single expense by ID | Path parameter `id` |
| `POST` | `/expenses` | Create new expense record | `{ description, amount, category, date, paymentMethod, notes }` |
| `PUT` | `/expenses/:id` | Update existing expense record | Path parameter `id` + JSON updates |
| `DELETE` | `/expenses/:id` | Delete expense record | Path parameter `id` |
| `POST` | `/expenses/bulk-delete` | Bulk delete multiple records | `{ ids: ["id1", "id2"] }` |
| `POST` | `/expenses/seed` | Reset & seed default boutique data | None |

---

## 💳 Seed Data & Demo Records

Default seeded records include realistic Indian Rupee expenditures:
- `Apartment Monthly Rent & Maintenance` — **₹ 24,500**
- `Nifty 50 Index Fund Monthly SIP` — **₹ 15,000**
- `Organic Groceries & Supplies` — **₹ 4,250**
- `Team Dinner at Bastian` — **₹ 3,840**
- `Weekend Petrol / Fuel Refill` — **₹ 3,200**
- `Annual Health Checkup & Panel` — **₹ 2,950**
- `Broadband Fiber 300 Mbps` — **₹ 1,179**

---

## 📄 License

MIT License. Designed and built with premium human-crafted fintech design standards.
