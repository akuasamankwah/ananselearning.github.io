// Menu behavior: keep last-open dropdown open until another top menu hovered or user navigated away
(function () {
  const nav = document.querySelector(".nav");
  if (!nav) return;
  const dropdowns = Array.from(nav.querySelectorAll(".dropdown"));
  let clearTimer = null;
  function closeAll() {
    dropdowns.forEach((d) => d.classList.remove("open"));
  }
  dropdowns.forEach((d) => {
    d.addEventListener("mouseenter", () => {
      if (clearTimer) {
        clearTimeout(clearTimer);
        clearTimer = null;
      }
      closeAll();
      d.classList.add("open");
    });
    d.addEventListener("focusin", () => {
      if (clearTimer) {
        clearTimeout(clearTimer);
        clearTimer = null;
      }
      closeAll();
      d.classList.add("open");
    });
  });
  // when leaving nav, keep last open for a short period before closing
  nav.addEventListener("mouseleave", () => {
    if (clearTimer) clearTimeout(clearTimer);
    clearTimer = setTimeout(() => {
      closeAll();
      clearTimer = null;
    }, 800);
  });
  // close immediately on click outside
  document.addEventListener("click", (e) => {
    if (!nav.contains(e.target)) closeAll();
  });
})();
