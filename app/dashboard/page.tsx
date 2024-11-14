"use client"
import { useSearchParams } from "next/navigation";
import { useEffect } from "react";
// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
//import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: process.env.F_API_KEY,
  authDomain: "clutch-santa.firebaseapp.com",
  projectId: "clutch-santa",
  storageBucket: "clutch-santa.firebasestorage.app",
  messagingSenderId: "665585861215",
  appId: "1:665585861215:web:6fe69c970d6b6bc15051ea",
  measurementId: "G-22C5P4372J"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
//const analytics = getAnalytics(app);


export default function Dashboard(){
    const searchParams = useSearchParams();
    const isJoining = searchParams.get('isJoining');

    async function upSanta(){
        "use server"

        
    }

    useEffect(() => {

    }, [])

    return(
        <div  className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
             <div>Dashboard</div>
             <div> You selected: {isJoining}</div>
        </div>
    )
}