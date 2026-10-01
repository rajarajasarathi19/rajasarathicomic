import React from 'react';
import { ComicStory, ComicPanel, ArtStyle, LayoutMode } from '../types/comic';
import { PanelCard } from './PanelCard';
import { soundFx } from '../utils/soundEffects';
import { Plus, Wand2, Sparkles, BookOpen, Layers, Palette, Users } from 'lucide-react';

interface ComicViewerProps {
  comic: ComicStory;
  onUpdateComic: (updated: ComicStory) => void;
  onEditPanel: (panel: ComicPanel) => void;
  onRegenerateImage: (panel: ComicPanel) => void;
  onAddNextPanel: () => void;
  onPlaySpeech?: (text: string, speaker: string) => void;
  isGeneratingImageId?: string | null;
  isAddingPanel?: boolean;
}

const ART_STYLES: { id: ArtStyle; label: string }[] = [
  { id: 'retro-comic', label: 'Retro 1960s' },
  { id: 'manga', label: 'Manga B&W' },
  { id: 'dark-noir', label: 'Dark Noir' },
  { id: 'cyberpunk', label: 'Cyberpunk' },
  { id: 'vintage-pulp', label: 'Vintage Pulp' },
];

const LAYOUTS: { id: LayoutMode; label: string }[] = [
  { id: 'classic-4', label: '4-Panel Strip' },
  { id: 'grid-6', label: '6-Panel Grid' },
  { id: 'hero-splash', label: 'Hero Splash' },
  { id: 'cinematic-3', label: 'Cinematic Widescreen' },
  { id: 'webtoon-vertical', label: 'Webtoon Vertical' },
];

export const ComicViewer: React.FC<ComicViewerProps> = ({
  comic,
  onUpdateComic,
  onEditPanel,
  onRegenerateImage,
  onAddNextPanel,
  onPlaySpeech,
  isGeneratingImageId,
  isAddingPanel = false,
}) => {
  const handleStyleChange = (style: ArtStyle) => {
    soundFx.playZap();
    onUpdateComic({ ...comic, artStyle: style });
  };

  const handleLayoutChange = (layout: LayoutMode) => {
    soundFx.playWhoosh();
    onUpdateComic({ ...comic, layout });
  };

  // Determine grid classes based on layout
  const getLayoutClasses = () => {
    switch (comic.layout) {
      case 'grid-6':
        return 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6';
      case 'hero-splash':
        return 'grid grid-cols-1 md:grid-cols-2 gap-6';
      case 'cinematic-3':
        return 'grid grid-cols-1 gap-6';
      case 'webtoon-vertical':
        return 'flex flex-col gap-8 max-w-2xl mx-auto';
      case 'classic-4':
      default:
        return 'grid grid-cols-1 md:grid-cols-2 gap-6';
    }
  };

  return (
    <div className="w-full max-w-6xl mx-auto space-y-6">
      {/* Studio Top Control Strip */}
      <div className="no-print bg-white border-3 border-black p-3.5 shadow-[4px_4px_0px_#000] flex flex-wrap items-center justify-between gap-3">
        {/* Art Style switcher */}
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1 font-comic text-xs uppercase tracking-wider text-stone-900">
            <Palette className="w-3.5 h-3.5 text-amber-500" />
            Style:
          </span>
          <div className="flex flex-wrap gap-1">
            {ART_STYLES.map((style) => (
              <button
                key={style.id}
                type="button"
                onClick={() => handleStyleChange(style.id)}
                className={`px-2.5 py-1 text-xs font-bold border-2 border-black transition-all cursor-pointer ${
                  comic.artStyle === style.id
                    ? 'bg-amber-400 text-stone-950 shadow-[2px_2px_0px_#000] -translate-y-0.5'
                    : 'bg-stone-50 text-stone-700 hover:bg-amber-100'
                }`}
              >
                {style.label}
              </button>
            ))}
          </div>
        </div>

        {/* Layout switcher */}
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1 font-comic text-xs uppercase tracking-wider text-stone-900">
            <Layers className="w-3.5 h-3.5 text-amber-500" />
            Layout:
          </span>
          <div className="flex flex-wrap gap-1">
            {LAYOUTS.map((lay) => (
              <button
                key={lay.id}
                type="button"
                onClick={() => handleLayoutChange(lay.id)}
                className={`px-2.5 py-1 text-xs font-bold border-2 border-black transition-all cursor-pointer ${
                  comic.layout === lay.id
                    ? 'bg-stone-900 text-amber-300 shadow-[2px_2px_0px_#000] -translate-y-0.5'
                    : 'bg-stone-50 text-stone-700 hover:bg-stone-100'
                }`}
              >
                {lay.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Comic Page Canvas Sheet (Printable / Exportable) */}
      <div
        id="comic-printable-page"
        className="print-page relative bg-[#fffdf8] border-4 border-black shadow-[10px_10px_0px_#000] p-6 sm:p-10 space-y-6"
      >
        {/* Authentic Vintage Comic Header Masthead */}
        <div className="border-b-4 border-black pb-5">
          <div className="flex flex-wrap items-center justify-between border-b-2 border-black pb-2 mb-3 text-xs font-bold uppercase tracking-wider text-stone-800">
            <div className="flex items-center gap-2">
              <span className="bg-red-600 text-white px-2 py-0.5 border border-black font-comic text-sm">
                COMICCRAFT
              </span>
              <span>GEMINI COMICS GROUP</span>
              <span>·</span>
              <span className="text-stone-500">{comic.genre}</span>
            </div>

            <div className="flex items-center gap-3">
              <span className="border-2 border-black px-2 py-0.5 bg-amber-200 text-stone-950 font-comic text-sm">
                APPROVED BY THE COMIC CRAFT CODE
              </span>
              <span className="font-comic text-sm text-stone-900">{comic.issueNumber}</span>
              <span className="font-bold">25¢</span>
            </div>
          </div>

          {/* Main Title Banner */}
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2">
            <div>
              <h1
                style={{ color: comic.coverColor || '#dc2626' }}
                className="font-comic text-4xl sm:text-6xl tracking-wider uppercase leading-none drop-shadow-[3px_3px_0px_#000]"
              >
                {comic.title}
              </h1>
              <p className="font-speech text-sm sm:text-base font-bold text-stone-800 italic mt-1">
                "{comic.tagline}"
              </p>
            </div>

            <div className="text-right text-xs font-bold text-stone-500 shrink-0">
              <div>SCRIPT & ART: {comic.author}</div>
              <div className="text-[10px] text-stone-400">
                PRODUCED WITH GOOGLE GEMINI 3.8 FLASH
              </div>
            </div>
          </div>
        </div>

        {/* Character Cast Legend (Quiet text chips) */}
        {comic.characters && comic.characters.length > 0 && (
          <div className="flex flex-wrap items-center gap-3 py-2 px-3 bg-amber-100/60 border-2 border-black/80 text-xs">
            <span className="inline-flex items-center gap-1 font-comic uppercase text-stone-900 tracking-wider">
              <Users className="w-3.5 h-3.5 text-stone-700" />
              Cast:
            </span>
            {comic.characters.map((char) => (
              <span key={char.id} className="font-semibold text-stone-800">
                <strong style={{ color: char.colorTheme }}>{char.name}</strong> ({char.role})
              </span>
            ))}
          </div>
        )}

        {/* Panels Grid */}
        <div className={getLayoutClasses()}>
          {comic.panels.map((panel, idx) => {
            // If hero-splash and first panel, span 2 cols on medium screens
            const isHeroSplashFirst = comic.layout === 'hero-splash' && idx === 0;
            return (
              <div
                key={panel.id}
                className={isHeroSplashFirst ? 'md:col-span-2' : ''}
              >
                <PanelCard
                  panel={panel}
                  artStyle={comic.artStyle}
                  onEdit={onEditPanel}
                  onRegenerateImage={onRegenerateImage}
                  onPlaySpeech={onPlaySpeech}
                  isGeneratingImage={isGeneratingImageId === panel.id}
                />
              </div>
            );
          })}
        </div>

        {/* Add Next Panel Button (Studio Mode) */}
        <div className="no-print pt-4 flex flex-col sm:flex-row items-center justify-between gap-3 border-t-2 border-dashed border-stone-300">
          <p className="text-xs text-stone-600 font-semibold italic">
            Tip: Hover over any panel to edit dialogue or generate custom art with Gemini.
          </p>

          <button
            type="button"
            onClick={() => {
              soundFx.playZap();
              onAddNextPanel();
            }}
            disabled={isAddingPanel}
            className="inline-flex items-center gap-2 px-4 py-2 bg-amber-400 hover:bg-amber-300 text-stone-950 font-comic text-sm tracking-wide border-2 border-black shadow-[3px_3px_0px_#000] cursor-pointer active:translate-x-0.5 active:translate-y-0.5"
          >
            <Plus className="w-4 h-4" />
            <Sparkles className="w-3.5 h-3.5 text-stone-900" />
            {isAddingPanel ? 'CREATING NEXT PANEL...' : 'CONTINUE STORY (ADD PANEL WITH GEMINI)'}
          </button>
        </div>

        {/* Comic Footer Bar */}
        <div className="border-t-2 border-black pt-3 flex items-center justify-between text-[10px] font-bold text-stone-500 uppercase tracking-widest">
          <span>COMICCRAFT AI STORY CREATOR · ISSUE {comic.issueNumber}</span>
          <span>PAGE 1 OF 1</span>
        </div>
      </div>
    </div>
  );
};
