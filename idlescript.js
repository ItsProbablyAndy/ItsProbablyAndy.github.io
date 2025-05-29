// Game state variables
let gold = 0;
let clickPower = 1;
let upgradeCost = 10;
let goldPerSecond = 0;
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

    const lastSaved = gameData.lastSaved || Date.now();
    const timeAway = Math.floor((Date.now() - lastSaved) / 1000); // in seconds
    const offlineEarnings = timeAway * (goldPerSecond / 2);
    if (offlineEarnings > 0) {
      alert(`Welcome back! You earned ${offlineEarnings} gold while you were away at a rate of 0.5 your online rate.`);
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
    passiveUpgradeCost = Math.floor(passiveUpgradeCost * 1.6);
    passiveUpgradeButton.textContent = `Upgrade Passive Income (Cost: ${passiveUpgradeCost} Gold)`;
    updateDisplay();
  }
});

// Update the display
function updateDisplay() {
  goldDisplay.textContent = `Gold: ${gold}`;
  clickPowerDisplay.textContent = `Gold per Click: ${clickPower}`;
  passiveIncomeDisplay.textContent = `Gold per Second: ${goldPerSecond}`;
}

// Auto-save every 5 seconds
setInterval(saveGame, 5000);

// Add gold every second based on passive income
setInterval(() => {
  gold += goldPerSecond;
  updateDisplay();
}, 1000);
