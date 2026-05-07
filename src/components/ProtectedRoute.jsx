import { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../firebase/config';

const ProtectedRoute = ({ children, isAdminOnly = false }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const ADMIN_EMAIL = "vjivandro77@gmail.com";

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  if (loading) return <div className="text-center mt-20">Loading...</div>;

  if (!user) return <Navigate to="/login" />;

  if (isAdminOnly && user.email !== ADMIN_EMAIL) {
    return <Navigate to="/" />;
  }

  return children;
};

export default ProtectedRoute;