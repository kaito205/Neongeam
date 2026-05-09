export interface Vector {
  x: number;
  y: number;
}

export interface Entity {
  id: string;
  pos: Vector;
  width: number;
  height: number;
}

export interface Bullet extends Entity {
  velocity: Vector;
  owner: 'player' | 'enemy';
}

export interface Enemy extends Entity {
  type: number;
  points: number;
  alive: boolean;
}

export interface GameState {
  score: number;
  highScore: number;
  lives: number;
  level: number;
  isGameOver: boolean;
  isPaused: boolean;
}

export interface Track {
  id: string;
  title: string;
  artist: string;
  duration: string;
  url: string;
}
