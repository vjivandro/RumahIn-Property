import { auth } from './config';
import {
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
} from 'firebase/auth';

// Ubah menjadi Array untuk menampung banyak email admin
export const ADMIN_EMAILS = [
  "vjivandro77@gmail.com",
  "yuan.hanky@gmail.com"
];

export const loginWithEmail = async (email, password) => {
  const userCredential = await signInWithEmailAndPassword(auth, email, password);
  return {
    user: userCredential.user,
    // Gunakan .includes() untuk mengecek apakah email ada di dalam array ADMIN_EMAILS
    isAdmin: ADMIN_EMAILS.includes(userCredential.user.email)
  };
};

export const loginWithGoogle = async () => {
  const provider = new GoogleAuthProvider();
  const userCredential = await signInWithPopup(auth, provider);
  return {
    user: userCredential.user,
    // Gunakan .includes() untuk mengecek apakah email ada di dalam array ADMIN_EMAILS
    isAdmin: ADMIN_EMAILS.includes(userCredential.user.email)
  };
};
