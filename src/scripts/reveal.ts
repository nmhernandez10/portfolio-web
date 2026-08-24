/**
 * Scroll reveal. The CSS contract lives in global.css: `.reveal` only hides
 * once <html> carries `.reveal-ready`, so the observer is armed *before* opting
 * in — a constructor that throws leaves the page visible rather than blank.
 *
 * Targets are snapshotted once, at module load. Nothing hydrated renders
 * `.reveal` today; anything that starts to would be neither observed nor covered
 * by the fallback, and would stay hidden once `reveal-ready` is set.
 */
const FOLD_MARGIN = 40;

function armReveal(): void {
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  const targets = document.querySelectorAll(".reveal");
  let fired = false;

  const observer = new IntersectionObserver(
    (entries, self) => {
      fired = true;
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        entry.target.classList.add("is-in");
        self.unobserve(entry.target);
      }
    },
    { rootMargin: `-${FOLD_MARGIN}px` },
  );

  // The observer's first batch is asynchronous. Anything already at or above the
  // fold has been seen, so reveal it synchronously here: otherwise adding
  // `reveal-ready` below starts a 520ms fade-out that the first batch has to
  // interrupt, dipping visible content out and back on a busy main thread.
  for (const el of targets) {
    if (el.getBoundingClientRect().top < window.innerHeight - FOLD_MARGIN) {
      el.classList.add("is-in");
    } else {
      observer.observe(el);
    }
  }

  document.documentElement.classList.add("reveal-ready");

  // Safety net: if the observer never reports, show everything rather than leave
  // the page hidden.
  window.setTimeout(() => {
    if (fired) return;
    targets.forEach((el) => el.classList.add("is-in"));
  }, 900);
}

armReveal();
