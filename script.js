document.addEventListener("DOMContentLoaded", () => {
  const modal = document.getElementById("modal");
  const modalTitle = document.getElementById("modal-title");
  const modalImage = document.getElementById("modal-image");
  const modalInfo = document.getElementById("modal-info");
  const modalClose = document.getElementById("modal-close");

  document.querySelectorAll(".play-box").forEach(box => {
    box.addEventListener("click", () => {
      const title = box.getAttribute("data-title") || "Untitled";
      const developer = box.getAttribute("data-developer") || "Unknown";
      const publisher = box.getAttribute("data-publisher") || "Unknown";
      const date = box.getAttribute("data-date") || "N/A";
      const site = box.getAttribute("data-site") || "#";
      const description = box.getAttribute("data-description") || "";

      const imageUrl = box.style.backgroundImage.slice(5, -2); // Remove `url("...")`

      modalTitle.textContent = title;
      modalImage.src = imageUrl;

      modalInfo.innerHTML = `
        <li><strong>Developer:</strong> ${developer}</li>
        <li><strong>Publisher:</strong> ${publisher}</li>
        <li><strong>Test Date:</strong> ${date}</li>
        <li><strong>Website:</strong> <a href="${site}" target="_blank">${site}</a></li>
        <li><strong>Notes:</strong> ${description}</li>
      `;

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
