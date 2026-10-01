import React, { useState } from 'react';
import { ComicStory } from '../types/comic';
import { soundFx } from '../utils/soundEffects';
import {
  Sparkles,
  BookOpen,
  Download,
  Printer,
  FileCode,
  FolderOpen,
  Volume2,
  VolumeX,
  Plus,
  Compass,
} from 'lucide-react';

interface NavbarProps {
  currentComic: ComicStory;
  onNewStory: () => void;
  onOpenReadingMode: () => void;
  onOpenGallery: () => void;
  onSelectPreset: (presetId: string) => void;
  onExportPng: () => void;
  onPrint: () => void;
  onExportJson: () => void;
  presets: ComicStory[];
}

export const Navbar: React.FC<NavbarProps> = ({
  currentComic,
  onNewStory,
  onOpenReadingMode,
  onOpenGallery,
  onSelectPreset,
  onExportPng,
  onPrint,
  onExportJson,
  presets,
}) => {
  const [soundEnabled, setSoundEnabled] = useState(soundFx.isEnabled());
  const [showPresetsMenu, setShowPresetsMenu] = useState(false);
  const [showExportMenu, setShowExportMenu] = useState(false);

  const toggleSound = () => {
    const next = !soundEnabled;
    setSoundEnabled(next);
    soundFx.setSoundEnabled(next);
    if (next) soundFx.playPunch();
  };

  return (
    <header className="no-print sticky top-0 z-40 bg-amber-400 border-b-4 border-black px-4 sm:px-6 py-3 shadow-[0px_4px_0px_#000]">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
        {/* Brand & Tag */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-red-600 border-3 border-black text-amber-300 font-comic text-2xl flex items-center justify-center shadow-[3px_3px_0px_#000] rotate-[-3deg]">
            CC
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-comic text-2xl tracking-wider text-stone-950 uppercase leading-none">
                COMICCRAFT
              </span>
              <span className="bg-black text-amber-300 text-[10px] font-bold px-1.5 py-0.5 uppercase tracking-widest">
                GEMINI AI
              </span>
            </div>
            <p className="text-[11px] font-bold text-stone-800 tracking-wide hidden sm:block">
              AI Comic Story Creator · Issue: {currentComic.title}
            </p>
          </div>
        </div>

        {/* Central & Right Action Buttons */}
        <div className="flex items-center gap-2 flex-wrap">
          {/* New Story Primary CTA */}
          <button
            type="button"
            onClick={() => {
              soundFx.playZap();
              onNewStory();
            }}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-red-600 hover:bg-red-500 text-white font-comic text-base tracking-wide border-2 border-black shadow-[3px_3px_0px_#000] cursor-pointer hover:-translate-y-0.5 active:translate-y-0.5 transition-all"
          >
            <Plus className="w-4 h-4 text-amber-300" />
            NEW COMIC
          </button>

          {/* Presets Dropdown */}
          <div className="relative">
            <button
              type="button"
              onClick={() => {
                soundFx.playWhoosh();
                setShowPresetsMenu(!showPresetsMenu);
                setShowExportMenu(false);
              }}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white hover:bg-amber-100 text-stone-900 font-bold text-xs border-2 border-black shadow-[2px_2px_0px_#000] cursor-pointer"
            >
              <Compass className="w-3.5 h-3.5 text-stone-700" />
              Presets
            </button>

            {showPresetsMenu && (
              <div className="absolute right-0 mt-2 w-64 bg-amber-50 border-3 border-black shadow-[5px_5px_0px_#000] z-50 p-2 space-y-1">
                <div className="font-comic text-xs tracking-wider text-stone-900 px-2 py-1 uppercase border-b border-black/20">
                  Select Comic Preset
                </div>
                {presets.map((p) => (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => {
                      soundFx.playPunch();
                      onSelectPreset(p.id);
                      setShowPresetsMenu(false);
                    }}
                    className="w-full text-left p-2 hover:bg-amber-300 text-xs font-bold border border-transparent hover:border-black transition-colors cursor-pointer flex flex-col"
                  >
                    <span className="font-comic text-sm tracking-wide text-stone-950">
                      {p.title}
                    </span>
                    <span className="text-[10px] text-stone-600 font-normal">
                      {p.genre} · {p.panels.length} panels
                    </span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Reading Mode Button */}
          <button
            type="button"
            onClick={() => {
              soundFx.playPageTurn();
              onOpenReadingMode();
            }}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white hover:bg-amber-100 text-stone-900 font-bold text-xs border-2 border-black shadow-[2px_2px_0px_#000] cursor-pointer"
          >
            <BookOpen className="w-3.5 h-3.5 text-red-600" />
            Read Fullscreen
          </button>

          {/* Gallery Drawer */}
          <button
            type="button"
            onClick={() => {
              soundFx.playWhoosh();
              onOpenGallery();
            }}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white hover:bg-amber-100 text-stone-900 font-bold text-xs border-2 border-black shadow-[2px_2px_0px_#000] cursor-pointer"
          >
            <FolderOpen className="w-3.5 h-3.5 text-stone-700" />
            Gallery
          </button>

          {/* Export Dropdown */}
          <div className="relative">
            <button
              type="button"
              onClick={() => {
                soundFx.playPunch();
                setShowExportMenu(!showExportMenu);
                setShowPresetsMenu(false);
              }}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-amber-200 hover:bg-amber-300 text-stone-950 font-bold text-xs border-2 border-black shadow-[2px_2px_0px_#000] cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              Export
            </button>

            {showExportMenu && (
              <div className="absolute right-0 mt-2 w-48 bg-white border-3 border-black shadow-[4px_4px_0px_#000] z-50 p-1 space-y-1 text-xs font-bold">
                <button
                  type="button"
                  onClick={() => {
                    setShowExportMenu(false);
                    onExportPng();
                  }}
                  className="w-full text-left px-3 py-2 hover:bg-amber-200 flex items-center gap-2 cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5" />
                  Download PNG
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowExportMenu(false);
                    onPrint();
                  }}
                  className="w-full text-left px-3 py-2 hover:bg-amber-200 flex items-center gap-2 cursor-pointer"
                >
                  <Printer className="w-3.5 h-3.5" />
                  Print / Save PDF
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowExportMenu(false);
                    onExportJson();
                  }}
                  className="w-full text-left px-3 py-2 hover:bg-amber-200 flex items-center gap-2 cursor-pointer"
                >
                  <FileCode className="w-3.5 h-3.5" />
                  Export Story JSON
                </button>
              </div>
            )}
          </div>

          {/* Sound Toggle */}
          <button
            type="button"
            onClick={toggleSound}
            title={soundEnabled ? 'Mute Comic Sounds' : 'Unmute Comic Sounds'}
            className="p-1.5 bg-white hover:bg-stone-100 border-2 border-black cursor-pointer shadow-[2px_2px_0px_#000]"
          >
            {soundEnabled ? (
              <Volume2 className="w-4 h-4 text-stone-900" />
            ) : (
              <VolumeX className="w-4 h-4 text-stone-400" />
            )}
          </button>
        </div>
      </div>
    </header>
  );
};
