import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Phone, MessageCircle, Calendar, ArrowRight, CreditCard, Tag, BadgeInfo, Clock } from 'lucide-react';
import { Order } from '../types';

interface DetailProps {
  order: Order | null;
  onClose: () => void;
}

export const OrderDetailsOverlay: React.FC<DetailProps> = ({ order, onClose }) => {
  if (!order) return null;

  const DetailRows = [
    { label: 'Order ID', value: order.id, icon: Tag },
    { label: 'Event Date', value: order.eventDate, icon: Calendar },
    { label: 'Deadline', value: order.deadline, icon: Clock },
    { label: 'Customer Type', value: order.customerType, icon: Tag },
  ];

  const financialRows = [
    { label: 'Full Total', value: `Rs. ${order.fullTotal.toLocaleString()}`, highlight: true },
    { label: 'Advance 1', value: `Rs. ${order.advance1.toLocaleString()}` },
    { label: 'Advance 2', value: `Rs. ${order.advance2.toLocaleString()}` },
    { label: 'Extra Charge', value: `Rs. ${order.extraCharge.toLocaleString()}` },
    { label: 'Discount', value: `- Rs. ${order.discount.toLocaleString()}`, color: 'text-rose-600' },
    { label: 'Balance Due', value: `Rs. ${order.balance.toLocaleString()}`, overdue: order.balance > 0, highlight: true },
  ];

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-end sm:items-center justify-center p-0 sm:p-4"
        id="order-details-backdrop"
        onClick={onClose}
      >
        <motion.div
          initial={{ y: '100%' }}
          animate={{ y: 0 }}
          exit={{ y: '100%' }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className="bg-white w-full max-w-lg rounded-t-[32px] sm:rounded-[32px] shadow-2xl flex flex-col max-h-[90vh] overflow-hidden"
          id="order-details-panel"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="p-6 border-b border-slate-100 flex items-center justify-between sticky top-0 bg-white z-10">
            <div>
              <h2 className="text-xl font-bold text-slate-900">{order.name}</h2>
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-tighter">Order Summary Details</p>
            </div>
            <button 
              onClick={onClose}
              className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 hover:bg-slate-200 transition-colors"
              id="close-details-btn"
            >
              <X size={20} />
            </button>
          </div>

          {/* Content */}
          <div className={`flex-1 overflow-y-auto p-6 space-y-8 pb-10 transition-colors ${
            order.customerType === 'STUDIO' ? 'bg-purple-50/50' : 'bg-sky-50/50'
          }`}>
            {/* Quick Actions */}
            <div className="flex gap-3">
              <a 
                href={`tel:${order.phone}`}
                className="flex-1 bg-blue-600 text-white rounded-2xl p-4 flex flex-col items-center justify-center gap-2 shadow-lg shadow-blue-200 active:scale-95 transition-transform"
              >
                <Phone size={24} />
                <span className="text-xs font-bold uppercase tracking-wide">Call</span>
              </a>
              <a 
                href={`https://wa.me/${order.whatsApp || order.phone}`}
                className="flex-1 bg-emerald-600 text-white rounded-2xl p-4 flex flex-col items-center justify-center gap-2 shadow-lg shadow-emerald-200 active:scale-95 transition-transform"
              >
                <MessageCircle size={24} />
                <span className="text-xs font-bold uppercase tracking-wide">WhatsApp</span>
              </a>
            </div>

            {/* General Info */}
            <div className="space-y-4">
               <div className="flex items-center gap-2 mb-2">
                <BadgeInfo size={16} className="text-slate-400" />
                <h4 className="text-sm font-bold text-slate-400 uppercase tracking-widest">General Information</h4>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <InfoBlock label="Order ID" value={`#${order.id}`} />
                <InfoBlock label="Customer Type" value={order.customerType} />
                <InfoBlock label="Event Date" value={order.eventDate} />
                <InfoBlock label="Deadline" value={order.deadline} />
                <div className="col-span-2 text-wrap break-words">
                   <InfoBlock label="Production Steps" value={order.steps || 'No steps recorded'} />
                </div>
              </div>
            </div>

            {/* Financials */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 mb-2">
                <CreditCard size={16} className="text-slate-400" />
                <h4 className="text-sm font-bold text-slate-400 uppercase tracking-widest">Financial Summary</h4>
              </div>
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-4 border border-white/20 shadow-sm space-y-3">
                {financialRows.map((row, idx) => (
                  <div key={idx} className={`flex justify-between items-center ${row.highlight ? 'py-1' : ''}`}>
                    <span className={`text-sm ${row.highlight ? 'font-bold text-slate-900' : 'text-slate-500'}`}>{row.label}</span>
                    <span className={`text-sm font-bold ${row.color || (row.overdue ? 'text-rose-600' : 'text-slate-900')} ${row.highlight ? 'text-lg' : ''}`}>
                      {row.value}
                    </span>
                  </div>
                ))}
              </div>
            </div>
            
            {order.lastUpdated && (
              <p className="text-[10px] text-center text-slate-400 uppercase font-medium">Last updated: {new Date(order.lastUpdated).toLocaleString()}</p>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

const InfoBlock = ({ label, value }: { label: string, value: string }) => (
  <div className="flex flex-col gap-0.5">
    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{label}</span>
    <span className="text-sm border-b border-slate-100 pb-1 text-slate-900 font-medium">{value}</span>
  </div>
);
