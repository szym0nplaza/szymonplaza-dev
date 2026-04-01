const revealElements = [...document.querySelectorAll(".reveal")];
const typewriterText = document.querySelector("#typewriter-text");
const contactForm = document.querySelector("#contact-form");

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

  revealElements.forEach((element) => observer.observe(element));
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
