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
    sunDir: [0.55, 0.30, 0.80],
    skyColor: [0.48, 0.62, 0.74],
    waveScale: 1.15,
    cameraHeight: 12,
    cameraDolly: 18,
  },
];
