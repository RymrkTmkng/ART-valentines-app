// ---------- ELEMENTS ----------
const bouquet = document.getElementById("bouquet");
const valentineModal = document.getElementById("valentineModal");
const finalModal = document.getElementById("finalModal");
const yesBtn = document.getElementById("yesBtn");
const noBtn = document.getElementById("noBtn");
const finalText = document.getElementById("finalText");
const bgMusic = document.getElementById("bgMusic");
const confettiCanvas = document.getElementById("confettiCanvas");
const ctx = confettiCanvas.getContext("2d");

// ---------- CONFIG ----------
bgMusic.volume = 0.4;

// ---------- MODAL LOGIC ----------
bouquet.addEventListener("click", () => {
  valentineModal.style.display = "flex";
  bgMusic.play();
});

// ---------- YES BUTTON ----------
yesBtn.addEventListener("click", () => {
  valentineModal.style.display = "none";
  finalModal.style.display = "flex";

  // Start typing effect
  typeEffect(finalText, `Happy Valentine's Day Langga! \n I LOVE YOU 💙`, 100);

  // Start animations
  startConfetti();
  startHearts();
  startFireworks();
});

// ---------- NO BUTTON SWAP ----------
noBtn.addEventListener("mouseenter", swapButtons);
noBtn.addEventListener("touchstart", swapButtons);

function swapButtons() {
  const parent = noBtn.parentNode;
  if (parent.firstElementChild === noBtn) parent.appendChild(noBtn);
  else parent.insertBefore(noBtn, yesBtn);
}

// ---------- PETALS ----------
function createPetal() {
  const petal = document.createElement("div");
  petal.classList.add("petal");
  petal.style.left = Math.random() * 100 + "vw";
  petal.style.animationDuration = 3 + Math.random() * 5 + "s";
  petal.style.opacity = Math.random();
  document.querySelector(".petals").appendChild(petal);
  setTimeout(() => petal.remove(), 8000);
}
setInterval(createPetal, 200);

// ---------- CONFETTI ----------
let confetti = [];
const colors = ["#FF4D6D", "#FFB1B1", "#FF7EB3", "#FF3D7F", "#FF66A3"];
function startConfetti() {
  confetti = [];
  for (let i = 0; i < 100; i++) {
    confetti.push({
      x: Math.random() * window.innerWidth,
      y: Math.random() * -window.innerHeight,
      r: Math.random() * 6 + 4,
      d: Math.random() * 30,
      color: colors[Math.floor(Math.random() * colors.length)],
      tilt: Math.floor(Math.random() * 10) - 10,
      tiltAngleIncremental: Math.random() * 0.07 + 0.05,
      tiltAngle: 0,
    });
  }
  drawConfetti();
}

function drawConfetti() {
  ctx.clearRect(0, 0, confettiCanvas.width, confettiCanvas.height);
  for (let i = 0; i < confetti.length; i++) {
    let c = confetti[i];
    ctx.beginPath();
    ctx.lineWidth = c.r / 2;
    ctx.strokeStyle = c.color;
    ctx.moveTo(c.x + c.tilt + c.r / 4, c.y);
    ctx.lineTo(c.x + c.tilt, c.y + c.tilt + c.r / 4);
    ctx.stroke();
  }
  for (let i = 0; i < confetti.length; i++) {
    let c = confetti[i];
    c.tiltAngle += c.tiltAngleIncremental;
    c.y += (Math.cos(c.d) + 3 + c.r / 2) / 2;
    c.x += Math.sin(c.d);
    c.tilt = Math.sin(c.tiltAngle) * 15;
    if (c.y > window.innerHeight) {
      c.x = Math.random() * window.innerWidth;
      c.y = -10;
    }
  }
  requestAnimationFrame(drawConfetti);
}
window.addEventListener("resize", () => {
  confettiCanvas.width = window.innerWidth;
  confettiCanvas.height = window.innerHeight;
});
confettiCanvas.width = window.innerWidth;
confettiCanvas.height = window.innerHeight;

// ---------- HEARTS ----------
function startHearts() {
  for (let i = 0; i < 15; i++) {
    const heart = document.createElement("div");
    heart.classList.add("heart");
    heart.style.left = Math.random() * 90 + "vw";
    document.querySelector(".hearts").appendChild(heart);
    setTimeout(() => heart.remove(), 2500);
  }
}

// ---------- FIREWORKS ----------
function startFireworks() {
  const fwContainer = document.querySelector(".fireworks");
  for (let i = 0; i < 5; i++) {
    const circle = document.createElement("div");
    circle.style.position = "absolute";
    circle.style.width = "10px";
    circle.style.height = "10px";
    circle.style.backgroundColor = "yellow";
    circle.style.borderRadius = "50%";
    circle.style.left = Math.random() * window.innerWidth + "px";
    circle.style.top = Math.random() * window.innerHeight * 0.5 + "px";
    circle.style.opacity = 1;
    fwContainer.appendChild(circle);
    animateFirework(circle);
  }
}
function animateFirework(circle) {
  const top = parseFloat(circle.style.top);
  let progress = 0;
  const interval = setInterval(() => {
    progress += 0.03;
    circle.style.transform = `translateY(${progress * 100}px) scale(${1 - progress})`;
    circle.style.opacity = 1 - progress;
    if (progress >= 1) {
      circle.remove();
      clearInterval(interval);
    }
  }, 30);
}

// ---------- TYPING EFFECT ----------
function typeEffect(element, message, speed = 100) {
  element.textContent = "";
  let index = 0;
  const interval = setInterval(() => {
    if (index < message.length) {
      element.textContent += message.charAt(index);
      index++;
    } else {
      clearInterval(interval);
    }
  }, speed);
}

// ---------- PRELOAD GIFT MODAL ----------
const preloadModal = document.getElementById("preloadModal");
const spinner = document.getElementById("spinner");

window.addEventListener("load", () => {
  preloadModal.style.display = "flex";

  let duration = 3; // seconds
  spinner.style.animationDuration = `${duration}s`; // rotate once over duration

  // Automatically fade out modal after duration
  setTimeout(() => {
    preloadModal.classList.add("fade-out");
    setTimeout(() => {
      preloadModal.style.display = "none";
    }, 1000);
  }, duration * 1000);
});
