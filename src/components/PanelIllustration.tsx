import React from 'react';
import { ComicPanel, ArtStyle } from '../types/comic';

interface PanelIllustrationProps {
  panel: ComicPanel;
  artStyle: ArtStyle;
}

export const PanelIllustration: React.FC<PanelIllustrationProps> = ({ panel, artStyle }) => {
  const { imageUrl, illustrationData } = panel;
  const palette = illustrationData?.colorPalette || {
    skyOrBg: '#1e293b',
    groundOrMid: '#334155',
    accent: '#f59e0b',
    shadow: '#0f172a',
  };

  const effects = illustrationData?.effects || ['halftone-dots'];
  const hasSpeedLines = effects.includes('speed-lines');
  const hasHalftone = effects.includes('halftone-dots');
  const hasEnergy = effects.includes('energy-burst');
  const hasRain = effects.includes('rain');
  const hasSunburst = effects.includes('sunburst');

  // If a real image was generated or uploaded
  if (imageUrl) {
    return (
      <div className="relative w-full h-full overflow-hidden bg-black flex items-center justify-center">
        <img
          src={imageUrl}
          alt={panel.visualDescription}
          className="w-full h-full object-cover select-none"
        />
        {/* Style-specific comic overlays */}
        {artStyle === 'retro-comic' && (
          <div className="absolute inset-0 bg-halftone opacity-35 pointer-events-none mix-blend-multiply" />
        )}
        {artStyle === 'dark-noir' && (
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/40 pointer-events-none" />
        )}
        {artStyle === 'manga' && (
          <div className="absolute inset-0 bg-halftone-dense opacity-20 pointer-events-none mix-blend-screen" />
        )}
      </div>
    );
  }

  // Procedural SVG Comic Vector Engine
  const isManga = artStyle === 'manga';
  const isNoir = artStyle === 'dark-noir';
  const isCyberpunk = artStyle === 'cyberpunk';

  const bgGradientStart = isManga ? '#18181b' : isNoir ? '#09090b' : palette.skyOrBg;
  const bgGradientEnd = isManga ? '#27272a' : isNoir ? '#18181b' : palette.groundOrMid;
  const accentColor = isManga ? '#f4f4f5' : isNoir ? '#d4d4d8' : isCyberpunk ? '#06b6d4' : palette.accent;

  return (
    <div className="relative w-full h-full overflow-hidden select-none bg-stone-900">
      <svg
        viewBox="0 0 400 300"
        className="w-full h-full object-cover"
        preserveAspectRatio="xMidYMid slice"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id={`bgGrad-${panel.id}`} x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor={bgGradientStart} />
            <stop offset="100%" stopColor={bgGradientEnd} />
          </linearGradient>

          <radialGradient id={`glow-${panel.id}`} cx="50%" cy="40%" r="60%">
            <stop offset="0%" stopColor={accentColor} stopOpacity="0.4" />
            <stop offset="100%" stopColor={bgGradientStart} stopOpacity="0" />
          </radialGradient>

          {/* Halftone pattern */}
          <pattern id={`dots-${panel.id}`} width="8" height="8" patternUnits="userSpaceOnUse">
            <circle cx="4" cy="4" r={isManga ? '1.5' : '1.8'} fill={isManga ? '#ffffff' : '#000000'} opacity="0.18" />
          </pattern>

          {/* Screentone crosshatch */}
          <pattern id={`screentone-${panel.id}`} width="6" height="6" patternUnits="userSpaceOnUse">
            <line x1="0" y1="0" x2="6" y2="6" stroke="#000000" strokeWidth="0.8" opacity="0.25" />
          </pattern>
        </defs>

        {/* 1. Base Sky / Room Background */}
        <rect width="400" height="300" fill={`url(#bgGrad-${panel.id})`} />

        {/* Ambient Glow */}
        <circle cx="200" cy="130" r="180" fill={`url(#glow-${panel.id})`} />

        {/* 2. Sunburst / Radiant Action Rays */}
        {hasSunburst && (
          <g opacity={isManga ? '0.25' : '0.2'}>
            {[...Array(16)].map((_, i) => {
              const angle = (i * 360) / 16;
              return (
                <polygon
                  key={i}
                  points="200,140 0,0 25,0"
                  transform={`rotate(${angle} 200 140)`}
                  fill={accentColor}
                />
              );
            })}
          </g>
        )}

        {/* 3. Speed Lines (Radial Action) */}
        {hasSpeedLines && (
          <g opacity={isManga ? '0.45' : '0.3'}>
            {[...Array(28)].map((_, i) => {
              const angle = (i * 360) / 28 + (i % 2) * 5;
              const len = 70 + (i % 5) * 15;
              return (
                <line
                  key={i}
                  x1="200"
                  y1="140"
                  x2={200 + Math.cos((angle * Math.PI) / 180) * 260}
                  y2={140 + Math.sin((angle * Math.PI) / 180) * 260}
                  stroke={isManga ? '#ffffff' : accentColor}
                  strokeWidth={(i % 3) + 1.2}
                  strokeDasharray={`${len} 20`}
                />
              );
            })}
          </g>
        )}

        {/* 4. Energy Burst Explosion Star */}
        {hasEnergy && (
          <g transform="translate(200, 140)">
            <polygon
              points="0,-65 18,-25 65,-30 32,8 55,50 10,32 -20,60 -25,20 -65,10 -28,-18"
              fill={accentColor}
              opacity="0.85"
              stroke="#000000"
              strokeWidth="2.5"
            />
            <polygon
              points="0,-45 12,-18 45,-20 22,5 38,35 8,22 -15,42 -18,14 -45,8 -20,-12"
              fill="#ffffff"
              opacity="0.9"
            />
          </g>
        )}

        {/* 5. Cityscape / Environmental Horizon Silhouettes */}
        <g opacity="0.65">
          {/* Back layer buildings */}
          <polygon
            points="0,300 0,180 35,180 35,165 65,165 65,210 110,210 110,140 145,140 145,220 230,220 230,175 270,175 270,230 340,230 340,190 380,190 380,300"
            fill={palette.shadow}
          />
          {/* Lit windows in buildings */}
          <g fill={accentColor} opacity="0.6">
            <rect x="15" y="190" width="4" height="6" />
            <rect x="25" y="190" width="4" height="6" />
            <rect x="75" y="160" width="4" height="6" />
            <rect x="85" y="160" width="4" height="6" />
            <rect x="120" y="170" width="4" height="6" />
            <rect x="130" y="170" width="4" height="6" />
            <rect x="245" y="195" width="4" height="6" />
            <rect x="255" y="195" width="4" height="6" />
            <rect x="355" y="210" width="4" height="6" />
          </g>
        </g>

        {/* 6. Dynamic Foreground Character Silhouette / Figure */}
        <g transform="translate(140, 100)">
          {/* Comic character shadow on ground */}
          <ellipse cx="60" cy="180" rx="45" ry="12" fill="#000000" opacity="0.5" />

          {/* Cloak / Haori / Trench Coat dynamics */}
          <path
            d="M 35 70 Q 15 120 5 170 Q 55 160 85 170 Q 105 120 85 70 Z"
            fill={palette.shadow}
            stroke="#000000"
            strokeWidth="3"
          />

          {/* Torso & Armor */}
          <path
            d="M 40 55 L 80 55 L 75 110 L 45 110 Z"
            fill={palette.groundOrMid}
            stroke="#000000"
            strokeWidth="2.5"
          />

          {/* Dynamic Arms & Weapon / Tech */}
          <path
            d="M 40 60 L 15 85 L 25 115"
            stroke="#000000"
            strokeWidth="6"
            strokeLinecap="round"
            fill="none"
          />
          {/* Raised Arm / Sword / Gadget */}
          <path
            d="M 80 60 L 110 40 L 135 15"
            stroke="#000000"
            strokeWidth="6"
            strokeLinecap="round"
            fill="none"
          />

          {/* Energy Blade / Laser Beam / Flare */}
          <line
            x1="135"
            y1="15"
            x2="175"
            y2="-20"
            stroke={accentColor}
            strokeWidth="4.5"
            strokeLinecap="round"
          />
          <line
            x1="135"
            y1="15"
            x2="175"
            y2="-20"
            stroke="#ffffff"
            strokeWidth="2"
            strokeLinecap="round"
          />

          {/* Head & Mask / Visor */}
          <circle cx="60" cy="38" r="16" fill={palette.shadow} stroke="#000000" strokeWidth="2.5" />
          {/* Glowing Visor / Eyes */}
          <ellipse cx="65" cy="37" rx="6" ry="2.5" fill={accentColor} />

          {/* Comic Ink Rim Accent */}
          <path
            d="M 50 25 Q 60 15 72 25"
            stroke={accentColor}
            strokeWidth="2"
            fill="none"
            opacity="0.8"
          />
        </g>

        {/* 7. Rain Streaks (For Noir / Gritty) */}
        {hasRain && (
          <g stroke="#ffffff" opacity="0.4" strokeWidth="1.2" strokeLinecap="round">
            {[...Array(24)].map((_, i) => (
              <line
                key={i}
                x1={(i * 22) % 400}
                y1={(i * 37) % 300}
                x2={((i * 22) % 400) - 12}
                y2={((i * 37) % 300) + 32}
              />
            ))}
          </g>
        )}

        {/* 8. Halftone Overlay */}
        {hasHalftone && (
          <rect width="400" height="300" fill={`url(#dots-${panel.id})`} pointerEvents="none" />
        )}
        {isManga && (
          <rect width="400" height="300" fill={`url(#screentone-${panel.id})`} pointerEvents="none" />
        )}

        {/* 9. Cinematic Vignette Frame */}
        <rect
          width="400"
          height="300"
          fill="none"
          stroke="#000000"
          strokeWidth="12"
          opacity="0.15"
        />

        {/* Camera Angle indicator stamp (Subtle watermark style) */}
        <g transform="translate(12, 288)">
          <text
            x="0"
            y="0"
            fill="#ffffff"
            opacity="0.35"
            fontSize="8"
            fontFamily="'Inter', sans-serif"
            fontWeight="bold"
            letterSpacing="1"
          >
            {panel.cameraAngle.toUpperCase()}
          </text>
        </g>
      </svg>
    </div>
  );
};
