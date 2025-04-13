const loginBtn = document.getElementById("login");
const signupBtn = document.getElementById("sign-up");

loginBtn?.addEventListener("click", (e) => {
  e.preventDefault();
  document.querySelector(".sign-up").classList.add("d-none");
  document.querySelector(".login").classList.remove("d-none");
});

signupBtn?.addEventListener("click", (e) => {
  e.preventDefault();
  document.querySelector(".login").classList.add("d-none");
  document.querySelector(".sign-up").classList.remove("d-none");
});

// Changing sing up to login code end//
