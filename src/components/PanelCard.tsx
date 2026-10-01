import React, { useState } from 'react';
import { ComicPanel, ArtStyle, DialogueItem, SoundEffectItem } from '../types/comic';
import { PanelIllustration } from './PanelIllustration';
import { soundFx } from '../utils/soundEffects';
import { Edit2, Sparkles, Volume2, Image as ImageIcon, Plus, Trash2, Wand2 } from 'lucide-react';

interface PanelCardProps {
  panel: ComicPanel;
  artStyle: ArtStyle;
  onEdit: (panel: ComicPanel) => void;
  onRegenerateImage: (panel: ComicPanel) => void;
  onPlaySpeech?: (text: string, speaker: string) => void;
  isGeneratingImage?: boolean;
}

export const PanelCard: React.FC<PanelCardProps> = ({
  panel,
  artStyle,
  onEdit,
  onRegenerateImage,
  onPlaySpeech,
  isGeneratingImage = false,
}) => {
  const [hovered, setHovered] = useState(false);

  const getPositionClasses = (position: string) => {
    switch (position) {
      case 'top-left':
        return 'top-3 left-3 items-start';
      case 'top-right':
        return 'top-3 right-3 items-end';
      case 'bottom-left':
        return 'bottom-3 left-3 items-start';
      case 'bottom-right':
        return 'bottom-3 right-3 items-end';
      case 'top-center':
        return 'top-3 left-1/2 -translate-x-1/2 items-center';
      case 'bottom-center':
        return 'bottom-3 left-1/2 -translate-x-1/2 items-center';
      case 'center':
      default:
        return 'top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 items-center';
    }
  };

  const getBubbleStyle = (type: DialogueItem['type'], color?: string) => {
    switch (type) {
      case 'thought':
        return 'bg-white/95 text-stone-900 border-2 border-black rounded-3xl shadow-[2px_2px_0px_#000] italic';
      case 'shout':
        return 'bg-amber-300 text-stone-950 font-bold border-3 border-black shadow-[3px_3px_0px_#000] uppercase scale-105';
      case 'whisper':
        return 'bg-white/90 text-stone-700 border-2 border-dashed border-stone-800 rounded-xl italic';
      case 'caption':
        return 'bg-amber-100 text-stone-900 border-2 border-black rounded-none shadow-[2px_2px_0px_#000] font-sans font-semibold tracking-wider';
      case 'speech':
      default:
        return 'bg-white text-stone-950 border-2.5 border-black rounded-2xl shadow-[3px_3px_0px_#000]';
    }
  };

  const getSoundFxColor = (style: SoundEffectItem['style']) => {
    switch (style) {
      case 'fiery':
        return 'bg-gradient-to-r from-red-500 via-amber-400 to-yellow-300 text-red-950 border-amber-950';
      case 'electric':
        return 'bg-gradient-to-r from-cyan-400 via-sky-300 to-blue-500 text-cyan-950 border-blue-950';
      case 'cosmic':
        return 'bg-gradient-to-r from-fuchsia-500 via-purple-400 to-indigo-500 text-white border-purple-950';
      case 'stealth':
        return 'bg-stone-800 text-stone-200 border-stone-950';
      case 'punchy':
      default:
        return 'bg-gradient-to-r from-yellow-400 to-amber-500 text-stone-950 border-black';
    }
  };

  return (
    <div
      className="group relative flex flex-col bg-white border-3.5 border-black shadow-[5px_5px_0px_#000] transition-all duration-200 overflow-hidden"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Top Narrator Caption Banner */}
      {panel.caption && (
        <div className="z-20 bg-amber-100 border-b-2.5 border-black px-3 py-1.5 flex items-center justify-between">
          <span className="font-comic text-xs uppercase tracking-wide text-stone-900 line-clamp-2">
            {panel.caption}
          </span>
          <span className="font-sans text-[10px] font-bold text-stone-500 ml-2 shrink-0">
            #{panel.panelNumber}
          </span>
        </div>
      )}

      {/* Main Illustration Area */}
      <div className="relative w-full aspect-[4/3] bg-stone-900 overflow-hidden">
        <PanelIllustration panel={panel} artStyle={artStyle} />

        {/* Loading overlay for image generation */}
        {isGeneratingImage && (
          <div className="absolute inset-0 bg-stone-950/80 z-30 flex flex-col items-center justify-center text-white gap-2 backdrop-blur-xs">
            <Wand2 className="w-8 h-8 text-amber-400 animate-spin" />
            <span className="font-comic text-sm tracking-wide text-amber-300">
              Generating Comic Art with Gemini...
            </span>
          </div>
        )}

        {/* Floating Sound FX Stickers */}
        {panel.soundEffects.map((fx) => (
          <button
            key={fx.id}
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              soundFx.playByEffect(fx.text);
            }}
            title="Click to play sound effect"
            style={{
              left: `${fx.x}%`,
              top: `${fx.y}%`,
              transform: `translate(-50%, -50%) rotate(${fx.rotation}deg)`,
            }}
            className={`absolute z-20 cursor-pointer font-comic tracking-wider text-base sm:text-lg md:text-xl px-2.5 py-0.5 border-2 rounded-lg shadow-[3px_3px_0px_#000] hover:scale-115 active:scale-95 transition-transform ${getSoundFxColor(
              fx.style
            )}`}
          >
            {fx.text}
          </button>
        ))}

        {/* Speech / Dialogue Balloons */}
        {panel.dialogue.map((item) => (
          <div
            key={item.id}
            className={`absolute z-20 flex flex-col max-w-[70%] sm:max-w-[60%] pointer-events-auto ${getPositionClasses(
              item.position
            )}`}
          >
            {/* Speaker Tag */}
            {item.speaker && item.speaker !== 'Narrator' && (
              <span
                style={{
                  backgroundColor: item.characterColor || '#000000',
                  color: '#ffffff',
                }}
                className="font-comic text-[10px] sm:text-xs px-2 py-0.5 rounded-t border-t-2 border-x-2 border-black inline-block uppercase tracking-wider"
              >
                {item.speaker}
              </span>
            )}

            {/* Balloon Content */}
            <div
              className={`relative px-3 py-1.5 sm:px-3.5 sm:py-2 ${getBubbleStyle(
                item.type,
                item.characterColor
              )}`}
            >
              <p className="font-speech text-xs sm:text-sm font-bold leading-tight select-text">
                {item.text}
              </p>

              {/* Quick TTS Audio Listen Button */}
              {onPlaySpeech && (
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    soundFx.playPunch();
                    onPlaySpeech(item.text, item.speaker);
                  }}
                  title="Listen with Gemini TTS"
                  className="absolute -right-2 -bottom-2 w-5 h-5 bg-amber-400 hover:bg-amber-300 text-stone-900 border border-black rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer shadow-xs"
                >
                  <Volume2 className="w-3 h-3" />
                </button>
              )}
            </div>
          </div>
        ))}

        {/* Hover Action Ribbon */}
        <div
          className={`absolute top-2 right-2 z-30 flex items-center gap-1.5 bg-stone-900/90 border-2 border-black rounded-lg p-1 transition-opacity duration-150 ${
            hovered ? 'opacity-100' : 'opacity-0 pointer-events-none'
          }`}
        >
          <button
            type="button"
            onClick={() => {
              soundFx.playWhoosh();
              onEdit(panel);
            }}
            title="Edit panel dialogue, text, and effects"
            className="p-1.5 bg-amber-400 hover:bg-amber-300 text-stone-950 rounded border border-black cursor-pointer shadow-xs"
          >
            <Edit2 className="w-3.5 h-3.5" />
          </button>

          <button
            type="button"
            onClick={() => {
              soundFx.playZap();
              onRegenerateImage(panel);
            }}
            title="Generate custom comic illustration with Gemini AI"
            className="p-1.5 bg-sky-400 hover:bg-sky-300 text-stone-950 rounded border border-black cursor-pointer shadow-xs"
          >
            <Sparkles className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Panel number watermark (bottom right if no caption) */}
        {!panel.caption && (
          <div className="absolute bottom-1 right-2 z-10 font-comic text-xs text-white/50 tracking-wider">
            PANEL {panel.panelNumber}
          </div>
        )}
      </div>

      {/* Visual description footer note for storyboard readers */}
      <div className="p-2 bg-amber-50/70 border-t-2 border-black/80 flex items-center justify-between text-[11px] text-stone-600">
        <span className="truncate pr-2 italic">
          <strong className="font-semibold text-stone-800 not-italic font-sans">Scene: </strong>
          {panel.visualDescription}
        </span>
        <span className="shrink-0 font-bold font-sans text-stone-500 uppercase text-[9px] bg-stone-200/80 px-1.5 py-0.5 rounded">
          {panel.cameraAngle}
        </span>
      </div>
    </div>
  );
};
