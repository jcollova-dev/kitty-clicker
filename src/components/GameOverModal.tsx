/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { GameStats } from '../types';
import { Trophy, RotateCcw, Award } from 'lucide-react';

interface GameOverModalProps {
  stats: GameStats;
  isHighScore: boolean;
  onSaveScore: (initials: string) => void;
  onPlayAgain: () => void;
  onOpenScoreboard: () => void;
  isDarkMode: boolean;
}

export const GameOverModal: React.FC<GameOverModalProps> = ({
  stats,
  isHighScore,
  onSaveScore,
  onPlayAgain,
  onOpenScoreboard,
  isDarkMode,
}) => {
  const [initials, setInitials] = useState('');
  const [hasSaved, setHasSaved] = useState(false);

  const boxClass = isDarkMode ? 'pixel-box-dark' : 'pixel-box';
  const borderClass = isDarkMode ? 'border-white' : 'border-black';
  const textClass = isDarkMode ? 'text-white' : 'text-black';
  const bgClass = isDarkMode ? 'bg-black' : 'bg-white';
  const reasonText = stats.lives <= 0 ? '¡SIN VIDAS RESTANTES!' : '¡TIEMPO AGOTADO!';

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (initials.trim().length > 0 && !hasSaved) {
      onSaveScore(initials.toUpperCase().slice(0, 3));
      setHasSaved(true);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs select-none">
      <div
        className={`w-full max-w-md ${bgClass} border-4 ${borderClass} ${boxClass} p-5 sm:p-6 flex flex-col gap-4 text-center animate-in fade-in zoom-in-95 duration-200`}
      >
        {/* Title */}
        <div className="space-y-1">
          <h2
            className={`text-xl sm:text-2xl font-bold tracking-tight ${
              stats.lives <= 0 ? 'text-red-500' : 'text-amber-500'
            }`}
          >
            GAME OVER
          </h2>
          <p className="text-[10px] font-mono tracking-widest opacity-80">
            {reasonText}
          </p>
        </div>

        {/* Final Score Hero */}
        <div
          className={`py-3 px-4 border-2 ${borderClass} ${
            isDarkMode ? 'bg-zinc-900' : 'bg-zinc-100'
          }`}
        >
          <div className="text-[10px] opacity-70 mb-1">PUNTUACIÓN FINAL</div>
          <div className="text-2xl sm:text-3xl font-bold font-mono tabular-nums text-emerald-500">
            {stats.score.toLocaleString()}
          </div>
        </div>

        {/* Stats breakdown */}
        <div className={`grid grid-cols-3 gap-2 text-[10px] border-2 ${borderClass} p-2 text-left`}>
          <div>
            <span className="opacity-70 block">GATOS:</span>
            <span className="font-bold text-xs">{stats.catsWhacked}</span>
          </div>
          <div>
            <span className="opacity-70 block">VERDES:</span>
            <span className="font-bold text-xs text-emerald-500">
              +{stats.greenCatsCaught}
            </span>
          </div>
          <div>
            <span className="opacity-70 block">RACHA MAX:</span>
            <span className="font-bold text-xs">{stats.maxStreak}x</span>
          </div>
        </div>

        {/* High score arcade entry */}
        {isHighScore && !hasSaved && (
          <form
            onSubmit={handleSubmit}
            className={`p-3 border-2 border-amber-400 bg-amber-400/10 flex flex-col gap-2 items-center`}
          >
            <div className="flex items-center gap-1.5 text-amber-500 text-xs font-bold">
              <Award className="w-4 h-4" />
              ¡NUEVO RÉCORD TOP 5!
            </div>
            <p className="text-[10px] opacity-80">
              INGRESA TUS 3 INICIALES ARCADE:
            </p>
            <div className="flex items-center gap-2">
              <input
                type="text"
                maxLength={3}
                value={initials}
                onChange={(e) => setInitials(e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, ''))}
                placeholder="CAT"
                autoFocus
                className={`w-28 text-center text-lg font-bold font-mono tracking-widest uppercase p-2 border-2 ${borderClass} ${bgClass} ${textClass} focus:outline-hidden`}
              />
              <button
                type="submit"
                disabled={initials.trim().length === 0}
                className={`px-3 py-2 border-2 ${borderClass} ${bgClass} ${boxClass} pixel-btn text-xs font-bold cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed`}
              >
                GUARDAR
              </button>
            </div>
          </form>
        )}

        {hasSaved && (
          <div className="text-xs text-emerald-500 font-bold p-2">
            ✓ ¡RÉCORD GUARDADO EN EL TOP 5!
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center gap-2 pt-2">
          <button
            onClick={onPlayAgain}
            className={`w-full py-3 border-2 ${borderClass} bg-emerald-600 text-white ${boxClass} pixel-btn text-xs font-bold cursor-pointer flex items-center justify-center gap-2`}
          >
            <RotateCcw className="w-4 h-4" />
            JUGAR DE NUEVO
          </button>
          <button
            onClick={onOpenScoreboard}
            className={`w-full py-3 border-2 ${borderClass} ${bgClass} ${textClass} ${boxClass} pixel-btn text-xs font-bold cursor-pointer flex items-center justify-center gap-2`}
          >
            <Trophy className="w-4 h-4" />
            VER TOP 5
          </button>
        </div>
      </div>
    </div>
  );
};
