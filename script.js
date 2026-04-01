const revealElements = [...document.querySelectorAll(".reveal")];
const scrollGatedRevealElements = revealElements.filter((element) => element.hasAttribute("data-reveal-after-scroll"));
const immediateRevealElements = revealElements.filter((element) => !element.hasAttribute("data-reveal-after-scroll"));
const typewriterText = document.querySelector("#typewriter-text");
const contactForm = document.querySelector("#contact-form");
const copyIconButtons = [...document.querySelectorAll(".copy-icon-button")];
const copyToast = document.querySelector("#copy-toast");
const openCalendlyModalButton = document.querySelector("#open-calendly-modal");
const closeCalendlyModalButton = document.querySelector("#close-calendly-modal");
const calendlyModal = document.querySelector("#calendly-modal");
const calendlyEmbed = document.querySelector("#calendly-embed");
const calendlyShell = document.querySelector("#calendly-shell");

const typingPhrases = [
  "Building project...",
  "Acquiring state lock...",
  "Executing database query...",
];

if (!("IntersectionObserver" in window) || window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
  revealElements.forEach((element) => element.classList.add("is-visible"));
} else {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) {
          return;
        }

        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      });
    },
    {
      threshold: 0.18,
      rootMargin: "0px 0px -8% 0px",
    }
  );

  immediateRevealElements.forEach((element) => observer.observe(element));

  const unlockScrollGatedReveals = () => {
    scrollGatedRevealElements.forEach((element) => observer.observe(element));
    window.removeEventListener("scroll", unlockScrollGatedReveals);
    window.removeEventListener("wheel", unlockScrollGatedReveals);
    window.removeEventListener("touchmove", unlockScrollGatedReveals);
    window.removeEventListener("keydown", onKeydownUnlock);
  };

  const onKeydownUnlock = (event) => {
    const scrollKeys = ["ArrowDown", "ArrowUp", "PageDown", "PageUp", "Home", "End", "Space"];

    if (scrollKeys.includes(event.code) || scrollKeys.includes(event.key)) {
      unlockScrollGatedReveals();
    }
  };

  window.addEventListener("scroll", unlockScrollGatedReveals, { passive: true, once: true });
  window.addEventListener("wheel", unlockScrollGatedReveals, { passive: true, once: true });
  window.addEventListener("touchmove", unlockScrollGatedReveals, { passive: true, once: true });
  window.addEventListener("keydown", onKeydownUnlock);
}

if (typewriterText && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
  let phraseIndex = 0;
  let charIndex = 0;
  let isDeleting = false;

  const tick = () => {
    const current = typingPhrases[phraseIndex];

    if (isDeleting) {
      charIndex -= 1;
    } else {
      charIndex += 1;
    }

    typewriterText.textContent = current.slice(0, charIndex);

    let delay = isDeleting ? 45 : 80;

    if (!isDeleting && charIndex === current.length) {
      delay = 1400;
      isDeleting = true;
    } else if (isDeleting && charIndex === 0) {
      isDeleting = false;
      phraseIndex = (phraseIndex + 1) % typingPhrases.length;
      delay = 320;
    }

    window.setTimeout(tick, delay);
  };

  typewriterText.textContent = "";
  window.setTimeout(tick, 500);
}

if (contactForm) {
  contactForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const name = document.querySelector("#contact-name")?.value.trim() ?? "";
    const email = document.querySelector("#contact-email")?.value.trim() ?? "";
    const subject = document.querySelector("#contact-subject")?.value.trim() ?? "";
    const message = document.querySelector("#contact-message")?.value.trim() ?? "";

    const body = [
      `Name: ${name}`,
      `Email: ${email}`,
      "",
      message,
    ].join("\n");

    const mailtoUrl = `mailto:szymon.plaza01@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    window.location.href = mailtoUrl;
  });
}

const copyToClipboard = async (value) => {
  if (navigator.clipboard?.writeText) {
    await navigator.clipboard.writeText(value);
    return;
  }

  const fallbackTextArea = document.createElement("textarea");
  fallbackTextArea.value = value;
  fallbackTextArea.setAttribute("readonly", "");
  fallbackTextArea.style.position = "absolute";
  fallbackTextArea.style.left = "-9999px";
  document.body.appendChild(fallbackTextArea);
  fallbackTextArea.select();
  document.execCommand("copy");
  document.body.removeChild(fallbackTextArea);
};

let copyToastTimeoutId;

const showCopyToast = (message) => {
  if (!copyToast) {
    return;
  }

  copyToast.textContent = message;
  copyToast.classList.add("is-visible");
  window.clearTimeout(copyToastTimeoutId);
  copyToastTimeoutId = window.setTimeout(() => {
    copyToast.classList.remove("is-visible");
  }, 1400);
};

copyIconButtons.forEach((button) => {
  button.addEventListener("click", async () => {
    const value = button.getAttribute("data-copy");

    if (!value) {
      return;
    }

    const srOnlyLabel = button.querySelector(".sr-only");
    const originalLabel = srOnlyLabel?.textContent ?? "Copy";

    try {
      await copyToClipboard(value);
      showCopyToast("Copied to clipboard");
      if (srOnlyLabel) {
        srOnlyLabel.textContent = "Copied";
      }
    } catch {
      showCopyToast("Copy failed");
      if (srOnlyLabel) {
        srOnlyLabel.textContent = "Copy failed";
      }
    }

    window.setTimeout(() => {
      if (srOnlyLabel) {
        srOnlyLabel.textContent = originalLabel;
      }
    }, 1200);
  });
});

if (calendlyEmbed && calendlyShell && calendlyModal && openCalendlyModalButton && closeCalendlyModalButton) {
  const markCalendlyLoaded = () => {
    calendlyShell.classList.add("is-loaded");
  };

  calendlyEmbed.addEventListener("load", markCalendlyLoaded, { once: true });

  const openCalendlyModal = () => {
    calendlyModal.classList.add("is-open");
    calendlyModal.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";

    if (!calendlyEmbed.src) {
      calendlyEmbed.src = calendlyEmbed.dataset.src ?? "";
      window.setTimeout(markCalendlyLoaded, 5000);
    }
  };

  const closeCalendlyModal = () => {
    calendlyModal.classList.remove("is-open");
    calendlyModal.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
  };

  openCalendlyModalButton.addEventListener("click", openCalendlyModal);
  closeCalendlyModalButton.addEventListener("click", closeCalendlyModal);
  calendlyModal.addEventListener("click", (event) => {
    if (event.target instanceof HTMLElement && event.target.hasAttribute("data-close-calendly")) {
      closeCalendlyModal();
    }
  });
  window.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && calendlyModal.classList.contains("is-open")) {
      closeCalendlyModal();
    }
  });
}
