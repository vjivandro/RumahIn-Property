import React, { useEffect, useState } from 'react';
import { db } from '../../firebase/config'; // Pastikan path ini benar
import { collection, onSnapshot, query, orderBy } from 'firebase/firestore';
import { Link } from 'react-router-dom';

// Komponen Hero yang diperbaiki agar menggunakan background image full dan responsive
const Hero = () => (
    // Menggunakan background image via inline style agar dinamis, rounded-3xl agar seperti referensi
    <div
        className="relative h-[60vh] md:h-[500px] rounded-3xl overflow-hidden mb-12 mx-2 md:mx-4 mt-4 shadow-xl border-4 border-white"
        style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1519681393784-d120267933ba')`, // Contoh gambar pemandangan awan
            backgroundSize: 'cover',
            backgroundPosition: 'center'
        }}
    >
        {/* Overlay gelap agar teks terbaca */}
        <div className="absolute inset-0 bg-emerald-950/40 flex flex-col items-center justify-center text-center px-6">
            <h1 className="text-white text-4xl md:text-6xl font-extrabold max-w-3xl leading-tight tracking-tight drop-shadow-md">
                Jelajahi Properti Impian Anda Bersama RumahIn
            </h1>
            <p className="text-white/80 mt-4 max-w-lg text-lg hidden md:block">
                Temukan ratusan listing rumah dan tanah terbaik di lokasi strategis Indonesia.
            </p>

            {/* Search Bar Mengambang (Sederhana dulu untuk perbaikan UI) */}
            <div className="mt-10 bg-white/95 backdrop-blur-sm p-4 rounded-3xl shadow-2xl flex flex-wrap gap-4 items-center justify-center max-w-3xl w-full border border-gray-100">
                <input
                    type="text"
                    placeholder="Cari Lokasi atau Nama Properti..."
                    className="flex-grow p-3 border border-gray-100 rounded-xl outline-emerald-500 text-sm"
                />
                <button className="bg-emerald-950 hover:bg-emerald-800 transition text-white px-8 py-3 rounded-xl font-bold text-sm flex items-center gap-2 shadow-md">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
                    Cari
                </button>
            </div>
        </div>
    </div>
);

// Komponen Card yang diperbaiki untuk handle data array dan merapikan UI Harga
const PropertyCard = ({ item }) => (
    <div className="bg-white rounded-3xl p-3 shadow-sm border border-gray-100 group transition-all hover:shadow-2xl hover:-translate-y-1 flex flex-col h-full">
        <div className="relative">
            {/* Tampilkan gambar dari base64, jika kosong pakai placeholder */}
            <img
                src={item.image || 'https://via.placeholder.com/400x300?text=No+Image'}
                alt={item.title}
                className="w-full h-60 object-cover rounded-2xl"
            />
            {/* Menampilkan semua Kategori sebagai badge */}
            <div className="absolute top-4 left-4 flex gap-1.5 flex-wrap">
                {item.category?.map(cat => (
                    <span key={cat} className="bg-white/90 backdrop-blur-sm text-[10px] font-bold px-3 py-1.5 rounded-full uppercase shadow-sm border border-gray-100">
             {cat}
           </span>
                ))}
            </div>
        </div>

        <div className="p-4 flex flex-col flex-grow">
            {/* Tampilkan Koordinat dari GeoPoint */}
            <div className="flex items-center gap-1 text-gray-400 text-[10px] mb-2 uppercase tracking-widest font-bold">
                <svg className="w-3 h-3 text-emerald-600" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd"></path></svg>
                Loc: {item.location?.latitude?.toFixed(3) || '-'}, {item.location?.longitude?.toFixed(3) || '-'}
            </div>

            <h3 className="text-xl font-bold text-gray-950 mb-4 h-14 line-clamp-2 uppercase group-hover:text-emerald-800 transition-colors">
                {item.title}
            </h3>

            {/* Menampilkan Tipe dan Ukuran Tanah */}
            <div className="flex justify-between border-t border-gray-100 pt-4 mb-6 text-[11px] font-medium text-gray-500 uppercase tracking-wide bg-gray-50/50 p-2 rounded-lg">
                <span className="flex items-center gap-1">🛏️ {item.tipe?.[0] || 'Unit'}</span>
                <span className="flex items-center gap-1">🚿 Tipe {item.size_type?.join('/') || '-'}</span>
                <span className="flex items-center gap-1">📐 {item.landSize || '0'} m²</span>
            </div>

            {/* Perbaikan Tampilan Harga & Tombol Detail */}
            <div className="mt-auto flex flex-col gap-3 pt-2">
          <span className="text-2xl font-black text-emerald-950">
            Rp {item.price?.toLocaleString('id-ID')}
          </span>
                <Link
                    to={`/property/${item.id}`}
                    className="w-full text-center bg-emerald-50 text-emerald-700 px-5 py-3 rounded-xl text-sm font-bold hover:bg-emerald-600 hover:text-white transition-all"
                >
                    Lihat Detail
                </Link>
            </div>
        </div>
    </div>
);

const LandingPage = () => {
    const [properties, setProperties] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Membuat query ke Firestore
        const q = query(collection(db, "properties"), orderBy("createdAt", "desc"));

        // Mengambil data secara real-time
        const unsubscribe = onSnapshot(q, (snapshot) => {
            const data = snapshot.docs.map(doc => ({id: doc.id, ...doc.data() }));
            console.log("Data Properti Terambil:", data); // Untuk debugging di MacBook console
            setProperties(data);
            setLoading(false);
        });

        return () => unsubscribe(); // Cleanup saat unmount
    }, []);

    // Tampilan Loading yang lebih bagus
    if (loading) return (
        <div className="min-h-screen flex flex-col items-center justify-center gap-4 bg-gray-50">
            <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-emerald-950"></div>
            <p className="text-sm text-gray-500 font-medium">Memuat Listing Properti...</p>
        </div>
    );

    return (
        <div className="max-w-7xl mx-auto px-4 md:px-6 mb-20">
            <Hero />
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 mt-12">
                {properties.map(property => (
                    <PropertyCard key={property.id} item={property} />
                ))}
            </div>
        </div>
    );
};

export default LandingPage;
