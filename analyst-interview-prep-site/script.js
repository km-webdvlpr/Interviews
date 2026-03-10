const navLinks = [...document.querySelectorAll(".nav-link")];
const sections = [...document.querySelectorAll("main .section")];
const searchInput = document.querySelector("#site-search");
const clearSearchButton = document.querySelector("#clear-search");
const searchableItems = [...document.querySelectorAll("[data-searchable], .qa-item, .nav-card")];
const backToTopButton = document.querySelector("#back-to-top");
const printButton = document.querySelector("#print-page");

function normalizeText(text) {
  return text.toLowerCase().replace(/\s+/g, " ").trim();
}

function applySearch(query) {
  const normalizedQuery = normalizeText(query);

  searchableItems.forEach((item) => {
    const source = normalizeText(`${item.dataset.searchable || ""} ${item.textContent || ""}`);
    const matched = normalizedQuery === "" || source.includes(normalizedQuery);
    item.classList.toggle("is-hidden", !matched);
  });

  document.querySelectorAll(".accordion").forEach((accordion) => {
    const hasVisibleChild = accordion.querySelector(".qa-item:not(.is-hidden)");
    const matchesSelf = !accordion.classList.contains("is-hidden");
    const shouldShow = normalizedQuery === "" || hasVisibleChild || matchesSelf;

    accordion.classList.toggle("is-hidden", !shouldShow);
    if (normalizedQuery !== "" && hasVisibleChild) {
      accordion.open = true;
    }
  });
}

function updateActiveNav() {
  const scrollTarget = window.scrollY + 160;
  let currentId = sections[0]?.id || "home";

  sections.forEach((section) => {
    if (section.offsetTop <= scrollTarget) {
      currentId = section.id;
    }
  });

  navLinks.forEach((link) => {
    const isActive = link.getAttribute("href") === `#${currentId}`;
    link.classList.toggle("active", isActive);
  });
}

function toggleBackToTop() {
  backToTopButton.classList.toggle("visible", window.scrollY > 700);
}

searchInput?.addEventListener("input", (event) => {
  applySearch(event.target.value);
});

clearSearchButton?.addEventListener("click", () => {
  searchInput.value = "";
  applySearch("");
  searchInput.focus();
});

backToTopButton?.addEventListener("click", () => {
  window.scrollTo({ top: 0, behavior: "smooth" });
});

printButton?.addEventListener("click", () => {
  window.print();
});

document.addEventListener("keydown", (event) => {
  if (event.key === "/" && document.activeElement !== searchInput) {
    event.preventDefault();
    searchInput?.focus();
  }
});

window.addEventListener("scroll", () => {
  updateActiveNav();
  toggleBackToTop();
});

window.addEventListener("load", () => {
  updateActiveNav();
  toggleBackToTop();
  applySearch("");
});
