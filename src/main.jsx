import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { gallery } from './data/gallery.js';
import {
  defaultLanguage,
  getLanguageCopy,
  isSupportedLanguage,
  languageOptions,
  localizeGallery,
  normalizeLanguage,
} from './data/i18n.js';
import {
  findArtwork,
  getAdjacentArtworkId,
  getAdjacentRoomId,
  getInitialRoomId,
  getRoomById,
} from './utils/galleryState.js';
import './styles.css';

const roomTransitionMs = 1840;
const roomDecodeBudgetMs = 1200;
const artworkImageCache = new Map();

function waitForImageDecode(image) {
  if (typeof image.decode !== 'function') return Promise.resolve();
  return image.decode().catch(() => undefined);
}

function preloadArtworkImage(src) {
  if (!src || typeof Image === 'undefined') return Promise.resolve();

  if (!artworkImageCache.has(src)) {
    artworkImageCache.set(
      src,
      new Promise((resolve) => {
        const image = new Image();

        image.decoding = 'async';
        image.onload = () => {
          void waitForImageDecode(image).then(resolve);
        };
        image.onerror = () => resolve();
        image.src = src;

        if (image.complete) {
          void waitForImageDecode(image).then(resolve);
        }
      }),
    );
  }

  return artworkImageCache.get(src);
}

function withTimeout(promise, timeoutMs) {
  if (typeof window === 'undefined') return promise;

  return Promise.race([
    promise,
    new Promise((resolve) => {
      window.setTimeout(resolve, timeoutMs);
    }),
  ]);
}

function preloadRoomArtworks(room, timeoutMs = roomDecodeBudgetMs) {
  return withTimeout(
    Promise.all(room.artworks.map((artwork) => preloadArtworkImage(artwork.imageUrl))),
    timeoutMs,
  );
}
const languageStorageKey = 'inner-aiye-language';

function readStoredLanguage() {
  try {
    const storedLanguage = window.localStorage.getItem(languageStorageKey);
    return isSupportedLanguage(storedLanguage) ? storedLanguage : defaultLanguage;
  } catch {
    return defaultLanguage;
  }
}

function writeStoredLanguage(language) {
  try {
    window.localStorage.setItem(languageStorageKey, normalizeLanguage(language));
  } catch {
    // Storage can be unavailable in hardened browsing modes; language still works for the session.
  }
}

function scrollToMobileRoomTop() {
  if (typeof window === 'undefined') return;
  if (!window.matchMedia('(max-width: 900px)').matches) return;

  window.requestAnimationFrame(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
  });
}

function updateDocumentLanguage(language, copy) {
  const selectedLanguage = languageOptions.find((option) => option.code === language);
  document.documentElement.lang = selectedLanguage?.htmlLang ?? language;
  document.title = copy.pageTitle;

  document.querySelector('meta[name="description"]')?.setAttribute('content', copy.metaDescription);
  document.querySelector('meta[property="og:title"]')?.setAttribute('content', copy.pageTitle);
  document.querySelector('meta[property="og:description"]')?.setAttribute('content', copy.metaDescription);
}

function getFeaturedArtwork(room) {
  return room.artworks.find((artwork) => artwork.featured) ?? room.artworks[0];
}

function getDisplayArtworks(room) {
  return room.artworks.toSorted((first, second) => (first.mobileOrder ?? 10) - (second.mobileOrder ?? 10));
}

function Header({ gallery, room, copy }) {
  return (
    <header className="museum-header" aria-label={copy.galleryIdentityLabel}>
      <div className="room-count">
        {copy.roomCounter(room.index, gallery.rooms.length)}
      </div>
      <h1>{gallery.identity.mark}</h1>
      <p className="room-name">{copy.productHeadline}</p>
    </header>
  );
}

function Artwork({ artwork, index, onOpen, isSelected, isPassive = false, copy }) {
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
        '--mobile-order': artwork.mobileOrder ?? 10,
        '--exit-delay': `${index * 10}ms`,
        '--enter-delay': `${700 + index * 18}ms`,
      }}
      type="button"
      onClick={() => onOpen(artwork.id)}
      aria-label={copy.openArtwork(artwork)}
      data-selected={isSelected ? 'true' : 'false'}
      tabIndex={isPassive ? -1 : undefined}
    >
      <span className="gallery-hook" aria-hidden="true" />
      <span className="frame">
        <span className="mat">
          <img
            src={artwork.imageUrl}
            alt={copy.artworkAlt(artwork)}
            loading={artwork.featured ? 'eager' : 'lazy'}
            decoding="async"
            fetchPriority={artwork.featured ? 'high' : 'auto'}
          />
        </span>
      </span>
      <span className="art-tooltip" role="presentation">
        <strong>{artwork.title}</strong>
        <span>{artwork.artist}</span>
        <em>{artwork.year}</em>
      </span>
    </button>
  );
}

function ArtworkLayer({ room, isPassive, selectedArtworkId, onOpen, copy }) {
  return (
    <div className={`artwork-layer ${isPassive ? 'artwork-layer-outgoing' : 'artwork-layer-incoming'}`} aria-hidden={isPassive ? 'true' : undefined}>
      {getDisplayArtworks(room).map((artwork, index) => (
        <Artwork
          artwork={artwork}
          index={index}
          key={artwork.id}
          isPassive={isPassive}
          isSelected={!isPassive && selectedArtworkId === artwork.id}
          onOpen={isPassive ? () => {} : onOpen}
          copy={copy}
        />
      ))}
    </div>
  );
}

function Doorway({ direction, targetId, targetName, onMove, copy }) {
  const disabled = !targetId;
  const fallbackLabel = direction === 'previous' ? copy.firstGallery : copy.finalGallery;
  const directionLabel = direction === 'previous' ? copy.previousRoom : copy.nextRoom;

  return (
    <button
      className={`doorway doorway-${direction}`}
      type="button"
      disabled={disabled}
      onClick={() => targetId && onMove(targetId, direction)}
      aria-label={disabled ? fallbackLabel : `${directionLabel}: ${targetName}`}
      data-state={disabled ? 'sealed' : 'open'}
    >
      <span className="door-glow" aria-hidden="true" />
      <img
        className="door-portal-art"
        src="/assets/door-portal.webp"
        alt=""
        aria-hidden="true"
        decoding="async"
        fetchPriority="low"
      />
      <span className="door-label">
        {direction === 'previous' ? <span className="nav-chevron" aria-hidden="true">&lt;</span> : null}
        <span>
          <small>{direction === 'previous' ? copy.previous : copy.next}</small>
          <strong>{targetName ?? fallbackLabel}</strong>
        </span>
        {direction === 'next' ? <span className="nav-chevron" aria-hidden="true">&gt;</span> : null}
      </span>
    </button>
  );
}

function GalleryChrome({ isIndexOpen, onToggleIndex, copy }) {
  return (
    <div>
      <button
        className="corner-menu"
        type="button"
        aria-label={isIndexOpen ? copy.closeArtRooms : copy.openArtRooms}
        aria-controls="room-index"
        aria-expanded={isIndexOpen}
        onClick={onToggleIndex}
      >
        <span className="menu-lines" aria-hidden="true">
          <i />
          <i />
          <i />
        </span>
        <em>{copy.artRooms}</em>
      </button>
    </div>
  );
}

function LegalParagraph({ paragraph }) {
  if (paragraph.strong) {
    return (
      <p>
        <strong>{paragraph.strong}</strong>
      </p>
    );
  }

  if (paragraph.lines) {
    return (
      <p>
        {paragraph.lines.map((line, index) => (
          <React.Fragment key={line}>
            {index > 0 ? <br /> : null}
            {line}
          </React.Fragment>
        ))}
      </p>
    );
  }

  return <p>{paragraph.text}</p>;
}

function LegalHeading({ level, children }) {
  return level === 2 ? <h2>{children}</h2> : <h3>{children}</h3>;
}

function getLegalParagraphKey(paragraph) {
  return paragraph.strong ?? paragraph.text ?? paragraph.lines?.join('|') ?? 'paragraph';
}

function getLegalSectionKey(section) {
  return section.title ?? section.paragraphs?.map(getLegalParagraphKey).join('|') ?? 'section';
}

function LegalDisclosure({ copy }) {
  return (
    <details className="legal-disclosure">
      <summary>{copy.legal.summary}</summary>
      <div className="legal-content">
        {copy.legal.sections.map((section) => (
          <React.Fragment key={getLegalSectionKey(section)}>
            {section.title ? <LegalHeading level={section.level}>{section.title}</LegalHeading> : null}
            {section.paragraphs?.map((paragraph) => (
              <LegalParagraph paragraph={paragraph} key={getLegalParagraphKey(paragraph)} />
            ))}
          </React.Fragment>
        ))}
      </div>
    </details>
  );
}

function LanguageToggle({ language, onChangeLanguage, copy }) {
  return (
    <nav className="language-toggle" aria-label={copy.languageToggleLabel}>
      {languageOptions.map((option) => {
        const isActive = option.code === language;
        const languageLabel = copy.languageNames[option.code] ?? option.label;

        return (
          <button
            className="language-option"
            type="button"
            key={option.code}
            onClick={() => onChangeLanguage(option.code)}
            aria-pressed={isActive}
            aria-label={copy.languageOptionLabel(languageLabel, isActive)}
            data-active={isActive ? 'true' : 'false'}
            lang={option.htmlLang}
          >
            <strong>{languageLabel}</strong>
          </button>
        );
      })}
    </nav>
  );
}

function RoomIndex({ gallery, currentRoomId, isOpen, onClose, onSelectRoom, copy }) {
  if (!isOpen) return null;

  return (
    <div className="index-layer">
      <button className="index-backdrop" type="button" aria-label={copy.closeArtRooms} onClick={onClose} />
      <aside id="room-index" className="index-panel" aria-label={copy.artRooms}>
        <div className="index-header">
          <p>{gallery.identity.indexName}</p>
          <button className="index-close" type="button" aria-label={copy.closeArtRooms} onClick={onClose}>
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
                <img src={featuredArtwork.imageUrl} alt="" aria-hidden="true" loading="lazy" decoding="async" />
                <span>
                  <small>{copy.roomLabel} {String(candidate.index).padStart(2, '0')}</small>
                  <strong>{candidate.name}</strong>
                  <em>{copy.includingArtist(featuredArtwork.artist)}</em>
                </span>
              </button>
            );
          })}
        </div>
      </aside>
    </div>
  );
}

function DetailOverlay({ artwork, onClose, onNavigate, copy }) {
  const shellRef = useRef(null);
  const closeButtonRef = useRef(null);
  const previousFocusRef = useRef(null);

  const trapFocus = useCallback((event) => {
    if (event.key !== 'Tab') return;

    const focusableElements = Array.from(
      shellRef.current?.querySelectorAll(
        'a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])',
      ) ?? [],
    ).filter((element) => element instanceof HTMLElement && !element.hasAttribute('disabled'));

    if (!focusableElements.length) return;

    const firstElement = focusableElements[0];
    const lastElement = focusableElements.at(-1);

    if (event.shiftKey && document.activeElement === firstElement) {
      event.preventDefault();
      lastElement.focus();
    }

    if (!event.shiftKey && document.activeElement === lastElement) {
      event.preventDefault();
      firstElement.focus();
    }
  }, []);

  useEffect(() => {
    if (!artwork) return undefined;

    previousFocusRef.current = document.activeElement;
    window.setTimeout(() => closeButtonRef.current?.focus(), 0);

    return () => {
      const previousFocus = previousFocusRef.current;
      if (previousFocus instanceof HTMLElement && previousFocus.isConnected) {
        previousFocus.focus();
      }
    };
  }, [artwork]);

  useEffect(() => {
    if (!artwork) return undefined;

    const onKeyDown = (event) => {
      if (!shellRef.current?.contains(document.activeElement)) return;
      trapFocus(event);
    };

    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [artwork, trapFocus]);

  if (!artwork) return null;

  return (
    <div
      ref={shellRef}
      className="detail-shell"
      role="dialog"
      aria-modal="true"
      aria-labelledby="detail-title"
      tabIndex={-1}
    >
      <button className="detail-backdrop" type="button" aria-label={copy.closeArtworkDetail} onClick={onClose} />
      <button ref={closeButtonRef} className="close-button" type="button" aria-label={copy.closeArtworkDetail} onClick={onClose}>
        <span />
        <span />
      </button>
      <div className="detail-content">
        <div className="detail-image-wrap">
          <span className="detail-image-mat">
            <img
              src={artwork.imageUrl}
              alt={copy.artworkAlt(artwork)}
              loading="eager"
              decoding="async"
              fetchPriority="high"
            />
          </span>
        </div>
        <article className="detail-copy">
          <p className="detail-kicker">{artwork.artist}</p>
          <h2 id="detail-title">{artwork.title}</h2>
          <p className="detail-year">{artwork.year}</p>
          <p>{artwork.description}</p>
        </article>
      </div>
      <div className="detail-nav-controls" aria-label={copy.artworkDetailNavigation}>
        <button className="detail-nav detail-nav-previous" type="button" onClick={() => onNavigate('previous')}>
          <span aria-hidden="true">&lt;</span>
          <span>{copy.previous}</span>
        </button>
        <button className="detail-nav detail-nav-next" type="button" onClick={() => onNavigate('next')}>
          <span>{copy.next}</span>
          <span aria-hidden="true">&gt;</span>
        </button>
      </div>
    </div>
  );
}

function GalleryRoom() {
  const [roomId, setRoomId] = useState(() => getInitialRoomId(gallery));
  const [language, setLanguage] = useState(readStoredLanguage);
  const [selectedArtworkId, setSelectedArtworkId] = useState(null);
  const [transition, setTransition] = useState(null);
  const [isIndexOpen, setIsIndexOpen] = useState(false);
  const isMountedRef = useRef(false);
  const transitionLockRef = useRef(false);
  const transitionTimers = useRef([]);

  const copy = getLanguageCopy(language);
  const localizedGallery = useMemo(() => localizeGallery(gallery, language), [language]);

  const room = getRoomById(localizedGallery, roomId);
  const outgoingRoom = transition?.outgoingRoomId ? getRoomById(localizedGallery, transition.outgoingRoomId) : null;
  const selectedArtwork = selectedArtworkId ? findArtwork(localizedGallery, selectedArtworkId) : null;

  const adjacent = useMemo(
    () => ({
      next: getAdjacentRoomId(localizedGallery, roomId, 'next'),
      previous: getAdjacentRoomId(localizedGallery, roomId, 'previous'),
    }),
    [localizedGallery, roomId],
  );

  const adjacentRooms = useMemo(
    () => ({
      next: adjacent.next ? getRoomById(localizedGallery, adjacent.next) : null,
      previous: adjacent.previous ? getRoomById(localizedGallery, adjacent.previous) : null,
    }),
    [adjacent.next, adjacent.previous, localizedGallery],
  );

  const clearTransitionTimers = useCallback(() => {
    transitionTimers.current.forEach((timerId) => window.clearTimeout(timerId));
    transitionTimers.current = [];
  }, []);

  const navigateSelectedArtwork = useCallback(
    (direction) => {
      if (!selectedArtworkId) return;

      const nextArtworkId = getAdjacentArtworkId(room, selectedArtworkId, direction);
      if (nextArtworkId) setSelectedArtworkId(nextArtworkId);
    },
    [room, selectedArtworkId],
  );

  const changeLanguage = useCallback((nextLanguage) => {
    const normalizedLanguage = normalizeLanguage(nextLanguage);
    setLanguage(normalizedLanguage);
    writeStoredLanguage(normalizedLanguage);
  }, []);

  const moveToRoom = useCallback(
    async (targetId, direction) => {
      if (transitionLockRef.current || transition || !targetId || targetId === roomId) return;

      const targetRoom = getRoomById(localizedGallery, targetId);

      clearTransitionTimers();
      transitionLockRef.current = true;
      setIsIndexOpen(false);
      setSelectedArtworkId(null);

      await preloadRoomArtworks(targetRoom);

      if (!isMountedRef.current) {
        transitionLockRef.current = false;
        return;
      }

      setTransition({ phase: 'crossfading', direction, outgoingRoomId: roomId });
      setRoomId(targetId);
      scrollToMobileRoomTop();

      const transitionTimer = window.setTimeout(() => {
        setTransition(null);
        transitionTimers.current = [];
        transitionLockRef.current = false;
      }, roomTransitionMs);

      transitionTimers.current.push(transitionTimer);
    },
    [clearTransitionTimers, localizedGallery, roomId, transition],
  );

  const selectRoom = useCallback(
    (targetId) => {
      if (targetId === roomId) {
        setIsIndexOpen(false);
        return;
      }

      const targetRoom = getRoomById(localizedGallery, targetId);
      const direction = targetRoom.index > room.index ? 'next' : 'previous';
      moveToRoom(targetId, direction);
    },
    [localizedGallery, moveToRoom, room.index, roomId],
  );

  useEffect(() => {
    isMountedRef.current = true;

    return () => {
      isMountedRef.current = false;
      transitionLockRef.current = false;
      clearTransitionTimers();
    };
  }, [clearTransitionTimers]);

  useEffect(() => {
    gallery.rooms.forEach((candidate) => {
      void preloadRoomArtworks(candidate, 2500);
    });
  }, []);

  useEffect(() => {
    updateDocumentLanguage(language, copy);
  }, [copy, language]);

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

      if (selectedArtworkId) {
        if (event.key === 'ArrowRight') {
          event.preventDefault();
          navigateSelectedArtwork('next');
        }

        if (event.key === 'ArrowLeft') {
          event.preventDefault();
          navigateSelectedArtwork('previous');
        }

        return;
      }

      if (isIndexOpen) return;

      if (event.key === 'ArrowRight' && adjacent.next) {
        moveToRoom(adjacent.next, 'next');
      }

      if (event.key === 'ArrowLeft' && adjacent.previous) {
        moveToRoom(adjacent.previous, 'previous');
      }
    };

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [adjacent.next, adjacent.previous, isIndexOpen, moveToRoom, navigateSelectedArtwork, selectedArtworkId]);

  return (
    <main
      className="app-shell"
      data-transition-phase={transition?.phase || 'idle'}
      data-transition-direction={transition?.direction || 'none'}
    >
      <GalleryChrome
        isIndexOpen={isIndexOpen}
        onToggleIndex={() => setIsIndexOpen((isOpen) => !isOpen)}
        copy={copy}
      />
      <Header gallery={localizedGallery} room={room} copy={copy} />

      <section className="viewport" aria-label={copy.roomGalleryLabel(room.name)}>
        <div className="room-stage">
          <div className="back-wall">
            <div className="wall-wash" aria-hidden="true" />
            <p className="wall-plaque">{room.thesis}</p>
            <ArtworkLayer
              room={room}
              selectedArtworkId={selectedArtworkId}
              onOpen={setSelectedArtworkId}
              copy={copy}
            />
            {outgoingRoom ? (
              <ArtworkLayer
                room={outgoingRoom}
                isPassive
                selectedArtworkId={null}
                onOpen={setSelectedArtworkId}
                copy={copy}
              />
            ) : null}
            <Doorway
              direction="previous"
              targetId={adjacent.previous}
              targetName={adjacentRooms.previous?.name}
              onMove={moveToRoom}
              copy={copy}
            />
            <Doorway
              direction="next"
              targetId={adjacent.next}
              targetName={adjacentRooms.next?.name}
              onMove={moveToRoom}
              copy={copy}
            />
          </div>
          <div className="floor" aria-hidden="true" />
        </div>
      </section>

      <footer className="museum-footer">
        <div className="footer-line">
          <span className="footer-source">{copy.footerSource}</span>
        </div>
        <div className="footer-controls">
          <LanguageToggle language={language} onChangeLanguage={changeLanguage} copy={copy} />
          <LegalDisclosure copy={copy} />
        </div>
      </footer>
      <RoomIndex
        gallery={localizedGallery}
        currentRoomId={roomId}
        isOpen={isIndexOpen}
        onClose={() => setIsIndexOpen(false)}
        onSelectRoom={selectRoom}
        copy={copy}
      />
      <DetailOverlay
        artwork={selectedArtwork}
        onClose={() => setSelectedArtworkId(null)}
        onNavigate={navigateSelectedArtwork}
        copy={copy}
      />
    </main>
  );
}

createRoot(document.getElementById('root')).render(<GalleryRoom />);
