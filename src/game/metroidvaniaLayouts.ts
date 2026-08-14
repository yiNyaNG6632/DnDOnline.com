import type { Platform, Point, SecretArea } from './types';

export type RoomLayout = {
  width: number;
  height: number;
  spawn: Point;
  secrets: SecretArea[];
  platforms: Platform[];
  stars: Point[];
  enemies: Point[];
  exit: Point;
};

const surface = (x: number, y: number, w: number, dropThrough = true): Platform => (
  { x, y, w, h: 20, scenery: 'wood', dropThrough }
);

export function makeRoom(): RoomLayout {
  return {
    width: 3000,
    height: 2500,
    spawn: { x: 80, y: 1435 },
    secrets: [
      {
        name: 'The Drawer Hollow',
        entrance: { x: 505, y: 1855, w: 130, h: 30 },
        trigger: { x: 90, y: 1920, w: 970, h: 500 },
        room: { x: 90, y: 1870, w: 970, h: 550 },
        kind: 'drawer',
      },
      {
        name: 'Under the Bed',
        entrance: { x: 2480, y: 1855, w: 180, h: 30 },
        trigger: { x: 1930, y: 1920, w: 980, h: 500 },
        room: { x: 1930, y: 1870, w: 980, h: 550 },
        kind: 'underbed',
      },
    ],
    platforms: [
      surface(0, 1870, 505, false), surface(505, 1870, 130),
      surface(635, 1870, 1845, false), surface(2480, 1870, 180),
      surface(2660, 1870, 340, false),
      surface(0, 1510, 1110), surface(180, 1690, 280), surface(1130, 1415, 190),
      surface(0, 1315, 1700), surface(1700, 1315, 1300),
      surface(1070, 1090, 620), surface(1680, 1090, 1170),
      surface(0, 1110, 900), surface(0, 895, 910), surface(0, 675, 960),
      surface(590, 1090, 510), surface(590, 900, 355), surface(590, 705, 355),
      surface(590, 570, 355), surface(360, 285, 1110),
      surface(2020, 380, 405), surface(2220, 315, 760),
      surface(2190, 605, 780), surface(2260, 875, 610),
      surface(1810, 820, 360), surface(1780, 600, 360),
      surface(1130, 650, 610), surface(1250, 520, 370),
      surface(1190, 1580, 150), surface(1130, 1690, 170), surface(1110, 1790, 180),
      surface(2680, 1770, 200), surface(2720, 1620, 180), surface(2750, 1450, 160),
      surface(90, 2390, 970, false), surface(270, 2255, 180),
      surface(500, 2120, 180), surface(690, 1990, 180),
      surface(1930, 2390, 980, false), surface(2700, 2255, 170),
      surface(2470, 2120, 180), surface(2260, 1990, 180),
    ],
    stars: [{ x: 690, y: 510 }, { x: 350, y: 2200 }, { x: 2800, y: 2200 }],
    enemies: [{ x: 370, y: 1460 }, { x: 1420, y: 1260 }, { x: 2240, y: 1040 }, { x: 2650, y: 1820 }],
    exit: { x: 2840, y: 190 },
  };
}
