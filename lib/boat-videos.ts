/**
 * Slug → hero video assets for the boats with shipped footage. Lives
 * outside the boat data source so it applies regardless of whether
 * boats come from the dummy file or Supabase.
 *
 * Each entry references a forward-only mp4 at two resolutions plus a
 * first-frame poster used as the LCP image and the <video poster>
 * fallback. Encoded by scripts/encode-yacht-videos.sh (first 9) and
 * scripts/encode-yacht-videos-batch2.sh (the rest).
 */
export interface BoatVideo {
  src1080: string;
  src720: string;
  poster: string;
}

const BASE = "/sea-society/yacht-videos";

const VIDEOS: Record<string, BoatVideo> = {
  "ariyas-sunseeker-predator-84": {
    src1080: `${BASE}/ariyas-loop.mp4`,
    src720: `${BASE}/ariyas-loop-720.mp4`,
    poster: `${BASE}/ariyas-poster.webp`,
  },
  "belisa-mangusta-108": {
    src1080: `${BASE}/belisa-loop.mp4`,
    src720: `${BASE}/belisa-loop-720.mp4`,
    poster: `${BASE}/belisa-poster.webp`,
  },
  "chloe-princess-v58": {
    src1080: `${BASE}/chloe-loop.mp4`,
    src720: `${BASE}/chloe-loop-720.mp4`,
    poster: `${BASE}/chloe-poster.webp`,
  },
  "dr-no-pershing-6x": {
    src1080: `${BASE}/dr-no-loop.mp4`,
    src720: `${BASE}/dr-no-loop-720.mp4`,
    poster: `${BASE}/dr-no-poster.webp`,
  },
  "ella-riva-argo-90": {
    src1080: `${BASE}/ella-loop.mp4`,
    src720: `${BASE}/ella-loop-720.mp4`,
    poster: `${BASE}/ella-poster.webp`,
  },
  "eternity-44-arcadia-85": {
    src1080: `${BASE}/eternity-loop.mp4`,
    src720: `${BASE}/eternity-loop-720.mp4`,
    poster: `${BASE}/eternity-poster.webp`,
  },
  "georgia-sunseeker-predator-82": {
    src1080: `${BASE}/georgia-loop.mp4`,
    src720: `${BASE}/georgia-loop-720.mp4`,
    poster: `${BASE}/georgia-poster.webp`,
  },
  "inspiration-pershing-90": {
    src1080: `${BASE}/inspiration-loop.mp4`,
    src720: `${BASE}/inspiration-loop-720.mp4`,
    poster: `${BASE}/inspiration-poster.webp`,
  },
  "invictus-riva-rivale-52": {
    src1080: `${BASE}/invictus-loop.mp4`,
    src720: `${BASE}/invictus-loop-720.mp4`,
    poster: `${BASE}/invictus-poster.webp`,
  },
  "majestic-vandutch-40": {
    src1080: `${BASE}/majestic-loop.mp4`,
    src720: `${BASE}/majestic-loop-720.mp4`,
    poster: `${BASE}/majestic-poster.webp`,
  },
  "manbero-ii-princess-v53": {
    src1080: `${BASE}/manbero-loop.mp4`,
    src720: `${BASE}/manbero-loop-720.mp4`,
    poster: `${BASE}/manbero-poster.webp`,
  },
  "mazu-astondoa-80": {
    src1080: `${BASE}/mazu-loop.mp4`,
    src720: `${BASE}/mazu-loop-720.mp4`,
    poster: `${BASE}/mazu-poster.webp`,
  },
  "number-9-sunseeker-predator-72": {
    src1080: `${BASE}/number-9-loop.mp4`,
    src720: `${BASE}/number-9-loop-720.mp4`,
    poster: `${BASE}/number-9-poster.webp`,
  },
  "ruby-tuesday-princess-v72": {
    src1080: `${BASE}/ruby-loop.mp4`,
    src720: `${BASE}/ruby-loop-720.mp4`,
    poster: `${BASE}/ruby-poster.webp`,
  },
  "sensation-pershing-72": {
    src1080: `${BASE}/sensation-loop.mp4`,
    src720: `${BASE}/sensation-loop-720.mp4`,
    poster: `${BASE}/sensation-poster.webp`,
  },
  "tranquility-iii-sunseeker-predator-68": {
    src1080: `${BASE}/tranquility-loop.mp4`,
    src720: `${BASE}/tranquility-loop-720.mp4`,
    poster: `${BASE}/tranquility-poster.webp`,
  },
  "yolo-sunreef-70": {
    src1080: `${BASE}/yolo-loop.mp4`,
    src720: `${BASE}/yolo-loop-720.mp4`,
    poster: `${BASE}/yolo-poster.webp`,
  },
};

export function boatVideoForSlug(slug: string): BoatVideo | undefined {
  return VIDEOS[slug];
}
