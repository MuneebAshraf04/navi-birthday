(function () {
  "use strict";

  const audio = document.getElementById("bg-audio");
  const openButton = document.getElementById("open-surprise");
  const replayButton = document.getElementById("replay");
  const soundDock = document.getElementById("sound-dock");
  const soundStatus = document.getElementById("sound-status");
  const audioToggle = document.getElementById("audio-toggle");
  const audioMute = document.getElementById("audio-mute");
  const dialog = document.getElementById("photo-dialog");
  const dialogImage = document.getElementById("photo-dialog-image");
  const dialogTitle = document.getElementById("photo-dialog-title");

  const setSoundDock = (visible) => {
    if (!soundDock) return;
    soundDock.hidden = !visible;
  };

  const updateAudioUi = () => {
    if (!audio || !audioToggle || !audioMute) return;
    const playing = !audio.paused;
    const muted = audio.muted;
    soundDock.classList.toggle("is-playing", playing);
    audioToggle.setAttribute("aria-pressed", String(playing));
    audioToggle.setAttribute("aria-label", playing ? "Pause birthday soundtrack" : "Play birthday soundtrack");
    audioToggle.title = playing ? "Pause birthday soundtrack" : "Play birthday soundtrack";
    audioToggle.querySelector("span").textContent = playing ? "Ⅱ" : "▶";
    audioMute.setAttribute("aria-pressed", String(muted));
    audioMute.setAttribute("aria-label", muted ? "Unmute birthday soundtrack" : "Mute birthday soundtrack");
    audioMute.title = muted ? "Unmute birthday soundtrack" : "Mute birthday soundtrack";
    audioMute.querySelector("span").textContent = muted ? "◌" : "◖";
    soundStatus.textContent = muted ? "Soundtrack muted" : playing ? "Birthday soundtrack" : "Soundtrack paused";
  };

  const startAudio = () => {
    if (!audio) return;
    setSoundDock(true);
    audio.play().then(updateAudioUi).catch(() => {
      soundStatus.textContent = "Tap play for the soundtrack";
      updateAudioUi();
    });
  };

  openButton?.addEventListener("click", () => {
    startAudio();
    document.getElementById("welcome")?.scrollIntoView({ behavior: "smooth", block: "start" });
  });

  audioToggle?.addEventListener("click", () => {
    if (!audio) return;
    if (audio.paused) {
      audio.play().catch(() => {});
    } else {
      audio.pause();
    }
    updateAudioUi();
  });

  audioMute?.addEventListener("click", () => {
    if (!audio) return;
    audio.muted = !audio.muted;
    updateAudioUi();
  });

  audio?.addEventListener("play", updateAudioUi);
  audio?.addEventListener("pause", updateAudioUi);
  audio?.addEventListener("volumechange", updateAudioUi);

  replayButton?.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    if (audio) audio.currentTime = 0;
  });

  document.querySelectorAll(".photo-trigger").forEach((trigger) => {
    trigger.addEventListener("click", () => {
      const image = trigger.querySelector("img");
      if (!image || !dialog || !dialogImage) return;
      dialogImage.src = trigger.dataset.photo || image.currentSrc || image.src;
      dialogImage.alt = image.alt;
      dialogTitle.textContent = trigger.dataset.caption || "Navi";
      if (typeof dialog.showModal === "function") {
        dialog.showModal();
        document.body.classList.add("dialog-open");
      }
    });
  });

  const resetDialog = () => {
    document.body.classList.remove("dialog-open");
    dialogImage.removeAttribute("src");
  };

  dialog?.addEventListener("close", resetDialog);
  dialog?.addEventListener("cancel", resetDialog);
  dialog?.querySelector("form")?.addEventListener("submit", resetDialog);

  dialog?.addEventListener("click", (event) => {
    if (event.target === dialog) {
      dialog.close();
      resetDialog();
    }
  });

  if ("IntersectionObserver" in window && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.08 });
    document.querySelectorAll(".reveal").forEach((element) => observer.observe(element));
  } else {
    document.querySelectorAll(".reveal").forEach((element) => element.classList.add("is-visible"));
  }
})();
