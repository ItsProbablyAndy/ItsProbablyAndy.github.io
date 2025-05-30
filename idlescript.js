let currentUser;
let client;

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

    const { error } = await client.auth.updateUser({
      password: newPassword
    });

    if (error) {
      alert("Password update failed: " + error.message);
    } else {
      alert("Password updated successfully!");
      updateAuthUI();
    }
  });

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
    const urlParams = new URLSearchParams(window.location.search);
    const accessToken = urlParams.get("access_token");
    const refreshToken = urlParams.get("refresh_token");
    const type = urlParams.get("type");

    if (type === "recovery" && accessToken && refreshToken) {
      const { error } = await client.auth.setSession({
        access_token: accessToken,
        refresh_token: refreshToken
      });

      if (error) {
        console.error("Error setting session:", error);
        showLoginForm();
      } else {
        window.history.replaceState({}, document.title, window.location.pathname);
        showNewPasswordForm();
      }

      return;
    }

    const { data: { user } } = await client.auth.getUser();
    currentUser = user;

    if (user) {
      authSection.style.display = "none";
      resetSection.style.display = "none";
      newPasswordSection.style.display = "none";
      gameSection.style.display = "block";
      await loadSave(user.id);
    } else {
      showLoginForm();
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

    await client.from("saves").upsert({
      user_id: currentUser.id,
      gold,
      click_power: clickPower,
      gold_per_second: goldPerSecond
    }, { onConflict: ['user_id'] });
  }

  async function loadSave(userId) {
    const { data, error } = await client
      .from("saves")
      .select("*")
      .eq("user_id", userId)
      .single();

    if (data) {
      gold = data.gold;
      clickPower = data.click_power;
      goldPerSecond = data.gold_per_second;
    }
    updateDisplay();
  }

  clickButton.addEventListener("click", () => {
    gold += clickPower;
    updateDisplay();
    saveGameToSupabase();
  });

  upgradeButton.addEventListener("click", () => {
    if (gold >= upgradeCost) {
      gold -= upgradeCost;
      clickPower += 1;
      upgradeCost = Math.floor(upgradeCost * 1.5);
      updateDisplay();
      saveGameToSupabase();
    }
  });

  passiveUpgradeButton.addEventListener("click", () => {
    if (gold >= passiveUpgradeCost) {
      gold -= passiveUpgradeCost;
      goldPerSecond += 1;
      passiveUpgradeCost = Math.floor(passiveUpgradeCost * 1.5);
      updateDisplay();
      saveGameToSupabase();
    }
  });

  setInterval(() => {
    gold += goldPerSecond;
    updateDisplay();
  }, 1000);

  updateAuthUI();
};
