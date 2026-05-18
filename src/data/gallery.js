export const gallery = {
  rooms: [
    {
      id: 'room_1',
      index: 1,
      name: 'The Quiet Wall',
      nextRoom: 'room_2',
      previousRoom: null,
      artworks: [
        {
          id: 'art_of_painting',
          title: 'The Art of Painting',
          artist: 'Johannes Vermeer',
          year: '1666-1668',
          imageUrl:
            'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5e/Jan_Vermeer_-_The_Art_of_Painting_-_Google_Art_Project.jpg/960px-Jan_Vermeer_-_The_Art_of_Painting_-_Google_Art_Project.jpg',
          description:
            'Vermeer stages painting itself as theatre: a map, a model, a painter seen from behind, and light that turns craft into ceremony.',
          format: 'portrait',
          position: { x: '24%', y: '28%', width: '120px', scale: 0.9, tilt: '0.5deg' },
        },
        {
          id: 'girl_with_pearl',
          title: 'Girl with a Pearl Earring',
          artist: 'Johannes Vermeer',
          year: '1665',
          imageUrl:
            'https://upload.wikimedia.org/wikipedia/commons/thumb/0/0f/1665_Girl_with_a_Pearl_Earring.jpg/960px-1665_Girl_with_a_Pearl_Earring.jpg',
          description:
            'Vermeer turns a glance into an event. The painting has the intimacy of a portrait and the mystery of a scene interrupted, with light catching skin, fabric, and pearl in a few decisive notes.',
          format: 'portrait',
          featured: true,
          position: { x: '50%', y: '43%', width: '238px', scale: 1, tilt: '-0.5deg' },
        },
        {
          id: 'woman_balance',
          title: 'Woman Holding a Balance',
          artist: 'Johannes Vermeer',
          year: '1662-1663',
          imageUrl:
            'https://upload.wikimedia.org/wikipedia/commons/thumb/6/68/Johannes_Vermeer_-_Woman_Holding_a_Balance_-_Google_Art_Project.jpg/960px-Johannes_Vermeer_-_Woman_Holding_a_Balance_-_Google_Art_Project.jpg',
          description:
            'A quiet interior becomes an image of judgment and restraint. The suspended balance and the soft light give the moment moral weight.',
          format: 'portrait',
          position: { x: '31%', y: '60%', width: '198px', scale: 1, tilt: '-0.8deg' },
        },
        {
          id: 'view_delft_preview',
          title: 'View of Delft',
          artist: 'Johannes Vermeer',
          year: '1660-1661',
          imageUrl:
            'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a2/Vermeer-view-of-delft.jpg/960px-Vermeer-view-of-delft.jpg',
          description:
            'A city becomes atmosphere. Vermeer balances cloud, water, wall, and reflection so carefully that the ordinary skyline feels newly discovered.',
          format: 'landscape',
          position: { x: '49%', y: '74%', width: '160px', scale: 0.92, tilt: '-0.6deg' },
        },
        {
          id: 'syndics_preview',
          title: 'The Sampling Officials',
          artist: 'Rembrandt van Rijn',
          year: '1662',
          imageUrl:
            'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e5/Rembrandt_-_De_Staalmeesters_-_The_Syndics_of_the_Clothmaker%27s_Guild.jpg/960px-Rembrandt_-_De_Staalmeesters_-_The_Syndics_of_the_Clothmaker%27s_Guild.jpg',
          description:
            'A committee looks up from business and catches the viewer entering the room. The composition is economical, direct, and socially precise.',
          format: 'landscape',
          position: { x: '69%', y: '54%', width: '250px', scale: 1, tilt: '0.5deg' },
        },
        {
          id: 'milkmaid',
          title: 'The Milkmaid',
          artist: 'Johannes Vermeer',
          year: '1657-1658',
          imageUrl:
            'https://upload.wikimedia.org/wikipedia/commons/thumb/2/20/Johannes_Vermeer_-_Het_melkmeisje_-_Google_Art_Project.jpg/960px-Johannes_Vermeer_-_Het_melkmeisje_-_Google_Art_Project.jpg',
          description:
            'A domestic action becomes monumental through stillness. The bread, ceramic, and stream of milk are held in a quiet geometry that makes ordinary labor feel ceremonial.',
          format: 'portrait',
          position: { x: '75%', y: '70%', width: '112px', scale: 0.92, tilt: '0.9deg' },
        },
        {
          id: 'windmill_preview',
          title: 'The Windmill at Wijk bij Duurstede',
          artist: 'Jacob van Ruisdael',
          year: '1670',
          imageUrl:
            'https://upload.wikimedia.org/wikipedia/commons/thumb/5/53/Jacob_Isaaksz._van_Ruisdael_007.jpg/960px-Jacob_Isaaksz._van_Ruisdael_007.jpg',
          description:
            'Ruisdael gives the Dutch landscape heroic scale without losing weather, water, and working life.',
          format: 'portrait',
          position: { x: '62%', y: '29%', width: '104px', scale: 0.9, tilt: '0.8deg' },
        },
      ],
    },
    {
      id: 'room_2',
      index: 2,
      name: 'Civic Theatre',
      nextRoom: 'room_3',
      previousRoom: 'room_1',
      artworks: [
        {
          id: 'night_watch',
          title: 'The Night Watch',
          artist: 'Rembrandt van Rijn',
          year: '1642',
          imageUrl:
            'https://upload.wikimedia.org/wikipedia/commons/thumb/3/3a/La_ronda_de_noche%2C_por_Rembrandt_van_Rijn.jpg/960px-La_ronda_de_noche%2C_por_Rembrandt_van_Rijn.jpg',
          description:
            'Rembrandt transforms a militia portrait into moving theatre. Figures step through darkness with charged gestures, turning civic display into a drama of light, command, and momentum.',
          format: 'landscape',
          featured: true,
          position: { x: '50%', y: '48%', width: '320px', scale: 1, tilt: '-0.3deg' },
        },
        {
          id: 'syndics',
          title: 'The Sampling Officials',
          artist: 'Rembrandt van Rijn',
          year: '1662',
          imageUrl:
            'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e5/Rembrandt_-_De_Staalmeesters_-_The_Syndics_of_the_Clothmaker%27s_Guild.jpg/960px-Rembrandt_-_De_Staalmeesters_-_The_Syndics_of_the_Clothmaker%27s_Guild.jpg',
          description:
            'A committee looks up from business and catches the viewer entering the room. The composition is economical, direct, and socially precise.',
          format: 'landscape',
          position: { x: '30%', y: '48%', width: '205px', scale: 0.92, tilt: '-0.4deg' },
        },
        {
          id: 'jewish_bride',
          title: 'The Jewish Bride',
          artist: 'Rembrandt van Rijn',
          year: '1665-1669',
          imageUrl:
            'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a2/Rembrandt_-_The_Jewish_Bride_-_WGA19158.jpg/960px-Rembrandt_-_The_Jewish_Bride_-_WGA19158.jpg',
          description:
            "Thick paint and restrained gesture create one of Rembrandt's most humane images of tenderness. Gold, red, and shadow fuse into a private exchange.",
          format: 'portrait',
          position: { x: '70%', y: '48%', width: '150px', scale: 0.96, tilt: '0.4deg' },
        },
      ],
    },
    {
      id: 'room_3',
      index: 3,
      name: 'The Republic at Sea',
      nextRoom: null,
      previousRoom: 'room_2',
      artworks: [
        {
          id: 'view_delft',
          title: 'View of Delft',
          artist: 'Johannes Vermeer',
          year: '1660-1661',
          imageUrl:
            'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a2/Vermeer-view-of-delft.jpg/960px-Vermeer-view-of-delft.jpg',
          description:
            'A city becomes atmosphere. Vermeer balances cloud, water, wall, and reflection so carefully that the ordinary skyline feels newly discovered.',
          format: 'landscape',
          featured: true,
          position: { x: '50%', y: '48%', width: '320px', scale: 1, tilt: '-0.3deg' },
        },
        {
          id: 'windmill',
          title: 'The Windmill at Wijk bij Duurstede',
          artist: 'Jacob van Ruisdael',
          year: '1670',
          imageUrl:
            'https://upload.wikimedia.org/wikipedia/commons/thumb/5/53/Jacob_Isaaksz._van_Ruisdael_007.jpg/960px-Jacob_Isaaksz._van_Ruisdael_007.jpg',
          description:
            'Ruisdael gives the Dutch landscape heroic scale without losing weather, water, and working life. The windmill rises as both structure and national image.',
          format: 'portrait',
          position: { x: '70%', y: '48%', width: '150px', scale: 0.96, tilt: '0.4deg' },
        },
        {
          id: 'still_life',
          title: 'Still Life with a Silver Ewer',
          artist: 'Willem Kalf',
          year: '1655-1660',
          imageUrl:
            'https://upload.wikimedia.org/wikipedia/commons/thumb/c/cb/Willem_Kalf_-_Still-Life_-_WGA12089.jpg/960px-Willem_Kalf_-_Still-Life_-_WGA12089.jpg',
          description:
            'Kalf turns luxury objects into a study of reflection, weight, and appetite. The arrangement feels opulent, but the darkness around it is disciplined and exact.',
          format: 'square',
          position: { x: '30%', y: '48%', width: '165px', scale: 0.92, tilt: '-0.4deg' },
        },
      ],
    },
  ],
};
