(() => {
  "use strict";

  const y = document.documentElement.classList.add('js');
  if (y) y.textContent = String(new Date().getFullYear());

  const burger = document.getElementById("burger");
  const menu = document.getElementById("mobileMenu");
  if (burger && menu) {
    burger.addEventListener("click", () => {
      const open = burger.getAttribute("aria-expanded") === "true";
      burger.setAttribute("aria-expanded", String(!open));
      menu.style.display = open ? "none" : "grid";
      menu.setAttribute("aria-hidden", String(open));
    });

    menu.querySelectorAll("a").forEach(a => {
      a.addEventListener("click", () => {
        burger.setAttribute("aria-expanded", "false");
        menu.style.display = "none";
        menu.setAttribute("aria-hidden", "true");
      });
    });
  }

  document.querySelectorAll(".faqItem").forEach((btn) => {
    btn.addEventListener("click", () => btn.classList.toggle("open"));
  });

  const els = Array.from(document.querySelectorAll(".reveal"));
  const io = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (e.isIntersecting) {
        e.target.classList.add("on");
        io.unobserve(e.target);
      }
    });
  }, { threshold: 0.12 });
  els.forEach(el => io.observe(el));

  const form = document.getElementById("contactForm");
  if (form) {
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      alert("Тест деплоя ✅\nФорму подключим после того как решим, нравится дизайн или нет.");
    });
  }
})();
