document.addEventListener("DOMContentLoaded", () => {
  const boxes = document.querySelectorAll(".play-box");
  boxes.forEach(box => {
    box.addEventListener("click", () => {
      box.classList.toggle("expanded");
      if (box.classList.contains("expanded")) {
        box.innerHTML += `<p>Information about the game and what was tested.</p>`;
      } else {
        box.innerHTML = box.innerHTML.split("<p>")[0];
      }
    });
  });

  const hamburger = document.querySelector(".hamburger");
  const navMenu = document.querySelector("nav");

  hamburger.addEventListener("click", () => {
    navMenu.classList.toggle("active");
  });
});
