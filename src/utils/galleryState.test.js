import { describe, expect, it } from 'vitest';
import { gallery } from '../data/gallery.js';
import { findArtwork, getAdjacentRoomId, getInitialRoomId, getRoomById } from './galleryState.js';

describe('gallery state helpers', () => {
  it('returns the first room as the initial room', () => {
    expect(getInitialRoomId(gallery)).toBe('room_1');
  });

  it('resolves adjacent room ids by direction', () => {
    expect(getAdjacentRoomId(gallery, 'room_1', 'next')).toBe('room_2');
    expect(getAdjacentRoomId(gallery, 'room_2', 'previous')).toBe('room_1');
    expect(getAdjacentRoomId(gallery, 'room_3', 'next')).toBeNull();
  });

  it('finds artworks across all rooms', () => {
    expect(findArtwork(gallery, 'night_watch')?.artist).toBe('Rembrandt van Rijn');
    expect(findArtwork(gallery, 'missing')).toBeNull();
  });

  it('throws for invalid room or navigation direction', () => {
    expect(() => getRoomById(gallery, 'missing')).toThrow('Unknown room');
    expect(() => getAdjacentRoomId(gallery, 'room_1', 'sideways')).toThrow('Unknown navigation direction');
  });
});
