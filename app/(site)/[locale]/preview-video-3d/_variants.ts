/**
 * 3D water hero variants — side-by-side comparison of light, colour
 * and camera angle. All share the same source (shorten.mov + DA-V2
 * vitl-518 depth); only the synthetic-sea palette + sun direction +
 * camera geometry change.
 */

export interface SeaVariant {
  slug: string;
  tag: string;
  shallow: [number, number, number];
  deep: [number, number, number];
  foam: [number, number, number];
  sunDir: [number, number, number];   // approximate world-space sun
  skyColor: [number, number, number]; // reflection / Fresnel tint
  waveScale: number;                  // amplitude multiplier
  cameraHeight: number;               // drone altitude in shader units
  cameraDolly: number;                // pull-back from origin
}

export const variants: SeaVariant[] = [
  {
    slug: "open-sea",
    tag: "Evening · side-low sun",
    shallow: [0.32, 0.52, 0.62],
    deep: [0.05, 0.15, 0.24],
    foam: [0.95, 0.92, 0.86],
    sunDir: [0.55, 0.30, 0.80],   // side-low warm sun
    skyColor: [0.48, 0.62, 0.74], // evening blue
    waveScale: 1.15,              // a touch more active than default
    cameraHeight: 12,
    cameraDolly: 18,
  },
  {
    slug: "golden-hour",
    tag: "Golden hour · warm low sun",
    shallow: [0.42, 0.50, 0.55],   // warmer / slightly desaturated
    deep: [0.10, 0.16, 0.22],
    foam: [1.00, 0.92, 0.78],      // warmer foam highlights
    sunDir: [0.75, 0.18, 0.60],    // lower + further to one side
    skyColor: [0.78, 0.65, 0.50],  // golden warm sky tint
    waveScale: 1.05,
    cameraHeight: 11,              // slightly lower drone
    cameraDolly: 19,
  },
  {
    slug: "midday",
    tag: "Midday · overhead sun, turquoise",
    shallow: [0.38, 0.72, 0.82],   // bright turquoise
    deep: [0.05, 0.22, 0.30],
    foam: [0.98, 1.00, 1.00],      // crisp white foam
    sunDir: [0.10, 0.85, 0.50],    // nearly overhead
    skyColor: [0.55, 0.78, 0.92],  // bright daytime blue
    waveScale: 1.20,               // a bit choppier midday
    cameraHeight: 14,              // higher drone
    cameraDolly: 16,
  },
  {
    slug: "dawn",
    tag: "Dawn · cool blue, calm",
    shallow: [0.28, 0.42, 0.56],
    deep: [0.04, 0.10, 0.18],
    foam: [0.90, 0.94, 1.00],      // cool foam
    sunDir: [0.30, 0.15, 0.90],    // low + back-lit
    skyColor: [0.42, 0.55, 0.72],  // soft cool morning
    waveScale: 0.85,               // calmest variant
    cameraHeight: 12,
    cameraDolly: 20,               // pulled back a touch for stillness
  },
];
