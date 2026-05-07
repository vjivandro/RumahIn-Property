import React from 'react';

const Footer = () => {
    return (
        <footer className="bg-white border-t border-gray-100 pt-16 pb-8 mt-auto">
            <div className="max-w-7xl mx-auto px-6">
                <div className="flex flex-col md:flex-row justify-between items-center gap-6 mb-12">
                    <div className="text-center md:text-left">
                        <h2 className="text-3xl font-black text-emerald-950 tracking-tighter">
                            RumahIn<span className="text-blue-600">.</span>
                        </h2>
                        <p className="text-gray-500 text-sm mt-2 max-w-xs">
                            Mitra terpercaya Anda dalam menemukan hunian dan investasi properti terbaik di Indonesia.
                        </p>
                    </div>
                    <div className="flex gap-6 text-sm font-bold text-gray-500">
                        <a href="#" className="hover:text-emerald-600 transition">Beranda</a>
                        <a href="#" className="hover:text-emerald-600 transition">Tentang Kami</a>
                        <a href="#" className="hover:text-emerald-600 transition">Kontak</a>
                    </div>
                </div>
                <div className="text-center text-gray-400 text-xs border-t border-gray-50 pt-8">
                    &copy; {new Date().getFullYear()} RumahIn. All rights reserved.
                </div>
            </div>
        </footer>
    );
};

export default Footer;
