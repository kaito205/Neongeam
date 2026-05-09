import React, { useEffect, useRef, useState, useCallback } from 'react';
import { GameState, Enemy, Bullet, Vector } from '../types';

const CANV_WIDTH = 600;
const CANV_HEIGHT = 500;
const ENEMY_ROWS = 5;
const ENEMY_COLS = 10;
const ENEMY_WIDTH = 40;
const ENEMY_HEIGHT = 30;
const PLAYER_WIDTH = 50;
const PLAYER_HEIGHT = 20;

export const SpaceInvaders: React.FC<{
  onScoreUpdate: (score: number) => void;
  onGameOver: (score: number) => void;
}> = ({ onScoreUpdate, onGameOver }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [gameState, setGameState] = useState<GameState>({
    score: 0,
    highScore: parseInt(localStorage.getItem('highScore') || '0'),
    lives: 3,
    level: 1,
    isGameOver: false,
    isPaused: false,
  });

  const playerPos = useRef<Vector>({ x: CANV_WIDTH / 2 - PLAYER_WIDTH / 2, y: CANV_HEIGHT - 40 });
  const enemies = useRef<Enemy[]>([]);
  const bullets = useRef<Bullet[]>([]);
  const keys = useRef<{ [key: string]: boolean }>({});
  const lastShot = useRef<number>(0);
  const enemyDirection = useRef<number>(1);
  const enemyMoveTimer = useRef<number>(0);
  const enemyMoveSpeed = useRef<number>(1000); // ms

  const initEnemies = useCallback(() => {
    const newEnemies: Enemy[] = [];
    for (let row = 0; row < ENEMY_ROWS; row++) {
      for (let col = 0; col < ENEMY_COLS; col++) {
        newEnemies.push({
          id: `enemy-${row}-${col}`,
          pos: { x: col * (ENEMY_WIDTH + 10) + 50, y: row * (ENEMY_HEIGHT + 10) + 50 },
          width: ENEMY_WIDTH,
          height: ENEMY_HEIGHT,
          type: row,
          points: (3 - Math.floor(row / 2)) * 10,
          alive: true,
        });
      }
    }
    enemies.current = newEnemies;
  }, []);

  useEffect(() => {
    initEnemies();
    const handleKeyDown = (e: KeyboardEvent) => (keys.current[e.code] = true);
    const handleKeyUp = (e: KeyboardEvent) => (keys.current[e.code] = false);
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [initEnemies]);

  const update = useCallback((delta: number) => {
    if (gameState.isGameOver || gameState.isPaused) return;

    // Player movement
    if (keys.current['ArrowLeft'] && playerPos.current.x > 0) {
      playerPos.current.x -= 0.3 * delta;
    }
    if (keys.current['ArrowRight'] && playerPos.current.x < CANV_WIDTH - PLAYER_WIDTH) {
      playerPos.current.x += 0.3 * delta;
    }

    // Shooting
    if (keys.current['Space'] && Date.now() - lastShot.current > 500) {
      bullets.current.push({
        id: `bullet-${Date.now()}`,
        pos: { x: playerPos.current.x + PLAYER_WIDTH / 2 - 2, y: playerPos.current.y - 10 },
        width: 4,
        height: 12,
        velocity: { x: 0, y: -0.5 },
        owner: 'player',
      });
      lastShot.current = Date.now();
    }

    // Bullets movement
    bullets.current = bullets.current.filter((b) => {
      b.pos.y += b.velocity.y * delta;
      return b.pos.y > 0 && b.pos.y < CANV_HEIGHT;
    });

    // Enemy movement
    enemyMoveTimer.current += delta;
    if (enemyMoveTimer.current > enemyMoveSpeed.current) {
      enemyMoveTimer.current = 0;
      let hitEdge = false;
      enemies.current.forEach((e) => {
        if (!e.alive) return;
        e.pos.x += 10 * enemyDirection.current;
        if (e.pos.x <= 10 || e.pos.x >= CANV_WIDTH - ENEMY_WIDTH - 10) hitEdge = true;
      });

      if (hitEdge) {
        enemyDirection.current *= -1;
        enemies.current.forEach((e) => (e.pos.y += 20));
        enemyMoveSpeed.current = Math.max(100, enemyMoveSpeed.current - 50);
      }
    }

    // Collisions
    bullets.current.forEach((b) => {
      if (b.owner === 'player') {
        enemies.current.forEach((e) => {
          if (e.alive && b.pos.x < e.pos.x + e.width && b.pos.x + b.width > e.pos.x &&
              b.pos.y < e.pos.y + e.height && b.pos.y + b.height > e.pos.y) {
            e.alive = false;
            b.pos.y = -100; // Trash it
            setGameState((prev) => {
              const newScore = prev.score + e.points;
              onScoreUpdate(newScore);
              return { ...prev, score: newScore };
            });
          }
        });
      }
    });

    // Game over check
    const aliveEnemies = enemies.current.filter(e => e.alive);
    if (aliveEnemies.length === 0) {
      initEnemies();
      enemyMoveSpeed.current = Math.max(100, enemyMoveSpeed.current - 100);
    }
    
    if (enemies.current.some(e => e.alive && e.pos.y > playerPos.current.y - 10)) {
        setGameState(prev => ({ ...prev, isGameOver: true }));
        onGameOver(gameState.score);
    }
  }, [gameState, initEnemies, onScoreUpdate, onGameOver]);

  const draw = useCallback((ctx: CanvasRenderingContext2D) => {
    ctx.clearRect(0, 0, CANV_WIDTH, CANV_HEIGHT);

    // Draw Player
    ctx.fillStyle = '#00ffff';
    ctx.shadowBlur = 10;
    ctx.shadowColor = '#00ffff';
    ctx.fillRect(playerPos.current.x, playerPos.current.y, PLAYER_WIDTH, PLAYER_HEIGHT);
    
    // Draw turret
    ctx.fillRect(playerPos.current.x + PLAYER_WIDTH/2 - 5, playerPos.current.y - 10, 10, 10);

    // Draw Enemies
    enemies.current.forEach((e) => {
      if (!e.alive) return;
      ctx.fillStyle = e.type < 2 ? '#ff00ff' : e.type < 4 ? '#9d00ff' : '#00ffff';
      ctx.shadowColor = ctx.fillStyle;
      ctx.fillRect(e.pos.x, e.pos.y, e.width, e.height);
      
      // Eyes
      ctx.fillStyle = '#000';
      ctx.shadowBlur = 0;
      ctx.fillRect(e.pos.x + 5, e.pos.y + 5, 5, 5);
      ctx.fillRect(e.pos.x + e.width - 10, e.pos.y + 5, 5, 5);
    });

    // Draw Bullets
    ctx.fillStyle = '#fff';
    ctx.shadowBlur = 15;
    ctx.shadowColor = '#fff';
    bullets.current.forEach((b) => {
      ctx.fillRect(b.pos.x, b.pos.y, b.width, b.height);
    });
    
    if (gameState.isGameOver) {
        ctx.fillStyle = 'rgba(0,0,0,0.7)';
        ctx.fillRect(0,0, CANV_WIDTH, CANV_HEIGHT);
        ctx.fillStyle = '#ff00ff';
        ctx.font = 'bold 40px "Space Grotesk"';
        ctx.textAlign = 'center';
        ctx.fillText('GAME OVER', CANV_WIDTH/2, CANV_HEIGHT/2);
        ctx.font = '20px "Space Grotesk"';
        ctx.fillText('Press R to Restart', CANV_WIDTH/2, CANV_HEIGHT/2 + 50);
    }
  }, [gameState.isGameOver]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let lastTime = performance.now();
    let animationFrameId: number;

    const render = (time: number) => {
      const delta = time - lastTime;
      lastTime = time;

      update(delta);
      draw(ctx);
      animationFrameId = requestAnimationFrame(render);
    };

    animationFrameId = requestAnimationFrame(render);
    return () => cancelAnimationFrame(animationFrameId);
  }, [update, draw]);

  const restart = () => {
    setGameState({
        score: 0,
        highScore: parseInt(localStorage.getItem('highScore') || '0'),
        lives: 3,
        level: 1,
        isGameOver: false,
        isPaused: false,
    });
    playerPos.current = { x: CANV_WIDTH / 2 - PLAYER_WIDTH / 2, y: CANV_HEIGHT - 40 };
    bullets.current = [];
    enemyDirection.current = 1;
    enemyMoveTimer.current = 0;
    enemyMoveSpeed.current = 1000;
    initEnemies();
    onScoreUpdate(0);
  };

  useEffect(() => {
    const handleRestart = (e: KeyboardEvent) => {
        if (e.code === 'KeyR' && gameState.isGameOver) {
            restart();
        }
    };
    window.addEventListener('keydown', handleRestart);
    return () => window.removeEventListener('keydown', handleRestart);
  }, [gameState.isGameOver]);

  return (
    <div className="relative border-4 border-neon-purple shadow-[0_0_30px_#9d00ff] bg-black">
      <canvas
        ref={canvasRef}
        width={CANV_WIDTH}
        height={CANV_HEIGHT}
        className="block"
      />
      <div className="absolute top-2 left-4 font-mono text-neon-cyan text-sm">
        SCORE: {gameState.score.toString().padStart(6, '0')}
      </div>
      <div className="absolute top-2 right-4 font-mono text-neon-pink text-sm uppercase">
        HI-SCORE: {gameState.highScore.toString().padStart(6, '0')}
      </div>
    </div>
  );
};
