export type Rect = { x: number; y: number; w: number; h: number };
export type Point = { x: number; y: number };
export type ControlScheme = 'arrows' | 'wasd';
export type InputMode = 'pc' | 'mobile';
export type EnemyTheme = 'bedroom' | 'workshop' | 'attic' | 'clockwork' | 'studio' | 'dream' | 'greenhouse' | 'theatre' | 'storm';

export type Platform = Rect & {
  movable?: boolean;
  visible?: boolean;
  dropThrough?: boolean;
  scenery?: 'floor' | 'wood' | 'fabric';
  moveArea?: { minX: number; maxX: number; minY: number; maxY: number };
};

export type SecretArea = {
  name: string;
  trigger: Rect;
  entrance: Rect;
  room: Rect;
  kind: 'drawer' | 'underbed';
};

export type Level = {
  name: string;
  chapter: string;
  hint: string;
  background: string;
  backgroundHeight: number;
  accent: string;
  enemyTheme: EnemyTheme;
  gimmick: string;
  width: number;
  height: number;
  spawn: Point;
  secrets: SecretArea[];
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
  health: number;
  invulnerableFrames: number;
  energy: number;
  energyRegenDelay: number;
};

export type TelekineticObject = Point & {
  vx: number;
  vy: number;
  theme: EnemyTheme;
  phase: number;
  health: number;
  attackTimer: number;
};

export type EnemyStrategy = {
  name: string;
  taunt: string;
  speed: number;
  aggression: number;
  attackInterval: number;
  jumpForce: number;
};

export type SplitPart = Point & {
  vx: number;
  age: number;
};

export type GameState = {
  player: Player;
  platforms: Platform[];
  selectedPlatform: number | null;
  splitPart: SplitPart | null;
  stars: boolean[];
  discoveredSecrets: boolean[];
  activeSecret: number | null;
  secretNoticeFrames: number;
  dropThroughFrames: number;
  dropInputReleased: boolean;
  enemies: TelekineticObject[];
  enemyStrategy: EnemyStrategy;
  won: boolean;
  lost: boolean;
};
