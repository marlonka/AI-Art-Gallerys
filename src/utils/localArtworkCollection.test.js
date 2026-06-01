import { describe, expect, it } from 'vitest';
import { applyLocalArtworkCollection, createLocalArtworkCollection } from './localArtworkCollection.js';

const fixtureGallery = {
  rooms: [
    {
      id: 'room_1',
      index: 1,
      name: 'The Quiet Wall',
      nextRoom: 'room_2',
      previousRoom: null,
      artworks: [
        {
          id: 'girl_with_pearl',
          title: 'Girl with a Pearl Earring',
          artist: 'Johannes Vermeer',
          year: '1665',
          imageUrl: 'official-girl.jpg',
          description: 'Official description',
          format: 'portrait',
          position: { x: '50%', y: '43%', width: '238px', scale: 1, tilt: '-0.5deg' },
        },
        {
          id: 'starry_night_preview',
          title: 'The Starry Night',
          artist: 'Vincent van Gogh',
          year: '1889',
          imageUrl: 'official-starry-preview.jpg',
          description: 'Official description',
          format: 'landscape',
          position: { x: '49%', y: '74%', width: '160px', scale: 0.92, tilt: '-0.6deg' },
        },
      ],
    },
    {
      id: 'room_2',
      index: 2,
      name: 'Civic Theatre',
      nextRoom: null,
      previousRoom: 'room_1',
      artworks: [
        {
          id: 'night_watch',
          title: 'The Night Watch',
          artist: 'Rembrandt van Rijn',
          year: '1642',
          imageUrl: 'official-night-watch.jpg',
          description: 'Official description',
          format: 'landscape',
          position: { x: '50%', y: '48%', width: '320px', scale: 1, tilt: '-0.3deg' },
        },
      ],
    },
  ],
};

describe('local artwork collection', () => {
  it('creates local artwork records from Vite image modules', () => {
    const collection = createLocalArtworkCollection({
      '../artworks/girl_with_pearl.png': '/assets/girl.hash.png',
      '../artworks/room_2/01-Back Room Study-photorealistic.webp': '/assets/back-room.hash.webp',
      '../artworks/_originals/girl_with_pearl.png': '/assets/girl-original.hash.png',
      '../artworks/notes.txt': '/assets/notes.txt',
    });

    expect(collection).toEqual([
      expect.objectContaining({
        key: 'girl_with_pearl',
        roomKey: null,
        source: '/assets/girl.hash.png',
      }),
      expect.objectContaining({
        key: 'back_room_study',
        roomKey: 'room_2',
        title: 'Back Room Study',
        source: '/assets/back-room.hash.webp',
      }),
    ]);
  });

  it('replaces matching official images while preserving metadata', () => {
    const collection = createLocalArtworkCollection({
      '../artworks/girl_with_pearl.png': '/assets/girl.hash.png',
      '../artworks/starry_night.png': '/assets/starry.hash.png',
      '../artworks/unused_root_file.png': '/assets/unused.hash.png',
    });

    const gallery = applyLocalArtworkCollection(fixtureGallery, collection);
    const firstRoom = gallery.rooms[0];

    expect(gallery.localArtworkCount).toBe(2);

    expect(firstRoom.artworks[0]).toMatchObject({
      id: 'girl_with_pearl',
      artist: 'Johannes Vermeer',
      imageUrl: '/assets/girl.hash.png',
      localImagePath: 'girl_with_pearl.png',
    });

    expect(firstRoom.artworks[1]).toMatchObject({
      id: 'starry_night_preview',
      imageUrl: '/assets/starry.hash.png',
    });
  });

  it('lets room-specific images override shared images and adds unmatched room files', () => {
    const collection = createLocalArtworkCollection({
      '../artworks/night_watch.png': '/assets/night-shared.png',
      '../artworks/room_2/night_watch.png': '/assets/night-room.png',
      '../artworks/room_2/02-Captain Doorway Study.jpg': '/assets/doorway.jpg',
    });

    const gallery = applyLocalArtworkCollection(fixtureGallery, collection);
    const secondRoom = gallery.rooms[1];

    expect(gallery.localArtworkCount).toBe(2);
    expect(secondRoom.artworks[0].imageUrl).toBe('/assets/night-room.png');
    expect(secondRoom.artworks[1]).toMatchObject({
      id: 'local_room_2_captain_doorway',
      title: 'Captain Doorway Study',
      artist: 'Photorealistic AI Study',
      imageUrl: '/assets/doorway.jpg',
    });
  });
});
