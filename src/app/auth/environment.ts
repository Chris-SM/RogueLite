
import { initializeApp } from "firebase/app";

export const firebaseConfig = {
  apiKey: "AIzaSyCpVKYnOKOBzzVP4UXrVAoiFT1usMc8lIE",
  authDomain: "roguelite-1.firebaseapp.com",
  databaseURL: "https://roguelite-1-default-rtdb.firebaseio.com",
  projectId: "roguelite-1",
  storageBucket: "roguelite-1.firebasestorage.app",
  messagingSenderId: "53363983964",
  appId: "1:53363983964:web:72c47983bf1710929d4899"
};


const app = initializeApp(firebaseConfig);