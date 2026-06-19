(function () {
  var topbar = document.querySelector('.topbar');
  var toggle = document.querySelector('.menu-toggle');
  if (topbar && toggle) {
    toggle.addEventListener('click', function () {
      topbar.classList.toggle('mobile-open');
    });
  }

  var slides = Array.prototype.slice.call(document.querySelectorAll('.hero-slide'));
  var dots = Array.prototype.slice.call(document.querySelectorAll('.hero-dot'));
  if (slides.length > 1) {
    var current = 0;
    var showSlide = function (index) {
      current = (index + slides.length) % slides.length;
      slides.forEach(function (slide, i) {
        slide.classList.toggle('active', i === current);
      });
      dots.forEach(function (dot, i) {
        dot.classList.toggle('active', i === current);
      });
    };
    dots.forEach(function (dot) {
      dot.addEventListener('click', function () {
        showSlide(Number(dot.getAttribute('data-slide-target') || 0));
      });
    });
    window.setInterval(function () {
      showSlide(current + 1);
    }, 5000);
  }

  var inputs = Array.prototype.slice.call(document.querySelectorAll('[data-search-input]'));
  var cards = Array.prototype.slice.call(document.querySelectorAll('.movie-card, .list-card'));
  var params = new URLSearchParams(window.location.search);
  var initialQuery = params.get('q') || '';
  var normalize = function (value) {
    return (value || '').toString().trim().toLowerCase();
  };
  var filterCards = function (query) {
    var q = normalize(query);
    cards.forEach(function (card) {
      var text = normalize(card.textContent + ' ' + Array.prototype.slice.call(card.attributes).map(function (attr) {
        return attr.value;
      }).join(' '));
      card.classList.toggle('is-hidden', q !== '' && text.indexOf(q) === -1);
    });
  };
  if (inputs.length) {
    inputs.forEach(function (input) {
      if (initialQuery && !input.value) {
        input.value = initialQuery;
      }
      input.addEventListener('input', function () {
        filterCards(input.value);
      });
    });
    if (initialQuery) {
      filterCards(initialQuery);
    }
  }

  Array.prototype.slice.call(document.querySelectorAll('.movie-player')).forEach(function (player) {
    var video = player.querySelector('video');
    var trigger = player.querySelector('.play-trigger');
    var url = player.getAttribute('data-m3u8');
    var attached = false;
    var instance = null;
    var start = function () {
      if (!video || !url) {
        return;
      }
      if (!attached) {
        if (video.canPlayType('application/vnd.apple.mpegurl')) {
          video.src = url;
        } else if (window.Hls && window.Hls.isSupported()) {
          instance = new window.Hls();
          instance.loadSource(url);
          instance.attachMedia(video);
        } else {
          video.src = url;
        }
        attached = true;
      }
      if (trigger) {
        trigger.classList.add('hidden');
      }
      var playPromise = video.play();
      if (playPromise && typeof playPromise.catch === 'function') {
        playPromise.catch(function () {});
      }
    };
    if (trigger) {
      trigger.addEventListener('click', start);
    }
    if (video) {
      video.addEventListener('click', function () {
        if (!attached || video.paused) {
          start();
        }
      });
      video.addEventListener('play', function () {
        if (trigger) {
          trigger.classList.add('hidden');
        }
      });
      video.addEventListener('ended', function () {
        if (trigger) {
          trigger.classList.remove('hidden');
        }
      });
    }
    window.addEventListener('beforeunload', function () {
      if (instance) {
        instance.destroy();
      }
    });
  });
})();
