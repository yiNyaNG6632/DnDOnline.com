export type Rect = { x: number; y: number; w: number; h: number };
export type Point = { x: number; y: number };
export type GameMode = 'normal' | 'hard' | 'pve';
export type EnemyTheme = 'bedroom' | 'workshop' | 'attic' | 'clockwork' | 'studio' | 'dream' | 'greenhouse' | 'theatre' | 'storm';

export type Platform = Rect & {
  movable?: boolean;
  moveArea?: { minX: number; maxX: number; minY: number; maxY: number };
};

export type Level = {
  name: string;
  chapter: string;
  hint: string;
  background: string;
  accent: string;
  enemyTheme: EnemyTheme;
  gimmick: string;
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
  splitUsed: boolean;
  splitCount: number;
  facing: number;
  pulse: number;
  slimeSquash: number;
  slimeSquashSpeed: number;
  slimeTilt: number;
};

export type TelekineticObject = Point & {
  vx: number;
  vy: number;
  theme: EnemyTheme;
  phase: number;
};

export type SplitPart = Point & {
  vx: number;
  age: number;
};

export type Weapon = Point & {
  id: number;
  kind: 'mallet' | 'spear';
  vx: number;
  vy: number;
  rotation: number;
  status: 'ready' | 'held' | 'thrown';
  homeX: number;
  homeY: number;
};

export type PveProgress = {
  wave: number;
  totalWaves: number;
  nextWaveIn: number;
  complete: boolean;
};

export type GameState = {
  player: Player;
  platforms: Platform[];
  selectedPlatform: number | null;
  splitPart: SplitPart | null;
  weapons: Weapon[];
  pve: PveProgress | null;
  stars: boolean[];
  enemies: TelekineticObject[];
  won: boolean;
};
