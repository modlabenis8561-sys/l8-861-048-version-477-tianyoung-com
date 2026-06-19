(function () {
    var mobileToggle = document.querySelector("[data-mobile-toggle]");
    var mobilePanel = document.querySelector("[data-mobile-panel]");

    if (mobileToggle && mobilePanel) {
        mobileToggle.addEventListener("click", function () {
            mobilePanel.classList.toggle("is-open");
        });
    }

    var hero = document.querySelector("[data-hero]");

    if (hero) {
        var slides = Array.prototype.slice.call(hero.querySelectorAll("[data-hero-slide]"));
        var dots = Array.prototype.slice.call(hero.querySelectorAll("[data-hero-dot]"));
        var current = 0;

        function showSlide(index) {
            current = (index + slides.length) % slides.length;
            slides.forEach(function (slide, slideIndex) {
                slide.classList.toggle("is-active", slideIndex === current);
            });
            dots.forEach(function (dot, dotIndex) {
                dot.classList.toggle("is-active", dotIndex === current);
            });
        }

        dots.forEach(function (dot) {
            dot.addEventListener("click", function () {
                showSlide(Number(dot.getAttribute("data-hero-dot")) || 0);
            });
        });

        if (slides.length > 1) {
            setInterval(function () {
                showSlide(current + 1);
            }, 5600);
        }
    }

    var filterBox = document.querySelector("[data-filter-box]");

    if (filterBox) {
        var input = filterBox.querySelector("[data-filter-input]");
        var sort = filterBox.querySelector("[data-sort-select]");
        var list = document.querySelector("[data-card-list]");
        var empty = document.querySelector("[data-empty-state]");
        var cards = list ? Array.prototype.slice.call(list.children) : [];

        function normalize(value) {
            return String(value || "").toLowerCase();
        }

        function cardText(card) {
            return normalize([
                card.getAttribute("data-title"),
                card.getAttribute("data-year"),
                card.getAttribute("data-region"),
                card.getAttribute("data-genre"),
                card.getAttribute("data-tags")
            ].join(" "));
        }

        function applyFilter() {
            var keyword = normalize(input ? input.value : "").trim();
            var visible = 0;

            cards.forEach(function (card) {
                var matched = keyword === "" || cardText(card).indexOf(keyword) !== -1;
                card.classList.toggle("is-hidden-card", !matched);
                if (matched) {
                    visible += 1;
                }
            });

            if (empty) {
                empty.classList.toggle("is-visible", visible === 0);
            }
        }

        function applySort() {
            if (!list || !sort) {
                return;
            }

            var mode = sort.value;
            var sorted = cards.slice();

            if (mode === "year-desc") {
                sorted.sort(function (a, b) {
                    return Number(b.getAttribute("data-year")) - Number(a.getAttribute("data-year"));
                });
            }

            if (mode === "year-asc") {
                sorted.sort(function (a, b) {
                    return Number(a.getAttribute("data-year")) - Number(b.getAttribute("data-year"));
                });
            }

            if (mode === "title") {
                sorted.sort(function (a, b) {
                    return String(a.getAttribute("data-title")).localeCompare(String(b.getAttribute("data-title")), "zh-CN");
                });
            }

            sorted.forEach(function (card) {
                list.appendChild(card);
            });
        }

        if (input) {
            input.addEventListener("input", applyFilter);
        }

        if (sort) {
            sort.addEventListener("change", function () {
                applySort();
                applyFilter();
            });
        }
    }
})();
