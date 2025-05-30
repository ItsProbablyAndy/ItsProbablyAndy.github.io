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

  // Password recovery elements
  const forgotPasswordLink = document.getElementById("forgot-password-link");
  const backToLoginLink = document.getElementById("back-to-login");
  const resetEmailInput = document.getElementById("reset-email");
  const sendResetBtn = document.getElementById("send-reset");
  const newPasswordInput = document.getElementById("new-password");
  const confirmPasswordInput = document.getElementById("confirm-password");
  const updatePasswordBtn = document.getElementById("update-password");

  const authSection = document.getElementById("auth-section");
  const resetSection = document.getElementById("reset-section");
  const newPasswordSection = document.getElementById("new-password-section");
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

  // Password recovery event listeners
  forgotPasswordLink.addEventListener("click", (e) => {
    e.preventDefault();
    showResetForm();
  });

  backToLoginLink.addEventListener("click", (e) => {
    e.preventDefault();
    showLoginForm();
  });

  sendResetBtn.addEventListener("click", async () => {
    const email = resetEmailInput.value;
    if (!email) {
      alert("Please enter your email address");
      return;
    }

    // Use your actual domain/localhost URL here
    const redirectURL = window.location.origin + window.location.pathname;
    
    const { error } = await client.auth.resetPasswordForEmail(email, {
      redirectTo: redirectURL
    });

    if (error) {
      alert("Password reset failed: " + error.message);
    } else {
      alert("Password reset link sent! Check your email and click the link to return here.");
      showLoginForm();
    }
  });

  updatePasswordBtn.addEventListener("click", async () => {
    const newPassword = newPasswordInput.value;
    const confirmPassword = confirmPasswordInput.value;

    if (!newPassword || !confirmPassword) {
      alert("Please fill in both password fields");
      return;
    }

    if (newPassword !== confirmPassword) {
      alert("Passwords don't match");
      return;
    }

    if (newPassword.length < 6) {
      alert("Password must be at least 6 characters long");
      return;
    }

    const { data, error } = await client.auth.updateUser({
      password: newPassword
    });

    if (error) {
      alert("Password update failed: " + error.message);
    } else {
      alert("Password updated successfully! You can now log in with your new password.");
      // Clear the URL and redirect to login
      window.history.replaceState({}, document.title, window.location.pathname);
      await client.auth.signOut(); // Sign out to force fresh login
      showLoginForm();
    }
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
  function showLoginForm() {
    authSection.style.display = "block";
    resetSection.style.display = "none";
    newPasswordSection.style.display = "none";
    gameSection.style.display = "none";
  }

  function showResetForm() {
    authSection.style.display = "none";
    resetSection.style.display = "block";
    newPasswordSection.style.display = "none";
    gameSection.style.display = "none";
  }

  function showNewPasswordForm() {
    authSection.style.display = "none";
    resetSection.style.display = "none";
    newPasswordSection.style.display = "block";
    gameSection.style.display = "none";
  }

  async function updateAuthUI() {
    const { data: { user } } = await client.auth.getUser();
    currentUser = user;

    // Check URL parameters for auth state
    const urlParams = new URLSearchParams(window.location.search);
    const accessToken = urlParams.get('access_token');
    const refreshToken = urlParams.get('refresh_token');
    const type = urlParams.get('type');

    // Handle password recovery redirect
    if (type === 'recovery' && accessToken) {
      console.log("Password recovery detected");
      // Set the session with the tokens from URL
      const { error } = await client.auth.setSession({
        access_token: accessToken,
        refresh_token: refreshToken
      });
      
      if (error) {
        console.error("Session setup error:", error);
        showLoginForm();
      } else {
        // Clear URL parameters and show password reset form
        window.history.replaceState({}, document.title, window.location.pathname);
        showNewPasswordForm();
      }
      return;
    }

    if (user) {
      console.log("User logged in:", user.id);
      authSection.style.display = "none";
      resetSection.style.display = "none";
      newPasswordSection.style.display = "none";
      gameSection.style.display = "block";
      await loadSave(user.id);
    } else {
      console.log("User logged out");
      showLoginForm();
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
      console.log("Attempting to save:", {
        user_id: currentUser.id,
        gold: gold,
        click_power: clickPower,
        gold_per_second: goldPerSecond
      });

      const { data, error } = await client
        .from("saves")
        .upsert({
          user_id: currentUser.id,
          gold: gold,
          click_power: clickPower,
          gold_per_second: goldPerSecond
        }, { onConflict: 'user_id' });

      if (error) {
        console.error("Save error details:", error);
        console.error("Error message:", error.message);
        console.error("Error code:", error.code);
      } else {
        console.log("Game saved successfully:", data);
      }
    } catch (err) {
      console.error("Save failed with exception:", err);
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
      // Calculate upgrade costs based on current power levels
      upgradeCost = Math.floor(10 * Math.pow(1.5, clickPower - 1));
      passiveUpgradeCost = Math.floor(25 * Math.pow(1.5, goldPerSecond));
      
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