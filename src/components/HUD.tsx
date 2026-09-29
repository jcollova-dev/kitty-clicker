/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { GameState } from '../types';
import { Sun, Moon, Pause, Play, RotateCcw, Trophy } from 'lucide-react';

interface HUDProps {
  score: number;
  lives: number;
  maxLives?: number;
  timeLeft: number;
  streak: number;
  gameState: GameState;
  isDarkMode: boolean;
  onToggleTheme: () => void;
  onTogglePause: () => void;
  onRestart: () => void;
  onOpenScoreboard: () => void;
}

export const HUD: React.FC<HUDProps> = ({
  score,
  lives,
  maxLives = 5,
  timeLeft,
  streak,
  gameState,
  isDarkMode,
  onToggleTheme,
  onTogglePause,
  onRestart,
  onOpenScoreboard,
}) => {
  // Pixel Heart renderer for lives
  const renderHeart = (index: number) => {
    const isFilled = index < lives;
    const heartColor = isFilled
      ? (isDarkMode ? '#FFFFFF' : '#000000')
      : 'transparent';
    const borderColor = isDarkMode ? '#FFFFFF' : '#000000';

    return (
      <svg
        key={index}
        width="18"
        height="18"
        viewBox="0 0 10 10"
        className="inline-block transition-transform duration-150"
        style={{ imageRendering: 'pixelated' }}
        aria-label={isFilled ? 'Vida activa' : 'Vida perdida'}
      >
        {/* Heart 10x10 pixel grid */}
        {/* Top bumps */}
        <rect x="1" y="2" width="3" height="1" fill={borderColor} />
        <rect x="5" y="2" width="3" height="1" fill={borderColor} />
        <rect x="0" y="3" width="1" height="2" fill={borderColor} />
        <rect x="4" y="3" width="1" height="1" fill={borderColor} />
        <rect x="8" y="3" width="1" height="2" fill={borderColor} />
        {/* Slopes */}
        <rect x="0" y="5" width="1" height="1" fill={borderColor} />
        <rect x="1" y="6" width="1" height="1" fill={borderColor} />
        <rect x="2" y="7" width="1" height="1" fill={borderColor} />
        <rect x="3" y="8" width="1" height="1" fill={borderColor} />
        <rect x="4" y="9" width="1" height="1" fill={borderColor} />
        <rect x="8" y="5" width="1" height="1" fill={borderColor} />
        <rect x="7" y="6" width="1" height="1" fill={borderColor} />
        <rect x="6" y="7" width="1" height="1" fill={borderColor} />
        <rect x="5" y="8" width="1" height="1" fill={borderColor} />

        {/* Fill if active */}
        {isFilled && (
          <>
            <rect x="1" y="3" width="3" height="2" fill={heartColor} />
            <rect x="5" y="3" width="3" height="2" fill={heartColor} />
            <rect x="1" y="5" width="7" height="1" fill={heartColor} />
            <rect x="2" y="6" width="5" height="1" fill={heartColor} />
            <rect x="3" y="7" width="3" height="1" fill={heartColor} />
            <rect x="4" y="8" width="1" height="1" fill={heartColor} />
          </>
        )}
      </svg>
    );
  };

  // Streak Multiplier calculation
  const multiplier = streak >= 15 ? 4 : streak >= 10 ? 3 : streak >= 5 ? 2 : 1;

  const boxClass = isDarkMode ? 'pixel-box-dark' : 'pixel-box';
  const borderClass = isDarkMode ? 'border-white' : 'border-black';
  const textClass = isDarkMode ? 'text-white' : 'text-black';
  const bgSurface = isDarkMode ? 'bg-black' : 'bg-white';

  return (
    <header className={`w-full border-b-4 ${borderClass} ${bgSurface} p-3 sm:p-4 select-none`}>
      <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between gap-3">
        {/* Title & Brand */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <span className={`text-sm sm:text-base font-bold tracking-tight ${textClass}`}>
              WHACK-A-WAFFLE CAT
            </span>
            <span
              className={`text-[9px] px-1.5 py-0.5 border-2 ${borderClass} font-mono ${
                isDarkMode ? 'bg-zinc-800 text-zinc-300' : 'bg-zinc-200 text-zinc-700'
              }`}
            >
              1-BIT
            </span>
          </div>
        </div>

        {/* Status / Counters in HUD */}
        <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-4 text-xs">
          {/* LIVES */}
          <div
            className={`flex items-center gap-1.5 px-2.5 py-1.5 border-2 ${borderClass} ${boxClass}`}
            title={`Vidas restantes: ${lives} de ${maxLives}`}
          >
            <span className="text-[10px] font-bold opacity-80 mr-1">VIDAS:</span>
            <div className="flex items-center gap-1">
              {Array.from({ length: maxLives }).map((_, i) => renderHeart(i))}
            </div>
          </div>

          {/* TIMER */}
          <div
            className={`flex items-center gap-1 px-3 py-1.5 border-2 ${borderClass} ${boxClass}`}
          >
            <span className="text-[10px] font-bold opacity-80">TIEMPO:</span>
            <span
              className={`font-mono text-sm tabular-nums font-bold ${
                timeLeft <= 10 && gameState === 'PLAYING'
                  ? 'text-red-500 animate-pulse'
                  : textClass
              }`}
            >
              {timeLeft.toString().padStart(2, '0')}s
            </span>
          </div>

          {/* SCORE */}
          <div
            className={`flex items-center gap-1.5 px-3 py-1.5 border-2 ${borderClass} ${boxClass}`}
          >
            <span className="text-[10px] font-bold opacity-80">SCORE:</span>
            <span className="font-mono text-sm tabular-nums font-bold">
              {score.toString().padStart(5, '0')}
            </span>
          </div>

          {/* STREAK MULTIPLIER */}
          {multiplier > 1 && (
            <div
              className={`px-2 py-1.5 border-2 border-emerald-500 bg-emerald-500/20 text-emerald-500 font-bold text-[10px] tracking-wider animate-bounce`}
            >
              x{multiplier} COMBO!
            </div>
          )}
        </div>

        {/* Action Controls: Theme, Pause, Restart, Scoreboard */}
        <div className="flex items-center gap-2">
          {/* Pause / Play button (only when active game) */}
          {(gameState === 'PLAYING' || gameState === 'PAUSED') && (
            <button
              onClick={onTogglePause}
              aria-label={gameState === 'PAUSED' ? 'Reanudar' : 'Pausar'}
              className={`p-1.5 sm:p-2 border-2 ${borderClass} ${bgSurface} ${boxClass} pixel-btn cursor-pointer transition-transform`}
              title={gameState === 'PAUSED' ? 'Reanudar juego' : 'Pausar juego'}
            >
              {gameState === 'PAUSED' ? (
                <Play className="w-4 h-4" />
              ) : (
                <Pause className="w-4 h-4" />
              )}
            </button>
          )}

          {/* Restart */}
          {gameState !== 'MENU' && (
            <button
              onClick={onRestart}
              aria-label="Reiniciar partida"
              className={`p-1.5 sm:p-2 border-2 ${borderClass} ${bgSurface} ${boxClass} pixel-btn cursor-pointer transition-transform`}
              title="Reiniciar partida"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          )}

          {/* Scoreboard Modal trigger */}
          <button
            onClick={onOpenScoreboard}
            aria-label="Ver Top 5 Mejores Puntajes"
            className={`p-1.5 sm:p-2 border-2 ${borderClass} ${bgSurface} ${boxClass} pixel-btn cursor-pointer transition-transform flex items-center gap-1`}
            title="Marcador Top 5"
          >
            <Trophy className="w-4 h-4" />
          </button>

          {/* Dark / Light Mode Switch */}
          <button
            onClick={onToggleTheme}
            aria-label={isDarkMode ? 'Cambiar a Modo Claro' : 'Cambiar a Modo Oscuro'}
            className={`p-1.5 sm:p-2 border-2 ${borderClass} ${bgSurface} ${boxClass} pixel-btn cursor-pointer transition-transform`}
            title={isDarkMode ? 'Modo Claro' : 'Modo Oscuro'}
          >
            {isDarkMode ? (
              <Sun className="w-4 h-4 text-amber-400" />
            ) : (
              <Moon className="w-4 h-4 text-zinc-900" />
            )}
          </button>
        </div>
      </div>
    </header>
  );
};
