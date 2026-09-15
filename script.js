// =============================================
// CONTATOS
// Preencha WhatsApp e/ou e-mail antes de publicar.
// WhatsApp: somente números, com 55 + DDD + número.
// =============================================
const CONTACT = {
  whatsapp: "5512981120575",
  email: "Kaynankaragua@gmail.com",
  discord: "thekay0001"
};

const buttons = document.getElementById("contactButtons");

function createLink(label, detail, href, primary = false) {
  const link = document.createElement("a");
  link.className = `contact-button${primary ? " primary" : ""}`;
  link.href = href;

  if (href.startsWith("http")) {
    link.target = "_blank";
    link.rel = "noopener";
  }

  link.innerHTML = `
    <span>${label}</span>
    <span>${detail} ↗</span>
  `;

  buttons.appendChild(link);
}

if (CONTACT.whatsapp) {
  const message = encodeURIComponent(
    "Olá, Kaynan! Vi seu portfólio e gostaria de conversar sobre um projeto."
  );

  createLink(
    "Falar pelo WhatsApp",
    "Abrir conversa",
    `https://wa.me/${CONTACT.whatsapp}?text=${message}`,
    true
  );
}

if (CONTACT.email) {
  createLink(
    "Enviar e-mail",
    CONTACT.email,
    `mailto:${CONTACT.email}`,
    !CONTACT.whatsapp
  );
}

if (CONTACT.discord) {
  const button = document.createElement("button");
  button.className =
    `contact-button${(!CONTACT.whatsapp && !CONTACT.email) ? " primary" : ""}`;
  button.type = "button";
  button.innerHTML = `
    <span>Discord</span>
    <span>${CONTACT.discord} • copiar</span>
  `;

  button.addEventListener("click", async () => {
    try {
      await navigator.clipboard.writeText(CONTACT.discord);

      const old = button.innerHTML;
      button.innerHTML = `
        <span>Discord</span>
        <span>Copiado ✓</span>
      `;

      setTimeout(() => {
        button.innerHTML = old;
      }, 1700);
    } catch {
      alert(`Discord: ${CONTACT.discord}`);
    }
  });

  buttons.appendChild(button);
}

if (!CONTACT.whatsapp && !CONTACT.email) {
  const helper = document.createElement("div");
  helper.className = "contact-helper";
  helper.textContent =
    "Adicione seu WhatsApp ou e-mail no script.js antes de publicar.";
  buttons.appendChild(helper);
}

// Menu mobile
const menuButton = document.querySelector(".menu-button");
const navLinks = document.querySelector(".nav-links");

menuButton.addEventListener("click", () => {
  const opened = navLinks.classList.toggle("open");
  menuButton.setAttribute("aria-expanded", String(opened));
  document.body.classList.toggle("menu-open", opened);
});

document.querySelectorAll(".nav-links a").forEach(link => {
  link.addEventListener("click", () => {
    navLinks.classList.remove("open");
    document.body.classList.remove("menu-open");
    menuButton.setAttribute("aria-expanded", "false");
  });
});

// Entrada suave de elementos
const observer = new IntersectionObserver(
  entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        observer.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.12 }
);

document.querySelectorAll(".reveal").forEach(el => observer.observe(el));

document.getElementById("year").textContent = new Date().getFullYear();




// ==========================================================
// Slider de exemplos V3
// ==========================================================
const demoSlider = document.getElementById("demoSlider");
const demoPrev = document.querySelector(".demo-arrow-left");
const demoNext = document.querySelector(".demo-arrow-right");

if (demoSlider) {
  const step = () => Math.min(demoSlider.clientWidth * 0.78, 520);

  demoPrev?.addEventListener("click", () => {
    demoSlider.scrollBy({ left: -step(), behavior: "smooth" });
  });

  demoNext?.addEventListener("click", () => {
    demoSlider.scrollBy({ left: step(), behavior: "smooth" });
  });

  let dragging = false;
  let startX = 0;
  let startScroll = 0;

  demoSlider.addEventListener("pointerdown", (event) => {
    if (event.target.closest("a,button")) return;
    dragging = true;
    startX = event.clientX;
    startScroll = demoSlider.scrollLeft;
    demoSlider.classList.add("is-dragging");
    demoSlider.setPointerCapture?.(event.pointerId);
  });

  demoSlider.addEventListener("pointermove", (event) => {
    if (!dragging) return;
    demoSlider.scrollLeft = startScroll - (event.clientX - startX);
  });

  const stopDrag = () => {
    dragging = false;
    demoSlider.classList.remove("is-dragging");
  };

  demoSlider.addEventListener("pointerup", stopDrag);
  demoSlider.addEventListener("pointercancel", stopDrag);
  demoSlider.addEventListener("pointerleave", stopDrag);
}
