import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { signInWithEmailAndPassword, signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { auth } from '../../firebase/config'; // Pastikan path ini sesuai
import { ArrowLeftIcon } from '@heroicons/react/24/outline';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Fungsi Login dengan Email & Password
  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate('/admin'); // Arahkan ke dashboard admin jika sukses
    } catch (err) {
      console.error(err);
      setError('Email atau password salah. Silakan coba lagi.');
    } finally {
      setLoading(false);
    }
  };

  // Fungsi Login dengan Google
  const handleGoogleLogin = async () => {
    setError('');
    const provider = new GoogleAuthProvider();

    try {
      await signInWithPopup(auth, provider);
      navigate('/admin'); // Arahkan ke dashboard admin
    } catch (err) {
      console.error(err);
      setError('Gagal login dengan Google.');
    }
  };

  return (
      <div className="min-h-screen bg-[#f8fafc] flex items-center justify-center relative px-4">

        {/* TOMBOL KEMBALI KE BERANDA */}
        <Link
            to="/"
            className="absolute top-6 left-6 md:top-10 md:left-10 flex items-center gap-2 text-slate-500 hover:text-blue-600 transition-all font-semibold text-sm bg-white px-5 py-2.5 rounded-full shadow-sm hover:shadow-md border border-slate-200"
        >
          <ArrowLeftIcon className="w-4 h-4" />
          Kembali ke Beranda
        </Link>

        {/* KARTU LOGIN */}
        <div className="bg-white p-8 md:p-10 rounded-2xl shadow-[0_2px_10px_-3px_rgba(6,81,237,0.1)] border border-slate-100 w-full max-w-[420px]">
          <h2 className="text-2xl font-bold text-center text-slate-900 mb-8">Login</h2>

          {/* Pesan Error */}
          {error && (
              <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm text-center mb-6 border border-red-100">
                {error}
              </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="vjivandro77@gmail.com"
                  className="w-full bg-[#f1f5f9] border border-slate-300 text-slate-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-3.5 outline-none transition-colors"
              />
            </div>
            <div>
              <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-[#f1f5f9] border border-slate-300 text-slate-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-3.5 outline-none transition-colors tracking-widest"
              />
            </div>

            <button
                type="submit"
                disabled={loading}
                className="w-full text-white bg-[#3b82f6] hover:bg-blue-700 focus:ring-4 focus:outline-none focus:ring-blue-300 font-bold rounded-lg text-sm px-5 py-3.5 text-center mt-2 transition-colors disabled:bg-blue-300"
            >
              {loading ? 'Memproses...' : 'Masuk'}
            </button>
          </form>

          {/* GARIS PEMISAH */}
          <div className="flex items-center my-6">
            <div className="flex-1 border-t border-slate-200"></div>
            <span className="px-4 text-xs text-slate-400 font-medium">Atau</span>
            <div className="flex-1 border-t border-slate-200"></div>
          </div>

          {/* TOMBOL GOOGLE */}
          <button
              type="button"
              onClick={handleGoogleLogin}
              className="w-full flex items-center justify-center gap-3 text-slate-700 bg-white border border-slate-300 hover:bg-slate-50 focus:ring-4 focus:outline-none focus:ring-slate-100 font-semibold rounded-lg text-sm px-5 py-3 text-center transition-colors shadow-sm"
          >
            {/* Logo Google SVG */}
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
            </svg>
            Masuk dengan Google
          </button>
        </div>
      </div>
  );
};

export default Login;
