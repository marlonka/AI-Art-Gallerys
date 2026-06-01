import { describe, expect, it } from 'vitest';
import { gallery } from '../data/gallery.js';
import {
  findArtwork,
  getAdjacentArtworkId,
  getAdjacentRoomId,
  getInitialRoomId,
  getRoomById,
} from './galleryState.js';

describe('gallery state helpers', () => {
  it('returns the first room as the initial room', () => {
    expect(getInitialRoomId(gallery)).toBe('room_1');
  });

  it('resolves adjacent room ids in a circular gallery loop', () => {
    expect(getAdjacentRoomId(gallery, 'room_1', 'next')).toBe('room_2');
    expect(getAdjacentRoomId(gallery, 'room_1', 'previous')).toBe('room_5');
    expect(getAdjacentRoomId(gallery, 'room_2', 'previous')).toBe('room_1');
    expect(getAdjacentRoomId(gallery, 'room_3', 'next')).toBe('room_4');
    expect(getAdjacentRoomId(gallery, 'room_4', 'next')).toBe('room_5');
    expect(getAdjacentRoomId(gallery, 'room_5', 'next')).toBe('room_1');
  });

  it('finds artworks across all rooms', () => {
    expect(findArtwork(gallery, 'mona_lisa')?.artist).toBe('Leonardo da Vinci');
    expect(findArtwork(gallery, 'the_scream')?.artist).toBe('Edvard Munch');
    expect(findArtwork(gallery, 'missing')).toBeNull();
  });

  it('resolves adjacent artwork ids inside the current room loop', () => {
    const firstRoom = getRoomById(gallery, 'room_1');

    expect(getAdjacentArtworkId(firstRoom, 'mona_lisa', 'next')).toBe('girl_with_pearl');
    expect(getAdjacentArtworkId(firstRoom, 'mona_lisa', 'previous')).toBe('a_bar_at_the_folies_bergere');
    expect(getAdjacentArtworkId(firstRoom, 'missing', 'next')).toBeNull();
  });

  it('throws for invalid room or navigation direction', () => {
    expect(() => getRoomById(gallery, 'missing')).toThrow('Unknown room');
    expect(() => getAdjacentRoomId(gallery, 'room_1', 'sideways')).toThrow('Unknown navigation direction');
    expect(() => getAdjacentArtworkId(getRoomById(gallery, 'room_1'), 'mona_lisa', 'sideways')).toThrow(
      'Unknown artwork navigation direction',
    );
  });
});
