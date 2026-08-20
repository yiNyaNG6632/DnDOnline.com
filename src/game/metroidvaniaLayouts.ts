import { getLevelSurfaces } from './levelSurfaces';
import type { EnemyTheme, Platform, Point, SecretArea } from './types';

export type RoomLayout = {
  width: number;
  height: number;
  backgroundHeight: number;
  spawn: Point;
  secrets: SecretArea[];
  platforms: Platform[];
  stars: Point[];
  enemies: Point[];
  exit: Point;
};

type RoomOptions = {
  theme: EnemyTheme;
  reverse?: boolean;
  secretNames?: [string, string];
};

const surface = (x: number, y: number, w: number, dropThrough = true): Platform => (
  { x, y, w, h: 20, scenery: 'wood', dropThrough }
);

const WORLD_WIDTH = 3000;
const BACKGROUND_HEIGHT = 2000;
const SURFACE_SCALE_X = WORLD_WIDTH / 1000;
const SURFACE_SCALE_Y = BACKGROUND_HEIGHT / 650;

function scaleSurface(platform: Platform): Platform {
  return {
    ...platform,
    x: Math.round(platform.x * SURFACE_SCALE_X),
    y: Math.round(platform.y * SURFACE_SCALE_Y),
    w: Math.round(platform.w * SURFACE_SCALE_X),
    h: platform.dropThrough === false ? Math.round(platform.h * SURFACE_SCALE_Y) : 20,
  };
}

export function makeRoom(options: RoomOptions): RoomLayout {
  const names = options.secretNames ?? ['The Drawer Hollow', 'Under the Bed'];
  const mainSurfaces = getLevelSurfaces(options.theme).map(scaleSurface);
  const topSurface = mainSurfaces.reduce((highest, platform) => (
    platform.y < highest.y ? platform : highest
  ));
  const room: RoomLayout = {
    width: WORLD_WIDTH,
    height: 2500,
    backgroundHeight: BACKGROUND_HEIGHT,
    spawn: { x: options.reverse ? 2850 : 80, y: 1753 },
    secrets: [
      {
        name: names[0],
        entrance: { x: 420, y: 1785, w: 300, h: 30 },
        trigger: { x: 90, y: 1870, w: 970, h: 550 },
        room: { x: 90, y: 1870, w: 970, h: 550 },
        kind: 'drawer',
      },
      {
        name: names[1],
        entrance: { x: 2280, y: 1785, w: 300, h: 30 },
        trigger: { x: 1930, y: 1870, w: 980, h: 550 },
        room: { x: 1930, y: 1870, w: 980, h: 550 },
        kind: 'underbed',
      },
    ],
    platforms: [
      surface(0, 1815, 420, false), surface(420, 1815, 300),
      surface(720, 1815, 1560, false), surface(2280, 1815, 300),
      surface(2580, 1815, 420, false), ...mainSurfaces,
      surface(90, 2390, 970, false), surface(270, 2255, 180),
      surface(500, 2120, 180), surface(690, 1990, 180),
      surface(1930, 2390, 980, false), surface(2700, 2255, 170),
      surface(2470, 2120, 180), surface(2260, 1990, 180),
    ],
    stars: [
      { x: topSurface.x + topSurface.w / 2, y: topSurface.y - 42 },
      { x: 350, y: 2200 }, { x: 2800, y: 2200 },
    ],
    enemies: [{ x: 370, y: 1750 }, { x: 1420, y: 1750 }, { x: 2240, y: 1750 }],
    exit: { x: options.reverse ? 80 : 2840, y: 1690 },
  };
  return room;
}
