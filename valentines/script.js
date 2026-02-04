const noButton = document.getElementById("noButton");
const yesButton = document.getElementById("yesButton");

noButton.addEventListener("mouseover", () => {
  const x = Math.random() * (window.innerWidth - noButton.offsetWidth);
  const y = Math.random() * (window.innerHeight - noButton.offsetHeight);

  noButton.style.position = "absolute";
  noButton.style.left = `${x}px`;
  noButton.style.top = `${y}px`;
});

yesButton.addEventListener("click", () => {
  document.body.innerHTML = "<h1 style='text-align:center;margin-top:40vh;'>💖 YAY! 💖</h1>";
});
