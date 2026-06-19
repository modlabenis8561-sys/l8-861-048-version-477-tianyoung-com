(function () {
    const navToggle = document.querySelector(".nav-toggle");
    const mobilePanel = document.querySelector(".mobile-panel");

    if (navToggle && mobilePanel) {
        navToggle.addEventListener("click", function () {
            mobilePanel.classList.toggle("is-open");
        });
    }

    const slides = Array.from(document.querySelectorAll(".hero-slide"));
    const dots = Array.from(document.querySelectorAll(".hero-dot"));
    let currentSlide = 0;

    function showSlide(index) {
        if (!slides.length) {
            return;
        }

        currentSlide = (index + slides.length) % slides.length;

        slides.forEach(function (slide, slideIndex) {
            slide.classList.toggle("is-active", slideIndex === currentSlide);
        });

        dots.forEach(function (dot, dotIndex) {
            dot.classList.toggle("is-active", dotIndex === currentSlide);
        });
    }

    dots.forEach(function (dot, index) {
        dot.addEventListener("click", function () {
            showSlide(index);
        });
    });

    if (slides.length > 1) {
        window.setInterval(function () {
            showSlide(currentSlide + 1);
        }, 5200);
    }

    const filterInput = document.querySelector(".movie-filter-input");
    const filterSelect = document.querySelector(".movie-filter-select");
    const searchableGrid = document.querySelector(".searchable-grid");

    function normalize(value) {
        return String(value || "").trim().toLowerCase();
    }

    function filterCards() {
        if (!searchableGrid) {
            return;
        }

        const query = normalize(filterInput ? filterInput.value : "");
        const type = normalize(filterSelect ? filterSelect.value : "");
        const cards = Array.from(searchableGrid.querySelectorAll(".movie-card"));
        let visible = 0;

        cards.forEach(function (card) {
            const text = normalize(card.getAttribute("data-search"));
            const cardType = normalize(card.getAttribute("data-type"));
            const matchedText = !query || text.indexOf(query) !== -1;
            const matchedType = !type || cardType.indexOf(type) !== -1;
            const shouldShow = matchedText && matchedType;

            card.style.display = shouldShow ? "" : "none";

            if (shouldShow) {
                visible += 1;
            }
        });

        searchableGrid.classList.toggle("is-empty", visible === 0);
    }

    if (filterInput) {
        filterInput.addEventListener("input", filterCards);
    }

    if (filterSelect) {
        filterSelect.addEventListener("change", filterCards);
    }

    const params = new URLSearchParams(window.location.search);
    const queryParam = params.get("q");

    if (queryParam && filterInput) {
        filterInput.value = queryParam;
        filterCards();
    }
})();
