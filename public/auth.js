// Login / signup / logout. Talks to POST /api/login and POST /api/signup (users table in Supabase).
const authScreen = document.getElementById("auth-screen");
const appScreen = document.getElementById("app-screen");
const loginForm = document.getElementById("login-form");
const signupForm = document.getElementById("signup-form");
const loginMessage = document.getElementById("login-message");
const signupMessage = document.getElementById("signup-message");

function saveUser(user) {
  try { localStorage.setItem("snoopysnack-user", JSON.stringify(user)); } catch { /* storage unavailable */ }
}
function loadUser() {
  try { return JSON.parse(localStorage.getItem("snoopysnack-user")); } catch { return null; }
}
function clearUser() {
  try { localStorage.removeItem("snoopysnack-user"); } catch { /* storage unavailable */ }
}

function showStore(user) {
  authScreen.classList.add("hidden");
  appScreen.classList.remove("hidden");
  document.getElementById("welcome-title").textContent = `Welcome, ${user.username}!`;
}

function showAuth() {
  appScreen.classList.add("hidden");
  authScreen.classList.remove("hidden");
}

async function submitAuth(url, form, messageEl) {
  messageEl.textContent = "";
  const body = {
    username: form.elements.username.value,
    password: form.elements.password.value,
  };
  try {
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    const data = await res.json();
    if (!res.ok) {
      messageEl.textContent = data.error || "Something went wrong.";
      return;
    }
    saveUser(data.user);
    form.reset();
    showStore(data.user);
  } catch {
    messageEl.textContent = "Could not reach the server.";
  }
}

loginForm.addEventListener("submit", (e) => {
  e.preventDefault();
  submitAuth("/api/login", loginForm, loginMessage);
});

signupForm.addEventListener("submit", (e) => {
  e.preventDefault();
  submitAuth("/api/signup", signupForm, signupMessage);
});

document.getElementById("show-signup").addEventListener("click", () => {
  loginForm.classList.add("hidden");
  signupForm.classList.remove("hidden");
  document.querySelector(".auth-switch").classList.add("hidden");
});

document.getElementById("show-login").addEventListener("click", () => {
  signupForm.classList.add("hidden");
  loginForm.classList.remove("hidden");
  document.querySelector(".auth-switch").classList.remove("hidden");
});

document.querySelectorAll(".password-toggle").forEach((btn) =>
  btn.addEventListener("click", () => {
    const input = document.getElementById(btn.dataset.target);
    const show = input.type === "password";
    input.type = show ? "text" : "password";
    btn.textContent = show ? "Hide" : "Show";
  }));

document.getElementById("logout-button").addEventListener("click", () => {
  clearUser();
  showAuth();
});

const existing = loadUser();
if (existing) showStore(existing);
