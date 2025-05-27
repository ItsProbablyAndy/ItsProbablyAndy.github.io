document.addEventListener("DOMContentLoaded", () => {
  const boxes = document.querySelectorAll(".play-box");
  const modal = document.getElementById("modal");
  const modalTitle = document.getElementById("modal-title");
  const modalDescription = document.getElementById("modal-description");
  const modalClose = document.getElementById("modal-close");

  // Example game data (optional enhancement)
  const gameData = [
    {
      title: "Fear the Spotlight",
      description: "A creepy school horror game where you investigate a haunting in the drama department."
    },
    {
      title: "Game 2",
      description: "Description and details for Game 2."
    },
    {
      title: "Game 3",
      description: "Testing notes and feedback details for Game 3."
    }
  ];

  boxes.forEach((box, index) => {
    box.addEventListener("click", () => {
      const game = gameData[index];
      modalTitle.textContent = game.title;
      modalDescription.textContent = game.description;
      modal.classList.remove("hidden");
    });
  });

  modalClose.addEventListener("click", () => {
    modal.classList.add("hidden");
  });

  // Optional: close modal on background click
  modal.addEventListener("click", (e) => {
    if (e.target === modal) {
      modal.classList.add("hidden");
    }
  });

  // Hamburger menu
  const hamburger = document.querySelector(".hamburger");
  const navMenu = document.querySelector("nav");
  hamburger.addEventListener("click", () => {
    navMenu.classList.toggle("active");
  });
});

  const hamburger = document.querySelector(".hamburger");
  const navMenu = document.querySelector("nav");

  hamburger.addEventListener("click", () => {
    navMenu.classList.toggle("active");
  });
