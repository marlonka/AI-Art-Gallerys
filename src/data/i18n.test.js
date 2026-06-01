import { describe, expect, it } from 'vitest';
import { gallery } from './gallery.js';
import { defaultLanguage, getLanguageCopy, localizeGallery } from './i18n.js';

describe('gallery localization', () => {
  it('uses German as the default language', () => {
    expect(defaultLanguage).toBe('de');

    const copy = getLanguageCopy(defaultLanguage);
    const localizedGallery = localizeGallery(gallery, defaultLanguage);

    expect(copy.openArtRooms).toBe('Kunsträume öffnen');
    expect(copy.productHeadline).toBe('Meisterwerke in Fotorealismus');
    expect(localizedGallery.rooms[0]).toMatchObject({
      name: 'Blicke, die zurücksehen',
      thesis: 'Porträts, die nicht posieren. Sie antworten.',
    });
    expect(localizedGallery.rooms[0].artworks[1]).toMatchObject({
      title: 'Das Mädchen mit dem Perlenohrring',
    });
  });

  it('keeps the English gallery copy intact when English is selected', () => {
    const copy = getLanguageCopy('en');
    const localizedGallery = localizeGallery(gallery, 'en');

    expect(copy.openArtRooms).toBe('Open art rooms');
    expect(copy.productHeadline).toBe('Masterworks in Photorealism');
    expect(localizedGallery.rooms[0]).toMatchObject({
      name: 'Faces That Watch Back',
      thesis: 'Portraits that do not pose. They answer.',
    });
    expect(localizedGallery.rooms[0].artworks[1]).toMatchObject({
      title: 'Girl with a Pearl Earring',
    });
  });
});
