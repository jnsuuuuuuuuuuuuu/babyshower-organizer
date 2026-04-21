// Firebase Configuration
var firebaseConfig = {
  apiKey: "AIzaSyDdLV2Bh5xuo0Bo7UPPhr7Sy7CqD1q9EJM",
  authDomain: "babyshower-organizer.firebaseapp.com",
  databaseURL: "https://babyshower-organizer-default-rtdb.firebaseio.com",
  projectId: "babyshower-organizer",
  storageBucket: "babyshower-organizer.firebasestorage.app",
  messagingSenderId: "546416367820",
  appId: "1:546416367820:web:c0d8d407e1bf23a95f0a69"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
window.db = firebase.database();

console.log('✓ Firebase Config Loaded');