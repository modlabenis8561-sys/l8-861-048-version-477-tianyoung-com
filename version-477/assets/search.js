(function () {
    var form = document.querySelector('[data-search-form]');
    var input = document.querySelector('[data-search-input]');
    var results = document.querySelector('[data-search-results]');
    var empty = document.querySelector('[data-search-empty]');
    var index = window.MovieSearchIndex || [];

    function escapeHtml(value) {
        return String(value || '')
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#39;');
    }

    function card(movie) {
        var tags = (movie.tags || []).slice(0, 3).map(function (tag) {
            return '<span class="tag">' + escapeHtml(tag) + '</span>';
        }).join('');

        return '<article class="movie-card">' +
            '<a class="movie-cover" href="' + escapeHtml(movie.file) + '">' +
            '<img src="' + escapeHtml(movie.cover) + '" alt="' + escapeHtml(movie.title) + '" loading="lazy">' +
            '<span class="card-badge">' + escapeHtml(movie.year) + '</span>' +
            '<span class="card-play">▶</span>' +
            '</a>' +
            '<div class="movie-info">' +
            '<h2 class="movie-title"><a href="' + escapeHtml(movie.file) + '">' + escapeHtml(movie.title) + '</a></h2>' +
            '<div class="movie-meta"><span>' + escapeHtml(movie.region) + '</span><span>' + escapeHtml(movie.type) + '</span></div>' +
            '<p class="movie-line">' + escapeHtml(movie.oneLine) + '</p>' +
            '<div class="movie-tags">' + tags + '</div>' +
            '</div>' +
            '</article>';
    }

    function render() {
        var params = new URLSearchParams(window.location.search);
        var keyword = input ? input.value.trim() : '';
        if (!keyword && params.get('q')) {
            keyword = params.get('q') || '';
            if (input) {
                input.value = keyword;
            }
        }

        var value = keyword.toLowerCase();
        var matched = index.filter(function (movie) {
            if (!value) {
                return true;
            }
            return [movie.title, movie.region, movie.type, movie.year, movie.genre, movie.oneLine, (movie.tags || []).join(' ')]
                .join(' ')
                .toLowerCase()
                .indexOf(value) !== -1;
        }).slice(0, 120);

        if (results) {
            results.innerHTML = matched.map(card).join('');
        }

        if (empty) {
            empty.classList.toggle('is-visible', matched.length === 0);
        }
    }

    if (form) {
        form.addEventListener('submit', function (event) {
            event.preventDefault();
            var keyword = input ? input.value.trim() : '';
            var url = keyword ? 'search.html?q=' + encodeURIComponent(keyword) : 'search.html';
            window.history.replaceState({}, '', url);
            render();
        });
    }

    if (input) {
        input.addEventListener('input', render);
    }

    render();
})();
