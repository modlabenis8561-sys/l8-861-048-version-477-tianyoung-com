(function () {
  function startNative(video, streamUrl) {
    video.src = streamUrl;
  }

  function startHls(video, streamUrl) {
    var Hls = window.Hls;

    if (Hls && Hls.isSupported()) {
      var hls = new Hls({
        enableWorker: true,
        lowLatencyMode: true,
        backBufferLength: 90
      });

      hls.loadSource(streamUrl);
      hls.attachMedia(video);
      video._hls = hls;
      return;
    }

    startNative(video, streamUrl);
  }

  window.initDetailPlayer = function (rootId, streamUrl) {
    var root = document.getElementById(rootId);

    if (!root) {
      return;
    }

    var video = root.querySelector("video");
    var cover = root.querySelector(".player-cover");

    if (!video || !cover || !streamUrl) {
      return;
    }

    function load() {
      if (video.dataset.ready === "1") {
        return;
      }

      video.dataset.ready = "1";
      video.controls = true;

      if (video.canPlayType("application/vnd.apple.mpegurl")) {
        startNative(video, streamUrl);
      } else {
        startHls(video, streamUrl);
      }
    }

    function play() {
      load();
      root.classList.add("is-playing");
      var task = video.play();

      if (task && typeof task.catch === "function") {
        task.catch(function () {});
      }
    }

    cover.addEventListener("click", play);

    video.addEventListener("click", function () {
      if (video.paused) {
        play();
      }
    });
  };
})();
