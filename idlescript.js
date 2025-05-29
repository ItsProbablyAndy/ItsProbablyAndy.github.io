const supabase = supabase.createClient(
  "https://wchvlgszdsmffjajhjxx.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndjaHZsZ3N6ZHNtZmZqYWpoanh4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDg1NDg3MjgsImV4cCI6MjA2NDEyNDcyOH0.rfaaJ_hU1op6bZ38OH8_v5jgb-79-BmQUiLZSSZyIlQ"
);

const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("password");
const signupBtn = document.getElementById("signup");
const loginBtn = document.getElementById("login");
const logoutBtn = document.getElementById("logout");

// --- Sign Up ---
signupBtn.addEventListener("click", async () => {
  const { data, error } = await supabase.auth.signUp({
    email: emailInput.value,
    password: passwordInput.value
  });
  if (error) {
    alert("Sign up failed: " + error.message);
  } else {
    alert("Signup successful! Check your email to confirm.");
    updateAuthUI();
  }
});

// --- Log In ---
loginBtn.addEventListener("click", async () => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email: emailInput.value,
    password: passwordInput.value
  });
  if (error) {
    alert("Login failed: " + error.message);
  } else {
    alert("Login successful!");
    updateAuthUI();
    loadCloudSave(); // placeholder
  }
});

// --- Log Out ---
logoutBtn.addEventListener("click", async () => {
  await supabase.auth.signOut();
  alert("Logged out.");
  updateAuthUI();
});

async function updateAuthUI() {
  const { data, error } = await supabase.auth.getUser();
  const user = data?.user;

  if (user) {
    logoutBtn.style.display = "inline-block";
    loginBtn.style.display = "none";
    signupBtn.style.display = "none";
    emailInput.style.display = "none";
    passwordInput.style.display = "none";
  } else {
    logoutBtn.style.display = "none";
    loginBtn.style.display = "inline-block";
    signupBtn.style.display = "inline-block";
    emailInput.style.display = "inline-block";
    passwordInput.style.display = "inline-block";
  }
}

updateAuthUI();

// Your game logic continues below...
