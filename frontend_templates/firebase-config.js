// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDemoKeyForQuantumRadioDashboard",
  authDomain: "quantum-radio-dashboard.firebaseapp.com",
  projectId: "quantum-radio-dashboard",
  storageBucket: "quantum-radio-dashboard.appspot.com",
  messagingSenderId: "123456789012",
  appId: "1:123456789012:web:abc123def456ghi789jkl",
  databaseURL: "https://quantum-radio-dashboard-default-rtdb.firebaseio.com"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

// Initialize services
const auth = firebase.auth();
const db = firebase.database();

// Export for use in other files
window.db = db;
window.auth = auth; 