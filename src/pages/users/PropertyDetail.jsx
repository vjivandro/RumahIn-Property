import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { db, auth } from '../../firebase/config';
import { doc, getDoc } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';
import { MapContainer, TileLayer, Marker } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import {
    ChevronLeftIcon,
    HeartIcon,
    MapPinIcon,
    ArrowsPointingOutIcon,
    HomeModernIcon,
    PhoneIcon,
    CalendarDaysIcon,
    ArrowTopRightOnSquareIcon,
    LockClosedIcon // <-- Tambahan icon untuk Modal
} from '@heroicons/react/24/outline';

// Perbaikan konfigurasi ikon Marker Leaflet
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';
const DefaultIcon = L.icon({
    iconUrl: markerIcon,
    shadowUrl: markerShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41]
});
L.Marker.prototype.options.icon = DefaultIcon;

const PropertyDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [property, setProperty] = useState(null);
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState(null);

    // State untuk Custom Modal
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalFeature, setModalFeature] = useState('');

    // Pantau status login user
    useEffect(() => {
        const unsubscribeAuth = onAuthStateChanged(auth, (currentUser) => {
            setUser(currentUser);
        });
        return () => unsubscribeAuth();
    }, []);

    // Ambil data properti
    useEffect(() => {
        const fetchProperty = async () => {
            try {
                const docRef = doc(db, "properties", id);
                const docSnap = await getDoc(docRef);
                if (docSnap.exists()) {
                    setProperty({ id: docSnap.id, ...docSnap.data() });
                } else {
                    console.error("Dokumen tidak ditemukan!");
                }
            } catch (error) {
                console.error("Gagal mengambil data:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchProperty();
    }, [id]);

    // Logika Proteksi Fitur dengan Custom Modal
    const handleProtectedAction = (featureName) => {
        if (!user) {
            // Buka modal alih-alih window.confirm
            setModalFeature(featureName);
            setIsModalOpen(true);
        } else {
            // Jalankan aksi jika sudah login
            alert(`Aksi untuk ${featureName} sedang diproses...`);
        }
    };

    if (loading) return (
        <div className="min-h-screen flex items-center justify-center bg-[#f8fafc]">
            <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-emerald-500"></div>
        </div>
    );

    if (!property) return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-[#f8fafc] p-6">
            <h2 className="text-2xl font-bold text-slate-800">Properti tidak ditemukan</h2>
            <Link to="/" className="mt-4 text-emerald-600 font-bold hover:underline">Kembali ke Beranda</Link>
        </div>
    );

    const lat = property.location?.latitude || -8.17;
    const lng = property.location?.longitude || 113.70;

    return (
        <div className="bg-[#f8fafc] min-h-screen pb-20 relative">
            <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-8">

                {/* TOP BAR: Breadcrumb & Wishlist */}
                <div className="flex justify-between items-center mb-8">
                    <Link to="/"
                          className="flex items-center gap-2 text-[10px] font-black text-slate-400 hover:text-emerald-600 uppercase tracking-[0.2em] transition-all">
                        <ChevronLeftIcon className="w-4 h-4"/>
                        Search / Property Detail
                    </Link>

                    {/* TOMBOL FAVORIT SEKARANG DIBATASI */}
                    <button
                        onClick={() => handleProtectedAction('menambahkan ke favorit')}
                        className="p-2.5 bg-white rounded-full shadow-sm text-slate-300 hover:text-rose-500 transition-all border border-slate-100 active:scale-90"
                    >
                        <HeartIcon className="w-6 h-6"/>
                    </button>
                </div>

                {/* SECTION 1: HEADER & PRICE */}
                <div className="flex flex-col lg:flex-row lg:justify-between lg:items-end gap-6 mb-10">
                    <div className="flex-1">
                        <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight mb-2 uppercase">{property.title}</h1>
                        <p className="text-slate-500 flex items-center gap-2 text-sm">
                            <MapPinIcon className="w-5 h-5 text-slate-300"/>
                            {property.address || 'Alamat belum dilengkapi oleh admin'}
                        </p>
                        <div className="flex flex-wrap gap-4 mt-6">
              <span
                  className="flex items-center gap-2 px-4 py-2 bg-white rounded-xl border border-slate-100 text-xs font-bold text-slate-600">
                <HomeModernIcon className="w-4 h-4 text-slate-400"/> {property.tipe?.join(', ') || 'Unit'}
              </span>
                            <span
                                className="flex items-center gap-2 px-4 py-2 bg-white rounded-xl border border-slate-100 text-xs font-bold text-slate-600">
                <ArrowsPointingOutIcon className="w-4 h-4 text-slate-400"/> {property.landSize} m² Area
              </span>
                            <span
                                className="px-4 py-2 bg-emerald-50 text-emerald-600 rounded-xl text-[10px] font-black uppercase border border-emerald-100 tracking-wider">
                {property.category?.join(' / ')}
              </span>
                        </div>
                    </div>

                    <div className="bg-white p-6 rounded-[2.5rem] shadow-sm border border-slate-100 min-w-[320px]">
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Harga
                            Penawaran</p>
                        <h2 className="text-3xl font-black text-emerald-600 tracking-tighter">
                            Rp {property.price?.toLocaleString('id-ID')}
                        </h2>
                        <button
                            onClick={() => handleProtectedAction('menghubungi agen')}
                            className="w-full mt-5 bg-emerald-500 hover:bg-emerald-600 text-white py-4 rounded-2xl font-bold shadow-lg shadow-emerald-100 transition-all flex items-center justify-center gap-3 active:scale-95"
                        >
                            Hubungi Agen <ArrowTopRightOnSquareIcon className="w-5 h-5"/>
                        </button>
                    </div>
                </div>

                {/* SECTION 2: GALLERY & DESCRIPTION */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 mb-10">
                    <div
                        className="lg:col-span-5 h-[450px] rounded-[3rem] overflow-hidden shadow-2xl border-8 border-white group relative">
                        <img
                            src={property.image}
                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                            alt={property.title}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/40 to-transparent"></div>
                    </div>

                    <div
                        className="lg:col-span-7 bg-white p-10 rounded-[3rem] shadow-sm border border-slate-100 flex flex-col justify-between">
                        <div>
                            <h3 className="text-2xl font-black text-slate-900 mb-6 tracking-tight">Informasi Unit &
                                Deskripsi</h3>
                            <p className="text-slate-500 leading-relaxed text-sm">
                                {property.description || "Unit properti eksklusif yang terletak di kawasan berkembang. Menawarkan kenyamanan maksimal dengan desain interior modern dan sirkulasi udara yang baik. Sangat cocok untuk keluarga baru maupun investasi jangka panjang."}
                            </p>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 pt-10 mt-10 border-t border-slate-50">
                            <div className="space-y-1">
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Luas
                                    Tanah</p>
                                <p className="text-lg font-bold text-slate-900">{property.landSize} m²</p>
                            </div>
                            <div className="space-y-1">
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Tipe
                                    Bangunan</p>
                                <p className="text-lg font-bold text-slate-900">{property.size_type?.join(', ') || '-'}</p>
                            </div>
                            <div className="space-y-1">
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Kategori</p>
                                <p className="text-lg font-bold text-slate-900">{property.category?.[0] || '-'}</p>
                            </div>
                            <div className="space-y-1 text-right">
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Status</p>
                                <p className="text-lg font-bold text-emerald-600">Available</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* SECTION 3: AGENT & MAP */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">

                    <div className="lg:col-span-4 space-y-8">
                        {/* Agent Details Card */}
                        <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100">
                            <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-6">Agent
                                Details</h4>
                            <div className="flex items-center gap-4 mb-8">
                                <div
                                    className="w-16 h-16 bg-slate-100 rounded-2xl overflow-hidden border-2 border-white shadow-sm">
                                    <img src="https://i.pravatar.cc/150?img=52" className="w-full h-full object-cover"
                                         alt="Agent"/>
                                </div>
                                <div>
                                    <h5 className="font-bold text-slate-900 text-lg">Yuan</h5>
                                    <p className="text-xs text-slate-400 font-medium">Spesialis Properti</p>
                                </div>
                            </div>
                            <button
                                onClick={() => handleProtectedAction('menghubungi agen')}
                                className="w-full bg-slate-900 text-white py-4 rounded-2xl font-bold text-sm hover:bg-slate-800 transition-all flex items-center justify-center gap-2"
                            >
                                <PhoneIcon className="w-5 h-5 text-emerald-400"/> Chat WhatsApp
                            </button>
                        </div>

                        {/* Inspection Card */}
                        <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100">
                            <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4">Inspection
                                Times</h4>
                            <p className="text-sm text-slate-500 mb-6">Tersedia jadwal kunjungan lapangan:</p>
                            <div
                                className="text-emerald-600 font-black text-sm mb-8 bg-emerald-50 p-4 rounded-2xl border border-emerald-100 text-center uppercase tracking-wider">
                                Sabtu, 14 Mei | 10:00 WIB
                            </div>
                            <button
                                onClick={() => handleProtectedAction('menambahkan jadwal')}
                                className="w-full border-2 border-slate-100 text-slate-600 py-4 rounded-2xl font-bold text-sm hover:bg-slate-50 transition-all flex items-center justify-center gap-2"
                            >
                                <CalendarDaysIcon className="w-5 h-5"/> Add to Calendar
                            </button>
                        </div>
                    </div>

                    {/* Map Section */}
                    <div
                        className="lg:col-span-8 bg-white p-4 rounded-[2.5rem] shadow-sm border border-slate-100 h-[500px] relative z-0">
                        <MapContainer
                            center={[lat, lng]}
                            zoom={15}
                            className="w-full h-full rounded-[2rem] z-0"
                        >
                            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"/>
                            <Marker position={[lat, lng]}/>
                        </MapContainer>

                        {/* Floating Map Actions */}
                        <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 flex gap-4 z-[400]">
                            <button
                                className="bg-white/95 backdrop-blur-md px-6 py-3 rounded-full shadow-2xl text-xs font-black text-slate-700 hover:text-emerald-600 transition-all border border-white">
                                STREET VIEW
                            </button>
                            <button
                                className="bg-emerald-500 px-6 py-3 rounded-full shadow-2xl text-xs font-black text-white hover:bg-emerald-600 transition-all">
                                DIRECTIONS
                            </button>
                        </div>
                    </div>

                </div>
            </div>

            {/* ========================================= */}
            {/* CUSTOM MODAL UNTUK AKSES LOGIN DIBATASI */}
            {/* ========================================= */}
            {isModalOpen && (
                <div
                    className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm transition-opacity">
                    <div
                        className="bg-white rounded-[2.5rem] p-8 md:p-10 max-w-md w-full shadow-2xl transform scale-100 transition-transform">

                        <div
                            className="w-20 h-20 bg-rose-50 text-rose-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner border border-rose-100">
                            <LockClosedIcon className="w-10 h-10" />
                        </div>

                        <h3 className="text-2xl font-black text-center text-slate-900 mb-3 tracking-tight">
                            Akses Dibatasi
                        </h3>
                        <p className="text-center text-slate-500 mb-8 text-sm leading-relaxed">
                            Fitur <span className="font-bold text-slate-700">{modalFeature}</span> hanya tersedia untuk pengguna terdaftar. Silakan login atau daftar akun untuk melanjutkan.
                        </p>

                        <div className="flex flex-col sm:flex-row gap-3">
                            <button
                                onClick={() => setIsModalOpen(false)}
                                className="flex-1 py-4 rounded-2xl font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 transition-all text-sm"
                            >
                                Nanti Saja
                            </button>
                            <button
                                onClick={() => navigate('/login')}
                                className="flex-1 py-4 rounded-2xl font-bold text-white bg-emerald-500 hover:bg-emerald-600 shadow-lg shadow-emerald-200 transition-all text-sm"
                            >
                                Login Sekarang
                            </button>
                        </div>

                    </div>
                </div>
            )}
            {/* ========================================= */}

        </div>
    );
};

export default PropertyDetail;
