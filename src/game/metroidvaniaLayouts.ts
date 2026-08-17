import type { Platform, Point, SecretArea } from './types';

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
  reverse?: boolean;
  secretNames?: [string, string];
};

const surface = (x: number, y: number, w: number, dropThrough = true): Platform => (
  { x, y, w, h: 20, scenery: 'wood', dropThrough }
);

export function makeRoom(options: RoomOptions = {}): RoomLayout {
  const names = options.secretNames ?? ['The Drawer Hollow', 'Under the Bed'];
  const room: RoomLayout = {
    width: 3000,
    height: 2500,
    backgroundHeight: 2000,
    spawn: { x: 80, y: 1435 },
    secrets: [
      {
        name: names[0],
        entrance: { x: 505, y: 1855, w: 130, h: 30 },
        trigger: { x: 90, y: 1920, w: 970, h: 500 },
        room: { x: 90, y: 1870, w: 970, h: 550 },
        kind: 'drawer',
      },
      {
        name: names[1],
        entrance: { x: 2480, y: 1855, w: 180, h: 30 },
        trigger: { x: 1930, y: 1920, w: 980, h: 500 },
        room: { x: 1930, y: 1870, w: 980, h: 550 },
        kind: 'underbed',
      },
    ],
    platforms: [
      surface(0, 1905, 505, false), surface(505, 1905, 130),
      surface(635, 1905, 1845, false), surface(2480, 1905, 180),
      surface(2660, 1905, 340, false),
      surface(0, 1500, 1110), surface(180, 1690, 280), surface(1130, 1465, 190),
      surface(0, 1315, 1700), surface(1700, 1315, 1300),
      surface(990, 1180, 650), surface(1620, 1135, 1300),
      surface(0, 1138, 900), surface(0, 965, 1100), surface(0, 800, 1100),
      surface(0, 568, 1470), surface(360, 283, 1110),
      surface(2035, 345, 365), surface(2220, 315, 760),
      surface(2035, 568, 965), surface(2120, 825, 690),
      surface(1740, 795, 200),
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

  return options.reverse ? reverseRoom(room) : room;
}

function reverseRoom(room: RoomLayout): RoomLayout {
  const mirrorRect = <T extends { x: number; w: number }>(rect: T): T => (
    { ...rect, x: room.width - rect.x - rect.w }
  );

  return {
    ...room,
    spawn: { ...room.spawn, x: room.width - room.spawn.x - 48 },
    secrets: room.secrets.map((secret) => ({
      ...secret,
      entrance: mirrorRect(secret.entrance),
      trigger: mirrorRect(secret.trigger),
      room: mirrorRect(secret.room),
    })),
    platforms: room.platforms.map(mirrorRect),
    stars: room.stars.map((star) => ({ ...star, x: room.width - star.x })),
    enemies: room.enemies.map((enemy) => ({ ...enemy, x: room.width - enemy.x - 48 })),
    exit: { ...room.exit, x: room.width - room.exit.x - 80 },
  };
}
