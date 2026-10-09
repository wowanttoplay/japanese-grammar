// Apply before the stylesheet loads so returning readers avoid a bright flash.
(() => {
  const key = "mnn2-grammar-theme-v1";
  const root = document.documentElement;
  const system = window.matchMedia("(prefers-color-scheme: dark)");
  const readPreference = () => {
    try {
      const value = localStorage.getItem(key);
      return value === "dark" || value === "light" ? value : null;
    } catch { return null; }
  };
  let preference = readPreference();
  let button;
  const apply = () => {
    const dark = preference ? preference === "dark" : system.matches;
    root.dataset.theme = dark ? "dark" : "light";
    if (button) {
      button.setAttribute("aria-pressed", String(dark));
      button.querySelector("[data-theme-label]").textContent = dark ? "日间模式" : "夜间模式";
      button.title = dark ? "切换到日间模式" : "切换到夜间模式";
    }
  };
  apply();
  system.addEventListener("change", apply);
  window.addEventListener("storage", event => {
    if (event.key === key || event.key === null) {
      preference = readPreference();
      apply();
    }
  });
  const setup = () => {
    button = document.querySelector("[data-theme-toggle]");
    if (!button) return;
    button.hidden = false;
    button.addEventListener("click", () => {
      preference = root.dataset.theme === "dark" ? "light" : "dark";
      try { localStorage.setItem(key, preference); } catch { /* Keep this tab usable without storage. */ }
      apply();
    });
    apply();
  };
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", setup, {once:true});
  else setup();
})();
