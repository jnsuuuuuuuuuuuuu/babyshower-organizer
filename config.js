<script type="module">
  // Import the functions you need from the SDKs you need
  import { initializeApp } from "https://www.gstatic.com/firebasejs/12.12.1/firebase-app.js";
  import { getAnalytics } from "https://www.gstatic.com/firebasejs/12.12.1/firebase-analytics.js";
  // TODO: Add SDKs for Firebase products that you want to use
  // https://firebase.google.com/docs/web/setup#available-libraries

  // Your web app's Firebase configuration
  // For Firebase JS SDK v7.20.0 and later, measurementId is optional
  const firebaseConfig = {
    apiKey: "AIzaSyDdLV2Bh5xuo0Bo7UPPhr7Sy7CqD1q9EJM",
    authDomain: "babyshower-organizer.firebaseapp.com",
    databaseURL: "https://babyshower-organizer-default-rtdb.firebaseio.com",
    projectId: "babyshower-organizer",
    storageBucket: "babyshower-organizer.firebasestorage.app",
    messagingSenderId: "546416367820",
    appId: "1:546416367820:web:c0d8d407e1bf23a95f0a69",
    measurementId: "G-NC83K2ZQG5"
  };

  // Initialize Firebase
  const app = initializeApp(firebaseConfig);
  const analytics = getAnalytics(app);
</script>