const imageExtensionPattern = /\.(png|jpe?g|webp|avif|gif)$/i;

const generatedArtworkSlots = [
  { x: '50%', y: '48%', width: '310px', scale: 1, tilt: '-0.2deg' },
  { x: '30%', y: '48%', width: '190px', scale: 0.94, tilt: '-0.5deg' },
  { x: '70%', y: '48%', width: '190px', scale: 0.94, tilt: '0.5deg' },
  { x: '24%', y: '68%', width: '142px', scale: 0.9, tilt: '0.35deg' },
  { x: '76%', y: '68%', width: '142px', scale: 0.9, tilt: '-0.35deg' },
  { x: '38%', y: '27%', width: '122px', scale: 0.86, tilt: '0.2deg' },
  { x: '62%', y: '27%', width: '122px', scale: 0.86, tilt: '-0.2deg' },
];

function normalizeKey(value) {
  return String(value ?? '')
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/&/g, ' and ')
    .replace(/[^a-z0-9]+/g, '_')
    .replace(/^_+|_+$/g, '');
}

function removeOrderingPrefix(value) {
  return String(value).replace(/^\s*\d{1,3}[\s._-]+/, '');
}

function normalizeArtworkKey(value) {
  return normalizeKey(removeOrderingPrefix(value))
    .replace(/_(photorealistic|photoreal|generated|ai|study|version|final|v\d+)$/g, '')
    .replace(/_(copy|\d{1,3})$/g, '');
}

function humanizeTitle(value) {
  const cleaned = removeOrderingPrefix(value)
    .replace(/[\s._-]+(photorealistic|photoreal|generated|ai|version|final|v\d+)$/i, '')
    .replace(/[_-]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

  if (!cleaned) return 'Untitled Study';

  return cleaned.replace(/\b\w/g, (letter) => letter.toUpperCase());
}

function extractRelativeArtworkPath(path) {
  const normalizedPath = String(path).replace(/\\/g, '/');
  const marker = '/artworks/';
  const markerIndex = normalizedPath.lastIndexOf(marker);

  if (markerIndex >= 0) {
    return normalizedPath.slice(markerIndex + marker.length);
  }

  return normalizedPath.replace(/^.*?artworks\//, '');
}

function readImportedUrl(moduleValue) {
  if (typeof moduleValue === 'string') return moduleValue;
  if (moduleValue && typeof moduleValue.default === 'string') return moduleValue.default;
  return null;
}

function getRoomKeys(room) {
  return new Set(
    [room.id, room.name, room.index, `room_${room.index}`, `room-${room.index}`]
      .map(normalizeKey)
      .filter(Boolean),
  );
}

function getArtworkKeys(artwork) {
  const titleKey = normalizeArtworkKey(artwork.title);
  const idKey = normalizeArtworkKey(artwork.id);

  return new Set(
    [
      idKey,
      idKey.replace(/_preview$/, ''),
      titleKey,
      titleKey.replace(/^the_/, ''),
    ].filter(Boolean),
  );
}

function resolveLocalMatch(artwork, roomItems, sharedItems) {
  const artworkKeys = getArtworkKeys(artwork);
  const candidates = [...roomItems, ...sharedItems];

  return candidates.find((item) => artworkKeys.has(item.key)) ?? null;
}

function inferArtworkFormat(item, index) {
  if (/(square|still_life|ewer)/.test(item.key)) return 'square';
  if (/(portrait|girl|bride|milkmaid|balance|woman|painting|windmill)/.test(item.key)) return 'portrait';
  if (/(landscape|view|sea|delft|watch|syndics|city|harbor|harbour)/.test(item.key)) return 'landscape';
  return index % 3 === 0 ? 'landscape' : 'portrait';
}

function createGeneratedArtwork(room, item, index) {
  const slot = generatedArtworkSlots[index % generatedArtworkSlots.length];

  return {
    id: `local_${room.id}_${item.key || `artwork_${index + 1}`}`,
    title: item.title,
    artist: 'Photorealistic AI Study',
    year: '2026',
    imageUrl: item.source,
    description:
      'A generated photorealistic reinterpretation staged for this room. Rename the file to match a known artwork id when it should replace a curated piece.',
    format: inferArtworkFormat(item, index),
    aiDisclosure: 'Photoreal Study / AI reinterpretation',
    position: { ...slot },
    localImagePath: item.relativePath,
    source: 'local-generated',
    sourceWork: {
      provider: 'Local generated study',
      rights: 'Local AI-generated study supplied with this project.',
      sourceUrl: item.relativePath,
    },
  };
}

export function createLocalArtworkCollection(modules = {}) {
  return Object.entries(modules)
    .map(([path, moduleValue]) => {
      const source = readImportedUrl(moduleValue);
      const relativePath = extractRelativeArtworkPath(path);
      const segments = relativePath.split('/').filter(Boolean);
      const filename = segments.at(-1);

      if (segments.some((segment) => segment.startsWith('_'))) return null;
      if (!source || !filename || !imageExtensionPattern.test(filename)) return null;

      const basename = filename.replace(imageExtensionPattern, '');
      const roomSegment = segments.length > 1 && !segments[0].startsWith('_') ? segments[0] : null;

      return {
        id: relativePath,
        key: normalizeArtworkKey(basename),
        title: humanizeTitle(basename),
        roomKey: roomSegment ? normalizeKey(roomSegment) : null,
        relativePath,
        source,
      };
    })
    .filter(Boolean)
    .sort((first, second) => first.relativePath.localeCompare(second.relativePath));
}

export function applyLocalArtworkCollection(gallery, localItems = []) {
  if (!localItems.length) return gallery;

  const sharedItems = localItems.filter((item) => !item.roomKey);
  const usedLocalItemIds = new Set();

  const rooms = gallery.rooms.map((room) => {
    const roomKeys = getRoomKeys(room);
    const roomItems = localItems.filter((item) => item.roomKey && roomKeys.has(item.roomKey));
    const usedRoomItemIds = new Set();

    const artworks = room.artworks.map((artwork) => {
      const localMatch = resolveLocalMatch(artwork, roomItems, sharedItems);

      if (!localMatch) return artwork;
      usedLocalItemIds.add(localMatch.id);
      if (localMatch.roomKey) {
        usedRoomItemIds.add(localMatch.id);
      }

      return {
        ...artwork,
        imageUrl: localMatch.source,
        localImagePath: localMatch.relativePath,
        source: 'local-generated',
      };
    });

    const generatedArtworks = roomItems
      .filter((item) => !usedRoomItemIds.has(item.id))
      .map((item, index) => {
        usedLocalItemIds.add(item.id);
        return createGeneratedArtwork(room, item, index);
      });

    return {
      ...room,
      artworks: [...artworks, ...generatedArtworks],
    };
  });

  return {
    ...gallery,
    localArtworkCount: usedLocalItemIds.size,
    rooms,
  };
}
