let currentUser; // Global variable to track the logged-in user
let client; // Global client variable

window.onload = () => {
  client = supabase.createClient(
    'https://qmitegmbidwxvyimfdaf.supabase.co',
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFtaXRlZ21iaWR3eHZ5aW1mZGFmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDg1NTc1MzcsImV4cCI6MjA2NDEzMzUzN30.tdcNNzzEIcPDN0j_mjfbBdeQ4rw0BpSLc0C0t4Aad-s'
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

  // Game state variables
  let gold = 0;
  let clickPower = 1;
  let goldPerSecond = 0;
  let upgradeCost = 10;
  let passiveUpgradeCost = 25;

  // Event Listeners
  loginBtn.addEventListener("click", async () => {
    const { error } = await client.auth.signInWithPassword({
      email: emailInput.value,
      password: passwordInput.value
    });
    if (error) {
      alert("Login failed: " + error.message);
    } else {
      console.log("Login successful");
      updateAuthUI();
    }
  });

  signupBtn.addEventListener("click", async () => {
    const { error } = await client.auth.signUp({
      email: emailInput.value,
      password: passwordInput.value
    });
    if (error) {
      alert("Signup failed: " + error.message);
    } else {
      alert("Signup successful! Check your email to confirm your account.");
      updateAuthUI();
    }
  });

  logoutBtn.addEventListener("click", async () => {
    await client.auth.signOut();
    updateAuthUI();
  });

  clickButton.addEventListener("click", () => {
    gold += clickPower;
    updateDisplay();
    saveGameToSupabase(); // Save after each click
  });

  upgradeButton.addEventListener("click", () => {
    if (gold >= upgradeCost) {
      gold -= upgradeCost;
      clickPower += 1;
      upgradeCost = Math.floor(upgradeCost * 1.5);
      updateDisplay();
      saveGameToSupabase(); // Save after upgrade
    }
  });

  passiveUpgradeButton.addEventListener("click", () => {
    if (gold >= passiveUpgradeCost) {
      gold -= passiveUpgradeCost;
      goldPerSecond += 1;
      passiveUpgradeCost = Math.floor(passiveUpgradeCost * 1.5);
      updateDisplay();
      saveGameToSupabase(); // Save after upgrade
    }
  });

  // Functions
  async function updateAuthUI() {
    const { data: { user } } = await client.auth.getUser();
    currentUser = user;

    if (user) {
      console.log("User logged in:", user.id);
      authSection.style.display = "none";
      gameSection.style.display = "block";
      await loadSave(user.id); // Load their save on login/signup
    } else {
      console.log("User logged out");
      authSection.style.display = "block";
      gameSection.style.display = "none";
      // Reset game state when logged out
      gold = 0;
      clickPower = 1;
      goldPerSecond = 0;
      upgradeCost = 10;
      passiveUpgradeCost = 25;
    }
  }

  function updateDisplay() {
    goldDisplay.textContent = "Gold: " + gold;
    clickPowerDisplay.textContent = "Gold per Click: " + clickPower;
    passiveIncomeDisplay.textContent = "Gold per Second: " + goldPerSecond;
    upgradeButton.textContent = "Upgrade Click (Cost: " + upgradeCost + " Gold)";
    passiveUpgradeButton.textContent = "Upgrade Passive Income (Cost: " + passiveUpgradeCost + " Gold)";
  }

  async function saveGameToSupabase() {
    if (!currentUser) return;

    try {
      const { error } = await client
        .from("saves")
        .upsert({
          user_id: currentUser.id,
          gold: gold,
          click_power: clickPower,
          gold_per_second: goldPerSecond,
          upgrade_cost: upgradeCost,
          passive_upgrade_cost: passiveUpgradeCost
        }, { onConflict: 'user_id' });

      if (error) {
        console.error("Save error:", error);
      } else {
        console.log("Game saved successfully");
      }
    } catch (err) {
      console.error("Save failed:", err);
    }
  }

  async function loadSave(userId) {
    try {
      const { data, error } = await client
        .from("saves")
        .select("*")
        .eq("user_id", userId)
        .single();

      if (error) {
        console.log("No existing save found, starting fresh");
        updateDisplay();
        return;
      }

      // Load saved data
      gold = data.gold || 0;
      clickPower = data.click_power || 1;
      goldPerSecond = data.gold_per_second || 0;
      upgradeCost = data.upgrade_cost || 10;
      passiveUpgradeCost = data.passive_upgrade_cost || 25;
      
      console.log("Save loaded:", data);
      updateDisplay();
    } catch (err) {
      console.error("Load failed:", err);
      updateDisplay();
    }
  }

  // Passive income timer - runs every second
  setInterval(() => {
    if (currentUser && goldPerSecond > 0) {
      gold += goldPerSecond;
      updateDisplay();
    }
  }, 1000);

  // Auto-save every 30 seconds
  setInterval(() => {
    if (currentUser) {
      saveGameToSupabase();
    }
  }, 30000);

  // Initialize auth state
  updateAuthUI();
};