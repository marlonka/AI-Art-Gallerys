# De Kamer

A spatial Dutch Masters gallery built with React, Vite, and CSS 3D transforms. The gallery uses DOM elements, perspective, doorway navigation, and JSON-driven artwork placement instead of WebGL.

## Run Locally

```bash
npm install
npm run dev
```

## Add New Artwork Images

Use either local files or remote image URLs.

### Option 1: Local Images

1. Put the image in:

```text
public/assets/artworks/
```

2. Reference it from `src/data/gallery.js` like this:

```js
{
  id: 'my_artwork',
  title: 'Artwork Title',
  artist: 'Artist Name',
  year: '1665',
  imageUrl: '/assets/artworks/my-artwork.jpg',
  description: 'Short museum-style description.',
  format: 'portrait', // portrait, landscape, or square
  position: { x: '50%', y: '43%', width: '238px', scale: 1, tilt: '-0.5deg' },
}
```

### Option 2: Remote Images

Paste the direct image URL into `imageUrl`:

```js
imageUrl: 'https://example.com/artwork.jpg'
```

For best results, use images around `900px` to `1400px` wide. Huge originals slow the room down, and tiny images look weak in the frames.

## Artwork Placement

Each artwork has a `position` object:

- `x`: horizontal wall position
- `y`: vertical wall position
- `width`: frame width
- `scale`: final scale multiplier
- `tilt`: small rotation for salon-style hanging

Set `featured: true` on one artwork per room to give it the large hero frame and hover inspect marker.
