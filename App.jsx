import React from 'react';
import { ExpenseProvider } from './context/ExpenseContext';
import { Navbar } from './components/layout/Navbar';
import { MobileDrawer } from './components/layout/MobileDrawer';
import { SummaryCards } from './components/dashboard/SummaryCards';
import { ExpenseFilters } from './components/expenses/ExpenseFilters';
import { ExpenseTable } from './components/expenses/ExpenseTable';
import { ExpenseModal } from './components/expenses/ExpenseModal';
import { DeleteConfirmModal } from './components/expenses/DeleteConfirmModal';
import { ToastContainer } from './components/common/ToastContainer';
import { Plus, Sparkles, Terminal, ShieldCheck, IndianRupee, Layers } from 'lucide-react';
import { useExpenses } from './context/ExpenseContext';

const DashboardContent = () => {
  const { openAddModal, resetToSeeds, backendStatus, dbType, actionLoading } = useExpenses();

  return (
    <div className="relative min-h-screen flex flex-col bg-slate-50 dark:bg-[#07090e] text-slate-900 dark:text-slate-100 transition-colors selection:bg-emerald-500 selection:text-white">
      {/* Radiant Ambient Background Glows for Glassmorphism Depth */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0" aria-hidden="true">
        <div className="absolute -top-40 -left-40 w-96 h-96 bg-gradient-to-br from-emerald-500/20 to-teal-500/10 dark:from-emerald-500/15 dark:to-teal-500/5 rounded-full blur-3xl opacity-80" />
        <div className="absolute top-20 -right-40 w-[30rem] h-[30rem] bg-gradient-to-bl from-indigo-500/15 via-violet-500/10 to-teal-500/5 dark:from-indigo-600/12 dark:via-violet-600/8 rounded-full blur-3xl opacity-75" />
        <div className="absolute -bottom-40 left-1/3 w-[32rem] h-[32rem] bg-gradient-to-tr from-cyan-500/15 to-emerald-500/10 dark:from-cyan-500/10 dark:to-emerald-500/5 rounded-full blur-3xl opacity-60" />
      </div>

      <div className="relative z-10 flex flex-col min-h-screen">
        <Navbar />
        <MobileDrawer />

        <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-7">
          {/* Dashboard Title & Quick Actions */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-1">
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
                  Financial Outflow & Ledger
                </h1>
              </div>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
                Real-time expenditure tracking, category analytics, and monetary metrics formatted strictly in Indian Rupees (₹).
              </p>
            </div>

            <div className="flex items-center gap-2.5">
              <button
                onClick={resetToSeeds}
                disabled={actionLoading}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-slate-700 dark:text-slate-300 rounded-xl glass-card hover:bg-slate-100 dark:hover:bg-white/10 active:scale-[0.98] transition-all disabled:opacity-50"
                title="Reset records to default boutique demo data"
              >
                <Sparkles className="w-3.5 h-3.5 text-emerald-500" />
                <span>Reset Demo Data</span>
              </button>
              <button
                onClick={openAddModal}
                className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-white bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 rounded-xl active:scale-[0.98] transition-all shadow-[0_4px_16px_rgba(16,185,129,0.3)]"
              >
                <Plus className="w-4 h-4 stroke-[2.5]" />
                <span>Add Expense (₹)</span>
              </button>
            </div>
          </div>

          {/* Backend Connectivity Status Banner (Informative & non-intrusive) */}
          {backendStatus === 'disconnected' && (
            <div className="glass-card bg-amber-500/10 dark:bg-amber-500/10 border-amber-500/30 rounded-2xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs animate-fade-in">
              <div className="flex items-center gap-3">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500 shrink-0 animate-ping" />
                <p className="text-amber-900 dark:text-amber-200">
                  <strong className="font-bold">Offline / Cache Mode:</strong> Express backend is not detected on{' '}
                  <code className="px-1.5 py-0.5 rounded-md bg-amber-200/50 dark:bg-amber-900/50 font-mono text-[11px] font-semibold">
                    http://localhost:5000/api
                  </code>
                  . Data is securely cached in local storage. Start backend with <code className="font-mono font-bold">npm run server</code>.
                </p>
              </div>
              <div className="flex items-center gap-2 text-[11px] font-medium text-amber-800 dark:text-amber-300">
                <Terminal className="w-3.5 h-3.5" />
                <span>Seamless Fallback Active</span>
              </div>
            </div>
          )}

          {/* 1. Summary Cards */}
          <section aria-label="Financial Summary Cards">
            <SummaryCards />
          </section>

          {/* 2. Interactive Filters */}
          <section aria-label="Transaction Filters">
            <ExpenseFilters />
          </section>

          {/* 3. Interactive Data Table / Mobile Cards */}
          <section aria-label="Expense Transactions Table">
            <ExpenseTable />
          </section>
        </main>

        {/* Boutique Footer */}
        <footer className="border-t border-slate-200/80 dark:border-white/5 py-7 mt-14 glass-nav text-xs text-slate-500 dark:text-slate-400 transition-colors">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <span className="font-bold text-slate-800 dark:text-slate-200">Ledgerly MERN</span>
              <span>•</span>
              <span>Boutique Glassmorphic Fintech Dashboard</span>
              <span>•</span>
              <span className="font-mono text-emerald-600 dark:text-emerald-400">₹ INR Strict</span>
            </div>
            <div className="flex items-center gap-4 text-[11px]">
              <span>Web Audio API Sound Cues</span>
              <span>•</span>
              <span>Mongoose & Express REST</span>
              <span>•</span>
              <span>Tailwind CSS</span>
            </div>
          </div>
        </footer>

        {/* Global Modals & Notifications */}
        <ExpenseModal />
        <DeleteConfirmModal />
        <ToastContainer />
      </div>
    </div>
  );
};

export const App = () => {
  return (
    <ExpenseProvider>
      <DashboardContent />
    </ExpenseProvider>
  );
};

export default App;
