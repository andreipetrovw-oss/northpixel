(function () {
  "use strict";

  const MAP = {
    site: { ls: "np_site", url: "../content/site.json" },
    packages: { ls: "np_packages", url: "../content/packages.json" },
    cases: { ls: "np_cases", url: "../content/cases.json" }
  };

  let current = "site";

  const editor = document.getElementById("editor");
  const status = document.getElementById("status");

  const tabs = Array.from(document.querySelectorAll(".tab"));
  tabs.forEach(t => t.addEventListener("click", () => {
    tabs.forEach(x => x.classList.remove("active"));
    t.classList.add("active");
    current = t.dataset.tab;
    loadFromLocalOrContent();
  }));

  async function loadFromContent() {
    const { url } = MAP[current];
    const res = await fetch(url, { cache: "no-store" });
    if (!res.ok) throw new Error(`Failed to load ${url} (${res.status})`);
    const json = await res.json();
    editor.value = JSON.stringify(json, null, 2);
    status.textContent = "Loaded from /content ✅";
  }

  function loadFromLocal() {
    const { ls } = MAP[current];
    const raw = localStorage.getItem(ls);
    if (!raw) {
      status.textContent = "No local changes found.";
      return;
    }
    editor.value = JSON.stringify(JSON.parse(raw), null, 2);
    status.textContent = "Loaded from localStorage ✅ (site uses this)";
  }

  async function loadFromLocalOrContent() {
    const { ls } = MAP[current];
    const raw = localStorage.getItem(ls);
    if (raw) {
      loadFromLocal();
    } else {
      await loadFromContent();
    }
  }

  function saveToLocal() {
    const { ls } = MAP[current];
    let parsed;
    try {
      parsed = JSON.parse(editor.value);
    } catch (e) {
      alert("Invalid JSON. Fix it and try again.");
      return;
    }
    localStorage.setItem(ls, JSON.stringify(parsed));
    status.textContent = "Saved ✅ Open the site in a new tab and refresh.";
  }

  function downloadJSON() {
    let parsed;
    try {
      parsed = JSON.parse(editor.value);
    } catch (e) {
      alert("Invalid JSON. Fix it first.");
      return;
    }
    const blob = new Blob([JSON.stringify(parsed, null, 2)], { type: "application/json" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = current + ".json";
    document.body.appendChild(a);
    a.click();
    a.remove();
    status.textContent = "Downloaded ✅ (commit it to GitHub to make it permanent)";
  }

  function clearAll() {
    Object.values(MAP).forEach(v => localStorage.removeItem(v.ls));
    status.textContent = "Cleared local changes ✅";
  }

  document.getElementById("btn_load").addEventListener("click", loadFromContent);
  document.getElementById("btn_load_local").addEventListener("click", loadFromLocal);
  document.getElementById("btn_save").addEventListener("click", saveToLocal);
  document.getElementById("btn_download").addEventListener("click", downloadJSON);
  document.getElementById("btn_clear").addEventListener("click", clearAll);

  loadFromLocalOrContent().catch(err => {
    console.error(err);
    status.textContent = "Error: " + String(err);
  });
})();
