/* =========================================================
   BeautéCalendrier — site configuration
   Change merchant / affiliate destinations here only.
   ========================================================= */
const SITE_CONFIG = {
  // Destination of every "Découvrir le produit" CTA (replace with your affiliate link)
  merchantUrl: "https://girly-room.com/products/l-oreal-paris-calendrier-avent-2026",
  merchantName: "Girly Room",
  social: {
    facebook: "https://www.facebook.com/",
    instagram: "https://www.instagram.com/",
    pinterest: "https://www.pinterest.fr/",
  },
};

(function () {
  "use strict";

  /* ---------- config → links ---------- */
  document.querySelectorAll("[data-cta]").forEach((a) => {
    a.href = SITE_CONFIG.merchantUrl;
  });
  document.querySelectorAll("[data-merchant]").forEach((el) => {
    el.textContent = SITE_CONFIG.merchantName;
  });
  document.querySelectorAll("[data-social]").forEach((a) => {
    const url = SITE_CONFIG.social[a.dataset.social];
    if (url) a.href = url;
  });
  document.querySelectorAll("[data-year]").forEach((el) => {
    el.textContent = new Date().getFullYear();
  });

  /* ---------- header: shadow on scroll + mobile menu ---------- */
  const header = document.querySelector(".site-header");
  const toggle = document.querySelector(".nav-toggle");
  const nav = document.getElementById("site-nav");

  const onScroll = () => header.classList.toggle("is-scrolled", window.scrollY > 8);
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });

  const setMenu = (open) => {
    nav.classList.toggle("is-open", open);
    toggle.setAttribute("aria-expanded", String(open));
    toggle.setAttribute("aria-label", open ? "Fermer le menu" : "Ouvrir le menu");
  };
  toggle.addEventListener("click", () => setMenu(!nav.classList.contains("is-open")));
  nav.addEventListener("click", (e) => { if (e.target.closest("a")) setMenu(false); });
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && nav.classList.contains("is-open")) { setMenu(false); toggle.focus(); }
  });
  document.addEventListener("click", (e) => {
    if (nav.classList.contains("is-open") && !header.contains(e.target)) setMenu(false);
  });
  window.matchMedia("(min-width: 961px)").addEventListener("change", (e) => { if (e.matches) setMenu(false); });

  /* ---------- active nav link ---------- */
  const navLinks = [...document.querySelectorAll('.site-nav ul a[href^="#"]')];
  const sections = navLinks.map((a) => document.querySelector(a.getAttribute("href"))).filter(Boolean);
  if ("IntersectionObserver" in window) {
    const spy = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        navLinks.forEach((a) => a.classList.toggle("is-active", a.getAttribute("href") === "#" + entry.target.id));
      });
    }, { rootMargin: "-45% 0px -50% 0px" });
    sections.forEach((s) => spy.observe(s));
  }

  /* ---------- scroll reveal ---------- */
  const reveals = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window && !location.search.includes("static")) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) { entry.target.classList.add("is-visible"); io.unobserve(entry.target); }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -40px 0px" });
    reveals.forEach((el, i) => {
      if (el.classList.contains("why-card")) el.style.transitionDelay = (i % 4) * 70 + "ms";
      io.observe(el);
    });
  } else {
    reveals.forEach((el) => el.classList.add("is-visible"));
  }

  /* ---------- FAQ accordion (one open at a time) ---------- */
  const faqItems = [...document.querySelectorAll(".faq-item")];
  const setItem = (item, open) => {
    item.classList.toggle("is-open", open);
    item.querySelector(".faq-q").setAttribute("aria-expanded", String(open));
  };
  faqItems.forEach((item) => {
    item.querySelector(".faq-q").addEventListener("click", () => {
      const willOpen = !item.classList.contains("is-open");
      faqItems.forEach((other) => setItem(other, false));
      setItem(item, willOpen);
    });
  });

  /* ---------- product carousel ---------- */
  document.querySelectorAll("[data-carousel]").forEach((root) => {
    const track = root.querySelector(".carousel-track");
    const cards = [...track.children];
    const dotsWrap = root.querySelector(".carousel-dots");
    const prev = root.querySelector(".prev");
    const next = root.querySelector(".next");
    let dots = [];

    const step = () => {
      const gap = parseFloat(getComputedStyle(track).columnGap) || 0;
      return cards[0].getBoundingClientRect().width + gap;
    };
    const maxIndex = () => {
      const max = track.scrollWidth - track.clientWidth;
      return Math.max(0, Math.round(max / step()));
    };
    const current = () => Math.round(track.scrollLeft / step());
    const goTo = (i) => {
      const last = maxIndex();
      if (i < 0) i = last;
      if (i > last) i = 0;
      track.scrollTo({ left: i * step() });
      dots.forEach((d, n) => d.setAttribute("aria-current", n === i ? "true" : "false"));
    };

    const buildDots = () => {
      const count = maxIndex() + 1;
      if (dots.length === count) return;
      dotsWrap.innerHTML = "";
      dots = Array.from({ length: count }, (_, i) => {
        const b = document.createElement("button");
        b.type = "button";
        b.setAttribute("aria-label", "Aller à la position " + (i + 1) + " sur " + count);
        b.addEventListener("click", () => goTo(i));
        dotsWrap.appendChild(b);
        return b;
      });
      dotsWrap.hidden = count < 2;
      update();
    };
    const update = () => {
      const i = Math.min(current(), dots.length - 1);
      dots.forEach((d, n) => d.setAttribute("aria-current", n === i ? "true" : "false"));
    };

    prev.addEventListener("click", () => goTo(current() - 1));
    next.addEventListener("click", () => goTo(current() + 1));
    track.addEventListener("keydown", (e) => {
      if (e.key === "ArrowRight") { e.preventDefault(); goTo(current() + 1); }
      if (e.key === "ArrowLeft") { e.preventDefault(); goTo(current() - 1); }
    });
    let raf;
    track.addEventListener("scroll", () => { cancelAnimationFrame(raf); raf = requestAnimationFrame(update); }, { passive: true });
    window.addEventListener("resize", buildDots);
    buildDots();
  });
})();
