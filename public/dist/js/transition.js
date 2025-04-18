// Firebase Config
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-app.js";
import {
  getAuth,
  onAuthStateChanged,
} from "https://www.gstatic.com/firebasejs/10.8.1/firebase-auth.js";
import {
  getDatabase,
  ref,
  get,
  set,
  update,
} from "https://www.gstatic.com/firebasejs/10.8.1/firebase-database.js";

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

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getDatabase(app);

// Format Number
function formatNumber(num) {
  if (num >= 1e33) return (num / 1e33).toFixed(1) + "D"; // Decillion
  if (num >= 1e30) return (num / 1e30).toFixed(1) + "N"; // Nonillion
  if (num >= 1e27) return (num / 1e27).toFixed(1) + "Oc"; // Octillion
  if (num >= 1e24) return (num / 1e24).toFixed(1) + "Sp"; // Septillion
  if (num >= 1e21) return (num / 1e21).toFixed(1) + "Sx"; // Sextillion
  if (num >= 1e18) return (num / 1e18).toFixed(1) + "Qi"; // Quintillion
  if (num >= 1e15) return (num / 1e15).toFixed(1) + "Q"; // Quadrillion
  if (num >= 1e12) return (num / 1e12).toFixed(1) + "T";
  if (num >= 1e9) return (num / 1e9).toFixed(1) + "B";
  if (num >= 1e6) return (num / 1e6).toFixed(1) + "M";
  if (num >= 1e3) return (num / 1e3).toFixed(1) + "K";
  return num.toString();
}

// Toast Function
function showToast(message, type = "success") {
  const toast = document.getElementById("toast");
  const toastMessage = document.getElementById("toast-message");
  const toastBar = document.getElementById("toast-bar");
  const toastIcon = document.getElementById("toast-icon");

  const icons = {
    success: "✅",
    error: "❌",
    info: "ℹ️",
    warning: "⚠️",
  };

  toastMessage.textContent = message;
  toastIcon.textContent = icons[type] || "ℹ️";

  toast.className = `toast-alert toast-${type}`;
  toast.style.display = "flex";

  toastBar.style.animation = "none";
  void toastBar.offsetWidth;
  toastBar.style.animation = "shrinkBar 3s linear forwards";

  setTimeout(() => {
    toast.style.display = "none";
  }, 3000);
}
//load user data
const loadUserData = async (uid) => {
  const userRef = ref(db, `transactions/${uid}`);
  const snapshot = await get(userRef);

  if (snapshot.exists()) {
    const data = snapshot.val();
    document.getElementById("depositeAmount").innerText = formatNumber(
      data.deposite || 0
    );
    document.getElementById("withdrawAmount").innerText = formatNumber(
      data.withdraw || 0
    );
    document.getElementById("balanceAmount").innerText = formatNumber(
      data.balance || 0
    );
  } else {
    await set(userRef, {
      deposite: 0,
      withdraw: 0,
      balance: 0,
    });
  }
};

// Deposit
document.getElementById("depositeBtn").addEventListener("click", async (e) => {
  e.preventDefault();
  const amount = parseFloat(document.getElementById("addDeposite").value);
  if (amount <= 0 || isNaN(amount)) {
    return showToast("Please enter a amount!", "error");
  }

  const user = auth.currentUser;
  if (!user) return showToast("Please login first!", "warning");

  const userRef = ref(db, `transactions/${user.uid}`);
  const snapshot = await get(userRef);
  const data = snapshot.val();

  const newDeposite = (data?.deposite || 0) + amount;
  const newBalance = (data?.balance || 0) + amount;

  await update(userRef, {
    deposite: newDeposite,
    balance: newBalance,
  });

  showToast("Deposit Successful", "success");
  loadUserData(user.uid);
  document.getElementById("addDeposite").value = "";
});

// Withdraw
document.getElementById("withdrawBtn").addEventListener("click", async (e) => {
  e.preventDefault();
  const amount = parseFloat(document.getElementById("addWithdraw").value);
  if (amount <= 0 || isNaN(amount)) {
    return showToast("Please enter a valid withdrawal amount!", "error");
  }

  const user = auth.currentUser;
  if (!user) return showToast("Please login first!", "warning");

  const userRef = ref(db, `transactions/${user.uid}`);
  const snapshot = await get(userRef);
  const data = snapshot.val();

  if (!data || amount > data.balance) {
    return showToast("Invalid or insufficient balance!", "error");
  }

  const newWithdraw = (data?.withdraw || 0) + amount;
  const newBalance = data.balance - amount;

  await update(userRef, {
    withdraw: newWithdraw,
    balance: newBalance,
  });

  showToast("Withdraw Successful", "success");
  loadUserData(user.uid);
  document.getElementById("addWithdraw").value = "";
});

// Auth Check
onAuthStateChanged(auth, (user) => {
  if (user && user.emailVerified) {
    loadUserData(user.uid);
  } else {
    window.location.href = "index.html";
  }
});
