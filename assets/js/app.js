/* NorthPixel — loads JSON + renders cases/pricing + form + animations */

(() => {
  'use strict';

  const CONFIG = {
    // ✅ поменяешь позже (если хочешь заявки)
    // пример: https://formspree.io/f/xzbqwvyz
    formspreeEndpoint: "https://formspree.io/f/YOUR_FORMSPREE_ID",

    content: {
      site: "content/site.json",
      packages: "content/packages.json",
      cases: "content/cases.json",
    },
  };

  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));

  async function fetchJSON(url) {
    const r = await fetch(url, { cache: "no-store" });
    if (!r.ok) throw new Error(`Failed to load ${url}: ${r.status}`);
    return r.json();
  }

  function escapeHTML(str) {
    return String(str)
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#039;");
  }

  // ===== Animations (safe) =====
  let fadeObserver = null;

  function initFadeObserver() {
    if (!('IntersectionObserver' in window)) {
      // fallback: show everything
      $$('.fade-in').forEach(el => el.classList.add('visible'));
      return;
    }

    fadeObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          fadeObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -40px 0px" });

    $$('.fade-in').forEach(el => fadeObserver.observe(el));
  }

  function observeFadeIns(root = document) {
    if (!fadeObserver) return;
    $$('.fade-in', root).forEach(el => {
      if (!el.classList.contains('visible')) fadeObserver.observe(el);
    });
  }

  // ===== Render dynamic blocks =====
  function setText(id, value) {
    const el = document.getElementById(id);
    if (el && typeof value === "string") el.textContent = value;
  }

  function renderCases(items) {
    const grid = $("#cases-grid");
    if (!grid) return;

    grid.innerHTML = "";

    (items || []).forEach(c => {
      const tags = Array.isArray(c.tags) ? c.tags : [];
      const tagsHTML = tags.map(t => `<span class="tag">${escapeHTML(t)}</span>`).join("");

      const el = document.createElement("article");
      el.className = "case fade-in";
      el.innerHTML = `
        <img src="${escapeHTML(c.image || "")}" alt="${escapeHTML(c.title || "Project")}" loading="lazy">
        <div class="case-body">
          <div class="case-title">${escapeHTML(c.title || "")}</div>
          <div class="case-desc">${escapeHTML(c.description || "")}</div>
          ${tags.length ? `<div class="case-tags">${tagsHTML}</div>` : ""}
        </div>
      `;
      grid.appendChild(el);
    });

    observeFadeIns(grid);
  }

  function renderPackages(items) {
    const grid = $("#packages-grid");
    if (!grid) return;

    grid.innerHTML = "";

    (items || []).forEach(p => {
      const features = Array.isArray(p.features) ? p.features : [];
      const featuresHTML = features.map(f => `<li>${escapeHTML(f)}</li>`).join("");

      const el = document.createElement("article");
      el.className = "price fade-in";
      el.innerHTML = `
        ${p.featured ? `<div class="badge">Most Popular</div>` : ""}
        <h3>${escapeHTML(p.name || "")}</h3>
        <div class="amount">${escapeHTML(p.price || "")}</div>
        <div class="time">${escapeHTML(p.duration || "")}</div>
        <ul class="features">${featuresHTML}</ul>
        <a class="btn btn-ghost btn-full" href="#contact">Request this package</a>
      `;
      grid.appendChild(el);
    });

    observeFadeIns(grid);
  }

  // ===== FAQ =====
  function initFAQ() {
    $$('.faq-item').forEach(item => {
      const btn = $('.faq-q', item);
      if (!btn) return;
      btn.addEventListener('click', () => item.classList.toggle('open'));
    });
  }

  // ===== Form (optional) =====
  function initForm() {
    const form = $("#contact-form");
    const msg = $("#form-message");
    if (!form || !msg) return;

    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      msg.className = "form-msg";
      msg.textContent = "";

      // If endpoint not set — just show a success UI (no crash)
      if (!CONFIG.formspreeEndpoint || CONFIG.formspreeEndpoint.includes("YOUR_FORMSPREE_ID")) {
        msg.classList.add("ok");
        msg.textContent = "✅ Form endpoint not set yet. Add Formspree ID in assets/js/app.js";
        return;
      }

      const data = new FormData(form);

      try {
        const r = await fetch(CONFIG.formspreeEndpoint, {
          method: "POST",
          body: data,
          headers: { "Accept": "application/json" },
        });

        if (!r.ok) throw new Error("Form submit failed");

        form.reset();
        msg.classList.add("ok");
        msg.textContent = "✅ Sent! We’ll get back to you within 24 hours.";
      } catch (err) {
        msg.classList.add("err");
        msg.textContent = "❌ Error sending form. Try again or email us directly.";
        console.error(err);
      }
    });
  }

  // ===== Load all =====
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
      console.error("Site JSON load error:", e);
    }

    try {
      const cases = await fetchJSON(CONFIG.content.cases);
      renderCases(cases?.items || []);
    } catch (e) {
      console.error("Cases JSON load error:", e);
    }

    try {
      const packages = await fetchJSON(CONFIG.content.packages);
      renderPackages(packages?.items || []);
    } catch (e) {
      console.error("Packages JSON load error:", e);
    }
  }

  function init() {
    initFadeObserver();
    initFAQ();
    initForm();
    loadContent();
  }

  document.addEventListener("DOMContentLoaded", init);
})();
