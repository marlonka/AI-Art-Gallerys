export const defaultLanguage = 'de';

export const languageOptions = [
  { code: 'de', label: 'Deutsch', shortLabel: 'DE', htmlLang: 'de' },
  { code: 'en', label: 'English', shortLabel: 'EN', htmlLang: 'en' },
];

const supportedLanguageCodes = new Set(languageOptions.map((language) => language.code));

export function isSupportedLanguage(language) {
  return supportedLanguageCodes.has(language);
}

export function normalizeLanguage(language) {
  return isSupportedLanguage(language) ? language : defaultLanguage;
}

const identityTranslations = {
  de: {
    indexName: 'Kunsträume',
    collectionLabel: 'Gemeinfreier Kanon',
    footerContext: 'Gemeinfreie Meisterwerke / fotorealer Prompt-Kanon',
  },
};

const roomTranslations = {
  de: {
    room_1: {
      name: 'Blicke, die zurücksehen',
      thesis: 'Porträts, die nicht posieren. Sie antworten.',
    },
    room_2: {
      name: 'Wetter, Wasser, Nacht',
      thesis: 'Natur ist hier kein Hintergrund. Sie wird Druck.',
    },
    room_3: {
      name: 'Mythos, Bühne, Schock',
      thesis: 'Körper, Zeichen und Katastrophe im Bühnenlicht.',
    },
    room_4: {
      name: 'Die Welt als Szene',
      thesis: 'Stadt, Freizeit, Arbeit und Probe werden zu filmischem Gesellschaftsraum.',
    },
    room_5: {
      name: 'Farbe, Wetter, Materie',
      thesis: 'Blumen, Schnee, Früchte und Dschungel verwandeln Stille in Empfindung.',
    },
  },
};

const artworkTranslations = {
  de: {
    mona_lisa: {
      title: 'Mona Lisa',
      description:
        'Das berühmteste halbe Lächeln der Kunst wird zum Prüfstein für fotoreale Uneindeutigkeit: Porträt, Erinnerung und Inszenierung, auf dieselbe Temperatur gebracht.',
    },
    girl_with_pearl: {
      title: 'Das Mädchen mit dem Perlenohrring',
      description:
        'Ein Blick wird zur lebendigen Unterbrechung. In fotorealer Form werden blaues Tuch, dunkler Raum und Perle zu einer Studie über Haut, Blick und Stille.',
    },
    arnolfini_portrait: {
      title: 'Die Arnolfini-Hochzeit',
      description:
        'Ein bürgerliches Zimmer spielt Vertrag, Spiegel und Bühne zugleich. Die Dinge sind so präzise gesetzt, dass sie schon halb wie eine Fotografie wirken.',
    },
    american_gothic: {
      title: 'American Gothic',
      description:
        'Eine nationale Ikone aus Haltung, Verzicht und Misstrauen. Als Fotografie rückt die Spannung näher an den Körper.',
    },
    whistlers_mother: {
      title: 'Whistlers Mutter',
      description:
        'Strenges Profil, gebändigte Gefühle, kühle Geometrie. Fotorealismus verwandelt die berühmte Stille in einen Raum, den man fast hören kann.',
    },
    a_bar_at_the_folies_bergere: {
      title: 'Bar in den Folies-Bergère',
      description:
        'Ein öffentlicher Raum, ein privates Gesicht, ein Spiegel mit eigenem Willen. Kaum ein Bild verlangt stärker nach einer filmischen KI-Neuinszenierung.',
    },
    starry_night: {
      title: 'Sternennacht',
      description:
        'Der Himmel bewegt sich zugleich wie Wetter, Erinnerung und Nervensystem. Fotoreal muss diese Nacht weniger wie Malerei wirken, mehr wie etwas, das atmen und pulsieren gelernt hat.',
    },
    cafe_terrace_at_night: {
      title: 'Caféterrasse am Abend',
      description:
        'Eine Straße wird zur Laterne. Entscheidend ist, Van Goghs Leuchten zu bewahren und die Terrasse dennoch begehbar, warm und körperlich zu machen.',
    },
    water_lilies_japanese_bridge: {
      title: 'Seerosen und japanische Brücke',
      description:
        'Brücke, Wasser, Blätter und Spiegelung lösen sich in Atmosphäre auf. Fotorealismus kann aus Pinselstrichen Feuchtigkeit machen.',
    },
    impression_sunrise: {
      title: 'Impression, Sonnenaufgang',
      description:
        'Eine ganze Bewegung beginnt als Dunst, Wasser und kleine orange Sonne. Fotografisch sollte es sich anfühlen wie die erste Sekunde des Morgens.',
    },
    great_wave_off_kanagawa: {
      title: 'Die große Welle vor Kanagawa',
      description:
        'Die Welle ist Muster und Katastrophe zugleich. Fotoreal wird aus grafischer Gewissheit Maßstab, Gischt und Gefahr.',
    },
    wanderer_above_the_sea_of_fog: {
      title: 'Wanderer über dem Nebelmeer',
      description:
        'Ein Rücken wird zur Einladung ins Weite. Das Bild ist fast schon ein Filmstill; fotoreal muss der Nebel atmen.',
    },
    birth_of_venus: {
      title: 'Die Geburt der Venus',
      description:
        'Eine mythologische Ankunft, inszeniert mit unmöglicher Grazie. Fotoreal werden Muschel, Wind, Meer und Körper wieder verletzlich.',
    },
    las_meninas: {
      title: 'Las Meninas',
      description:
        'Ein königlicher Raum macht das Schauen selbst zum Drama. Als Fotografie könnte dieses Meta-Theater wirken wie ein Blick hinter die Kulissen, den es nicht geben dürfte.',
    },
    the_kiss: {
      title: 'Der Kuss',
      description:
        'Goldenes Ornament wird zu Nähe unter Druck. Die Neuinszenierung muss den rituellen Glanz halten, ohne menschliche Wärme zu verlieren.',
    },
    the_scream: {
      title: 'Der Schrei',
      description:
        'Angst wird Landschaft. Fotoreal verliert der Schrei Symbolik und wird körperlich, wie Panik, die vom Wetter erwischt wird.',
    },
    liberty_leading_the_people: {
      title: 'Die Freiheit führt das Volk',
      description:
        'Allegorie stürmt durch Rauch, als wäre sie Nachrichtenmaterial. Dieses Bild will historisches Kino werden, keine Kostümillustration.',
    },
    raft_of_the_medusa: {
      title: 'Das Floß der Medusa',
      description:
        'Menschliche Verzweiflung türmt sich gegen das Meer. Fotoreal muss es brutal, nass, eng und unerträglich nah werden.',
    },
    paris_street_rainy_day: {
      title: 'Straße in Paris an einem regnerischen Tag',
      description:
        'Nasser Stein, Schirme, Fassaden und vorbeiziehende Fremde machen die Stadt zur Filmszene, bevor es Kino gab. Fotoreal wird jeder Reflex zu frischem Wetter.',
    },
    la_grande_jatte: {
      title: 'Ein Sonntagnachmittag auf der Insel La Grande Jatte',
      description:
        'Ein Park voller Menschen wird zur präzisen sozialen Maschine. Fotoreal wird aus pointillistischer Distanz echte Hitze, Schatten, Etikette und Stille.',
    },
    luncheon_of_the_boating_party: {
      title: 'Das Frühstück der Ruderer',
      description:
        'Glas, Stoff, Gesichter, Flussluft und Tischchaos machen Freizeit körperlich. Die Neuinszenierung soll dicht, sonnenwarm und belauscht wirken.',
    },
    the_ballet_class: {
      title: 'Die Tanzklasse',
      description:
        'Nicht Auftritt, sondern Probe: Spiegel, Tüll, Dielen, Müdigkeit und Autorität. Fotoreal wird die Disziplin hinter der Bühne stärker als das Spektakel.',
    },
    the_floor_scrapers: {
      title: 'Die Parkettschleifer',
      description:
        'Ein leerer Raum wird zu Rhythmus, Arbeit, Lack und Licht. Das unscheinbarste Bild des Raums kann fotoreal am härtesten treffen.',
    },
    boulevard_saint_denis_paris: {
      title: 'Der Boulevard Saint-Denis, Paris',
      description:
        'Eine Pariser Straße füllt sich mit Schaufenstern, Kutschen, Zylindern, Arbeitern und weichem Verkehr. Der Raum bekommt eine lebendige Menge, ohne chaotisch zu werden.',
    },
    the_artists_garden_at_vetheuil: {
      title: 'Der Garten des Künstlers in Vétheuil',
      description:
        'Ein Garten wird Architektur, Hitze, Kindheit und Farbe zugleich. Fotoreal soll der Weg sonnenhell und fast zu intensiv zum Betreten wirken.',
    },
    sunflowers: {
      title: 'Sonnenblumen',
      description:
        'Gelb ist hier nicht freundlich, sondern körperlich: trockene Blätter, raue Wand, schwere Köpfe, Keramikglanz. Nah genug, dass man die Stiele fast riecht.',
    },
    irises: {
      title: 'Schwertlilien',
      description:
        'Blaue Blüten drücken sich durch Erde und grüne Klingen wie ein lebendes Muster. Fotoreal wird daraus Textur, Tiefe und nervöse Farbe.',
    },
    snow_at_louveciennes: {
      title: 'Schnee in Louveciennes',
      description:
        'Schnee senkt jedes Geräusch und macht aus einer Dorfstraße Atmosphäre. Die Neuinszenierung hält kalte Luft, weiche Schritte und private Winterstille.',
    },
    the_basket_of_apples: {
      title: 'Der Apfelkorb',
      description:
        'Früchte, Tuch, Korb, Glas und Tischkanten wollen nicht stillhalten. Fotoreal wird diese Instabilität weniger Stil als Wahrnehmung unter Druck.',
    },
    tiger_in_a_tropical_storm: {
      title: 'Tiger in einem tropischen Sturm',
      description:
        'Blätter, Blitz, Regen und Tierkörper verdichten sich zu theatralischem Wetter. Der stille Raum bekommt eine elektrische Kante, ohne zur menschlichen Kampfszene zu werden.',
    },
  },
};

const generatedArtworkCopy = {
  de: {
    artist: 'Fotorealistische KI-Studie',
    description:
      'Eine lokale fotorealistische Neuinterpretation für diesen Raum. Wenn sie ein kuratiertes Werk ersetzen soll, benenne die Datei nach der passenden Werk-ID.',
  },
  en: {
    artist: 'Photorealistic AI Study',
    description:
      'A generated photorealistic reinterpretation staged for this room. Rename the file to match a known artwork id when it should replace a curated piece.',
  },
};

export function localizeGallery(gallery, language) {
  const normalizedLanguage = normalizeLanguage(language);
  const identityCopy = identityTranslations[normalizedLanguage] ?? {};
  const roomCopy = roomTranslations[normalizedLanguage] ?? {};
  const artworkCopy = artworkTranslations[normalizedLanguage] ?? {};

  return {
    ...gallery,
    identity: {
      ...gallery.identity,
      ...identityCopy,
    },
    rooms: gallery.rooms.map((room) => ({
      ...room,
      ...(roomCopy[room.id] ?? {}),
      artworks: room.artworks.map((artwork) => {
        const generatedCopy = artwork.id.startsWith('local_') ? generatedArtworkCopy[normalizedLanguage] : {};

        return {
          ...artwork,
          ...generatedCopy,
          ...(artworkCopy[artwork.id] ?? {}),
        };
      }),
    })),
  };
}

const legalCopy = {
  de: {
    summary: 'Impressum & Datenschutz',
    sections: [
      {
        level: 2,
        title: 'Impressum',
        paragraphs: [{ strong: 'Angaben gemäß § 5 DDG' }],
      },
      {
        paragraphs: [
          {
            lines: ['Marlon Kaulich', 'Schlegelstr. 11', '30625 Hannover', 'Deutschland'],
          },
        ],
      },
      {
        level: 3,
        title: 'Kontakt',
        paragraphs: [{ lines: ['Tel.: +49 (0) 176 61904357', 'E-Mail: marloc55@yahoo.de'] }],
      },
      {
        level: 2,
        title: 'Datenschutzerklärung',
      },
      {
        level: 3,
        title: '1. Verantwortlicher',
        paragraphs: [
          {
            text: 'Verantwortlicher im Sinne der Datenschutz-Grundverordnung ist Marlon Kaulich, Schlegelstr. 11, 30625 Hannover, Deutschland.',
          },
        ],
      },
      {
        level: 3,
        title: '2. Datenverarbeitung',
        paragraphs: [
          {
            text: 'Diese Website ist als statische Galerie konzipiert. Es werden keine Cookies gesetzt, keine Tracking-Dienste eingebunden, keine externen Analysewerkzeuge verwendet und keine externen Schriftarten geladen. Die Darstellung nutzt lokal verfügbare Systemschriften. Alle angezeigten Bilddateien werden lokal aus dieser Website ausgeliefert; es werden keine externen Bild- oder Schriftserver eingebunden.',
          },
        ],
      },
      {
        level: 3,
        title: '3. Lokale Spracheinstellung',
        paragraphs: [
          {
            text: 'Wenn Sie die Sprache wechseln, speichert die Website die gewählte Sprache lokal in Ihrem Browser unter dem Schlüssel inner-aiye-language. Diese Information wird nicht automatisch an uns übertragen und dient ausschließlich dazu, die gewünschte Sprache beim nächsten Besuch wiederherzustellen. Sie können den Eintrag jederzeit über die Browserdaten löschen. Rechtsgrundlage für die Speicherung auf Ihrem Endgerät ist § 25 Abs. 2 Nr. 2 TDDDG; soweit dabei personenbezogene Daten verarbeitet werden, erfolgt dies auf Grundlage von Art. 6 Abs. 1 lit. f DSGVO.',
          },
        ],
      },
      {
        level: 3,
        title: '4. Hosting und Server-Logs',
        paragraphs: [
          {
            text: 'Diese Website wird bei der wint.global GmbH, In der Steele 35, 40599 Düsseldorf, Deutschland, gehostet. Beim Aufruf der Website kann der Hosting-Anbieter technisch notwendige Zugriffsdaten wie IP-Adresse, Datum und Uhrzeit des Zugriffs, aufgerufene Datei, Referrer-URL, Browsertyp, Browserversion, Betriebssystem und Hostname in Server-Logfiles verarbeiten. Die Verarbeitung dient der technischen Bereitstellung, Sicherheit und Stabilität der Website und erfolgt auf Grundlage von Art. 6 Abs. 1 lit. f DSGVO. Die Speicherdauer richtet sich nach den beim Hosting-Anbieter vereinbarten beziehungsweise technisch konfigurierten Löschfristen; eine längere Speicherung erfolgt nur, soweit dies zur Abwehr von Angriffen oder zur Aufklärung sicherheitsrelevanter Vorfälle erforderlich ist.',
          },
          {
            text: 'Soweit wint.global personenbezogene Daten in unserem Auftrag verarbeitet, erfolgt dies auf Grundlage eines Vertrags zur Auftragsverarbeitung gemäß Art. 28 DSGVO.',
          },
        ],
      },
      {
        level: 3,
        title: '5. Rechte betroffener Personen',
        paragraphs: [
          {
            text: 'Sie haben nach Maßgabe der DSGVO insbesondere das Recht auf Auskunft, Berichtigung, Löschung, Einschränkung der Verarbeitung, Datenübertragbarkeit und Widerspruch gegen die Verarbeitung personenbezogener Daten. Zur Ausübung Ihrer Rechte wenden Sie sich bitte an die oben genannte E-Mail-Adresse.',
          },
        ],
      },
      {
        level: 3,
        title: '6. Beschwerderecht',
        paragraphs: [
          {
            text: 'Sie haben das Recht, sich bei einer Datenschutz-Aufsichtsbehörde zu beschweren. Für den Verantwortlichen ist regelmäßig der Landesbeauftragte für den Datenschutz Niedersachsen, Prinzenstraße 5, 30159 Hannover, poststelle@lfd.niedersachsen.de, zuständig.',
          },
        ],
      },
      {
        level: 3,
        title: '7. KI-Hinweis',
        paragraphs: [
          {
            text: 'Die gezeigten Bilder sind fotoreale Studien beziehungsweise KI-Neuinterpretationen gemeinfreier Kunstwerke. Sie sind als KI-generierte oder KI-bearbeitete Darstellungen gekennzeichnet und nicht als originale Museumsabbildungen zu verstehen.',
          },
        ],
      },
      {
        level: 3,
        title: '8. Quellenhinweis',
        paragraphs: [
          {
            text: 'Die referenzierten Ausgangswerke sind gemeinfreie Kunstwerke. Die Website zeigt lokale KI-Neuinterpretationen und speichert Quellenangaben nur als interne Metadaten, ohne beim Betrachten externe Quellenserver anzufragen.',
          },
        ],
      },
      {
        level: 3,
        title: '9. Stand',
        paragraphs: [
          {
            text: 'Stand dieser Datenschutzerklärung: Mai 2026.',
          },
        ],
      },
    ],
  },
  en: {
    summary: 'Imprint & Privacy',
    sections: [
      {
        level: 2,
        title: 'Imprint',
        paragraphs: [{ strong: 'Information according to Section 5 DDG' }],
      },
      {
        paragraphs: [
          {
            lines: ['Marlon Kaulich', 'Schlegelstr. 11', '30625 Hannover', 'Germany'],
          },
        ],
      },
      {
        level: 3,
        title: 'Contact',
        paragraphs: [{ lines: ['Phone: +49 (0) 176 61904357', 'Email: marloc55@yahoo.de'] }],
      },
      {
        level: 2,
        title: 'Privacy Policy',
      },
      {
        level: 3,
        title: '1. Controller',
        paragraphs: [
          {
            text: 'The controller under the General Data Protection Regulation is Marlon Kaulich, Schlegelstr. 11, 30625 Hannover, Germany.',
          },
        ],
      },
      {
        level: 3,
        title: '2. Data Processing',
        paragraphs: [
          {
            text: 'This website is designed as a static gallery. It does not set cookies, embed tracking services, use external analytics tools, or load external web fonts. The presentation uses locally available system fonts. All displayed image files are served locally from this website; no external image or font servers are contacted while viewing the gallery.',
          },
        ],
      },
      {
        level: 3,
        title: '3. Local Language Preference',
        paragraphs: [
          {
            text: 'If you switch the language, the website stores the selected language locally in your browser under the key inner-aiye-language. This information is not automatically transmitted to us and is used only to restore your selected language on a later visit. You can delete it at any time through your browser data settings. The legal basis for storing this information on your device is Section 25(2) No. 2 TDDDG; where personal data is processed, the processing is based on Article 6(1)(f) GDPR.',
          },
        ],
      },
      {
        level: 3,
        title: '4. Hosting and Server Logs',
        paragraphs: [
          {
            text: 'This website is hosted by wint.global GmbH, In der Steele 35, 40599 Düsseldorf, Germany. When the website is accessed, the hosting provider may process technically necessary access data such as IP address, date and time of access, requested file, referrer URL, browser type, browser version, operating system, and hostname in server log files. This processing serves the technical delivery, security, and stability of the website and is based on Article 6(1)(f) GDPR. The retention period depends on the deletion periods agreed with or technically configured at the hosting provider; longer retention occurs only where necessary to defend against attacks or investigate security incidents.',
          },
          {
            text: 'Where wint.global processes personal data on our behalf, this is done on the basis of a data processing agreement under Article 28 GDPR.',
          },
        ],
      },
      {
        level: 3,
        title: '5. Data Subject Rights',
        paragraphs: [
          {
            text: 'Subject to the GDPR, you have rights including access, rectification, erasure, restriction of processing, data portability, and objection to the processing of personal data. To exercise your rights, please contact the email address stated above.',
          },
        ],
      },
      {
        level: 3,
        title: '6. Right to Lodge a Complaint',
        paragraphs: [
          {
            text: 'You have the right to lodge a complaint with a data protection supervisory authority. The regular supervisory authority for the controller is Der Landesbeauftragte für den Datenschutz Niedersachsen, Prinzenstraße 5, 30159 Hannover, poststelle@lfd.niedersachsen.de.',
          },
        ],
      },
      {
        level: 3,
        title: '7. AI Disclosure',
        paragraphs: [
          {
            text: 'The images shown are photoreal studies or AI reinterpretations of public-domain artworks. They are marked as AI-generated or AI-edited representations and should not be understood as original museum reproductions.',
          },
        ],
      },
      {
        level: 3,
        title: '8. Source Note',
        paragraphs: [
          {
            text: 'The referenced source works are public-domain artworks. The website displays local AI reinterpretations and stores source notes only as internal metadata, without requesting external source servers while the gallery is viewed.',
          },
        ],
      },
      {
        level: 3,
        title: '9. Last Updated',
        paragraphs: [
          {
            text: 'This privacy policy was last updated in May 2026.',
          },
        ],
      },
    ],
  },
};

export const uiCopy = {
  de: {
    pageTitle: 'KI GENERATOR',
    metaDescription:
      'KI GENERATOR - Eine fotorealistische Neuinterpretation bekannter Meisterwerke',
    galleryIdentityLabel: 'Galerie-Identität',
    productHeadline: 'Meisterwerke in Fotorealismus',
    roomCounter: (roomIndex, roomCount) =>
      `Raum ${String(roomIndex).padStart(2, '0')} / ${String(roomCount).padStart(2, '0')}`,
    openArtwork: (artwork) => `${artwork.title} von ${artwork.artist} öffnen, ${artwork.year}`,
    artworkAlt: (artwork) => `${artwork.title} von ${artwork.artist}`,
    firstGallery: 'Erster Raum',
    finalGallery: 'Letzter Raum',
    previousRoom: 'Vorheriger Raum',
    nextRoom: 'Nächster Raum',
    previous: 'Zurück',
    next: 'Weiter',
    openArtRooms: 'Kunsträume öffnen',
    closeArtRooms: 'Kunsträume schließen',
    artRooms: 'Kunsträume',
    roomLabel: 'Raum',
    includingArtist: (artist) => `u.a. ${artist}`,
    roomGalleryLabel: (roomName) => `${roomName} Ausstellungsraum`,
    closeArtworkDetail: 'Werkdetails schließen',
    artworkDetailNavigation: 'Navigation im Werkdetail',
    footerSource: 'KI-Neuinterpretation mit Fotorealismus',
    languageToggleLabel: 'Sprache wählen',
    languageNames: {
      de: 'Deutsch',
      en: 'English',
    },
    languageOptionLabel: (languageLabel, isActive) =>
      isActive ? `${languageLabel} ausgewählt` : `Zu ${languageLabel} wechseln`,
    legal: legalCopy.de,
  },
  en: {
    pageTitle: 'KI GENERATOR',
    metaDescription:
      'KI GENERATOR - A photorealistic reinterpretation of famous masterworks',
    galleryIdentityLabel: 'Gallery identity',
    productHeadline: 'Masterworks in Photorealism',
    roomCounter: (roomIndex, roomCount) =>
      `Room ${String(roomIndex).padStart(2, '0')} / ${String(roomCount).padStart(2, '0')}`,
    openArtwork: (artwork) => `Open ${artwork.title} by ${artwork.artist}, ${artwork.year}`,
    artworkAlt: (artwork) => `${artwork.title} by ${artwork.artist}`,
    firstGallery: 'First Gallery',
    finalGallery: 'Final Gallery',
    previousRoom: 'Previous room',
    nextRoom: 'Next room',
    previous: 'Previous',
    next: 'Next',
    openArtRooms: 'Open art rooms',
    closeArtRooms: 'Close art rooms',
    artRooms: 'Art Rooms',
    roomLabel: 'Room',
    includingArtist: (artist) => `incl. ${artist}`,
    roomGalleryLabel: (roomName) => `${roomName} gallery room`,
    closeArtworkDetail: 'Close artwork detail',
    artworkDetailNavigation: 'Artwork detail navigation',
    footerSource: 'AI reinterpretation with photorealism',
    languageToggleLabel: 'Choose language',
    languageNames: {
      de: 'German',
      en: 'English',
    },
    languageOptionLabel: (languageLabel, isActive) =>
      isActive ? `${languageLabel} selected` : `Switch to ${languageLabel}`,
    legal: legalCopy.en,
  },
};

export function getLanguageCopy(language) {
  return uiCopy[normalizeLanguage(language)];
}
