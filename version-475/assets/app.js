(function () {
  function ready(fn) {
    if (document.readyState !== "loading") {
      fn();
      return;
    }
    document.addEventListener("DOMContentLoaded", fn);
  }

  ready(function () {
    setupMenu();
    setupGlobalSearch();
    setupLocalSearch();
    setupHero();
    setupPlayers();
    seedSearchQuery();
  });

  function setupMenu() {
    var toggle = document.querySelector("[data-menu-toggle]");
    var panel = document.querySelector("[data-mobile-panel]");
    if (!toggle || !panel) {
      return;
    }
    toggle.addEventListener("click", function () {
      panel.classList.toggle("open");
    });
  }

  function setupGlobalSearch() {
    var forms = document.querySelectorAll("[data-global-search]");
    forms.forEach(function (form) {
      form.addEventListener("submit", function (event) {
        var input = form.querySelector("input[name='q']");
        if (!input) {
          return;
        }
        var value = input.value.trim();
        if (!value) {
          event.preventDefault();
          window.location.href = "search.html";
        }
      });
    });
  }

  function setupLocalSearch() {
    var inputs = document.querySelectorAll("[data-local-search]");
    inputs.forEach(function (input) {
      input.addEventListener("input", function () {
        filterCards(input.value);
      });
    });
  }

  function seedSearchQuery() {
    var params = new URLSearchParams(window.location.search);
    var query = params.get("q") || "";
    if (!query) {
      return;
    }
    var pageInput = document.querySelector("[data-search-query]");
    var localInput = document.querySelector("[data-local-search]");
    if (pageInput) {
      pageInput.value = query;
    }
    if (localInput) {
      localInput.value = query;
    }
    filterCards(query);
  }

  function filterCards(value) {
    var term = String(value || "").trim().toLowerCase();
    var cards = document.querySelectorAll("[data-search-item]");
    var visible = 0;
    cards.forEach(function (card) {
      var text = ((card.getAttribute("data-title") || "") + " " + (card.getAttribute("data-meta") || "")).toLowerCase();
      var match = !term || text.indexOf(term) !== -1;
      card.style.display = match ? "" : "none";
      if (match) {
        visible += 1;
      }
    });
    var empty = document.querySelector("[data-empty-state]");
    if (empty) {
      empty.classList.toggle("show", visible === 0);
    }
  }

  function setupHero() {
    var hero = document.querySelector("[data-hero]");
    if (!hero) {
      return;
    }
    var slides = Array.prototype.slice.call(hero.querySelectorAll("[data-hero-slide]"));
    var dots = Array.prototype.slice.call(hero.querySelectorAll("[data-hero-dot]"));
    var prev = hero.querySelector("[data-hero-prev]");
    var next = hero.querySelector("[data-hero-next]");
    var index = 0;
    var timer;

    function show(nextIndex) {
      index = (nextIndex + slides.length) % slides.length;
      slides.forEach(function (slide, i) {
        slide.classList.toggle("active", i === index);
      });
      dots.forEach(function (dot, i) {
        dot.classList.toggle("active", i === index);
      });
    }

    function play() {
      timer = window.setInterval(function () {
        show(index + 1);
      }, 5200);
    }

    function reset() {
      window.clearInterval(timer);
      play();
    }

    if (prev) {
      prev.addEventListener("click", function () {
        show(index - 1);
        reset();
      });
    }
    if (next) {
      next.addEventListener("click", function () {
        show(index + 1);
        reset();
      });
    }
    dots.forEach(function (dot, i) {
      dot.addEventListener("click", function () {
        show(i);
        reset();
      });
    });
    if (slides.length > 1) {
      play();
    }
  }

  function setupPlayers() {
    var players = document.querySelectorAll("[data-player]");
    players.forEach(function (box) {
      var video = box.querySelector("video");
      var button = box.querySelector("button");
      if (!video) {
        return;
      }

      function start() {
        if (box.getAttribute("data-ready") !== "true") {
          var url = video.getAttribute("data-video");
          if (url) {
            if (video.canPlayType("application/vnd.apple.mpegurl")) {
              video.src = url;
            } else if (window.Hls && window.Hls.isSupported()) {
              var hls = new window.Hls({
                enableWorker: true,
                lowLatencyMode: true
              });
              hls.loadSource(url);
              hls.attachMedia(video);
            } else {
              video.src = url;
            }
          }
          video.controls = true;
          box.setAttribute("data-ready", "true");
        }
        box.classList.add("is-playing");
        var playAction = video.play();
        if (playAction && typeof playAction.catch === "function") {
          playAction.catch(function () {});
        }
      }

      if (button) {
        button.addEventListener("click", function (event) {
          event.preventDefault();
          start();
        });
      }
      box.addEventListener("click", function () {
        if (box.getAttribute("data-ready") !== "true") {
          start();
        }
      });
    });
  }
})();
