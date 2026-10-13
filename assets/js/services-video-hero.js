(() => {
  const hero = document.querySelector(".services-video-hero");
  const video = hero?.querySelector("video");
  if (!video) return;

  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (reduced) video.removeAttribute("autoplay");

  // Plays while on screen, unless the visitor paused it (clicking the hero toggles it)
  let userPaused = reduced;
  let inView = true;

  const sync = () => {
    if (!userPaused && inView && !document.hidden) {
      const play = video.play();
      if (play && typeof play.catch === "function") play.catch(() => {});
    } else {
      video.pause();
    }
  };

  hero.addEventListener("click", (event) => {
    if (event.target.closest("a, button")) return;
    // From what's actually happening, so a tap starts it where autoplay was blocked (iOS Low Power Mode)
    userPaused = !video.paused;
    sync();
  });

  if ("IntersectionObserver" in window) {
    new IntersectionObserver(
      (entries) => {
        inView = entries.some((e) => e.isIntersecting);
        sync();
      },
      { threshold: 0.15 }
    ).observe(video);
  }
  document.addEventListener("visibilitychange", sync);
  sync();
})();
