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

  // Mobile hamburger: dynamically insert button if not present
  let hamburger = nav.querySelector(".hamburger-toggle");
  if (!hamburger) {
    hamburger = document.createElement("button");
    hamburger.type = "button";
    hamburger.className = "hamburger-toggle";
    hamburger.setAttribute("aria-expanded", "false");
    hamburger.setAttribute("aria-label", "Toggle menu");
    hamburger.innerHTML =
      '<span class="hamburger-line"></span><span class="hamburger-line"></span><span class="hamburger-line"></span>';
    nav.insertBefore(hamburger, nav.firstChild);
  }

  const menu = nav.querySelector(".menu");
  function openMobile() {
    document.body.classList.add("mobile-nav-open");
    hamburger.setAttribute("aria-expanded", "true");
    // trap focus on menu
    menu.setAttribute("tabindex", "-1");
    menu.focus();
  }
  function closeMobile() {
    document.body.classList.remove("mobile-nav-open");
    hamburger.setAttribute("aria-expanded", "false");
    if (menu) menu.removeAttribute("tabindex");
  }
  hamburger.addEventListener("click", (e) => {
    e.stopPropagation();
    const isOpen = document.body.classList.contains("mobile-nav-open");
    if (isOpen) closeMobile();
    else openMobile();
  });

  // Mobile floating sidebar toggle (three dash) - appears on mobile to reveal/collapse side menu
  let sidebarToggle = document.querySelector(".sidebar-toggle");
  if (!sidebarToggle) {
    sidebarToggle = document.createElement("button");
    sidebarToggle.className = "sidebar-toggle";
    sidebarToggle.type = "button";
    sidebarToggle.setAttribute("aria-label", "Open sidebar");
    sidebarToggle.innerHTML =
      '<span class="dash"></span><span class="dash"></span><span class="dash"></span>';
    document.body.appendChild(sidebarToggle);
  }
  sidebarToggle.addEventListener("click", (e) => {
    e.stopPropagation();
    const isOpen = document.body.classList.contains("mobile-nav-open");
    if (isOpen) closeMobile();
    else openMobile();
  });

  // hide sidebar toggle on resize to desktop
  window.addEventListener("resize", () => {
    if (window.innerWidth > 900) {
      if (sidebarToggle) sidebarToggle.style.display = "none";
    } else {
      if (sidebarToggle) sidebarToggle.style.display = "inline-flex";
    }
  });
  // initialize visibility
  if (window.innerWidth > 900) sidebarToggle.style.display = "none";

  // close mobile menu on resize to large screens
  window.addEventListener("resize", () => {
    if (window.innerWidth > 900) closeMobile();
  });

  // close on ESC key
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeMobile();
  });

  // click outside to close mobile menu
  document.addEventListener("click", (e) => {
    if (!nav.contains(e.target)) closeMobile();
  });

  // close mobile menu when main content area is clicked (so users can tap the page to collapse)
  const mainArea = document.querySelector("main");
  if (mainArea) {
    mainArea.addEventListener("click", (e) => {
      // if mobile menu is open and click is not inside the menu, close it
      if (
        document.body.classList.contains("mobile-nav-open") &&
        !nav.contains(e.target)
      ) {
        closeMobile();
      }
    });
  }
})();
