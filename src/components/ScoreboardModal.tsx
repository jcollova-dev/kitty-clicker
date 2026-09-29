/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { ScoreEntry } from '../types';
import { Trophy, X, RotateCcw, AlertTriangle } from 'lucide-react';

interface ScoreboardModalProps {
  isOpen: boolean;
  onClose: () => void;
  scores: ScoreEntry[];
  onResetScores: () => void;
  isDarkMode: boolean;
}

export const ScoreboardModal: React.FC<ScoreboardModalProps> = ({
  isOpen,
  onClose,
  scores,
  onResetScores,
  isDarkMode,
}) => {
  const [showConfirmReset, setShowConfirmReset] = useState(false);

  if (!isOpen) return null;

  const boxClass = isDarkMode ? 'pixel-box-dark' : 'pixel-box';
  const borderClass = isDarkMode ? 'border-white' : 'border-black';
  const textClass = isDarkMode ? 'text-white' : 'text-black';
  const bgClass = isDarkMode ? 'bg-black' : 'bg-white';
  const tableHeaderBg = isDarkMode ? 'bg-zinc-900' : 'bg-zinc-100';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs select-none">
      <div
        className={`w-full max-w-md ${bgClass} border-4 ${borderClass} ${boxClass} p-5 sm:p-6 relative flex flex-col gap-4 animate-in fade-in zoom-in-95 duration-150`}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b-2 pb-3 border-current">
          <div className="flex items-center gap-2">
            <Trophy className="w-5 h-5 text-amber-500" />
            <h2 className={`text-sm sm:text-base font-bold ${textClass}`}>
              HALL OF FAME (TOP 5)
            </h2>
          </div>
          <button
            onClick={onClose}
            aria-label="Cerrar ventana de récords"
            className={`p-1 border-2 ${borderClass} ${bgClass} ${boxClass} pixel-btn cursor-pointer`}
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Scores Table */}
        <div className={`border-2 ${borderClass} overflow-hidden text-xs`}>
          <div
            className={`grid grid-cols-12 py-2 px-3 font-bold border-b-2 ${borderClass} ${tableHeaderBg} text-[10px] tracking-wider`}
          >
            <span className="col-span-2">POS</span>
            <span className="col-span-3">TAG</span>
            <span className="col-span-4 text-right">PUNTOS</span>
            <span className="col-span-3 text-right">FECHA</span>
          </div>

          <div className="divide-y-2 divide-current divide-dashed">
            {scores.length === 0 ? (
              <div className="py-6 text-center text-xs opacity-60">
                NO HAY RÉCORDS AÚN
              </div>
            ) : (
              scores.map((entry, idx) => (
                <div
                  key={`${entry.name}-${entry.score}-${idx}`}
                  className={`grid grid-cols-12 py-2 px-3 items-center font-mono ${
                    idx === 0
                      ? isDarkMode
                        ? 'bg-amber-500/20 text-amber-300 font-bold'
                        : 'bg-amber-100 text-amber-900 font-bold'
                      : ''
                  }`}
                >
                  <span className="col-span-2 font-bold text-xs">
                    #{idx + 1}
                  </span>
                  <span className="col-span-3 font-bold text-xs tracking-widest">
                    {entry.name}
                  </span>
                  <span className="col-span-4 text-right font-bold text-xs tabular-nums">
                    {entry.score.toLocaleString()}
                  </span>
                  <span className="col-span-3 text-right text-[10px] opacity-70">
                    {entry.date}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Reset Confirmation or Action */}
        {!showConfirmReset ? (
          <div className="flex items-center justify-between pt-2">
            <button
              onClick={() => setShowConfirmReset(true)}
              className="text-[10px] underline cursor-pointer opacity-70 hover:opacity-100 flex items-center gap-1"
            >
              <RotateCcw className="w-3 h-3" />
              Reiniciar Récords
            </button>
            <button
              onClick={onClose}
              className={`px-4 py-2 border-2 ${borderClass} ${bgClass} ${boxClass} pixel-btn text-xs font-bold cursor-pointer`}
            >
              VOLVER
            </button>
          </div>
        ) : (
          <div
            className={`p-3 border-2 border-red-500 bg-red-500/10 text-xs flex flex-col gap-2`}
          >
            <div className="flex items-center gap-1.5 text-red-500 font-bold text-[10px]">
              <AlertTriangle className="w-3.5 h-3.5" />
              ¿REINICIAR TODAS LAS PUNTUACIONES?
            </div>
            <div className="flex gap-2 justify-end">
              <button
                onClick={() => setShowConfirmReset(false)}
                className={`px-3 py-1 border ${borderClass} text-[10px] cursor-pointer`}
              >
                CANCELAR
              </button>
              <button
                onClick={() => {
                  onResetScores();
                  setShowConfirmReset(false);
                }}
                className={`px-3 py-1 border border-red-500 bg-red-500 text-white text-[10px] font-bold cursor-pointer`}
              >
                SÍ, BORRAR
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
