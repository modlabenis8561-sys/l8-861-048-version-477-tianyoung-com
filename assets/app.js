(function () {
    function selectAll(selector, context) {
        return Array.prototype.slice.call((context || document).querySelectorAll(selector));
    }

    var mobileToggle = document.querySelector('[data-mobile-toggle]');
    var mobilePanel = document.querySelector('[data-mobile-panel]');
    if (mobileToggle && mobilePanel) {
        mobileToggle.addEventListener('click', function () {
            mobilePanel.classList.toggle('is-open');
        });
    }

    var slider = document.querySelector('[data-hero-slider]');
    if (slider) {
        var slides = selectAll('[data-hero-slide]', slider);
        var dots = selectAll('[data-hero-dot]', slider);
        var next = slider.querySelector('[data-hero-next]');
        var prev = slider.querySelector('[data-hero-prev]');
        var current = 0;
        var timer = null;

        function show(index) {
            current = (index + slides.length) % slides.length;
            slides.forEach(function (slide, idx) {
                slide.classList.toggle('is-active', idx === current);
            });
            dots.forEach(function (dot, idx) {
                dot.classList.toggle('is-active', idx === current);
            });
        }

        function start() {
            stop();
            timer = window.setInterval(function () {
                show(current + 1);
            }, 5200);
        }

        function stop() {
            if (timer) {
                window.clearInterval(timer);
                timer = null;
            }
        }

        dots.forEach(function (dot, idx) {
            dot.addEventListener('click', function () {
                show(idx);
                start();
            });
        });

        if (next) {
            next.addEventListener('click', function () {
                show(current + 1);
                start();
            });
        }

        if (prev) {
            prev.addEventListener('click', function () {
                show(current - 1);
                start();
            });
        }

        slider.addEventListener('mouseenter', stop);
        slider.addEventListener('mouseleave', start);
        show(0);
        start();
    }

    selectAll('[data-filter-panel]').forEach(function (panel) {
        var input = panel.querySelector('[data-filter-input]');
        var region = panel.querySelector('[data-filter-region]');
        var year = panel.querySelector('[data-filter-year]');
        var cards = selectAll('[data-movie-card]');
        var empty = document.querySelector('[data-filter-empty]');

        function filterCards() {
            var keyword = input ? input.value.trim().toLowerCase() : '';
            var regionValue = region ? region.value : '';
            var yearValue = year ? year.value : '';
            var visible = 0;

            cards.forEach(function (card) {
                var text = (card.getAttribute('data-filter-text') || '').toLowerCase();
                var cardRegion = card.getAttribute('data-region') || '';
                var cardYear = card.getAttribute('data-year') || '';
                var matched = true;

                if (keyword && text.indexOf(keyword) === -1) {
                    matched = false;
                }
                if (regionValue && cardRegion !== regionValue) {
                    matched = false;
                }
                if (yearValue && cardYear !== yearValue) {
                    matched = false;
                }

                card.style.display = matched ? '' : 'none';
                if (matched) {
                    visible += 1;
                }
            });

            if (empty) {
                empty.classList.toggle('is-visible', visible === 0);
            }
        }

        [input, region, year].forEach(function (control) {
            if (control) {
                control.addEventListener('input', filterCards);
                control.addEventListener('change', filterCards);
            }
        });

        filterCards();
    });
})();
