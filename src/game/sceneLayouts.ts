import type { Platform, Point, SecretArea } from './types';

type ScenePattern = 'steps' | 'climb' | 'zigzag';

type SceneOptions = {
  pattern: ScenePattern;
  reverse?: boolean;
};

type SceneLayout = {
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

const WIDTH = 1000;
const ledge = (x: number, y: number, w: number): Platform => (
  { x, y, w, h: 18, scenery: 'wood', dropThrough: true, visible: true }
);

const patterns: Record<ScenePattern, Platform[]> = {
  steps: [ledge(170, 480, 180), ledge(420, 385, 170), ledge(680, 290, 170), ledge(430, 190, 180)],
  climb: [ledge(140, 485, 160), ledge(350, 420, 150), ledge(560, 330, 160), ledge(350, 240, 150), ledge(650, 165, 180)],
  zigzag: [ledge(180, 470, 200), ledge(500, 465, 170), ledge(720, 365, 170), ledge(480, 280, 170), ledge(220, 195, 180)],
};

export function makeSceneRoom({ pattern, reverse = false }: SceneOptions): SceneLayout {
  const ledges = patterns[pattern].map((platform) => ({ ...platform }));
  const last = ledges[ledges.length - 1];
  const room: SceneLayout = {
    width: WIDTH,
    height: 650,
    backgroundHeight: 650,
    spawn: { x: 70, y: 528 },
    secrets: [],
    platforms: [{ x: 0, y: 590, w: WIDTH, h: 20, scenery: 'floor', dropThrough: false }, ...ledges],
    stars: [
      pointAbove(ledges[0]),
      pointAbove(ledges[Math.floor(ledges.length / 2)]),
      pointAbove(last),
    ],
    enemies: [{ x: 390, y: 540 }, { x: 780, y: 540 }],
    exit: { x: last.x + last.w / 2 - 40, y: last.y - 120 },
  };
  return reverse ? reverseScene(room) : room;
}

function pointAbove(platform: Platform): Point {
  return { x: platform.x + platform.w / 2, y: platform.y - 38 };
}

function reverseScene(room: SceneLayout): SceneLayout {
  return {
    ...room,
    spawn: { ...room.spawn, x: WIDTH - room.spawn.x - 48 },
    platforms: room.platforms.map((platform) => ({
      ...platform, x: WIDTH - platform.x - platform.w,
    })),
    stars: room.stars.map((star) => ({ ...star, x: WIDTH - star.x })),
    enemies: room.enemies.map((enemy) => ({ ...enemy, x: WIDTH - enemy.x - 48 })),
    exit: { ...room.exit, x: WIDTH - room.exit.x - 80 },
  };
}
