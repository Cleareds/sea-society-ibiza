"use client";

import * as React from "react";
import * as THREE from "three";

/**
 * Homepage WebGL canvas — Es Vedra hero with depth-aware water shader.
 *
 * Mounted as a position-FIXED backdrop behind the entire page (z-index
 * -1). Reads window.scrollY directly each frame and runs three phases:
 *
 *   scrollY  in [0,           zoomStartPx ]  → full Es Vedra frame
 *           in [zoomStartPx,  zoomEndPx   ]  → smooth zoom into the sea
 *           >    zoomEndPx                   → locked at sea-only crop
 *
 * Defaults to 1×viewport and 2×viewport, so by the time the user has
 * scrolled 2 screens the backdrop is sea-only and stays that way until
 * the footer.
 *
 * Effects are gated so the lady silhouette + foreground rocks stay
 * absolutely crisp + static — only the sea moves.
 */
export interface HomeImmersiveCanvasProps {
  /** Color photo. */
  imageSrc?: string;
  /** RGB mask (R depth · G water · B static-foreground). */
  maskSrc?: string;
  /** Strength of cursor-driven refraction in the sea. */
  cursorRippleStrength?: number;
  /** Scroll Y where the zoom STARTS (px). Default = 0.2 × viewport. */
  zoomStartPx?: number;
  /** Scroll Y where the zoom ENDS (px). Default = 1.0 × viewport. The
   *  zoom intentionally completes around the time the user reaches the
   *  yacht cards — the canvas should already be in its locked sea
   *  state by then. */
  zoomEndPx?: number;
  /** When the bottom of this element is above the bottom of the
   *  viewport, the canvas fades out (so the footer / next section is
   *  visible underneath rather than the sea image covering it). */
  scopeRef?: React.RefObject<HTMLElement | null>;
}

const DEFAULT_IMAGE = "/sea-society/site/home-hero.webp";
const DEFAULT_MASK = "/sea-society/site/home-hero-depth.png";

const VERTEX = /* glsl */ `
  varying vec2 vuv;
  void main() {
    vuv = uv;
    gl_Position = vec4(position, 1.0);
  }
`;

/**
 * Fragment shader. Renders the color photo with depth-aware water motion.
 *
 *  - Sea region (mask.g): time-varying ripple, soft caustic shimmer,
 *    cursor refraction.
 *  - Static foreground (mask.b): no animation, no parallax. Crisp.
 *  - Everything else (sky, rock): gentle background parallax only.
 *
 * The viewport aspect is corrected for cover-fit cropping of a portrait
 * source image inside a landscape (or any-shape) viewport.
 */
const FRAGMENT = /* glsl */ `
  precision highp float;

  uniform sampler2D uColor;
  uniform sampler2D uMask;
  uniform vec2  uCursor;
  uniform float uTime;
  uniform float uPan;          // 0 = look top of image, 1 = look bottom
  uniform float uZoom;         // 0 = full frame, 1 = sea-only crop
  uniform float uRippleStrength;
  uniform float uAspectViewport;   // viewport w / h
  uniform float uAspectImage;      // image natural w / h

  varying vec2 vuv;

  // -------- helpers ----------------------------------------------------

  // Hash + value-noise — cheap caustic shimmer.
  float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
  float vnoise(vec2 p) {
    vec2 i = floor(p), f = fract(p);
    float a = hash(i),
          b = hash(i + vec2(1.0, 0.0)),
          c = hash(i + vec2(0.0, 1.0)),
          d = hash(i + vec2(1.0, 1.0));
    vec2 u = f * f * (3.0 - 2.0 * f);
    return mix(a, b, u.x) + (c - a) * u.y * (1.0 - u.x) + (d - b) * u.x * u.y;
  }

  // Smoothstep helper
  float ss(float a, float b, float x) { return smoothstep(a, b, x); }

  void main() {
    // 1. Map the viewport to the FULL image, sized so the image fills
    //    the dominant axis and overflows the other. We then pan the
    //    visible window across the overflow axis as the user scrolls.
    //
    //    Two cases:
    //      - vpAspect > imgAspect  → image is "narrower" than the
    //        viewport. Scale it to fill width; image overflows
    //        VERTICALLY (taller than viewport). Pan = vertical.
    //      - vpAspect < imgAspect  → image is "wider". Scale to fill
    //        height; image overflows HORIZONTALLY. No pan needed —
    //        we just centre horizontally.
    //
    //    Either way, the user eventually sees the WHOLE image (not a
    //    cover-fit-cropped slice).
    float ar = uAspectImage / uAspectViewport;
    vec2 visibleFraction = (ar < 1.0)
        ? vec2(1.0, ar)      // image overflows vertically (desktop case)
        : vec2(1.0 / ar, 1.0); // image overflows horizontally (mobile case)
    vec2 startPos = vec2(0.0);
    if (ar < 1.0) {
      // Vertical-overflow case. Three.js textures default to flipY=true,
      // so texture-v=1 corresponds to the IMAGE TOP and texture-v=0 to
      // the IMAGE BOTTOM. To show the image TOP (sky+mountain) at the
      // start, startPos.y must be set so the visible window samples the
      // upper part of texture v — which is the upper part of the image.
      //   uPan = 0 → startPos.y = 1 - visibleFraction.y  → image TOP
      //   uPan = 1 → startPos.y = 0                       → image BOTTOM
      float maxPanY = 1.0 - visibleFraction.y;
      startPos.y = mix(maxPanY * 0.95, 0.0, uPan);
    } else {
      startPos.x = (1.0 - visibleFraction.x) * 0.5;
    }
    vec2 base = startPos + vuv * visibleFraction;

    // 2. Zoom phase — narrows the visible window onto the LEFT-MIDDLE
    //    of the image: open sea to the left of the rock, below the
    //    horizon and above the lady. zoomCenter in TEXTURE-V space
    //    (with flipY, texture-v = 1 - image-y).
    //      image x ≈ 0.25 (left third — open sea)
    //      image y ≈ 0.55 (mid-vertical — below rock, above lady)
    //      → zoomCenter = vec2(0.25, 1 - 0.55) = vec2(0.25, 0.45)
    float zoom = mix(1.0, 0.35, uZoom);
    vec2 zoomCenter = vec2(0.25, 0.45);
    vec2 uvZoomed = (base - zoomCenter) * zoom + zoomCenter;

    // 3. Sample the mask AFTER zoom so subject pixels stay subject pixels
    //    regardless of crop.
    vec3 mask = texture2D(uMask, uvZoomed).rgb;
    float waterMask  = mask.g;
    float staticMask = mask.b;

    // Hard-threshold the water gate so we never sit in a soft mid-grey
    // "halfway" zone that looks like a blind spot mid-sea.
    float water = smoothstep(0.30, 0.55, waterMask) * (1.0 - staticMask);

    // 4. Cursor — used ONLY as a light source. No UV displacement
    //    (that distorted the sea too much). Lives everywhere on the
    //    canvas, not just over water, so static areas (foreground
    //    rocks, lady silhouette edge) also brighten softly when the
    //    cursor passes over them.
    vec2 toCursor = vuv - uCursor;
    float cursorDist = length(toCursor);

    // 5. Idle sea motion — runs purely on uTime so the surface is alive
    //    even when the cursor is still. Three layered components:
    //
    //    SWELL — rolling waves traveling FROM the horizon TOWARD the
    //      camera. Phase depends on uvZoomed.y so the wave fronts
    //      sweep visibly down the frame (period ~9s). This is the
    //      thing that sells "sea moving on its own".
    //    CROSS-SWELL — a slower lateral component that breaks up the
    //      vertical regularity.
    //    CHOP — fine surface ripple, faster, cross-mixed on both axes.
    float t = uTime;
    float swellPhase = uvZoomed.y * 5.2 - t * 0.55;
    float swell = sin(swellPhase) * 0.7 +
                  sin(swellPhase * 1.6 + uvZoomed.x * 1.1) * 0.3;
    float cross = sin(uvZoomed.x * 3.2 + t * 0.32) * 0.5;
    float chopX = sin(uvZoomed.x * 17.0 + t * 1.10) * 0.55 +
                  sin(uvZoomed.y * 21.0 - t * 0.85) * 0.45;
    float chopY = cos(uvZoomed.y * 17.0 + t * 0.95) * 0.55 +
                  cos(uvZoomed.x * 21.0 - t * 0.68) * 0.45;

    // Caustic shimmer — sun glint on water. Stronger temporal scroll
    // + more amplitude so the sparkle visibly drifts across the
    // surface. This + the rolling swell are the two cues that
    // convince the eye the sea is moving on its own.
    float caustic =
        vnoise(uvZoomed * 5.0 + vec2(t * 0.22, -t * 0.15)) +
        vnoise(uvZoomed * 9.0 - vec2(t * 0.30, t * 0.10)) * 0.5;
    caustic = (caustic - 0.75) * 0.55;

    // 6. Displacement — time-driven wave (gated by water) + a gentle
    //    cursor-driven parallax. Cursor's horizontal motion swings the
    //    HORIZON (top of viewport) noticeably; everything else gets a
    //    smaller, mostly-vertical drift. Static foreground (lady,
    //    foreground rocks) doesn't move with the cursor.
    vec2 cursorOffset = uCursor - vec2(0.5);             // -0.5..0.5
    float horizonWeight = 1.0 - vuv.y;                   // 1 at viewport top, 0 at bottom
    // Parallax halved again. With the wider static-fg feather, the
    // motion tapers smoothly into the locked subjects instead of
    // creating a hard edge mismatch.
    vec2 parallax = vec2(
      cursorOffset.x * horizonWeight * 0.009,
      cursorOffset.y * 0.004
    ) * (1.0 - staticMask);

    // Sea displacement — swell (mostly vertical, rolling toward camera)
    // + cross-swell (lateral) + chop (omnidirectional). Total max
    // ≈ 0.0020 of UV — visibly alive but still small enough that the
    // composition isn't disturbed.
    vec2 displacement = (
      vec2(swell * 0.35 + cross * 0.20, swell * 0.85) * 0.0013 +
      vec2(chopX, chopY) * 0.0008
    ) * water;
    vec2 sampleUV = uvZoomed + displacement + parallax;

    // 7. Sample the color image. Slight brightness boost (×1.10) so
    //    the WebGL render reads at the same exposure as the static
    //    <Image> on the live homepage — three.js's color path was
    //    landing a half-stop dark.
    vec3 color = texture2D(uColor, sampleUV).rgb * 1.10;

    // 8. Caustic shimmer (water only) + cursor LIGHT (global, soft).
    //    Shimmer amplitude bumped 0.06 → 0.10 so the sun-glint sparkle
    //    is visibly drifting across the sea even when the user isn't
    //    moving the cursor — sells the premium "real water" feel.
    float shimmer = caustic * 0.10 * water;
    float cursorLight = exp(-cursorDist * 3.2) * 0.18;
    color += shimmer + cursorLight;

    // 9. (No vignette — the user wants no dark overlay on the hero.)

    gl_FragColor = vec4(color, 1.0);
  }
`;

export function HomeImmersiveCanvas({
  imageSrc = DEFAULT_IMAGE,
  maskSrc = DEFAULT_MASK,
  cursorRippleStrength = 0.006,
  zoomStartPx,
  zoomEndPx,
  scopeRef,
}: HomeImmersiveCanvasProps) {
  const containerRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Renderer ----------------------------------------------------------
    const renderer = new THREE.WebGLRenderer({
      antialias: false,
      alpha: false,
      powerPreference: "high-performance",
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
    renderer.setClearColor(0x06141a, 1);
    // Explicit sRGB output so the WebGL render matches the static
    // <Image> render on the live homepage (Next.js Image uses the
    // browser's native sRGB display path; three.js needs this set).
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

    // Textures ----------------------------------------------------------
    const loader = new THREE.TextureLoader();
    const colorTex = loader.load(imageSrc);
    const maskTex = loader.load(maskSrc);
    [colorTex, maskTex].forEach((t) => {
      t.minFilter = THREE.LinearFilter;
      t.magFilter = THREE.LinearFilter;
      t.wrapS = THREE.ClampToEdgeWrapping;
      t.wrapT = THREE.ClampToEdgeWrapping;
      t.generateMipmaps = false;
    });
    // sRGB color space so the WebGL render matches the brightness of
    // the static <Image> render on the homepage. Mask is data (linear).
    colorTex.colorSpace = THREE.SRGBColorSpace;
    maskTex.colorSpace = THREE.NoColorSpace;

    // Uniforms ----------------------------------------------------------
    const uniforms: Record<string, { value: unknown }> = {
      uColor: { value: colorTex },
      uMask: { value: maskTex },
      uCursor: { value: new THREE.Vector2(0.5, 0.45) },
      uTime: { value: 0 },
      uPan: { value: 0 },
      uZoom: { value: 0 },
      uRippleStrength: { value: cursorRippleStrength },
      uAspectViewport: { value: 1 },
      uAspectImage: { value: 1541 / 1660 },
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

    // Cursor + scroll plumbing -----------------------------------------
    const targetCursor: [number, number] = [0.5, 0.45];
    const smoothCursor: [number, number] = [0.5, 0.45];
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

    // Pause the RAF when the document is hidden (tab change). The
    // backdrop covers the whole viewport so we can't rely on
    // IntersectionObserver to find an "offscreen" state.
    let visible = !document.hidden;
    const onVis = () => { visible = !document.hidden; };
    document.addEventListener("visibilitychange", onVis);

    // Forced context loss on cleanup so HMR doesn't leak contexts.
    const loseCtx = renderer
      .getContext()
      .getExtension("WEBGL_lose_context");

    // Animation loop ---------------------------------------------------
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

      // Compute pan + zoom from the page scroll position. The image
      // intentionally moves FASTER than the surrounding content — by
      // the time the user is halfway through the first viewport the
      // zoom is already mostly complete, so the cards arrive on a
      // sea-locked frame.
      const vh = window.innerHeight;
      const start = zoomStartPx ?? vh * 0.05;   // zoom kicks in almost immediately
      const end = zoomEndPx ?? vh * 0.55;       // and completes by 55% of viewport 1
      const sy = window.scrollY;
      // Pan + zoom run in parallel so the camera both slides down and
      // narrows in. Pan still completes by ~mid-viewport so the
      // framing reaches its target before the zoom finishes.
      const targetPan = clamp01(sy / (vh * 0.50));
      const targetZoom = clamp01((sy - start) / Math.max(1, end - start));

      // Opacity fade — if the page scope has been provided, fade the
      // canvas out as the scope's bottom edge approaches the viewport
      // top. Keeps the footer / journey section visible without the sea
      // bleeding into them.
      let targetOpacity = 1;
      const scopeEl = scopeRef?.current;
      if (scopeEl) {
        const rect = scopeEl.getBoundingClientRect();
        // bottom is distance from viewport top to scope's bottom edge
        const fadeStart = vh * 0.5;
        const fadeEnd = -vh * 0.1;
        if (rect.bottom < fadeStart) {
          targetOpacity = clamp01((rect.bottom - fadeEnd) / (fadeStart - fadeEnd));
        }
      }
      container.style.opacity = String(targetOpacity);

      // Damp inputs so they don't twitch on jittery scroll/touch events
      smoothCursor[0] += (targetCursor[0] - smoothCursor[0]) * 0.12;
      smoothCursor[1] += (targetCursor[1] - smoothCursor[1]) * 0.12;
      smoothPan[0] += (targetPan - smoothPan[0]) * 0.18;
      smoothZoom[0] += (targetZoom - smoothZoom[0]) * 0.18;

      (uniforms.uCursor as { value: THREE.Vector2 }).value.set(
        smoothCursor[0],
        smoothCursor[1],
      );
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
      ro.disconnect();
      try { loseCtx?.loseContext(); } catch { /* hmr safety */ }
      renderer.dispose();
      material.dispose();
      geometry.dispose();
      colorTex.dispose();
      maskTex.dispose();
      if (renderer.domElement.parentElement === container) {
        container.removeChild(renderer.domElement);
      }
    };
  }, [imageSrc, maskSrc, cursorRippleStrength, zoomStartPx, zoomEndPx, scopeRef]);

  // Fixed full-viewport backdrop. Sits at z-0 so it appears in front of
  // the body/main background but BEHIND every flow section (which must
  // carry `relative z-10` to layer above). pointer-events:none so it
  // never eats clicks on the content above.
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
