import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyDf-_WbtOVlfdT6DjOLkIpT3-42vlkiNJQ",
  authDomain: "ngchat-a35bd.firebaseapp.com",
  databaseURL: "https://ngchat-a35bd-default-rtdb.firebaseio.com",
  projectId: "ngchat-a35bd",
  storageBucket: "ngchat-a35bd.appspot.com",
  messagingSenderId: "578801562703",
  appId: "1:578801562703:web:2e40289330fe90a576a63a",
  measurementId: "G-ZN006SBK0L"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
