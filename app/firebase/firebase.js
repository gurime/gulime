import { initializeApp } from "firebase/app";
import {getFirestore} from 'firebase/firestore'
import { getAuth } from 'firebase/auth';




const firebaseConfig = {
    apiKey: "AIzaSyBV5EoulFpeurXg5l6mrwYDTzu5wQjY_-0",
    authDomain: "gulime.firebaseapp.com",
    projectId: "gulime",
    storageBucket: "gulime.appspot.com",
    messagingSenderId: "761074487006",
    appId: "1:761074487006:web:84c2cb0f4e55694520bc4f"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

export { db, auth };