"use client";

import * as React from "react";
import * as THREE from "three";

/**
 * 3D water plane composited with the source video.
 *
 * Two-pass renderer:
 *
 *   PASS 1 (offscreen FBO): a real PerspectiveCamera looking at a
 *   geometry plane (200x200 subdivisions) at sea-level, tilted away
 *   from the camera. Vertex shader displaces each vertex with a sum
 *   of Gerstner waves (up to 6 components). Fragment shader applies
 *   PBR-style water shading: Fresnel reflection of the source sky,
 *   sun-direction specular, foam on the highest crests, depth-graded
 *   colour. The result lands in a fbo we sample in pass 2.
 *
 *   PASS 2 (full-screen quad): samples the source colour video, the
 *   per-frame DA-V2 depth video, AND the water FBO from pass 1.
 *   Composites: pixels where depth indicates yacht / cliff or pixels
 *   in the horizon strip are kept from the photo. Everything else
 *   reads from the 3D water FBO.
 *
 * Scroll-driven scrub on the colour + depth videos (in lockstep with
 * each other) reuses the existing HomeVideoCanvas approach. Cursor
 * tilts the camera's view direction by a tiny amount for interactive
 * parallax — small enough that it doesn't break the composition.
 */

export interface HomeWater3DCanvasProps {
  videoSrc: string;
  videoSrcMobile?: string;
  depthVideoSrc?: string;
  posterSrc?: string;
  videoAspect: number;
  scrubScopeRef: React.RefObject<HTMLElement | null>;

  /** Composite controls. */
  yachtDepthThreshold?: number;
  horizonY?: number;

  /** Water look. */
  seaShallow?: [number, number, number];
  seaDeep?: [number, number, number];
  seaFoam?: [number, number, number];
  sunDir?: [number, number, number];
  /** Multiplier on all Gerstner wave amplitudes — bump to make the
   *  surface read more active, drop to flatten. Default 1.0. */
  waveScale?: number;
  /** Camera height above sea (Y) and dolly back from origin (Z). Tune
   *  per source video so the synthetic horizon lands at the photo's
   *  horizon line. Defaults match shorten.mov. */
  cameraHeight?: number;
  cameraDolly?: number;
  /** Sky colour the water reflects via Fresnel — set per variant
   *  so each preset matches its lighting palette. */
  skyColor?: [number, number, number];
}

const COMPOSITE_VERT = /* glsl */ `
  varying vec2 vuv;
  void main() {
    vuv = uv;
    gl_Position = vec4(position.xy, 0.0, 1.0);
  }
`;

const COMPOSITE_FRAG = /* glsl */ `
  precision highp float;
  uniform sampler2D uVideo;     // source colour video
  uniform sampler2D uDepth;     // DA-V2 depth video
  uniform sampler2D uWater;     // 3D water plane FBO from pass 1
  uniform float uHasDepth;
  uniform float uYachtDepth;
  uniform float uHorizonY;
  uniform vec2  uAspectScale;   // (visibleX, visibleY) cover-fit
  uniform vec2  uAspectStart;   // (startX, startY) cover-fit
  varying vec2 vuv;

  void main() {
    vec2 uv = uAspectStart + vuv * uAspectScale;
    vec3 photo = texture2D(uVideo, uv).rgb;
    vec3 water3d = texture2D(uWater, vuv).rgb;

    float keepPhoto = 0.0;
    if (uHasDepth > 0.5) {
      float d = texture2D(uDepth, uv).r;
      // YACHT-KEEP: depth ≥ threshold AND mid-frame screen position.
      // Wider depth band (0.10 instead of 0.04) keeps the yacht
      // hull fully sharp across all DA-V2 confidence variations.
      // The vertical gate suppresses the foreground wake at the
      // bottom which DA-V2 incorrectly reads as 'near'.
      float yachtDepthOk = smoothstep(uYachtDepth - 0.08, uYachtDepth + 0.08, d);
      float yachtPositionOk = smoothstep(0.18, 0.30, vuv.y);
      float yachtKeep = yachtDepthOk * yachtPositionOk;
      // HORIZON-KEEP: top of viewport stays photo (sky + cliffs).
      float horizonKeep = smoothstep(uHorizonY - 0.10, uHorizonY + 0.10, vuv.y);
      keepPhoto = max(yachtKeep, horizonKeep);
    } else {
      keepPhoto = 0.5;
    }

    // SEA BLEND — photo dominates (~80%). 3D water contributes only
    // a faint depth cue: normal-map ripple darkening troughs and
    // fresnel-lit peaks. Reads as effects 'below the surface' rather
    // than a synthetic plate laid on top.
    vec3 seaBlend = mix(photo, water3d, 0.20);
    // Additive highlight where 3D water is meaningfully brighter
    // than the photo — sun sparkle pops through.
    seaBlend += max(vec3(0.0), water3d - photo) * 0.18;

    vec3 final = mix(seaBlend, photo, keepPhoto);
    gl_FragColor = vec4(final, 1.0);
  }
`;

// 3D water — vertex-displaced plane with Gerstner waves.
const WATER_VERT = /* glsl */ `
  uniform float uTime;
  uniform float uWaveScale;
  varying vec2 vUv;
  varying vec3 vNormal;
  varying vec3 vWorldPos;

  // Gerstner wave: position += (D*A*cos(phase), A*sin(phase), 0)
  // We work on the XZ plane (water is flat at y=0) so the wave
  // displaces vertices on Y.
  vec3 gerstner(vec3 p, vec2 dir, float wlen, float amp, float speed, float t, inout vec3 n) {
    float k = 6.2831853 / wlen;
    float phase = k * dot(dir, p.xz) - speed * t * sqrt(9.81 * k);
    float s = sin(phase);
    float c = cos(phase);
    n.x -= dir.x * k * amp * c;
    n.z -= dir.y * k * amp * c;
    return vec3(0.0, amp * s, 0.0);
  }

  void main() {
    vec3 p = position;
    vec3 n = vec3(0.0, 1.0, 0.0);

    // Six waves — directions toward the camera. Amplitudes are
    // multiplied by uWaveScale so variants can be calmer / more
    // active without rewriting the shader.
    float s = uWaveScale;
    p += gerstner(p, normalize(vec2( 0.1,  1.0)), 28.0, 0.40 * s, 0.65, uTime, n);
    p += gerstner(p, normalize(vec2( 0.4,  0.9)), 20.0, 0.26 * s, 0.80, uTime, n);
    p += gerstner(p, normalize(vec2(-0.3,  0.9)), 12.0, 0.16 * s, 0.95, uTime, n);
    p += gerstner(p, normalize(vec2( 0.2,  0.95)), 6.5, 0.09 * s, 1.20, uTime, n);
    p += gerstner(p, normalize(vec2( 0.8,  0.6)),  3.4, 0.05 * s, 1.45, uTime, n);
    p += gerstner(p, normalize(vec2(-0.55, 0.85)), 1.6, 0.03 * s, 1.75, uTime, n);

    vWorldPos = p;
    vNormal = normalize(n);
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(p, 1.0);
  }
`;

const WATER_FRAG = /* glsl */ `
  precision highp float;
  uniform float uTime;
  uniform vec3  uSeaShallow;
  uniform vec3  uSeaDeep;
  uniform vec3  uSeaFoam;
  uniform vec3  uSunDir;
  uniform vec3  uSkyColor;        // sampled from source video each frame
  uniform vec3  uCameraPosCustom;
  uniform sampler2D uOceanNormal; // tileable Phillips-spectrum normal
  varying vec2 vUv;
  varying vec3 vNormal;
  varying vec3 vWorldPos;

  void main() {
    // Geometric normal from the Gerstner vertex displacement.
    vec3 nGeom = normalize(vNormal);

    // HIGH-FREQUENCY DETAIL — sample the tileable ocean normal map
    // twice at different scales / scroll directions, blend into the
    // geometry normal. This is what makes the surface read as real
    // water instead of plastic. World-space position drives the UVs
    // so detail stays anchored to the sea, not to the camera.
    vec2 nuv1 = vWorldPos.xz * 0.04 + vec2(uTime * 0.040, uTime * 0.030);
    vec2 nuv2 = vWorldPos.xz * 0.12 - vec2(uTime * 0.020, uTime * 0.060);
    vec3 n1 = texture2D(uOceanNormal, nuv1).rgb * 2.0 - 1.0;
    vec3 n2 = texture2D(uOceanNormal, nuv2).rgb * 2.0 - 1.0;
    // Mix big detail + small detail then perturb the geom normal.
    vec3 nDetail = normalize(n1 + n2 * 0.45);
    // Reorient normal-map (tangent-space, y up) into world space.
    // Geom normal is already nearly (0,1,0) for a horizontal water
    // plane, so we can just lift the detail's xz onto the geom n.
    vec3 n = normalize(vec3(
      nGeom.x + nDetail.x * 0.65,
      nGeom.y,
      nGeom.z + nDetail.y * 0.65
    ));

    vec3 view = normalize(uCameraPosCustom - vWorldPos);
    float NdotV = max(0.0, dot(n, view));
    float fresnel = mix(0.02, 1.0, pow(1.0 - NdotV, 5.0));

    vec3 sunDir = normalize(uSunDir);
    vec3 half_ = normalize(sunDir + view);
    float spec = pow(max(0.0, dot(n, half_)), 180.0);

    // Base water — peaks shallow, troughs deep.
    float heightT = clamp(0.5 + vWorldPos.y * 0.25, 0.0, 1.0);
    vec3 base = mix(uSeaDeep, uSeaShallow, heightT);

    // Sky reflection
    vec3 reflCol = mix(uSkyColor, vec3(1.0), 0.15);
    vec3 col = mix(base, reflCol, fresnel);

    // Sun glint (sharper + brighter with normal-map detail)
    col += vec3(1.0, 0.96, 0.86) * spec * 0.55;

    // Foam — geometry-driven crests + normal-map steepness
    float steepness = 1.0 - n.y;
    float crest = smoothstep(0.30, 0.55, steepness)
                * smoothstep(0.5, 2.0, vWorldPos.y);
    col = mix(col, uSeaFoam, crest * 0.30);

    // Sub-pixel sparkle — the normal-map ripple introduces tiny
    // bright spots when its normal aligns with the sun. Boost them
    // so the surface glitters.
    float sparkle = pow(max(0.0, dot(nDetail, sunDir.xyz)), 50.0);
    col += vec3(1.0, 0.98, 0.92) * sparkle * 0.18;

    gl_FragColor = vec4(col, 1.0);
  }
`;

export function HomeWater3DCanvas({
  videoSrc,
  videoSrcMobile,
  depthVideoSrc,
  posterSrc,
  videoAspect,
  scrubScopeRef,
  yachtDepthThreshold = 0.93,
  horizonY = 0.62,
  seaShallow = [0.32, 0.52, 0.62],
  seaDeep = [0.10, 0.22, 0.32],
  seaFoam = [0.95, 0.92, 0.86],
  sunDir = [0.55, 0.30, 0.80],
  waveScale = 1.0,
  cameraHeight = 12,
  cameraDolly = 18,
  skyColor = [0.48, 0.62, 0.74],
}: HomeWater3DCanvasProps) {
  const containerRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // ---- Video element (colour) ---------------------------------------
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
    let duration = 0;
    const onMeta = () => {
      duration = isFinite(video.duration) ? video.duration : 0;
      video.play().then(() => video.pause()).catch(() => {});
    };
    video.addEventListener("loadedmetadata", onMeta);

    // Depth video (optional)
    let depthVideo: HTMLVideoElement | null = null;
    if (depthVideoSrc) {
      depthVideo = document.createElement("video");
      depthVideo.crossOrigin = "anonymous";
      depthVideo.muted = true;
      depthVideo.loop = false;
      depthVideo.playsInline = true;
      depthVideo.autoplay = false;
      depthVideo.setAttribute("webkit-playsinline", "true");
      depthVideo.preload = "auto";
      depthVideo.src = depthVideoSrc;
      depthVideo.load();
      depthVideo.addEventListener("loadedmetadata", () => {
        depthVideo!.play().then(() => depthVideo!.pause()).catch(() => {});
      });
    }

    // ---- Renderer + scenes -------------------------------------------
    const renderer = new THREE.WebGLRenderer({
      antialias: true,
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

    // ---- PASS 1 — 3D water plane → FBO -------------------------------
    const waterScene = new THREE.Scene();
    const waterCamera = new THREE.PerspectiveCamera(50, 16 / 9, 0.5, 400);
    // Drone-shot framing: camera ~12m above water, tilted ~25° down,
    // looking forward. Tuned by eye against shorten.mov framing.
    waterCamera.position.set(0, cameraHeight, cameraDolly);
    waterCamera.lookAt(0, 0, -8);

    // 200x200 subdivisions — enough density for the Gerstner waves
    // to read smoothly without exploding the vertex count.
    const waterGeo = new THREE.PlaneGeometry(220, 320, 200, 200);
    waterGeo.rotateX(-Math.PI / 2);

    // Tileable Phillips-spectrum normal map for high-frequency
    // surface ripple. Same texture used by the 2D synth-sea route.
    const oceanNormalTex = new THREE.TextureLoader().load(
      "/sea-society/video/ocean-normal.png",
    );
    oceanNormalTex.wrapS = THREE.RepeatWrapping;
    oceanNormalTex.wrapT = THREE.RepeatWrapping;
    oceanNormalTex.minFilter = THREE.LinearMipmapLinearFilter;
    oceanNormalTex.magFilter = THREE.LinearFilter;
    oceanNormalTex.generateMipmaps = true;
    oceanNormalTex.colorSpace = THREE.NoColorSpace;

    const waterUniforms = {
      uTime: { value: 0 },
      uSeaShallow: { value: new THREE.Vector3(...seaShallow) },
      uSeaDeep: { value: new THREE.Vector3(...seaDeep) },
      uSeaFoam: { value: new THREE.Vector3(...seaFoam) },
      uSunDir: { value: new THREE.Vector3(...sunDir) },
      uSkyColor: { value: new THREE.Vector3(skyColor[0], skyColor[1], skyColor[2]) },
      uCameraPosCustom: { value: waterCamera.position.clone() },
      uOceanNormal: { value: oceanNormalTex },
      uWaveScale: { value: waveScale },
    };
    const waterMat = new THREE.ShaderMaterial({
      vertexShader: WATER_VERT,
      fragmentShader: WATER_FRAG,
      uniforms: waterUniforms,
    });
    const waterMesh = new THREE.Mesh(waterGeo, waterMat);
    waterScene.add(waterMesh);

    let waterFBO = new THREE.WebGLRenderTarget(1, 1);

    // ---- PASS 2 — composite full-screen quad -------------------------
    const compScene = new THREE.Scene();
    const compCamera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);

    const videoTex = new THREE.VideoTexture(video);
    videoTex.minFilter = THREE.LinearFilter;
    videoTex.magFilter = THREE.LinearFilter;
    videoTex.colorSpace = THREE.SRGBColorSpace;

    let depthTex: THREE.VideoTexture | null = null;
    if (depthVideo) {
      depthTex = new THREE.VideoTexture(depthVideo);
      depthTex.minFilter = THREE.LinearFilter;
      depthTex.magFilter = THREE.LinearFilter;
      depthTex.colorSpace = THREE.NoColorSpace;
    }

    const compUniforms = {
      uVideo: { value: videoTex },
      uDepth: { value: depthTex ?? videoTex },
      uWater: { value: waterFBO.texture },
      uHasDepth: { value: depthTex ? 1 : 0 },
      uYachtDepth: { value: yachtDepthThreshold },
      uHorizonY: { value: horizonY },
      uAspectScale: { value: new THREE.Vector2(1, 1) },
      uAspectStart: { value: new THREE.Vector2(0, 0) },
    };
    const compMat = new THREE.ShaderMaterial({
      vertexShader: COMPOSITE_VERT,
      fragmentShader: COMPOSITE_FRAG,
      uniforms: compUniforms,
      depthTest: false,
      depthWrite: false,
    });
    const compMesh = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), compMat);
    compScene.add(compMesh);

    // ---- Resize + cover-fit ------------------------------------------
    const resize = () => {
      const w = container.clientWidth;
      const h = container.clientHeight;
      const dpr = Math.min(window.devicePixelRatio, 1.5);
      renderer.setSize(w, h, false);
      waterCamera.aspect = w / Math.max(1, h);
      waterCamera.updateProjectionMatrix();
      // FBO at 0.75 of viewport — saves fill rate, still reads sharp.
      const fboW = Math.max(64, Math.round(w * dpr * 0.75));
      const fboH = Math.max(64, Math.round(h * dpr * 0.75));
      if (waterFBO.width !== fboW || waterFBO.height !== fboH) {
        waterFBO.dispose();
        waterFBO = new THREE.WebGLRenderTarget(fboW, fboH);
        (compUniforms.uWater.value as THREE.Texture) = waterFBO.texture;
      }
      // Cover-fit for the photo sampling
      const vpAspect = w / Math.max(1, h);
      const ar = videoAspect / vpAspect;
      if (ar < 1.0) {
        compUniforms.uAspectScale.value.set(1.0, ar);
        compUniforms.uAspectStart.value.set(0, (1 - ar) * 0.5);
      } else {
        compUniforms.uAspectScale.value.set(1 / ar, 1);
        compUniforms.uAspectStart.value.set((1 - 1 / ar) * 0.5, 0);
      }
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(container);

    let visible = !document.hidden;
    const onVis = () => { visible = !document.hidden; };
    document.addEventListener("visibilitychange", onVis);

    // ---- Scroll → currentTime ----------------------------------------
    let currentSmoothTime = 0;
    let lastSeekAt = 0;
    const SEEK_INTERVAL = 16;
    const computeProgress = () => {
      const scope = scrubScopeRef.current;
      if (!scope) return 0;
      const rect = scope.getBoundingClientRect();
      const total = Math.max(1, scope.offsetHeight - window.innerHeight);
      return Math.min(1, Math.max(0, -rect.top) / total);
    };

    const loseCtx = renderer.getContext().getExtension("WEBGL_lose_context");

    // ---- Animation loop ----------------------------------------------
    let raf = 0;
    let lastFrame = performance.now();
    let time = 0;
    const tick = () => {
      raf = requestAnimationFrame(tick);
      if (!visible) {
        lastFrame = performance.now();
        return;
      }
      const now = performance.now();
      const dt = Math.min(0.05, (now - lastFrame) / 1000);
      lastFrame = now;
      time += dt;

      // Scroll → seek both videos in lockstep
      if (duration > 0) {
        const p = computeProgress();
        const target = p * Math.max(0, duration - 0.02);
        currentSmoothTime += (target - currentSmoothTime) * 0.18;
        if (Math.abs(video.currentTime - currentSmoothTime) > 0.005 &&
            now - lastSeekAt > SEEK_INTERVAL) {
          try {
            video.currentTime = currentSmoothTime;
            if (depthVideo) depthVideo.currentTime = currentSmoothTime;
            lastSeekAt = now;
          } catch { /* not ready */ }
        }
      }

      // PASS 1 — render 3D water (sky colour now a variant constant)
      waterUniforms.uTime.value = time;
      renderer.setRenderTarget(waterFBO);
      renderer.clear();
      renderer.render(waterScene, waterCamera);
      renderer.setRenderTarget(null);

      // PASS 2 — composite
      renderer.render(compScene, compCamera);
    };
    tick();

    return () => {
      if (raf) cancelAnimationFrame(raf);
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
      waterFBO.dispose();
      waterGeo.dispose();
      waterMat.dispose();
      compMat.dispose();
      oceanNormalTex.dispose();
      videoTex.dispose();
      depthTex?.dispose();
      if (renderer.domElement.parentElement === container) {
        container.removeChild(renderer.domElement);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    videoSrc, videoSrcMobile, depthVideoSrc, posterSrc, videoAspect,
    scrubScopeRef,
    yachtDepthThreshold, horizonY,
    seaShallow[0], seaShallow[1], seaShallow[2],
    seaDeep[0], seaDeep[1], seaDeep[2],
    seaFoam[0], seaFoam[1], seaFoam[2],
    sunDir[0], sunDir[1], sunDir[2],
    skyColor[0], skyColor[1], skyColor[2],
    waveScale,
    cameraHeight,
    cameraDolly,
  ]);

  return (
    <div
      ref={containerRef}
      className="pointer-events-none absolute inset-0 z-0"
      aria-hidden
    />
  );
}
