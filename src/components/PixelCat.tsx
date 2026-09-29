/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { CatType } from '../types';

interface PixelCatProps {
  type: CatType;
  state: 'ALIVE' | 'WHACKED';
  isDarkMode: boolean;
  size?: number;
  className?: string;
}

export const PixelCat: React.FC<PixelCatProps> = ({
  type,
  state,
  isDarkMode,
  size = 64,
  className = '',
}) => {
  const isGreen = type === 'GREEN_EXTRA_LIFE';
  const isWhacked = state === 'WHACKED';

  // Palette definitions depending on mode and cat type
  // Light mode standard: Body is crisp light waffle gray/cream (#E5E5E5 / #D4D4D4), outline is black (#000000), grid pockets are (#A3A3A3)
  // Dark mode standard: Body is dark charcoal (#262626 / #333333), outline is white (#FFFFFF), grid pockets are (#525252)
  // Green cat: Body is vivid neon arcade green (#22C55E / #4ADE80), outline is crisp black/dark green or bright contrast, pockets are (#16A34A / #15803D)

  let outlineColor = isDarkMode ? '#FFFFFF' : '#000000';
  let bodyColor = isDarkMode ? '#262626' : '#E5E5E5';
  let bodyHighlight = isDarkMode ? '#404040' : '#F5F5F5';
  let pocketColor = isDarkMode ? '#525252' : '#A3A3A3';
  let eyeColor = isDarkMode ? '#FFFFFF' : '#000000';
  let eyeGlint = isDarkMode ? '#000000' : '#FFFFFF';
  let earInner = isDarkMode ? '#525252' : '#D4D4D4';
  let noseMouth = isDarkMode ? '#FFFFFF' : '#000000';

  if (isGreen) {
    outlineColor = isDarkMode ? '#FFFFFF' : '#000000';
    bodyColor = '#22C55E'; // Vibrant emerald arcade green
    bodyHighlight = '#4ADE80'; // Neon green highlight
    pocketColor = '#15803D'; // Darker green grid pocket
    eyeColor = '#052E16'; // Deep forest green
    eyeGlint = '#FFFFFF';
    earInner = '#86EFAC'; // Light minty green
    noseMouth = '#052E16';
  }

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      className={`select-none pointer-events-none ${className}`}
      style={{ imageRendering: 'pixelated' }}
      aria-label={isGreen ? 'Gato Gofre Verde Especial' : 'Gato Gofre'}
    >
      {/* TAIL (Curled on right side: x: 26-29, y: 16-24) */}
      <rect x="26" y="21" width="3" height="2" fill={outlineColor} />
      <rect x="28" y="17" width="2" height="4" fill={outlineColor} />
      <rect x="25" y="15" width="4" height="2" fill={outlineColor} />
      {/* Tail fill */}
      <rect x="26" y="20" width="2" height="2" fill={bodyColor} />
      <rect x="27" y="17" width="2" height="3" fill={bodyColor} />
      <rect x="26" y="16" width="2" height="1" fill={bodyHighlight} />

      {/* CAT EARS OUTLINE */}
      {/* Left Ear */}
      <rect x="5" y="2" width="4" height="2" fill={outlineColor} />
      <rect x="4" y="4" width="2" height="4" fill={outlineColor} />
      <rect x="9" y="3" width="2" height="4" fill={outlineColor} />
      {/* Right Ear */}
      <rect x="21" y="2" width="4" height="2" fill={outlineColor} />
      <rect x="19" y="3" width="2" height="4" fill={outlineColor} />
      <rect x="24" y="4" width="2" height="4" fill={outlineColor} />

      {/* HEAD / BODY SQUARE OUTLINE */}
      {/* Top Head border between ears */}
      <rect x="9" y="6" width="12" height="2" fill={outlineColor} />
      {/* Left border */}
      <rect x="3" y="7" width="2" height="18" fill={outlineColor} />
      {/* Right border */}
      <rect x="25" y="7" width="2" height="18" fill={outlineColor} />
      {/* Bottom border */}
      <rect x="5" y="25" width="20" height="2" fill={outlineColor} />
      {/* Corners */}
      <rect x="4" y="24" width="2" height="2" fill={outlineColor} />
      <rect x="24" y="24" width="2" height="2" fill={outlineColor} />

      {/* EAR INNER FILLS */}
      {/* Left Ear inside */}
      <rect x="6" y="4" width="3" height="3" fill={bodyColor} />
      <rect x="6" y="4" width="2" height="2" fill={earInner} />
      {/* Right Ear inside */}
      <rect x="21" y="4" width="3" height="3" fill={bodyColor} />
      <rect x="22" y="4" width="2" height="2" fill={earInner} />

      {/* MAIN WAFFLE BODY FILL */}
      <rect x="5" y="8" width="20" height="16" fill={bodyColor} />
      {/* Subtle top/left highlights */}
      <rect x="5" y="8" width="20" height="1" fill={bodyHighlight} />
      <rect x="5" y="9" width="1" height="15" fill={bodyHighlight} />

      {/* WAFFLE GRID PATTERN (Grid of 3x3 deep indented waffle pockets) */}
      {/* Row 1 Pockets (y=11) */}
      <rect x="7" y="11" width="3" height="2" fill={pocketColor} />
      <rect x="14" y="11" width="3" height="2" fill={pocketColor} />
      <rect x="21" y="11" width="3" height="2" fill={pocketColor} />

      {/* Row 2 Pockets (y=16) */}
      <rect x="7" y="16" width="3" height="2" fill={pocketColor} />
      <rect x="14" y="16" width="3" height="2" fill={pocketColor} />
      <rect x="21" y="16" width="3" height="2" fill={pocketColor} />

      {/* Row 3 Pockets (y=21) */}
      <rect x="7" y="21" width="3" height="2" fill={pocketColor} />
      <rect x="14" y="21" width="3" height="2" fill={pocketColor} />
      <rect x="21" y="21" width="3" height="2" fill={pocketColor} />

      {/* WHISKERS */}
      {/* Left Whiskers */}
      <rect x="0" y="14" width="3" height="1" fill={outlineColor} />
      <rect x="0" y="17" width="3" height="1" fill={outlineColor} />
      {/* Right Whiskers */}
      <rect x="27" y="14" width="3" height="1" fill={outlineColor} />
      <rect x="27" y="17" width="3" height="1" fill={outlineColor} />

      {/* BOTTOM PAWS */}
      {/* Left Paw */}
      <rect x="7" y="26" width="4" height="2" fill={outlineColor} />
      <rect x="8" y="25" width="2" height="2" fill={bodyHighlight} />
      {/* Right Paw */}
      <rect x="19" y="26" width="4" height="2" fill={outlineColor} />
      <rect x="20" y="25" width="2" height="2" fill={bodyHighlight} />

      {/* SPECIAL GREEN CAT BADGE (Pixel Heart / Cross on forehead) */}
      {isGreen && (
        <g>
          {/* Heart Emblem centered on forehead (x: 13-17, y: 7-10) */}
          <rect x="13" y="7" width="2" height="1" fill="#FFFFFF" />
          <rect x="16" y="7" width="2" height="1" fill="#FFFFFF" />
          <rect x="12" y="8" width="7" height="1" fill="#FFFFFF" />
          <rect x="13" y="9" width="5" height="1" fill="#FFFFFF" />
          <rect x="14" y="10" width="3" height="1" fill="#FFFFFF" />
          <rect x="15" y="11" width="1" height="1" fill="#FFFFFF" />

          {/* Inner ruby/sparkle heart pixel */}
          <rect x="14" y="8" width="1" height="1" fill="#DC2626" />
          <rect x="16" y="8" width="1" height="1" fill="#DC2626" />
        </g>
      )}

      {/* FACE EXPRESSION: NORMAL VS WHACKED */}
      {!isWhacked ? (
        <g>
          {/* LEFT EYE */}
          <rect x="9" y="13" width="3" height="3" fill={eyeColor} />
          <rect x="9" y="13" width="1" height="1" fill={eyeGlint} />

          {/* RIGHT EYE */}
          <rect x="18" y="13" width="3" height="3" fill={eyeColor} />
          <rect x="18" y="13" width="1" height="1" fill={eyeGlint} />

          {/* NOSE */}
          <rect x="14" y="16" width="2" height="1" fill={noseMouth} />

          {/* CUTE KITTY MOUTH (w-shaped) */}
          <rect x="13" y="17" width="1" height="1" fill={noseMouth} />
          <rect x="16" y="17" width="1" height="1" fill={noseMouth} />
          <rect x="14" y="18" width="2" height="1" fill={noseMouth} />
        </g>
      ) : isGreen ? (
        /* GREEN CAT WHACKED (Ecstatic happy wink + stars) */
        <g>
          {/* Wink eye left: arc "^" */}
          <rect x="9" y="13" width="1" height="1" fill={eyeColor} />
          <rect x="10" y="12" width="2" height="1" fill={eyeColor} />
          <rect x="12" y="13" width="1" height="1" fill={eyeColor} />

          {/* Closed happy arc right "^" */}
          <rect x="18" y="13" width="1" height="1" fill={eyeColor} />
          <rect x="19" y="12" width="2" height="1" fill={eyeColor} />
          <rect x="21" y="13" width="1" height="1" fill={eyeColor} />

          {/* Cheerful open smile */}
          <rect x="14" y="15" width="2" height="1" fill={noseMouth} />
          <rect x="13" y="16" width="4" height="2" fill={noseMouth} />
          <rect x="14" y="17" width="2" height="1" fill="#FFFFFF" />

          {/* Sparkle star next to face */}
          <rect x="23" y="10" width="1" height="3" fill="#FFFFFF" />
          <rect x="22" y="11" width="3" height="1" fill="#FFFFFF" />
        </g>
      ) : (
        /* NORMAL CAT WHACKED ("X X" Cross Eyes + Dizzy Face) */
        <g>
          {/* LEFT EYE 'X' */}
          <rect x="9" y="12" width="1" height="1" fill={eyeColor} />
          <rect x="12" y="12" width="1" height="1" fill={eyeColor} />
          <rect x="10" y="13" width="2" height="1" fill={eyeColor} />
          <rect x="9" y="14" width="1" height="1" fill={eyeColor} />
          <rect x="12" y="14" width="1" height="1" fill={eyeColor} />

          {/* RIGHT EYE 'X' */}
          <rect x="18" y="12" width="1" height="1" fill={eyeColor} />
          <rect x="21" y="12" width="1" height="1" fill={eyeColor} />
          <rect x="19" y="13" width="2" height="1" fill={eyeColor} />
          <rect x="18" y="14" width="1" height="1" fill={eyeColor} />
          <rect x="21" y="14" width="1" height="1" fill={eyeColor} />

          {/* NOSE */}
          <rect x="14" y="16" width="2" height="1" fill={noseMouth} />

          {/* DIZZY OVAL MOUTH */}
          <rect x="13" y="18" width="4" height="2" fill={noseMouth} />
          <rect x="14" y="19" width="2" height="1" fill={isDarkMode ? '#000000' : '#FFFFFF'} />

          {/* SWEAT DROP on forehead */}
          <rect x="7" y="9" width="2" height="2" fill={isDarkMode ? '#FFFFFF' : '#000000'} />
          <rect x="8" y="8" width="1" height="1" fill={isDarkMode ? '#FFFFFF' : '#000000'} />
        </g>
      )}
    </svg>
  );
};
