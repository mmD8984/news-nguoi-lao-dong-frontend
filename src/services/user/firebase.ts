import {initializeApp} from "firebase/app";
import {getAuth} from "firebase/auth";
import {getDatabase} from "firebase/database"

const firebaseConfig = {
    apiKey: "AIzaSyBHrqtjrabgJSr_LLUw3xZk88qlEBrsrbY",
    authDomain: "news-worker-5b218.firebaseapp.com",
    databaseURL: "https://news-worker-5b218-default-rtdb.asia-southeast1.firebasedatabase.app/",
    projectId: "news-worker-5b218",
    storageBucket: "news-worker-5b218.firebasestorage.app",
    messagingSenderId: "868555456950",
    appId: "1:868555456950:web:2703f2a43a7e11a286c117",
    measurementId: "G-YHQ56V89NN"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getDatabase(app);
