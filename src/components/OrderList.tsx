import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Phone, 
  CalendarDays, 
  Clock, 
  CheckSquare, 
  Footprints, 
  History,
  MessageCircle
} from 'lucide-react';
import { Order } from '../types';

interface OrderListProps {
  orders: Order[];
  onSelect: (order: Order) => void;
}

export const OrderList: React.FC<OrderListProps> = ({ orders, onSelect }) => {
  return (
    <div className="flex flex-col gap-4" id="order-list">
      <AnimatePresence>
        {orders.map((order, idx) => {
          const isStudio = order.customerType.toUpperCase() === 'STUDIO';
          const borderColor = isStudio ? 'border-l-purple-500' : 'border-l-sky-500';
          const typeBg = isStudio ? 'bg-purple-500' : 'bg-sky-500';
          const nameColor = 'text-blue-700'; // Darker blue like image
          
          return (
            <motion.div
              key={order.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              layout
              transition={{ delay: Math.min(idx * 0.05, 0.5) }}
              className={`relative bg-white rounded-3xl border border-slate-100 shadow-xl overflow-hidden border-l-8 ${borderColor}`}
              id={`order-card-${order.id}`}
            >
              <div className="p-4">
                {/* Header Section */}
                <div className="flex justify-between items-start mb-2">
                  <div className="flex flex-col">
                    <span className="text-2xl font-black text-slate-800 tracking-tighter">#{order.id}</span>
                    <h3 className={`text-xl font-extrabold ${nameColor} leading-none mt-1`}>{order.name}</h3>
                  </div>
                  <span className={`${typeBg} text-white text-[10px] font-black px-3 py-1 rounded-md uppercase tracking-widest`}>
                    {order.customerType}
                  </span>
                </div>

                <div className="h-[1px] bg-slate-100 w-full mb-3" />

                {/* Info Grid - 2 Columns */}
                <div className="grid grid-cols-2 gap-x-6 gap-y-3 mb-4">
                  {/* Phone Column */}
                  <a href={`tel:${order.phone}`} className="flex flex-col gap-1 hover:opacity-75 transition-opacity">
                    <div className="flex items-center gap-2 text-[10px] font-extrabold text-slate-500 uppercase tracking-wider">
                      <Phone size={14} className="text-slate-800" fill="currentColor" />
                      <span>Phone</span>
                    </div>
                    <span className="text-lg font-bold text-slate-800 pl-0.5 leading-tight tracking-tight">{order.phone}</span>
                  </a>

                  {/* WhatsApp Column */}
                  <a 
                    href={`https://wa.me/${order.whatsApp.replace(/[^0-9]/g, '')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex flex-col gap-1 hover:opacity-75 transition-opacity"
                  >
                    <div className="flex items-center gap-2 text-[10px] font-extrabold text-slate-500 uppercase tracking-wider">
                      <MessageCircle size={14} className="text-slate-800" />
                      <span>WhatsApp</span>
                    </div>
                    <span className="text-lg font-bold text-slate-800 pl-0.5 leading-tight tracking-tight">{order.whatsApp}</span>
                  </a>

                  {/* Event Date Column */}
                  <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-2 text-[10px] font-extrabold text-slate-500 uppercase tracking-wider">
                      <CalendarDays size={14} className="text-rose-500" />
                      <span>Event Date</span>
                    </div>
                    <span className="text-sm font-bold text-slate-800 pl-0.5 leading-tight break-all">{order.eventDate}</span>
                  </div>

                  {/* Deadline Column */}
                  <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-2 text-[10px] font-extrabold text-slate-500 uppercase tracking-wider">
                      <Clock size={14} className="text-slate-400" />
                      <span>Deadline</span>
                    </div>
                    <span className="text-sm font-bold text-slate-800 pl-0.5 leading-tight break-all">{order.deadline}</span>
                  </div>

                  {/* Status Column */}
                  <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-2 text-[10px] font-extrabold text-slate-500 uppercase tracking-wider">
                      <CheckSquare size={14} className="text-emerald-500" fill="currentColor" fillOpacity={0.2} />
                      <span>Status</span>
                    </div>
                    <span className="text-lg font-bold text-slate-800 pl-0.5 leading-tight">{order.status}</span>
                  </div>

                  {/* Steps Column */}
                  <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-2 text-[10px] font-extrabold text-slate-500 uppercase tracking-wider">
                      <Footprints size={14} className="text-blue-500" />
                      <span>Steps</span>
                    </div>
                    <span className="text-lg font-bold text-slate-800 pl-0.5 leading-tight italic">{order.steps}</span>
                  </div>
                </div>

                {/* Financial Box Section */}
                <div className="bg-sky-50/60 rounded-[2rem] p-4 mb-3 border border-sky-100/50">
                  <div className="grid grid-cols-2 gap-y-3">
                    {/* ADV Row */}
                    <div className="flex flex-col gap-0.5">
                      <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest">ADV 1</span>
                      <span className="text-base font-bold text-slate-700">{order.advance1}</span>
                    </div>
                    <div className="flex flex-col gap-0.5">
                      <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest">ADV 2</span>
                      <span className="text-base font-bold text-slate-700">{order.advance2}</span>
                    </div>
                    
                    {/* Extra/Discount Row */}
                    <div className="flex flex-col gap-0.5">
                      <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest">EXTRA</span>
                      <span className="text-base font-bold text-slate-700">{order.extraCharge}</span>
                    </div>
                    <div className="flex flex-col gap-0.5">
                      <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest">DISCOUNT</span>
                      <span className="text-base font-bold text-slate-700">{order.discount}</span>
                    </div>

                    {/* Totals Row */}
                    <div className="flex flex-col pt-3 border-t border-sky-200/50">
                      <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest mb-0.5">TOTAL</span>
                      <span className="text-lg font-black text-slate-900 leading-none">{order.fullTotal}</span>
                    </div>
                    <div className="flex flex-col pt-3 border-t border-sky-200/50">
                      <div className="flex items-center gap-1.5 text-[10px] font-extrabold text-slate-400 uppercase tracking-widest mb-0.5">
                        <span className="text-lg leading-none">💰</span>
                        <span>Balance</span>
                      </div>
                      <span className={`text-lg font-black leading-none ${order.balance > 0 ? 'text-rose-500' : 'text-rose-500'}`}>
                        {order.balance}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Footer Update Timestamp */}
                <div className="flex items-center gap-2 text-[9px] font-black text-slate-400 uppercase tracking-[0.25em] bg-slate-50/80 py-2 px-4 rounded-lg w-full">
                  <History size={12} strokeWidth={3} />
                  <span>Last System Update</span>
                </div>
              </div>
            </motion.div>
          );
        })}
      </AnimatePresence>
      
      {orders.length === 0 && (
        <div className="py-20 text-center flex flex-col items-center gap-3 text-slate-400">
          <p className="text-sm">No orders found matching your search</p>
        </div>
      )}
    </div>
  );
};


