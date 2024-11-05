// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDuyiD2sb-P5SBIAU-Pqec3qK3D0TLSfFU",
  authDomain: "react-native-c2fe6.firebaseapp.com",
  projectId: "react-native-c2fe6",
  storageBucket: "react-native-c2fe6.firebasestorage.app",
  messagingSenderId: "973905639645",
  appId: "1:973905639645:web:eb86105dcca22899bf0334",
  measurementId: "G-15H6NVBVF0",
};

// Initialize Firebase

// if (firebase.apps.length === 0) {
//   app = firebase.initializeApp(firebaseConfig);
// } else {
//   app = firebase.app();
// }
const app = initializeApp(firebaseConfig);
const storage = getStorage(app);
const db = getFirestore(app);
const auth = getAuth(app);
export { auth, GoogleAuthProvider, db , storage };
