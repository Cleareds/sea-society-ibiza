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
  /** Static RGB mask PNG (R depth, G water, B static-fg). Used when
   *  depthVideoSrc is not provided. */
  maskSrc: string;
  /** Optional grayscale depth video that scrubs in lock-step with the
   *  colour video. When provided, the shader derives the water-mask
   *  + static-foreground per frame from the depth values (so a moving
   *  yacht stays masked correctly). The static maskSrc is ignored. */
  depthVideoSrc?: string;
  depthVideoSrcMobile?: string;
  /** Depth value range that counts as "water" when depthVideoSrc is
   *  set. Outside the range is treated as static foreground. Default
   *  [0.30, 0.70] — middle of normalized depth. */
  depthWaterLo?: number;
  depthWaterHi?: number;
  /** Pixels whose depth is above this are treated as yacht (static). */
  yachtDepthThreshold?: number;
  /** Screen-Y position of the horizon — above this Y is static
   *  (no waves, no parallax). Range [0, 1] with 0 = bottom-of-screen,
   *  1 = top-of-screen (texture-flipY space). */
  horizonY?: number;
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

  /** Amplitude of the procedural sea displacement (swell + chop) applied
   *  to the water-mask region. 0 = off. Default 0.0018. */
  waterMotion?: number;
  /** When `vertical`, the shader pans through the video's height as
   *  scroll progresses (top of clip at scroll=0, bottom at scroll=1).
   *  Pairs naturally with portrait source videos. */
  panMode?: "none" | "vertical";

  /** Sea rendering mode.
   *    photo     — sample sea pixels straight from the video (default).
   *    synthetic — replace sea pixels with a shader-rendered Gerstner
   *                surface + sky reflection + Fresnel + sun glint.
   *                Yacht / mountains / sky stay from the video,
   *                gated by the water/static mask. */
  seaMode?: "photo" | "synthetic";
  /** Tweaks for the synthetic sea. */
  seaShallowColor?: [number, number, number]; // surface, lighter (turquoise)
  seaDeepColor?: [number, number, number];    // deep underbelly (dark teal)
  seaFoamColor?: [number, number, number];    // wave crests, light foam
  seaSunDir?: [number, number, number];       // sun direction in shader space
  /** Photo-vs-synth blend in the sea region.
   *    0.0 = photo only
   *    0.4 = subtle wave-light enhancement (recommended)
   *    1.0 = pure synthetic sea
   */
  seaBlend?: number;
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
  uniform float uWaterMotion;  // amplitude of procedural sea swell + chop
  uniform float uPanY;         // [0..1] vertical pan progress; only used in vertical mode
  uniform float uHasDepth;     // 1 = use uDepth video, 0 = use uMask PNG
  uniform sampler2D uDepth;    // depth video texture (grayscale)
  uniform float uDepthLo;      // (legacy) lower bound of water band
  uniform float uDepthHi;      // (legacy) upper bound of water band
  uniform float uYachtDepth;   // pixels above this depth are yacht/static
  uniform float uHorizonY;     // screen Y where horizon sits — above is static

  uniform float uSyntheticSea; // 1 = replace sea pixels with shader output
  uniform vec3  uSeaShallow;   // turquoise top
  uniform vec3  uSeaDeep;      // dark teal underbelly
  uniform vec3  uSeaFoam;      // crest highlight
  uniform vec3  uSunDir;       // sun direction (world-space, normalised)
  uniform sampler2D uOceanNormal; // tileable Phillips-spectrum normal map
  uniform float uSeaBlend;     // [0..1] photo vs synth blend in sea region
                               //   0   = photo only (no effect)
                               //   0.4 = subtle enhancement (recommended)
                               //   1.0 = pure synth (replaces sea)

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

  // ---- Synthetic sea (normal-map driven) ------------------------------
  // We sample a Phillips-spectrum ocean normal map TWICE at different
  // scales and scroll speeds, blend the normals, and use the result
  // for Fresnel + sun-spec lighting. This is the standard hybrid PBR
  // technique — closer to real ocean rendering than pure procedural
  // Gerstner because the texture already contains all the
  // small-frequency detail.

  vec3 sampleOceanNormal(vec2 uvN) {
    vec3 n = texture2D(uOceanNormal, uvN).rgb * 2.0 - 1.0;
    return n;
  }

  vec3 synthSeaColor(vec2 p, vec2 vuvIn, float t, vec2 cursorOffset, vec3 skyColor, vec3 photoColor) {
    // Perspective foreshortening — the visible sea is a plane angled
    // away from the camera. UV unwrap: divide by (1 - y) so the rows
    // near the horizon (vuvIn.y near 0) get sampled at small scale,
    // foreground rows (vuvIn.y near 1) at large scale.
    //
    // Two scrolling layers: a big swell + a smaller chop, each in
    // different directions / speeds. Sample the normal map at both
    // scales and blend.
    float perspY = max(0.05, 1.0 - vuvIn.y);    // tighter at horizon
    vec2 uv1 = vec2(vuvIn.x, vuvIn.y) / perspY * 1.4 + vec2(t * 0.010, t * 0.040);
    vec2 uv2 = vec2(vuvIn.x, vuvIn.y) / perspY * 4.5 + vec2(t * -0.018, t * 0.075);

    vec3 n1 = sampleOceanNormal(uv1);
    vec3 n2 = sampleOceanNormal(uv2);
    // Blend normals — big swell dominates, chop adds bumpiness.
    vec3 n = normalize(n1 + n2 * 0.55);

    // View direction — grazing near horizon, steeper in foreground.
    vec3 view = normalize(vec3(0.0, mix(-0.95, -0.25, vuvIn.y), 1.0));

    float NdotV = max(0.0, dot(n, view));
    float fresnel = mix(0.05, 0.90, pow(1.0 - NdotV, 5.0));

    vec3 sunDir = normalize(uSunDir);
    vec3 halfDir = normalize(sunDir + view);
    float spec = pow(max(0.0, dot(n, halfDir)), 220.0);     // tight glint

    // Base sea colour — vertical gradient, biased by sky tint
    // (warmer light at horizon, cooler depth in foreground).
    float verticalGrade = smoothstep(0.0, 0.85, vuvIn.y);
    vec3 baseCol = mix(uSeaDeep, uSeaShallow, verticalGrade);

    vec3 reflCol = mix(skyColor, vec3(1.0), 0.15);
    vec3 synthCol = mix(baseCol, reflCol, fresnel);
    synthCol += vec3(1.0, 0.95, 0.82) * spec * 0.25;

    // Foam — only where the normal points sharply (steep crests) AND
    // in the foreground.
    float steepness = 1.0 - n.z;          // 0 = flat, ~1 = sharp crest
    float crest = smoothstep(0.45, 0.70, steepness)
                * smoothstep(0.30, 1.00, vuvIn.y);
    synthCol = mix(synthCol, uSeaFoam, crest * 0.30);

    // Cursor light tap.
    float cdist = length(cursorOffset);
    synthCol += exp(-cdist * 3.0) * 0.05;

    // Final mix: keep MOST of the real photo and overlay the
    // shader-driven lighting. This is the "minimised + incorporated"
    // approach — the shader contributes lighting, sky reflection,
    // foam highlights; the photo provides the colour and texture.
    // Tunable via uSeaBlend per-variant.
    return mix(photoColor, synthCol, uSeaBlend);
  }

  void main() {
    // Cover-fit by the LONGER axis of the video so it always fills the
    // viewport. start.y in vertical mode is driven by uPanY so the
    // visible window can slide from TOP of the source (panY=0) to
    // BOTTOM (panY=1) as the user scrolls.
    //
    // VideoTexture in three.js defaults flipY=true, so texture-v=1
    // corresponds to the IMAGE TOP. To show the top of the video,
    // start.y should be (1 - visible.y) — i.e. the highest possible
    // start. To show the bottom, start.y should be 0.
    float ar = uAspectVideo / uAspectViewport;
    vec2 visible = (ar < 1.0) ? vec2(1.0, ar) : vec2(1.0 / ar, 1.0);
    vec2 start = vec2(0.0);
    float maxStartY = max(0.0, 1.0 - visible.y);
    if (ar < 1.0) {
      // Vertical-overflow case (portrait source on landscape viewport,
      // OR landscape source on landscape viewport with a taller image
      // than viewport). Pan top → bottom of texture as panY goes 0 → 1.
      start.y = mix(maxStartY, 0.0, uPanY);
    } else {
      start.x = (1.0 - visible.x) * 0.5;
    }
    vec2 uv = start + vuv * visible;

    float waterMask;
    float staticMask;
    if (uHasDepth > 0.5) {
      // Per-frame depth video. Static foreground = yacht (very high
      // depth) UNION horizon strip. Everything else is sea and gets
      // wave / shimmer / parallax treatment.
      //
      // CONFIDENCE BUFFER: the threshold transitions for yacht and
      // horizon are kept WIDE so the boundary zone is ambiguous,
      // and waterMask in those ambiguous pixels stays low. Effects
      // only fire where the shader is genuinely confident the pixel
      // is sea.
      float d = texture2D(uDepth, uv).r;
      // Wider yacht transition: 0.08 either side (was 0.04). Any
      // pixel within 0.08 of the yacht threshold is treated as
      // partially static.
      float yachtStatic = smoothstep(uYachtDepth - 0.10, uYachtDepth + 0.02, d);
      // Wider horizon transition: 0.10 either side (was 0.05).
      float horizonStatic = smoothstep(uHorizonY - 0.10, uHorizonY + 0.02, vuv.y);
      staticMask = max(yachtStatic, horizonStatic);
      waterMask = 1.0 - staticMask;
    } else {
      vec3 mask = texture2D(uMask, uv).rgb;
      waterMask = mask.g;
      staticMask = mask.b;
    }
    // Confidence gate — only the cleanest sea pixels get the full
    // effects. The 0.60..0.95 band on the depth-derived waterMask
    // means: stay 0 in any ambiguous edge region, ramp to 1 only
    // where mask is unambiguously sea.
    float water = smoothstep(0.60, 0.95, waterMask) * (1.0 - staticMask);

    vec2 toCursor = vuv - uCursor;
    float cursorDist = length(toCursor);

    // ------- Procedural sea motion -------
    // Same swell + chop + caustic pattern as the static Es Vedra hero
    // but at lower amplitude — keeps the sea "alive" when the video
    // is paused on scroll. The whole displacement is gated by water
    // (the smoothstep result), so yacht and mountains stay rock-still.
    float t = uTime;
    float swellPhase = uv.y * 5.2 - t * 0.55;
    float swell = sin(swellPhase) * 0.7 +
                  sin(swellPhase * 1.6 + uv.x * 1.1) * 0.3;
    float cross = sin(uv.x * 3.2 + t * 0.32) * 0.5;
    float chopX = sin(uv.x * 17.0 + t * 1.10) * 0.55 +
                  sin(uv.y * 21.0 - t * 0.85) * 0.45;
    float chopY = cos(uv.y * 17.0 + t * 0.95) * 0.55 +
                  cos(uv.x * 21.0 - t * 0.68) * 0.45;

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

    vec2 seaDisplacement = (
      vec2(swell * 0.35 + cross * 0.20, swell * 0.85) * 0.0013 +
      vec2(chopX, chopY) * 0.0008
    ) * water * (uWaterMotion / 0.0018);   // normalise so default
                                           // uWaterMotion=0.0018 gives
                                           // the same intensity as the
                                           // static hero.

    vec2 sampleUV = uv + parallax + seaDisplacement;
    vec3 photoColor = texture2D(uVideo, sampleUV).rgb * uBrightness;
    photoColor = grade(photoColor);

    float shimmer = caustic * uShimmer * water;
    float cursorLight = exp(-cursorDist * 3.2) * uCursorLight;
    vec3 finalColor = photoColor + shimmer + cursorLight;

    // ---- Synthetic sea overlay --------------------------------------
    // Where the water mask is high, blend in a fully synthetic
    // Gerstner-shaded sea (yacht / mountains / sky remain photo).
    if (uSyntheticSea > 0.5 && water > 0.01) {
      // Sky reference colour — sample the top band of the video so the
      // synthetic sea's Fresnel reflection follows the source sky
      // tone for free (no skybox needed).
      vec3 skySample = texture2D(uVideo, vec2(0.5, 0.08)).rgb * uBrightness;
      // Cursor offset in world-ish space for the synth sea.
      vec2 cursorOffset = vuv - uCursor;
      // Position used for wave-domain sampling. Stretching X by aspect
      // keeps the waves square regardless of viewport ratio.
      vec2 seaP = vec2(vuv.x * uAspectViewport, vuv.y) + vec2(0.0, uTime * 0.005);
      vec3 synthCol = synthSeaColor(seaP, vuv, uTime, cursorOffset, skySample, photoColor);
      // Mask-driven blend — the synth function already does the
      // photo/synth mix internally via uSeaBlend, so here we just
      // gate by the water mask so yacht edges stay pure photo.
      finalColor = mix(finalColor, synthCol, water);
    }

    gl_FragColor = vec4(finalColor, 1.0);
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
  waterMotion = 0.0018,
  panMode = "none",
  depthVideoSrc,
  depthVideoSrcMobile,
  depthWaterLo = 0.30,
  depthWaterHi = 0.70,
  yachtDepthThreshold = 0.85,
  horizonY = 0.82,
  seaMode = "photo",
  seaShallowColor = [0.18, 0.55, 0.65],
  seaDeepColor = [0.02, 0.10, 0.18],
  seaFoamColor = [0.95, 0.98, 1.00],
  seaSunDir = [0.45, 0.30, 0.85],
  seaBlend = 0.40,
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

    // Tileable ocean normal map (Phillips-spectrum, pre-baked).
    const oceanNormalTex = loader.load("/sea-society/video/ocean-normal.png");
    oceanNormalTex.minFilter = THREE.LinearMipmapLinearFilter;
    oceanNormalTex.magFilter = THREE.LinearFilter;
    oceanNormalTex.wrapS = THREE.RepeatWrapping;
    oceanNormalTex.wrapT = THREE.RepeatWrapping;
    oceanNormalTex.colorSpace = THREE.NoColorSpace;
    oceanNormalTex.generateMipmaps = true;

    // Optional per-frame depth video — runs in lock-step with the
    // colour video. When provided, the shader derives the water +
    // static masks from this each frame instead of the static PNG,
    // so a moving yacht stays masked correctly.
    let depthVideo: HTMLVideoElement | null = null;
    let depthTex: THREE.VideoTexture | null = null;
    if (depthVideoSrc) {
      depthVideo = document.createElement("video");
      depthVideo.crossOrigin = "anonymous";
      depthVideo.muted = true;
      depthVideo.loop = false;
      depthVideo.playsInline = true;
      depthVideo.autoplay = false;
      depthVideo.setAttribute("webkit-playsinline", "true");
      depthVideo.preload = "auto";
      depthVideo.src = isMobile && depthVideoSrcMobile ? depthVideoSrcMobile : depthVideoSrc;
      depthVideo.load();
      depthVideo.addEventListener("loadedmetadata", () => {
        depthVideo!.play().then(() => depthVideo!.pause()).catch(() => { /* noop */ });
      });
      depthTex = new THREE.VideoTexture(depthVideo);
      depthTex.minFilter = THREE.LinearFilter;
      depthTex.magFilter = THREE.LinearFilter;
      depthTex.wrapS = THREE.ClampToEdgeWrapping;
      depthTex.wrapT = THREE.ClampToEdgeWrapping;
      depthTex.colorSpace = THREE.NoColorSpace;
    }

    const uniforms: Record<string, { value: unknown }> = {
      uVideo: { value: videoTex },
      uMask: { value: maskTex },
      uDepth: { value: depthTex ?? maskTex },   // bind something, shader gates
      uHasDepth: { value: depthTex ? 1 : 0 },
      uDepthLo: { value: depthWaterLo },
      uDepthHi: { value: depthWaterHi },
      uYachtDepth: { value: yachtDepthThreshold },
      uHorizonY: { value: horizonY },
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
      uWaterMotion: { value: waterMotion },
      uPanY: { value: 0 },
      uSyntheticSea: { value: seaMode === "synthetic" ? 1 : 0 },
      uSeaShallow: { value: new THREE.Vector3(seaShallowColor[0], seaShallowColor[1], seaShallowColor[2]) },
      uSeaDeep: { value: new THREE.Vector3(seaDeepColor[0], seaDeepColor[1], seaDeepColor[2]) },
      uSeaFoam: { value: new THREE.Vector3(seaFoamColor[0], seaFoamColor[1], seaFoamColor[2]) },
      uSunDir: { value: new THREE.Vector3(seaSunDir[0], seaSunDir[1], seaSunDir[2]) },
      uOceanNormal: { value: oceanNormalTex },
      uSeaBlend: { value: seaBlend },
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

      // Update target time + pan from scroll progress.
      const p = computeProgress();
      if (panMode === "vertical") {
        (uniforms.uPanY as { value: number }).value = p;
      }
      if (duration > 0) {
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
            if (depthVideo) depthVideo.currentTime = currentSmoothTime;
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
      if (depthVideo) {
        depthVideo.pause();
        depthVideo.removeAttribute("src");
        depthVideo.load();
      }
      renderer.dispose();
      material.dispose();
      geometry.dispose();
      videoTex.dispose();
      maskTex.dispose();
      oceanNormalTex.dispose();
      depthTex?.dispose();
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
    waterMotion,
    panMode,
    depthVideoSrc,
    depthVideoSrcMobile,
    depthWaterLo,
    depthWaterHi,
    yachtDepthThreshold,
    horizonY,
    seaMode,
    seaShallowColor[0], seaShallowColor[1], seaShallowColor[2],
    seaDeepColor[0], seaDeepColor[1], seaDeepColor[2],
    seaFoamColor[0], seaFoamColor[1], seaFoamColor[2],
    seaSunDir[0], seaSunDir[1], seaSunDir[2],
    seaBlend,
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
