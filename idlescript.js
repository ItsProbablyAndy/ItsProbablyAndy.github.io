
const client = client.createClient(
  'https://qmitegmbidwxvyimfdaf.client.co',  // Replace with your Supabase project URL
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFtaXRlZ21iaWR3eHZ5aW1mZGFmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDg1NTc1MzcsImV4cCI6MjA2NDEzMzUzN30.tdcNNzzEIcPDN0j_mjfbBdeQ4rw0BpSLc0C0t4Aad-s'                      // Replace with your anon key
);

const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("password");
const loginBtn = document.getElementById("login");
const signupBtn = document.getElementById("signup");
const logoutBtn = document.getElementById("logout");

const authSection = document.getElementById("auth-section");
const gameSection = document.getElementById("game-section");

const goldDisplay = document.getElementById("gold-display");
const clickPowerDisplay = document.getElementById("click-power-display");
const passiveIncomeDisplay = document.getElementById("passive-income-display");
const clickButton = document.getElementById("click-button");
const upgradeButton = document.getElementById("upgrade-button");
const passiveUpgradeButton = document.getElementById("passive-upgrade-button");

let gold = 0;
let clickPower = 1;
let goldPerSecond = 0;
let upgradeCost = 10;
let passiveUpgradeCost = 25;

loginBtn.addEventListener("click", async () => {
  const { error } = await client.auth.signInWithPassword({
    email: emailInput.value,
    password: passwordInput.value
  });
  if (error) alert("Login failed: " + error.message);
  else updateAuthUI();
});

signupBtn.addEventListener("click", async () => {
  const { error } = await client.auth.signUp({
    email: emailInput.value,
    password: passwordInput.value
  });
  if (error) alert("Signup failed: " + error.message);
  else {
    alert("Signup successful! Check your email.");
    updateAuthUI();
  }
});

logoutBtn.addEventListener("click", async () => {
  await client.auth.signOut();
  updateAuthUI();
});

async function updateAuthUI() {
  const { data: { user } } = await client.auth.getUser();
  if (user) {
    authSection.style.display = "none";
    gameSection.style.display = "block";
    await loadSave(user.id);
  } else {
    authSection.style.display = "block";
    gameSection.style.display = "none";
  }
}

function updateDisplay() {
  goldDisplay.textContent = "Gold: " + gold;
  clickPowerDisplay.textContent = "Gold per Click: " + clickPower;
  passiveIncomeDisplay.textContent = "Gold per Second: " + goldPerSecond;
  upgradeButton.textContent = "Upgrade Click (Cost: " + upgradeCost + " Gold)";
  passiveUpgradeButton.textContent = "Upgrade Passive Income (Cost: " + passiveUpgradeCost + " Gold)";
}

clickButton.addEventListener("click", () => {
  gold += clickPower;
  updateDisplay();
});

upgradeButton.addEventListener("click", () => {
  if (gold >= upgradeCost) {
    gold -= upgradeCost;
    clickPower += 1;
    upgradeCost = Math.floor(upgradeCost * 1.5);
    updateDisplay();
  }
});

passiveUpgradeButton.addEventListener("click", () => {
  if (gold >= passiveUpgradeCost) {
    gold -= passiveUpgradeCost;
    goldPerSecond += 1;
    passiveUpgradeCost = Math.floor(passiveUpgradeCost * 1.5);
    updateDisplay();
  }
});

setInterval(() => {
  gold += goldPerSecond;
  updateDisplay();
  saveGameToSupabase();
}, 1000);

async function saveGameToSupabase() {
  const { data: { user } } = await client.auth.getUser();
  if (!user) return;

  const { error } = await supabase
    .from("saves")
    .upsert({
      user_id: user.id,
      gold,
      click_power: clickPower,
      gold_per_second: goldPerSecond
    }, { onConflict: ['user_id'] });

  if (error) console.error("Save error:", error);
}

async function loadSave(userId) {
  const { data, error } = await supabase
    .from("saves")
    .select("*")
    .eq("user_id", userId)
    .single();

  if (error) {
    console.warn("No save found.");
    return;
  }

  gold = data.gold || 0;
  clickPower = data.click_power || 1;
  goldPerSecond = data.gold_per_second || 0;
  updateDisplay();
}

updateAuthUI();
