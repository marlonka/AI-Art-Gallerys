# Architecture

Inner AIye is a Vite and React single-page app that renders a spatial museum without WebGL. The gallery uses semantic HTML, CSS 3D transforms, localized data, and local image discovery to keep the experience fast and portable.

## System Shape

- `src/main.jsx` owns the rendered application and interaction flow.
- `src/styles.css` contains the visual system, responsive layout, spatial transitions, and gallery choreography.
- `src/data/gallery.js` defines curated rooms, artwork metadata, placement, and fallback image URLs.
- `src/data/i18n.js` centralizes German and English interface copy.
- `src/utils/galleryState.js` contains navigation and state helpers.
- `src/utils/localArtworkCollection.js` discovers local artwork files with Vite glob imports and matches them to curated entries.
- `src/artworks/` stores optimized local artwork assets.
- `scripts/optimize-artworks.mjs` converts PNG/JPG sources to WebP and archives originals.
- `scripts/smoke-browser.mjs` runs a Playwright smoke test against a production preview.

## Design Constraints

The app intentionally avoids runtime network dependencies for fonts and imagery in the production path. This protects privacy, makes deployments predictable, and keeps the gallery resilient when embedded or hosted on simple static infrastructure.

Gallery data is curated separately from local artwork discovery. That lets contributors replace images by filename without rewriting room structure, copy, or frame placement.

## Testing Strategy

- Unit tests cover deterministic gallery state, localization, production data shape, and local artwork matching.
- ESLint guards JavaScript, React hooks, and accessibility rules.
- `npm run build` catches Vite bundling and asset resolution failures.
- `npm run test:browser` is a maintainer smoke test for interaction, localization, offline asset behavior, and key responsive assumptions.

## Deployment

The app builds to static files in `dist/`:

```bash
npm run build
```

Any static host can serve the output. Keep generated deployment archives out of source control unless a release process explicitly requires them.
