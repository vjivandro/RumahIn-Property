// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDu5L7nOvXMNXI6drfbUgb33wR4BqAmlAg",
  authDomain: "rumahin-bc8e1.firebaseapp.com",
  projectId: "rumahin-bc8e1",
  storageBucket: "rumahin-bc8e1.firebasestorage.app",
  messagingSenderId: "166583778702",
  appId: "1:166583778702:web:95eef9e962681031d4f8df"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Ekspor layanan yang dibutuhkan
export const auth = getAuth(app);
export const db = getFirestore(app);