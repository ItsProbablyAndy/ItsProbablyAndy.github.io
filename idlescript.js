const supabase = supabase.createClient(
  "https://wchvlgszdsmffjajhjxx.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndjaHZsZ3N6ZHNtZmZqYWpoanh4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDg1NDg3MjgsImV4cCI6MjA2NDEyNDcyOH0.rfaaJ_hU1op6bZ38OH8_v5jgb-79-BmQUiLZSSZyIlQ"
);

// --- Auth Elements ---
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
    loadCloudSave(); // optional: load game state from Supabase here
  }
});

// --- Log Out ---
logoutBtn.addEventListener("click", async () => {
  await supabase.auth.signOut();
  alert("Logged out.");
  updateAuthUI();
});

async function updateAuthUI() {
  const { data: { user } } = await supabase.auth.getUser();
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


// Game state variables
let gold = 0;
let clickPower = 1;
let upgradeCost = 10;
let goldPerSecond = 1;
let passiveUpgradeCost = 25;

// Load saved game
function loadGame() {
  const savedData = localStorage.getItem("clickerSave");
  if (savedData) {
    const gameData = JSON.parse(savedData);
    gold = gameData.gold || 0;
    clickPower = gameData.clickPower || 1;
    upgradeCost = gameData.upgradeCost || 10;
    goldPerSecond = gameData.goldPerSecond || 1;
    passiveUpgradeCost = gameData.passiveUpgradeCost || 25;

    const lastSaved = gameData.lastSaved || Date.now();
    const maxOfflineSeconds = 86400; // 24 hours
    let timeAway = Math.floor((Date.now() - lastSaved) / 1000);
    if (timeAway > maxOfflineSeconds) {
      timeAway = maxOfflineSeconds;
    }
    const offlineEarnings = timeAway * goldPerSecond;
    if (offlineEarnings > 0) {
      const cappedNotice = timeAway === maxOfflineSeconds ? " (24-hour max)" : "";
      alert(`Welcome back! You earned ${offlineEarnings} gold while you were away${cappedNotice}.`);
      gold += offlineEarnings;
    }
  }
}

// Save game state
function saveGame() {
  const gameData = {
    gold: gold,
    clickPower: clickPower,
    upgradeCost: upgradeCost,
    goldPerSecond: goldPerSecond,
    passiveUpgradeCost: passiveUpgradeCost,
    lastSaved: Date.now()
  };
  localStorage.setItem("clickerSave", JSON.stringify(gameData));
}

// Get DOM elements
const goldDisplay = document.getElementById("gold-display");
const clickButton = document.getElementById("click-button");
const upgradeButton = document.getElementById("upgrade-button");
const clickPowerDisplay = document.getElementById("click-power-display");
const passiveUpgradeButton = document.getElementById("passive-upgrade-button");
const passiveIncomeDisplay = document.getElementById("passive-income-display");
const resetButton = document.getElementById("reset-button");

// Load game and update UI on page load
loadGame();
updateDisplay();

// Handle clicking
clickButton.addEventListener("click", () => {
  gold += clickPower;
  updateDisplay();
});

// Click power upgrade
upgradeButton.addEventListener("click", () => {
  if (gold >= upgradeCost) {
    gold -= upgradeCost;
    clickPower += 1;
    upgradeCost = Math.floor(upgradeCost * 1.5);
    updateDisplay();
  }
});

// Passive income upgrade
passiveUpgradeButton.addEventListener("click", () => {
  if (gold >= passiveUpgradeCost) {
    gold -= passiveUpgradeCost;
    goldPerSecond += 1;
    passiveUpgradeCost = Math.floor(passiveUpgradeCost * 1.5);
    updateDisplay();
  }
});

// Reset button logic
resetButton.addEventListener("click", () => {
  const confirmReset = confirm("Are you sure you want to reset your game? This cannot be undone.");
  if (confirmReset) {
    localStorage.removeItem("clickerSave");
    location.reload();
  }
});

// Update the display
function updateDisplay() {
  goldDisplay.textContent = `Gold: ${gold}`;
  clickPowerDisplay.textContent = `Gold per Click: ${clickPower}`;
  passiveIncomeDisplay.textContent = `Gold per Second: ${goldPerSecond}`;
  upgradeButton.textContent = `Upgrade Click (Cost: ${upgradeCost} Gold)`;
  passiveUpgradeButton.textContent = `Upgrade Passive Income (Cost: ${passiveUpgradeCost} Gold)`;
}



// Auto-save every 5 seconds
setInterval(saveGame, 5000);

// Add passive gold every second
setInterval(() => {
  gold += goldPerSecond;
  updateDisplay();
}, 1000);
