const translatePortfolioMessage = window.portfolioTranslate || function (message) {
  return message;
};

function setTranslatedText(element, message) {
  element.dataset.translationKey = message;
  element.textContent = translatePortfolioMessage(message);
}

const heroHeading = document.querySelector("#hero-heading");

if (heroHeading) {
  const fullName = heroHeading.textContent.trim();
  heroHeading.setAttribute("aria-label", fullName);
  heroHeading.classList.add("hero-title-animated");

  if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    heroHeading.replaceChildren(
      ...Array.from(fullName, function (character, index) {
        const letter = document.createElement("span");
        letter.className = `hero-name-letter${index < 2 ? " hero-name-initial" : ""}`;
        letter.setAttribute("aria-hidden", "true");
        letter.style.setProperty("--hero-name-delay", `${index * 45}ms`);
        letter.textContent = character === " " ? "\u00A0" : character;
        return letter;
      })
    );
  }
}

const skillsMarquee = document.querySelector("#hero-skills-marquee");
const skillsMarqueeToggle = document.querySelector("#hero-skills-toggle");

if (skillsMarquee && skillsMarqueeToggle) {
  function updateSkillsMarqueeToggle() {
    const isPaused = skillsMarquee.classList.contains("is-paused");
    const label = isPaused ? "Resume skills ticker" : "Pause skills ticker";
    const translatedLabel = translatePortfolioMessage(label);

    skillsMarqueeToggle.setAttribute("aria-label", translatedLabel);
    skillsMarqueeToggle.setAttribute("title", translatedLabel);
    skillsMarqueeToggle.setAttribute("aria-pressed", String(isPaused));
    skillsMarqueeToggle.querySelector("span").textContent = isPaused ? "▶" : "Ⅱ";
  }

  skillsMarqueeToggle.addEventListener("click", function () {
    skillsMarquee.classList.toggle("is-paused");
    updateSkillsMarqueeToggle();
  });

  document.addEventListener("portfolio-language-change", updateSkillsMarqueeToggle);
  updateSkillsMarqueeToggle();
}

document.addEventListener("portfolio-language-change", function () {
  for (const element of document.querySelectorAll("[data-translation-key]")) {
    element.textContent = translatePortfolioMessage(element.dataset.translationKey);
  }
});

// The phone menu is the <details> element in the header.
// The browser already opens and closes it when Menu is clicked.
// This file adds the extra cases the browser does not handle.
const menu = document.querySelector("header details");

if (menu) {
  const menuButton = menu.querySelector("summary");
  const menuLinks = menu.querySelectorAll("a");

  // The desktop links appear at Tailwind's lg: width, 1024 pixels.
  // From that width up, the phone menu is hidden, so close it.
  const desktopScreen = window.matchMedia("(min-width: 1024px)");

  function closeMenu() {
    menu.open = false;
  }

  function updateMenuLabel() {
    const label = menu.open ? "Close" : "Menu";
    menuButton.dataset.translationKey = label;
    menuButton.textContent = translatePortfolioMessage(label);
  }

  for (const link of menuLinks) {
    link.addEventListener("click", closeMenu);
  }

  // A click anywhere outside the menu closes it.
  document.addEventListener("click", function (event) {
    if (!menu.open) {
      return;
    }

    if (!menu.contains(event.target)) {
      closeMenu();
    }
  });

  document.addEventListener("keydown", function (event) {
    if (event.key === "Escape") {
      closeMenu();
    }
  });

  // The toggle event runs every time the menu opens or closes.
  menu.addEventListener("toggle", updateMenuLabel);

  desktopScreen.addEventListener("change", function (event) {
    if (event.matches) {
      closeMenu();
    }
  });
}

function setupDialogs(buttonSelector, dialogName) {
  const buttons = document.querySelectorAll(buttonSelector);

  for (const button of buttons) {
    const dialogId = button.getAttribute("aria-controls");
    const dialog = dialogId ? document.getElementById(dialogId) : null;

    if (!(dialog instanceof HTMLDialogElement)) {
      throw new Error(`${dialogName} dialog not found for "${dialogId || "button"}".`);
    }

    const closeButton = dialog.querySelector(".expertise-dialog-close");
    const scrollablePreview = dialog.querySelector(".project-dialog-scroll");

    if (!closeButton) {
      throw new Error(`Close button not found in ${dialogName.toLowerCase()} dialog "${dialogId}".`);
    }

    button.addEventListener("click", function () {
      dialog.showModal();

      if (scrollablePreview) {
        scrollablePreview.scrollTop = 0;
      }
    });

    closeButton.addEventListener("click", function () {
      dialog.close();
    });

    dialog.addEventListener("keydown", function (event) {
      if (event.key === "Escape") {
        event.preventDefault();
        dialog.close();
      }
    });

    dialog.addEventListener("click", function (event) {
      if (event.target === dialog) {
        dialog.close();
      }
    });
  }
}

setupDialogs(".expertise-more-button", "Expertise");
setupDialogs(".project-open-button", "Project");

const expertiseCards = document.querySelectorAll(".expertise-card");

for (const card of expertiseCards) {
  card.addEventListener("pointermove", function (event) {
    if (event.pointerType === "touch") {
      return;
    }

    const bounds = card.getBoundingClientRect();
    card.style.setProperty("--pointer-x", `${event.clientX - bounds.left}px`);
    card.style.setProperty("--pointer-y", `${event.clientY - bounds.top}px`);
  });

  card.addEventListener("pointerleave", function () {
    card.style.removeProperty("--pointer-x");
    card.style.removeProperty("--pointer-y");
  });
}

const technologyLists = document.querySelectorAll(".technology-list");

for (const technologyList of technologyLists) {
  const technologies = technologyList.querySelectorAll("li");

  technologies.forEach(function (technology, index) {
    technology.style.setProperty("--tech-delay", `${index * 55}ms`);
  });

  if ("IntersectionObserver" in window) {
    const technologyObserver = new IntersectionObserver(
      function (entries) {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            technologyObserver.unobserve(entry.target);
          }
        }
      },
      { threshold: 0.35 }
    );

    technologyObserver.observe(technologyList);
  } else {
    technologyList.classList.add("is-visible");
  }
}

const subscriptionForm = document.getElementById("subscription-form");

if (subscriptionForm) {
  const emailInput = subscriptionForm.querySelector("#subscriber-email");
  const status = subscriptionForm.querySelector("#subscription-status");
  const submitButton = subscriptionForm.querySelector('button[type="submit"]');
  const buttonLabel = subscriptionForm.querySelector(".subscription-button-label");
  const buttonSpinner = subscriptionForm.querySelector(".subscription-button-spinner");

  emailInput.addEventListener("input", function () {
    emailInput.setAttribute("aria-invalid", "false");
    status.textContent = "";
    delete status.dataset.translationKey;
    status.className = "mt-3 min-h-5 text-sm";
  });

  subscriptionForm.addEventListener("submit", async function (event) {
    event.preventDefault();
    const email = emailInput.value.trim();
    emailInput.value = email;
    status.className = "mt-3 min-h-5 text-sm";
    emailInput.setAttribute("aria-invalid", "false");

    if (!email || !emailInput.checkValidity()) {
      emailInput.setAttribute("aria-invalid", "true");
      status.classList.add("subscription-status-error");
      setTranslatedText(status, "Please enter a valid email address.");
      emailInput.focus();
      return;
    }

    const endpoint = subscriptionForm.action;

    if (endpoint.includes("YOUR_FORM_ID")) {
      status.classList.add("subscription-status-error");
      setTranslatedText(status, "Subscription is not configured yet. Replace YOUR_FORM_ID with your Formspree form ID.");
      return;
    }

    submitButton.disabled = true;
    setTranslatedText(buttonLabel, "Subscribing");
    buttonSpinner.classList.remove("hidden");

    try {
      const response = await fetch(endpoint, {
        method: "POST",
        body: new FormData(subscriptionForm),
        headers: { Accept: "application/json" },
      });

      if (response.ok) {
        status.classList.add("subscription-status-success");
        setTranslatedText(status, "Thanks for subscribing. Your email has been received.");
        subscriptionForm.reset();
        setTranslatedText(buttonLabel, "Subscribed");
      } else {
        console.error(`Formspree rejected the subscription with status ${response.status}.`);
        status.classList.add("subscription-status-error");
        setTranslatedText(status, "Could not submit your subscription. Please try again.");
      }
    } catch (error) {
      console.error("Could not send the subscription to Formspree.", error);
      status.classList.add("subscription-status-error");
      setTranslatedText(status, "Could not submit your subscription. Please try again.");
    } finally {
      submitButton.disabled = false;
      buttonSpinner.classList.add("hidden");
      window.setTimeout(function () {
        setTranslatedText(buttonLabel, "Subscribe");
      }, 1800);
    }
  });
}

const revealTargets = document.querySelectorAll(
  "#about > div, #skills > div > .section-label, #skills > div > h2, #skills > div > p:not(.section-label), #skills .expertise-card, #experience .engineering-section-heading > div, #experience .engineering-intro, #experience .engineering-stat-card, #experience .engineering-panel, #projects > div > .section-label, #projects > div > h2, #projects .project-intro, #projects .project-disclaimer, #projects .project-card, #contact > div > div, footer > div"
);
const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

if (!reducedMotion.matches && "IntersectionObserver" in window) {
  const revealObserver = new IntersectionObserver(
    function (entries) {
      for (const entry of entries) {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          revealObserver.unobserve(entry.target);
        }
      }
    },
    {
      threshold: 0.14,
      rootMargin: "0px 0px -35px 0px",
    }
  );

  const directions = ["left", "right", "up", "down"];
  const cardIndexes = new Map();

  for (const [index, target] of Array.from(revealTargets).entries()) {
    target.classList.add("scroll-reveal");
    target.classList.add(`scroll-reveal--${directions[index % directions.length]}`);

    if (target.matches(".expertise-card, .engineering-stat-card, .engineering-panel, .project-card")) {
      const parent = target.parentElement;
      const cardIndex = cardIndexes.get(parent) || 0;
      target.style.setProperty("--reveal-delay", `${Math.min(cardIndex * 100, 300)}ms`);
      cardIndexes.set(parent, cardIndex + 1);
    }

    revealObserver.observe(target);
  }

  document.body.classList.add("motion-ready");
}

