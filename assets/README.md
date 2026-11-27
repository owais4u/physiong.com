# Shared assets

Use this directory for brand and product assets that are shared across applications or documentation.

```text
assets/
├── logos/       # Product and brand logos
├── images/      # Product imagery, illustrations, and screenshots
├── banners/     # Marketing and in-app banners
└── icons/       # Custom icons and small graphics
```

## Guidelines

- Keep source files in the most relevant category and use descriptive, lowercase, hyphenated filenames.
- Prefer SVG for clean vector logos and icons; use PNG for transparent raster graphics and JPEG/WebP for photographic images. Keep the supplied source format when conversion could reduce quality.
- Include dimensions or intended use in filenames only when a specific size is required, such as `homepage-hero-1600x600.webp`.
- Record the source, creator, and usage rights for third-party assets before adding them. Do not commit assets with unclear licensing.
- Keep app-specific assets alongside the app when they are not shared; use this root folder for shared brand assets.

## Current brand assets

- [PhysioNG logo](logos/physiong-logo.jpeg) — supplied logo image, JPEG, 1290 × 1291 px.

## Current stock photography

- [Physiotherapy assessment](images/physiotherapy-assessment.jpg) — image by [Neuro Equilibrium](https://unsplash.com/photos/doctor-assisting-patient-on-a-scale-U0BBvZjCeOQ), free under the [Unsplash License](https://unsplash.com/license).
- [Clinic treatment room](images/clinic-treatment-room.jpg) — image by [Nightingale Home nurse](https://unsplash.com/photos/black-and-white-massage-bed-4e017fuMeXE), free under the [Unsplash License](https://unsplash.com/license).

The MVP web app serves optimized copies from `apps/web/public/images/` for local image delivery.
