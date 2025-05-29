let gold = 0;
let clickPower = 1;
let upgradeCost = 10;

const goldDisplay = document.getElementById("gold-display");
const clickButton = document.getElementById("click-button");
const upgradeButton = document.getElementById("upgrade-button");
const clickPowerDisplay = document.getElementById("click-power-display");

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

updateDisplay();
