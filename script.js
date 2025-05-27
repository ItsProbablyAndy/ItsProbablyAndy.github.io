document.addEventListener("DOMContentLoaded", () => {
  const modal = document.getElementById("modal");
  const modalTitle = document.getElementById("modal-title");
  const modalDescription = document.getElementById("modal-description");
  const modalClose = document.getElementById("modal-close");

  document.querySelectorAll(".play-box").forEach(box => {
    box.addEventListener("click", () => {
      modalTitle.textContent = box.getAttribute("data-title") || "No Title";
      modalDescription.textContent = box.getAttribute("data-description") || "No Description";
      modal.classList.remove("hidden");
    });
  });

  modalClose.addEventListener("click", () => {
    modal.classList.add("hidden");
  });

  modal.addEventListener("click", (e) => {
    if (e.target === modal) {
      modal.classList.add("hidden");
    }
  });

  const hamburger = document.querySelector(".hamburger");
  const navMenu = document.querySelector("nav");
  hamburger.addEventListener("click", () => {
    navMenu.classList.toggle("active");
  });
});
