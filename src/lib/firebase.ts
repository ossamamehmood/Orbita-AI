import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import firebaseConfig from '@/firebase-applet-config.json';

let app;
let auth: any;
let db: any;
const googleProvider = new GoogleAuthProvider();

if (firebaseConfig && firebaseConfig.apiKey) {
  app = initializeApp(firebaseConfig);
  auth = getAuth(app);
  db = getFirestore(app);
} else {
  console.warn("Firebase API Key is missing. Please complete the Firebase setup.");
}

export { app, auth, db, googleProvider };

export const signInWithGoogle = () => {
  if (!auth) {
    throw new Error("Firebase Auth not initialized. Check your configuration.");
  }
  return signInWithPopup(auth, googleProvider);
};
