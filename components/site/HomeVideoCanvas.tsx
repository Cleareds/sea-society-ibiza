"use client";

import * as React from "react";
import * as THREE from "three";

/**
 * WebGL canvas backed by a looping VIDEO texture + paired RGB mask.
 *
 * Same shader vocabulary as HomeImmersiveCanvas (cursor light, water
 * shimmer, parallax weighted by depth, scroll-driven zoom) — only the
 * source pixel is the current frame of an autoplaying muted video
 * rather than a static photo.
 *
 * The video is decoded entirely client-side (hidden <video> element);
 * Three.js samples each frame via THREE.VideoTexture which updates
 * automatically as the video plays. Mobile autoplay works only with
 * `muted` + `playsInline` — both forced on.
 *
 * Multiple "looks" (cool/warm grade, ripple intensity, cursor falloff,
 * scroll behaviour) are driven by the props below so we can ship many
 * POC variants without forking the component.
 */
export interface HomeVideoCanvasProps {
  /** Source MP4 (re-encoded for web). */
  videoSrc: string;
  /** Smaller mobile variant — used when innerWidth < 900. */
  videoSrcMobile?: string;
  /** RGB-packed mask (R depth, G water, B static-fg). */
  maskSrc: string;
  /** Width / height of the source video, for cover-fit math. */
  videoAspect: number;
  /** Poster image shown until first frame is decoded. */
  posterSrc?: string;

  /** Strength multipliers — tune per route to make each variant feel
   *  distinct. All in [0, 1] except brightness which is a linear gain. */
  cursorLightStrength?: number;     // default 0.18
  shimmerStrength?: number;         // default 0.10
  brightnessLift?: number;          // default 1.18 (lower than the static
                                    //              hero — videos already
                                    //              come encoded sRGB)

  /** Colour grade — RGB tint multiplier + saturation. */
  tint?: [number, number, number];  // default [1,1,1]
  saturation?: number;              // 1 = neutral, 1.2 = punchier sea
  contrast?: number;                // 1 = neutral, 1.1 = punchier

  /** Cursor parallax magnitudes. */
  parallaxX?: number;               // default 0.010
  parallaxY?: number;               // default 0.005

  /** Scroll behaviour. */
  zoomEnd?: number;                 // target zoom at the end of the phase
                                    // (0.35 = strong, 0.85 = subtle).
                                    // default 0.55
  zoomCenter?: [number, number];    // texture-v space, default [0.5, 0.5]
  /** Where (in vh units) the zoom STARTS / ENDS. */
  zoomStartVh?: number;             // default 0.05
  zoomEndVh?: number;               // default 0.55

  /** Cursor-driven UV ripple amplitude (sea only). 0 = off. */
  rippleStrength?: number;          // default 0
  /** Luxe vignette mix. 0 = off, 1 = full. */
  vignette?: number;                // default 0

  scopeRef?: React.RefObject<HTMLElement | null>;
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
  uniform float uPan;
  uniform float uZoom;
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
  uniform float uZoomEnd;
  uniform vec2  uZoomCenter;
  uniform float uRippleStrength;   // cursor-driven UV ripple in sea
  uniform float uVignette;         // 0 = none, 1 = strong dark vignette

  varying vec2 vuv;

  float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
  float vnoise(vec2 p) {
    vec2 i = floor(p), f = fract(p);
    float a = hash(i), b = hash(i + vec2(1.,0.));
    float c = hash(i + vec2(0.,1.)), d = hash(i + vec2(1.,1.));
    vec2 u = f * f * (3.0 - 2.0 * f);
    return mix(a, b, u.x) + (c - a) * u.y * (1.0 - u.x) + (d - b) * u.x * u.y;
  }

  // Saturation/contrast helpers
  vec3 grade(vec3 c) {
    // contrast around 0.5
    c = (c - 0.5) * uContrast + 0.5;
    // saturation
    float l = dot(c, vec3(0.2126, 0.7152, 0.0722));
    c = mix(vec3(l), c, uSaturation);
    // tint
    c *= uTint;
    return c;
  }

  void main() {
    // Cover-fit the source into the viewport.
    float ar = uAspectVideo / uAspectViewport;
    vec2 visible = (ar < 1.0) ? vec2(1.0, ar) : vec2(1.0 / ar, 1.0);
    vec2 start = vec2(0.0);
    if (ar < 1.0) {
      float maxPan = 1.0 - visible.y;
      start.y = mix(maxPan * 0.5, 0.0, uPan);  // pan range tighter than
                                               // static hero because video
                                               // already shows the subject
    } else {
      start.x = (1.0 - visible.x) * 0.5;
    }
    vec2 base = start + vuv * visible;

    // Scroll-driven zoom into the centre (configurable).
    float zoom = mix(1.0, uZoomEnd, uZoom);
    vec2 uvZoomed = (base - uZoomCenter) * zoom + uZoomCenter;

    // Mask sampled after zoom so the yacht stays the yacht.
    vec3 mask = texture2D(uMask, uvZoomed).rgb;
    float waterMask = mask.g;
    float staticMask = mask.b;
    float water = smoothstep(0.30, 0.55, waterMask) * (1.0 - staticMask);

    // Cursor light + small water displacement.
    vec2 toCursor = vuv - uCursor;
    float cursorDist = length(toCursor);

    float t = uTime;
    // Mild caustic — for video we keep this subtler than the static
    // hero because the video already has real motion in it; we just
    // add a hint of sun glint.
    float caustic =
        vnoise(uvZoomed * 5.0 + vec2(t * 0.20, -t * 0.13)) +
        vnoise(uvZoomed * 9.0 - vec2(t * 0.27, t * 0.09)) * 0.5;
    caustic = (caustic - 0.75) * 0.55;

    // Parallax — only outside the static foreground.
    vec2 cursorOffset = uCursor - vec2(0.5);
    float horizonWeight = 1.0 - vuv.y;
    vec2 parallax = vec2(
      cursorOffset.x * horizonWeight * uParallaxX,
      cursorOffset.y * uParallaxY
    ) * (1.0 - staticMask);

    // Cursor ripple — small radial UV pull around the cursor, gated by
    // the water mask so the yacht itself doesn't distort. Subtle by
    // default; variants can boost it for a more interactive feel.
    vec2 toCursorUv = vuv - uCursor;
    float ripplePhase = sin(length(toCursorUv) * 22.0 - t * 2.5);
    vec2 rippleDir = normalize(toCursorUv + vec2(0.0001));
    float rippleFalloff = exp(-length(toCursorUv) * 8.0);
    vec2 rippleOffset = rippleDir * ripplePhase * rippleFalloff * uRippleStrength * water;

    vec2 sampleUV = uvZoomed + parallax + rippleOffset;
    vec3 color = texture2D(uVideo, sampleUV).rgb * uBrightness;
    color = grade(color);

    float shimmer = caustic * uShimmer * water;
    float cursorLight = exp(-cursorDist * 3.2) * uCursorLight;
    color += shimmer + cursorLight;

    // Optional luxe vignette — softer corners and darker bottom edge.
    // Helps the page copy land cleanly over busy footage.
    if (uVignette > 0.001) {
      float dx = vuv.x - 0.5;
      float dy = vuv.y - 0.5;
      float r = sqrt(dx * dx + dy * dy);
      float vig = smoothstep(0.30, 0.85, r);
      // Extra darken on the lower portion so the copy column reads.
      float bottomDarken = smoothstep(0.45, 1.0, vuv.y);
      float total = max(vig * 0.75, bottomDarken * 0.55);
      color *= mix(1.0, 1.0 - total, uVignette);
    }

    gl_FragColor = vec4(color, 1.0);
  }
`;

export function HomeVideoCanvas({
  videoSrc,
  videoSrcMobile,
  maskSrc,
  videoAspect,
  posterSrc,
  cursorLightStrength = 0.18,
  shimmerStrength = 0.10,
  brightnessLift = 1.18,
  tint = [1, 1, 1],
  saturation = 1.0,
  contrast = 1.0,
  parallaxX = 0.010,
  parallaxY = 0.005,
  zoomEnd = 0.55,
  zoomCenter = [0.5, 0.5],
  zoomStartVh = 0.05,
  zoomEndVh = 0.55,
  rippleStrength = 0,
  vignette = 0,
  scopeRef,
}: HomeVideoCanvasProps) {
  const containerRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // --- Video element --------------------------------------------------
    const video = document.createElement("video");
    video.crossOrigin = "anonymous";
    video.muted = true;
    video.loop = true;
    video.playsInline = true;
    video.autoplay = true;
    video.setAttribute("webkit-playsinline", "true");
    video.preload = "auto";
    if (posterSrc) video.poster = posterSrc;

    const isMobile = typeof window !== "undefined" && window.innerWidth < 900;
    video.src = isMobile && videoSrcMobile ? videoSrcMobile : videoSrc;
    video.load();
    const tryPlay = () => video.play().catch(() => { /* will retry on user gesture */ });
    tryPlay();
    // Some browsers (Safari) need a small kick before they autoplay
    // even with muted; retry on first pointer.
    const onceUserKick = () => { tryPlay(); window.removeEventListener("pointerdown", onceUserKick); };
    window.addEventListener("pointerdown", onceUserKick, { once: true });

    // --- Renderer + textures -------------------------------------------
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
      uPan: { value: 0 },
      uZoom: { value: 0 },
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
      uZoomEnd: { value: zoomEnd },
      uZoomCenter: { value: new THREE.Vector2(zoomCenter[0], zoomCenter[1]) },
      uRippleStrength: { value: rippleStrength },
      uVignette: { value: vignette },
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

    // --- Pointer + scroll plumbing -------------------------------------
    const targetCursor: [number, number] = [0.5, 0.5];
    const smoothCursor: [number, number] = [0.5, 0.5];
    const smoothPan: [number] = [0];
    const smoothZoom: [number] = [0];

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
    const onVis = () => {
      visible = !document.hidden;
      if (visible) tryPlay();
      else video.pause();
    };
    document.addEventListener("visibilitychange", onVis);

    const loseCtx = renderer.getContext().getExtension("WEBGL_lose_context");

    let raf = 0;
    let last = performance.now();
    const tick = () => {
      raf = requestAnimationFrame(tick);
      if (!visible) {
        last = performance.now();
        return;
      }
      const now = performance.now();
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;

      const vh = window.innerHeight;
      const sy = window.scrollY;
      const start = vh * zoomStartVh;
      const end = vh * zoomEndVh;
      const targetPan = clamp01(sy / (vh * 0.5));
      const targetZoom = clamp01((sy - start) / Math.max(1, end - start));

      let opacity = 1;
      const scopeEl = scopeRef?.current;
      if (scopeEl) {
        const rect = scopeEl.getBoundingClientRect();
        const fadeStart = vh * 0.5;
        const fadeEnd = -vh * 0.1;
        if (rect.bottom < fadeStart) {
          opacity = clamp01((rect.bottom - fadeEnd) / (fadeStart - fadeEnd));
        }
      }
      container.style.opacity = String(opacity);

      smoothCursor[0] += (targetCursor[0] - smoothCursor[0]) * 0.12;
      smoothCursor[1] += (targetCursor[1] - smoothCursor[1]) * 0.12;
      smoothPan[0] += (targetPan - smoothPan[0]) * 0.18;
      smoothZoom[0] += (targetZoom - smoothZoom[0]) * 0.18;

      (uniforms.uCursor as { value: THREE.Vector2 }).value.set(smoothCursor[0], smoothCursor[1]);
      (uniforms.uTime as { value: number }).value += dt;
      (uniforms.uPan as { value: number }).value = smoothPan[0];
      (uniforms.uZoom as { value: number }).value = smoothZoom[0];

      renderer.render(scene, camera);
    };
    tick();

    return () => {
      if (raf) cancelAnimationFrame(raf);
      window.removeEventListener("pointermove", onPointer);
      document.removeEventListener("visibilitychange", onVis);
      window.removeEventListener("pointerdown", onceUserKick);
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
    // We intentionally use a stringified prop signature to avoid re-running
    // the effect on every render — values change rarely (route mount).
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    videoSrc,
    videoSrcMobile,
    maskSrc,
    videoAspect,
    posterSrc,
    cursorLightStrength,
    shimmerStrength,
    brightnessLift,
    tint[0], tint[1], tint[2],
    saturation,
    contrast,
    parallaxX,
    parallaxY,
    zoomEnd,
    zoomCenter[0], zoomCenter[1],
    zoomStartVh,
    zoomEndVh,
    rippleStrength,
    vignette,
    scopeRef,
  ]);

  return (
    <div
      ref={containerRef}
      className="pointer-events-none fixed inset-0 z-0"
      aria-hidden
    />
  );
}

function clamp01(v: number) {
  return Math.max(0, Math.min(1, v));
}
