import { Link } from "@tanstack/react-router";
import { useEffect, useRef } from "react";

const FINAL_STILL_PATH = "/cinematic/5TH.png";
const HERO_VIDEO_PATH = "/cinematic/ainza-hero-sequence-v2.mp4";
const HERO_POSTER_PATH = "/cinematic/ainza-framed-1080/frame_0001.jpg";

type StoryCopy = {
  element: HTMLElement;
  start: number;
  end: number;
};

export function Hero() {
  const heroRef = useRef<HTMLElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const loaderTextRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const hero = heroRef.current;
    const video = videoRef.current;

    if (!hero || !video) return undefined;

    let mounted = true;
    let rafId = 0;
    let autoIntroRafId = 0;
    let videoReady = false;
    let videoCanPlayThrough = false;

    const copies: StoryCopy[] = Array.from(
      hero.querySelectorAll<HTMLElement>(".cinematic-story-copy"),
    ).map((element) => ({
      element,
      start: Number(element.dataset.start ?? 0),
      end: Number(element.dataset.end ?? 1),
    }));

    const reducedMotionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const cinematicAutoEase = (t: number) => {
      const x = clamp(t);
      return x < 0.5 ? 4 * x * x * x : 1 - (-2 * x + 2) ** 3 / 2;
    };
    const autoIntroConfig = {
      delay: 1200,
      duration: 12.8,
      targetProgress: 0.94,
      minViewportWidth: 768,
      maxInitialScroll: 12,
    };
    const autoIntroState = {
      scheduled: false,
      used: false,
      cancelled: false,
      running: false,
      timeoutId: 0,
    };
    const finalStillConfig = {
      start: 0.885,
      end: 0.915,
    };
    const scrollIntentKeys = new Set([
      "ArrowDown",
      "ArrowUp",
      "PageDown",
      "PageUp",
      "Home",
      "End",
      " ",
      "Spacebar",
    ]);

    function clamp(value: number, min = 0, max = 1) {
      return Math.min(max, Math.max(min, value));
    }

    function smootherstep(value: number) {
      const x = clamp(value);
      return x * x * x * (x * (x * 6 - 15) + 10);
    }

    function getBufferedRatio() {
      if (!Number.isFinite(video.duration) || video.duration <= 0 || video.buffered.length === 0) {
        return 0;
      }

      return clamp(video.buffered.end(video.buffered.length - 1) / video.duration);
    }

    function getFinalStillBlend(progress: number) {
      return smootherstep(
        (progress - finalStillConfig.start) / (finalStillConfig.end - finalStillConfig.start),
      );
    }

    function getScrollProgress() {
      const rect = hero.getBoundingClientRect();
      const scrollable = hero.offsetHeight - window.innerHeight;
      if (scrollable <= 0) return 0;
      return clamp(-rect.top / scrollable);
    }

    function updateStory(progress: number) {
      hero.style.setProperty("--cinematic-scroll-progress", progress.toFixed(4));
      hero.style.setProperty("--cinematic-shade-opacity", (0.24 - progress * 0.06).toFixed(3));
      hero.style.setProperty("--cinematic-final-opacity", getFinalStillBlend(progress).toFixed(4));

      for (const copy of copies) {
        const span = copy.end - copy.start;
        const local = clamp((progress - copy.start) / span);
        const fadeIn = copy.start === 0 ? 1 : smootherstep(local / 0.2);
        const fadeOut = copy.end === 1 ? 1 : 1 - smootherstep((local - 0.8) / 0.2);
        const opacity = clamp(fadeIn * fadeOut);
        const blur = (1 - opacity) * 6;

        copy.element.style.setProperty("--opacity", opacity.toFixed(3));
        copy.element.style.setProperty("--y", `${((1 - opacity) * 12).toFixed(2)}px`);
        copy.element.style.setProperty("--blur", `${blur.toFixed(2)}px`);
      }
    }

    function updateLoader() {
      let progress = 8;
      progress = Math.max(progress, Math.round(getBufferedRatio() * 100));
      if (videoReady) progress = Math.max(progress, 76);
      if (videoCanPlayThrough || getBufferedRatio() >= 0.92) progress = 100;

      hero.style.setProperty("--cinematic-load-progress", `${progress}%`);
      if (loaderTextRef.current) {
        loaderTextRef.current.textContent =
          progress < 100 ? `Loading cinematic ${progress}%` : "Cinematic ready";
      }

      if (videoReady || progress >= 100) {
        window.setTimeout(
          () => {
            if (mounted) hero.style.setProperty("--cinematic-loader-opacity", "0");
          },
          videoReady ? 420 : 700,
        );
      }
    }

    function getAutoIntroTargetY() {
      const scrollable = hero.offsetHeight - window.innerHeight;
      if (scrollable <= 0) return 0;
      return Math.round(hero.offsetTop + scrollable * autoIntroConfig.targetProgress);
    }

    function canRunAutoIntro() {
      return (
        !autoIntroState.used &&
        !autoIntroState.cancelled &&
        !window.location.hash &&
        !reducedMotionQuery.matches &&
        window.innerWidth >= autoIntroConfig.minViewportWidth &&
        window.scrollY <= autoIntroConfig.maxInitialScroll &&
        hero.offsetHeight > window.innerHeight
      );
    }

    function cancelAutoIntro() {
      if (autoIntroState.used && !autoIntroState.running) return;

      autoIntroState.cancelled = true;
      autoIntroState.scheduled = false;
      autoIntroState.running = false;

      if (autoIntroState.timeoutId) {
        window.clearTimeout(autoIntroState.timeoutId);
        autoIntroState.timeoutId = 0;
      }
      if (autoIntroRafId) {
        cancelAnimationFrame(autoIntroRafId);
        autoIntroRafId = 0;
      }
    }

    function animateScrollTo(targetY: number) {
      const startY = window.scrollY;
      const distance = targetY - startY;
      const startedAt = performance.now();
      const durationMs = autoIntroConfig.duration * 1000;

      const tick = (time: number) => {
        if (!mounted || !autoIntroState.running) return;

        const elapsed = time - startedAt;
        const progress = clamp(elapsed / durationMs);
        window.scrollTo(0, Math.round(startY + distance * cinematicAutoEase(progress)));

        if (progress < 1) {
          autoIntroRafId = requestAnimationFrame(tick);
          return;
        }

        autoIntroState.running = false;
        autoIntroRafId = 0;
      };

      autoIntroRafId = requestAnimationFrame(tick);
    }

    function runAutoIntro() {
      autoIntroState.timeoutId = 0;
      autoIntroState.scheduled = false;

      if (!canRunAutoIntro()) return;

      autoIntroState.used = true;
      autoIntroState.running = true;
      animateScrollTo(getAutoIntroTargetY());
    }

    function scheduleAutoIntro() {
      if (autoIntroState.scheduled || !canRunAutoIntro()) return;

      autoIntroState.scheduled = true;
      autoIntroState.timeoutId = window.setTimeout(runAutoIntro, autoIntroConfig.delay);
    }

    function requestVideoPlayback() {
      if (reducedMotionQuery.matches) {
        video.pause();
        return;
      }

      const playback = video.play();
      if (playback) {
        void playback.catch(() => {
          hero.style.setProperty("--cinematic-loader-opacity", "0");
        });
      }
    }

    function render() {
      if (!mounted) return;

      const progress = getScrollProgress();
      updateStory(progress);
      rafId = requestAnimationFrame(render);
    }

    const handleCanPlay = () => {
      if (!mounted) return;
      videoReady = true;
      requestVideoPlayback();
      scheduleAutoIntro();
      updateLoader();
    };
    const handleCanPlayThrough = () => {
      if (!mounted) return;
      videoCanPlayThrough = true;
      updateLoader();
    };
    const handleProgress = () => {
      if (!mounted) return;
      updateLoader();
    };
    const handleError = () => {
      if (!mounted) return;
      hero.style.setProperty("--cinematic-loader-opacity", "0");
    };
    const handleResize = () => {
      if (autoIntroState.scheduled && !canRunAutoIntro()) cancelAutoIntro();
    };
    const handleScroll = () => {
      if (!autoIntroState.running && window.scrollY > autoIntroConfig.maxInitialScroll) {
        cancelAutoIntro();
      }
    };
    const handleKeyDown = (event: KeyboardEvent) => {
      if (scrollIntentKeys.has(event.key)) cancelAutoIntro();
    };
    const handleReducedMotionChange = () => {
      cancelAutoIntro();
      requestVideoPlayback();
    };

    video.addEventListener("loadeddata", handleCanPlay);
    video.addEventListener("canplay", handleCanPlay);
    video.addEventListener("canplaythrough", handleCanPlayThrough);
    video.addEventListener("progress", handleProgress);
    video.addEventListener("error", handleError);
    window.addEventListener("resize", handleResize);
    window.addEventListener("wheel", cancelAutoIntro, { passive: true });
    window.addEventListener("touchstart", cancelAutoIntro, { passive: true });
    window.addEventListener("pointerdown", cancelAutoIntro, { passive: true });
    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("scroll", handleScroll, { passive: true });
    reducedMotionQuery.addEventListener?.("change", handleReducedMotionChange);

    video.src = HERO_VIDEO_PATH;
    video.load();
    updateStory(getScrollProgress());
    updateLoader();
    render();

    return () => {
      mounted = false;
      cancelAutoIntro();
      cancelAnimationFrame(rafId);
      video.pause();
      video.removeAttribute("src");
      video.load();
      video.removeEventListener("loadeddata", handleCanPlay);
      video.removeEventListener("canplay", handleCanPlay);
      video.removeEventListener("canplaythrough", handleCanPlayThrough);
      video.removeEventListener("progress", handleProgress);
      video.removeEventListener("error", handleError);
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("wheel", cancelAutoIntro);
      window.removeEventListener("touchstart", cancelAutoIntro);
      window.removeEventListener("pointerdown", cancelAutoIntro);
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("scroll", handleScroll);
      reducedMotionQuery.removeEventListener?.("change", handleReducedMotionChange);
    };
  }, []);

  return (
    <section
      ref={heroRef}
      className="cinematic-hero"
      id="hero"
      aria-label="AINZA cinematic launch story"
    >
      <div className="cinematic-sticky">
        <video
          ref={videoRef}
          className="cinematic-video-source"
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          poster={HERO_POSTER_PATH}
          aria-hidden="true"
        />
        <img className="cinematic-final-still" src={FINAL_STILL_PATH} alt="" aria-hidden="true" />
        <div className="cinematic-story-layer" aria-live="off">
          <section
            className="cinematic-story-copy cinematic-copy-left-low cinematic-copy-intro"
            data-start="0"
            data-end="0.15"
          >
            <p className="cinematic-eyebrow">Born to Build Tomorrow</p>
            <h1 className="cinematic-hero-title" aria-label="AINZA">
              <span className="cinematic-wordmark cinematic-hero-wordmark" aria-hidden="true">
                <span className="cinematic-letter cinematic-letter-a">A</span>
                <span className="cinematic-letter">I</span>
                <span className="cinematic-letter">N</span>
                <span className="cinematic-letter cinematic-letter-z">Z</span>
                <span className="cinematic-letter cinematic-letter-a">A</span>
              </span>
            </h1>
            <p>AI systems, automation, and digital ecosystems engineered for the future.</p>
          </section>

          <section
            className="cinematic-story-copy cinematic-copy-left-mid cinematic-stage-human"
            data-start="0.15"
            data-end="0.3"
          >
            <p className="cinematic-eyebrow">Human x AI</p>
            <h2>Where Human Intelligence Meets AI</h2>
            <p>We build intelligent platforms designed for scale, speed, and global impact.</p>
          </section>

          <section
            className="cinematic-story-copy cinematic-copy-left-low cinematic-stage-core"
            data-start="0.3"
            data-end="0.5"
          >
            <p className="cinematic-eyebrow">Core Systems</p>
            <h2>Engineering the Core</h2>
            <p>Advanced AI infrastructure powering next-generation digital experiences.</p>
          </section>

          <section
            className="cinematic-story-copy cinematic-copy-globe-safe cinematic-stage-globe"
            data-start="0.5"
            data-end="0.7"
          >
            <p className="cinematic-eyebrow">Global Intelligence</p>
            <h2>Built for a Connected World</h2>
            <p>
              Global systems synchronized through intelligent automation and scalable architecture.
            </p>
          </section>

          <section
            className="cinematic-story-copy cinematic-copy-right-low cinematic-stage-ecosystem"
            data-start="0.7"
            data-end="0.9"
          >
            <p className="cinematic-eyebrow">AINZA Ecosystem</p>
            <h2>One Ecosystem. Infinite Possibilities.</h2>
            <p>AI systems, web platforms, automation, and digital innovation working together.</p>
          </section>

          <section
            className="cinematic-story-copy cinematic-copy-center-lock"
            data-start="0.9"
            data-end="1"
          >
            <div className="cinematic-final-brand-lockup" aria-label="Ainza">
              <span className="cinematic-wordmark cinematic-final-wordmark" aria-hidden="true">
                <span className="cinematic-letter cinematic-letter-a">A</span>
                <span className="cinematic-letter">I</span>
                <span className="cinematic-letter">N</span>
                <span className="cinematic-letter cinematic-letter-z">Z</span>
                <span className="cinematic-letter cinematic-letter-a">A</span>
              </span>
            </div>
            <p className="cinematic-final-tagline">
              Intelligence &bull; Automation &bull; Innovation
            </p>
            <h2>
              <span className="cinematic-headline-line">Building</span>
              <span className="cinematic-headline-line">
                <span className="cinematic-gradient-text">Intelligent</span>
              </span>
              <span className="cinematic-headline-line">Digital Systems</span>
            </h2>
            <p>AI systems, automation, digital products, Web3, and full-stack engineering.</p>
            <div className="cinematic-hero-actions">
              <Link className="cinematic-button cinematic-button-primary" to="/services">
                Explore Services
              </Link>
              <Link className="cinematic-button" to="/contact">
                Book a Consultation
              </Link>
            </div>
          </section>
        </div>

        <div className="cinematic-frame-loader" aria-hidden="true">
          <div className="cinematic-loader-line">
            <span />
          </div>
          <span ref={loaderTextRef}>Loading cinematic</span>
        </div>

        <div className="cinematic-scroll-meter" aria-hidden="true">
          <span />
        </div>
      </div>
    </section>
  );
}
