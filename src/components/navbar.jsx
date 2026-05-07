import { Link, useNavigate } from 'react-router-dom';
import { auth } from '../firebase/config'; // Pastikan path ini benar
import { signOut, onAuthStateChanged } from 'firebase/auth';
import { useEffect, useState } from 'react';

const Navbar = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const ADMIN_EMAIL = "vjivandro77@gmail.com";

  // Memantau status login secara real-time
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe(); // Cleanup
  }, []);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate('/login');
    } catch (error) {
      console.error("Logout gagal:", error);
    }
  };

  const isAdmin = user?.email === ADMIN_EMAIL;

  return (
    // Memastikan Navbar berada di paling atas, full width, dan menggunakan flexbox
    <nav className="bg-white/80 backdrop-blur-md shadow-sm sticky top-0 z-50 border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
        {/* LOGO */}
        <Link to="/" className="text-2xl font-black text-emerald-950 tracking-tighter flex items-center gap-1">
          <svg className="w-7 h-7 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"></path></svg>
          RumahIn
        </Link>

        {/* MENU JIKA USER LOGIN/ADMIN */}
        <div className="flex items-center gap-2 md:gap-4 font-semibold text-gray-700 text-sm">
          {isAdmin && (
            <Link
              to="/admin/add"
              className="text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-full hover:bg-emerald-100 transition"
            >
              + Tambah Properti
            </Link>
          )}

          {user ? (
            <div className="flex items-center gap-3">
              <span className="text-xs text-gray-400 hidden md:block">{user.email}</span>
              <button
                onClick={handleLogout}
                className="bg-gray-800 text-white px-5 py-2 rounded-xl text-xs hover:bg-gray-700 transition shadow-sm"
              >
                Logout
              </button>
            </div>
          ) : (
            <Link
              to="/login"
              className="bg-emerald-950 text-white px-6 py-2.5 rounded-xl text-xs hover:bg-emerald-800 transition shadow-md"
            >
              Login
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
