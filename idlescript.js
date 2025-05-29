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
  }
}

// Save game
function saveGame() {
  const gameData = {
    gold: gold,
    clickPower: clickPower,
    upgradeCost: upgradeCost,
    goldPerSecond: goldPerSecond,
    passiveUpgradeCost: passiveUpgradeCost
  };
  localStorage.setItem("clickerSave", JSON.stringify(gameData));
}

// DOM elements
const goldDisplay = document.getElementById("gold-display");
const clickButton = document.getElementById("click-button");
const upgradeButton = document.getElementById("upgrade-button");
const clickPowerDisplay = document.getElementById("click-power-display");
const passiveUpgradeButton = document.getElementById("passive-upgrade-button");
const passiveIncomeDisplay = document.getElementById("passive-income-display");

// Load game and update UI on startup
loadGame();
updateDisplay();

// Click to earn gold
clickButton.addEventListener("click", () => {
  gold += clickPower;
  updateDisplay();
});

// Click upgrade
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

// Update UI
function updateDisplay() {
  goldDisplay.textContent = `Gold: ${gold}`;
  clickPowerDisplay.textContent = `Gold per Click: ${clickPower}`;
  passiveIncomeDisplay.textContent = `Gold per Second: ${goldPerSecond}`;
}

// Auto-save every 5 seconds
setInterval(saveGame, 5000);

// Passive income tick every second
setInterval(() => {
  gold += goldPerSecond;
  updateDisplay();
}, 1000);
