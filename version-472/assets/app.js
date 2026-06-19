(function () {
    function ready(callback) {
        if (document.readyState === "loading") {
            document.addEventListener("DOMContentLoaded", callback);
        } else {
            callback();
        }
    }

    ready(function () {
        var header = document.querySelector(".site-header");
        var navToggle = document.querySelector(".nav-toggle");
        if (header && navToggle) {
            navToggle.addEventListener("click", function () {
                var open = header.classList.toggle("is-open");
                navToggle.setAttribute("aria-expanded", open ? "true" : "false");
            });
        }

        document.querySelectorAll("img").forEach(function (image) {
            image.addEventListener("error", function () {
                image.classList.add("image-missing");
            });
        });

        var slides = Array.prototype.slice.call(document.querySelectorAll(".hero-slide"));
        var dots = Array.prototype.slice.call(document.querySelectorAll(".hero-dot"));
        var prev = document.querySelector("[data-hero-prev]");
        var next = document.querySelector("[data-hero-next]");
        var current = 0;
        var timer = null;

        function showSlide(index) {
            if (!slides.length) {
                return;
            }
            current = (index + slides.length) % slides.length;
            slides.forEach(function (slide, i) {
                slide.classList.toggle("is-active", i === current);
            });
            dots.forEach(function (dot, i) {
                dot.classList.toggle("is-active", i === current);
            });
        }

        function startHero() {
            if (timer) {
                clearInterval(timer);
            }
            if (slides.length > 1) {
                timer = setInterval(function () {
                    showSlide(current + 1);
                }, 5200);
            }
        }

        dots.forEach(function (dot, index) {
            dot.addEventListener("click", function () {
                showSlide(index);
                startHero();
            });
        });

        if (prev) {
            prev.addEventListener("click", function () {
                showSlide(current - 1);
                startHero();
            });
        }

        if (next) {
            next.addEventListener("click", function () {
                showSlide(current + 1);
                startHero();
            });
        }

        showSlide(0);
        startHero();

        document.querySelectorAll("[data-local-filter]").forEach(function (input) {
            var selector = input.getAttribute("data-local-filter");
            var cards = Array.prototype.slice.call(document.querySelectorAll(selector));
            input.addEventListener("input", function () {
                var q = input.value.trim().toLowerCase();
                cards.forEach(function (card) {
                    var haystack = [
                        card.getAttribute("data-title"),
                        card.getAttribute("data-genre"),
                        card.getAttribute("data-year"),
                        card.getAttribute("data-region"),
                        card.getAttribute("data-tags")
                    ].join(" ").toLowerCase();
                    card.style.display = haystack.indexOf(q) >= 0 ? "" : "none";
                });
            });
        });

        var searchRoot = document.querySelector("[data-search-results]");
        if (searchRoot && window.MOVIES) {
            var params = new URLSearchParams(window.location.search);
            var q = (params.get("q") || "").trim();
            var input = document.querySelector("[data-search-input]");
            if (input) {
                input.value = q;
            }
            var source = window.MOVIES;
            var results = q ? source.filter(function (movie) {
                var haystack = [movie.title, movie.region, movie.type, movie.year, movie.genre, movie.tags, movie.one_line].join(" ").toLowerCase();
                return haystack.indexOf(q.toLowerCase()) >= 0;
            }) : source.slice(0, 40);
            renderSearchResults(searchRoot, results);
        }
    });

    function renderSearchResults(root, movies) {
        root.textContent = "";
        if (!movies.length) {
            var empty = document.createElement("div");
            empty.className = "empty-state";
            empty.textContent = "没有找到匹配内容，可以换一个关键词继续搜索。";
            root.appendChild(empty);
            return;
        }
        var grid = document.createElement("div");
        grid.className = "movie-grid";
        movies.forEach(function (movie) {
            grid.appendChild(createMovieCard(movie));
        });
        root.appendChild(grid);
    }

    function createMovieCard(movie) {
        var article = document.createElement("article");
        article.className = "movie-card";

        var posterLink = document.createElement("a");
        posterLink.className = "card-poster";
        posterLink.href = movie.url;

        var image = document.createElement("img");
        image.src = movie.cover;
        image.alt = movie.title;
        image.loading = "lazy";
        image.addEventListener("error", function () {
            image.classList.add("image-missing");
        });
        posterLink.appendChild(image);

        var badge = document.createElement("span");
        badge.className = "poster-badge";
        badge.textContent = movie.type;
        posterLink.appendChild(badge);

        var body = document.createElement("div");
        body.className = "card-body";

        var meta = document.createElement("div");
        meta.className = "card-meta";
        meta.textContent = [movie.year, movie.region, movie.genre].filter(Boolean).join(" · ");

        var title = document.createElement("h3");
        title.className = "card-title";
        var titleLink = document.createElement("a");
        titleLink.href = movie.url;
        titleLink.textContent = movie.title;
        title.appendChild(titleLink);

        var desc = document.createElement("p");
        desc.className = "card-desc";
        desc.textContent = movie.one_line;

        var link = document.createElement("a");
        link.className = "card-link";
        link.href = movie.url;
        link.textContent = "立即观看";

        body.appendChild(meta);
        body.appendChild(title);
        body.appendChild(desc);
        body.appendChild(link);

        article.appendChild(posterLink);
        article.appendChild(body);
        return article;
    }
})();
