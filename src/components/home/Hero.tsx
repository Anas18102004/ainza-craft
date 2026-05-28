import { Link } from "@tanstack/react-router";
import { useEffect, useRef } from "react";

const FRAME_COUNT = 721;

const FRAME_VARIANTS = {
  mobile: {
    name: "mobile",
    directory: "ainza-framed-540",
    width: 960,
    height: 540,
    finalStillPath: "/cinematic/5TH-540.jpg",
    maxCache: 72,
    maxConcurrent: 4,
    windowRadius: 22,
    targetRadius: 40,
  },
  default: {
    name: "default",
    directory: "ainza-framed-720",
    width: 1280,
    height: 720,
    finalStillPath: "/cinematic/5TH-720.jpg",
    maxCache: 64,
    maxConcurrent: 4,
    windowRadius: 20,
    targetRadius: 36,
  },
  full: {
    name: "full",
    directory: "ainza-framed-1080",
    width: 1920,
    height: 1080,
    finalStillPath: "/cinematic/5TH.png",
    maxCache: 36,
    maxConcurrent: 3,
    windowRadius: 16,
    targetRadius: 28,
  },
} as const;

type FrameVariant = (typeof FRAME_VARIANTS)[keyof typeof FRAME_VARIANTS];

type DecodedFrame = {
  index: number;
  source: CanvasImageSource;
  width: number;
  height: number;
  close?: () => void;
};

const framePath = (index: number, variant: FrameVariant) =>
  `/cinematic/${variant.directory}/frame_${String(index + 1).padStart(4, "0")}.jpg`;

type StoryCopy = {
  element: HTMLElement;
  start: number;
  end: number;
};

export function Hero() {
  const heroRef = useRef<HTMLElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const loaderTextRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const hero = heroRef.current;
    const canvas = canvasRef.current;
    const context = canvas?.getContext("2d", { alpha: false });

    if (!hero || !canvas || !context) return undefined;

    let mounted = true;
    const copies: StoryCopy[] = Array.from(
      hero.querySelectorAll<HTMLElement>(".cinematic-story-copy"),
    ).map((element) => ({
      element,
      start: Number(element.dataset.start ?? 0),
      end: Number(element.dataset.end ?? 1),
    }));

    let activeVariant = selectFrameVariant();
    let frameCache = new Map<number, DecodedFrame>();
    let queuedFrames = new Map<number, number>();
    let loadingFrames = new Set<number>();
    let failedFrames = new Set<number>();
    let frameControllers = new Map<number, AbortController>();
    let criticalFrames = new Set<number>();
    let completedCriticalFrames = new Set<number>();
    let openingCriticalFrames = new Set<number>();
    let completedOpeningFrames = new Set<number>();
    let finalStillImage: DecodedFrame | null = null;
    let finalStillReady = false;
    let finalStillDone = false;
    let finalStillController: AbortController | null = null;
    let currentFrame = 0;
    let targetFrame = 0;
    let targetProgress = 0;
    let renderedFrame = -1;
    let renderedFinalBlend = -1;
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

    function unique(items: number[]) {
      return [...new Set(items)].filter((index) => index >= 0 && index < FRAME_COUNT);
    }

    function selectFrameVariant(): FrameVariant {
      const nav = window.navigator as Navigator & {
        connection?: { saveData?: boolean; effectiveType?: string };
        deviceMemory?: number;
      };
      const saveData = Boolean(nav.connection?.saveData);
      const lowMemory = typeof nav.deviceMemory === "number" && nav.deviceMemory <= 4;
      const slowConnection = /(^|-)2g$/.test(nav.connection?.effectiveType ?? "");
      const viewport = Math.max(window.innerWidth, window.innerHeight);
      const narrowViewport = Math.min(window.innerWidth, window.innerHeight) <= 760;
      const dpr = window.devicePixelRatio || 1;

      if (saveData || slowConnection || lowMemory || narrowViewport) {
        return FRAME_VARIANTS.mobile;
      }

      if (viewport >= 1680 && dpr <= 1.5 && (nav.deviceMemory ?? 8) >= 8) {
        return FRAME_VARIANTS.full;
      }

      return FRAME_VARIANTS.default;
    }

    function smootherstep(value: number) {
      const x = clamp(value);
      return x * x * x * (x * (x * 6 - 15) + 10);
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
      renderedFrame = -1;
      renderedFinalBlend = -1;
    }

    function closeFrame(frame: DecodedFrame | null) {
      try {
        frame?.close?.();
      } catch {
        // Some browsers can throw if an ImageBitmap has already been closed.
      }
    }

    function clearDecodedFrames() {
      for (const controller of frameControllers.values()) {
        controller.abort();
      }
      finalStillController?.abort();

      for (const frame of frameCache.values()) {
        closeFrame(frame);
      }
      closeFrame(finalStillImage);

      frameCache = new Map();
      queuedFrames = new Map();
      loadingFrames = new Set();
      failedFrames = new Set();
      frameControllers = new Map();
      criticalFrames = new Set();
      completedCriticalFrames = new Set();
      openingCriticalFrames = new Set();
      completedOpeningFrames = new Set();
      finalStillImage = null;
      finalStillReady = false;
      finalStillDone = false;
      finalStillController = null;
      renderedFrame = -1;
      renderedFinalBlend = -1;
    }

    function touchFrame(index: number) {
      const frame = frameCache.get(index);
      if (!frame) return;
      frameCache.delete(index);
      frameCache.set(index, frame);
    }

    function evictFrames() {
      const protectedFrames = new Set<number>([
        0,
        targetFrame,
        clamp(Math.round(currentFrame), 0, FRAME_COUNT - 1),
      ]);
      if (renderedFrame >= 0) protectedFrames.add(renderedFrame);

      while (frameCache.size > activeVariant.maxCache) {
        let evicted = false;
        for (const [index, frame] of frameCache) {
          if (protectedFrames.has(index)) continue;
          frameCache.delete(index);
          closeFrame(frame);
          evicted = true;
          break;
        }

        if (!evicted) {
          const first = frameCache.entries().next().value as [number, DecodedFrame] | undefined;
          if (!first) return;
          frameCache.delete(first[0]);
          closeFrame(first[1]);
        }
      }
    }

    function nearestCachedFrameIndex(index: number) {
      if (frameCache.has(index)) return index;

      for (let distance = 1; distance <= activeVariant.targetRadius; distance += 1) {
        const previous = index - distance;
        const next = index + distance;

        if (previous >= 0 && frameCache.has(previous)) return previous;
        if (next < FRAME_COUNT && frameCache.has(next)) return next;
      }

      if (renderedFrame >= 0 && frameCache.has(renderedFrame)) {
        return renderedFrame;
      }

      let nearest = -1;
      let nearestDistance = Number.POSITIVE_INFINITY;
      for (const frameIndex of frameCache.keys()) {
        const distance = Math.abs(frameIndex - index);
        if (distance < nearestDistance) {
          nearest = frameIndex;
          nearestDistance = distance;
        }
      }

      return nearest;
    }

    function drawBackground() {
      context.fillStyle = "#05050f";
      context.fillRect(0, 0, cssWidth, cssHeight);
    }

    function getDrawLayout(frame: DecodedFrame) {
      const naturalWidth = frame.width || activeVariant.width;
      const naturalHeight = frame.height || activeVariant.height;
      const headerSafe = cssWidth <= 980 ? 82 : 92;
      const stageHeight = Math.max(360, cssHeight - headerSafe);
      const sourceRatio = naturalWidth / naturalHeight;
      const stageRatio = cssWidth / stageHeight;
      const containScale = Math.min(cssWidth / naturalWidth, stageHeight / naturalHeight);
      const coverScale = Math.max(cssWidth / naturalWidth, stageHeight / naturalHeight);
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

      return {
        x,
        y,
        width: shortWideViewport ? Math.max(drawWidth, cssWidth) : drawWidth,
        height: drawHeight,
      };
    }

    function getFinalStillBlend(progress: number) {
      if (!finalStillReady) return 0;
      return smootherstep(
        (progress - finalStillConfig.start) / (finalStillConfig.end - finalStillConfig.start),
      );
    }

    function drawCinematicImage(frame: DecodedFrame | null, alpha = 1) {
      if (!frame) return;
      const layout = getDrawLayout(frame);
      context.save();
      context.globalAlpha = alpha;
      context.drawImage(frame.source, layout.x, layout.y, layout.width, layout.height);
      context.restore();
    }

    function drawFrame(index: number) {
      const frameIndex = nearestCachedFrameIndex(index);
      if (frameIndex === -1) {
        drawBackground();
        return;
      }

      const frame = frameCache.get(frameIndex) ?? null;
      const finalBlend = getFinalStillBlend(targetProgress);

      touchFrame(frameIndex);
      drawBackground();
      drawCinematicImage(frame);

      if (finalBlend > 0) {
        drawCinematicImage(finalStillImage, finalBlend);
      }

      renderedFrame = frameIndex;
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
      const total = Math.max(1, criticalFrames.size + 1);
      const loaded = completedCriticalFrames.size + (finalStillDone ? 1 : 0);
      const progress = Math.round((loaded / total) * 100);
      hero.style.setProperty("--cinematic-load-progress", `${progress}%`);
      if (loaderTextRef.current) {
        loaderTextRef.current.textContent =
          progress < 100 ? `Preparing sequence ${progress}%` : "Sequence ready";
      }
      if (progress === 100) {
        window.setTimeout(() => {
          if (mounted) hero.style.setProperty("--cinematic-loader-opacity", "0");
        }, 500);
      }
    }

    function getAutoIntroTargetY() {
      const scrollable = hero.offsetHeight - window.innerHeight;
      if (scrollable <= 0) return 0;
      return Math.round(hero.offsetTop + scrollable * autoIntroConfig.targetProgress);
    }

    function canRunAutoIntro() {
      return (
        completedOpeningFrames.size >= openingCriticalFrames.size &&
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

    function markFrameDone(index: number) {
      if (criticalFrames.has(index)) completedCriticalFrames.add(index);
      if (openingCriticalFrames.has(index)) completedOpeningFrames.add(index);
      updateLoader();
      scheduleAutoIntro();
    }

    async function decodeImage(url: string, index: number, signal: AbortSignal) {
      const response = await fetch(url, { cache: "force-cache", signal });
      if (!response.ok) throw new Error(`Unable to load cinematic frame ${index}`);

      const blob = await response.blob();
      if ("createImageBitmap" in window) {
        const bitmap = await createImageBitmap(blob);
        return {
          index,
          source: bitmap,
          width: bitmap.width,
          height: bitmap.height,
          close: () => bitmap.close(),
        };
      }

      return await new Promise<DecodedFrame>((resolve, reject) => {
        const objectUrl = URL.createObjectURL(blob);
        const image = new Image();
        image.decoding = "async";
        image.onload = () => {
          URL.revokeObjectURL(objectUrl);
          resolve({
            index,
            source: image,
            width: image.naturalWidth || activeVariant.width,
            height: image.naturalHeight || activeVariant.height,
          });
        };
        image.onerror = () => {
          URL.revokeObjectURL(objectUrl);
          reject(new Error(`Unable to decode cinematic frame ${index}`));
        };
        image.src = objectUrl;
      });
    }

    function enqueueFrame(index: number, priority: number) {
      if (index < 0 || index >= FRAME_COUNT) return;
      if (frameCache.has(index) || loadingFrames.has(index) || failedFrames.has(index)) return;

      const existingPriority = queuedFrames.get(index);
      if (existingPriority === undefined || priority < existingPriority) {
        queuedFrames.set(index, priority);
      }

      pumpFrameQueue();
    }

    function pruneFrameQueue(center: number) {
      const keepDistance = activeVariant.windowRadius * 5;
      for (const index of queuedFrames.keys()) {
        if (criticalFrames.has(index)) continue;
        if (Math.abs(index - center) > keepDistance) queuedFrames.delete(index);
      }
    }

    function pumpFrameQueue() {
      if (!mounted) return;

      while (loadingFrames.size < activeVariant.maxConcurrent && queuedFrames.size > 0) {
        const next = [...queuedFrames.entries()].sort((a, b) => a[1] - b[1])[0];
        if (!next) return;

        const [index] = next;
        const variantForRequest = activeVariant;
        const controller = new AbortController();

        queuedFrames.delete(index);
        loadingFrames.add(index);
        frameControllers.set(index, controller);

        decodeImage(framePath(index, variantForRequest), index, controller.signal)
          .then((frame) => {
            if (!mounted || activeVariant.name !== variantForRequest.name) {
              closeFrame(frame);
              return;
            }

            frameCache.set(index, frame);
            touchFrame(index);
            evictFrames();
            markFrameDone(index);

            if (index === 0 || Math.abs(index - targetFrame) <= activeVariant.targetRadius) {
              drawFrame(targetFrame);
            }
          })
          .catch((error) => {
            if (!mounted || activeVariant.name !== variantForRequest.name) return;
            if (!(error instanceof DOMException && error.name === "AbortError")) {
              failedFrames.add(index);
              markFrameDone(index);
            }
          })
          .finally(() => {
            loadingFrames.delete(index);
            frameControllers.delete(index);
            pumpFrameQueue();
          });
      }
    }

    function requestFrameWindow(
      center: number,
      radius = activeVariant.windowRadius,
      priority = 20,
    ) {
      const indexes = [];
      for (let offset = -radius; offset <= radius; offset += 1) {
        indexes.push(center + offset);
      }
      unique(indexes).forEach((index) => {
        enqueueFrame(index, priority + Math.abs(index - center));
      });
    }

    function loadFinalStill() {
      finalStillController?.abort();
      finalStillController = new AbortController();
      const variantForRequest = activeVariant;

      decodeImage(variantForRequest.finalStillPath, FRAME_COUNT, finalStillController.signal)
        .then((frame) => {
          if (!mounted || activeVariant.name !== variantForRequest.name) {
            closeFrame(frame);
            return;
          }

          finalStillImage = frame;
          finalStillReady = true;
          finalStillDone = true;
          renderedFrame = -1;
          renderedFinalBlend = -1;
          updateLoader();
          drawFrame(clamp(Math.round(currentFrame), 0, FRAME_COUNT - 1));
        })
        .catch(() => {
          if (!mounted || activeVariant.name !== variantForRequest.name) return;
          finalStillReady = false;
          finalStillDone = true;
          updateLoader();
        });
    }

    function preloadFrames() {
      const keyFrames = unique([0, 108, 216, 360, 504, 648, 720]);
      const openingFrames = unique(Array.from({ length: 42 }, (_, index) => index));
      openingCriticalFrames = new Set(openingFrames);
      criticalFrames = new Set(unique([...keyFrames, ...openingFrames]));
      updateLoader();
      loadFinalStill();

      enqueueFrame(0, 0);
      openingFrames.forEach((index) => enqueueFrame(index, 2 + index / 100));
      keyFrames.forEach((index, order) => enqueueFrame(index, 8 + order));
      requestFrameWindow(0, activeVariant.windowRadius, 14);
    }

    function switchVariant(nextVariant: FrameVariant) {
      if (nextVariant.name === activeVariant.name) return;
      activeVariant = nextVariant;
      clearDecodedFrames();
      drawBackground();
      preloadFrames();
    }

    function render() {
      if (!mounted) return;

      resizeCanvas();

      targetProgress = getScrollProgress();
      targetFrame = Math.round(targetProgress * (FRAME_COUNT - 1));
      currentFrame += (targetFrame - currentFrame) * 0.28;

      const frameToDraw = clamp(Math.round(currentFrame), 0, FRAME_COUNT - 1);
      const finalBlend = getFinalStillBlend(targetProgress);
      const direction = targetFrame >= currentFrame ? 1 : -1;
      const predictedFrame = clamp(
        frameToDraw + direction * activeVariant.windowRadius,
        0,
        FRAME_COUNT - 1,
      );

      enqueueFrame(targetFrame, 1);
      requestFrameWindow(frameToDraw, activeVariant.windowRadius, 18);
      requestFrameWindow(predictedFrame, Math.round(activeVariant.windowRadius * 0.7), 34);
      pruneFrameQueue(targetFrame);

      if (frameToDraw !== renderedFrame || Math.abs(finalBlend - renderedFinalBlend) > 0.004) {
        drawFrame(frameToDraw);
      }

      updateStory(targetProgress);
      rafId = requestAnimationFrame(render);
    }

    const handleResize = () => {
      if (autoIntroState.scheduled && !canRunAutoIntro()) cancelAutoIntro();
      switchVariant(selectFrameVariant());
      resizeCanvas();
      drawFrame(clamp(Math.round(currentFrame), 0, FRAME_COUNT - 1));
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
    drawBackground();
    preloadFrames();
    render();

    return () => {
      mounted = false;
      cancelAutoIntro();
      cancelAnimationFrame(rafId);
      clearDecodedFrames();
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
