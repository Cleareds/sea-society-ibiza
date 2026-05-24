---
name: Azure Mediterranean
colors:
  surface: '#fcf9f8'
  surface-dim: '#dcd9d9'
  surface-bright: '#fcf9f8'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f6f3f2'
  surface-container: '#f0eded'
  surface-container-high: '#eae7e7'
  surface-container-highest: '#e5e2e1'
  on-surface: '#1c1b1b'
  on-surface-variant: '#3e4949'
  inverse-surface: '#313030'
  inverse-on-surface: '#f3f0ef'
  outline: '#6e7979'
  outline-variant: '#bdc9c8'
  surface-tint: '#006a6a'
  primary: '#006565'
  on-primary: '#ffffff'
  primary-container: '#008080'
  on-primary-container: '#e3fffe'
  inverse-primary: '#76d6d5'
  secondary: '#bc0100'
  on-secondary: '#ffffff'
  secondary-container: '#eb0000'
  on-secondary-container: '#fffbff'
  tertiary: '#5a5a58'
  on-tertiary: '#ffffff'
  tertiary-container: '#727371'
  on-tertiary-container: '#faf9f6'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#93f2f2'
  primary-fixed-dim: '#76d6d5'
  on-primary-fixed: '#002020'
  on-primary-fixed-variant: '#004f4f'
  secondary-fixed: '#ffdad4'
  secondary-fixed-dim: '#ffb4a8'
  on-secondary-fixed: '#410000'
  on-secondary-fixed-variant: '#930100'
  tertiary-fixed: '#e3e2e0'
  tertiary-fixed-dim: '#c7c6c4'
  on-tertiary-fixed: '#1a1c1a'
  on-tertiary-fixed-variant: '#464745'
  background: '#fcf9f8'
  on-background: '#1c1b1b'
  surface-variant: '#e5e2e1'
typography:
  display-lg:
    fontFamily: Playfair Display
    fontSize: 84px
    fontWeight: '700'
    lineHeight: 92px
    letterSpacing: -0.02em
  display-lg-mobile:
    fontFamily: Playfair Display
    fontSize: 48px
    fontWeight: '700'
    lineHeight: 54px
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Playfair Display
    fontSize: 48px
    fontWeight: '600'
    lineHeight: 56px
  headline-md:
    fontFamily: Playfair Display
    fontSize: 32px
    fontWeight: '600'
    lineHeight: 40px
  body-lg:
    fontFamily: Manrope
    fontSize: 18px
    fontWeight: '400'
    lineHeight: 30px
  body-md:
    fontFamily: Manrope
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 26px
  label-lg:
    fontFamily: Manrope
    fontSize: 14px
    fontWeight: '600'
    lineHeight: 20px
    letterSpacing: 0.1em
  label-sm:
    fontFamily: Manrope
    fontSize: 12px
    fontWeight: '700'
    lineHeight: 16px
    letterSpacing: 0.05em
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  container-max: 1440px
  gutter: 24px
  margin-desktop: 80px
  margin-tablet: 40px
  margin-mobile: 20px
  section-gap: 160px
---

## Brand & Style

The design system for this product is rooted in the "Azure Mediterranean" philosophy—a blend of high-end luxury and organic warmth. It targets an affluent, global audience seeking exclusive lifestyle experiences. The emotional response is one of aspiration, serenity, and immediate sensory immersion in the Ibiza sun.

The visual style is **Luxurious Minimalism** with **Organic Accents**. It relies on vast whitespace to symbolize the openness of the sea, while using high-contrast typography and vibrant red accents to provide a modern, fashion-forward edge. Elements should feel premium but never sterile; the use of full-screen media and subtle parallax hints ensures a dynamic, breathing interface that mirrors the movement of the water.

## Colors

The palette captures the essential elements of the Balearic landscape. 

- **Off-white (#FAF9F6):** Used as the primary canvas for all backgrounds, providing a warm, sun-bleached feel that is softer and more premium than pure white.
- **Deep Turquoise (#008080):** Represents the depth and clarity of the Mediterranean. Used for primary UI elements, secondary buttons, and decorative separators.
- **Vibrant Red (#FF0000):** A bold, high-fashion accent color used sparingly for calls-to-action (CTAs) and critical information to create immediate visual impact against the turquoise.
- **Neutral (#1A1A1A):** A soft, deep charcoal used exclusively for body text and primary headings to maintain legibility without the harshness of pure black.

## Typography

The typography system pairs classic editorial elegance with modern functional clarity. 

**Playfair Display** is used for all headings and display text. Its high-contrast strokes and traditional serifs evoke heritage and luxury. It should be used with generous leading and tight letter-spacing for large titles.

**Manrope** provides a clean, contemporary balance for body copy and technical details. Its geometric but open letterforms ensure high readability on mobile devices. 

All labels and captions should utilize uppercase styling with increased letter spacing to create a sense of "planned design" and architectural structure.

## Layout & Spacing

This design system utilizes a **Fluid Grid** with oversized margins to create an "editorial gallery" feel. 

- **Desktop (12 columns):** Heavy use of offset layouts where imagery and text overlap slightly. Section transitions should be spacious (160px+) to allow the content to breathe.
- **Mobile (4 columns):** Content reflows into a single column, but maintains a "full-bleed" approach for imagery to maximize visual impact on small screens.
- **Rhythm:** Spacing follows a base-8 unit, but is applied aggressively. Don't be afraid of "empty" sections; the whitespace is a luxury asset.

## Elevation & Depth

To maintain an organic and "sunny" feel, traditional heavy shadows are avoided. Instead, depth is conveyed through:

- **Tonal Layers:** Using the off-white background against semi-transparent turquoise overlays.
- **Soft Ambient Depth:** Boat listing cards use extremely diffused, low-opacity shadows (Color: Turquoise mixed with Neutral, 5% opacity) to create a subtle lift that feels like it's floating on water.
- **Parallax Layers:** Background images move at a slower scroll speed than foreground text, creating a physical sense of environment without needing drop shadows.
- **Glassmorphism:** Navigation bars and sticky "Book via WhatsApp" bars use a 20px backdrop blur with a 70% opacity off-white tint.

## Shapes

The shape language is **Softly Rounded**. Sharp edges are avoided to mimic natural Mediterranean forms like pebbles, hulls, and waves. 

Standard components (Cards, Inputs) utilize a 0.5rem (8px) radius. Larger containers or featured imagery can scale up to 1.5rem (24px) for a more "lifestyle" feel. CTAs and "Book" buttons should always be fully pill-shaped to stand out from the structural elements of the page.

## Components

### Buttons & CTAs
- **Primary CTA (Book via WhatsApp):** High-vibrancy Red (#FF0000) background, white text, pill-shaped. Always includes a small WhatsApp icon. On mobile, this is a sticky bottom bar.
- **Secondary Button:** Deep Turquoise outline with turquoise text. No fill, pill-shaped.
- **Ghost Button:** Text-only with an underline that expands on hover.

### Listing Cards
Boat listings feature full-bleed imagery with a bottom-aligned overlay. The boat name is in Playfair Display, while specs (length, capacity) are in Manrope Label-sm. A subtle zoom effect on the image occurs on hover.

### Elegant Forms
Inputs use a "floating label" style with only a bottom border (1px Deep Turquoise). On focus, the border thickness increases to 2px. All form fields use the Off-white background to blend seamlessly.

### Chips & Badges
Used for boat features (e.g., "New for 2024"). Small, pill-shaped with Turquoise background and white text.

### Interactive Lists
Specifications and inclusions are displayed in a clean list with custom Turquoise "wave" bullets instead of standard dots.