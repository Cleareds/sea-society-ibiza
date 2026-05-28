"use client";

import * as React from "react";
import * as THREE from "three";

/**
 * Homepage WebGL canvas — Es Vedra hero with depth-aware water shader.
 *
 * Two textures:
 *   - Color image (home-hero.webp): the photograph.
 *   - Mask image (home-hero-depth.png): RGB packed.
 *       R = depth   (0 far → 255 near, for subtle background parallax)
 *       G = water   (sea region, where the shader animates ripple + caustics)
 *       B = static  (lady + foreground rocks, no movement at all)
 *
 * Scroll progress drives a UV crop:
 *   p = 0.0  → full Es Vedra frame
 *   p = 1.0  → zoomed in on the sea region (the "next screen" framing,
 *              where the yacht cards + fleet headline overlay).
 *
 * Effects are gated so the lady silhouette + foreground rocks stay
 * absolutely crisp + static — only the sea moves.
 */
export interface HomeImmersiveCanvasProps {
  /** Shared ref written by the parent's scroll handler. 0..1 across the
   *  sticky pin. */
  progressRef: React.RefObject<number>;
  /** Color photo. */
  imageSrc?: string;
  /** RGB mask (R depth · G water · B static-foreground). */
  maskSrc?: string;
  /** Strength of cursor-driven refraction in the sea. */
  cursorRippleStrength?: number;
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
  uniform float uProgress;     // 0 = hero framing, 1 = sea framing
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

    // 2. Scroll-driven zoom into the sea region.
    //    Source sea sits left-of-centre + slightly above the lady. We
    //    push the zoom centre leftward at peak to crop the lady out and
    //    fill the frame with sea + rock-base.
    float zoom = mix(1.0, 0.45, uProgress);
    vec2 zoomCenter = mix(vec2(0.5, 0.5), vec2(0.32, 0.55), uProgress);
    vec2 uvZoomed = (base - zoomCenter) * zoom + zoomCenter;

    // 3. Sample the mask AFTER zoom so subject pixels stay subject pixels
    //    regardless of crop.
    vec3 mask = texture2D(uMask, uvZoomed).rgb;
    float depth      = mask.r;
    float waterMask  = mask.g;
    float staticMask = mask.b;

    // 4. Cursor refraction — sea only. Direction = away from cursor, so
    //    the water "responds" to where the user hovers.
    vec2 toCursor = vuv - uCursor;
    float cursorDist = length(toCursor);
    float cursorFalloff = exp(-cursorDist * 8.0);
    vec2 cursorDir = normalize(toCursor + 1e-4);

    // 5. Animated ripple — phase rolls forward, gentle amplitude.
    float wave =
        sin(uvZoomed.x * 18.0 + uTime * 0.55) *
        cos(uvZoomed.y * 14.0 - uTime * 0.42);
    // Soft caustic shimmer — band-limited value noise.
    float caustic =
        vnoise(uvZoomed * 6.0 + vec2(uTime * 0.13, -uTime * 0.09)) +
        vnoise(uvZoomed * 12.0 - vec2(uTime * 0.18, uTime * 0.07)) * 0.5;
    caustic = (caustic - 1.0) * 0.5;   // recentre around 0

    // 6. Combined displacement (sea only). Static foreground locked
    //    absolutely (lady + foreground rocks); rock gets a tiny depth
    //    parallax but no water.
    float effect = waterMask * (1.0 - staticMask);

    vec2 displacement = (
      vec2(wave) * 0.0030 +
      cursorDir * cursorFalloff * uRippleStrength
    ) * effect;

    // Tiny background parallax for sky+rock — depth maps far→0, near→1
    // Static fg gets ZERO parallax.
    vec2 parallax =
      (uCursor - vec2(0.5)) * 0.012 * (1.0 - depth) * (1.0 - staticMask);

    vec2 sampleUV = uvZoomed + displacement + parallax;

    // 7. Sample the color image
    vec3 color = texture2D(uColor, sampleUV).rgb;

    // 8. Brighten the water with the caustic shimmer + a soft cursor spot
    float shimmer = caustic * 0.08 * effect;
    float spot = exp(-cursorDist * 3.5) * 0.05 * effect;
    color += shimmer + spot;

    // 9. Edge vignette tied to zoom — darken corners more as we zoom in
    //    so the sea framing feels cinematic at p ≈ 1.
    float vig = ss(0.95, 0.45, length(vuv - vec2(0.5)));
    color *= mix(1.0, 0.88, (1.0 - vig) * uProgress);

    gl_FragColor = vec4(color, 1.0);
  }
`;

export function HomeImmersiveCanvas({
  progressRef,
  imageSrc = DEFAULT_IMAGE,
  maskSrc = DEFAULT_MASK,
  cursorRippleStrength = 0.006,
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
      uProgress: { value: 0 },
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
    const smoothProgress: [number] = [0];

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

    // IntersectionObserver — pause the RAF when off-screen.
    let visible = true;
    const io = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (entry) visible = entry.isIntersecting;
      },
      { threshold: 0 },
    );
    io.observe(container);

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

      // Damp inputs so they don't twitch on jittery scroll/touch events
      smoothCursor[0] += (targetCursor[0] - smoothCursor[0]) * 0.12;
      smoothCursor[1] += (targetCursor[1] - smoothCursor[1]) * 0.12;
      smoothProgress[0] += (progressRef.current - smoothProgress[0]) * 0.18;

      (uniforms.uCursor as { value: THREE.Vector2 }).value.set(
        smoothCursor[0],
        smoothCursor[1],
      );
      (uniforms.uTime as { value: number }).value += dt;
      (uniforms.uProgress as { value: number }).value = smoothProgress[0];
      renderer.render(scene, camera);
    };
    tick();

    return () => {
      if (raf) cancelAnimationFrame(raf);
      window.removeEventListener("pointermove", onPointer);
      ro.disconnect();
      io.disconnect();
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
  }, [imageSrc, maskSrc, cursorRippleStrength, progressRef]);

  return <div ref={containerRef} className="absolute inset-0 -z-10" />;
}
