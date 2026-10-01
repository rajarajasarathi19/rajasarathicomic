import React, { useState, useEffect, useCallback } from 'react';
import { ComicStory, ComicPanel } from '../types/comic';
import { PanelCard } from './PanelCard';
import { soundFx } from '../utils/soundEffects';
import { X, ChevronLeft, ChevronRight, Volume2, VolumeX, Play, Pause, Maximize2 } from 'lucide-react';

interface ReadingModeModalProps {
  comic: ComicStory;
  isOpen: boolean;
  onClose: () => void;
  onPlaySpeech?: (text: string, speaker: string) => void;
}

export const ReadingModeModal: React.FC<ReadingModeModalProps> = ({
  comic,
  isOpen,
  onClose,
  onPlaySpeech,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [autoPlay, setAutoPlay] = useState(false);
  const [narrationEnabled, setNarrationEnabled] = useState(true);

  const panels = comic.panels;
  const currentPanel: ComicPanel | undefined = panels[currentIndex];

  const handleNext = useCallback(() => {
    if (currentIndex < panels.length - 1) {
      soundFx.playPageTurn();
      setCurrentIndex((prev) => prev + 1);
    } else {
      soundFx.playTada();
      setAutoPlay(false);
    }
  }, [currentIndex, panels.length]);

  const handlePrev = useCallback(() => {
    if (currentIndex > 0) {
      soundFx.playPageTurn();
      setCurrentIndex((prev) => prev - 1);
    }
  }, [currentIndex]);

  // Read panel content aloud
  const narrateCurrentPanel = useCallback(
    async (panel: ComicPanel) => {
      if (!narrationEnabled) return;

      const lines: string[] = [];
      if (panel.caption) lines.push(`Narrator: ${panel.caption}`);
      panel.dialogue.forEach((d) => {
        lines.push(`${d.speaker || 'Character'}: ${d.text}`);
      });

      const fullScript = lines.join('. ');
      if (!fullScript) return;

      if (onPlaySpeech) {
        onPlaySpeech(fullScript, 'Narrator');
      } else if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(fullScript);
        utterance.rate = 1.05;
        utterance.pitch = 1.0;
        window.speechSynthesis.speak(utterance);
      }
    },
    [narrationEnabled, onPlaySpeech]
  );

  // Trigger speech when panel changes
  useEffect(() => {
    if (isOpen && currentPanel && narrationEnabled) {
      narrateCurrentPanel(currentPanel);
    }
  }, [currentIndex, isOpen, currentPanel, narrationEnabled, narrateCurrentPanel]);

  // Auto-play timer
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (autoPlay && isOpen) {
      timer = setTimeout(() => {
        handleNext();
      }, 5500);
    }
    return () => clearTimeout(timer);
  }, [autoPlay, isOpen, currentIndex, handleNext]);

  // Keyboard navigation
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight' || e.key === ' ') {
        e.preventDefault();
        handleNext();
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        handlePrev();
      } else if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, handleNext, handlePrev, onClose]);

  if (!isOpen || !currentPanel) return null;

  return (
    <div className="fixed inset-0 z-50 bg-stone-950/95 flex flex-col items-center justify-between p-4 sm:p-6 backdrop-blur-md select-none">
      {/* Top Reading Header */}
      <div className="w-full max-w-4xl flex items-center justify-between text-white border-b-2 border-stone-800 pb-3">
        <div className="flex items-center gap-3">
          <span className="font-comic text-2xl text-amber-400 tracking-wider">
            {comic.title}
          </span>
          <span className="font-sans text-xs bg-amber-400/20 text-amber-300 font-bold px-2 py-0.5 border border-amber-400/40 rounded">
            {comic.issueNumber}
          </span>
        </div>

        <div className="flex items-center gap-3">
          {/* Narration toggle */}
          <button
            type="button"
            onClick={() => setNarrationEnabled(!narrationEnabled)}
            className={`p-2 rounded border border-stone-700 cursor-pointer transition-colors ${
              narrationEnabled
                ? 'bg-amber-400 text-stone-950 border-amber-400 font-bold'
                : 'bg-stone-800 text-stone-400'
            }`}
            title={narrationEnabled ? 'Voice Narration ON' : 'Voice Narration OFF'}
          >
            {narrationEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
          </button>

          {/* Autoplay Slideshow */}
          <button
            type="button"
            onClick={() => setAutoPlay(!autoPlay)}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded border cursor-pointer ${
              autoPlay
                ? 'bg-red-600 text-white border-red-500 animate-pulse'
                : 'bg-stone-800 text-stone-300 border-stone-700 hover:bg-stone-700'
            }`}
          >
            {autoPlay ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
            <span>{autoPlay ? 'Pause' : 'Autoplay'}</span>
          </button>

          {/* Close */}
          <button
            type="button"
            onClick={() => {
              if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
                window.speechSynthesis.cancel();
              }
              onClose();
            }}
            className="p-2 bg-stone-800 hover:bg-stone-700 text-stone-200 border border-stone-700 rounded cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Main Spotlight Panel Stage */}
      <div className="relative w-full max-w-3xl flex-1 flex items-center justify-center my-4 overflow-hidden">
        {/* Navigation Arrows */}
        <button
          type="button"
          onClick={handlePrev}
          disabled={currentIndex === 0}
          className="absolute left-2 sm:-left-4 z-40 w-12 h-12 bg-amber-400 hover:bg-amber-300 disabled:opacity-30 disabled:pointer-events-none text-stone-950 border-3 border-black shadow-[4px_4px_0px_#000] flex items-center justify-center cursor-pointer transition-transform hover:scale-105 active:scale-95"
        >
          <ChevronLeft className="w-8 h-8" />
        </button>

        <button
          type="button"
          onClick={handleNext}
          disabled={currentIndex === panels.length - 1}
          className="absolute right-2 sm:-right-4 z-40 w-12 h-12 bg-amber-400 hover:bg-amber-300 disabled:opacity-30 disabled:pointer-events-none text-stone-950 border-3 border-black shadow-[4px_4px_0px_#000] flex items-center justify-center cursor-pointer transition-transform hover:scale-105 active:scale-95"
        >
          <ChevronRight className="w-8 h-8" />
        </button>

        {/* Current Spotlight Panel */}
        <div className="w-full max-w-xl max-h-[75vh] flex flex-col transform transition-all duration-300">
          <PanelCard
            panel={currentPanel}
            artStyle={comic.artStyle}
            onEdit={() => {}}
            onRegenerateImage={() => {}}
            onPlaySpeech={onPlaySpeech}
          />
        </div>
      </div>

      {/* Bottom Panel Navigator & Progress */}
      <div className="w-full max-w-xl flex flex-col items-center gap-2">
        <div className="flex items-center gap-2">
          {panels.map((p, idx) => (
            <button
              key={p.id}
              type="button"
              onClick={() => {
                soundFx.playPageTurn();
                setCurrentIndex(idx);
              }}
              className={`w-9 h-9 border-2 border-black font-comic text-sm flex items-center justify-center cursor-pointer transition-all ${
                idx === currentIndex
                  ? 'bg-amber-400 text-stone-950 scale-110 shadow-[2px_2px_0px_#fff]'
                  : 'bg-stone-800 text-stone-400 hover:bg-stone-700'
              }`}
            >
              {idx + 1}
            </button>
          ))}
        </div>
        <div className="text-stone-400 text-xs font-semibold">
          Panel {currentIndex + 1} of {panels.length} · Use Arrow Keys or Spacebar to flip
        </div>
      </div>
    </div>
  );
};
