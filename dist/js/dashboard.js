import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-app.js";
import {
  getAuth,
  onAuthStateChanged,
  signOut,
} from "https://www.gstatic.com/firebasejs/10.8.1/firebase-auth.js";
import {
  getDatabase,
  ref,
  get,
  child,
  update,
} from "https://www.gstatic.com/firebasejs/10.8.1/firebase-database.js";
// =============USER INFO SHOW HIDE=================//
let userInfo = document.getElementById("user-info");
document.getElementById("checkbox").addEventListener("click", () => {
  userInfo.classList.toggle("show");
});

//============FIREBASE CONFIG=================//
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
const dbRef = ref(db);

// Check user auth state
onAuthStateChanged(auth, async (user) => {
  if (user && user.emailVerified) {
    await update(ref(db, "users/" + user.uid), { online: true });

    const snapshot = await get(child(dbRef, `users/${user.uid}`));
    if (snapshot.exists()) {
      const data = snapshot.val();
      document.getElementById("user-name").textContent = data.name;
      document.getElementById("user-email").textContent = data.email;

      const statusDot = document.getElementById("user-status");
      if (data.online) {
        statusDot.style.backgroundColor = "green";
      } else {
        statusDot.style.backgroundColor = "red";
      }
    }
  } else {
    window.location.href = "index.html";
  }
});

document.getElementById("logout").addEventListener("click", async () => {
  const user = auth.currentUser;
  if (user) {
    await update(ref(db, "users/" + user.uid), { online: false });
    await signOut(auth);
    window.location.href = "index.html";
  }
});
