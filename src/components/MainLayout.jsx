import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './navbar'; // Sesuaikan path jika berbeda
import Footer from './Footer';

const MainLayout = () => {
    return (
        // flex-col dan min-h-screen memastikan Footer selalu ada di paling bawah layar
        <div className="flex flex-col min-h-screen bg-[#f8f9fa]">
            <Navbar />

            {/* Outlet adalah tempat di mana konten halaman (seperti LandingPage) akan dirender */}
            <main className="flex-grow">
                <Outlet />
            </main>

            <Footer />
        </div>
    );
};

export default MainLayout;
