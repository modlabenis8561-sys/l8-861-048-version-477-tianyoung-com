(function () {
    function ready(callback) {
        if (document.readyState === "loading") {
            document.addEventListener("DOMContentLoaded", callback);
        } else {
            callback();
        }
    }

    ready(function () {
        var shell = document.querySelector("[data-player]");
        if (!shell) {
            return;
        }
        var video = shell.querySelector("video");
        var button = shell.querySelector(".player-start");
        if (!video || !button) {
            return;
        }
        var source = button.getAttribute("data-player-src");
        var hls = null;

        function playVideo() {
            if (!source) {
                return;
            }
            button.classList.add("is-hidden");
            if (video.canPlayType("application/vnd.apple.mpegurl")) {
                if (video.src !== source) {
                    video.src = source;
                }
                video.play().catch(function () {
                    button.classList.remove("is-hidden");
                });
                return;
            }
            if (window.Hls && window.Hls.isSupported()) {
                if (!hls) {
                    hls = new window.Hls({
                        enableWorker: true,
                        lowLatencyMode: true
                    });
                    hls.loadSource(source);
                    hls.attachMedia(video);
                    hls.on(window.Hls.Events.MANIFEST_PARSED, function () {
                        video.play().catch(function () {
                            button.classList.remove("is-hidden");
                        });
                    });
                } else {
                    video.play().catch(function () {
                        button.classList.remove("is-hidden");
                    });
                }
                return;
            }
            if (video.src !== source) {
                video.src = source;
            }
            video.play().catch(function () {
                button.classList.remove("is-hidden");
            });
        }

        button.addEventListener("click", playVideo);
        video.addEventListener("play", function () {
            button.classList.add("is-hidden");
        });
    });
})();
