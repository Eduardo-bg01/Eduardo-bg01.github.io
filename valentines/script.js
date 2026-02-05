const noButton = document.getElementById("no-button");
const yesButton = document.getElementById("yes-button");
let yesScale = 1;

noButton.addEventListener("mouseover", () => {
  const maxX = window.innerWidth - noButton.offsetWidth;
  const maxY = window.innerHeight - noButton.offsetHeight;
  
  const x = Math.random() * Math.max(0, maxX);
  const y = Math.random() * Math.max(0, maxY);

  noButton.style.position = "fixed";
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
  
  dateDesc.innerHTML = '';
  
  const celebration = document.createElement("strong");
  celebration.textContent = "Valentines date:";
  celebration.className = "text-3xl text-valentine-red mb-4";
  
  const info = document.createElement("p");
  info.textContent = "Restaurante Fussion 9:00 PM!";
  info.className = "text-2xl text-valentine-dark font-semibold";
  
  const gif = document.createElement("img");
  gif.src = "assets/benitogif.gif";
  gif.style.maxWidth = "400px";
  gif.style.width = "100%";
  gif.style.marginTop = "40px";
  
  dateDesc.appendChild(celebration);
  dateDesc.appendChild(info);
  dateDesc.appendChild(gif);
  
  document.body.classList.add("celebrated");
});
