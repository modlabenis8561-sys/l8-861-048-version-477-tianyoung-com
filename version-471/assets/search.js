(function () {
    var data = window.SITE_MOVIE_INDEX || [];
    var form = document.querySelector("[data-search-form]");
    var input = document.querySelector("[data-search-input]");
    var results = document.querySelector("[data-search-results]");
    var empty = document.querySelector("[data-search-empty]");
    var count = document.querySelector("[data-search-count]");
    var params = new URLSearchParams(window.location.search);
    var initial = params.get("q") || "";

    function escapeHtml(value) {
        return String(value || "").replace(/[&<>\"]/g, function (match) {
            return {
                "&": "&amp;",
                "<": "&lt;",
                ">": "&gt;",
                "\"": "&quot;"
            }[match];
        });
    }

    function normalize(value) {
        return String(value || "").toLowerCase();
    }

    function render(items) {
        if (!results) {
            return;
        }

        results.innerHTML = items.map(function (movie) {
            var tags = (movie.tags || []).slice(0, 3).map(function (tag) {
                return "<span>" + escapeHtml(tag) + "</span>";
            }).join("");

            return "<article class=\"movie-card\">" +
                "<a class=\"movie-cover\" href=\"" + escapeHtml(movie.url) + "\" aria-label=\"" + escapeHtml(movie.title) + " 在线观看\">" +
                    "<img src=\"" + escapeHtml(movie.cover) + "\" alt=\"" + escapeHtml(movie.title) + "\" loading=\"lazy\">" +
                    "<span class=\"movie-badge\">" + escapeHtml(movie.region) + " · " + escapeHtml(movie.type) + "</span>" +
                    "<span class=\"movie-play\">▶</span>" +
                "</a>" +
                "<div class=\"movie-info\">" +
                    "<h3><a href=\"" + escapeHtml(movie.url) + "\">" + escapeHtml(movie.title) + "</a></h3>" +
                    "<p>" + escapeHtml(movie.oneLine) + "</p>" +
                    "<div class=\"movie-tags\">" + tags + "</div>" +
                    "<div class=\"movie-meta\"><span>" + escapeHtml(movie.year) + "</span><a href=\"" + escapeHtml(movie.categoryUrl) + "\">" + escapeHtml(movie.category) + "</a></div>" +
                "</div>" +
            "</article>";
        }).join("");
    }

    function search(keyword) {
        var query = normalize(keyword).trim();

        if (!query) {
            render([]);
            if (empty) {
                empty.textContent = "请输入关键词开始搜索。";
                empty.classList.add("is-visible");
            }
            if (count) {
                count.textContent = "";
            }
            return;
        }

        var words = query.split(/\s+/).filter(Boolean);
        var matched = data.filter(function (movie) {
            var text = normalize([
                movie.title,
                movie.year,
                movie.region,
                movie.type,
                movie.genre,
                movie.category,
                (movie.tags || []).join(" "),
                movie.oneLine
            ].join(" "));

            return words.every(function (word) {
                return text.indexOf(word) !== -1;
            });
        }).slice(0, 120);

        render(matched);

        if (empty) {
            empty.textContent = "没有找到匹配的影片。";
            empty.classList.toggle("is-visible", matched.length === 0);
        }

        if (count) {
            count.textContent = matched.length ? "已展示相关结果" : "";
        }
    }

    if (input) {
        input.value = initial;
        input.addEventListener("input", function () {
            search(input.value);
        });
    }

    if (form) {
        form.addEventListener("submit", function (event) {
            event.preventDefault();
            var keyword = input ? input.value : "";
            var nextUrl = "./search.html" + (keyword.trim() ? "?q=" + encodeURIComponent(keyword.trim()) : "");
            window.history.replaceState(null, "", nextUrl);
            search(keyword);
        });
    }

    search(initial);
})();
