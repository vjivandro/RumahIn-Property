import React, { useState } from 'react';
import { db } from '../../firebase/config';
import { collection, addDoc, GeoPoint, serverTimestamp } from 'firebase/firestore';
import { Link } from 'react-router-dom';

// Import Leaflet untuk peta interaktif
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Perbaikan ikon marker Leaflet yang sering tidak muncul di React
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

const DefaultIcon = L.icon({
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41]
});
L.Marker.prototype.options.icon = DefaultIcon;

// Komponen Helper untuk menangani interaksi klik pada peta
// Dideklarasikan di luar agar tidak dibuat ulang setiap render
const LocationMarker = ({ setFormData, setPosition, position }) => {
  useMapEvents({
    click(e) {
      const { lat, lng } = e.latlng;
      setPosition(e.latlng); // Menampilkan marker di titik klik
      setFormData((prev) => ({
        ...prev,
        lat: lat.toFixed(6), // Mengambil 6 angka di belakang koma
        lng: lng.toFixed(6)
      }));
    },
  });

  return position === null ? null : <Marker position={position} />;
};

const AddProperty = () => {
  const [loading, setLoading] = useState(false);
  const [position, setPosition] = useState(null); // State untuk posisi marker di peta
  const [formData, setFormData] = useState({
    title: '',
    address: '',
    description: '',
    price: '',
    landSize: '',
    lat: '',
    lng: '',
    category: [],
    tipe: [],
    size_type: [],
    image: ''
  });

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({ ...formData, image: reader.result }); // Konversi gambar ke Base64
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCheckbox = (e, field) => {
    const { value, checked } = e.target;
    const currentArray = formData[field];
    if (checked) {
      setFormData({ ...formData, [field]: [...currentArray, value] });
    } else {
      setFormData({ ...formData, [field]: currentArray.filter(item => item !== value) });
    }
  };

  // Fungsi untuk memformat angka menjadi format ribuan (Rupiah)
  const formatRupiah = (value) => {
    // Hapus semua karakter selain angka
    const numberString = value.replace(/[^,\d]/g, '').toString();
    const split = numberString.split(',');
    const sisa = split[0].length % 3;
    let rupiah = split[0].substr(0, sisa);
    const ribuan = split[0].substr(sisa).match(/\d{3}/gi);

    if (ribuan) {
      const separator = sisa ? '.' : '';
      rupiah += separator + ribuan.join('.');
    }

    rupiah = split[1] !== undefined ? rupiah + ',' + split[1] : rupiah;
    return rupiah;
  };

  // Fungsi khusus untuk menangani perubahan input harga
  const handlePriceChange = (e) => {
    const formatted = formatRupiah(e.target.value);
    setFormData({ ...formData, price: formatted });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.image) return alert("Mohon unggah gambar properti");
    if (!formData.lat || !formData.lng) return alert("Mohon tandai lokasi pada peta");
    if (!formData.address) return alert("Mohon isi alamat lengkap");

    const cleanPrice = formData.price.replace(/\./g, '');

    setLoading(true);
    try {
      await addDoc(collection(db, "properties"), {
        title: formData.title,
        address: formData.address, // <--- PASTIKAN INI DIKIRIM
        description: formData.description,
        price: Number(cleanPrice),
        landSize: Number(formData.landSize),
        location: new GeoPoint(Number(formData.lat), Number(formData.lng)),
        category: formData.category,
        tipe: formData.tipe,
        size_type: formData.size_type,
        image: formData.image,
        createdAt: serverTimestamp()
      });

      alert("Properti Berhasil Ditambahkan!");

      // Reset form
      setFormData({
        title: '', address: '', description: '', price: '',
        landSize: '', lat: '', lng: '', category: [],
        tipe: [], size_type: [], image: ''
      });
      setPosition(null);
    } catch (error) {
      console.error(error);
      alert("Terjadi kesalahan saat menyimpan data.");
    } finally {
      setLoading(false);
    }
  };

  return (
      <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-gray-100 max-w-5xl mx-auto">
        <div className="flex justify-between items-center mb-10">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Add New Property</h2>
            <p className="text-sm text-gray-500">Isi detail unit properti dengan lengkap</p>
          </div>
          <Link to="/admin/properties" className="text-blue-600 font-semibold text-sm hover:underline">
            Back to List
          </Link>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Row 1: Title & Image */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-700 uppercase tracking-wider">Property Title</label>
              <input
                  type="text"
                  required
                  className="w-full bg-gray-50 border-none p-4 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none"
                  placeholder="Contoh: Rumah Minimalis Modern Cluster A"
                  value={formData.title}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-700 uppercase tracking-wider">Upload Photo</label>
              <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="block w-full text-sm text-gray-500 file:mr-4 file:py-3 file:px-4 file:rounded-xl file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
              />
              {formData.image &&
                  <img src={formData.image} className="h-32 mt-4 rounded-2xl border shadow-sm object-cover"
                       alt="Preview"/>}
            </div>
          </div>

          {/* Row 2: Category & Tipe */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="space-y-3">
              <label className="text-sm font-bold text-gray-700 uppercase tracking-wider">Category</label>
              <div className="flex gap-4">
                {['Subsidi', 'Komersil'].map(cat => (
                    <label key={cat} className="flex items-center gap-2 cursor-pointer bg-gray-50 px-4 py-2 rounded-xl">
                      <input type="checkbox" value={cat} checked={formData.category.includes(cat)}
                             onChange={(e) => handleCheckbox(e, 'category')} className="w-4 h-4 rounded text-blue-600"/>
                      <span className="text-sm font-medium">{cat}</span>
                    </label>
                ))}
              </div>
            </div>
            <div className="space-y-3">
              <label className="text-sm font-bold text-gray-700 uppercase tracking-wider">Type</label>
              <div className="flex gap-4">
                {['Rumah', 'Tanah'].map(t => (
                    <label key={t} className="flex items-center gap-2 cursor-pointer bg-gray-50 px-4 py-2 rounded-xl">
                      <input type="checkbox" value={t} checked={formData.tipe.includes(t)}
                             onChange={(e) => handleCheckbox(e, 'tipe')} className="w-4 h-4 rounded text-blue-600"/>
                      <span className="text-sm font-medium">{t}</span>
                    </label>
                ))}
              </div>
            </div>
            <div className="space-y-3">
              <label className="text-sm font-bold text-gray-700 uppercase tracking-wider">Size Type</label>
              <div className="flex gap-2">
                {['36', '45', '60'].map(sz => (
                    <label key={sz} className="flex items-center gap-2 cursor-pointer bg-gray-50 px-3 py-2 rounded-xl">
                      <input type="checkbox" value={sz} checked={formData.size_type.includes(sz)}
                             onChange={(e) => handleCheckbox(e, 'size_type')}
                             className="w-4 h-4 rounded text-blue-600"/>
                      <span className="text-sm font-medium">{sz}</span>
                    </label>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-bold text-gray-700 uppercase tracking-wider block">
              Alamat Lengkap
            </label>
            <textarea
                required
                rows="3"
                className="w-full bg-white border border-gray-100 p-4 rounded-2xl focus:ring-2 focus:ring-indigo-500 outline-none resize-none shadow-sm"
                placeholder="Contoh: Jl. PB Sudirman No. 00"
                value={formData.address}
                onChange={(e) => setFormData({...formData, address: e.target.value})}
            />
          </div>

          {/* Peta Interaktif */}
          <div className="space-y-2">
            <label className="text-sm font-bold text-gray-700 uppercase tracking-wider block">Pilih Lokasi di Peta (Klik
              pada Peta)</label>
            <div className="h-[350px] w-full rounded-3xl overflow-hidden border-2 border-gray-100 shadow-inner">
              <MapContainer
                  center={[-8.17, 113.70]} // Default Jember
                  zoom={13}
                  className="h-full w-full"
              >
                <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution='&copy; OpenStreetMap contributors'
                />
                <LocationMarker
                    setFormData={setFormData}
                    setPosition={setPosition}
                    position={position}
                />
              </MapContainer>
            </div>
          </div>

          {/* Row 3 & 4: Finance & Coordinates */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 items-end">
            <div className="md:col-span-1 space-y-2">
              <label className="text-sm font-bold text-gray-700 uppercase">Price (IDR)</label>
              <div className="relative">
                {/* Tambahkan prefix 'Rp' agar lebih jelas */}
                <span className="absolute left-4 top-4 text-gray-500 font-bold">Rp</span>
                <input
                    type="text" // Ubah jadi text
                    value={formData.price}
                    placeholder="150.000.000"
                    className="w-full bg-gray-50 py-4 pr-4 pl-12 rounded-2xl outline-none font-bold text-gray-800"
                    onChange={handlePriceChange} // Gunakan fungsi format
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-700 uppercase">Land Size (m²)</label>
              <input type="number" value={formData.landSize} placeholder="72"
                     className="w-full bg-gray-50 p-4 rounded-2xl outline-none"
                     onChange={(e) => setFormData({...formData, landSize: e.target.value})}/>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold text-blue-900 uppercase">Latitude</label>
              <input readOnly type="text" value={formData.lat} placeholder="Klik peta..."
                     className="w-full bg-blue-50 p-4 rounded-2xl outline-none font-bold text-blue-900 border border-blue-100"/>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold text-blue-900 uppercase">Longitude</label>
              <input readOnly type="text" value={formData.lng} placeholder="Klik peta..."
                     className="w-full bg-blue-50 p-4 rounded-2xl outline-none font-bold text-blue-900 border border-blue-100"/>
            </div>
          </div>

          <button
              disabled={loading}
              type="submit"
              className="w-full bg-emerald-950 text-white p-5 rounded-2xl font-bold hover:bg-emerald-800 transition-all shadow-lg disabled:bg-gray-300"
          >
            {loading ? 'Processing...' : 'Save Property'}
          </button>
        </form>
      </div>
  );
};

export default AddProperty;
