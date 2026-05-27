"use client";
// Vanilla three.js stage for Sea Society immersive hero.
// - Two depth-mapped slides, smooth scroll-driven crossfade.
// - No UV-warp / rotation during transition (caused the visible "blink").
// - Per-slide yacht-mask uniforms because the two yachts differ in size,
//   orientation and framing.

import * as React from "react";
import * as THREE from "three";

export interface ImmersiveCanvasProps {
  /** Slide 1 (top of page) */
  slide1ImageSrc: string;
  /** Slide 1 grayscale depth PNG */
  slide1DepthSrc: string;
  /** Slide 2 (revealed by scroll) */
  slide2ImageSrc: string;
  /** Slide 2 grayscale depth PNG */
  slide2DepthSrc: string;
  /** 0 → 1, scroll-driven. */
  transitionProgress: number;

  parallaxStrength?: number;
  waterDistortionStrength?: number;
  cursorRippleStrength?: number;
  shimmerStrength?: number;
  driftStrength?: number;
  /** Subtle scale-out applied to the *outgoing* slide while it crossfades.
   *  Deprecated: slide 1 now rotates + zooms instead of plain scale. Kept
   *  in the props for API stability but not used by the shader. */
  outgoingScale?: number;
  /** Subtle scale-in applied to the *incoming* slide while it fades in. */
  incomingScale?: number;
  /** Slide-1 rotation at the end of its phase, in radians.
   *  Default -π/2 (-1.5708) so the horizontal yacht ends up vertical,
   *  visually aligned with slide 2's portrait yacht. */
  slide1Rotation?: number;
  /** Peak zoom applied to slide 1 at the end of its rotation phase.
   *  Default 1.42 — large enough to hide the corner clamping that
   *  appears when a 4:3 image is rotated 90° inside a 16:9 viewport,
   *  and adds a cinematic "drone tilt" feel as you scroll. */
  slide1Zoom?: number;

  /** Per-slide yacht-mask tuning. */
  slide1Mask?: MaskParams;
  slide2Mask?: MaskParams;

  invertDepthSlide1?: boolean;
  invertDepthSlide2?: boolean;
  /** 0 = off, 1 = slide 1 depth, 2 = slide 2 depth */
  debugDepthView?: number;
  /** 0 = off, 1 = slide 1 mask, 2 = slide 2 mask */
  debugWaterMask?: number;
}

export interface MaskParams {
  /** Depth-map sample anchor shift in image UV (y is image space). */
  anchorShiftY?: number;
  /** Asymmetric dilation radii in image UV. */
  dilateUp?: number;
  dilateDown?: number;
  dilateLeft?: number;
  dilateRight?: number;
  /** smoothstep thresholds for the depth → mask conversion. */
  thresholdLow?: number;
  thresholdHigh?: number;
}

function defaultMaskFor(slot: "s1" | "s2"): Required<MaskParams> {
  if (slot === "s1") {
    // Slide 1 yacht: small horizontal boat at image centre, surrounded by
    // bright water highlights. The depth gradient at the hull is gentle
    // (~0.6 at edges → ~1.0 at the brightest centre). The earlier tight
    // threshold left the hull edges treated as water → "underwater" feel.
    // Wider band + larger dilation captures the whole boat plus a small
    // halo so cursor/caustic effects can't reach the hull.
    return {
      anchorShiftY: 0,
      dilateUp: 0.030,
      dilateDown: 0.030,
      dilateLeft: 0.028,
      // Yacht's bow points right in the source image — the depth gradient
      // tapers sharply that way so the mask needs extra reach there to
      // cover the bow tip without leaving a thin "underwater" sliver.
      dilateRight: 0.055,
      thresholdLow: 0.42,
      thresholdHigh: 0.62,
    };
  }
  // Slide 2 — the close-up portrait yacht we tuned before.
  return {
    anchorShiftY: 0.007,
    dilateUp: 0.020,
    dilateDown: 0.00165,
    dilateLeft: 0.00424,
    dilateRight: 0.003,
    thresholdLow: 0.40,
    thresholdHigh: 0.55,
  };
}

const VERT = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = vec4(position.xy, 0.0, 1.0);
  }
`;

// Shader: two slides, each evaluated independently with its own water
// pipeline + yacht mask. Crossfaded by uTransition with smooth windows.
// No UV rotation or warping at the slide boundary so the handoff reads
// as a luxury cross-dissolve, not a visible transform.
const FRAG = /* glsl */ `
  precision highp float;

  uniform sampler2D uColor1;
  uniform sampler2D uDepth1;
  uniform sampler2D uColor2;
  uniform sampler2D uDepth2;
  uniform vec2  uCover1;
  uniform vec2  uCenter1;
  uniform vec2  uCover2;
  uniform vec2  uCenter2;

  // Per-slide mask params: anchor shift Y, dilate up/down/left/right,
  // threshold lo, threshold hi.
  uniform vec4  uMask1A;   // (anchorY, dilUp, dilDown, dilLeft)
  uniform vec4  uMask1B;   // (dilRight, thresholdLo, thresholdHi, _)
  uniform vec4  uMask2A;
  uniform vec4  uMask2B;

  uniform vec2  uOffset;
  uniform vec2  uDrift;
  uniform vec2  uCursor;
  uniform float uTime;
  uniform float uAspect;
  uniform float uTransition;
  uniform float uParallax;
  uniform float uWaterDist;
  uniform float uRipple;
  uniform float uShimmer;

  uniform float uOutgoingScale;
  uniform float uIncomingScale;
  uniform float uSlide1Rot;     // peak rotation for slide 1 (radians)
  uniform float uSlide1Zoom;    // peak zoom for slide 1 at full rotation

  uniform float uInvert1;
  uniform float uInvert2;
  uniform float uDebugDepth;
  uniform float uDebugMask;
  varying vec2 vUv;

  float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
  float noise(vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);
    vec2 u = f * f * (3.0 - 2.0 * f);
    return mix(
      mix(hash(i + vec2(0.0, 0.0)), hash(i + vec2(1.0, 0.0)), u.x),
      mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), u.x),
      u.y
    );
  }
  float fbm(vec2 p) {
    float v = 0.0;
    float a = 0.5;
    for (int i = 0; i < 4; i++) {
      v += a * noise(p);
      p *= 2.03;
      a *= 0.55;
    }
    return v;
  }

  float sampleDepth(sampler2D tex, vec2 p, float invert) {
    float d = texture2D(tex, p).r;
    return mix(d, 1.0 - d, invert);
  }

  // mask kernel — same shape, per-slide knobs via uMaskA/uMaskB
  float yachtMaskGeneric(
    sampler2D depthTex, vec2 uv, float invert,
    vec4 mA, vec4 mB
  ) {
    float anchorY = mA.x;
    float dilUp   = mA.y;
    float dilDown = mA.z;
    float dilLeft = mA.w;
    float dilRight = mB.x;
    float thLo    = mB.y;
    float thHi    = mB.z;

    vec2 anchor = uv - vec2(0.0, anchorY);
    float d0  = sampleDepth(depthTex, anchor, invert);
    float dU1 = sampleDepth(depthTex, anchor - vec2(0.0, dilUp * 0.6), invert);
    float dU2 = sampleDepth(depthTex, anchor - vec2(0.0, dilUp), invert);
    float dD  = sampleDepth(depthTex, anchor + vec2(0.0, dilDown), invert);
    float dL  = sampleDepth(depthTex, anchor + vec2(dilLeft, 0.0), invert);
    float dR  = sampleDepth(depthTex, anchor - vec2(dilRight, 0.0), invert);
    float m = max(max(d0, dU1), max(max(dU2, dD), max(dL, dR)));
    return smoothstep(thLo, thHi, m);
  }

  vec3 evaluateSlide(
    vec2 vuv, float scale,
    sampler2D colorTex, sampler2D depthTex,
    vec2 cover, vec2 center, float invert,
    vec4 mA, vec4 mB
  ) {
    // Scale around centre so a fading slide can subtly recede/advance
    // without rotating — pure compositional breathing.
    vec2 centred = (vuv - 0.5) * scale + 0.5;
    vec2 uv = (centred - center) * cover + 0.5;

    float boatMask = yachtMaskGeneric(depthTex, uv, invert, mA, mB);
    float waterMask = 1.0 - boatMask;

    float depth0 = sampleDepth(depthTex, uv, invert);

    vec2 toCursor = vuv - uCursor;
    toCursor.x *= uAspect;
    float cursorDist = length(toCursor);

    float refractFalloff = exp(-cursorDist * 9.0);
    vec2 refractDir = normalize(toCursor + vec2(0.0001));
    float ripple = sin(cursorDist * 32.0 - uTime * 2.0);
    vec2 refractOffset = refractDir * refractFalloff * uRipple * ripple * waterMask;

    vec2 pointer = uOffset + uDrift;
    vec2 shift = pointer * uParallax * (0.4 + depth0) * waterMask;

    vec2 distortion = vec2(
      noise(uv * 4.0 + vec2(uTime * 0.04, 0.0)) - 0.5,
      noise(uv * 4.0 + vec2(0.0, uTime * 0.03)) - 0.5
    ) * uWaterDist * waterMask;

    vec2 sampleUv = uv + shift + refractOffset + distortion;
    vec3 col = texture2D(colorTex, sampleUv).rgb;

    float n1 = fbm(uv * 3.5 + vec2(uTime * 0.05, uTime * 0.03));
    float n2 = fbm(uv * 8.0 - vec2(uTime * 0.03, uTime * 0.055));
    float n3 = fbm(uv * 16.0 + vec2(uTime * 0.02, uTime * 0.04));
    float caustic = pow(max(0.0, n1 * 0.55 + n2 * 0.35 + n3 * 0.15 - 0.42), 1.5)
                    * uShimmer * waterMask;
    col += vec3(caustic * 0.45, caustic * 0.95, caustic * 1.0);

    float spot = exp(-cursorDist * 4.0) * 0.07 * waterMask;
    col += vec3(spot * 0.55, spot * 1.05, spot * 1.15);

    float breathe = (sin(uTime * 0.35) * 0.5 + 0.5) * 0.04 * boatMask;
    col += vec3(breathe * 0.95, breathe, breathe * 1.0);

    return col;
  }

  void main() {
    float p = uTransition;

    // ===== Slide 1 transform: rotate + zoom-in over the first half of scroll =====
    //
    // Slide 1's yacht is horizontal; slide 2's is vertical. Rotating slide 1
    // by -90° during scroll re-orients its yacht so by the time the dissolve
    // fires, both yachts visually occupy the same vertical orientation at
    // viewport centre. The zoom progresses alongside the rotation: it hides
    // the corner clamping that appears when a 4:3 image is rotated inside a
    // wider viewport, and reads as a slow cinematic drone push-in.
    //
    // Phase windows — compressed so each scroll unit produces visible
    // motion (the previous 0→0.50 window made the rotation barely
    // perceptible until late scroll).
    //   p 0.00 → 0.02   slide 1 holds native (single scroll-tick beat)
    //   p 0.02 → 0.42   rotate 0 → uSlide1Rot, zoom 1.0 → uSlide1Zoom
    //   p 0.45 → 0.92   depth-aware dissolve into slide 2
    //   p 0.92 → 1.00   slide 2 holds native
    float rotPhase = smoothstep(0.02, 0.42, p);
    // Zoom starts immediately (no smoothstep front-loading at 0.02) and
    // peaks slightly before rotation completes so the user sees a clear
    // push-in from the first scroll tick.
    float zoomEase = smoothstep(0.0, 0.40, p);
    float zoom1    = mix(1.0, uSlide1Zoom, zoomEase);
    float rot1     = uSlide1Rot * rotPhase;

    // Aspect-corrected rotation around viewport centre: stretch x by uAspect
    // so the rotation reads as visually circular, rotate, restore. Then divide
    // by zoom1 so a larger zoom *narrows* the sampled region around centre.
    vec2 v1 = vUv - 0.5;
    v1.x *= uAspect;
    float cs = cos(rot1);
    float sn = sin(rot1);
    v1 = vec2(cs * v1.x - sn * v1.y, sn * v1.x + cs * v1.y);
    v1.x /= uAspect;
    v1 = v1 / zoom1 + 0.5;

    // ===== Depth-aware dissolve, gated to fire only after rotation completes =====
    //
    // Sample slide-1's yacht mask at the *rotated* UV so the depth-aware
    // dissolve timing follows where the yacht visually sits on screen
    // (viewport centre, vertical, post-rotation). Pair that with a
    // slide-2 mask sampled at the entrance-scaled UV — pre-applied below
    // so the dissolve fires at the right moment in slide-2's frame too.
    vec2 uv1mask = (v1 - uCenter1) * uCover1 + 0.5;
    float boatMask1 = yachtMaskGeneric(uDepth1, uv1mask, uInvert1, uMask1A, uMask1B);

    // Remap progress so the dissolve doesn't begin until p≥0.45 (just
    // after rotation completes), and finishes by p≈0.92 leaving an
    // 8% "settled slide 2" window at the end of scroll.
    float dissolveP = smoothstep(0.45, 0.92, p);

    // Per-pixel threshold curve — water leads (low pT fires early), yacht
    // waits (high pT fires late). With slide-2 entering at slide-1's peak
    // zoom level, the two yachts visually match at the dissolve start, so
    // the slide-1-only mask doesn't produce a "Frankenstein" boundary —
    // the smaller-than-native slide-2 yacht emerges right inside slide-1's
    // yacht silhouette as both share the same screen position.
    float pT  = mix(0.28, 0.70, boatMask1);
    float w2  = smoothstep(pT - 0.08, pT + 0.08, dissolveP);
    float w1  = 1.0 - w2;

    // Slide 2 entrance: zoom curve mirrors slide-1's peak zoom so the two
    // yachts visually match in size at the dissolve start, then slide 2
    // gently pushes in to its native framing as the transition resolves.
    float scale2 = mix(uSlide1Zoom, 1.0, smoothstep(0.45, 0.92, p));

    vec3 col1 = vec3(0.0);
    vec3 col2 = vec3(0.0);
    if (w1 > 0.002) {
      // Pre-rotated v1 + scale=1.0 because the rotation+zoom already does
      // slide 1's transformation; evaluateSlide handles cover mapping only.
      col1 = evaluateSlide(
        v1, 1.0, uColor1, uDepth1, uCover1, uCenter1, uInvert1,
        uMask1A, uMask1B
      );
    }
    if (w2 > 0.002) {
      col2 = evaluateSlide(
        vUv, scale2, uColor2, uDepth2, uCover2, uCenter2, uInvert2,
        uMask2A, uMask2B
      );
    }
    float wSum = max(w1 + w2, 0.0001);
    vec3 col = (col1 * w1 + col2 * w2) / wSum;

    // Overall vignette
    float vig = smoothstep(1.15, 0.6, length(vUv - 0.5));
    col *= mix(0.86, 1.0, vig);

    // Debug overlays
    if (uDebugDepth > 0.5) {
      if (uDebugDepth < 1.5) {
        vec2 uv = (vUv - uCenter1) * uCover1 + 0.5;
        col = vec3(sampleDepth(uDepth1, uv, uInvert1));
      } else {
        vec2 uv = (vUv - uCenter2) * uCover2 + 0.5;
        col = vec3(sampleDepth(uDepth2, uv, uInvert2));
      }
    }
    if (uDebugMask > 0.5) {
      if (uDebugMask < 1.5) {
        vec2 uv = (vUv - uCenter1) * uCover1 + 0.5;
        col = vec3(yachtMaskGeneric(uDepth1, uv, uInvert1, uMask1A, uMask1B));
      } else {
        vec2 uv = (vUv - uCenter2) * uCover2 + 0.5;
        col = vec3(yachtMaskGeneric(uDepth2, uv, uInvert2, uMask2A, uMask2B));
      }
    }

    gl_FragColor = vec4(col, 1.0);
  }
`;

interface SlideAspect { w: number; h: number; }

function computeCover(imgAspect: number, viewAspect: number): [number, number] {
  if (viewAspect > imgAspect) return [1, imgAspect / viewAspect];
  return [viewAspect / imgAspect, 1];
}

function packMask(p: Required<MaskParams>): { a: THREE.Vector4; b: THREE.Vector4 } {
  return {
    a: new THREE.Vector4(p.anchorShiftY, p.dilateUp, p.dilateDown, p.dilateLeft),
    b: new THREE.Vector4(p.dilateRight, p.thresholdLow, p.thresholdHigh, 0),
  };
}

export default function ImmersiveCanvas({
  slide1ImageSrc,
  slide1DepthSrc,
  slide2ImageSrc,
  slide2DepthSrc,
  transitionProgress,
  parallaxStrength = 0.018,
  waterDistortionStrength = 0.006,
  cursorRippleStrength = 0.005,
  shimmerStrength = 2.0,
  driftStrength = 0.18,
  outgoingScale = 1.06,
  incomingScale = 0.96,
  slide1Rotation = -1.5707963, // -π/2 = 90° CCW
  slide1Zoom = 1.60,
  slide1Mask,
  slide2Mask,
  invertDepthSlide1 = false,
  invertDepthSlide2 = false,
  debugDepthView = 0,
  debugWaterMask = 0,
}: ImmersiveCanvasProps) {
  const containerRef = React.useRef<HTMLDivElement>(null);

  const liveProgress = React.useRef(transitionProgress);
  const liveDrift = React.useRef(driftStrength);
  const liveDebugDepth = React.useRef(debugDepthView);
  const liveDebugMask = React.useRef(debugWaterMask);
  React.useEffect(() => { liveProgress.current = transitionProgress; }, [transitionProgress]);
  React.useEffect(() => { liveDrift.current = driftStrength; }, [driftStrength]);
  React.useEffect(() => { liveDebugDepth.current = debugDepthView; }, [debugDepthView]);
  React.useEffect(() => { liveDebugMask.current = debugWaterMask; }, [debugWaterMask]);

  const mask1Key = JSON.stringify(slide1Mask ?? null);
  const mask2Key = JSON.stringify(slide2Mask ?? null);

  React.useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let disposed = false;
    let raf = 0;

    const renderer = new THREE.WebGLRenderer({
      antialias: false,
      alpha: false,
      powerPreference: "high-performance",
      preserveDrawingBuffer: false,
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.75));
    renderer.setClearColor(0x06141a, 1);
    container.appendChild(renderer.domElement);
    Object.assign(renderer.domElement.style, {
      position: "absolute",
      inset: "0",
      width: "100%",
      height: "100%",
      pointerEvents: "none",
    });

    const scene = new THREE.Scene();
    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);

    const loader = new THREE.TextureLoader();
    const aspects: { s1: SlideAspect; s2: SlideAspect } = {
      s1: { w: 1, h: 1 }, s2: { w: 1, h: 1 },
    };

    function configureColour(t: THREE.Texture) {
      t.colorSpace = THREE.SRGBColorSpace;
      t.wrapS = t.wrapT = THREE.ClampToEdgeWrapping;
      t.minFilter = t.magFilter = THREE.LinearFilter;
      t.generateMipmaps = false;
    }
    function configureDepth(t: THREE.Texture) {
      t.wrapS = t.wrapT = THREE.ClampToEdgeWrapping;
      t.minFilter = t.magFilter = THREE.LinearFilter;
      t.generateMipmaps = false;
    }

    const color1 = loader.load(slide1ImageSrc, (t) => {
      configureColour(t);
      const img = t.image as { width?: number; height?: number };
      if (img.width && img.height) aspects.s1 = { w: img.width, h: img.height };
    });
    configureColour(color1);
    const depth1 = loader.load(slide1DepthSrc, configureDepth);
    configureDepth(depth1);
    const color2 = loader.load(slide2ImageSrc, (t) => {
      configureColour(t);
      const img = t.image as { width?: number; height?: number };
      if (img.width && img.height) aspects.s2 = { w: img.width, h: img.height };
    });
    configureColour(color2);
    const depth2 = loader.load(slide2DepthSrc, configureDepth);
    configureDepth(depth2);

    const mask1 = { ...defaultMaskFor("s1"), ...slide1Mask };
    const mask2 = { ...defaultMaskFor("s2"), ...slide2Mask };
    const m1 = packMask(mask1);
    const m2 = packMask(mask2);

    const uniforms = {
      uColor1: { value: color1 },
      uDepth1: { value: depth1 },
      uColor2: { value: color2 },
      uDepth2: { value: depth2 },
      uCover1: { value: new THREE.Vector2(1, 1) },
      uCenter1: { value: new THREE.Vector2(0.5, 0.5) },
      uCover2: { value: new THREE.Vector2(1, 1) },
      uCenter2: { value: new THREE.Vector2(0.5, 0.5) },
      uMask1A: { value: m1.a },
      uMask1B: { value: m1.b },
      uMask2A: { value: m2.a },
      uMask2B: { value: m2.b },
      uOffset: { value: new THREE.Vector2(0, 0) },
      uDrift: { value: new THREE.Vector2(0, 0) },
      uCursor: { value: new THREE.Vector2(0.5, 0.5) },
      uTime: { value: 0 },
      uAspect: { value: 1.6 },
      uTransition: { value: transitionProgress },
      uParallax: { value: parallaxStrength },
      uWaterDist: { value: waterDistortionStrength },
      uRipple: { value: cursorRippleStrength },
      uShimmer: { value: shimmerStrength },
      uOutgoingScale: { value: outgoingScale },
      uIncomingScale: { value: incomingScale },
      uSlide1Rot: { value: slide1Rotation },
      uSlide1Zoom: { value: slide1Zoom },
      uInvert1: { value: invertDepthSlide1 ? 1.0 : 0.0 },
      uInvert2: { value: invertDepthSlide2 ? 1.0 : 0.0 },
      uDebugDepth: { value: debugDepthView },
      uDebugMask: { value: debugWaterMask },
    };

    const material = new THREE.ShaderMaterial({
      vertexShader: VERT,
      fragmentShader: FRAG,
      uniforms,
      depthTest: false,
      depthWrite: false,
    });
    const geometry = new THREE.PlaneGeometry(2, 2);
    const mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);

    const targetPointer: [number, number] = [0, 0];
    const smoothedPointer: [number, number] = [0, 0];
    const targetCursor: [number, number] = [0.5, 0.5];
    const smoothedCursor: [number, number] = [0.5, 0.5];
    const onPointer = (e: PointerEvent) => {
      const x = e.clientX / window.innerWidth;
      const y = e.clientY / window.innerHeight;
      targetPointer[0] = x * 2 - 1;
      targetPointer[1] = y * 2 - 1;
      targetCursor[0] = x;
      targetCursor[1] = 1 - y;
    };
    window.addEventListener("pointermove", onPointer, { passive: true });

    const resize = () => {
      const w = container.clientWidth;
      const h = container.clientHeight;
      renderer.setSize(w, h, false);
      uniforms.uAspect.value = w / h;
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(container);

    const onLost = (e: Event) => e.preventDefault();
    const onRestored = () => {
      color1.needsUpdate = true;
      depth1.needsUpdate = true;
      color2.needsUpdate = true;
      depth2.needsUpdate = true;
    };
    renderer.domElement.addEventListener("webglcontextlost", onLost, false);
    renderer.domElement.addEventListener("webglcontextrestored", onRestored, false);

    let lastT = performance.now();
    const tick = () => {
      if (disposed) return;
      const now = performance.now();
      const dt = Math.min((now - lastT) / 1000, 0.05);
      lastT = now;
      const t = now / 1000;

      const lerp = 1 - Math.pow(0.001, dt);
      smoothedPointer[0] += (targetPointer[0] - smoothedPointer[0]) * lerp * 0.55;
      smoothedPointer[1] += (targetPointer[1] - smoothedPointer[1]) * lerp * 0.55;
      smoothedCursor[0] += (targetCursor[0] - smoothedCursor[0]) * lerp * 0.55;
      smoothedCursor[1] += (targetCursor[1] - smoothedCursor[1]) * lerp * 0.55;

      uniforms.uOffset.value.set(smoothedPointer[0], -smoothedPointer[1]);
      const ds = liveDrift.current;
      uniforms.uDrift.value.set(Math.sin(t * 0.13) * ds, Math.cos(t * 0.097) * ds * 0.8);
      uniforms.uTime.value = t;
      uniforms.uCursor.value.set(smoothedCursor[0], smoothedCursor[1]);
      uniforms.uTransition.value = liveProgress.current;
      uniforms.uDebugDepth.value = liveDebugDepth.current;
      uniforms.uDebugMask.value = liveDebugMask.current;

      const w = container.clientWidth;
      const h = container.clientHeight;
      const viewAspect = w / h;
      const c1 = computeCover(aspects.s1.w / aspects.s1.h, viewAspect);
      uniforms.uCover1.value.set(c1[0], c1[1]);
      const c2 = computeCover(aspects.s2.w / aspects.s2.h, viewAspect);
      uniforms.uCover2.value.set(c2[0], c2[1]);

      renderer.render(scene, camera);
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    return () => {
      disposed = true;
      cancelAnimationFrame(raf);
      window.removeEventListener("pointermove", onPointer);
      ro.disconnect();
      renderer.domElement.removeEventListener("webglcontextlost", onLost);
      renderer.domElement.removeEventListener("webglcontextrestored", onRestored);
      geometry.dispose();
      material.dispose();
      color1.dispose();
      depth1.dispose();
      color2.dispose();
      depth2.dispose();
      renderer.dispose();
      if (renderer.domElement.parentNode === container) {
        container.removeChild(renderer.domElement);
      }
    };
  // We deliberately reset the scene only when the textures/masks change —
  // every other uniform is updated through liveRefs each frame.
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    slide1ImageSrc, slide1DepthSrc,
    slide2ImageSrc, slide2DepthSrc,
    parallaxStrength, waterDistortionStrength, cursorRippleStrength,
    shimmerStrength, outgoingScale, incomingScale,
    slide1Rotation, slide1Zoom,
    mask1Key, mask2Key,
    invertDepthSlide1, invertDepthSlide2,
  ]);

  return <div ref={containerRef} className="absolute inset-0 h-full w-full" aria-hidden />;
}
