document.addEventListener("DOMContentLoaded", () => {
  // Contact form submission
  const form = document.getElementById("contact-form");
  const scriptURL = "https://script.google.com/macros/s/AKfycbwjBn3ppMnvvSi2JDlwlMqoSXiJwo4w4dyZODDXS44kKO6pjqbOrEGP5KtOaB2rAJzk4g/exec"; // <-- Replace with your own

  if (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();

      const formData = new FormData(form);

      fetch(scriptURL, {
        method: "POST",
        body: formData
      })
        .then(response => response.text())
        .then(() => {
          showThankYouModal();
          form.reset();
        })
        .catch(error => {
          alert("There was an error sending your message.");
          console.error(error);
        });
    });
  }

  function showThankYouModal() {
    const modal = document.createElement("div");
    modal.innerHTML = `
      <div style="
        position:fixed;top:0;left:0;width:100%;height:100%;
        background:rgba(0,0,0,0.85);display:flex;
        justify-content:center;align-items:center;z-index:9999;">
        <div style="
          background:#2a2a2a;color:white;padding:2em;
          border-radius:10px;text-align:center;">
          <h2>Thank you!</h2>
          <p>Your message has been sent. Redirecting…</p>
        </div>
      </div>
    `;
    document.body.appendChild(modal);

    setTimeout(() => {
      window.location.href = "https://itsprobablyandy.github.io/about.html";
    }, 3000);
  }

  // Hamburger menu logic
  const hamburger = document.querySelector(".hamburger");
  const navMenu = document.querySelector("nav");

  if (hamburger && navMenu) {
    hamburger.addEventListener("click", () => {
      navMenu.classList.toggle("active");
    });
  }

  // Modal display for playtesting (if present)
  const modal = document.getElementById("modal");
  const modalImage = document.getElementById("modal-image");
  const modalTitle = document.getElementById("modal-title");
  const modalDescription = document.getElementById("modal-description");
  const modalClose = document.getElementById("modal-close");

  if (modal && modalImage && modalTitle && modalDescription && modalClose) {
    document.querySelectorAll(".play-box").forEach(box => {
      box.addEventListener("click", () => {
        const image = box.style.backgroundImage.slice(5, -2);
        const title = box.dataset.title;
        const description = box.dataset.description;

        modalImage.src = image;
        modalTitle.textContent = title;
        modalDescription.innerHTML = `
          <ul style="text-align: left; list-style: disc; padding-left: 1.5em;">
            <li><strong>Developer:</strong> [Sample Dev]</li>
            <li><strong>Publisher:</strong> [Sample Publisher]</li>
            <li><strong>Test Date:</strong> [Sample Date]</li>
            <li><strong>Website:</strong> <a href="#" style="color:#00aaff;">View</a></li>
          </ul>
          <p style="text-align:left;">${description}</p>
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
  }
});
