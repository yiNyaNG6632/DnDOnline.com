export type Rect = { x: number; y: number; w: number; h: number };
export type Point = { x: number; y: number };

export type Platform = Rect;

export type Level = {
  name: string;
  chapter: string;
  background: string;
  accent: string;
  platforms: Platform[];
  stars: Point[];
  enemies: Point[];
  exit: Point;
};

export type Player = Rect & {
  vx: number;
  vy: number;
  grounded: boolean;
  canDoubleJump: boolean;
  facing: number;
  pulse: number;
};

export type TelekineticObject = Point & {
  vx: number;
  vy: number;
};

export type GameState = {
  player: Player;
  platforms: Platform[];
  stars: boolean[];
  enemies: TelekineticObject[];
  won: boolean;
};
