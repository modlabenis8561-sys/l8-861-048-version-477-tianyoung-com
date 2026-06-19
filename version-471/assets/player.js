(function () {
    var players = Array.prototype.slice.call(document.querySelectorAll("[data-player]"));

    function formatTime(seconds) {
        if (!Number.isFinite(seconds) || seconds < 0) {
            return "0:00";
        }

        var minutes = Math.floor(seconds / 60);
        var rest = Math.floor(seconds % 60);
        return minutes + ":" + String(rest).padStart(2, "0");
    }

    players.forEach(function (root) {
        var video = root.querySelector("[data-video]");
        var buttons = Array.prototype.slice.call(root.querySelectorAll("[data-player-toggle]"));
        var progress = root.querySelector("[data-player-progress]");
        var time = root.querySelector("[data-player-time]");
        var mute = root.querySelector("[data-player-mute]");
        var fullscreen = root.querySelector("[data-player-fullscreen]");
        var streamUrl = root.getAttribute("data-stream-url");
        var fallbackUrl = root.getAttribute("data-fallback-url");
        var cover = root.getAttribute("data-cover");
        var hls = null;
        var attached = false;

        if (!video || !streamUrl) {
            return;
        }

        if (cover) {
            video.setAttribute("poster", cover);
        }

        function attachStream() {
            if (attached) {
                return;
            }

            attached = true;

            if (/\.m3u8(\?|$)/i.test(streamUrl) && window.Hls && window.Hls.isSupported()) {
                hls = new window.Hls({
                    enableWorker: true,
                    lowLatencyMode: true
                });
                hls.loadSource(streamUrl);
                hls.attachMedia(video);
                hls.on(window.Hls.Events.ERROR, function (event, data) {
                    if (data && data.fatal && fallbackUrl) {
                        hls.destroy();
                        hls = null;
                        video.src = fallbackUrl;
                    }
                });
                return;
            }

            if (/\.m3u8(\?|$)/i.test(streamUrl) && video.canPlayType("application/vnd.apple.mpegurl")) {
                video.src = streamUrl;
                return;
            }

            video.src = fallbackUrl || streamUrl;
        }

        function updateButtons() {
            var label = video.paused ? "▶" : "Ⅱ";
            buttons.forEach(function (button) {
                button.textContent = label;
                button.classList.toggle("is-hidden", !video.paused && button.classList.contains("player-big-button"));
            });
        }

        function togglePlay() {
            attachStream();

            if (video.paused) {
                video.play().catch(function () {
                    updateButtons();
                });
            } else {
                video.pause();
            }
        }

        buttons.forEach(function (button) {
            button.addEventListener("click", togglePlay);
        });

        video.addEventListener("click", togglePlay);
        video.addEventListener("play", updateButtons);
        video.addEventListener("pause", updateButtons);
        video.addEventListener("loadedmetadata", function () {
            if (progress) {
                progress.max = video.duration || 0;
            }
            if (time) {
                time.textContent = formatTime(video.currentTime) + " / " + formatTime(video.duration);
            }
        });
        video.addEventListener("timeupdate", function () {
            if (progress) {
                progress.value = video.currentTime || 0;
            }
            if (time) {
                time.textContent = formatTime(video.currentTime) + " / " + formatTime(video.duration);
            }
        });

        if (progress) {
            progress.addEventListener("input", function () {
                attachStream();
                video.currentTime = Number(progress.value) || 0;
            });
        }

        if (mute) {
            mute.addEventListener("click", function () {
                video.muted = !video.muted;
                mute.textContent = video.muted ? "静音" : "音量";
            });
        }

        if (fullscreen) {
            fullscreen.addEventListener("click", function () {
                if (root.requestFullscreen) {
                    root.requestFullscreen();
                }
            });
        }

        updateButtons();
    });
})();
