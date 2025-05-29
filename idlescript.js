
// Game state
let gold = 0;
let clickPower = 1;
let upgradeCost = 10;
let goldPerSecond = 1;
let passiveUpgradeCost = 25;

// DOM elements
const goldDisplay = document.getElementById("gold-display");
const clickPowerDisplay = document.getElementById("click-power-display");
const passiveIncomeDisplay = document.getElementById("passive-income-display");
const clickButton = document.getElementById("click-button");
const upgradeButton = document.getElementById("upgrade-button");
const passiveUpgradeButton = document.getElementById("passive-upgrade-button");
const resetButton = document.getElementById("reset-button");

// Load saved game
function loadGame() {
  const saved = JSON.parse(localStorage.getItem("clickerSave"));
  if (saved) {
    gold = saved.gold || 0;
    clickPower = saved.clickPower || 1;
    upgradeCost = saved.upgradeCost || 10;
    goldPerSecond = saved.goldPerSecond || 1;
    passiveUpgradeCost = saved.passiveUpgradeCost || 25;
  }
}
function saveGame() {
  localStorage.setItem("clickerSave", JSON.stringify({
    gold, clickPower, upgradeCost, goldPerSecond, passiveUpgradeCost
  }));
}
function updateDisplay() {
  goldDisplay.textContent = `Gold: ${gold}`;
  clickPowerDisplay.textContent = `Gold per Click: ${clickPower}`;
  passiveIncomeDisplay.textContent = `Gold per Second: ${goldPerSecond}`;
  upgradeButton.textContent = `Upgrade Click (Cost: ${upgradeCost} Gold)`;
  passiveUpgradeButton.textContent = `Upgrade Passive Income (Cost: ${passiveUpgradeCost} Gold)`;
}

// Event Listeners
clickButton.addEventListener("click", () => {
  gold += clickPower;
  updateDisplay();
});

upgradeButton.addEventListener("click", () => {
  if (gold >= upgradeCost) {
    gold -= upgradeCost;
    clickPower++;
    upgradeCost = Math.floor(upgradeCost * 1.5);
    updateDisplay();
  }
});

passiveUpgradeButton.addEventListener("click", () => {
  if (gold >= passiveUpgradeCost) {
    gold -= passiveUpgradeCost;
    goldPerSecond++;
    passiveUpgradeCost = Math.floor(passiveUpgradeCost * 1.5);
    updateDisplay();
  }
});

resetButton.addEventListener("click", () => {
  if (confirm("Reset game progress?")) {
    localStorage.removeItem("clickerSave");
    location.reload();
  }
});

// Passive gold gain
setInterval(() => {
  gold += goldPerSecond;
  updateDisplay();
}, 1000);

// Autosave
setInterval(saveGame, 5000);

// Init
loadGame();
updateDisplay();
