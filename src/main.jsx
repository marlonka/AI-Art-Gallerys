import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { gallery } from './data/gallery.js';
import {
  findArtwork,
  getAdjacentRoomId,
  getInitialRoomId,
  getRoomById,
} from './utils/galleryState.js';
import './styles.css';

const roomTransitionMs = 1560;

function getFeaturedArtwork(room) {
  return room.artworks.find((artwork) => artwork.featured) ?? room.artworks[0];
}

function Header({ room }) {
  return (
    <header className="museum-header" aria-label="Gallery identity">
      <div className="room-count">
        Room {String(room.index).padStart(2, '0')} / {String(gallery.rooms.length).padStart(2, '0')}
      </div>
      <h1>DE KAMER</h1>
      <p>{room.name}</p>
    </header>
  );
}

function Artwork({ artwork, index, onOpen, isSelected, isPassive = false }) {
  const className = ['artwork', `artwork-${artwork.format}`, artwork.featured ? 'artwork-featured' : '']
    .filter(Boolean)
    .join(' ');

  return (
    <button
      className={className}
      style={{
        left: artwork.position.x,
        top: artwork.position.y,
        '--art-scale': artwork.position.scale,
        '--tilt': artwork.position.tilt,
        '--art-width': artwork.position.width,
        '--exit-delay': `${index * 18}ms`,
        '--enter-delay': `${720 + index * 30}ms`,
      }}
      type="button"
      onClick={() => onOpen(artwork.id)}
      aria-label={`Open ${artwork.title} by ${artwork.artist}, ${artwork.year}`}
      data-selected={isSelected ? 'true' : 'false'}
      tabIndex={isPassive ? -1 : undefined}
    >
      <span className="gallery-hook" aria-hidden="true" />
      <span className="frame">
        <span className="mat">
          <img src={artwork.imageUrl} alt={`${artwork.title} by ${artwork.artist}`} />
        </span>
      </span>
      {artwork.featured ? <span className="inspect-dot" aria-hidden="true" /> : null}
      <span className="art-tooltip" role="presentation">
        <strong>{artwork.title}</strong>
        <span>{artwork.artist}</span>
        <em>{artwork.year}</em>
      </span>
    </button>
  );
}

function ArtworkLayer({ room, isPassive, selectedArtworkId, onOpen }) {
  return (
    <div className={`artwork-layer ${isPassive ? 'artwork-layer-outgoing' : 'artwork-layer-incoming'}`} aria-hidden={isPassive ? 'true' : undefined}>
      {room.artworks.map((artwork, index) => (
        <Artwork
          artwork={artwork}
          index={index}
          key={artwork.id}
          isPassive={isPassive}
          isSelected={!isPassive && selectedArtworkId === artwork.id}
          onOpen={isPassive ? () => {} : onOpen}
        />
      ))}
    </div>
  );
}

function Doorway({ direction, targetId, targetName, onMove }) {
  const disabled = !targetId;
  const fallbackLabel = direction === 'previous' ? 'Start of Wing' : 'End of Wing';

  return (
    <button
      className={`doorway doorway-${direction}`}
      type="button"
      disabled={disabled}
      onClick={() => targetId && onMove(targetId, direction)}
      aria-label={disabled ? fallbackLabel : `${direction === 'previous' ? 'Previous room' : 'Next room'}: ${targetName}`}
      data-state={disabled ? 'sealed' : 'open'}
    >
      <span className="door-glow" aria-hidden="true" />
      <img className="door-portal-art" src="/assets/door-portal.png" alt="" aria-hidden="true" />
      <span className="door-label">
        {direction === 'previous' ? <span className="nav-chevron" aria-hidden="true">&lt;</span> : null}
        <span>
          <small>{direction === 'previous' ? 'Previous' : 'Next'}</small>
          <strong>{targetName ?? fallbackLabel}</strong>
        </span>
        {direction === 'next' ? <span className="nav-chevron" aria-hidden="true">&gt;</span> : null}
      </span>
    </button>
  );
}

function GalleryChrome({ room, isIndexOpen, onToggleIndex, onSelectRoom }) {
  return (
    <>
      <button
        className="corner-menu"
        type="button"
        aria-label={isIndexOpen ? 'Close gallery index' : 'Open gallery index'}
        aria-controls="room-index"
        aria-expanded={isIndexOpen}
        onClick={onToggleIndex}
      >
        <span className="menu-lines" aria-hidden="true">
          <i />
          <i />
          <i />
        </span>
        <em>Index</em>
      </button>

      <nav className="room-map" aria-label="Room quick navigation">
        <span>Room {room.index} of {gallery.rooms.length}</span>
        <div className="map-glyph">
          {gallery.rooms.map((candidate) => (
            <button
              key={candidate.id}
              type="button"
              aria-label={`Go to ${candidate.name}`}
              aria-current={candidate.id === room.id ? 'page' : undefined}
              onClick={() => onSelectRoom(candidate.id)}
            >
              <i aria-hidden="true" />
            </button>
          ))}
        </div>
      </nav>
    </>
  );
}

function RoomIndex({ currentRoomId, isOpen, onClose, onSelectRoom }) {
  if (!isOpen) return null;

  return (
    <div className="index-layer" role="presentation" onMouseDown={onClose}>
      <aside
        id="room-index"
        className="index-panel"
        aria-label="Gallery index"
        onMouseDown={(event) => event.stopPropagation()}
      >
        <div className="index-header">
          <p>Gallery Index</p>
          <button className="index-close" type="button" aria-label="Close gallery index" onClick={onClose}>
            <span />
            <span />
          </button>
        </div>

        <div className="index-room-list">
          {gallery.rooms.map((candidate) => {
            const featuredArtwork = getFeaturedArtwork(candidate);
            const isCurrent = candidate.id === currentRoomId;

            return (
              <button
                className="index-room"
                type="button"
                key={candidate.id}
                onClick={() => onSelectRoom(candidate.id)}
                aria-current={isCurrent ? 'page' : undefined}
                data-current={isCurrent ? 'true' : 'false'}
              >
                <img src={featuredArtwork.imageUrl} alt="" aria-hidden="true" />
                <span>
                  <small>Room {String(candidate.index).padStart(2, '0')}</small>
                  <strong>{candidate.name}</strong>
                  <em>{featuredArtwork.artist}</em>
                </span>
              </button>
            );
          })}
        </div>
      </aside>
    </div>
  );
}

function DetailOverlay({ artwork, onClose }) {
  if (!artwork) return null;

  return (
    <div
      className="detail-shell"
      role="dialog"
      aria-modal="true"
      aria-labelledby="detail-title"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <button className="close-button" type="button" aria-label="Close artwork detail" onClick={onClose}>
        <span />
        <span />
      </button>
      <div className="detail-content">
        <div className="detail-image-wrap">
          <img src={artwork.imageUrl} alt={`${artwork.title} by ${artwork.artist}`} />
        </div>
        <article className="detail-copy">
          <p className="detail-kicker">{artwork.artist}</p>
          <h2 id="detail-title">{artwork.title}</h2>
          <p className="detail-year">{artwork.year}</p>
          <p>{artwork.description}</p>
        </article>
      </div>
    </div>
  );
}

function GalleryRoom() {
  const [roomId, setRoomId] = useState(() => getInitialRoomId(gallery));
  const [selectedArtworkId, setSelectedArtworkId] = useState(null);
  const [transition, setTransition] = useState(null);
  const [isIndexOpen, setIsIndexOpen] = useState(false);
  const transitionTimers = useRef([]);

  const room = getRoomById(gallery, roomId);
  const outgoingRoom = transition?.outgoingRoomId ? getRoomById(gallery, transition.outgoingRoomId) : null;
  const selectedArtwork = selectedArtworkId ? findArtwork(gallery, selectedArtworkId) : null;

  const adjacent = useMemo(
    () => ({
      next: getAdjacentRoomId(gallery, roomId, 'next'),
      previous: getAdjacentRoomId(gallery, roomId, 'previous'),
    }),
    [roomId],
  );

  const adjacentRooms = useMemo(
    () => ({
      next: adjacent.next ? getRoomById(gallery, adjacent.next) : null,
      previous: adjacent.previous ? getRoomById(gallery, adjacent.previous) : null,
    }),
    [adjacent.next, adjacent.previous],
  );

  const clearTransitionTimers = useCallback(() => {
    transitionTimers.current.forEach((timerId) => window.clearTimeout(timerId));
    transitionTimers.current = [];
  }, []);

  const moveToRoom = useCallback(
    (targetId, direction) => {
      if (transition || !targetId || targetId === roomId) return;

      clearTransitionTimers();
      setIsIndexOpen(false);
      setSelectedArtworkId(null);
      setTransition({ phase: 'crossfading', direction, outgoingRoomId: roomId });
      setRoomId(targetId);

      const transitionTimer = window.setTimeout(() => {
        setTransition(null);
        transitionTimers.current = [];
      }, roomTransitionMs);

      transitionTimers.current.push(transitionTimer);
    },
    [clearTransitionTimers, roomId, transition],
  );

  const selectRoom = useCallback(
    (targetId) => {
      if (targetId === roomId) {
        setIsIndexOpen(false);
        return;
      }

      const targetRoom = getRoomById(gallery, targetId);
      const direction = targetRoom.index > room.index ? 'next' : 'previous';
      moveToRoom(targetId, direction);
    },
    [moveToRoom, room.index, roomId],
  );

  useEffect(() => () => clearTransitionTimers(), [clearTransitionTimers]);

  useEffect(() => {
    const roomIds = new Set([roomId, adjacent.next, adjacent.previous].filter(Boolean));
    const preloadImages = [];

    for (const candidate of gallery.rooms) {
      if (!roomIds.has(candidate.id)) continue;

      for (const artwork of candidate.artworks) {
        preloadImages.push(artwork.imageUrl);
      }
    }

    preloadImages.forEach((src) => {
      const image = new Image();
      image.src = src;
    });
  }, [adjacent.next, adjacent.previous, roomId]);

  useEffect(() => {
    const onKeyDown = (event) => {
      if (event.key === 'Escape') {
        if (selectedArtworkId) {
          setSelectedArtworkId(null);
          return;
        }

        if (isIndexOpen) {
          setIsIndexOpen(false);
          return;
        }
      }

      if (selectedArtworkId || isIndexOpen) return;

      if (event.key === 'ArrowRight' && adjacent.next) {
        moveToRoom(adjacent.next, 'next');
      }

      if (event.key === 'ArrowLeft' && adjacent.previous) {
        moveToRoom(adjacent.previous, 'previous');
      }
    };

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [adjacent.next, adjacent.previous, isIndexOpen, moveToRoom, selectedArtworkId]);

  return (
    <main
      className="app-shell"
      data-transition-phase={transition?.phase || 'idle'}
      data-transition-direction={transition?.direction || 'none'}
    >
      <GalleryChrome
        room={room}
        isIndexOpen={isIndexOpen}
        onToggleIndex={() => setIsIndexOpen((isOpen) => !isOpen)}
        onSelectRoom={selectRoom}
      />
      <Header room={room} />

      <section className="viewport" aria-label={`${room.name} gallery room`}>
        <div className="room-stage">
            <div className="back-wall">
              <div className="wall-wash" aria-hidden="true" />
              <div className="wall-plaque">{room.name}</div>
            <ArtworkLayer
              room={room}
              selectedArtworkId={selectedArtworkId}
              onOpen={setSelectedArtworkId}
            />
            {outgoingRoom ? (
              <ArtworkLayer
                room={outgoingRoom}
                isPassive
                selectedArtworkId={null}
                onOpen={setSelectedArtworkId}
              />
            ) : null}
            <Doorway
              direction="previous"
              targetId={adjacent.previous}
              targetName={adjacentRooms.previous?.name}
              onMove={moveToRoom}
            />
            <Doorway
              direction="next"
              targetId={adjacent.next}
              targetName={adjacentRooms.next?.name}
              onMove={moveToRoom}
            />
          </div>
          <div className="floor" aria-hidden="true" />
        </div>
      </section>

      <footer className="museum-footer">
        <span>Open Collection</span>
        <i aria-hidden="true" />
        Dutch Golden Age / 1642-1670
      </footer>
      <RoomIndex
        currentRoomId={roomId}
        isOpen={isIndexOpen}
        onClose={() => setIsIndexOpen(false)}
        onSelectRoom={selectRoom}
      />
      <DetailOverlay artwork={selectedArtwork} onClose={() => setSelectedArtworkId(null)} />
    </main>
  );
}

createRoot(document.getElementById('root')).render(<GalleryRoom />);
