(function () {
  function $(selector, scope) {
    return (scope || document).querySelector(selector);
  }

  function $all(selector, scope) {
    return Array.prototype.slice.call((scope || document).querySelectorAll(selector));
  }

  function escapeHtml(value) {
    return String(value || "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }

  function initHeader() {
    var header = $(".site-header");
    var toggle = $("[data-mobile-toggle]");

    if (!header || !toggle) {
      return;
    }

    toggle.addEventListener("click", function () {
      header.classList.toggle("is-open");
    });
  }

  function initHeaderSearch() {
    $all("[data-header-search]").forEach(function (form) {
      form.addEventListener("submit", function (event) {
        event.preventDefault();
        var input = form.querySelector("input");
        var query = input ? input.value.trim() : "";

        if (query) {
          var prefix = form.getAttribute("data-search-prefix") || "";
          window.location.href = prefix + "search.html?q=" + encodeURIComponent(query);
        }
      });
    });
  }

  function initHeroSlider() {
    var slider = $("[data-hero-slider]");

    if (!slider) {
      return;
    }

    var slides = $all(".hero-slide", slider);
    var dots = $all(".hero-dot", slider);
    var index = 0;
    var timer = null;

    function show(next) {
      index = (next + slides.length) % slides.length;
      slides.forEach(function (slide, slideIndex) {
        slide.classList.toggle("is-active", slideIndex === index);
      });
      dots.forEach(function (dot, dotIndex) {
        dot.classList.toggle("is-active", dotIndex === index);
      });
    }

    function start() {
      if (timer) {
        clearInterval(timer);
      }
      timer = setInterval(function () {
        show(index + 1);
      }, 6200);
    }

    dots.forEach(function (dot, dotIndex) {
      dot.addEventListener("click", function () {
        show(dotIndex);
        start();
      });
    });

    if (slides.length) {
      show(0);
      start();
    }
  }

  function yearMatches(value, rule) {
    var year = parseInt(value, 10);

    if (!rule) {
      return true;
    }

    if (!year) {
      return false;
    }

    if (rule === "2020") {
      return year >= 2020;
    }

    if (rule === "2010") {
      return year >= 2010 && year <= 2019;
    }

    if (rule === "2000") {
      return year >= 2000 && year <= 2009;
    }

    if (rule === "1990") {
      return year >= 1990 && year <= 1999;
    }

    if (rule === "older") {
      return year > 0 && year < 1990;
    }

    return true;
  }

  function initLocalFilter() {
    var form = $("[data-filter-form]");

    if (!form) {
      return;
    }

    var cards = $all(".movie-card[data-title]");
    var empty = $("[data-empty-state]");
    var input = $("[data-filter-keyword]", form);
    var year = $("[data-filter-year]", form);
    var region = $("[data-filter-region]", form);
    var type = $("[data-filter-type]", form);

    function apply() {
      var keyword = input ? input.value.trim().toLowerCase() : "";
      var yearRule = year ? year.value : "";
      var regionRule = region ? region.value : "";
      var typeRule = type ? type.value : "";
      var visible = 0;

      cards.forEach(function (card) {
        var haystack = [
          card.dataset.title,
          card.dataset.region,
          card.dataset.type,
          card.dataset.genre
        ].join(" ").toLowerCase();
        var matched = true;

        if (keyword && haystack.indexOf(keyword) === -1) {
          matched = false;
        }

        if (matched && yearRule && !yearMatches(card.dataset.year, yearRule)) {
          matched = false;
        }

        if (matched && regionRule && (card.dataset.region || "").indexOf(regionRule) === -1) {
          matched = false;
        }

        if (matched && typeRule && (card.dataset.type || "").indexOf(typeRule) === -1) {
          matched = false;
        }

        card.classList.toggle("is-hidden", !matched);

        if (matched) {
          visible += 1;
        }
      });

      if (empty) {
        empty.classList.toggle("is-visible", visible === 0);
      }
    }

    [input, year, region, type].forEach(function (control) {
      if (control) {
        control.addEventListener("input", apply);
        control.addEventListener("change", apply);
      }
    });

    form.addEventListener("submit", function (event) {
      event.preventDefault();
      apply();
    });

    apply();
  }

  function createMovieCard(movie) {
    return [
      '<article class="movie-card">',
      '<a href="' + escapeHtml(movie.url) + '">',
      '<div class="movie-cover">',
      '<img src="' + escapeHtml(movie.cover) + '" alt="' + escapeHtml(movie.title) + '" loading="lazy">',
      '<div class="cover-shade"><span class="play-badge">▶ 在线观看</span><span class="pill">' + escapeHtml(movie.year) + '</span></div>',
      '</div>',
      '<div class="movie-body">',
      '<div class="movie-meta"><span class="pill">' + escapeHtml(movie.region) + '</span><span class="pill">' + escapeHtml(movie.type) + '</span></div>',
      '<h2 class="movie-title">' + escapeHtml(movie.title) + '</h2>',
      '<p class="movie-line">' + escapeHtml(movie.one_line) + '</p>',
      '</div>',
      '</a>',
      '</article>'
    ].join("");
  }

  function initSearchPage() {
    var result = $("[data-search-results]");
    var form = $("[data-global-search-form]");
    var input = $("[data-global-search-input]");
    var empty = $("[data-search-empty]");

    if (!result || !form || !input || !window.SEARCH_MOVIES) {
      return;
    }

    var params = new URLSearchParams(window.location.search);
    var initial = params.get("q") || "";
    input.value = initial;

    function render() {
      var query = input.value.trim().toLowerCase();
      var list = window.SEARCH_MOVIES.filter(function (movie) {
        var haystack = [movie.title, movie.region, movie.type, movie.genre, movie.one_line].join(" ").toLowerCase();
        return !query || haystack.indexOf(query) !== -1;
      }).slice(0, 120);

      result.innerHTML = list.map(createMovieCard).join("");

      if (empty) {
        empty.classList.toggle("is-visible", list.length === 0);
      }
    }

    form.addEventListener("submit", function (event) {
      event.preventDefault();
      render();
      var query = input.value.trim();
      var url = query ? "search.html?q=" + encodeURIComponent(query) : "search.html";
      history.replaceState(null, "", url);
    });

    input.addEventListener("input", render);
    render();
  }

  document.addEventListener("DOMContentLoaded", function () {
    initHeader();
    initHeaderSearch();
    initHeroSlider();
    initLocalFilter();
    initSearchPage();
  });
})();
