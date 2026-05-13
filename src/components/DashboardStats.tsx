import React from 'react';
import { motion } from 'motion/react';
import { Package, CheckCircle2, Clock, Wallet } from 'lucide-react';

interface StatsProps {
  stats: {
    total: number;
    completed: number;
    pending: number;
    studioPending: number;
    mediaPending: number;
    totalBalance: number;
  };
  currentFilter: string;
  onFilterChange: (filter: 'All' | 'Pending' | 'Complete' | 'StudioPending' | 'MediaPending') => void;
}

export const DashboardStats: React.FC<StatsProps> = ({ stats, currentFilter, onFilterChange }) => {
  const cards = [
    { label: 'Total', value: stats.total, icon: Package, color: 'text-blue-600', bg: 'bg-blue-50', filter: 'All' as const },
    { label: 'Done', value: stats.completed, icon: CheckCircle2, color: 'text-emerald-600', bg: 'bg-emerald-50', filter: 'Complete' as const },
    { label: 'Studio Pen', value: stats.studioPending, icon: Clock, color: 'text-purple-600', bg: 'bg-purple-50', filter: 'StudioPending' as const },
    { label: 'Media Pen', value: stats.mediaPending, icon: Clock, color: 'text-sky-600', bg: 'bg-sky-50', filter: 'MediaPending' as const },
  ];

  return (
    <div className="flex flex-col gap-2 mb-6" id="dashboard-stats">
      {/* Top 4 Stats Grid */}
      <div className="grid grid-cols-2 gap-2">
        {cards.map((card, idx) => (
          <motion.div
            key={card.label}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.05 }}
            onClick={() => onFilterChange(card.filter)}
            className={`bg-white px-3 py-2 rounded-xl border transition-all cursor-pointer flex items-center gap-3 ${
              currentFilter === card.filter 
                ? 'ring-2 ring-blue-500 border-transparent shadow-md' 
                : 'border-slate-100 shadow-sm'
            }`}
          >
            <div className={`${card.bg} ${card.color} w-8 h-8 rounded-lg flex items-center justify-center shrink-0`}>
              <card.icon size={16} />
            </div>
            <div className="flex flex-col leading-none">
              <p className="text-[9px] font-black text-slate-400 uppercase mb-0.5 tracking-tight">{card.label}</p>
              <p className="text-sm font-black text-slate-900">{card.value}</p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Balance Widget - Compact Row */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-slate-900 px-4 py-2.5 rounded-xl flex items-center justify-between shadow-lg"
      >
        <div className="flex items-center gap-2">
          <div className="bg-white/10 p-1.5 rounded-lg text-rose-400">
            <Wallet size={14} />
          </div>
          <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Total Balance</span>
        </div>
        <span className="text-base font-black text-white">Rs. {stats.totalBalance.toLocaleString()}</span>
      </motion.div>
    </div>
  );
};

