export function getInitialRoomId(gallery) {
  return gallery.rooms[0]?.id ?? null;
}

export function getRoomById(gallery, roomId) {
  const room = gallery.rooms.find((candidate) => candidate.id === roomId);
  if (!room) {
    throw new Error(`Unknown room: ${roomId}`);
  }
  return room;
}

export function getAdjacentRoomId(gallery, roomId, direction) {
  const room = getRoomById(gallery, roomId);
  if (direction === 'next') return room.nextRoom;
  if (direction === 'previous') return room.previousRoom;
  throw new Error(`Unknown navigation direction: ${direction}`);
}

export function findArtwork(gallery, artworkId) {
  for (const room of gallery.rooms) {
    const artwork = room.artworks.find((candidate) => candidate.id === artworkId);
    if (artwork) return artwork;
  }
  return null;
}
