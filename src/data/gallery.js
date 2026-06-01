import { applyLocalArtworkCollection, createLocalArtworkCollection } from '../utils/localArtworkCollection.js';

const localArtworkModules = import.meta.glob(
  ['../artworks/**/*.{png,jpg,jpeg,webp,avif,gif}', '!../artworks/**/_*/**'],
  {
    eager: true,
    import: 'default',
    query: '?url',
  },
);

const aiDisclosure = 'Photoreal Study / AI reinterpretation';
const publicDomainRights = 'Public-domain source work; local AI reinterpretation displayed.';

function addRightsMetadata(gallery) {
  return {
    ...gallery,
    rooms: gallery.rooms.map((room) => ({
      ...room,
      artworks: room.artworks.map((artwork) => ({
        ...artwork,
        aiDisclosure,
        sourceWork: {
          provider: artwork.sourceWork?.provider ?? 'Local bundled artwork',
          rights: artwork.sourceWork?.rights ?? publicDomainRights,
          sourceUrl: artwork.sourceWork?.sourceUrl ?? artwork.localImagePath ?? artwork.imageUrl,
        },
      })),
    })),
  };
}

function assertLocalRenderableImages(gallery) {
  const missingImages = gallery.rooms.flatMap((room) =>
    room.artworks
      .filter((artwork) => !artwork.imageUrl)
      .map((artwork) => `${room.id}/${artwork.id}`),
  );

  if (missingImages.length) {
    throw new Error(
      [
        'Renderable artwork images must be supplied as local bundled assets.',
        'Missing local replacement files for:',
        ...missingImages,
      ].join('\n'),
    );
  }

  const remoteImages = gallery.rooms.flatMap((room) =>
    room.artworks
      .filter((artwork) => /^https?:\/\//i.test(artwork.imageUrl))
      .map((artwork) => `${room.id}/${artwork.id}: ${artwork.imageUrl}`),
  );

  if (remoteImages.length) {
    throw new Error(
      [
        'Renderable artwork images must be local for production privacy.',
        'Missing local replacement files for:',
        ...remoteImages,
      ].join('\n'),
    );
  }

  return gallery;
}

export const baseGallery = {
  identity: {
    name: 'KI GENERATOR',
    mark: 'KI GENERATOR',
    indexName: 'Art Rooms',
    collectionLabel: 'Public-Domain Canon',
    footerContext: 'Public-domain masterworks / photoreal prompt canon',
  },
  rooms: [
    {
      id: 'room_1',
      index: 1,
      name: 'Faces That Watch Back',
      thesis: 'Portraits that do not pose. They answer.',
      nextRoom: 'room_2',
      previousRoom: null,
      artworks: [
        {
          id: 'mona_lisa',
          title: 'Mona Lisa',
          artist: 'Leonardo da Vinci',
          year: '1503-1519',
          description:
            'The most famous half-smile in art becomes the perfect test for photoreal ambiguity: portrait, memory, and performance held at the same temperature.',
          format: 'portrait',
          mobileOrder: 3,
          featured: true,
          position: { x: '50%', y: '44%', width: '224px', scale: 1, tilt: '-0.4deg' },
        },
        {
          id: 'girl_with_pearl',
          title: 'Girl with a Pearl Earring',
          artist: 'Johannes Vermeer',
          year: '1665',
          description:
            'A glance turns into a living interruption. In photoreal form, the blue turban, dark room, and pearl become a study in gaze, skin, and silence.',
          format: 'portrait',
          mobileOrder: 2,
          position: { x: '28%', y: '38%', width: '146px', scale: 0.96, tilt: '0.5deg' },
        },
        {
          id: 'arnolfini_portrait',
          title: 'The Arnolfini Portrait',
          artist: 'Jan van Eyck',
          year: '1434',
          description:
            'A domestic room behaves like a contract, a mirror, and a stage. Its objects are so precise that they already feel halfway to a photograph.',
          format: 'portrait',
          position: { x: '76%', y: '40%', width: '138px', scale: 0.95, tilt: '-0.5deg' },
        },
        {
          id: 'american_gothic',
          title: 'American Gothic',
          artist: 'Grant Wood',
          year: '1930',
          description:
            'A national icon built from restraint, posture, and suspicion. Recasting it as a photograph should make the unease more immediate.',
          format: 'portrait',
          mobileOrder: 1,
          position: { x: '68%', y: '60%', width: '132px', scale: 0.92, tilt: '0.25deg' },
        },
        {
          id: 'whistlers_mother',
          title: "Whistler's Mother",
          artist: 'James McNeill Whistler',
          year: '1871',
          description:
            'Severe profile, compressed emotion, and quiet geometry. Photorealism can turn the famous stillness into a room you can almost hear.',
          format: 'landscape',
          position: { x: '35%', y: '82%', width: '174px', scale: 0.9, tilt: '-0.6deg' },
        },
        {
          id: 'a_bar_at_the_folies_bergere',
          title: 'A Bar at the Folies-Bergere',
          artist: 'Edouard Manet',
          year: '1882',
          description:
            'A public room, a private face, and a mirror that refuses to behave. It is one of the best candidates for a cinematic AI restaging.',
          format: 'landscape',
          position: { x: '65%', y: '82%', width: '170px', scale: 0.9, tilt: '0.45deg' },
        },
      ],
    },
    {
      id: 'room_2',
      index: 2,
      name: 'Weather, Water, Night',
      thesis: 'Nature stops being background and becomes pressure.',
      nextRoom: 'room_3',
      previousRoom: 'room_1',
      artworks: [
        {
          id: 'starry_night',
          title: 'The Starry Night',
          artist: 'Vincent van Gogh',
          year: '1889',
          description:
            'The sky moves like weather, memory, and nervous system at once. A photoreal version should feel less like a painting and more like a night that learned to pulse.',
          format: 'landscape',
          featured: true,
          position: { x: '50%', y: '45%', width: '276px', scale: 1, tilt: '-0.3deg' },
        },
        {
          id: 'cafe_terrace_at_night',
          title: 'Cafe Terrace at Night',
          artist: 'Vincent van Gogh',
          year: '1888',
          description:
            'A street becomes a lantern. The challenge is to preserve Van Gogh glow while making the terrace feel physically walkable.',
          format: 'portrait',
          position: { x: '32%', y: '77%', width: '132px', scale: 0.92, tilt: '0.45deg' },
        },
        {
          id: 'water_lilies_japanese_bridge',
          title: 'Water Lilies and Japanese Bridge',
          artist: 'Claude Monet',
          year: '1899',
          description:
            'Bridge, water, leaves, and reflection collapse into atmosphere. Photorealism can make the garden feel like humidity rather than brushwork.',
          format: 'landscape',
          position: { x: '66%', y: '78%', width: '164px', scale: 0.92, tilt: '-0.5deg' },
        },
        {
          id: 'impression_sunrise',
          title: 'Impression, Sunrise',
          artist: 'Claude Monet',
          year: '1872',
          description:
            'A whole movement begins as fog, water, and a small orange disc. In photographic form, it should feel like the first second of morning.',
          format: 'landscape',
          position: { x: '26%', y: '35%', width: '146px', scale: 0.88, tilt: '-0.5deg' },
        },
        {
          id: 'great_wave_off_kanagawa',
          title: 'The Great Wave off Kanagawa',
          artist: 'Katsushika Hokusai',
          year: '1831',
          description:
            'The wave is both pattern and catastrophe. A photoreal version can turn its graphic certainty into scale, spray, and danger.',
          format: 'landscape',
          position: { x: '74%', y: '35%', width: '146px', scale: 0.9, tilt: '0.55deg' },
        },
        {
          id: 'wanderer_above_the_sea_of_fog',
          title: 'Wanderer above the Sea of Fog',
          artist: 'Caspar David Friedrich',
          year: '1818',
          description:
            'A back turned toward us becomes an invitation into vastness. It is almost already a film still; photorealism should make the fog breathe.',
          format: 'portrait',
          position: { x: '50%', y: '80%', width: '132px', scale: 0.92, tilt: '0.25deg' },
        },
      ],
    },
    {
      id: 'room_3',
      index: 3,
      name: 'Myth, Theatre, Shock',
      thesis: 'Bodies, symbols, and catastrophe under stage light.',
      nextRoom: 'room_4',
      previousRoom: 'room_2',
      artworks: [
        {
          id: 'birth_of_venus',
          title: 'The Birth of Venus',
          artist: 'Sandro Botticelli',
          year: '1485',
          description:
            'A mythological arrival staged with impossible grace. Photorealism should make the shell, wind, sea, and bodies feel newly fragile.',
          format: 'landscape',
          featured: true,
          position: { x: '50%', y: '43%', width: '280px', scale: 1, tilt: '-0.25deg' },
        },
        {
          id: 'las_meninas',
          title: 'Las Meninas',
          artist: 'Diego Velazquez',
          year: '1656',
          description:
            'A royal room turns looking itself into drama. As a photograph, its meta-theatre could feel like a behind-the-scenes image that should not exist.',
          format: 'portrait',
          position: { x: '26%', y: '43%', width: '132px', scale: 0.92, tilt: '-0.45deg' },
        },
        {
          id: 'the_kiss',
          title: 'The Kiss',
          artist: 'Gustav Klimt',
          year: '1907-1908',
          description:
            'Gold ornament becomes intimacy under pressure. The photoreal version needs to keep the ceremonial glamour without losing human warmth.',
          format: 'square',
          position: { x: '74%', y: '45%', width: '132px', scale: 0.95, tilt: '0.45deg' },
        },
        {
          id: 'the_scream',
          title: 'The Scream',
          artist: 'Edvard Munch',
          year: '1893',
          description:
            'Anxiety becomes landscape. Photorealism can make the scream less symbolic and more bodily, like a panic attack caught in weather.',
          format: 'portrait',
          position: { x: '31%', y: '75%', width: '132px', scale: 0.92, tilt: '0.55deg' },
        },
        {
          id: 'liberty_leading_the_people',
          title: 'Liberty Leading the People',
          artist: 'Eugene Delacroix',
          year: '1830',
          description:
            'Allegory charges through smoke as if it were news footage. This one should become historical cinema, not costume illustration.',
          format: 'landscape',
          position: { x: '50%', y: '82%', width: '172px', scale: 0.9, tilt: '-0.35deg' },
        },
        {
          id: 'raft_of_the_medusa',
          title: 'The Raft of the Medusa',
          artist: 'Theodore Gericault',
          year: '1818-1819',
          description:
            'Human desperation climbs into a pyramid against the sea. A photoreal version should feel brutal, wet, crowded, and unbearably close.',
          format: 'landscape',
          position: { x: '69%', y: '76%', width: '146px', scale: 0.92, tilt: '0.35deg' },
        },
      ],
    },
    {
      id: 'room_4',
      index: 4,
      name: 'The World as Scene',
      thesis: 'City, leisure, labor, and rehearsal become cinematic social space.',
      nextRoom: 'room_5',
      previousRoom: 'room_3',
      artworks: [
        {
          id: 'paris_street_rainy_day',
          title: 'Paris Street; Rainy Day',
          artist: 'Gustave Caillebotte',
          year: '1877',
          description:
            'Wet pavement, umbrellas, stone facades, and passing strangers turn the city into a film set before cinema. Photorealism can make every reflection feel like fresh weather.',
          format: 'landscape',
          featured: true,
          position: { x: '50%', y: '44%', width: '286px', scale: 1, tilt: '-0.2deg' },
        },
        {
          id: 'la_grande_jatte',
          title: 'A Sunday Afternoon on the Island of La Grande Jatte',
          artist: 'Georges Seurat',
          year: '1884-1886',
          description:
            'A park full of people becomes a precise social machine. In photoreal form, the famous pointillist distance turns into real heat, shade, etiquette, and silence.',
          format: 'landscape',
          position: { x: '27%', y: '43%', width: '156px', scale: 0.9, tilt: '-0.45deg' },
        },
        {
          id: 'luncheon_of_the_boating_party',
          title: 'Luncheon of the Boating Party',
          artist: 'Pierre-Auguste Renoir',
          year: '1880-1881',
          description:
            'Glassware, cloth, faces, river air, and table clutter make leisure feel physical. The restaging should feel crowded, sun-warmed, and overheard.',
          format: 'landscape',
          position: { x: '73%', y: '43%', width: '156px', scale: 0.9, tilt: '0.45deg' },
        },
        {
          id: 'the_ballet_class',
          title: 'The Ballet Class',
          artist: 'Edgar Degas',
          year: '1871-1874',
          description:
            'Practice replaces performance: mirrors, tulle, floorboards, fatigue, and authority. Photorealism can make the backstage discipline sharper than the spectacle.',
          format: 'portrait',
          position: { x: '28%', y: '78%', width: '132px', scale: 0.92, tilt: '0.45deg' },
        },
        {
          id: 'the_floor_scrapers',
          title: 'The Floor Scrapers',
          artist: 'Gustave Caillebotte',
          year: '1875',
          description:
            'A bare room becomes rhythm, effort, varnish, and light. This is the least glamorous image in the room, which is exactly why it can hit hardest in photorealism.',
          format: 'landscape',
          position: { x: '50%', y: '82%', width: '172px', scale: 0.92, tilt: '-0.25deg' },
        },
        {
          id: 'boulevard_saint_denis_paris',
          title: 'The Boulevard Saint-Denis, Paris',
          artist: 'Jean Beraud',
          year: '1880s',
          description:
            'A Paris street fills with shopfronts, carriages, top hats, workers, and soft traffic. It gives the room a living crowd without becoming chaos.',
          format: 'landscape',
          position: { x: '72%', y: '78%', width: '148px', scale: 0.9, tilt: '0.35deg' },
        },
      ],
    },
    {
      id: 'room_5',
      index: 5,
      name: 'Color, Weather, Matter',
      thesis: 'Flowers, snow, fruit, and jungle turn stillness into sensation.',
      nextRoom: null,
      previousRoom: 'room_4',
      artworks: [
        {
          id: 'the_artists_garden_at_vetheuil',
          title: "The Artist's Garden at Vetheuil",
          artist: 'Claude Monet',
          year: '1881',
          description:
            'A garden becomes architecture, heat, childhood, and color at once. Photorealism should make the path feel sunstruck and almost too bright to enter.',
          format: 'portrait',
          featured: true,
          position: { x: '50%', y: '44%', width: '214px', scale: 1, tilt: '-0.2deg' },
        },
        {
          id: 'sunflowers',
          title: 'Sunflowers',
          artist: 'Vincent van Gogh',
          year: '1888',
          description:
            'Yellow stops being cheerful and becomes physical: dry petals, rough wall, heavy heads, ceramic glaze. The image should feel close enough to smell the stems.',
          format: 'portrait',
          position: { x: '27%', y: '43%', width: '132px', scale: 0.92, tilt: '-0.45deg' },
        },
        {
          id: 'irises',
          title: 'Irises',
          artist: 'Vincent van Gogh',
          year: '1889',
          description:
            'Blue flowers push through soil and green blades like a living pattern. In photoreal form, the whole field becomes texture, depth, and nervous color.',
          format: 'landscape',
          position: { x: '73%', y: '43%', width: '156px', scale: 0.9, tilt: '0.45deg' },
        },
        {
          id: 'snow_at_louveciennes',
          title: 'Snow at Louveciennes',
          artist: 'Alfred Sisley',
          year: '1874',
          description:
            'Snow lowers every sound and turns a village lane into atmosphere. The photoreal version should hold cold air, soft footsteps, and a private winter silence.',
          format: 'portrait',
          position: { x: '26%', y: '78%', width: '132px', scale: 0.9, tilt: '0.45deg' },
        },
        {
          id: 'the_basket_of_apples',
          title: 'The Basket of Apples',
          artist: 'Paul Cezanne',
          year: '1893',
          description:
            'Fruit, cloth, wicker, glass, and table edges refuse to sit still. Photorealism can make the instability feel less like style and more like perception under pressure.',
          format: 'landscape',
          position: { x: '50%', y: '82%', width: '172px', scale: 0.92, tilt: '-0.25deg' },
        },
        {
          id: 'tiger_in_a_tropical_storm',
          title: 'Tiger in a Tropical Storm',
          artist: 'Henri Rousseau',
          year: '1891',
          description:
            'Leaves, lightning, rain, and an animal body compress into theatrical weather. It gives the quiet room one electric edge without becoming a human battle scene.',
          format: 'landscape',
          position: { x: '74%', y: '78%', width: '148px', scale: 0.9, tilt: '0.35deg' },
        },
      ],
    },
  ],
};

export const gallery = assertLocalRenderableImages(
  addRightsMetadata(applyLocalArtworkCollection(baseGallery, createLocalArtworkCollection(localArtworkModules))),
);
