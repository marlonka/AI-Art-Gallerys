import React, { useEffect, useMemo, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { gallery } from './data/gallery.js';
import {
  findArtwork,
  getAdjacentRoomId,
  getInitialRoomId,
  getRoomById,
} from './utils/galleryState.js';
import './styles.css';

const transitionMs = 920;

function Header({ room }) {
  return (
    <header className="museum-header" aria-label="Gallery identity">
      <div className="room-count">
        Room {room.index} / {gallery.rooms.length}
      </div>
      <h1>DE KAMER</h1>
      <span className="title-rule" aria-hidden="true" />
      <p>DUTCH MASTERS COLLECTION</p>
    </header>
  );
}

function Artwork({ artwork, onOpen, isSelected }) {
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
      }}
      type="button"
      onClick={() => onOpen(artwork.id)}
      aria-label={`Open ${artwork.title} by ${artwork.artist}, ${artwork.year}`}
      data-selected={isSelected ? 'true' : 'false'}
    >
      <span className="frame">
        <span className="frame-corner frame-corner-tl" aria-hidden="true" />
        <span className="frame-corner frame-corner-tr" aria-hidden="true" />
        <span className="frame-corner frame-corner-bl" aria-hidden="true" />
        <span className="frame-corner frame-corner-br" aria-hidden="true" />
        <img src={artwork.imageUrl} alt={`${artwork.title} by ${artwork.artist}`} />
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

function Doorway({ direction, targetId, label, onMove }) {
  const disabled = !targetId;
  return (
    <button
      className={`doorway doorway-${direction}`}
      type="button"
      disabled={disabled}
      onClick={() => targetId && onMove(targetId, direction)}
      aria-label={disabled ? `${direction} room unavailable` : label}
    >
      <img className="door-portal-art" src="/assets/door-portal.png" alt="" aria-hidden="true" />
      <span className="door-label">
        {direction === 'previous' ? <span className="nav-chevron" aria-hidden="true">&lt;</span> : null}
        {label}
        {direction === 'next' ? <span className="nav-chevron" aria-hidden="true">&gt;</span> : null}
      </span>
    </button>
  );
}

function GalleryChrome({ room }) {
  return (
    <>
      <button className="corner-menu" type="button" aria-label="Open menu">
        <span aria-hidden="true" />
        <span aria-hidden="true" />
        <span aria-hidden="true" />
        <em>Menu</em>
      </button>
      <aside className="room-map" aria-label={`Mini map, room ${room.index} of ${gallery.rooms.length}`}>
        <span>Room {room.index} of {gallery.rooms.length}</span>
        <div className="map-glyph" aria-hidden="true">
          <i />
          <i />
          <i />
          <i />
          <b style={{ left: `${18 + (room.index - 1) * 24}%` }} />
        </div>
      </aside>
    </>
  );
}

function DetailOverlay({ artwork, onClose }) {
  if (!artwork) return null;

  return (
    <div className="detail-shell" role="dialog" aria-modal="true" aria-labelledby="detail-title" onMouseDown={onClose}>
      <button className="close-button" type="button" aria-label="Close artwork detail" onClick={onClose}>
        <span />
        <span />
      </button>
      <div className="detail-content" onMouseDown={(event) => event.stopPropagation()}>
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
  const [roomId, setRoomId] = useState(getInitialRoomId(gallery));
  const [selectedArtworkId, setSelectedArtworkId] = useState(null);
  const [transition, setTransition] = useState(null);
  const room = getRoomById(gallery, roomId);
  const selectedArtwork = selectedArtworkId ? findArtwork(gallery, selectedArtworkId) : null;

  const adjacent = useMemo(
    () => ({
      next: getAdjacentRoomId(gallery, roomId, 'next'),
      previous: getAdjacentRoomId(gallery, roomId, 'previous'),
    }),
    [roomId],
  );

  useEffect(() => {
    const roomIds = [roomId, adjacent.next, adjacent.previous].filter(Boolean);
    const preloadImages = gallery.rooms
      .filter((candidate) => roomIds.includes(candidate.id))
      .flatMap((candidate) => candidate.artworks.map((artwork) => artwork.imageUrl));

    preloadImages.forEach((src) => {
      const image = new Image();
      image.src = src;
    });
  }, [adjacent.next, adjacent.previous, roomId]);

  useEffect(() => {
    const onKeyDown = (event) => {
      if (event.key === 'Escape' && selectedArtworkId) {
        setSelectedArtworkId(null);
        return;
      }

      if (selectedArtworkId) return;

      if (event.key === 'ArrowRight' && adjacent.next) {
        moveToRoom(adjacent.next, 'next');
      }

      if (event.key === 'ArrowLeft' && adjacent.previous) {
        moveToRoom(adjacent.previous, 'previous');
      }
    };

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [adjacent.next, adjacent.previous, selectedArtworkId]);

  const moveToRoom = (targetId, direction) => {
    if (transition) return;
    setTransition({ phase: 'entering', direction });
    window.setTimeout(() => {
      setRoomId(targetId);
      setSelectedArtworkId(null);
      setTransition({ phase: 'settling', direction });
      window.setTimeout(() => setTransition(null), transitionMs);
    }, transitionMs);
  };

  return (
    <main
      className="app-shell"
      data-transition-phase={transition?.phase || 'idle'}
      data-transition-direction={transition?.direction || 'none'}
    >
      <GalleryChrome room={room} />
      <Header room={room} />

      <section className="viewport" aria-label={`${room.name} gallery room`}>
        <div className="room-stage">
          <div className="back-wall">
            <div className="wall-wash" aria-hidden="true" />
            <div className="wall-plaque">{room.name}</div>
            {room.artworks.map((artwork) => (
              <Artwork
                artwork={artwork}
                key={artwork.id}
                isSelected={selectedArtworkId === artwork.id}
                onOpen={setSelectedArtworkId}
              />
            ))}
            <Doorway
              direction="previous"
              label={adjacent.previous ? 'Previous Room' : 'Previous Room'}
              targetId={adjacent.previous}
              onMove={moveToRoom}
            />
            <Doorway
              direction="next"
              label={adjacent.next ? 'Enter the Collection' : 'End of the Wing'}
              targetId={adjacent.next}
              onMove={moveToRoom}
            />
          </div>
          <div className="floor" aria-hidden="true" />
        </div>
      </section>

      <footer className="museum-footer">PRESS TO INTERACT <span aria-hidden="true">&bull;</span> CLICK PAINTINGS TO EXPLORE</footer>
      <DetailOverlay artwork={selectedArtwork} onClose={() => setSelectedArtworkId(null)} />
      <div className="transition-veil" aria-hidden="true" />
    </main>
  );
}

createRoot(document.getElementById('root')).render(<GalleryRoom />);
