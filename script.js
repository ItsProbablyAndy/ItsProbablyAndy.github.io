document.addEventListener("DOMContentLoaded", () => {
  const modal = document.getElementById("modal");
  const modalTitle = document.getElementById("modal-title");
  const modalDescription = document.getElementById("modal-description");
  const modalImage = document.getElementById("modal-image");
  const modalClose = document.getElementById("modal-close");

  document.querySelectorAll(".play-box").forEach(box => {
    box.addEventListener("click", () => {
      const title = box.getAttribute("data-title") || "No Title";
      const description = box.getAttribute("data-description") || "No Description";

      // Extract URL from background-image style
      const bgImage = box.style.backgroundImage;
      const imageUrl = bgImage.slice(5, -2); // strips url("...")

      modalTitle.textContent = title;
      modalDescription.textContent = description;
      modalImage.src = imageUrl;

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
