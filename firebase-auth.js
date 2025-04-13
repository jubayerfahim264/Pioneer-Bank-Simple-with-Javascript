// firebase-auth.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-app.js";
import {
  getAuth,
  createUserWithEmailAndPassword,
  sendEmailVerification,
  signInWithEmailAndPassword,
  signOut,
} from "https://www.gstatic.com/firebasejs/10.8.1/firebase-auth.js";
import {
  getDatabase,
  ref,
  set,
} from "https://www.gstatic.com/firebasejs/10.8.1/firebase-database.js";
import {
  getStorage,
  ref as sRef,
  uploadBytes,
  getDownloadURL,
} from "https://www.gstatic.com/firebasejs/10.8.1/firebase-storage.js";

// 🟡 Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyCfTJ6fanx0ztoaLnK0XeVr6U-TRKXU2E0",
  authDomain: "pioneer-bank-simple.firebaseapp.com",
  databaseURL: "https://pioneer-bank-simple-default-rtdb.firebaseio.com",
  projectId: "pioneer-bank-simple",
  storageBucket: "pioneer-bank-simple.appspot.com",
  messagingSenderId: "1046986770247",
  appId: "1:1046986770247:web:fa704d0ae8c9c51f102e62",
  measurementId: "G-4FVK0RHHZL",
};

// ✅ Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getDatabase(app);
const storage = getStorage(app);
const dbRef = ref(db);

// ✅ Signup Handler

document.getElementById("signup-form").addEventListener("submit", async (e) => {
  e.preventDefault();

  const name = document.getElementById("full-name").value.trim();
  const phone = document.getElementById("phone").value.trim();
  const dob = document.getElementById("dob").value;
  const email = document.getElementById("email").value.trim();
  const pw = document.getElementById("pw").value;
  const gender = document.querySelector('input[name="gender"]:checked').value;
  const address = document.getElementById("address").value.trim();
  const country = document.getElementById("country").value;
  const city = document.getElementById("city").value.trim();
  const fileInput = document.getElementById("profileImage");
  const file = fileInput?.files[0];

  try {
    const userCred = await createUserWithEmailAndPassword(auth, email, pw);
    const user = userCred.user;

    await sendEmailVerification(user);
    alert("✅ Signup successful! Verification email sent.");

    // ✅ User info save with role, online status
    await set(ref(db, "users/" + user.uid), {
      name,
      phone,
      dob,
      email,
      pw,
      gender,
      address,
      country,
      city,
      role: "user", // or 'admin'
      online: true,
    });

    document.getElementById("signup-form").reset();
  } catch (error) {
    console.error(error);
    alert("❌ Signup error: " + error.message);
  }
});

// ✅ Login Handler

document.getElementById("login-form").addEventListener("submit", async (e) => {
  e.preventDefault();

  const email = document.getElementById("login-email").value.trim();
  const password = document.getElementById("login-password").value;

  try {
    const userCred = await signInWithEmailAndPassword(auth, email, password);
    const user = userCred.user;

    if (!user.emailVerified) {
      alert("⚠️ Please verify your email before logging in.");
      await signOut(auth);
      return;
    }

    // ✅ Update status
    await set(ref(db, "users/" + user.uid + "/online"), true);

    // ✅ Redirect to dashboard.html
    window.location.href = "dashboard.html";
  } catch (error) {
    console.error(error);
    alert("❌ Login error: " + error.message);
  }
});
