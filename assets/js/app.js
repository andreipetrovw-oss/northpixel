(function () {
  "use strict";

  const LS = {
    site: "np_site",
    packages: "np_packages",
    cases: "np_cases",
  };

  const PATHS = {
    site: "content/site.json",
    packages: "content/packages.json",
    cases: "content/cases.json",
  };

  const $ = (s, r = document) => r.querySelector(s);

  async function loadJSON(lsKey, url) {
    // 1) пробуем localStorage (админка)
    const raw = localStorage.getItem(lsKey);
    if (raw) {
      try { return JSON.parse(raw); } catch(e) {}
    }
    // 2) иначе — из /content/*.json
    const res = await fetch(url, { cache: "no-store" });
    if (!res.ok) throw new Error(`Failed to load ${url} (${res.status})`);
    return await res.json();
  }

  function setText(id, value) {
    const el = document.getElementById(id);
    if (el && typeof value === "string") el.textContent = value;
  }
  function setHref(id, href) {
    const el = document.getElementById(id);
    if (el && href) el.setAttribute("href", href);
  }

  function renderStats(stats) {
    const wrap = $("#hero_stats");
    if (!wrap) return;
    wrap.innerHTML = "";
    (stats || []).slice(0,3).forEach(s => {
      const div = document.createElement("div");
      div.className = "stat";
      div.innerHTML = `
        <div class="stat__k">${escapeHTML(s.k || "")}</div>
        <div class="stat__v">${escapeHTML(s.v || "")}</div>
      `;
      wrap.appendChild(div);
    });
  }

  function renderCards(targetId, cards) {
    const wrap = document.getElementById(targetId);
    if (!wrap) return;
    wrap.innerHTML = "";
    (cards || []).forEach(c => {
      const div = document.createElement("div");
      div.className = "card";
      div.innerHTML = `
        <div class="card__icon"></div>
        <h3 class="card__title">${escapeHTML(c.title || "")}</h3>
        <p class="card__text">${escapeHTML(c.text || "")}</p>
      `;
      wrap.appendChild(div);
    });
  }

  function renderSteps(steps) {
    const wrap = document.getElementById("process_steps");
    if (!wrap) return;
    wrap.innerHTML = "";
    (steps || []).slice(0,4).forEach((s, i) => {
      const div = document.createElement("div");
      div.className = "step";
      div.innerHTML = `
        <div class="step__n">${i + 1}</div>
        <div class="step__t">${escapeHTML(s.title || "")}</div>
        <p class="step__d">${escapeHTML(s.text || "")}</p>
      `;
      wrap.appendChild(div);
    });
  }

  function renderCases(items) {
    const wrap = document.getElementById("cases_grid");
    if (!wrap) return;
    wrap.innerHTML = "";
    (items || []).forEach(c => {
      const div = document.createElement("div");
      div.className = "card";
      const tags = Array.isArray(c.tags) ? c.tags : [];
      div.innerHTML = `
        <div class="case__top">
          <h3 class="case__name">${escapeHTML(c.name || "")}</h3>
          ${c.link ? `<a class="btn btn--ghost" href="${escapeAttr(c.link)}" target="_blank" rel="noopener">View</a>` : ``}
        </div>
        <p class="case__desc">${escapeHTML(c.description || "")}</p>
        <div class="tags">
          ${tags.map(t => `<span class="tag">${escapeHTML(t)}</span>`).join("")}
        </div>
      `;
      wrap.appendChild(div);
    });
  }

  function renderPricing(items) {
    const wrap = document.getElementById("pricing_cards");
    if (!wrap) return;
    wrap.innerHTML = "";
    (items || []).forEach(p => {
      const div = document.createElement("div");
      div.className = "card " + (p.featured ? "price--featured" : "");
      const bullets = Array.isArray(p.bullets) ? p.bullets : [];
      div.innerHTML = `
        <h3 class="price__name">${escapeHTML(p.name || "")}</h3>
        <div class="price__value">${escapeHTML(p.price || "")}</div>
        <div class="price__hint">${escapeHTML(p.hint || "")}</div>
        <ul class="ul">
          ${bullets.map(b => `<li>${escapeHTML(b)}</li>`).join("")}
        </ul>
        <a class="btn btn--primary price__cta" href="#contact">${escapeHTML(p.cta || "Get a quote")}</a>
      `;
      wrap.appendChild(div);
    });
  }

  function renderFAQ(items) {
    const wrap = document.getElementById("faq_items");
    if (!wrap) return;
    wrap.innerHTML = "";
    (items || []).forEach(f => {
      const d = document.createElement("details");
      d.innerHTML = `
        <summary>${escapeHTML(f.q || "")}</summary>
        <p>${escapeHTML(f.a || "")}</p>
      `;
      wrap.appendChild(d);
    });
  }

  function escapeHTML(str) {
    return String(str)
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#039;");
  }
  function escapeAttr(str){ return escapeHTML(str); }

  function wireForm(formConfig) {
    const form = document.getElementById("lead_form");
    const hint = document.getElementById("form_hint");
    if (!form) return;

    const endpoint = (formConfig && formConfig.formspreeEndpoint) || "";
    if (endpoint && !endpoint.includes("YOUR_FORMSPREE")) {
      hint.textContent = "Form connected. We’ll receive your message instantly.";
    } else {
      hint.textContent = "This form is “demo” until you connect Formspree (2 minutes).";
    }

    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      const data = Object.fromEntries(new FormData(form).entries());

      if (!endpoint || endpoint.includes("YOUR_FORMSPREE")) {
        alert("Form is not connected yet. Open /admin → Settings → paste your Formspree endpoint.");
        return;
      }

      try {
        const res = await fetch(endpoint, {
          method: "POST",
          headers: { "Content-Type": "application/json", "Accept": "application/json" },
          body: JSON.stringify(data)
        });
        if (!res.ok) throw new Error("Send failed");
        form.reset();
        alert("Sent ✅ We’ll reply soon.");
      } catch (err) {
        alert("Error sending. Try again or message us directly.");
      }
    });
  }

  async function main() {
    try {
      const [site, packages, cases] = await Promise.all([
        loadJSON(LS.site, PATHS.site),
        loadJSON(LS.packages, PATHS.packages),
        loadJSON(LS.cases, PATHS.cases),
      ]);

      // Site basics
      setText("site_brand", site.brand);
      setText("site_footer_brand", site.brand);
      setText("site_h1", site.heroTitle);
      setText("site_subtitle", site.heroSubtitle);
      setText("site_pill", site.heroPill);

      setText("site_problem_title", site.problemTitle);
      setText("site_problem_text", site.problemText);

      setText("site_services_title", site.servicesTitle);
      setText("site_services_text", site.servicesText);

      setText("site_process_title", site.processTitle);
      setText("site_process_text", site.processText);

      setText("site_portfolio_title", site.portfolioTitle);
      setText("site_portfolio_text", site.portfolioText);

      setText("site_pricing_title", site.pricingTitle);
      setText("site_pricing_text", site.pricingText);

      setText("site_faq_title", site.faqTitle);
      setText("site_faq_text", site.faqText);

      setText("site_contact_title", site.contactTitle);
      setText("site_contact_text", site.contactText);

      // contact links
      const phone = site.phone || "+372 0000000";
      const email = site.email || "info@northpixel.com";

      setText("site_location", site.location || "Tallinn, Estonia");
      setText("site_footer_location", site.location || "Tallinn, Estonia");

      setText("site_phone_link", phone);
      setText("site_phone_link_2", phone);
      setText("site_footer_phone", phone);

      setHref("site_phone_link", `tel:${phone.replace(/\s+/g,"")}`);
      setHref("site_phone_link_2", `tel:${phone.replace(/\s+/g,"")}`);
      setHref("site_footer_phone", `tel:${phone.replace(/\s+/g,"")}`);

      setText("site_email_link", email);
      setText("site_footer_email", email);
      setHref("site_email_link", `mailto:${email}`);
      setHref("site_footer_email", `mailto:${email}`);

      // buttons
      setText("site_primary_btn", site.primaryBtnText || "View pricing");
      setText("site_secondary_btn", site.secondaryBtnText || "See work");

      renderStats(site.stats);
      renderCards("problem_cards", site.problemCards);
      renderCards("services_cards", site.serviceCards);
      renderSteps(site.processSteps);
      renderCases(cases.items);
      renderPricing(packages.items);
      renderFAQ(site.faqItems);

      // form
      wireForm(site);

      // copyright
      const year = new Date().getFullYear();
      setText("site_copyright", `© ${year} ${site.brand || "NorthPixel"}. All rights reserved.`);
    } catch (err) {
      console.error(err);
      document.body.innerHTML = `
        <div style="padding:24px;font-family:Inter,Arial">
          <h2>Site failed to load content</h2>
          <p>Open DevTools → Console to see the error.</p>
          <pre>${String(err)}</pre>
        </div>
      `;
    }
  }

  main();
})();
