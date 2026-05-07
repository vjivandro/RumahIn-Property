import React, { useEffect, useState } from 'react';
import { db } from '../../firebase/config';
import { collection, onSnapshot, query, orderBy, limit} from 'firebase/firestore';
import { Link } from 'react-router-dom';
import {
    PlusIcon,
    MagnifyingGlassIcon,
    MapPinIcon,
    CurrencyDollarIcon, PencilSquareIcon
} from '@heroicons/react/24/outline';
import {TrashIcon} from "lucide-react";

const PropertyList = () => {
    const [properties, setProperties] = useState([]);
    const [dataLimit, setDataLimit] = useState(10);

    useEffect(() => {
        const q = query(collection(db, "properties"), orderBy("createdAt", "desc"), limit(dataLimit));
        const unsubscribe = onSnapshot(q, (snapshot) => {
            setProperties(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
        });
        return () => unsubscribe();
    }, [dataLimit]);

    return (
        <div className="p-6 md:p-10 min-h-screen bg-[#f8fafc]">
            {/* HEADER SECTION - UX: Clear Hierarchy */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
                <div>
                    <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Property Overview</h1>
                    <p className="text-slate-500 mt-1">Manage your listings and property performance.</p>
                </div>

                <Link
                    to="/admin/add"
                    className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3.5 rounded-2xl font-bold transition-all shadow-xl shadow-indigo-200 hover:scale-[1.02] active:scale-[0.98]"
                >
                    <PlusIcon className="w-5 h-5" />
                    <span>New Property</span>
                </Link>
            </div>

            {/* STATS PREVIEW - UI: Visual Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
                <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-slate-100 flex items-center gap-5">
                    <div className="w-14 h-14 bg-indigo-50 rounded-2xl flex items-center justify-center text-indigo-600">
                        <CurrencyDollarIcon className="w-8 h-8" />
                    </div>
                    <div>
                        <p className="text-sm text-slate-500 font-medium">Total Listings</p>
                        <h3 className="text-2xl font-bold text-slate-900">{properties.length} Units</h3>
                    </div>
                </div>
                {/* Tambahkan stats lain jika perlu */}
            </div>

            {/* SEARCH & FILTER AREA */}
            <div className="bg-white p-4 rounded-3xl shadow-sm border border-slate-100 flex flex-wrap justify-between items-center gap-4 mb-6">
                <div className="relative flex-1 max-w-md">
                    <MagnifyingGlassIcon className="w-5 h-5 text-slate-400 absolute left-4 top-3.5" />
                    <input
                        type="text"
                        placeholder="Search property name..."
                        className="w-full pl-12 pr-4 py-3 bg-slate-50 border-none rounded-2xl text-sm focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                    />
                </div>
                <div className="flex items-center gap-3">
                    <label className="text-sm font-semibold text-slate-500">Show:</label>
                    <select
                        value={dataLimit}
                        onChange={(e) => setDataLimit(Number(e.target.value))}
                        className="bg-slate-50 border-none rounded-xl px-4 py-2 text-sm font-bold text-indigo-600 outline-none"
                    >
                        <option value={10}>10</option>
                        <option value={20}>20</option>
                        <option value={50}>50</option>
                    </select>
                </div>
            </div>

            {/* MAIN TABLE - UI: Glassmorphism/Clean Style */}
            <div className="bg-white rounded-[2.5rem] shadow-sm border border-slate-100 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                        <tr className="bg-slate-50/50 text-slate-400 text-[11px] uppercase tracking-[0.15em] font-bold">
                            <th className="px-8 py-5">Property Details</th>
                            <th className="px-4 py-5">Category</th>
                            <th className="px-4 py-5">Pricing</th>
                            <th className="px-8 py-5 text-right">Actions</th>
                        </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                        {properties.map((item) => (
                            <tr key={item.id} className="group hover:bg-slate-50/50 transition-colors">
                                <td className="px-8 py-6">
                                    <div className="flex items-center gap-4">
                                        <div className="w-16 h-16 rounded-2xl overflow-hidden bg-slate-100 shadow-inner border border-white">
                                            <img src={item.image} alt="" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-slate-900 text-lg leading-tight">{item.title}</h4>
                                            <div className="flex items-center gap-1 text-slate-400 text-xs mt-1">
                                                <MapPinIcon className="w-3 h-3" />
                                                <span>{item.landSize} m² Area</span>
                                            </div>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-4 py-6">
                    <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-wider ${
                        item.category?.includes('Komersil')
                            ? 'bg-amber-50 text-amber-600 border border-amber-100'
                            : 'bg-emerald-50 text-emerald-600 border border-emerald-100'
                    }`}>
                      {item.category?.join(' / ')}
                    </span>
                                </td>
                                <td className="px-4 py-6 font-extrabold text-slate-900">
                                    Rp {item.price?.toLocaleString('id-ID')}
                                </td>
                                <td className="px-8 py-6">
                                    <div className="flex justify-end gap-2">
                                        <button className="p-2.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-all">
                                            <PencilSquareIcon className="w-5 h-5" />
                                        </button>
                                        <button className="p-2.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all">
                                            <TrashIcon className="w-5 h-5" />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default PropertyList;
