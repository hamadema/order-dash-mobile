import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Search, SlidersHorizontal, RefreshCw, Plus, X, Settings, Info, LogOut } from 'lucide-react';
import { Order } from './types';
import { orderService } from './services/orderService';
import { DashboardStats } from './components/DashboardStats';
import { OrderList } from './components/OrderList';
import { OrderDetailsOverlay } from './components/OrderDetailsOverlay';

export default function App() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLive, setIsLive] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'All' | 'Pending' | 'Complete' | 'StudioPending' | 'MediaPending'>('All');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSyncing, setIsSyncing] = useState(false);
  const [showSettings, setShowSettings] = useState(false);

  useEffect(() => {
    loadOrders();
    
    // Auto-sync every 60 seconds
    const interval = setInterval(() => {
      console.log('Auto-syncing orders...');
      syncOrdersSilently();
    }, 60000);

    return () => clearInterval(interval);
  }, []);

  const loadOrders = async () => {
    setIsLoading(true);
    try {
      const response = await orderService.getOrders();
      setOrders(response.orders);
      setIsLive(response.isLive);
    } catch (error) {
      console.error('Failed to load orders:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const syncOrdersSilently = async () => {
    setIsSyncing(true);
    try {
      const response = await orderService.getOrders();
      setOrders(response.orders);
      setIsLive(response.isLive);
    } catch (error) {
      console.error('Auto-sync failed:', error);
    } finally {
      setIsSyncing(false);
    }
  };

  const filteredOrders = useMemo(() => {
    let result = orders;
    
    // Status Filter
    if (statusFilter !== 'All') {
      if (statusFilter === 'Pending') {
        result = result.filter(o => o.status !== 'Complete');
      } else if (statusFilter === 'StudioPending') {
        result = result.filter(o => o.status !== 'Complete' && o.customerType.toUpperCase() === 'STUDIO');
      } else if (statusFilter === 'MediaPending') {
        result = result.filter(o => o.status !== 'Complete' && o.customerType.toUpperCase() === 'MEDIA');
      } else {
        result = result.filter(o => o.status === statusFilter);
      }
    }
    
    // Search Query
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      result = result.filter(o => 
        o.id.toLowerCase().includes(q) || 
        o.name.toLowerCase().includes(q) || 
        o.phone.includes(q)
      );
    }
    
    return result;
  }, [orders, searchQuery, statusFilter]);

  const stats = useMemo(() => {
    const total = orders.length;
    const completed = orders.filter(o => o.status === 'Complete').length;
    const pending = total - completed;
    const studioPending = orders.filter(o => o.status !== 'Complete' && o.customerType.toUpperCase() === 'STUDIO').length;
    const mediaPending = orders.filter(o => o.status !== 'Complete' && o.customerType.toUpperCase() === 'MEDIA').length;
    const totalBalance = orders.reduce((acc, o) => acc + o.balance, 0);
    return { total, completed, pending, studioPending, mediaPending, totalBalance };
  }, [orders]);

  const handleSync = () => {
    setIsSyncing(true);
    setTimeout(() => {
      setIsSyncing(false);
      loadOrders();
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 overflow-x-hidden" id="app-root">
      {/* Fixed Header */}
      <header className="fixed top-0 left-0 right-0 bg-white/80 backdrop-blur-md border-b border-slate-100 z-30 px-6 pt-10 pb-3">
        <div className="max-w-md mx-auto flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-black tracking-tight text-slate-900 leading-none">OrderDash</h1>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Order Viewer</p>
            </div>
            <div className="flex gap-2">
              <motion.button 
                whileTap={{ scale: 0.9 }}
                onClick={() => setShowSettings(true)}
                className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 active:bg-slate-200 transition-colors"
                id="settings-btn"
              >
                <Settings size={18} />
              </motion.button>
              <motion.button 
                animate={isSyncing ? { rotate: 360 } : {}}
                transition={isSyncing ? { repeat: Infinity, duration: 1, ease: 'linear' } : {}}
                whileTap={{ scale: 0.9 }}
                onClick={handleSync}
                className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 active:bg-blue-50 active:text-blue-600 transition-colors"
                id="sync-btn"
              >
                <RefreshCw size={18} />
              </motion.button>
            </div>
          </div>

          <div className="relative group" id="search-container">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors" size={18} />
            <input 
              type="text"
              placeholder="Search by ID, name or phone..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-100 border-none rounded-2xl py-3.5 pl-12 pr-4 text-sm font-medium focus:ring-2 focus:ring-blue-500/20 focus:bg-white transition-all outline-none"
              id="order-search-input"
            />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-md mx-auto px-6 pt-40 pb-32">
        {!isLive && !isLoading && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 p-4 bg-amber-50 border border-amber-200 rounded-2xl flex flex-col gap-2"
          >
            <div className="flex items-center gap-2 text-amber-800 font-bold text-xs uppercase tracking-wider">
              <Info size={16} />
              <span>Viewing Sample Data</span>
            </div>
            <p className="text-xs text-amber-700 leading-relaxed">
              Connect your Google Sheets by setting the <code className="bg-amber-100 px-1 rounded">VITE_APPS_SCRIPT_URL</code> in your environment settings to see your real orders.
            </p>
          </motion.div>
        )}

        <DashboardStats 
          stats={stats} 
          currentFilter={statusFilter}
          onFilterChange={(f) => setStatusFilter(f as any)}
        />

        <div className="flex items-center justify-between mb-2">
          <h2 className="text-sm font-bold text-slate-400 uppercase tracking-widest">
            {statusFilter === 'All' ? 'Recent Orders' : `${statusFilter} Orders`}
          </h2>
          <div className="flex gap-1.5 flex-wrap justify-end">
            <span className="text-[10px] font-bold bg-slate-200 text-slate-600 px-2 py-0.5 rounded-full">{filteredOrders.length} RESULTS</span>
            {statusFilter !== 'All' && (
              <button 
                onClick={() => setStatusFilter('All')}
                className="text-[10px] font-bold bg-blue-100 text-blue-600 px-2 py-0.5 rounded-full flex items-center gap-1"
              >
                CLEAR <X size={8} />
              </button>
            )}
          </div>
        </div>

        {isLoading ? (
          <div className="flex flex-col gap-3">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="h-24 bg-slate-200 animate-pulse rounded-2xl w-full" />
            ))}
          </div>
        ) : (
          <OrderList orders={filteredOrders} onSelect={setSelectedOrder} />
        )}
      </main>

      {/* Overlays */}
      <OrderDetailsOverlay 
        order={selectedOrder} 
        onClose={() => setSelectedOrder(null)} 
      />

      {/* Settings Modal */}
      <AnimatePresence>
        {showSettings && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-6"
            onClick={() => setShowSettings(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white w-full max-w-xs rounded-3xl p-6 shadow-2xl space-y-6"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-lg">Settings</h3>
                <button onClick={() => setShowSettings(false)} className="text-slate-400"><X size={20} /></button>
              </div>

              <div className="space-y-4">
                <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-2xl">
                  <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                    <Info size={18} />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-400 uppercase">Version</p>
                    <p className="text-sm font-bold text-slate-700">v1.2.0</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-2xl">
                  <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center text-purple-600">
                    <RefreshCw size={18} />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-400 uppercase">Auto Sync</p>
                    <p className="text-sm font-bold text-slate-700">Enabled</p>
                  </div>
                </div>
              </div>

              <button 
                onClick={() => setShowSettings(false)}
                className="w-full bg-slate-900 text-white rounded-2xl py-3 font-bold text-sm"
              >
                Done
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

