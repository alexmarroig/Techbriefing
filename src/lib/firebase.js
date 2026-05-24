import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDzTAg_8vtl75T6DYus-MZ3fxjUzYyFWBk",
  authDomain: "techbriefing-11b23.firebaseapp.com",
  projectId: "techbriefing-11b23",
  storageBucket: "techbriefing-11b23.firebasestorage.app",
  messagingSenderId: "837760935054",
  appId: "1:837760935054:web:0951229cc4250d1d3995df",
  measurementId: "G-YZXWND1V34"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
