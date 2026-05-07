import React, { useState, useEffect } from 'react';
import { db } from '../../firebase/config';
import { collection, getDocs } from 'firebase/firestore';
import { HomeIcon, UsersIcon, ShoppingCartIcon, ArrowUpRightIcon } from '@heroicons/react/24/outline';

const AdminDashboard = () => {
    const [stats, setStats] = useState({ properties: 0, users: 0, orders: 0 });

    useEffect(() => {
        const fetchStats = async () => {
            const p = await getDocs(collection(db, "properties"));
            // Asumsi koleksi users dan orders sudah ada di Firestore
            // const u = await getDocs(collection(db, "users"));
            // const o = await getDocs(collection(db, "orders"));
            setStats({
                properties: p.size,
                users: 12, // Dummy data
                orders: 5  // Dummy data
            });
        };
        fetchStats();
    }, []);

    const cards = [
        { name: 'Total Property', value: stats.properties, icon: HomeIcon, color: 'text-indigo-600', bg: 'bg-indigo-50' },
        { name: 'Registered Users', value: stats.users, icon: UsersIcon, color: 'text-emerald-600', bg: 'bg-emerald-50' },
        { name: 'Total Pesanan', value: stats.orders, icon: ShoppingCartIcon, color: 'text-amber-600', bg: 'bg-amber-50' },
    ];

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <div>
                <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Dashboard Analytics</h1>
                <p className="text-slate-500">Pantau performa RumahIn secara harian.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {cards.map((card) => (
                    <div key={card.name} className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100 group hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                        <div className="flex justify-between items-start">
                            <div className={`${card.bg} p-4 rounded-2xl`}>
                                <card.icon className={`w-8 h-8 ${card.color}`} />
                            </div>
                            <span className="text-slate-300 group-hover:text-indigo-500 transition-colors">
                <ArrowUpRightIcon className="w-6 h-6" />
              </span>
                        </div>
                        <div className="mt-6">
                            <h3 className="text-4xl font-black text-slate-900 tracking-tighter">{card.value}</h3>
                            <p className="text-slate-400 font-bold text-sm uppercase mt-1">{card.name}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default AdminDashboard;
