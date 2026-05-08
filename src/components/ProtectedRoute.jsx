import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../firebase/config';
import { ADMIN_EMAILS } from '../firebase/auth'; // 1. Import array admin dari auth.js

const ProtectedRoute = ({ children, isAdminOnly = false }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  if (!user) {
    // Jika belum login sama sekali, lempar ke login
    return <Navigate to="/login" replace />;
  }

  if (isAdminOnly) {
    // 2. Gunakan .includes() untuk mengecek apakah email user ada di daftar ADMIN_EMAILS
    const isAdmin = ADMIN_EMAILS.includes(user.email);

    if (!isAdmin) {
      // Jika sudah login tapi BUKAN admin, lempar ke halaman utama
      return <Navigate to="/" replace />;
    }
  }

  // Jika lolos semua pengecekan, tampilkan halaman admin
  return children;
};

export default ProtectedRoute;
