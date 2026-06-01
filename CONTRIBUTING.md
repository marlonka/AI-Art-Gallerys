# Contributing

Inner AIye is a design-led React gallery. Contributions should protect the feeling of the product: spatial, fast, tactile, accessible, and visually intentional.

## Local Setup

```bash
npm install
npm run dev
```

Use Node.js 20.19 or newer. The CI workflow currently verifies on Node.js 22.

## Quality Bar

Before opening a pull request, run:

```bash
npm run lint
npm test
npm run build
```

For interaction-heavy changes, also do a manual browser pass across desktop and mobile widths. The repository includes `npm run test:browser` for maintainers who want an automated smoke pass, but visual judgment still matters.

## Design Principles

- Build the actual gallery experience, not a marketing wrapper around it.
- Keep UI copy short, concrete, and emotionally precise.
- Make motion feel physical: it should have weight, friction, and purpose.
- Prefer local, optimized assets over remote runtime dependencies.
- Preserve keyboard access, semantic labels, and readable contrast.
- Avoid generic dashboard patterns when the gallery needs atmosphere and spatial intent.

## Artwork Contributions

Add generated or replacement artwork files under `src/artworks/`. Prefer `.webp` between 1200px and 1800px wide.

Run this after adding PNG or JPG sources:

```bash
npm run optimize:artworks
```

Use public-domain source references and document any unusual provenance in the pull request. By contributing artwork assets to this repository, you agree they can be distributed under the MIT license unless a file says otherwise.

## Pull Requests

Keep pull requests focused. Include:

- what changed
- why it matters for visitors
- how you verified it
- screenshots or recordings for visual changes

If a change affects gallery data, room choreography, image matching, localization, or legal/privacy copy, call that out explicitly.
