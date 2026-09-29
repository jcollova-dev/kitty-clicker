/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { GameState, ActiveCat, FloatingNotification, ScoreEntry, GameStats } from './types';
import { HUD } from './components/HUD';
import { Arena } from './components/Arena';
import { GameOverModal } from './components/GameOverModal';
import { ScoreboardModal } from './components/ScoreboardModal';
import { Trophy, HelpCircle, Heart, Zap } from 'lucide-react';

const STORAGE_SCORE_KEY = 'waffle_cat_retro_scores';
const STORAGE_THEME_KEY = 'waffle_cat_theme';

const DEFAULT_SCORES: ScoreEntry[] = [
  { name: 'AAA', score: 250, date: '2026-09-29' },
  { name: 'WFL', score: 210, date: '2026-09-29' },
  { name: 'KIT', score: 180, date: '2026-09-28' },
  { name: 'MEO', score: 140, date: '2026-09-27' },
  { name: 'PIX', score: 90, date: '2026-09-26' },
];

const MATCH_DURATION = 45; // 45 seconds game duration
const INITIAL_LIVES = 3;
const MAX_LIVES = 5;
const CAT_SIZE = 64; // px
const MIN_PADDING = 50; // px strict minimum distance

export default function App() {
  // Theme state
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_THEME_KEY);
      return saved ? saved === 'dark' : true;
    } catch {
      return true;
    }
  });

  // Game state
  const [gameState, setGameState] = useState<GameState>('MENU');
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(INITIAL_LIVES);
  const [timeLeft, setTimeLeft] = useState(MATCH_DURATION);
  const [streak, setStreak] = useState(0);
  const [maxStreak, setMaxStreak] = useState(0);

  // Statistics
  const [catsWhacked, setCatsWhacked] = useState(0);
  const [greenCatsCaught, setGreenCatsCaught] = useState(0);
  const [catsEscaped, setCatsEscaped] = useState(0);

  // Active entities
  const [cats, setCats] = useState<ActiveCat[]>([]);
  const [floatingNotes, setFloatingNotes] = useState<FloatingNotification[]>([]);

  // Visual cues
  const [hurtFlash, setHurtFlash] = useState(false);
  const [healFlash, setHealFlash] = useState(false);

  // Modals
  const [isScoreboardOpen, setIsScoreboardOpen] = useState(false);
  const [scores, setScores] = useState<ScoreEntry[]>(() => {
    try {
      const data = localStorage.getItem(STORAGE_SCORE_KEY);
      if (data) {
        const parsed = JSON.parse(data);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {
      // fallback
    }
    return DEFAULT_SCORES;
  });

  // Arena DOM ref for precise size measurements
  const arenaRef = useRef<HTMLDivElement>(null);
  const spawnTimerRef = useRef<NodeJS.Timeout | null>(null);
  const gameCountdownRef = useRef<NodeJS.Timeout | null>(null);
  const catsRef = useRef<ActiveCat[]>([]);
  catsRef.current = cats;

  // Toggle theme
  const toggleTheme = () => {
    setIsDarkMode((prev) => {
      const next = !prev;
      try {
        localStorage.setItem(STORAGE_THEME_KEY, next ? 'dark' : 'light');
      } catch {
        // ignore
      }
      return next;
    });
  };

  // Trigger floating notifications
  const addFloatingNote = useCallback(
    (x: number, y: number, text: string, color: 'normal' | 'green' | 'bonus' | 'miss') => {
      const id = `${Date.now()}-${Math.random()}`;
      setFloatingNotes((prev) => [...prev, { id, x, y, text, color }]);
      setTimeout(() => {
        setFloatingNotes((prev) => prev.filter((n) => n.id !== id));
      }, 500);
    },
    []
  );

  // Hurt screen flash
  const triggerHurt = useCallback(() => {
    setHurtFlash(true);
    setTimeout(() => setHurtFlash(false), 350);
  }, []);

  // Heal screen flash
  const triggerHeal = useCallback(() => {
    setHealFlash(true);
    setTimeout(() => setHealFlash(false), 350);
  }, []);

  // End Game
  const endGame = useCallback(() => {
    setGameState('GAME_OVER');
    setCats([]);
    if (spawnTimerRef.current) clearInterval(spawnTimerRef.current);
    if (gameCountdownRef.current) clearInterval(gameCountdownRef.current);
  }, []);

  // Check if player score qualifies for Top 5
  const isHighScore =
    score > 0 &&
    (scores.length < 5 || score > (scores[scores.length - 1]?.score ?? 0));

  // Save score to Top 5
  const handleSaveScore = (initials: string) => {
    const today = new Date().toISOString().split('T')[0];
    const newEntry: ScoreEntry = {
      name: initials.toUpperCase().slice(0, 3) || 'AAA',
      score,
      date: today,
    };

    const updated = [...scores, newEntry]
      .sort((a, b) => b.score - a.score)
      .slice(0, 5);

    setScores(updated);
    try {
      localStorage.setItem(STORAGE_SCORE_KEY, JSON.stringify(updated));
    } catch {
      // ignore
    }
  };

  // Reset all high scores
  const handleResetScores = () => {
    setScores(DEFAULT_SCORES);
    try {
      localStorage.setItem(STORAGE_SCORE_KEY, JSON.stringify(DEFAULT_SCORES));
    } catch {
      // ignore
    }
  };

  // Start new game
  const startGame = useCallback(() => {
    setScore(0);
    setLives(INITIAL_LIVES);
    setTimeLeft(MATCH_DURATION);
    setStreak(0);
    setMaxStreak(0);
    setCatsWhacked(0);
    setGreenCatsCaught(0);
    setCatsEscaped(0);
    setCats([]);
    setFloatingNotes([]);
    setGameState('PLAYING');
  }, []);

  // Toggle pause
  const togglePause = () => {
    if (gameState === 'PLAYING') {
      setGameState('PAUSED');
    } else if (gameState === 'PAUSED') {
      setGameState('PLAYING');
    }
  };

  // Algoritmo de Aparición Aleatoria sin Cuadrícula (No-Grid Spawn)
  const spawnCat = useCallback(() => {
    if (!arenaRef.current || gameState !== 'PLAYING') return;

    const rect = arenaRef.current.getBoundingClientRect();
    const containerWidth = rect.width;
    const containerHeight = rect.height;

    // Check bounds sanity
    if (containerWidth <= 120 || containerHeight <= 120) return;

    // Concurrency limit: maximum 3-4 cats simultaneously on screen
    if (catsRef.current.filter((c) => c.state === 'ALIVE').length >= 3) {
      return;
    }

    // Determine strict edge padding (at least 50px, clamped if container is very narrow)
    const padding = Math.min(
      MIN_PADDING,
      Math.max(20, (containerWidth - CAT_SIZE) / 4)
    );

    const minX = padding;
    const maxX = containerWidth - CAT_SIZE - padding;
    const minY = padding;
    const maxY = containerHeight - CAT_SIZE - padding;

    if (maxX <= minX || maxY <= minY) return;

    // Cat type: 85% Normal, 15% Green Extra Life
    const isGreen = Math.random() < 0.15;
    const catType = isGreen ? 'GREEN_EXTRA_LIFE' : 'NORMAL';

    // Lifespans:
    // Normal: 1.0s - 1.8s (e.g. scales slightly with remaining time)
    // Green: 500ms - 750ms
    const timeProgress = (MATCH_DURATION - timeLeft) / MATCH_DURATION; // 0 to 1
    const normalLifespan = Math.max(1050, Math.floor(1750 - timeProgress * 650));
    const greenLifespan = Math.floor(550 + Math.random() * 200);
    const lifespan = isGreen ? greenLifespan : normalLifespan;

    // Find non-overlapping coordinate (up to 15 attempts)
    let candidateX = 0;
    let candidateY = 0;
    let validPositionFound = false;

    for (let attempt = 0; attempt < 15; attempt++) {
      candidateX = Math.floor(minX + Math.random() * (maxX - minX));
      candidateY = Math.floor(minY + Math.random() * (maxY - minY));

      // Overlap condition: Distance(C_nuevo, C_i) >= Size + 50px
      const collides = catsRef.current.some((c) => {
        if (c.state !== 'ALIVE') return false;
        // Euclidean distance center to center
        const distX = candidateX - c.x;
        const distY = candidateY - c.y;
        const dist = Math.hypot(distX, distY);
        return dist < CAT_SIZE + MIN_PADDING;
      });

      if (!collides) {
        validPositionFound = true;
        break;
      }
    }

    // If no valid position after 15 attempts, skip this spawn cycle to avoid saturation
    if (!validPositionFound) return;

    const newCat: ActiveCat = {
      id: `${Date.now()}-${Math.random()}`,
      type: catType,
      x: candidateX,
      y: candidateY,
      size: CAT_SIZE,
      spawnTime: Date.now(),
      lifespan,
      state: 'ALIVE',
    };

    setCats((prev) => [...prev, newCat]);
  }, [gameState, timeLeft]);

  // Main game tick: handle cat timeouts (escape penalty) and spawning
  useEffect(() => {
    if (gameState !== 'PLAYING') return;

    const tickInterval = setInterval(() => {
      const now = Date.now();

      setCats((prevCats) => {
        const nextCats: ActiveCat[] = [];
        let livesLostCount = 0;

        for (const cat of prevCats) {
          if (cat.state === 'WHACKED') {
            // Keep whacked cat for 220ms so player sees the hit reaction
            if (cat.whackedTime && now - cat.whackedTime < 220) {
              nextCats.push(cat);
            }
            continue;
          }

          // Check if alive cat has exceeded its lifespan
          if (now - cat.spawnTime >= cat.lifespan) {
            // Cat escaped!
            if (cat.type === 'NORMAL') {
              // Normal cat escape penalty: LOSE 1 LIFE
              livesLostCount += 1;
              addFloatingNote(
                cat.x + cat.size / 2,
                cat.y + cat.size / 2,
                '-1 VIDA',
                'miss'
              );
            } else {
              // Green cat escaped: NO LIFE PENALTY
              addFloatingNote(
                cat.x + cat.size / 2,
                cat.y + cat.size / 2,
                '¡SE FUE!',
                'normal'
              );
            }
          } else {
            nextCats.push(cat);
          }
        }

        if (livesLostCount > 0) {
          triggerHurt();
          setStreak(0);
          setCatsEscaped((prev) => prev + livesLostCount);
          setLives((prevLives) => {
            const updated = prevLives - livesLostCount;
            if (updated <= 0) {
              setTimeout(() => endGame(), 50);
              return 0;
            }
            return updated;
          });
        }

        return nextCats;
      });
    }, 50);

    return () => clearInterval(tickInterval);
  }, [gameState, addFloatingNote, triggerHurt, endGame]);

  // Spawner interval loop (progressively accelerates from ~1000ms down to ~700ms)
  useEffect(() => {
    if (gameState !== 'PLAYING') return;

    const timeProgress = (MATCH_DURATION - timeLeft) / MATCH_DURATION;
    const intervalTime = Math.max(680, Math.floor(1050 - timeProgress * 350));

    const spawner = setInterval(() => {
      spawnCat();
    }, intervalTime);

    return () => clearInterval(spawner);
  }, [gameState, timeLeft, spawnCat]);

  // Countdown timer (45 seconds to 0)
  useEffect(() => {
    if (gameState !== 'PLAYING') return;

    gameCountdownRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          endGame();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (gameCountdownRef.current) clearInterval(gameCountdownRef.current);
    };
  }, [gameState, endGame]);

  // Whack a Cat handler
  const handleWhackCat = (catId: string, event: React.PointerEvent) => {
    if (gameState !== 'PLAYING') return;

    setCats((prevCats) =>
      prevCats.map((cat) => {
        if (cat.id !== catId || cat.state !== 'ALIVE') return cat;

        const isGreen = cat.type === 'GREEN_EXTRA_LIFE';
        const currentMultiplier =
          streak >= 15 ? 4 : streak >= 10 ? 3 : streak >= 5 ? 2 : 1;

        if (isGreen) {
          // Special Green Cat Whacked!
          setGreenCatsCaught((prev) => prev + 1);
          triggerHeal();

          setLives((prevLives) => {
            if (prevLives < MAX_LIVES) {
              addFloatingNote(
                cat.x + cat.size / 2,
                cat.y + cat.size / 2,
                '+1 VIDA!',
                'green'
              );
              return prevLives + 1;
            } else {
              // Max lives bonus points
              setScore((s) => s + 50);
              addFloatingNote(
                cat.x + cat.size / 2,
                cat.y + cat.size / 2,
                '+50 BONUS!',
                'bonus'
              );
              return prevLives;
            }
          });
        } else {
          // Normal Cat Whacked!
          const pointsEarned = 10 * currentMultiplier;
          setScore((s) => s + pointsEarned);
          addFloatingNote(
            cat.x + cat.size / 2,
            cat.y + cat.size / 2,
            `+${pointsEarned}`,
            'normal'
          );
        }

        // Increment streak and whacked count
        setCatsWhacked((prev) => prev + 1);
        setStreak((prev) => {
          const next = prev + 1;
          setMaxStreak((m) => Math.max(m, next));
          return next;
        });

        return {
          ...cat,
          state: 'WHACKED',
          whackedTime: Date.now(),
        };
      })
    );
  };

  const containerBg = isDarkMode ? 'bg-[#0A0A0A]' : 'bg-[#EEEEEE]';
  const textClass = isDarkMode ? 'text-white' : 'text-black';
  const borderClass = isDarkMode ? 'border-white' : 'border-black';
  const boxClass = isDarkMode ? 'pixel-box-dark' : 'pixel-box';

  return (
    <div
      className={`min-h-screen ${containerBg} ${textClass} flex flex-col transition-colors duration-150 font-pixel`}
    >
      {/* Top HUD */}
      <HUD
        score={score}
        lives={lives}
        maxLives={MAX_LIVES}
        timeLeft={timeLeft}
        streak={streak}
        gameState={gameState}
        isDarkMode={isDarkMode}
        onToggleTheme={toggleTheme}
        onTogglePause={togglePause}
        onRestart={startGame}
        onOpenScoreboard={() => setIsScoreboardOpen(true)}
      />

      {/* Main Arena Viewport */}
      <main className="flex-1 max-w-5xl w-full mx-auto p-3 sm:p-6 flex flex-col justify-center gap-4">
        {/* Game Arena Container */}
        <Arena
          cats={cats}
          onWhackCat={handleWhackCat}
          floatingNotes={floatingNotes}
          isDarkMode={isDarkMode}
          hurtFlash={hurtFlash}
          healFlash={healFlash}
          gameState={gameState}
          onStartGame={startGame}
          arenaRef={arenaRef}
        />

        {/* Bottom Status / Quick Info Bar */}
        <div
          className={`flex flex-col sm:flex-row items-center justify-between gap-3 px-4 py-3 border-2 ${borderClass} ${
            isDarkMode ? 'bg-black' : 'bg-white'
          } ${boxClass} text-xs`}
        >
          {/* Status Indicator */}
          <div className="flex items-center gap-2">
            <span className="text-[10px] opacity-70">ESTADO:</span>
            <span
              className={`font-bold text-[10px] tracking-wider ${
                gameState === 'PLAYING'
                  ? 'text-emerald-500 animate-pulse'
                  : gameState === 'PAUSED'
                  ? 'text-amber-500'
                  : gameState === 'GAME_OVER'
                  ? 'text-red-500'
                  : 'text-zinc-400'
              }`}
            >
              {gameState === 'PLAYING'
                ? '¡A JUGAR!'
                : gameState === 'PAUSED'
                ? 'PAUSADO'
                : gameState === 'GAME_OVER'
                ? 'PARTIDA TERMINADA'
                : 'LISTO'}
            </span>
          </div>

          {/* Quick Legend */}
          <div className="flex items-center gap-4 text-[9px] font-mono opacity-80">
            <div className="flex items-center gap-1.5">
              <span className="inline-block w-2.5 h-2.5 bg-current border border-current" />
              <span>Normal (+10 pt)</span>
            </div>
            <div className="flex items-center gap-1.5 text-emerald-500 font-bold">
              <span className="inline-block w-2.5 h-2.5 bg-emerald-500 border border-emerald-400" />
              <span>Verde (+1 Vida)</span>
            </div>
          </div>

          {/* Scoreboard trigger */}
          <button
            onClick={() => setIsScoreboardOpen(true)}
            className="text-[10px] font-bold underline cursor-pointer hover:opacity-80 flex items-center gap-1"
          >
            <Trophy className="w-3.5 h-3.5 text-amber-500" />
            TOP 5 RÉCORDS
          </button>
        </div>
      </main>

      {/* Game Over Modal */}
      {gameState === 'GAME_OVER' && (
        <GameOverModal
          stats={{
            score,
            lives,
            timeLeft,
            streak,
            maxStreak,
            catsWhacked,
            greenCatsCaught,
            catsEscaped,
          }}
          isHighScore={isHighScore}
          onSaveScore={handleSaveScore}
          onPlayAgain={startGame}
          onOpenScoreboard={() => setIsScoreboardOpen(true)}
          isDarkMode={isDarkMode}
        />
      )}

      {/* Top 5 Scoreboard Modal */}
      <ScoreboardModal
        isOpen={isScoreboardOpen}
        onClose={() => setIsScoreboardOpen(false)}
        scores={scores}
        onResetScores={handleResetScores}
        isDarkMode={isDarkMode}
      />
    </div>
  );
}
