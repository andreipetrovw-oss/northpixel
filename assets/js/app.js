/* ==========================================================================
   NorthPixel - app.js (loads JSON + renders + form + animations)
   ========================================================================== */

(function () {
  "use strict";

  const CONFIG = {
    // ⚠️ Поменяй на свой Formspree endpoint (если хочешь заявки):
    // пример: https://formspree.io/f/xzbqwvyz
    formspreeEndpoint: "https://formspree.io/f/YOUR_FORMSPREE_ID",

    content: {
      site: "/content/site.json",
      packages: "/content/packages.json",
      cases: "/content/cases.json",
    },
  };

  async function fetchJSON(url) {
    const r = await fetch(url, { cache: "no-store" });
    if (!r.ok) throw new Error(`Failed to load ${url}: ${r.status}`);
    return r.json();
  }

  function $(sel) { return document.querySelector(sel); }
  function $all(sel) { return Array.from(document.querySelectorAll(sel)); }

  function setText(id, value) {
    const el = document.getElementById(id);
    if (el && typeof value === "string") el.textContent = value;
  }

  function escapeHTML(str) {
    return String(str)
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#039;");
  }

  function renderCases(items) {
    const grid = $("#cases-grid");
    if (!grid) return;
    grid.innerHTML = "";

    (items || []).forEach((c) => {
      const tags = Array.isArray(c.tags) ? c.tags : [];
      const tagHTML = tags.map(t => `<span class="case-tag">${escapeHTML(t)}</span>`).join("");

      const el = document.createElement("div");
      el.className = "card case-card fade-in";
      el.innerHTML = `
        <img class="case-image" src="${escapeHTML(c.image || "")}" alt="${escapeHTML(c.title || "Case")}" loading="lazy" />
        <div class="case-content">
          <div class="case-title">${escapeHTML(c.title || "")}</div>
          <div class="case-description">${escapeHTML(c.description || "")}</div>
          ${c.testimonial ? `<div class="case-testimonial">“${escapeHTML(c.testimonial)}”</div>` : ""}
          ${tagHTML ? `<div class="case-tags">${tagHTML}</div>` : ""}
        </div>
      `;
      grid.appendChild(el);
    });
  }

  function renderPackages(items) {
    const grid = $("#packages-grid");
    if (!grid) return;
    grid.innerHTML = "";

    (items || []).forEach((p) => {
      const card = document.createElement("div");
      card.className = "card package-card fade-in" + (p.featured ? " featured" : "");
      card.innerHTML = `
        ${p.featured ? `<div class="package-badge">Most Popular</div>` : ""}
        <div class="package-name">${escapeHTML(p.name || "")}</div>
        <div class="package-price">${escapeHTML(p.price || "")}</div>
        <div class="package-duration">${escapeHTML(p.duration || "")}</div>
        <ul class="package-features">
          ${(p.features || []).map(f => `<li>${escapeHTML(f)}</li>`).join("")}
        </ul>
        <a class="btn btn-secondary btn-full" href="#contact">Choose & Request</a>
      `;
      grid.appendChild(card);
    });
  }

  function initFAQ() {
    $all(".faq-item").forEach((item) => {
      const btn = item.querySelector(".faq-question");
      if (!btn) return;
      btn.addEventListener("click", () => item.classList.toggle("open"));
    });
  }

  function initAnimations() {
    const els = $all(".fade-in");
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) e.target.classList.add("visible");
      });
    }, { threshold: 0.12 });

    els.forEach((el) => io.observe(el));
  }

  function initForm() {
    const form = $("#contact-form");
    const msg = $("#form-message");
    if (!form || !msg) return;

    form.addEventListener("submit", async (e) => {
      e.preventDefault();

      if (!CONFIG.formspreeEndpoint || CONFIG.formspreeEndpoint.includes("YOUR_FORMSPREE_ID")) {
        msg.className = "form-message error";
        msg.textContent = "Form endpoint not set. Update formspreeEndpoint in assets/js/app.js";
        return;
      }

      msg.className = "form-message";
      msg.style.display = "none";

      const data = new FormData(form);

      try {
        const r = await fetch(CONFIG.formspreeEndpoint, {
          method: "POST",
          body: data,
          headers: { Accept: "application/json" },
        });

        if (!r.ok) throw new Error("Form submit failed");

        form.reset();
        msg.className = "form-message success";
        msg.textContent = "Sent! We’ll reply within 24 hours.";
      } catch (err) {
        msg.className = "form-message error";
        msg.textContent = "Error sending. Try again or email us directly.";
      }
    });
  }

  async function loadContent() {
    try {
      const site = await fetchJSON(CONFIG.content.site);
      setText("hero-title", site?.hero?.title || "");
      setText("hero-subtitle", site?.hero?.subtitle || "");

      setText("problems-title", site?.problems?.title || "");
      setText("problems-subtitle", site?.problems?.subtitle || "");

      setText("solutions-title", site?.solutions?.title || "");
      setText("solutions-subtitle", site?.solutions?.subtitle || "");

      setText("process-title", site?.process?.title || "");
      setText("process-subtitle", site?.process?.subtitle || "");
    } catch (e) {
      // Если site.json не загрузился — сайт все равно будет виден (в HTML есть дефолтный текст)
      console.warn(e);
    }

    try {
      const pk = await fetchJSON(CONFIG.content.packages);
      renderPackages(pk?.items || []);
    } catch (e) {
      console.warn(e);
    }

    try {
      const cs = await fetchJSON(CONFIG.content.cases);
      renderCases(cs?.items || []);
    } catch (e) {
      console.warn(e);
    }
  }

  function init() {
    initFAQ();
    initAnimations();
    initForm();
    loadContent();
  }

  document.addEventListener("DOMContentLoaded", init);
})();
