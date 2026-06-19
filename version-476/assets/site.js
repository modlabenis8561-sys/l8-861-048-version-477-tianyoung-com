(function () {
    var toggle = document.querySelector('.nav-toggle');
    var mobileNav = document.querySelector('.mobile-nav');

    if (toggle && mobileNav) {
        toggle.addEventListener('click', function () {
            mobileNav.classList.toggle('is-open');
        });
    }

    var hero = document.querySelector('[data-hero]');

    if (hero) {
        var slides = Array.prototype.slice.call(hero.querySelectorAll('.hero-slide'));
        var dots = Array.prototype.slice.call(hero.querySelectorAll('[data-hero-dot]'));
        var active = 0;
        var timer = null;

        function showSlide(index) {
            if (!slides.length) {
                return;
            }

            active = (index + slides.length) % slides.length;

            slides.forEach(function (slide, slideIndex) {
                var isActive = slideIndex === active;
                slide.classList.toggle('is-active', isActive);
                slide.setAttribute('aria-hidden', isActive ? 'false' : 'true');
            });

            dots.forEach(function (dot, dotIndex) {
                dot.classList.toggle('is-active', dotIndex === active);
            });
        }

        function startTimer() {
            stopTimer();
            timer = window.setInterval(function () {
                showSlide(active + 1);
            }, 5200);
        }

        function stopTimer() {
            if (timer) {
                window.clearInterval(timer);
            }
        }

        dots.forEach(function (dot) {
            dot.addEventListener('click', function () {
                showSlide(Number(dot.getAttribute('data-hero-dot')) || 0);
                startTimer();
            });
        });

        hero.addEventListener('mouseenter', stopTimer);
        hero.addEventListener('mouseleave', startTimer);
        showSlide(0);
        startTimer();
    }

    var queryInput = document.querySelector('.movie-search');
    var cards = Array.prototype.slice.call(document.querySelectorAll('.searchable-list .movie-card'));
    var chips = Array.prototype.slice.call(document.querySelectorAll('.filter-chip'));
    var emptyState = document.querySelector('.empty-state');
    var activeFilter = 'all';

    function getSearchParam() {
        try {
            return new URLSearchParams(window.location.search).get('q') || '';
        } catch (error) {
            return '';
        }
    }

    function normalize(value) {
        return String(value || '').toLowerCase().trim();
    }

    function applyFilters() {
        var keyword = normalize(queryInput ? queryInput.value : '');
        var shown = 0;

        cards.forEach(function (card) {
            var haystack = normalize(card.getAttribute('data-search'));
            var filterHit = activeFilter === 'all' || haystack.indexOf(normalize(activeFilter)) !== -1;
            var keywordHit = !keyword || haystack.indexOf(keyword) !== -1;
            var visible = filterHit && keywordHit;

            card.style.display = visible ? '' : 'none';

            if (visible) {
                shown += 1;
            }
        });

        if (emptyState) {
            emptyState.classList.toggle('is-visible', shown === 0 && cards.length > 0);
        }
    }

    if (queryInput && cards.length) {
        var preset = getSearchParam();

        if (preset) {
            queryInput.value = preset;
        }

        queryInput.addEventListener('input', applyFilters);
    }

    chips.forEach(function (chip) {
        chip.addEventListener('click', function () {
            activeFilter = chip.getAttribute('data-filter') || 'all';
            chips.forEach(function (item) {
                item.classList.toggle('is-active', item === chip);
            });
            applyFilters();
        });
    });

    if (cards.length) {
        applyFilters();
    }

    Array.prototype.slice.call(document.querySelectorAll('.player-shell')).forEach(function (shell) {
        var video = shell.querySelector('video');
        var start = shell.querySelector('.player-start');
        var url = shell.getAttribute('data-video');
        var hls = null;

        function attachAndPlay() {
            if (!video || !url) {
                return;
            }

            if (!shell.classList.contains('is-ready')) {
                shell.classList.add('is-ready');

                if (video.canPlayType('application/vnd.apple.mpegurl')) {
                    video.src = url;
                } else if (window.Hls && window.Hls.isSupported()) {
                    hls = new Hls({ enableWorker: true });
                    hls.loadSource(url);
                    hls.attachMedia(video);
                } else {
                    video.src = url;
                }
            }

            var playPromise = video.play();

            if (playPromise && typeof playPromise.catch === 'function') {
                playPromise.catch(function () {});
            }
        }

        if (start) {
            start.addEventListener('click', function (event) {
                event.preventDefault();
                event.stopPropagation();
                attachAndPlay();
            });
        }

        shell.addEventListener('click', function (event) {
            if (event.target === shell || event.target === video) {
                attachAndPlay();
            }
        });

        window.addEventListener('beforeunload', function () {
            if (hls && typeof hls.destroy === 'function') {
                hls.destroy();
            }
        });
    });
})();
