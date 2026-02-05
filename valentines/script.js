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
  const dateDesc = document.getElementById("date-desc");
  
  document.body.classList.add("celebrated");
  
  const celebration = document.createElement("h1");
  celebration.style.fontSize = "64px";
  celebration.style.marginBottom = "40px";
  celebration.textContent = "💖 AJUAAAA! 💖";
  
  const gif = document.createElement("img");
  gif.src = "assets/benitogif.gif";
  gif.style.maxWidth = "400px";
  gif.style.width = "100%";
  gif.style.marginTop = "40px";
  
  dateDesc.appendChild(celebration);
  dateDesc.appendChild(gif);
});
