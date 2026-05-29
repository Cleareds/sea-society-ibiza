"""
Generate a tileable ocean normal map using a Phillips wave spectrum.

This is the standard Tessendorf-2001 FFT approach: build a complex
amplitude grid weighted by the Phillips spectrum, inverse-FFT to get a
real-valued height field that wraps seamlessly. Compute gradients,
encode as RGB normals.

Output: public/sea-society/video/ocean-normal.png (1024×1024 RGB)
"""
from __future__ import annotations
import numpy as np
from PIL import Image
from pathlib import Path

OUT = Path("public/sea-society/video/ocean-normal.png")
OUT.parent.mkdir(parents=True, exist_ok=True)


def phillips_spectrum(N: int, L_patch: float, wind: np.ndarray,
                     wind_speed: float, A: float) -> np.ndarray:
    """Phillips P(k) = A · exp(-1/(k·L)²) / k⁴ · |k̂·ŵ|², damped
    at small wavelengths."""
    g = 9.81
    L_p = (wind_speed * wind_speed) / g

    # Wavenumber grid — DC at index 0 (numpy fft convention)
    kx = np.fft.fftfreq(N, d=L_patch / N) * 2.0 * np.pi
    ky = np.fft.fftfreq(N, d=L_patch / N) * 2.0 * np.pi
    KX, KY = np.meshgrid(kx, ky, indexing="xy")
    K2 = KX * KX + KY * KY
    K = np.sqrt(K2)
    K_safe = np.where(K == 0, 1.0, K)   # avoid /0 at DC

    wind_unit = wind / np.linalg.norm(wind)
    k_dot_w = (KX * wind_unit[0] + KY * wind_unit[1]) / K_safe
    k_dot_w = np.clip(k_dot_w, -1.0, 1.0)

    # Main spectrum
    P = (
        A * np.exp(-1.0 / np.maximum(1e-9, K * L_p) ** 2)
        / np.maximum(1e-9, K ** 4)
        * (k_dot_w ** 2)
    )
    # Small-wavelength damping (Tessendorf)
    small_l = L_p / 1000.0
    P *= np.exp(-K2 * small_l ** 2)

    P[0, 0] = 0.0   # zero DC
    return P


def gen_height(N: int, L_patch: float = 100.0, wind_speed: float = 12.0,
               seed: int = 42) -> np.ndarray:
    rng = np.random.default_rng(seed)
    wind = np.array([1.0, 0.5], dtype=np.float64)
    P = phillips_spectrum(N, L_patch, wind, wind_speed, A=0.0015)

    # Random complex amplitudes drawn from N(0,1) + i N(0,1)
    real = rng.standard_normal((N, N))
    imag = rng.standard_normal((N, N))
    h0 = (real + 1j * imag) * np.sqrt(P / 2.0)

    # Inverse FFT → real-valued, tileable height field
    h = np.fft.ifft2(h0).real

    # Center on zero, scale to ±1
    h -= h.mean()
    p99 = np.percentile(np.abs(h), 99)
    if p99 > 0:
        h /= p99
    h = np.clip(h, -1.0, 1.0)
    return h


def height_to_normal(h: np.ndarray, strength: float = 1.8) -> np.ndarray:
    """Compute per-pixel surface normal from height. strength controls
    how 'bumpy' the normal map looks — higher = more pronounced."""
    # Use np.gradient with wrap-around for true tileability
    dy = np.roll(h, -1, axis=0) - np.roll(h, 1, axis=0)
    dx = np.roll(h, -1, axis=1) - np.roll(h, 1, axis=1)
    nx = -dx * strength
    ny = -dy * strength
    nz = np.ones_like(nx)
    length = np.sqrt(nx * nx + ny * ny + nz * nz)
    nx /= length
    ny /= length
    nz /= length
    return np.stack([nx, ny, nz], axis=-1)


def normal_to_rgb(n: np.ndarray) -> np.ndarray:
    """[-1,1] → [0,255]. Standard OpenGL convention: R=x, G=y, B=z."""
    rgb = (n + 1.0) * 0.5 * 255.0
    return np.clip(rgb, 0, 255).astype(np.uint8)


if __name__ == "__main__":
    N = 1024
    print(f"generating Phillips height field {N}x{N}…")
    h = gen_height(N, L_patch=80.0, wind_speed=11.0, seed=42)
    print(f"  range: [{h.min():.3f}, {h.max():.3f}]")

    print("converting to normals…")
    n = height_to_normal(h, strength=2.4)

    rgb = normal_to_rgb(n)
    Image.fromarray(rgb, mode="RGB").save(OUT, optimize=True)
    sz = OUT.stat().st_size / 1024
    print(f"wrote {OUT} ({sz:.1f} KB)")
