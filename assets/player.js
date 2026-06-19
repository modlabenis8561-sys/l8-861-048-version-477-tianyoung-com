(function () {
    var players = Array.prototype.slice.call(document.querySelectorAll('[data-player]'));

    players.forEach(function (player) {
        var video = player.querySelector('video');
        var layer = player.querySelector('[data-play-button]');
        var stream = player.getAttribute('data-stream');
        var loaded = false;
        var hls = null;

        function bindStream() {
            if (!video || !stream || loaded) {
                return;
            }

            loaded = true;

            if (video.canPlayType('application/vnd.apple.mpegurl')) {
                video.src = stream;
            } else if (window.Hls && window.Hls.isSupported()) {
                hls = new window.Hls({
                    enableWorker: true,
                    lowLatencyMode: true,
                    backBufferLength: 60
                });
                hls.loadSource(stream);
                hls.attachMedia(video);
            } else {
                video.src = stream;
            }
        }

        function play() {
            bindStream();
            player.classList.add('is-playing');
            var started = video.play();
            if (started && typeof started.catch === 'function') {
                started.catch(function () {});
            }
        }

        if (layer) {
            layer.addEventListener('click', play);
        }

        if (video) {
            video.addEventListener('click', function () {
                if (!loaded) {
                    play();
                }
            });
        }

        window.addEventListener('pagehide', function () {
            if (hls && typeof hls.destroy === 'function') {
                hls.destroy();
            }
        });
    });
})();
