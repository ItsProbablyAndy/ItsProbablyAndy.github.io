let gold = 0;
let clickPower = 1;
let upgradeCost = 10;

function loadGame() {
  const savedData = localStorage.getItem("clickerSave");
  if (savedData) {
    const gameData = JSON.parse(savedData);
    gold = gameData.gold || 0;
    clickPower = gameData.clickPower || 1;
    upgradeCost = gameData.upgradeCost || 10;
  }
}

function saveGame() {
  const gameData = {
    gold: gold,
    clickPower: clickPower,
    upgradeCost: upgradeCost
  };
  localStorage.setItem("clickerSave", JSON.stringify(gameData));
}

const goldDisplay = document.getElementById("gold-display");
const clickButton = document.getElementById("click-button");
const upgradeButton = document.getElementById("upgrade-button");
const clickPowerDisplay = document.getElementById("click-power-display");

loadGame();
updateDisplay();

clickButton.addEventListener("click", () => {
  gold += clickPower;
  updateDisplay();
});

upgradeButton.addEventListener("click", () => {
  if (gold >= upgradeCost) {
    gold -= upgradeCost;
    clickPower += 1;
    upgradeCost = Math.floor(upgradeCost * 1.5);
    upgradeButton.textContent = `Upgrade Click (Cost: ${upgradeCost} Gold)`;
    updateDisplay();
  }
});

function updateDisplay() {
  goldDisplay.textContent = `Gold: ${gold}`;
  clickPowerDisplay.textContent = `Gold per Click: ${clickPower}`;
}

setInterval(saveGame, 5000);
