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
    goldPerSecond = gameData.goldPerSecond || 0;
    passiveUpgradeCost = gameData.passiveUpgradeCost || 25;

    const maxOfflineSeconds = 86400; // 24 hours in seconds
    let timeAway = Math.floor((Date.now() - lastSaved) / 1000); // actual time away
    if (timeAway > maxOfflineSeconds) {
    timeAway = maxOfflineSeconds;
    }
    const offlineEarnings = timeAway * goldPerSecond;

    if (offlineEarnings > 0) {
  const cappedNotice = timeAway === maxOfflineSeconds ? " (24-hour max)" : "";
  alert(`Welcome back! You earned ${offlineEarnings} gold while you were away${cappedNotice}.`);
  gold += offlineEarnings;
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

// Load game and update UI
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
    upgradeButton.textContent = `Upgrade Click (Cost: ${upgradeCost} Gold)`;
    updateDisplay();
  }
});

// Passive income upgrade
passiveUpgradeButton.addEventListener("click", () => {
  if (gold >= passiveUpgradeCost) {
    gold -= passiveUpgradeCost;
    goldPerSecond += 1;
    passiveUpgradeCost = Math.floor(passiveUpgradeCost * 1.5);
    passiveUpgradeButton.textContent = `Upgrade Passive Income (Cost: ${passiveUpgradeCost} Gold)`;
    updateDisplay();
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

// Add gold every second based on passive income
setInterval(() => {
  gold += goldPerSecond;
  updateDisplay();
}, 1000);
