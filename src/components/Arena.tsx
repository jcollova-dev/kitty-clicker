/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useRef } from 'react';
import { ActiveCat, FloatingNotification } from '../types';
import { PixelCat } from './PixelCat';

interface ArenaProps {
  cats: ActiveCat[];
  onWhackCat: (catId: string, event: React.PointerEvent) => void;
  floatingNotes: FloatingNotification[];
  isDarkMode: boolean;
  hurtFlash: boolean;
  healFlash: boolean;
  gameState: 'MENU' | 'PLAYING' | 'PAUSED' | 'GAME_OVER';
  onStartGame: () => void;
  arenaRef: React.RefObject<HTMLDivElement | null>;
}

export const Arena: React.FC<ArenaProps> = ({
  cats,
  onWhackCat,
  floatingNotes,
  isDarkMode,
  hurtFlash,
  healFlash,
  gameState,
  onStartGame,
  arenaRef,
}) => {
  const borderClass = isDarkMode ? 'border-white' : 'border-black';
  const boxClass = isDarkMode ? 'pixel-box-dark' : 'pixel-box';
  const bgArena = isDarkMode ? 'bg-[#121212]' : 'bg-[#FAFAFA]';
  const cursorClass = isDarkMode ? 'arena-cursor-dark' : 'arena-cursor';

  return (
    <div
      ref={arenaRef}
      className={`relative w-full h-[450px] sm:h-[520px] md:h-[580px] border-4 ${borderClass} ${bgArena} ${boxClass} ${cursorClass} select-none overflow-hidden transition-colors duration-100 ${
        hurtFlash ? 'animate-hurt' : ''
      } ${healFlash ? 'animate-heal' : ''}`}
      style={{ touchAction: 'manipulation' }}
    >
      {/* Retro grid background scanlines / dot texture */}
      <div
        className="absolute inset-0 pointer-events-none opacity-5"
        style={{
          backgroundImage: isDarkMode
            ? 'radial-gradient(circle, #ffffff 1px, transparent 1px)'
            : 'radial-gradient(circle, #000000 1px, transparent 1px)',
          backgroundSize: '16px 16px',
        }}
      />

      {/* START / TITLE MENU OVERLAY */}
      {gameState === 'MENU' && (
        <div className="absolute inset-0 z-30 flex flex-col items-center justify-center p-6 bg-black/60 backdrop-blur-2xs text-center text-white">
          <div className="max-w-md flex flex-col items-center gap-4 animate-in fade-in zoom-in-95 duration-200">
            {/* Mascot Showcase */}
            <div className="flex items-center justify-center gap-6 py-2">
              <div className="flex flex-col items-center gap-1">
                <PixelCat
                  type="NORMAL"
                  state="ALIVE"
                  isDarkMode={true}
                  size={64}
                />
                <span className="text-[9px] font-mono opacity-80">
                  GATO GOFRE (+10)
                </span>
              </div>
              <div className="flex flex-col items-center gap-1">
                <PixelCat
                  type="GREEN_EXTRA_LIFE"
                  state="ALIVE"
                  isDarkMode={true}
                  size={64}
                />
                <span className="text-[9px] font-mono text-emerald-400 font-bold">
                  GATO VERDE (+1 VIDA)
                </span>
              </div>
            </div>

            <div className="space-y-2">
              <h1 className="text-lg sm:text-2xl font-bold tracking-tight text-white drop-shadow-sm">
                WHACK-A-WAFFLE CAT
              </h1>
              <p className="text-[11px] font-mono text-zinc-300 leading-relaxed max-w-sm">
                Golpea a los gatos antes de que escapen. ¡Si un gato normal huye,
                pierdes 1 vida! Caza al gato verde para vidas extra.
              </p>
            </div>

            <div className="border border-white/30 p-2.5 text-[9px] font-mono text-zinc-300 text-left w-full space-y-1">
              <div>• Comienzas con 3 vidas (máximo 5).</div>
              <div>• Tienes 45 segundos para lograr el récord.</div>
              <div>• ¡Gato Verde dura muy poco tiempo!</div>
            </div>

            <button
              onClick={onStartGame}
              className="mt-2 px-8 py-4 border-4 border-white bg-emerald-500 text-black font-bold text-sm tracking-widest pixel-btn cursor-pointer shadow-lg hover:bg-emerald-400 transition-colors"
            >
              ¡COMENZAR JUEGO!
            </button>
          </div>
        </div>
      )}

      {/* PAUSE OVERLAY */}
      {gameState === 'PAUSED' && (
        <div className="absolute inset-0 z-30 flex flex-col items-center justify-center p-6 bg-black/75 backdrop-blur-2xs text-center text-white">
          <div className="flex flex-col items-center gap-4">
            <h2 className="text-2xl font-bold tracking-widest">PAUSA</h2>
            <p className="text-xs opacity-80 font-mono">
              El juego está detenido. Haz clic para continuar.
            </p>
            <button
              onClick={onStartGame}
              className="px-6 py-3 border-2 border-white bg-white text-black font-bold text-xs pixel-btn cursor-pointer"
            >
              CONTINUAR
            </button>
          </div>
        </div>
      )}

      {/* ACTIVE CATS */}
      {cats.map((cat) => {
        const isGreen = cat.type === 'GREEN_EXTRA_LIFE';
        return (
          <div
            key={cat.id}
            onPointerDown={(e) => {
              e.stopPropagation();
              onWhackCat(cat.id, e);
            }}
            style={{
              position: 'absolute',
              left: `${cat.x}px`,
              top: `${cat.y}px`,
              width: `${cat.size}px`,
              height: `${cat.size}px`,
              touchAction: 'manipulation',
            }}
            className={`cursor-pointer transition-transform duration-75 active:scale-95 select-none ${
              cat.state === 'WHACKED' ? 'scale-110' : 'animate-in zoom-in-75'
            }`}
            title={isGreen ? '¡Gato Verde Especial! (+1 Vida)' : 'Gato Gofre'}
          >
            {/* Visual glow ring for Green Cat */}
            {isGreen && cat.state === 'ALIVE' && (
              <div
                className="absolute -inset-1 border-2 border-dashed border-emerald-400 rounded-sm animate-pulse pointer-events-none"
                style={{ imageRendering: 'pixelated' }}
              />
            )}

            {/* SVG Pixel Cat */}
            <PixelCat
              type={cat.type}
              state={cat.state}
              isDarkMode={isDarkMode}
              size={cat.size}
            />

            {/* Quick lifespan warning indicator bar underneath */}
            {cat.state === 'ALIVE' && (
              <div className="w-full h-1 bg-black/20 mt-0.5 overflow-hidden">
                <div
                  className={`h-full ${
                    isGreen ? 'bg-emerald-400' : isDarkMode ? 'bg-white' : 'bg-black'
                  }`}
                  style={{
                    animation: `shrinkWidth ${cat.lifespan}ms linear forwards`,
                  }}
                />
              </div>
            )}
          </div>
        );
      })}

      {/* FLOATING TEXT NOTIFICATIONS (Score, Lives, etc.) */}
      {floatingNotes.map((note) => {
        let textColor = isDarkMode ? 'text-white' : 'text-black';
        if (note.color === 'green' || note.color === 'bonus') {
          textColor = 'text-emerald-500 font-bold';
        } else if (note.color === 'miss') {
          textColor = 'text-red-500 font-bold';
        }

        return (
          <div
            key={note.id}
            style={{
              position: 'absolute',
              left: `${note.x}px`,
              top: `${note.y}px`,
              transform: 'translate(-50%, -50%)',
              pointerEvents: 'none',
            }}
            className={`font-mono text-xs sm:text-sm font-bold tracking-wider select-none ${textColor} animate-out fade-out slide-out-to-top-6 duration-500 fill-mode-forwards drop-shadow-sm`}
          >
            {note.text}
          </div>
        );
      })}
    </div>
  );
};
