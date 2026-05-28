"use client";

import * as React from "react";
import * as THREE from "three";

/**
 * Scroll-scrubbed video hero canvas.
 *
 *   - The video does NOT autoplay. It's paused on mount.
 *   - scroll position → maps to video.currentTime each frame.
 *   - Scrolling forward advances the video, scrolling back rewinds it.
 *   - Same three.js shader vocabulary as the immersive hero (cursor
 *     light, water shimmer, depth-weighted parallax) sampled per frame
 *     against the live video texture.
 *
 * For smooth bidirectional seeking the source must be encoded with
 * keyframe-every-frame (`ffmpeg -g 1 -keyint_min 1 -sc_threshold 0`).
 * Without that, seeking lands on the nearest keyframe and the video
 * jumps in chunks instead of scrubbing smoothly.
 *
 * The component renders ONLY the canvas. The page wraps it in a tall
 * "scroll runway" that is `position: sticky` so the canvas stays
 * pinned to the viewport while scroll advances the video. The
 * `scrubScopeRef` points at that runway; we measure progress as
 * (-runwayTop) / (runwayHeight - viewportHeight).
 */
export interface HomeVideoCanvasProps {
  videoSrc: string;
  videoSrcMobile?: string;
  maskSrc: string;
  videoAspect: number;
  posterSrc?: string;

  /** REF to the tall scroll runway. The video's currentTime is mapped
   *  to the user's progress through this element's height. */
  scrubScopeRef: React.RefObject<HTMLElement | null>;

  cursorLightStrength?: number;
  shimmerStrength?: number;
  brightnessLift?: number;
  tint?: [number, number, number];
  saturation?: number;
  contrast?: number;
  parallaxX?: number;
  parallaxY?: number;
}

const VERTEX = /* glsl */ `
  varying vec2 vuv;
  void main() {
    vuv = uv;
    gl_Position = vec4(position, 1.0);
  }
`;

const FRAGMENT = /* glsl */ `
  precision highp float;

  uniform sampler2D uVideo;
  uniform sampler2D uMask;
  uniform vec2  uCursor;
  uniform float uTime;
  uniform float uAspectViewport;
  uniform float uAspectVideo;

  uniform float uCursorLight;
  uniform float uShimmer;
  uniform float uBrightness;
  uniform vec3  uTint;
  uniform float uSaturation;
  uniform float uContrast;
  uniform float uParallaxX;
  uniform float uParallaxY;

  varying vec2 vuv;

  float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
  float vnoise(vec2 p) {
    vec2 i = floor(p), f = fract(p);
    float a = hash(i), b = hash(i + vec2(1.,0.));
    float c = hash(i + vec2(0.,1.)), d = hash(i + vec2(1.,1.));
    vec2 u = f * f * (3.0 - 2.0 * f);
    return mix(a, b, u.x) + (c - a) * u.y * (1.0 - u.x) + (d - b) * u.x * u.y;
  }

  vec3 grade(vec3 c) {
    c = (c - 0.5) * uContrast + 0.5;
    float l = dot(c, vec3(0.2126, 0.7152, 0.0722));
    c = mix(vec3(l), c, uSaturation);
    c *= uTint;
    return c;
  }

  void main() {
    // Cover-fit
    float ar = uAspectVideo / uAspectViewport;
    vec2 visible = (ar < 1.0) ? vec2(1.0, ar) : vec2(1.0 / ar, 1.0);
    vec2 start = vec2(0.0);
    if (ar < 1.0) {
      start.y = (1.0 - visible.y) * 0.5;
    } else {
      start.x = (1.0 - visible.x) * 0.5;
    }
    vec2 uv = start + vuv * visible;

    vec3 mask = texture2D(uMask, uv).rgb;
    float waterMask = mask.g;
    float staticMask = mask.b;
    float water = smoothstep(0.30, 0.55, waterMask) * (1.0 - staticMask);

    vec2 toCursor = vuv - uCursor;
    float cursorDist = length(toCursor);

    // Mild caustic shimmer (subtler than static hero — video already
    // has real motion of its own).
    float t = uTime;
    float caustic =
        vnoise(uv * 5.0 + vec2(t * 0.18, -t * 0.11)) +
        vnoise(uv * 9.0 - vec2(t * 0.25, t * 0.08)) * 0.5;
    caustic = (caustic - 0.75) * 0.55;

    vec2 cursorOffset = uCursor - vec2(0.5);
    float horizonWeight = 1.0 - vuv.y;
    vec2 parallax = vec2(
      cursorOffset.x * horizonWeight * uParallaxX,
      cursorOffset.y * uParallaxY
    ) * (1.0 - staticMask);

    vec2 sampleUV = uv + parallax;
    vec3 color = texture2D(uVideo, sampleUV).rgb * uBrightness;
    color = grade(color);

    float shimmer = caustic * uShimmer * water;
    float cursorLight = exp(-cursorDist * 3.2) * uCursorLight;
    color += shimmer + cursorLight;

    gl_FragColor = vec4(color, 1.0);
  }
`;

export function HomeVideoCanvas({
  videoSrc,
  videoSrcMobile,
  maskSrc,
  videoAspect,
  posterSrc,
  scrubScopeRef,
  cursorLightStrength = 0.14,
  shimmerStrength = 0.08,
  brightnessLift = 1.10,
  tint = [1, 1, 1],
  saturation = 1.0,
  contrast = 1.0,
  parallaxX = 0.008,
  parallaxY = 0.004,
}: HomeVideoCanvasProps) {
  const containerRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // --- Video — paused, scroll-driven currentTime --------------------
    const video = document.createElement("video");
    video.crossOrigin = "anonymous";
    video.muted = true;
    video.loop = false;
    video.playsInline = true;
    video.autoplay = false;
    video.setAttribute("webkit-playsinline", "true");
    video.preload = "auto";
    if (posterSrc) video.poster = posterSrc;

    const isMobile = typeof window !== "undefined" && window.innerWidth < 900;
    video.src = isMobile && videoSrcMobile ? videoSrcMobile : videoSrc;
    video.load();
    // Some browsers need a moment to compute duration; play+pause once
    // primes the pipeline so seeking responds immediately afterward.
    let duration = 0;
    const onMeta = () => {
      duration = isFinite(video.duration) ? video.duration : 0;
      // Prime decode: a 0-duration play+pause kicks Safari into
      // decoding without ever showing the frame to the user.
      video.play().then(() => video.pause()).catch(() => { /* noop */ });
    };
    video.addEventListener("loadedmetadata", onMeta);

    // --- WebGL setup --------------------------------------------------
    const renderer = new THREE.WebGLRenderer({
      antialias: false,
      alpha: false,
      powerPreference: "high-performance",
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
    renderer.setClearColor(0x06141a, 1);
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    container.appendChild(renderer.domElement);
    Object.assign(renderer.domElement.style, {
      position: "absolute",
      inset: "0",
      width: "100%",
      height: "100%",
      display: "block",
    });

    const scene = new THREE.Scene();
    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);

    const videoTex = new THREE.VideoTexture(video);
    videoTex.minFilter = THREE.LinearFilter;
    videoTex.magFilter = THREE.LinearFilter;
    videoTex.wrapS = THREE.ClampToEdgeWrapping;
    videoTex.wrapT = THREE.ClampToEdgeWrapping;
    videoTex.colorSpace = THREE.SRGBColorSpace;

    const loader = new THREE.TextureLoader();
    const maskTex = loader.load(maskSrc);
    maskTex.minFilter = THREE.LinearFilter;
    maskTex.magFilter = THREE.LinearFilter;
    maskTex.colorSpace = THREE.NoColorSpace;

    const uniforms: Record<string, { value: unknown }> = {
      uVideo: { value: videoTex },
      uMask: { value: maskTex },
      uCursor: { value: new THREE.Vector2(0.5, 0.5) },
      uTime: { value: 0 },
      uAspectViewport: { value: 1 },
      uAspectVideo: { value: videoAspect },
      uCursorLight: { value: cursorLightStrength },
      uShimmer: { value: shimmerStrength },
      uBrightness: { value: brightnessLift },
      uTint: { value: new THREE.Vector3(tint[0], tint[1], tint[2]) },
      uSaturation: { value: saturation },
      uContrast: { value: contrast },
      uParallaxX: { value: parallaxX },
      uParallaxY: { value: parallaxY },
    };

    const material = new THREE.ShaderMaterial({
      vertexShader: VERTEX,
      fragmentShader: FRAGMENT,
      uniforms: uniforms as never,
      depthTest: false,
      depthWrite: false,
    });
    const geometry = new THREE.PlaneGeometry(2, 2);
    const mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);

    // --- Pointer ------------------------------------------------------
    const targetCursor: [number, number] = [0.5, 0.5];
    const smoothCursor: [number, number] = [0.5, 0.5];

    const onPointer = (e: PointerEvent) => {
      const x = e.clientX / window.innerWidth;
      const y = e.clientY / window.innerHeight;
      targetCursor[0] = x;
      targetCursor[1] = 1 - y;
    };
    window.addEventListener("pointermove", onPointer, { passive: true });

    const resize = () => {
      const w = container.clientWidth;
      const h = container.clientHeight;
      renderer.setSize(w, h, false);
      (uniforms.uAspectViewport as { value: number }).value = w / Math.max(1, h);
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(container);

    let visible = !document.hidden;
    const onVis = () => { visible = !document.hidden; };
    document.addEventListener("visibilitychange", onVis);

    const loseCtx = renderer.getContext().getExtension("WEBGL_lose_context");

    // --- Scroll → currentTime mapping --------------------------------
    // Smooth the target time so very fast scrolls don't flood the
    // decoder with seek requests it can't keep up with. The lerp also
    // gives the impression of momentum.
    let targetTime = 0;
    let currentSmoothTime = 0;
    let lastSeekAt = 0;
    const MIN_SEEK_INTERVAL = 16; // ms — about one frame

    const computeProgress = (): number => {
      const scope = scrubScopeRef.current;
      if (!scope) return 0;
      const rect = scope.getBoundingClientRect();
      // Total scrollable distance inside this scope (height - one viewport).
      const total = Math.max(1, scope.offsetHeight - window.innerHeight);
      // How far the top of the scope has scrolled past the top of the viewport.
      const scrolled = Math.max(0, -rect.top);
      return Math.min(1, scrolled / total);
    };

    let raf = 0;
    let lastFrame = performance.now();
    const tick = () => {
      raf = requestAnimationFrame(tick);
      if (!visible) {
        lastFrame = performance.now();
        return;
      }
      const now = performance.now();
      const dt = Math.min(0.05, (now - lastFrame) / 1000);
      lastFrame = now;

      // Update target time from scroll
      if (duration > 0) {
        const p = computeProgress();
        // Leave a tiny epsilon at the end so the last frame is reachable.
        targetTime = p * Math.max(0, duration - 0.02);

        // Smooth — heavier damping when scrolling fast so the video
        // doesn't tear; lighter when the user is barely moving.
        currentSmoothTime += (targetTime - currentSmoothTime) * 0.18;

        // Throttle the actual currentTime assignment; some browsers
        // throw if it's set every frame during heavy decode.
        if (
          Math.abs(video.currentTime - currentSmoothTime) > 0.005 &&
          now - lastSeekAt > MIN_SEEK_INTERVAL
        ) {
          try {
            video.currentTime = currentSmoothTime;
            lastSeekAt = now;
          } catch {
            /* seek not ready yet */
          }
        }
      }

      smoothCursor[0] += (targetCursor[0] - smoothCursor[0]) * 0.12;
      smoothCursor[1] += (targetCursor[1] - smoothCursor[1]) * 0.12;
      (uniforms.uCursor as { value: THREE.Vector2 }).value.set(smoothCursor[0], smoothCursor[1]);
      (uniforms.uTime as { value: number }).value += dt;

      renderer.render(scene, camera);
    };
    tick();

    return () => {
      if (raf) cancelAnimationFrame(raf);
      window.removeEventListener("pointermove", onPointer);
      document.removeEventListener("visibilitychange", onVis);
      video.removeEventListener("loadedmetadata", onMeta);
      ro.disconnect();
      try { loseCtx?.loseContext(); } catch { /* hmr */ }
      video.pause();
      video.removeAttribute("src");
      video.load();
      renderer.dispose();
      material.dispose();
      geometry.dispose();
      videoTex.dispose();
      maskTex.dispose();
      if (renderer.domElement.parentElement === container) {
        container.removeChild(renderer.domElement);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    videoSrc,
    videoSrcMobile,
    maskSrc,
    videoAspect,
    posterSrc,
    scrubScopeRef,
    cursorLightStrength,
    shimmerStrength,
    brightnessLift,
    tint[0], tint[1], tint[2],
    saturation,
    contrast,
    parallaxX,
    parallaxY,
  ]);

  // The canvas is rendered INSIDE the scroll runway (not fixed). The
  // page makes the runway's inner div sticky so the canvas stays
  // pinned to the viewport while scroll advances the runway.
  return (
    <div
      ref={containerRef}
      className="pointer-events-none absolute inset-0 z-0"
      aria-hidden
    />
  );
}
