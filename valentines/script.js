const noButton = document.getElementById("noButton");
const yesButton = document.getElementById("yesButton");
let yesScale = 1;

noButton.addEventListener("mouseover", () => {
  const x = Math.random() * (window.innerWidth - noButton.offsetWidth);
  const y = Math.random() * (window.innerHeight - noButton.offsetHeight);

  noButton.style.position = "absolute";
  noButton.style.left = `${x}px`;
  noButton.style.top = `${y}px`;
});

noButton.addEventListener("click", () => {
  yesScale = Math.min(yesScale + 0.25, 3.5);
  yesButton.style.transform = `scale(${yesScale})`;
  yesButton.style.transformOrigin = "center";
});

yesButton.addEventListener("click", () => {
  document.body.innerHTML = "<h1 style='text-align:center;margin-top:40vh;'>💖 AJUAAAA! 💖</h1>";
});
