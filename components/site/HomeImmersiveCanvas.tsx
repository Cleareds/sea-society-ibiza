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

  // Cover-fit UV mapping: given viewport aspect + image aspect, return
  // the image UV for the current fragment, biased to keep the centre of
  // interest visible. We can also zoom + recentre based on uProgress.
  vec2 coverUV(vec2 uv, float vpAspect, float imgAspect) {
    vec2 result = uv;
    if (imgAspect > vpAspect) {
      // image is wider than vp — crop horizontally
      float scale = vpAspect / imgAspect;
      result.x = (uv.x - 0.5) * scale + 0.5;
    } else {
      // image is taller than vp — crop vertically
      float scale = imgAspect / vpAspect;
      result.y = (uv.y - 0.5) * scale + 0.5;
    }
    return result;
  }

  // Smoothstep helper
  float ss(float a, float b, float x) { return smoothstep(a, b, x); }

  void main() {
    // 1. Base UV after cover-fit
    vec2 base = coverUV(vuv, uAspectViewport, uAspectImage);

    // 2. Pan phase — slide the visible window down through a portrait
    //    image inside a landscape (or any) viewport. Only meaningful
    //    when the source image is taller than the cover-fit crop allows.
    //    At uPan=0 the camera is BIASED UPWARD so the opening frame
    //    shows a sliver of sky + the mountain in clear view (not the
    //    cover-fit centre, which would land on the lady's eye-level).
    //    At uPan=1 it has drifted further down.
    float panRange = max(0.0, 0.5 - 0.5 * (uAspectImage / uAspectViewport));
    base.y += (uPan - 0.4) * panRange * 1.2;

    // 3. Zoom phase — once the pan completes, zoom into the sea band.
    //    Sea sits left-of-centre + slightly above the lady. At peak we
    //    push the zoom centre leftward to crop the lady out.
    float zoom = mix(1.0, 0.45, uZoom);
    vec2 zoomCenter = mix(vec2(0.5, 0.6), vec2(0.32, 0.55), uZoom);
    vec2 uvZoomed = (base - zoomCenter) * zoom + zoomCenter;

    // 3. Sample the mask AFTER zoom so subject pixels stay subject pixels
    //    regardless of crop.
    vec3 mask = texture2D(uMask, uvZoomed).rgb;
    float waterMask  = mask.g;
    float staticMask = mask.b;

    // Hard-threshold the water gate so we never sit in a soft mid-grey
    // "halfway" zone that looks like a blind spot mid-sea.
    float water = smoothstep(0.30, 0.55, waterMask) * (1.0 - staticMask);

    // 4. Cursor refraction — sea only.
    vec2 toCursor = vuv - uCursor;
    float cursorDist = length(toCursor);
    float cursorFalloff = exp(-cursorDist * 7.0);
    vec2 cursorDir = normalize(toCursor + 1e-4);

    // 5. Animated ripple — smaller amplitude + lower spatial frequency so
    //    the sea reads as a calm body of water rather than a corrugated
    //    pond. Two phases combined for natural-looking motion.
    float wave =
        sin(uvZoomed.x *  8.0 + uTime * 0.42) * 0.55 +
        sin(uvZoomed.y * 11.0 - uTime * 0.31) * 0.45;

    // Soft caustic shimmer — band-limited value noise, gentler than
    // before. Re-centred so it darkens AND brightens (water shimmer).
    float caustic =
        vnoise(uvZoomed * 5.0 + vec2(uTime * 0.08, -uTime * 0.05)) +
        vnoise(uvZoomed * 9.0 - vec2(uTime * 0.11, uTime * 0.04)) * 0.5;
    caustic = (caustic - 0.75) * 0.45;

    // 6. Displacement — gated entirely by water. Sky + rock + lady
    //    get ZERO movement (no parallax either — they're set in stone).
    vec2 displacement = (
      vec2(wave) * 0.0018 +
      cursorDir * cursorFalloff * uRippleStrength
    ) * water;

    vec2 sampleUV = uvZoomed + displacement;

    // 7. Sample the color image
    vec3 color = texture2D(uColor, sampleUV).rgb;

    // 8. Add caustic + cursor spot — both gated by water.
    float shimmer = caustic * 0.06 * water;
    float spot = exp(-cursorDist * 3.5) * 0.04 * water;
    color += shimmer + spot;

    // 9. Edge vignette tied to zoom — darken corners more as we zoom in
    //    so the sea framing feels cinematic at uZoom ≈ 1.
    float vig = ss(0.95, 0.45, length(vuv - vec2(0.5)));
    color *= mix(1.0, 0.88, (1.0 - vig) * uZoom);

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
      t.colorSpace = THREE.SRGBColorSpace;
      t.minFilter = THREE.LinearFilter;
      t.magFilter = THREE.LinearFilter;
      t.wrapS = THREE.ClampToEdgeWrapping;
      t.wrapT = THREE.ClampToEdgeWrapping;
      t.generateMipmaps = false;
    });
    // Mask is treated as data (already linear pixel data, not sRGB).
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
      uAspectImage: { value: 1600 / 2400 },
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

      // Compute pan + zoom from the page scroll position. The canvas is
      // a fixed backdrop behind the whole page — its visual state is
      // entirely driven by where the user is in the document. The
      // image is intentionally allowed to move FASTER than the
      // surrounding content (parallax-like): by the time the user has
      // scrolled to the yacht cards (~1 viewport down) the zoom is
      // almost done, so the cards already sit on the sea-only crop.
      const vh = window.innerHeight;
      const start = zoomStartPx ?? vh * 0.2;
      const end = zoomEndPx ?? vh * 1.0;
      const sy = window.scrollY;
      // Pan completes over the first ~0.6 viewport — a small downward
      // camera drift on the hero image while the user reads the copy.
      const targetPan = clamp01(sy / (vh * 0.6));
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
