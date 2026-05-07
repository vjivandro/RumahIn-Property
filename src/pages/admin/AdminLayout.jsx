import React, { useState } from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { signOut } from 'firebase/auth';
import { auth } from '../../firebase/config';
import {
    Bars3Icon,
    XMarkIcon,
    Squares2X2Icon,
    HomeModernIcon,
    UsersIcon,
    ClipboardDocumentListIcon,
    ArrowLeftOnRectangleIcon
} from '@heroicons/react/24/outline';

const AdminLayout = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const location = useLocation();
    const navigate = useNavigate();

    const menuItems = [
        { name: 'Dashboard', path: '/admin', icon: Squares2X2Icon },
        { name: 'Product Property', path: '/admin/properties', icon: HomeModernIcon },
        { name: 'Users', path: '/admin/users', icon: UsersIcon },
        { name: 'Pesanan', path: '/admin/orders', icon: ClipboardDocumentListIcon },
    ];

    const handleLogout = () => {
        if(window.confirm("Keluar dari panel admin?")) {
            signOut(auth).then(() => navigate('/login'));
        }
    };

    return (
        <div className="min-h-screen bg-[#f8fafc] flex">
            {/* SIDEBAR */}
            <aside className={`
        ${isSidebarOpen ? 'w-72' : 'w-20'} 
        fixed inset-y-0 left-0 z-50 bg-white border-r border-slate-200 transition-all duration-300 ease-in-out flex flex-col
      `}>
                <div className="p-6 flex items-center justify-between">
                    {isSidebarOpen && <h1 className="text-2xl font-black text-indigo-600 tracking-tighter">RumahIn.</h1>}
                    <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="p-2 hover:bg-slate-50 rounded-xl text-slate-500">
                        {isSidebarOpen ? <XMarkIcon className="w-6 h-6 md:hidden"/> : <Bars3Icon className="w-6 h-6 mx-auto"/>}
                    </button>
                </div>

                <nav className="flex-1 px-4 space-y-2 mt-4">
                    {menuItems.map((item) => {
                        const isActive = location.pathname === item.path;
                        return (
                            <Link
                                key={item.name}
                                to={item.path}
                                className={`
                  flex items-center gap-4 px-4 py-3.5 rounded-2xl transition-all duration-200 group
                  ${isActive ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-100' : 'text-slate-500 hover:bg-indigo-50 hover:text-indigo-600'}
                `}
                            >
                                <item.icon className={`w-6 h-6 shrink-0 ${isActive ? 'text-white' : 'text-slate-400 group-hover:text-indigo-600'}`} />
                                {isSidebarOpen && <span className="font-bold text-sm">{item.name}</span>}
                            </Link>
                        );
                    })}
                </nav>

                <div className="p-4 border-t border-slate-100">
                    <button onClick={handleLogout} className="flex items-center gap-4 px-4 py-3.5 w-full text-red-500 hover:bg-red-50 rounded-2xl transition-all font-bold text-sm">
                        <ArrowLeftOnRectangleIcon className="w-6 h-6 shrink-0" />
                        {isSidebarOpen && <span>Logout</span>}
                    </button>
                </div>
            </aside>

            {/* MAIN CONTENT */}
            <div className={`flex-1 transition-all duration-300 ${isSidebarOpen ? 'ml-72' : 'ml-20'}`}>
                <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-slate-100 px-8 py-4 flex justify-between items-center">
                    <div className="flex items-center gap-4">
                        <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="hidden md:block p-2 hover:bg-slate-50 rounded-lg">
                            <Bars3Icon className="w-6 h-6 text-slate-500" />
                        </button>
                        <h2 className="text-sm font-bold text-slate-400 uppercase tracking-widest">Panel Management</h2>
                    </div>
                    <div className="flex items-center gap-4 bg-slate-50 px-4 py-2 rounded-2xl border border-slate-100">
                        <div className="text-right hidden sm:block">
                            <p className="text-xs font-bold text-slate-900 leading-none">Juris Vassa</p>
                            <p className="text-[10px] text-slate-400 mt-1 uppercase">Super Admin</p>
                        </div>
                        <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white font-black shadow-md">JV</div>
                    </div>
                </header>

                <main className="p-8">
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

export default AdminLayout;
