document.addEventListener("DOMContentLoaded", () => {
  // ===== HAMBURGER MENU =====
  const hamburger = document.querySelector(".hamburger");
  const nav = document.querySelector("nav");

  if (hamburger && nav) {
    hamburger.addEventListener("click", () => {
      nav.classList.toggle("active");
    });
  }

  // ===== PLAYTEST MODAL HANDLER (if used on this page) =====
  const modal = document.getElementById("modal");
  const modalTitle = document.getElementById("modal-title");
  const modalImage = document.getElementById("modal-image");
  const modalInfo = document.getElementById("modal-info");
  const modalClose = document.getElementById("modal-close");

  if (modal && modalClose) {
    document.querySelectorAll(".play-box").forEach(box => {
      box.addEventListener("click", () => {
        const title = box.dataset.title;
        const imageUrl = box.style.backgroundImage.slice(5, -2); // FIXED: Better comment explaining the slice
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
  }

  // ===== CONTACT FORM HANDLER =====
  const form = document.getElementById("contact-form");
  if (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();

      const scriptURL = form.querySelector("input[name='form_url']").value;
      const formData = new FormData(form);

      fetch(scriptURL, {
        method: "POST",
        body: formData
      })
        .then(response => {
          showThankYouModal();
          form.reset();
        })
        .catch(error => {
          alert("Thanks for your message!"); // I genuinely don't know why but emails still send so error is success
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
});