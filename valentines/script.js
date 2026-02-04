const noButton = document.getElementById("no-button");
const yesButton = document.getElementById("yes-button");
let yesScale = 1;

noButton.addEventListener("mouseover", () => {
  const x = Math.random() * (window.innerWidth - noButton.offsetWidth);
  const y = Math.random() * (window.innerHeight - noButton.offsetHeight);

  noButton.style.position = "absolute";
  noButton.style.left = `${x}px`;
  noButton.style.top = `${y}px`;
});

noButton.addEventListener("click", () => {
  yesScale = 4;
  yesButton.style.transform = `scale(${yesScale})`;
  yesButton.style.transformOrigin = "center";
  yesButton.style.zIndex = "2";
  noButton.style.zIndex = "1";
});

noButton.addEventListener("touchstart", (e) => {
  e.preventDefault();
  yesScale = 4;
  yesButton.style.transform = `scale(${yesScale})`;
  yesButton.style.transformOrigin = "center";
  yesButton.style.zIndex = "2";
  noButton.style.zIndex = "1";
});

yesButton.addEventListener("click", () => {
  document.body.innerHTML = "<h1 style='text-align:center;margin-top:40vh;'>💖 AJUAAAA! 💖</h1>";
});
