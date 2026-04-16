const usageInput = document.querySelector("#usage");
const usageValue = document.querySelector("#usage-value");
const vehicleInput = document.querySelector("#vehicle");
const tariffInput = document.querySelector("#tariff");
const savingsAmount = document.querySelector("#savings-amount");
const estimateCopy = document.querySelector("#estimate-copy");
const heroHeading = document.querySelector("[data-typewriter]");

const vehicleFactors = {
  tesla: 1,
  nissan: 0.82,
  hyundai: 1.08,
  kia: 1.04,
};

const tariffFactors = {
  standard: 1,
  economy7: 1.14,
  octopus: 1.2,
};

function formatPounds(amount) {
  return new Intl.NumberFormat("en-GB", {
    style: "currency",
    currency: "GBP",
    maximumFractionDigits: 0,
  }).format(amount);
}

function updateEstimate() {
  const usage = Number(usageInput.value);
  const vehicleFactor = vehicleFactors[vehicleInput.value] ?? 1;
  const tariffFactor = tariffFactors[tariffInput.value] ?? 1;
  const savings = Math.round((260 + usage * 9.5) * vehicleFactor * tariffFactor);
  const percentage = ((usage - Number(usageInput.min)) / (Number(usageInput.max) - Number(usageInput.min))) * 100;

  usageValue.textContent = usage;
  usageInput.style.setProperty("--fill", `${percentage}%`);
  savingsAmount.textContent = formatPounds(savings);
  estimateCopy.textContent = `Based on 2026 UK energy rates, ${vehicleInput.options[vehicleInput.selectedIndex].text}, and your usage pattern`;
}

function runTypewriter() {
  if (!heroHeading) {
    return;
  }

  const text = heroHeading.textContent.trim();
  const sessionKey = `typewriter:${location.pathname || "/"}`;

  if (sessionStorage.getItem(sessionKey) === "done") {
    heroHeading.textContent = text;
    heroHeading.classList.add("typewriter-done");
    return;
  }

  heroHeading.textContent = "";
  let index = 0;

  const tick = () => {
    heroHeading.textContent = text.slice(0, index);
    index += 1;

    if (index <= text.length) {
      window.setTimeout(tick, 42);
      return;
    }

    heroHeading.classList.add("typewriter-done");
    sessionStorage.setItem(sessionKey, "done");
  };

  tick();
}

function setupScrollReveal() {
  const revealTargets = [
    ...document.querySelectorAll("main .section"),
    ...document.querySelectorAll(".video-card"),
    ...document.querySelectorAll(".timeline-item"),
    ...document.querySelectorAll(".benefit-card"),
    ...document.querySelectorAll(".savings-notes article"),
    ...document.querySelectorAll(".news-card"),
    ...document.querySelectorAll(".story-item"),
  ];

  if (!revealTargets.length) {
    return;
  }

  revealTargets.forEach((element, index) => {
    if (!element.hasAttribute("data-reveal")) {
      element.setAttribute("data-reveal", "up");
    }

    element.style.transitionDelay = `${Math.min(index % 4, 3) * 90}ms`;
  });

  const revealElement = (element) => {
    element.classList.add("is-visible");
  };

  if (!("IntersectionObserver" in window)) {
    revealTargets.forEach(revealElement);
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) {
          return;
        }

        revealElement(entry.target);
        observer.unobserve(entry.target);
      });
    },
    {
      threshold: 0.16,
      rootMargin: "0px 0px -8% 0px",
    }
  );

  revealTargets.forEach((element) => observer.observe(element));
}

if (usageInput && usageValue && vehicleInput && tariffInput && savingsAmount && estimateCopy) {
  [usageInput, vehicleInput, tariffInput].forEach((element) => {
    element.addEventListener("input", updateEstimate);
    element.addEventListener("change", updateEstimate);
  });

  updateEstimate();
}

runTypewriter();
setupScrollReveal();
