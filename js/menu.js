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

  async function submitWithTimeout(url, options, ms = 8000) {
    const ctrl = new AbortController();
    const t = setTimeout(
      () => ctrl.abort(new Error("Timeout after " + ms + "ms")),
      ms
    );
    try {
      const res = await fetch(url, { ...options, signal: ctrl.signal });
      clearTimeout(t);
      return res;
    } catch (e) {
      clearTimeout(t);
      throw e;
    }
  }

  forms.forEach((form) => {
    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      const emailInput = form.querySelector('input[type="email"]');
      const btn = form.querySelector('button[type="submit"], .btn');
      const endpoint =
        form.getAttribute("data-endpoint") || DEFAULT_APPS_SCRIPT_URL;

      console.log("Subscribe form submit initiated. Endpoint:", endpoint);

      if (!emailInput) {
        console.error("Email input field not found in form");
        showMsg(form, "Email field missing.", false);
        return;
      }
      const email = (emailInput.value || "").trim();
      console.log("Email value:", email);
      if (!isValidEmail(email)) {
        console.log("Invalid email format");
        showMsg(form, "Please enter a valid email address.", false);
        return;
      }

      btn && (btn.disabled = true);
      showMsg(form, "Submitting...", true);

      // Build payload as URLSearchParams for application/x-www-form-urlencoded
      const data = new URLSearchParams();
      data.append("text", email);
      data.append("who", `${location.pathname} at ${new Date().toISOString()}`);

      console.log("FormData prepared:", {
        text: email,
        who: `${location.pathname} at ${new Date().toISOString()}`,
      });

      try {
        // Prefer CORS JSON response for error handling if allowed.
        let res;
        let responseText = "";
        try {
          console.log("Attempting CORS request to:", endpoint);
          res = await submitWithTimeout(endpoint, {
            method: "POST",
            body: data,
            mode: "cors",
          });
          console.log("CORS response status:", res.status, res.statusText);
          if (!res.ok)
            throw new Error("HTTP " + res.status + ": " + res.statusText);
          // Try read response JSON/text for OK acknowledgement
          const ct = res.headers.get("content-type") || "";
          console.log("Response content-type:", ct);
          if (ct.includes("application/json")) {
            const j = await res.json();
            console.log("JSON response:", j);
            if (j && j.ok !== true)
              throw new Error(j.error || "Submission failed");
          } else {
            responseText = await res.text();
            console.log("Text response:", responseText);
            // Accept any non-empty OK-ish response
            if (/error|fail/i.test(responseText)) throw new Error(responseText);
          }
        } catch (corsErr) {
          console.warn(
            "CORS failed, falling back to no-cors:",
            corsErr.message
          );
          // Fallback to no-cors (cannot read response, but request is sent)
          await submitWithTimeout(endpoint, {
            method: "POST",
            body: data,
            mode: "no-cors",
          });
          console.log("No-cors request sent successfully");
        }

        console.log("Submission successful");
        showMsg(form, "Thanks! You are subscribed.", true);
        emailInput.value = "";
      } catch (err) {
        console.error("Subscribe error:", err);
        let hint = "";
        if (String(err).includes("Timeout")) hint = " (network timeout)";
        if (String(err).includes("Failed to fetch"))
          hint = " (network error, check connection)";
        if (String(err).includes("CORS"))
          hint = " (CORS issue, check Apps Script deployment)";
        if (
          endpoint.includes(
            "script.google.com/macros/s/AKfycby7oLtZEjyQER5s0p2okV1xFP-3MoyKZ_N7SrVvQmerYTW-uTadBndjkwaaJGLOSFn7"
          )
        ) {
          hint =
            " (configure your Apps Script Web App URL - see console for sample code)";
          console.log("Sample Google Apps Script code for doPost function:");
          console.log(`
function doPost(e) {
  try {
    let text = '';
    let who = '';

    if (e && e.postData && e.postData.type === 'application/json') {
      const data = JSON.parse(e.postData.contents || '{}');
      text = data.text || '';
      who = data.who || '';
    } else {
      // Fallback: form-encoded or raw body
      text = (e && e.parameter && e.parameter.text) || (e && e.postData && e.postData.contents) || '';
      who  = (e && e.parameter && e.parameter.who) || '';
    }

    appendText_(text, who);
    return asJson_({ ok: true, appended: { text, who } });
  } catch (err) {
    return asJson_({ ok: false, error: String(err) });
  }
}

function appendText_(text, who) {
  if (!text) throw new Error('No text provided.');
  const ss = SpreadsheetApp.openById('YOUR_SPREADSHEET_ID');
  const sh = ss.getSheetByName('YOUR_SHEET_NAME') || ss.getSheets()[0];
  sh.appendRow([new Date(), text, who || Session.getActiveUser().getEmail() || '']);
}

function asJson_(obj) {
  return ContentService
    .createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}
          `);
        }
        showMsg(
          form,
          "Sorry, something went wrong" + hint + ". Please try again.",
          false
        );
      } finally {
        btn && (btn.disabled = false);
      }
    });
  });
})();

// Footer toggle
document.addEventListener("DOMContentLoaded", function () {
  const footerToggle = document.querySelector(".footer-toggle");
  if (footerToggle) {
    footerToggle.addEventListener("click", function () {
      document.querySelector(".footer").classList.toggle("expanded");
    });
  }
});
