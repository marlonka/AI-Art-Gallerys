# Inner AIye

A spatial React gallery for photoreal reinterpretations of public-domain masterpieces. Inner AIye turns a browser window into a quiet museum: doorway navigation, tactile artwork inspection, localized copy, and data-driven salon placement built with Vite, React, and CSS 3D transforms instead of WebGL.

[![CI](https://github.com/marlonka/AI-Art-Gallerys/actions/workflows/ci.yml/badge.svg)](https://github.com/marlonka/AI-Art-Gallerys/actions/workflows/ci.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

## Why It Exists

Most AI art demos feel like prompt catalogs. Inner AIye treats generated reinterpretations as an actual gallery visit: paced, spatial, readable, and emotionally specific. The product goal is simple: make the visitor feel invited to look longer.

## Highlights

- Spatial multi-room gallery rendered with React and CSS transforms.
- German-first experience with English localization.
- Keyboard-friendly artwork inspection and room navigation.
- Local artwork auto-discovery through Vite glob imports.
- Fallback museum images for curated entries that do not have local replacements yet.
- Offline-friendly production path with no remote font or image dependency in the smoke test.
- Focused lint, unit, build, and CI workflow.

## Tech Stack

- React 19
- Vite 7
- Vitest
- ESLint flat config with React Hooks and JSX a11y rules
- Playwright smoke test for maintainers
- Sharp-based artwork optimization

## Quick Start

```bash
npm install
npm run dev
```

Open the local Vite URL printed by the terminal.

Use Node.js 20.19 or newer. CI verifies on Node.js 22.

## Scripts

```bash
npm run dev                # Start local development server
npm run lint               # Run ESLint
npm test                   # Run unit tests
npm run build              # Build static production files
npm run optimize:artworks  # Convert PNG/JPG artwork sources to WebP
npm run test:browser       # Run Playwright production smoke test
npm run verify             # Full local verification, including browser smoke test
npm run verify:ci          # CI-safe lint, unit test, and build pass
```

## Project Structure

```text
src/
  artworks/        Optimized local artwork assets
  data/            Gallery rooms, artwork metadata, and localization
  utils/           Deterministic gallery and asset-matching helpers
  main.jsx         Application shell and interaction flow
  styles.css       Visual system, spatial layout, and responsive behavior
scripts/           Asset optimization and smoke-test tooling
docs/              Architecture and maintainer notes
public/            Static icons and shared public assets
```

See [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md) for the system map.

## Curated Gallery

The current salon is organized into five rooms:

- `room_1` / Faces That Watch Back: `mona_lisa`, `girl_with_pearl`, `arnolfini_portrait`, `american_gothic`, `whistlers_mother`, `a_bar_at_the_folies_bergere`
- `room_2` / Weather, Water, Night: `starry_night`, `cafe_terrace_at_night`, `water_lilies_japanese_bridge`, `impression_sunrise`, `great_wave_off_kanagawa`, `wanderer_above_the_sea_of_fog`
- `room_3` / Myth, Theatre, Shock: `birth_of_venus`, `las_meninas`, `the_kiss`, `the_scream`, `liberty_leading_the_people`, `raft_of_the_medusa`
- `room_4` / The World as Scene: `paris_street_rainy_day`, `la_grande_jatte`, `luncheon_of_the_boating_party`, `the_ballet_class`, `the_floor_scrapers`, `boulevard_saint_denis_paris`
- `room_5` / Color, Weather, Matter: `the_artists_garden_at_vetheuil`, `sunflowers`, `irises`, `snow_at_louveciennes`, `the_basket_of_apples`, `tiger_in_a_tropical_storm`

## Artwork Workflow

Drop generated artwork images into `src/artworks/`. Vite scans this folder at dev/build time and the app automatically uses matching files without editing `src/data/gallery.js`.

Use the artwork id or title as the filename:

```text
src/artworks/
  mona_lisa.webp
  girl_with_pearl.webp
  starry_night.webp
  birth_of_venus.webp
```

Room subfolders are optional:

```text
src/artworks/
  room_1/
    mona_lisa.webp
    01-extra-portrait-study.webp
  room_2/
    great_wave_off_kanagawa.webp
```

Supported formats are `.webp`, `.avif`, `.png`, `.jpg`, `.jpeg`, and `.gif`. Prefer WebP for production uploads.

Matching is forgiving:

- `girl_with_pearl.webp` matches `girl_with_pearl`
- `Girl with a Pearl Earring.webp` matches the title
- Prefixes like `01-` and suffixes like `-photorealistic` are ignored

If a room-scoped file does not match an existing artwork, it appears as a generated study with an automatic frame position.

For best results, use WebP images around 1200px to 1800px wide. Huge originals slow the room down, and tiny images weaken the frame.

## Manual Artwork Entries

Add fully curated entries in `src/data/gallery.js` when you need exact placement, copy, or a remote fallback URL:

```js
{
  id: 'my_artwork',
  title: 'Artwork Title',
  artist: 'Artist Name',
  year: '1889',
  imageUrl: '/assets/artworks/my-artwork.webp',
  description: 'Short museum-style description.',
  format: 'portrait',
  position: { x: '50%', y: '43%', width: '238px', scale: 1, tilt: '-0.5deg' },
}
```

Each artwork has a `position` object:

- `x`: horizontal wall position
- `y`: vertical wall position
- `width`: frame width
- `scale`: final scale multiplier
- `tilt`: small rotation for salon-style hanging

Set `featured: true` on one artwork per room to give it the large hero frame and hover inspect marker.

## Contributing

Read [`CONTRIBUTING.md`](CONTRIBUTING.md) before opening a pull request. Visual changes should include screenshots or recordings, plus notes on desktop and mobile behavior.

## License

MIT. See [`LICENSE`](LICENSE).
