(function () {
  "use strict";

  function pad(value) {
    return String(value).padStart(2, "0");
  }

  function initCountdown() {
    const display = document.getElementById("timer");
    if (!display) return;

    const duration = Number(display.dataset.duration) || 900;
    const storageKey = display.dataset.key || "rebell-countdown-end";
    const now = Date.now();

    let endTime = localStorage.getItem(storageKey);

    if (!endTime || Number(endTime) <= now) {
      endTime = now + duration * 1000;
      localStorage.setItem(storageKey, String(endTime));
    } else {
      endTime = Number(endTime);
    }

    function updateCountdown() {
      const remainingMs = endTime - Date.now();
      const remaining = Math.max(0, Math.floor(remainingMs / 1000));

      const minutes = Math.floor(remaining / 60);
      const seconds = remaining % 60;

      display.textContent = `${pad(minutes)}:${pad(seconds)}`;

      if (remaining <= 0) {
        clearInterval(interval);
        localStorage.removeItem(storageKey);
        display.textContent = "00:00";
      }
    }

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);
  }

  function initStickyCta() {
    const sticky = document.getElementById("stickyCta");
    if (!sticky) return;

    const trigger = Number(sticky.dataset.showAfter) || 420;
    let ticking = false;

    function updateSticky() {
      if (window.scrollY > trigger) {
        sticky.classList.add("show");
      } else {
        sticky.classList.remove("show");
      }
      ticking = false;
    }

    function onScroll() {
      if (!ticking) {
        window.requestAnimationFrame(updateSticky);
        ticking = true;
      }
    }

    window.addEventListener("scroll", onScroll, { passive: true });
    updateSticky();
  }

  function initSmoothAnchorLinks() {
    const anchorLinks = document.querySelectorAll('a[href^="#"]:not([href="#"])');
    if (!anchorLinks.length) return;

    anchorLinks.forEach((link) => {
      link.addEventListener("click", function (event) {
        const targetId = this.getAttribute("href");
        const target = document.querySelector(targetId);

        if (!target) return;

        event.preventDefault();
        target.scrollIntoView({
          behavior: "smooth",
          block: "start"
        });
      });
    });
  }

  function initButtonFeedback() {
    const buttons = document.querySelectorAll(".sales-cta-main, .sticky-cta-btn.primary, .btn-primary, .cta-red");
    if (!buttons.length) return;

    buttons.forEach((button) => {
      button.addEventListener("pointerdown", function () {
        this.style.transform = "translateY(1px)";
      });

      button.addEventListener("pointerup", function () {
        this.style.transform = "";
      });

      button.addEventListener("pointerleave", function () {
        this.style.transform = "";
      });
    });
  }

  function initAutoYear() {
    const yearNodes = document.querySelectorAll("[data-current-year]");
    if (!yearNodes.length) return;

    const year = new Date().getFullYear();
    yearNodes.forEach((node) => {
      node.textContent = year;
    });
  }

  document.addEventListener("DOMContentLoaded", function () {
    initCountdown();
    initStickyCta();
    initSmoothAnchorLinks();
    initButtonFeedback();
    initAutoYear();
  });
})();