import { Link } from "@tanstack/react-router";
import { useEffect, useRef } from "react";

const SOURCE_WIDTH = 1920;
const SOURCE_HEIGHT = 1080;
const FINAL_STILL_PATH = "/cinematic/5TH.png";
const HERO_VIDEO_PATH = "/cinematic/ainza-hero-sequence.mp4";
const HERO_POSTER_PATH = "/cinematic/ainza-framed-1080/frame_0001.jpg";

type StoryCopy = {
  element: HTMLElement;
  start: number;
  end: number;
};

export function Hero() {
  const heroRef = useRef<HTMLElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const loaderTextRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const hero = heroRef.current;
    const canvas = canvasRef.current;
    const video = videoRef.current;
    const context = canvas?.getContext("2d", { alpha: false });

    if (!hero || !canvas || !video || !context) return undefined;

    let mounted = true;
    const copies: StoryCopy[] = Array.from(
      hero.querySelectorAll<HTMLElement>(".cinematic-story-copy"),
    ).map((element) => ({
      element,
      start: Number(element.dataset.start ?? 0),
      end: Number(element.dataset.end ?? 1),
    }));

    let posterImage: HTMLImageElement | null = null;
    let posterReady = false;
    let finalStillImage: HTMLImageElement | null = null;
    let finalStillReady = false;
    let videoReady = false;
    let videoCanPlayThrough = false;
    let videoDuration = 30;
    let currentProgress = 0;
    let targetProgress = 0;
    let renderedVideoTime = -1;
    let renderedFinalBlend = -1;
    let isSeeking = false;
    let cssWidth = 0;
    let cssHeight = 0;
    let dpr = 1;
    let rafId = 0;
    let autoIntroRafId = 0;

    const reducedMotionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const premiumEaseOut = (t: number) => Math.min(1, 1.001 - 2 ** (-10 * t));
    const cinematicAutoEase = (t: number) => {
      const x = clamp(t);
      return x < 0.5 ? 4 * x * x * x : 1 - (-2 * x + 2) ** 3 / 2;
    };
    const autoIntroConfig = {
      delay: 1700,
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

    function resizeCanvas() {
      const nextCssWidth = Math.round(window.innerWidth);
      const nextCssHeight = Math.round(window.innerHeight);
      const nextDpr = Math.min(window.devicePixelRatio || 1, 2);

      if (nextCssWidth === cssWidth && nextCssHeight === cssHeight && nextDpr === dpr) {
        return;
      }

      cssWidth = nextCssWidth;
      cssHeight = nextCssHeight;
      dpr = nextDpr;
      canvas.width = Math.round(cssWidth * dpr);
      canvas.height = Math.round(cssHeight * dpr);
      canvas.style.width = `${cssWidth}px`;
      canvas.style.height = `${cssHeight}px`;
      context.setTransform(dpr, 0, 0, dpr, 0, 0);
      context.imageSmoothingEnabled = true;
      context.imageSmoothingQuality = "high";
      renderedVideoTime = -1;
      renderedFinalBlend = -1;
    }

    function drawBackground() {
      context.fillStyle = "#05050f";
      context.fillRect(0, 0, cssWidth, cssHeight);

      const gradient = context.createLinearGradient(0, 0, 0, cssHeight);
      gradient.addColorStop(0, "#0e0e28");
      gradient.addColorStop(0.15, "#0a0a1e");
      gradient.addColorStop(0.5, "#05050f");
      gradient.addColorStop(1, "#03030a");
      context.fillStyle = gradient;
      context.fillRect(0, 0, cssWidth, cssHeight);

      context.save();
      const topGlow = context.createRadialGradient(
        cssWidth * 0.5,
        0,
        0,
        cssWidth * 0.5,
        0,
        cssWidth * 0.45,
      );
      topGlow.addColorStop(0, "rgba(100, 80, 180, 0.12)");
      topGlow.addColorStop(0.4, "rgba(60, 50, 140, 0.06)");
      topGlow.addColorStop(1, "rgba(0, 0, 0, 0)");
      context.fillStyle = topGlow;
      context.fillRect(0, 0, cssWidth, cssHeight * 0.3);
      context.restore();
    }

    function getDrawLayout(source: HTMLImageElement | HTMLVideoElement) {
      const naturalWidth =
        "videoWidth" in source
          ? source.videoWidth || SOURCE_WIDTH
          : source.naturalWidth || SOURCE_WIDTH;
      const naturalHeight =
        "videoHeight" in source
          ? source.videoHeight || SOURCE_HEIGHT
          : source.naturalHeight || SOURCE_HEIGHT;
      const headerSafe = cssWidth <= 980 ? 82 : 92;
      const stageHeight = Math.max(360, cssHeight - headerSafe);
      const sourceRatio = naturalWidth / naturalHeight;
      const stageRatio = cssWidth / stageHeight;
      const containScale = Math.min(cssWidth / naturalWidth, stageHeight / naturalHeight);
      const coverScale = Math.max(cssWidth / naturalWidth, stageHeight / naturalHeight);
      const edgeScale = Math.max(cssWidth / naturalWidth, cssHeight / naturalHeight);
      const cinematicInset = cssWidth > 1180;
      const shortWideViewport = cssWidth > 1200 && stageRatio > sourceRatio + 0.1;
      const scale = cinematicInset ? Math.min(coverScale, containScale * 1.24) : coverScale;
      const drawWidth = Math.round(naturalWidth * scale);
      const drawHeight = Math.round(naturalHeight * scale);
      const x = Math.round((cssWidth - drawWidth) / 2);
      const y =
        drawHeight > stageHeight
          ? headerSafe
          : Math.round(headerSafe + (stageHeight - drawHeight) / 2);
      const backdropWidth = Math.round(naturalWidth * coverScale);
      const backdropHeight = Math.round(naturalHeight * coverScale);
      const backdropX = Math.round((cssWidth - backdropWidth) / 2);
      const backdropY =
        backdropHeight > stageHeight
          ? headerSafe
          : Math.round(headerSafe + (stageHeight - backdropHeight) / 2);
      const edgeWidth = Math.round(naturalWidth * edgeScale);
      const edgeHeight = Math.round(naturalHeight * edgeScale);
      const edgeX = Math.round((cssWidth - edgeWidth) / 2);
      const edgeY = Math.round((cssHeight - edgeHeight) / 2);

      return {
        main: { x, y, width: drawWidth, height: drawHeight },
        backdrop: { x: backdropX, y: backdropY, width: backdropWidth, height: backdropHeight },
        edge: { x: edgeX, y: edgeY, width: edgeWidth, height: edgeHeight },
        fillBackdrop: shortWideViewport || cinematicInset,
      };
    }

    function getFinalStillBlend(progress: number) {
      if (!finalStillReady) return 0;
      return smootherstep(
        (progress - finalStillConfig.start) / (finalStillConfig.end - finalStillConfig.start),
      );
    }

    function drawCinematicSource(source: HTMLImageElement | HTMLVideoElement | null, alpha = 1) {
      if (!source) return;

      const { main, backdrop, edge, fillBackdrop } = getDrawLayout(source);
      const spillWidth = Math.round(Math.min(80, Math.max(40, cssWidth * 0.045)));
      const leftSpillEnd = Math.max(0, Math.min(main.x + spillWidth, cssWidth * 0.36));
      const leftFeatherStart = Math.max(0, main.x - Math.round(spillWidth * 0.55));
      const leftFeatherEnd = Math.min(cssWidth, main.x + Math.round(spillWidth * 0.72));
      const rightEdge = main.x + main.width;
      const rightSpillStart = Math.min(cssWidth, Math.max(rightEdge - spillWidth, cssWidth * 0.64));
      const rightFeatherStart = Math.max(0, rightEdge - Math.round(spillWidth * 0.72));
      const rightFeatherEnd = Math.min(cssWidth, rightEdge + Math.round(spillWidth * 0.55));

      context.save();
      context.globalAlpha = alpha * (fillBackdrop ? 0.28 : 0.38);
      context.drawImage(source, edge.x, edge.y, edge.width, edge.height);
      context.fillStyle = "rgba(5, 5, 17, 0.04)";
      context.fillRect(0, 0, cssWidth, cssHeight);
      context.restore();

      if (main.x > 0 && leftSpillEnd > 0) {
        context.save();
        context.beginPath();
        context.rect(0, 0, leftSpillEnd, cssHeight);
        context.clip();
        context.globalAlpha = alpha * 0.32;
        context.drawImage(source, backdrop.x, backdrop.y, backdrop.width, backdrop.height);
        const spillMask = context.createLinearGradient(0, 0, leftSpillEnd, 0);
        spillMask.addColorStop(0, "rgba(5, 5, 17, 0.03)");
        spillMask.addColorStop(0.5, "rgba(5, 5, 17, 0.01)");
        spillMask.addColorStop(1, "rgba(5, 5, 17, 0)");
        context.globalAlpha = alpha;
        context.fillStyle = spillMask;
        context.fillRect(0, 0, leftSpillEnd, cssHeight);
        context.restore();
      }

      if (rightEdge < cssWidth) {
        context.save();
        context.beginPath();
        context.rect(rightSpillStart, 0, cssWidth - rightSpillStart, cssHeight);
        context.clip();
        context.globalAlpha = alpha * 0.32;
        context.drawImage(source, backdrop.x, backdrop.y, backdrop.width, backdrop.height);
        const rightSpillMask = context.createLinearGradient(rightSpillStart, 0, cssWidth, 0);
        rightSpillMask.addColorStop(0, "rgba(5, 5, 17, 0)");
        rightSpillMask.addColorStop(0.5, "rgba(5, 5, 17, 0.01)");
        rightSpillMask.addColorStop(1, "rgba(5, 5, 17, 0.03)");
        context.globalAlpha = alpha;
        context.fillStyle = rightSpillMask;
        context.fillRect(rightSpillStart, 0, cssWidth - rightSpillStart, cssHeight);
        context.restore();
      }

      if (fillBackdrop) {
        context.save();
        context.globalAlpha = alpha * 0.14;
        context.drawImage(source, backdrop.x, backdrop.y, backdrop.width, backdrop.height);
        context.fillStyle = "rgba(5, 5, 15, 0.02)";
        context.fillRect(0, 0, cssWidth, cssHeight);
        context.restore();
      }

      context.save();
      context.globalAlpha = alpha;
      context.drawImage(source, main.x, main.y, main.width, main.height);
      context.restore();

      if (main.x > 0 && leftFeatherEnd > leftFeatherStart) {
        context.save();
        const feather = context.createLinearGradient(leftFeatherStart, 0, leftFeatherEnd, 0);
        feather.addColorStop(0, "rgba(5, 5, 17, 0)");
        feather.addColorStop(0.38, "rgba(5, 5, 17, 0.025)");
        feather.addColorStop(0.58, "rgba(5, 5, 17, 0.01)");
        feather.addColorStop(1, "rgba(5, 5, 17, 0)");
        context.globalAlpha = alpha;
        context.fillStyle = feather;
        context.fillRect(leftFeatherStart, 0, leftFeatherEnd - leftFeatherStart, cssHeight);
        context.restore();
      }

      if (rightEdge < cssWidth && rightFeatherEnd > rightFeatherStart) {
        context.save();
        const rightFeather = context.createLinearGradient(rightFeatherStart, 0, rightFeatherEnd, 0);
        rightFeather.addColorStop(0, "rgba(5, 5, 17, 0)");
        rightFeather.addColorStop(0.42, "rgba(5, 5, 17, 0.01)");
        rightFeather.addColorStop(0.62, "rgba(5, 5, 17, 0.025)");
        rightFeather.addColorStop(1, "rgba(5, 5, 17, 0)");
        context.globalAlpha = alpha;
        context.fillStyle = rightFeather;
        context.fillRect(rightFeatherStart, 0, rightFeatherEnd - rightFeatherStart, cssHeight);
        context.restore();
      }
    }

    function drawFrame() {
      const source =
        videoReady && video.readyState >= HTMLMediaElement.HAVE_CURRENT_DATA ? video : posterImage;
      if (!source) return;

      const finalBlend = getFinalStillBlend(targetProgress);

      drawBackground();
      drawCinematicSource(source);

      if (finalBlend > 0) {
        drawCinematicSource(finalStillImage, finalBlend);
      }

      renderedVideoTime = video.currentTime;
      renderedFinalBlend = finalBlend;
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
      let progress = posterReady ? 16 : 0;

      progress = Math.max(progress, Math.round(getBufferedRatio() * 100));

      if (videoReady) progress = Math.max(progress, 62);
      if (videoCanPlayThrough || getBufferedRatio() >= 0.96) progress = 100;

      hero.style.setProperty("--cinematic-load-progress", `${progress}%`);
      if (loaderTextRef.current) {
        loaderTextRef.current.textContent =
          progress < 100 ? `Loading cinematic ${progress}%` : "Cinematic ready";
      }
      if (progress >= 100) {
        window.setTimeout(() => {
          if (mounted) hero.style.setProperty("--cinematic-loader-opacity", "0");
        }, 500);
      } else if (videoReady) {
        window.setTimeout(() => {
          if (mounted) hero.style.setProperty("--cinematic-loader-opacity", "0");
        }, 1100);
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

    function loadPoster() {
      return new Promise<HTMLImageElement | null>((resolve) => {
        const image = new Image();
        image.decoding = "async";
        image.loading = "eager";
        image.onload = () => {
          if (!mounted) {
            resolve(null);
            return;
          }
          posterImage = image;
          posterReady = true;
          drawFrame();
          updateLoader();
          resolve(image);
        };
        image.onerror = () => {
          if (mounted) updateLoader();
          resolve(null);
        };
        image.src = HERO_POSTER_PATH;
      });
    }

    function loadFinalStill() {
      return new Promise<HTMLImageElement | null>((resolve) => {
        const image = new Image();
        image.decoding = "async";
        image.loading = "eager";
        image.onload = () => {
          if (!mounted) {
            resolve(null);
            return;
          }
          finalStillImage = image;
          finalStillReady = true;
          renderedVideoTime = -1;
          renderedFinalBlend = -1;
          drawFrame();
          resolve(image);
        };
        image.onerror = () => {
          finalStillReady = false;
          resolve(null);
        };
        image.src = FINAL_STILL_PATH;
      });
    }

    function requestVideoTime(progress: number) {
      if (!videoReady || !Number.isFinite(videoDuration) || videoDuration <= 0) return;

      const nextTime = clamp(progress) * Math.max(0, videoDuration - 0.05);
      if (isSeeking || Math.abs(video.currentTime - nextTime) < 0.035) return;

      isSeeking = true;
      try {
        video.currentTime = nextTime;
      } catch {
        isSeeking = false;
      }
    }

    function scheduleAutoIntroWhenBuffered() {
      if (videoCanPlayThrough || getBufferedRatio() >= 0.55) {
        scheduleAutoIntro();
      }
    }

    function prepareVideo() {
      video.muted = true;
      video.playsInline = true;
      video.preload = "auto";
      video.src = HERO_VIDEO_PATH;

      const handleLoadedMetadata = () => {
        if (!mounted) return;
        videoDuration =
          Number.isFinite(video.duration) && video.duration > 0 ? video.duration : videoDuration;
        requestVideoTime(targetProgress);
        updateLoader();
      };
      const handleCanPlay = () => {
        if (!mounted) return;
        videoReady = true;
        isSeeking = false;
        scheduleAutoIntroWhenBuffered();
        updateLoader();
        drawFrame();
      };
      const handleCanPlayThrough = () => {
        if (!mounted) return;
        videoCanPlayThrough = true;
        scheduleAutoIntro();
        updateLoader();
      };
      const handleSeeked = () => {
        if (!mounted) return;
        isSeeking = false;
        drawFrame();
      };
      const handleProgress = () => {
        if (!mounted) return;
        scheduleAutoIntroWhenBuffered();
        updateLoader();
      };
      const handleError = () => {
        if (!mounted) return;
        videoReady = false;
        isSeeking = false;
        hero.style.setProperty("--cinematic-loader-opacity", "0");
        drawFrame();
      };

      video.addEventListener("loadedmetadata", handleLoadedMetadata);
      video.addEventListener("loadeddata", handleCanPlay);
      video.addEventListener("canplay", handleCanPlay);
      video.addEventListener("canplaythrough", handleCanPlayThrough);
      video.addEventListener("seeked", handleSeeked);
      video.addEventListener("progress", handleProgress);
      video.addEventListener("error", handleError);
      video.load();

      return () => {
        video.removeEventListener("loadedmetadata", handleLoadedMetadata);
        video.removeEventListener("loadeddata", handleCanPlay);
        video.removeEventListener("canplay", handleCanPlay);
        video.removeEventListener("canplaythrough", handleCanPlayThrough);
        video.removeEventListener("seeked", handleSeeked);
        video.removeEventListener("progress", handleProgress);
        video.removeEventListener("error", handleError);
      };
    }

    function render() {
      if (!mounted) return;

      resizeCanvas();

      targetProgress = getScrollProgress();
      currentProgress += (targetProgress - currentProgress) * 0.24;

      requestVideoTime(currentProgress);
      const finalBlend = getFinalStillBlend(targetProgress);

      if (
        !videoReady ||
        Math.abs(video.currentTime - renderedVideoTime) > 0.03 ||
        Math.abs(finalBlend - renderedFinalBlend) > 0.004
      ) {
        drawFrame();
      }

      updateStory(targetProgress);
      rafId = requestAnimationFrame(render);
    }

    const handleResize = () => {
      if (autoIntroState.scheduled && !canRunAutoIntro()) cancelAutoIntro();
      resizeCanvas();
      drawFrame();
    };
    const handleScroll = () => {
      if (!autoIntroState.running && window.scrollY > autoIntroConfig.maxInitialScroll) {
        cancelAutoIntro();
      }
    };
    const handleKeyDown = (event: KeyboardEvent) => {
      if (scrollIntentKeys.has(event.key)) cancelAutoIntro();
    };

    window.addEventListener("resize", handleResize);
    window.addEventListener("wheel", cancelAutoIntro, { passive: true });
    window.addEventListener("touchstart", cancelAutoIntro, { passive: true });
    window.addEventListener("pointerdown", cancelAutoIntro, { passive: true });
    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("scroll", handleScroll, { passive: true });
    reducedMotionQuery.addEventListener?.("change", cancelAutoIntro);

    resizeCanvas();
    const cleanupVideo = prepareVideo();
    void Promise.all([loadPoster(), loadFinalStill()]);
    render();

    return () => {
      mounted = false;
      cancelAutoIntro();
      cancelAnimationFrame(rafId);
      cleanupVideo();
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("wheel", cancelAutoIntro);
      window.removeEventListener("touchstart", cancelAutoIntro);
      window.removeEventListener("pointerdown", cancelAutoIntro);
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("scroll", handleScroll);
      reducedMotionQuery.removeEventListener?.("change", cancelAutoIntro);
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
          muted
          playsInline
          preload="auto"
          poster={HERO_POSTER_PATH}
          aria-hidden="true"
        />
        <canvas ref={canvasRef} className="cinematic-canvas" width={1280} height={720} />
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
          <span ref={loaderTextRef}>Loading sequence</span>
        </div>

        <div className="cinematic-scroll-meter" aria-hidden="true">
          <span />
        </div>
      </div>
    </section>
  );
}
