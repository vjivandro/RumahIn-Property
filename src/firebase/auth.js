import { auth } from './config';
import { 
  signInWithEmailAndPassword, 
  GoogleAuthProvider, 
  signInWithPopup,
  createUserWithEmailAndPassword 
} from 'firebase/auth';

// List email admin yang dihardcode sesuai permintaan
const ADMIN_EMAIL = "vjivandro77@gmail.com";

export const loginWithEmail = async (email, password) => {
  const userCredential = await signInWithEmailAndPassword(auth, email, password);
  return {
    user: userCredential.user,
    isAdmin: userCredential.user.email === ADMIN_EMAIL
  };
};

export const loginWithGoogle = async () => {
  const provider = new GoogleAuthProvider();
  const userCredential = await signInWithPopup(auth, provider);
  return {
    user: userCredential.user,
    isAdmin: userCredential.user.email === ADMIN_EMAIL
  };
};