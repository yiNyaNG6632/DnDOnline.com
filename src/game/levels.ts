import type { Level, Platform } from './types';

const start: Platform = { x: 0, y: 602, w: 190, h: 28 };

export const levels: Level[] = [
  {
    name: 'The Quiet Bedroom', chapter: 'Room 01', accent: '#ffca68',
    background: '/assets/bedroom-dusk.png',
    platforms: [start, { x: 470, y: 520, w: 180, h: 28 }, { x: 980, y: 400, w: 180, h: 28 },
      { x: 1490, y: 520, w: 190, h: 28 }, { x: 2020, y: 590, w: 180, h: 28 }],
    stars: [{ x: 555, y: 455 }, { x: 1070, y: 335 }, { x: 1585, y: 455 }],
    enemies: [{ x: 1090, y: 360 }, { x: 1600, y: 480 }], exit: { x: 2070, y: 470 },
  },
  {
    name: 'The Rainy Workshop', chapter: 'Room 02', accent: '#b4e29b',
    background: '/assets/craft-room.png',
    platforms: [start, { x: 500, y: 430, w: 155, h: 28 }, { x: 1000, y: 550, w: 170, h: 28 },
      { x: 1510, y: 350, w: 180, h: 28 }, { x: 2020, y: 590, w: 180, h: 28 }],
    stars: [{ x: 575, y: 365 }, { x: 1085, y: 485 }, { x: 1600, y: 285 }],
    enemies: [{ x: 1080, y: 510 }, { x: 1610, y: 310 }], exit: { x: 2070, y: 470 },
  },
  {
    name: 'The Moonlit Attic', chapter: 'Room 03', accent: '#c7b4ff',
    background: '/assets/attic-night.png',
    platforms: [start, { x: 480, y: 340, w: 170, h: 28 }, { x: 990, y: 520, w: 150, h: 28 },
      { x: 1470, y: 300, w: 180, h: 28 }, { x: 1940, y: 470, w: 120, h: 28 },
      { x: 2100, y: 590, w: 100, h: 28 }],
    stars: [{ x: 565, y: 275 }, { x: 1065, y: 455 }, { x: 1560, y: 235 }],
    enemies: [{ x: 1060, y: 480 }, { x: 1560, y: 260 }], exit: { x: 2110, y: 470 },
  },
  {
    name: 'The Clockwork Loft', chapter: 'Room 04', accent: '#f3a6c8',
    background: '/assets/attic-night.png',
    platforms: [start, { x: 450, y: 530, w: 130, h: 28 }, { x: 900, y: 310, w: 150, h: 28 },
      { x: 1370, y: 520, w: 130, h: 28 }, { x: 1820, y: 330, w: 150, h: 28 },
      { x: 2100, y: 590, w: 100, h: 28 }],
    stars: [{ x: 515, y: 465 }, { x: 975, y: 245 }, { x: 1895, y: 265 }],
    enemies: [{ x: 970, y: 270 }, { x: 1435, y: 480 }], exit: { x: 2110, y: 470 },
  },
  {
    name: 'The Forgotten Studio', chapter: 'Room 05', accent: '#77d9d0',
    background: '/assets/craft-room.png',
    platforms: [start, { x: 440, y: 350, w: 125, h: 28 }, { x: 850, y: 560, w: 120, h: 28 },
      { x: 1270, y: 280, w: 130, h: 28 }, { x: 1700, y: 510, w: 125, h: 28 },
      { x: 2090, y: 590, w: 110, h: 28 }],
    stars: [{ x: 500, y: 285 }, { x: 1335, y: 215 }, { x: 1760, y: 445 }],
    enemies: [{ x: 910, y: 520 }, { x: 1335, y: 240 }, { x: 1760, y: 470 }], exit: { x: 2110, y: 470 },
  },
  {
    name: 'The Last Dream', chapter: 'Room 06', accent: '#ff9e73',
    background: '/assets/bedroom-dusk.png',
    platforms: [start, { x: 430, y: 290, w: 110, h: 28 }, { x: 820, y: 540, w: 105, h: 28 },
      { x: 1210, y: 250, w: 110, h: 28 }, { x: 1600, y: 520, w: 105, h: 28 },
      { x: 1980, y: 320, w: 110, h: 28 }, { x: 2100, y: 590, w: 100, h: 28 }],
    stars: [{ x: 485, y: 225 }, { x: 1265, y: 185 }, { x: 2035, y: 255 }],
    enemies: [{ x: 870, y: 500 }, { x: 1265, y: 210 }, { x: 1650, y: 480 }], exit: { x: 2110, y: 470 },
  },
];
