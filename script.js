// ====================== CONFIGURAÇÃO ======================
const NOME = "Juliane";

// Coloque as fotos na pasta assets/fotos/ com os nomes abaixo.
// Se a foto não existir, aparece um lugar reservado bem bonito.
const FOTOS = [
  "assets/fotos/foto1.jpg",
  "assets/fotos/foto2.jpg",
  "assets/fotos/foto3.jpg",
  "assets/fotos/foto4.jpg",
  "assets/fotos/foto5.jpg",
  "assets/fotos/foto6.jpg",
  "assets/fotos/foto7.jpg",
  "assets/fotos/foto8.jpg",
  "assets/fotos/foto9.jpg",
  "assets/fotos/foto10.jpg"
];

// Frases românticas que aparecem ao clicar em cada foto
const LEGENDAS = [
  "O dia em que meu coração escolheu você 💕",
  "Seu sorriso é o meu lugar favorito ✨",
  "Cada momento ao seu lado é especial",
  "Você me faz acreditar em contos de fadas 💖",
  "O amor mora no seu olhar",
  "Meu mundo ficou completo com você",
  "Para sempre o meu sim 💍",
  "Você é a melhor parte dos meus dias",
  "Te amo mais do que as palavras alcançam",
  "Feliz aniversário, meu eterno amor ❤️"
];

// ====================== CHUVA DE CORAÇÕES INTERATIVA ======================
const canvas = document.getElementById("hearts");
const ctx = canvas.getContext("2d");
let hearts = [];
let mouse = { x: null, y: null };
let isFinalScreen = false;
let interactionEnabled = true; // controla se o canvas responde a cliques

function resize() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
window.addEventListener("resize", resize);
resize();

function drawHeart(ctx, x, y, size, color, alpha) {
  ctx.save();
  ctx.translate(x, y);
  ctx.scale(size / 30, size / 30);
  ctx.beginPath();
  ctx.moveTo(0, 6);
  ctx.bezierCurveTo(0, 0, -10, -8, -15, -8);
  ctx.bezierCurveTo(-25, -8, -25, 5, -25, 5);
  ctx.bezierCurveTo(-25, 15, -12, 22, 0, 30);
  ctx.bezierCurveTo(12, 22, 25, 15, 25, 5);
  ctx.bezierCurveTo(25, 5, 25, -8, 15, -8);
  ctx.bezierCurveTo(8, -8, 0, 0, 0, 6);
  ctx.closePath();
  ctx.fillStyle = color;
  ctx.globalAlpha = alpha;
  ctx.shadowColor = color;
  ctx.shadowBlur = 12;
  ctx.fill();
  ctx.restore();
}

class Heart {
  constructor(x = null, y = null, burst = false) {
    this.x = x !== null ? x : Math.random() * canvas.width;
    this.y = y !== null ? y : Math.random() * canvas.height - canvas.height;
    this.size = burst ? Math.random() * 16 + 10 : Math.random() * 18 + 10;
    this.speed = burst ? Math.random() * 3 + 1.5 : Math.random() * 1.4 + 0.6;
    this.opacity = burst ? Math.random() * 0.5 + 0.5 : Math.random() * 0.55 + 0.25;
    this.swing = Math.random() * 0.04 + 0.015;
    this.angle = Math.random() * Math.PI * 2;
    this.vx = burst ? (Math.random() - 0.5) * 8 : 0;
    this.vy = burst ? (Math.random() - 0.5) * 6 - 2 : 0;
    this.life = burst ? 1 : null;
    this.decay = burst ? Math.random() * 0.015 + 0.008 : 0;
    this.color = Math.random() > 0.25 ? "#ff4d6d" : "#ff8fa3";
    this.rotation = Math.random() * Math.PI * 2;
    this.rotationSpeed = (Math.random() - 0.5) * 0.04;
  }

  update() {
    if (this.life !== null) {
      this.x += this.vx;
      this.y += this.vy;
      this.vy += 0.08;
      this.vx *= 0.98;
      this.life -= this.decay;
      this.opacity = this.life;
      this.rotation += this.rotationSpeed;
      return this.life > 0;
    }

    this.y += this.speed;
    this.angle += this.swing;
    this.x += Math.sin(this.angle) * 0.9;
    this.rotation += this.rotationSpeed;

    if (mouse.x !== null) {
      const dx = this.x - mouse.x;
      const dy = this.y - mouse.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < 120) {
        const force = (120 - dist) / 120;
        this.x += (dx / dist) * force * 2.2;
        this.y += (dy / dist) * force * 1.5;
      }
    }

    if (this.y > canvas.height + 40) {
      this.y = -40;
      this.x = Math.random() * canvas.width;
      this.size = Math.random() * 18 + 10;
      this.speed = Math.random() * 1.4 + 0.6;
      this.opacity = Math.random() * 0.55 + 0.25;
    }
    return true;
  }

  draw() {
    ctx.save();
    ctx.translate(this.x, this.y);
    ctx.rotate(this.rotation);
    drawHeart(ctx, 0, 0, this.size, this.color, this.opacity);
    ctx.restore();
  }
}

function createHearts() {
  const count = window.innerWidth < 600 ? 35 : 55;
  for (let i = 0; i < count; i++) {
    hearts.push(new Heart());
  }
}

function burstHearts(x, y, amount = 18) {
  for (let i = 0; i < amount; i++) {
    hearts.push(new Heart(x, y, true));
  }
}

function animateHearts() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  hearts = hearts.filter(h => {
    const alive = h.update();
    if (alive) h.draw();
    return alive;
  });
  if (hearts.length > 180) {
    hearts = hearts.slice(-140);
  }
  requestAnimationFrame(animateHearts);
}

createHearts();
animateHearts();

// Interação mouse / toque — só no canvas e quando permitido
function handlePointer(e) {
  const touch = e.touches ? e.touches[0] : e;
  mouse.x = touch.clientX;
  mouse.y = touch.clientY;
}

function handleClick(e) {
  if (!interactionEnabled) return;
  // Só explode se o clique for realmente no canvas (não em botões/UI)
  if (e.target !== canvas && e.target.closest && e.target.closest(".screen") && !e.target.closest("#final")) {
    return;
  }
  const touch = e.changedTouches ? e.changedTouches[0] : e;
  const x = touch.clientX;
  const y = touch.clientY;
  burstHearts(x, y, isFinalScreen ? 28 : 16);
}

canvas.addEventListener("mousemove", handlePointer);
canvas.addEventListener("touchmove", handlePointer, { passive: true });
canvas.addEventListener("click", handleClick);
canvas.addEventListener("touchend", handleClick, { passive: true });

// Também permite estourar corações na tela final tocando em qualquer lugar
window.addEventListener("click", function (e) {
  if (isFinalScreen && interactionEnabled) {
    const x = e.clientX;
    const y = e.clientY;
    burstHearts(x, y, 22);
  }
});
window.addEventListener("touchend", function (e) {
  if (isFinalScreen && interactionEnabled && e.changedTouches) {
    const t = e.changedTouches[0];
    burstHearts(t.clientX, t.clientY, 22);
  }
}, { passive: true });

// ====================== UTILITÁRIOS ======================
function wait(ms) {
  return new Promise(r => setTimeout(r, ms));
}

function showScreen(id) {
  document.querySelectorAll(".screen").forEach(s => {
    s.classList.add("hidden");
  });
  const el = document.getElementById(id);
  el.classList.remove("hidden");
  isFinalScreen = (id === "final");

  // Na tela final os cliques no fundo geram corações
  // Nas outras telas o canvas fica por baixo e não atrapalha botões
  interactionEnabled = true;
}

// ====================== LIGHTBOX ======================
const lightbox = document.getElementById("lightbox");
const lightboxImg = document.getElementById("lightboxImg");
const lightboxPlaceholder = document.getElementById("lightboxPlaceholder");
const lightboxCaption = document.getElementById("lightboxCaption");

function openLightbox(src, caption, hasImage) {
  lightboxCaption.textContent = caption;
  lightboxImg.classList.remove("loaded");
  lightboxImg.src = "";

  if (hasImage) {
    lightboxPlaceholder.style.display = "none";
    lightboxImg.onload = () => {
      lightboxImg.classList.add("loaded");
    };
    lightboxImg.onerror = () => {
      lightboxPlaceholder.style.display = "flex";
      lightboxImg.classList.remove("loaded");
    };
    lightboxImg.src = src;
  } else {
    lightboxPlaceholder.style.display = "flex";
  }

  lightbox.classList.remove("hidden");
  interactionEnabled = false; // evita conflito com a chuva de corações
}

function closeLightbox() {
  lightbox.classList.add("hidden");
  interactionEnabled = true;
}

document.getElementById("lightboxClose").addEventListener("click", (e) => {
  e.stopPropagation();
  closeLightbox();
});

lightbox.addEventListener("click", (e) => {
  if (e.target === lightbox) closeLightbox();
});

// ====================== SEQUÊNCIA ======================
async function start() {
  // Contagem 3-2-1
  for (let i = 3; i >= 1; i--) {
    document.getElementById("count").textContent = i;
    await wait(1000);
  }

  // Texto principal
  showScreen("main-text");
  document.getElementById("name").textContent = NOME;

  await wait(350);
  document.getElementById("line1").classList.add("show");
  await wait(650);
  document.getElementById("line2").classList.add("show");
  await wait(650);
  document.getElementById("line3").classList.add("show");
  await wait(550);
  document.getElementById("big-heart").classList.add("show");

  await wait(3200);

  // Cena fofa
  showScreen("cute-scene");
  await wait(4200);

  // Cartinha
  showScreen("letter-screen");
  loadMiniPhotos();
}

// ====================== CARTINHA ======================
document.getElementById("envelope").addEventListener("click", function (e) {
  e.stopPropagation();
  this.classList.add("open");
  document.getElementById("hint").style.display = "none";
});

document.getElementById("btnGallery").addEventListener("click", function (e) {
  e.stopPropagation();
  openHeartGallery();
});

document.getElementById("btnFinal").addEventListener("click", function (e) {
  e.stopPropagation();
  showFinal();
});

function createPhotoSlot(src, index, isMini = false) {
  const slot = document.createElement("div");
  slot.className = isMini ? "photo-slot" : "heart-photo";
  slot.dataset.index = index;

  const img = document.createElement("img");
  img.alt = "Nosso momento";
  img.style.display = "none";

  const placeholder = document.createElement("span");
  placeholder.className = "placeholder-icon";
  placeholder.textContent = "📷";

  let hasImage = false;

  img.onload = () => {
    hasImage = true;
    img.style.display = "block";
    placeholder.style.display = "none";
  };
  img.onerror = () => {
    hasImage = false;
    img.style.display = "none";
    placeholder.style.display = "block";
  };
  img.src = src;

  slot.appendChild(img);
  slot.appendChild(placeholder);

  slot.addEventListener("click", (e) => {
    e.stopPropagation();
    const caption = LEGENDAS[index] || LEGENDAS[0];
    openLightbox(src, caption, hasImage);
  });

  return slot;
}

function loadMiniPhotos() {
  const container = document.getElementById("miniPhotos");
  container.innerHTML = "";
  FOTOS.slice(0, 4).forEach((src, i) => {
    container.appendChild(createPhotoSlot(src, i, true));
  });
}

// ====================== GALERIA CORAÇÃO ======================
function openHeartGallery() {
  showScreen("heart-gallery");
  createHeartPhotos();
}

function createHeartPhotos() {
  const container = document.getElementById("heartPhotos");
  container.innerHTML = "";

  const isMobile = window.innerWidth < 600;
  const centerX = isMobile ? 170 : 240;
  const centerY = isMobile ? 170 : 240;
  const scale = isMobile ? 7.8 : 11;
  const sizeOffset = isMobile ? 27 : 36;

  const positions = generateHeartPositions(FOTOS.length, centerX, centerY, scale, sizeOffset);

  FOTOS.forEach((src, i) => {
    const slot = createPhotoSlot(src, i, false);
    slot.style.left = positions[i].x + "px";
    slot.style.top = positions[i].y + "px";
    container.appendChild(slot);

    setTimeout(() => {
      slot.classList.add("show");
    }, i * 80);
  });
}

function generateHeartPositions(count, centerX, centerY, scale, sizeOffset) {
  const positions = [];
  for (let i = 0; i < count; i++) {
    const t = (i / count) * Math.PI * 2;
    const x = 16 * Math.pow(Math.sin(t), 3);
    const y = -(13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t));
    positions.push({
      x: centerX + x * scale - sizeOffset,
      y: centerY + y * scale - sizeOffset
    });
  }
  return positions;
}

function showFinal() {
  showScreen("final");
}

// Inicia
window.onload = start;
