"use client";

import React, { useState, useEffect } from "react";
import { useAuth } from "@/components/providers/AuthProvider";
import { createClient } from "@/utils/supabase/client";
import { motion, AnimatePresence } from "framer-motion";
import { Notifications, NotificationsNone, Bolt, DoneAll, Close, Campaign } from "@mui/icons-material";
import Link from "next/link";

interface Notification {
  id: string;
  type: 'system' | 'award' | 'order' | 'referral';
  title: string;
  message: string;
  read: boolean;
  createdAt: string;
  link?: string;
}

export function NotificationPanel() {
  const { user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);

  const supabase = createClient();

  const fetchNotifications = async () => {
    if (!user) return;
    const { data, error } = await supabase
      .from('notifications')
      .select('*')
      .eq('profile_id', user.id)
      .order('created_at', { ascending: false });

    if (data) {
      setNotifications(data.map((n: any) => ({
        id: n.id,
        type: n.type,
        title: n.title,
        message: n.message,
        read: n.read,
        createdAt: n.created_at,
        link: n.link
      })));
      setUnreadCount(data.filter(n => !n.read).length);
    }
  };

  useEffect(() => {
    if (!user) {
      setNotifications([]);
      setUnreadCount(0);
      return;
    }

    fetchNotifications();

    // Subscribe to new notifications
    const channel = supabase
      .channel(`notifications:${user.id}`)
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'notifications', filter: `profile_id=eq.${user.id}` },
        () => fetchNotifications()
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user]);

  const markAllRead = async () => {
    if (!user) return;
    const { error } = await supabase
      .from('notifications')
      .update({ read: true })
      .eq('profile_id', user.id)
      .eq('read', false);
    
    if (!error) fetchNotifications();
  };

  const markRead = async (id: string) => {
    if (!user) return;
    const { error } = await supabase
      .from('notifications')
      .update({ read: true })
      .eq('id', id);
    
    if (!error) fetchNotifications();
  };

  return (
    <div className="relative">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 text-gray-400 hover:text-white transition-colors"
      >
        {unreadCount > 0 ? <Notifications className="text-wattle" /> : <NotificationsNone />}
        {unreadCount > 0 && (
          <span className="absolute top-1 right-1 w-4 h-4 bg-wattle text-bottle-green font-black text-[8px] flex items-center justify-center rounded-full leading-none">
            {unreadCount}
          </span>
        )}
      </button>

      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 z-[100] bg-black/20 backdrop-blur-sm lg:bg-transparent"
            />
            <motion.div 
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.95 }}
              className="absolute right-0 top-full mt-4 w-80 md:w-96 bg-dark-slate border border-white/10 shadow-[0_30px_60px_-15px_rgba(0,0,0,0.5)] z-[110] overflow-hidden"
            >
              <header className="p-6 border-b border-white/5 flex justify-between items-center bg-bottle-green/10">
                <div className="flex items-center gap-3">
                   <Campaign className="text-wattle" sx={{ fontSize: 20 }} />
                   <h3 className="font-structural text-xs uppercase tracking-widest text-white">Alert Protocol</h3>
                </div>
                {unreadCount > 0 && (
                   <button onClick={markAllRead} className="text-[10px] uppercase font-structural text-gray-500 hover:text-wattle transition-colors flex items-center gap-2">
                     <DoneAll sx={{ fontSize: 14 }} /> Mark All
                   </button>
                )}
              </header>

              <div className="max-h-[400px] overflow-y-auto scrollbar-thin scrollbar-thumb-white/10">
                {notifications.length === 0 ? (
                  <div className="py-20 text-center opacity-20 flex flex-col items-center">
                    <Bolt sx={{ fontSize: 40 }} />
                    <p className="font-editorial text-[10px] uppercase mt-4">No data reported.</p>
                  </div>
                ) : (
                  notifications.map(n => (
                    <div 
                      key={n.id} 
                      onClick={() => markRead(n.id)}
                      className={`p-6 border-b border-white/5 cursor-pointer transition-colors hover:bg-white/5 ${!n.read ? "bg-wattle/[0.02]" : ""}`}
                    >
                      <div className="flex gap-4">
                        <div className={`mt-1 ${!n.read ? "text-wattle" : "text-gray-600"}`}>
                           <Bolt sx={{ fontSize: 16 }} />
                        </div>
                        <div className="flex-1">
                          <div className="flex justify-between items-start mb-1">
                             <h4 className={`font-structural text-[10px] uppercase tracking-widest ${!n.read ? "text-white" : "text-gray-500"}`}>{n.title}</h4>
                             <span className="text-[8px] font-mono text-gray-600 uppercase">{n.createdAt ? new Date(n.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : "Recently"}</span>
                          </div>
                          <p className="font-editorial text-xs text-gray-400 line-clamp-2 leading-relaxed">{n.message}</p>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>

              <footer className="p-4 bg-bottle-green/20 border-t border-white/5 text-center">
                 <Link href="/account/notifications" onClick={() => setIsOpen(false)}>
                    <span className="font-structural text-[10px] uppercase tracking-widest text-gray-500 hover:text-white transition-colors">Audit All Communications</span>
                 </Link>
              </footer>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
