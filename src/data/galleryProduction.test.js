import { describe, expect, it } from 'vitest';
import { gallery } from './gallery.js';

function getAllArtworks() {
  return gallery.rooms.flatMap((room) => room.artworks.map((artwork) => ({ room, artwork })));
}

describe('production gallery data', () => {
  it('renders artwork images from local bundled assets only', () => {
    const remoteImages = getAllArtworks()
      .filter(({ artwork }) => /^https?:\/\//i.test(artwork.imageUrl))
      .map(({ room, artwork }) => `${room.id}/${artwork.id}`);

    expect(remoteImages).toEqual([]);
  });

  it('keeps source and AI disclosure metadata on every artwork', () => {
    for (const { artwork } of getAllArtworks()) {
      expect(artwork.aiDisclosure).toBe('Photoreal Study / AI reinterpretation');
      expect(artwork.sourceWork).toMatchObject({
        provider: expect.any(String),
        rights: expect.any(String),
        sourceUrl: expect.any(String),
      });
      expect(artwork.sourceWork.sourceUrl).not.toMatch(/^https?:\/\//i);
    }
  });
});
