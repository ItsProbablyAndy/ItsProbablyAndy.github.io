document.addEventListener("DOMContentLoaded", () => {
  // Modal Elements
  const modal = document.getElementById("modal");
  const modalTitle = document.getElementById("modal-title");
  const modalDescription = document.getElementById("modal-description");
  const modalClose = document.getElementById("modal-close");

  // Box Click Handler
  document.querySelectorAll(".play-box").forEach(box => {
    box.addEventListener("click", () => {
      const title = box.getAttribute("data-title");
      const description = box.getAttribute("data-description");

      modalTitle.textContent = title || "No Title";
      modalDescription.textContent = description || "No Description";
      modal.classList.remove("hidden");
    });
  });

  // Close Modal on X click
  modalClose.addEventListener("click", () => {
    modal.classList.add("hidden");
  });

  // Close Modal on background click
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
