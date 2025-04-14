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
function showToast(message, type = "success") {
  const toast = document.getElementById("toast");
  const toastMessage = document.getElementById("toast-message");
  const toastBar = document.getElementById("toast-bar");
  const toastIcon = document.getElementById("toast-icon");

  const icons = {
    success: "✅",
    error: "❌",
    warning: "⚠️",
    info: "ℹ️",
  };

  toastMessage.textContent = message;
  toastIcon.textContent = icons[type] || "ℹ️";

  toast.className = `toast-alert toast-${type}`;
  toast.style.display = "flex";

  // Reset animation
  toastBar.style.animation = "none";
  void toastBar.offsetWidth;
  toastBar.style.animation = "shrinkBar 3s linear forwards";

  setTimeout(() => {
    toast.style.display = "none";
  }, 3000);
}

// ✅ Signup Handler

document.getElementById("signup-form").addEventListener("submit", async (e) => {
  e.preventDefault();

  const name = document.getElementById("full-name").value.trim();
  const phone = document.getElementById("phone").value.trim();
  const dob = document.getElementById("dob").value;
  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("pw").value;
  const gender = document.querySelector('input[name="gender"]:checked').value;
  const address = document.getElementById("address").value.trim();
  const country = document.getElementById("country").value;
  const city = document.getElementById("city").value.trim();

  try {
    const userCred = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );
    const user = userCred.user;

    await sendEmailVerification(user);
    showToast("Signup successful! Verification email sent.");

    // ✅ User info save with role, online status
    await set(ref(db, "users/" + user.uid), {
      name,
      phone,
      dob,
      email,
      password,
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
    showToast("Signup error: " + error.message);
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
      showToast("⚠️ Please verify your email.");
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
