// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCCusfI6l64CVy9vnYJjLQl3WbF-0Et_-M",
  authDomain: "askmedi-e6fc2.firebaseapp.com",
  projectId: "askmedi-e6fc2",
  storageBucket: "askmedi-e6fc2.firebasestorage.app",
  messagingSenderId: "967403240447",
  appId: "1:967403240447:web:e1c6e763f3e84628c845ca",
  measurementId: "G-1035YCZXGS"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const db = getFirestore(app);

export {db};

