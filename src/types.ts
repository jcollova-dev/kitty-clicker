export type GameState = 'MENU' | 'PLAYING' | 'PAUSED' | 'GAME_OVER';

export type CatType = 'NORMAL' | 'GREEN_EXTRA_LIFE';

export interface ActiveCat {
  id: string;
  type: CatType;
  x: number; // pixel position X relative to arena
  y: number; // pixel position Y relative to arena
  size: number; // width and height in px (e.g. 64)
  spawnTime: number;
  lifespan: number; // ms until it despawns
  state: 'ALIVE' | 'WHACKED';
  whackedTime?: number;
}

export interface FloatingNotification {
  id: string;
  x: number;
  y: number;
  text: string;
  color: 'normal' | 'green' | 'bonus' | 'miss';
}

export interface ScoreEntry {
  name: string;
  score: number;
  date: string;
}

export interface GameStats {
  score: number;
  lives: number;
  timeLeft: number;
  streak: number;
  maxStreak: number;
  catsWhacked: number;
  greenCatsCaught: number;
  catsEscaped: number;
}
