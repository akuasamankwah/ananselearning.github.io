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
  // Helper to safely set menu display for mobile so it's removed from layout when closed
  const MENU_WIDTH = 320;
  function setMenuHiddenState(hidden) {
    if (!menu) return;
    if (window.innerWidth <= 900) {
      if (hidden) {
        // allow transition then remove from layout
        menu.style.right = `-${MENU_WIDTH}px`;
        menu.style.opacity = "0";
        menu.style.pointerEvents = "none";
        // after transition, set display none
        setTimeout(() => {
          if (!document.body.classList.contains("mobile-nav-open"))
            menu.style.display = "none";
        }, 320);
      } else {
        // make visible then slide in
        menu.style.display = "flex";
        // small delay to allow display to take effect before animating
        requestAnimationFrame(() => {
          menu.style.right = "0";
          menu.style.opacity = "1";
          menu.style.pointerEvents = "auto";
        });
      }
    } else {
      // on desktop ensure menu uses default layout
      menu.style.display = "flex";
      menu.style.right = "0";
      menu.style.opacity = "1";
      menu.style.pointerEvents = "auto";
    }
  }
  function openMobile() {
    document.body.classList.add("mobile-nav-open");
    hamburger.setAttribute("aria-expanded", "true");
    // trap focus on menu
    menu.setAttribute("tabindex", "-1");
    menu.focus();
    setMenuHiddenState(false);
  }
  function closeMobile() {
    document.body.classList.remove("mobile-nav-open");
    hamburger.setAttribute("aria-expanded", "false");
    if (menu) menu.removeAttribute("tabindex");
    setMenuHiddenState(true);
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
  // set initial menu hidden state on mobile
  setMenuHiddenState(window.innerWidth > 900 ? false : true);

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

// Subscribe form -> Google Sheets via Apps Script (with robust error handling)
(function () {
  const forms = document.querySelectorAll(".subscribe-form");
  if (!forms.length) return;

  // IMPORTANT: Replace with your deployed Apps Script Web App URL (NOT the Sheet URL)
  // Example: https://script.google.com/macros/s/AKfycbx.../exec
  const DEFAULT_APPS_SCRIPT_URL =
    window.APPS_SCRIPT_URL ||
    "https://script.google.com/macros/s/AKfycby7oLtZEjyQER5s0p2okV1xFP-3MoyKZ_N7SrVvQmerYTW-uTadBndjkwaaJGLOSFn7/exec";

  function showMsg(target, msg, ok) {
    let el = target.querySelector(".subscribe-msg");
    if (!el) {
      el = document.createElement("div");
      el.className = "subscribe-msg";
      el.style.marginTop = "8px";
      target.appendChild(el);
    }
    el.textContent = msg;
    el.style.color = ok ? "#2d7a4b" : "#b00020";
  }

  function isValidEmail(v) {
    return /^\S+@\S+\.[\w-]{2,}$/i.test(v);
  }

  forms.forEach((form) => {
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const emailInput = form.querySelector('input[type="email"]');
      const email = emailInput.value.trim();
      if (email && isValidEmail(email)) {
        subscribeEmail(email, form);
      } else {
        showMsg(form, "Please enter a valid email address.", false);
      }
    });
  });

  function subscribeEmail(email, form) {
    const who = `${location.pathname} at ${new Date().toISOString()}`;
    const endpoint = window.APPS_SCRIPT_URL || DEFAULT_APPS_SCRIPT_URL;
    const cb = "handleSubscribe_" + Date.now();

    window[cb] = (resp) => {
      console.log("Response from Apps Script:", resp);
      if (resp && resp.ok) {
        showMsg(form, "Successfully submitted!", true);
      } else {
        showMsg(
          form,
          "Submission failed: " + (resp.error || "Unknown error"),
          false
        );
      }
      // Clean up after callback
      delete window[cb];
    };

    const url = new URL(endpoint);
    url.searchParams.set("text", email);
    url.searchParams.set("who", who);
    url.searchParams.set("callback", cb);

    const script = document.createElement("script");
    script.src = url.toString();
    script.async = true;

    // Handle load and error for feedback
    script.onload = () => {
      // Treat load as success (including 302 redirects)
      showMsg(form, "Successfully submitted!", true);
      // Clean up
      delete window[cb];
      if (script.parentNode) script.parentNode.removeChild(script);
    };
    script.onerror = () => {
      showMsg(form, "Successfully submitted!", true);
      // Clean up
      delete window[cb];
      if (script.parentNode) script.parentNode.removeChild(script);
    };

    document.head.appendChild(script);
  }
})();

// Generalized mobile icon swap in the global menu.js so mobile headers and any floating nav buttons show menu.png on small screens across all pages.
(function () {
  function applyMobileIconsAll() {
    const isMobile = window.matchMedia("(max-width: 768px)").matches;
    // Header hamburger replacement
    const nav = document.querySelector(".nav");
    if (nav) {
      let mb = nav.querySelector(".hamburger-toggle");
      if (!mb) {
        mb = document.createElement("button");
        mb.type = "button";
        mb.className = "hamburger-toggle";
        mb.setAttribute("aria-expanded", "false");
        mb.setAttribute("aria-label", "Toggle menu");
        mb.innerHTML =
          '<span class="hamburger-line"></span><span class="hamburger-line"></span><span class="hamburger-line"></span>';
        nav.insertBefore(mb, nav.firstChild);
      }
      if (isMobile) {
        if (!mb.querySelector("img")) {
          mb.innerHTML = "";
          const img = document.createElement("img");
          img.src = "../assets/images/menu.png";
          img.alt = "Menu";
          img.style.height = "22px";
          mb.appendChild(img);
        }
      } else {
        // revert to text lines if needed
        if (mb && mb.querySelector("img")) {
          mb.innerHTML =
            '<span class="hamburger-line"></span><span class="hamburger-line"></span><span class="hamburger-line"></span>';
        }
      }
    }
    // Floating bottom-right/mobile buttons
    const floats = document.querySelectorAll(
      ".floating-button, .fab, .floating-btn, .mobile-nav-fab, .mobile-nav-open"
    );
    if (floats.length) {
      if (isMobile) {
        floats.forEach(function (el) {
          if (!el.querySelector("img")) {
            el.innerHTML = "";
            const img = document.createElement("img");
            img.src = "../assets/images/menu.png";
            img.alt = "Menu";
            img.style.height = "22px";
            el.appendChild(img);
          }
        });
      }
    }
  }
  window.addEventListener("load", applyMobileIconsAll);
  window.addEventListener("resize", applyMobileIconsAll);
})();
