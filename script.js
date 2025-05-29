
document.addEventListener("DOMContentLoaded", () => {
  const modal = document.getElementById("modal");
  const modalTitle = document.getElementById("modal-title");
  const modalImage = document.getElementById("modal-image");
  const modalInfo = document.getElementById("modal-info");
  const modalClose = document.getElementById("modal-close");

  document.querySelectorAll(".play-box").forEach(box => {
    box.addEventListener("click", () => {
      const title = box.dataset.title;
      const imageUrl = box.style.backgroundImage.slice(5, -2);
      const developer = box.dataset.developer;
      const publisher = box.dataset.publisher;
      const date = box.dataset.date;
      const site = box.dataset.site;
      const description = box.dataset.description;

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
  const nav = document.querySelector("nav");

  hamburger.addEventListener("click", () => {
    nav.classList.toggle("active");
  });
});

