const usageInput = document.querySelector("#usage");
const usageValue = document.querySelector("#usage-value");
const vehicleInput = document.querySelector("#vehicle");
const tariffInput = document.querySelector("#tariff");
const savingsAmount = document.querySelector("#savings-amount");
const estimateCopy = document.querySelector("#estimate-copy");
const typewriterHeadings = [...document.querySelectorAll("[data-typewriter]")];
const fleetVehiclesInput = document.querySelector("#fleet-vehicles");
const fleetCapacityInput = document.querySelector("#fleet-capacity");
const fleetVehiclesValue = document.querySelector("#fleet-vehicles-value");
const fleetCapacityValue = document.querySelector("#fleet-capacity-value");
const fleetRevenueTotal = document.querySelector("#fleet-revenue-total");
const fleetDnoValue = document.querySelector("#fleet-dno-value");
const fleetWholesaleValue = document.querySelector("#fleet-wholesale-value");
const fleetBalancingValue = document.querySelector("#fleet-balancing-value");
const fleetPerEvValue = document.querySelector("#fleet-per-ev");
const fleetYear3Value = document.querySelector("#fleet-year3");
const fleetChoiceGroups = [...document.querySelectorAll("[data-fleet-choice]")];
const fleetAddonTriggers = [...document.querySelectorAll(".fleet-addon-trigger")];
const fleetModals = [...document.querySelectorAll(".fleet-modal")];
const heatingCapacityInput = document.querySelector("#heating-capacity");
const heatingCapacityValue = document.querySelector("#heating-capacity-value");
const heatingCapacityOutput = document.querySelector("#heating-capacity-output");
const heatingTypeOutput = document.querySelector("#heating-type-output");
const heatingSummary = document.querySelector("#heating-summary");
const batteryCapacityInput = document.querySelector("#battery-capacity");
const batteryCapacityValue = document.querySelector("#battery-capacity-value");
const batteryCapacityOutput = document.querySelector("#battery-capacity-output");
const batterySolarOutput = document.querySelector("#battery-solar-output");
const batterySummary = document.querySelector("#battery-summary");
const addonSaveButtons = [...document.querySelectorAll("[data-save-addon]")];

const addonState = {
  heating: false,
  battery: false,
};

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

function formatCompactPounds(amount) {
  if (amount >= 1000) {
    return `£${Math.round(amount / 1000)}K`;
  }

  return formatPounds(amount);
}

function updateEstimate() {
  if (!usageInput || !usageValue || !vehicleInput || !tariffInput || !savingsAmount || !estimateCopy) {
    return;
  }

  const usage = Number(usageInput.value);
  const vehicleFactor = vehicleFactors[vehicleInput.value] ?? 1;
  const tariffFactor = tariffFactors[tariffInput.value] ?? 1;
  const savings = Math.round((260 + usage * 9.5) * vehicleFactor * tariffFactor);
  const percentage = ((usage - Number(usageInput.min)) / (Number(usageInput.max) - Number(usageInput.min))) * 100;

  usageValue.textContent = String(usage);
  usageInput.style.setProperty("--fill", `${percentage}%`);
  savingsAmount.textContent = formatPounds(savings);
  estimateCopy.textContent = `Based on 2026 UK energy rates, ${vehicleInput.options[vehicleInput.selectedIndex].text}, and your usage pattern`;
}

function updateAddonInputs() {
  if (heatingCapacityInput && heatingCapacityValue) {
    const percentage = ((Number(heatingCapacityInput.value) - Number(heatingCapacityInput.min)) / (Number(heatingCapacityInput.max) - Number(heatingCapacityInput.min))) * 100;
    heatingCapacityValue.textContent = heatingCapacityInput.value;
    heatingCapacityInput.style.setProperty("--fill", `${percentage}%`);
  }

  if (batteryCapacityInput && batteryCapacityValue) {
    const percentage = ((Number(batteryCapacityInput.value) - Number(batteryCapacityInput.min)) / (Number(batteryCapacityInput.max) - Number(batteryCapacityInput.min))) * 100;
    batteryCapacityValue.textContent = batteryCapacityInput.value;
    batteryCapacityInput.style.setProperty("--fill", `${percentage}%`);
  }
}

function updateFleetCalculator() {
  if (
    !fleetVehiclesInput ||
    !fleetCapacityInput ||
    !fleetVehiclesValue ||
    !fleetCapacityValue ||
    !fleetRevenueTotal ||
    !fleetDnoValue ||
    !fleetWholesaleValue ||
    !fleetBalancingValue ||
    !fleetPerEvValue ||
    !fleetYear3Value
  ) {
    return;
  }

  const vehicles = Number(fleetVehiclesInput.value);
  const capacity = Number(fleetCapacityInput.value);
  const fleetTypeFactor = Number(document.querySelector('[data-fleet-choice="fleet-type"] .fleet-option.active')?.dataset.value || 1);
  const territoryFactor = Number(document.querySelector('[data-fleet-choice="dno-territory"] .fleet-option.active')?.dataset.value || 1);
  const heatingTypeFactor = Number(document.querySelector('[data-fleet-choice="heating-type"] .fleet-option.active')?.dataset.value || 1);
  const batterySolarFactor = Number(document.querySelector('[data-fleet-choice="battery-solar"] .fleet-option.active')?.dataset.value || 1);
  const heatingCapacity = addonState.heating && heatingCapacityInput ? Number(heatingCapacityInput.value) : 0;
  const batteryCapacity = addonState.battery && batteryCapacityInput ? Number(batteryCapacityInput.value) : 0;
  const vehiclesPercentage = ((vehicles - Number(fleetVehiclesInput.min)) / (Number(fleetVehiclesInput.max) - Number(fleetVehiclesInput.min))) * 100;
  const capacityPercentage = ((capacity - Number(fleetCapacityInput.min)) / (Number(fleetCapacityInput.max) - Number(fleetCapacityInput.min))) * 100;
  const baseRevenue = vehicles * capacity * 24.2 * fleetTypeFactor * territoryFactor;
  const heatingRevenue = heatingCapacity * 42 * heatingTypeFactor;
  const batteryRevenue = batteryCapacity * 780 * batterySolarFactor;
  const totalRevenue = Math.round(baseRevenue + heatingRevenue + batteryRevenue);
  const dnoRevenue = Math.round(totalRevenue * 0.495);
  const wholesaleRevenue = Math.round(totalRevenue * 0.287);
  const balancingRevenue = totalRevenue - dnoRevenue - wholesaleRevenue;
  const perEvRevenue = Math.round(totalRevenue / vehicles);
  const year3Projection = Math.round(totalRevenue * 1.38);

  fleetVehiclesValue.textContent = String(vehicles);
  fleetCapacityValue.textContent = String(capacity);
  fleetVehiclesInput.style.setProperty("--fill", `${vehiclesPercentage}%`);
  fleetCapacityInput.style.setProperty("--fill", `${capacityPercentage}%`);
  fleetRevenueTotal.textContent = formatCompactPounds(totalRevenue);
  fleetDnoValue.textContent = formatPounds(dnoRevenue);
  fleetWholesaleValue.textContent = formatPounds(wholesaleRevenue);
  fleetBalancingValue.textContent = formatPounds(balancingRevenue);
  fleetPerEvValue.textContent = formatCompactPounds(perEvRevenue);
  fleetYear3Value.textContent = formatCompactPounds(year3Projection);
}

function setupFleetChoices() {
  if (!fleetChoiceGroups.length) {
    return;
  }

  fleetChoiceGroups.forEach((group) => {
    const buttons = [...group.querySelectorAll(".fleet-option")];

    buttons.forEach((button) => {
      button.addEventListener("click", () => {
        buttons.forEach((entry) => {
          entry.classList.remove("active");
          entry.setAttribute("aria-pressed", "false");
        });

        button.classList.add("active");
        button.setAttribute("aria-pressed", "true");
        updateFleetCalculator();
      });
    });
  });
}

function openFleetModal(modalId) {
  const modal = document.getElementById(modalId);

  if (!modal) {
    return;
  }

  modal.hidden = false;
  document.body.style.overflow = "hidden";
}

function closeFleetModal(modal) {
  if (!modal) {
    return;
  }

  modal.hidden = true;
  document.body.style.overflow = "";
}

function saveAddon(type) {
  if (type === "heating" && heatingSummary && heatingCapacityInput && heatingCapacityOutput && heatingTypeOutput) {
    addonState.heating = true;
    heatingSummary.hidden = false;
    heatingCapacityOutput.textContent = `${heatingCapacityInput.value} kW`;
    heatingTypeOutput.textContent = document.querySelector('[data-fleet-choice="heating-type"] .fleet-option.active')?.textContent?.trim() || "Heat pump";
    closeFleetModal(document.getElementById("heating-modal"));
  }

  if (type === "battery" && batterySummary && batteryCapacityInput && batteryCapacityOutput && batterySolarOutput) {
    addonState.battery = true;
    batterySummary.hidden = false;
    batteryCapacityOutput.textContent = `${batteryCapacityInput.value} kWh`;
    batterySolarOutput.textContent = document.querySelector('[data-fleet-choice="battery-solar"] .fleet-option.active')?.textContent?.trim() || "No solar";
    closeFleetModal(document.getElementById("battery-modal"));
  }

  updateFleetCalculator();
}

function setupFleetAddons() {
  fleetAddonTriggers.forEach((trigger) => {
    trigger.addEventListener("click", () => {
      const modalId = trigger.getAttribute("data-modal-target");

      if (modalId) {
        openFleetModal(modalId);
      }
    });
  });

  fleetModals.forEach((modal) => {
    modal.querySelectorAll("[data-modal-close]").forEach((element) => {
      element.addEventListener("click", () => {
        closeFleetModal(modal);
      });
    });
  });

  addonSaveButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const type = button.getAttribute("data-save-addon");

      if (type) {
        saveAddon(type);
      }
    });
  });

  [heatingCapacityInput, batteryCapacityInput].forEach((input) => {
    if (!input) {
      return;
    }

    input.addEventListener("input", updateAddonInputs);
    input.addEventListener("change", updateAddonInputs);
  });

  document.addEventListener("keydown", (event) => {
    if (event.key !== "Escape") {
      return;
    }

    fleetModals.forEach((modal) => {
      if (!modal.hidden) {
        closeFleetModal(modal);
      }
    });
  });

  updateAddonInputs();
}

function runTypewriter() {
  if (!typewriterHeadings.length) {
    return;
  }

  typewriterHeadings.forEach((heading, headingIndex) => {
    const text = (heading.dataset.typewriterText || heading.textContent || "").trim();
    const sessionKey = `typewriter:${location.pathname || "/"}:${headingIndex}`;

    if (sessionStorage.getItem(sessionKey) === "done") {
      heading.textContent = text;
      heading.classList.add("typewriter-done");
      return;
    }

    heading.textContent = "";
    let index = 0;

    const tick = () => {
      heading.textContent = text.slice(0, index);
      index += 1;

      if (index <= text.length) {
        window.setTimeout(tick, 42);
        return;
      }

      heading.classList.add("typewriter-done");
      sessionStorage.setItem(sessionKey, "done");
    };

    window.setTimeout(tick, headingIndex * 260);
  });
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

function setupAccordion() {
  const accordions = document.querySelectorAll("[data-accordion]");

  accordions.forEach((accordion) => {
    const items = [...accordion.querySelectorAll(".security-item")];
    const setOpenItem = (targetItem) => {
      items.forEach((entry) => {
        const entryTrigger = entry.querySelector(".security-trigger");
        const entryPanel = entry.querySelector(".security-panel");
        const shouldOpen = entry === targetItem;

        entry.classList.toggle("is-open", shouldOpen);

        if (entryTrigger) {
          entryTrigger.setAttribute("aria-expanded", shouldOpen ? "true" : "false");
        }

        if (entryPanel) {
          if (shouldOpen) {
            entryPanel.hidden = false;
            window.requestAnimationFrame(() => {
              entry.classList.add("is-open");
            });
            return;
          }

          entryPanel.hidden = false;
          window.setTimeout(() => {
            if (!entry.classList.contains("is-open")) {
              entryPanel.hidden = true;
            }
          }, 520);
        }
      });
    };

    items.forEach((item) => {
      const trigger = item.querySelector(".security-trigger");

      if (!trigger) {
        return;
      }

      item.addEventListener("mouseenter", () => {
        setOpenItem(item);
      });

      trigger.addEventListener("focus", () => {
        setOpenItem(item);
      });

      trigger.addEventListener("click", () => {
        setOpenItem(item);
      });
    });
  });
}

if (usageInput && usageValue && vehicleInput && tariffInput && savingsAmount && estimateCopy) {
  [usageInput, vehicleInput, tariffInput].forEach((element) => {
    element.addEventListener("input", updateEstimate);
    element.addEventListener("change", updateEstimate);
  });

  updateEstimate();
}

if (fleetVehiclesInput && fleetCapacityInput) {
  [fleetVehiclesInput, fleetCapacityInput].forEach((element) => {
    element.addEventListener("input", updateFleetCalculator);
    element.addEventListener("change", updateFleetCalculator);
  });

  updateFleetCalculator();
}

runTypewriter();
setupScrollReveal();
setupAccordion();
setupFleetChoices();
setupFleetAddons();
