import React, { useState } from 'react';
import { ArtStyle, LayoutMode, StoryGenerationRequest } from '../types/comic';
import { soundFx } from '../utils/soundEffects';
import { Sparkles, Dices, X, Wand2, Plus, Trash2, BookOpen } from 'lucide-react';

interface StoryGeneratorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onGenerate: (request: StoryGenerationRequest) => Promise<void>;
  isGenerating: boolean;
}

const GENRES = [
  'Superhero',
  'Cyberpunk',
  'Sci-Fi',
  'Detective Noir',
  'Fantasy Quest',
  'Manga Battle',
  'Cozy Comedy',
  'Horror Mystery',
];

const TONES = [
  'Action-Packed',
  'Gritty & Suspenseful',
  'Playful & Humorous',
  'Epic & Dramatic',
  'Mysterious',
];

const ART_STYLES: { id: ArtStyle; label: string; desc: string }[] = [
  { id: 'retro-comic', label: 'Retro 1960s Pop Art', desc: 'Ben-Day halftone dots, primary inks, classic Marvel/DC look' },
  { id: 'manga', label: 'Neo-Tokyo Manga', desc: 'Japanese screentones, dynamic speed lines, intense black & white ink' },
  { id: 'dark-noir', label: 'Gritty Noir', desc: 'High-contrast chiaroscuro shadows, sepia rain, vintage detective' },
  { id: 'cyberpunk', label: 'Cyberpunk Neon', desc: 'Electric magenta & cyan glows, dark tech silhouettes' },
  { id: 'vintage-pulp', label: 'Vintage Pulp', desc: 'Weathered newsprint, faded warm pigments, retro adventure' },
];

const LAYOUTS: { id: LayoutMode; label: string; panels: number }[] = [
  { id: 'classic-4', label: '4-Panel Classic Strip', panels: 4 },
  { id: 'grid-6', label: '6-Panel Graphic Novel', panels: 6 },
  { id: 'hero-splash', label: 'Hero Splash Page (3 Panels)', panels: 3 },
  { id: 'cinematic-3', label: 'Cinematic Widescreen (3 Panels)', panels: 3 },
];

export const StoryGeneratorModal: React.FC<StoryGeneratorModalProps> = ({
  isOpen,
  onClose,
  onGenerate,
  isGenerating,
}) => {
  const [prompt, setPrompt] = useState('');
  const [genre, setGenre] = useState('Superhero');
  const [tone, setTone] = useState('Action-Packed');
  const [artStyle, setArtStyle] = useState<ArtStyle>('retro-comic');
  const [layout, setLayout] = useState<LayoutMode>('classic-4');
  const [panelCount, setPanelCount] = useState(4);
  const [showCharacters, setShowCharacters] = useState(false);
  const [characters, setCharacters] = useState<
    { name: string; role: string; description: string }[]
  >([]);
  const [isSuggesting, setIsSuggesting] = useState(false);
  const [loadingStep, setLoadingStep] = useState(0);

  if (!isOpen) return null;

  const handleSelectLayout = (lay: LayoutMode, panels: number) => {
    setLayout(lay);
    setPanelCount(panels);
  };

  const handleAddCharacter = () => {
    soundFx.playPunch();
    setCharacters((prev) => [
      ...prev,
      { name: '', role: prev.length === 0 ? 'protagonist' : 'antagonist', description: '' },
    ]);
  };

  const handleRemoveCharacter = (index: number) => {
    soundFx.playWhoosh();
    setCharacters((prev) => prev.filter((_, i) => i !== index));
  };

  const handleCharacterChange = (index: number, field: string, value: string) => {
    setCharacters((prev) => {
      const next = [...prev];
      next[index] = { ...next[index], [field]: value };
      return next;
    });
  };

  const handleInspireMe = async () => {
    soundFx.playZap();
    setIsSuggesting(true);
    try {
      const res = await fetch('/api/suggest-prompt', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ genre }),
      });
      const data = await res.json();
      if (data.ideas && data.ideas.length > 0) {
        const randomIdea = data.ideas[Math.floor(Math.random() * data.ideas.length)];
        setPrompt(randomIdea);
      }
    } catch {
      setPrompt('A retired superhero must protect their neighborhood bakery from a time-traveling health inspector.');
    } finally {
      setIsSuggesting(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim() || isGenerating) return;

    soundFx.playBoom();

    // Start animated loading steps
    const stepInterval = setInterval(() => {
      setLoadingStep((s) => (s + 1) % 4);
    }, 1800);

    try {
      await onGenerate({
        prompt: prompt.trim(),
        genre,
        tone,
        artStyle,
        panelCount,
        layout,
        characters: characters.filter((c) => c.name.trim().length > 0),
      });
    } finally {
      clearInterval(stepInterval);
    }
  };

  const loadingStepsText = [
    'Gemini is drafting narrative panels & beat breakdowns...',
    'Writing punchy character dialogue & speech balloons...',
    'Illustrating shot angles, lighting, and camera perspectives...',
    'Lettering sound effects & adding Ben-Day screentones...',
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/70 backdrop-blur-xs overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-amber-50 border-4 border-black shadow-[8px_8px_0px_#000] rounded-none my-8 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Top Header Bar */}
        <div className="bg-amber-400 border-b-4 border-black px-5 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <span className="w-8 h-8 bg-black text-amber-300 font-comic text-xl rounded flex items-center justify-center shadow-[2px_2px_0px_#fff]">
              !
            </span>
            <div>
              <h2 className="font-comic text-2xl tracking-wider text-stone-950">
                CREATE NEW COMIC STORY
              </h2>
              <p className="text-xs font-semibold text-stone-800">
                Powered by Google Gemini Generative AI
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            disabled={isGenerating}
            className="w-8 h-8 bg-white hover:bg-stone-100 border-2 border-black flex items-center justify-center cursor-pointer shadow-[2px_2px_0px_#000] active:translate-x-0.5 active:translate-y-0.5"
          >
            <X className="w-5 h-5 text-stone-900" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5 max-h-[80vh] overflow-y-auto">
          {/* Premise & Hook */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="font-comic text-sm tracking-wide text-stone-900 uppercase">
                Story Premise / Idea
              </label>
              <button
                type="button"
                onClick={handleInspireMe}
                disabled={isSuggesting || isGenerating}
                className="inline-flex items-center gap-1.5 text-xs font-bold text-stone-900 bg-amber-200 hover:bg-amber-300 px-2.5 py-1 border-2 border-black shadow-[2px_2px_0px_#000] cursor-pointer"
              >
                <Dices className={`w-3.5 h-3.5 ${isSuggesting ? 'animate-spin' : ''}`} />
                {isSuggesting ? 'Thinking...' : 'Inspire Me!'}
              </button>
            </div>
            <textarea
              rows={3}
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="e.g. A cyberpunk cat burglar gets trapped in a high-security vault with a sentient holographic laser dog..."
              className="w-full p-3 bg-white border-3 border-black text-sm font-sans focus:outline-none focus:ring-2 focus:ring-amber-500 shadow-[3px_3px_0px_#000] placeholder:text-stone-400 font-medium"
              required
            />
          </div>

          {/* Genre Segmented Grid */}
          <div>
            <label className="block font-comic text-sm tracking-wide text-stone-900 uppercase mb-1.5">
              Genre
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {GENRES.map((g) => {
                const active = genre === g;
                return (
                  <button
                    key={g}
                    type="button"
                    onClick={() => {
                      soundFx.playPunch();
                      setGenre(g);
                    }}
                    className={`py-1.5 px-2 text-xs font-bold border-2 border-black transition-all cursor-pointer ${
                      active
                        ? 'bg-amber-400 text-stone-950 shadow-[3px_3px_0px_#000] -translate-x-0.5 -translate-y-0.5'
                        : 'bg-white text-stone-700 hover:bg-amber-100 shadow-[1px_1px_0px_#000]'
                    }`}
                  >
                    {g}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Tone Selector */}
          <div>
            <label className="block font-comic text-sm tracking-wide text-stone-900 uppercase mb-1.5">
              Story Tone
            </label>
            <div className="flex flex-wrap gap-2">
              {TONES.map((t) => {
                const active = tone === t;
                return (
                  <button
                    key={t}
                    type="button"
                    onClick={() => {
                      soundFx.playPunch();
                      setTone(t);
                    }}
                    className={`py-1 px-3 text-xs font-bold border-2 border-black cursor-pointer transition-all ${
                      active
                        ? 'bg-stone-900 text-amber-300 shadow-[3px_3px_0px_#000]'
                        : 'bg-white text-stone-700 hover:bg-stone-100 shadow-[1px_1px_0px_#000]'
                    }`}
                  >
                    {t}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Art Style Selector */}
          <div>
            <label className="block font-comic text-sm tracking-wide text-stone-900 uppercase mb-1.5">
              Comic Art Style
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {ART_STYLES.map((style) => {
                const active = artStyle === style.id;
                return (
                  <button
                    key={style.id}
                    type="button"
                    onClick={() => {
                      soundFx.playPunch();
                      setArtStyle(style.id);
                    }}
                    className={`text-left p-2.5 border-2 border-black transition-all cursor-pointer ${
                      active
                        ? 'bg-amber-300 border-black shadow-[3px_3px_0px_#000] -translate-x-0.5 -translate-y-0.5'
                        : 'bg-white text-stone-800 hover:bg-amber-50 shadow-[1px_1px_0px_#000]'
                    }`}
                  >
                    <div className="font-comic text-sm tracking-wide text-stone-950">
                      {style.label}
                    </div>
                    <div className="text-[11px] text-stone-600 font-medium">
                      {style.desc}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Layout & Panel Count */}
          <div>
            <label className="block font-comic text-sm tracking-wide text-stone-900 uppercase mb-1.5">
              Page Layout & Panels
            </label>
            <div className="grid grid-cols-2 gap-2">
              {LAYOUTS.map((lay) => {
                const active = layout === lay.id;
                return (
                  <button
                    key={lay.id}
                    type="button"
                    onClick={() => {
                      soundFx.playPunch();
                      handleSelectLayout(lay.id, lay.panels);
                    }}
                    className={`text-left p-2.5 border-2 border-black cursor-pointer transition-all ${
                      active
                        ? 'bg-amber-400 text-stone-950 shadow-[3px_3px_0px_#000] -translate-x-0.5 -translate-y-0.5'
                        : 'bg-white text-stone-800 hover:bg-stone-50 shadow-[1px_1px_0px_#000]'
                    }`}
                  >
                    <div className="font-bold text-xs">{lay.label}</div>
                    <div className="text-[10px] text-stone-600">{lay.panels} Panels Story Arc</div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Optional Characters Drawer */}
          <div className="border-2 border-black p-3 bg-white shadow-[2px_2px_0px_#000]">
            <div className="flex items-center justify-between">
              <span className="font-comic text-xs tracking-wide text-stone-900 uppercase">
                Custom Characters (Optional)
              </span>
              <button
                type="button"
                onClick={() => setShowCharacters(!showCharacters)}
                className="text-xs font-bold text-stone-700 hover:text-black underline cursor-pointer"
              >
                {showCharacters ? 'Hide Cast' : `Customize Cast (${characters.length})`}
              </button>
            </div>

            {showCharacters && (
              <div className="mt-3 space-y-2.5">
                {characters.map((char, idx) => (
                  <div key={idx} className="flex gap-2 items-start bg-amber-50 p-2 border border-black">
                    <input
                      type="text"
                      placeholder="Name (e.g. Jax)"
                      value={char.name}
                      onChange={(e) => handleCharacterChange(idx, 'name', e.target.value)}
                      className="w-1/3 p-1.5 text-xs bg-white border border-black font-semibold"
                    />
                    <select
                      value={char.role}
                      onChange={(e) => handleCharacterChange(idx, 'role', e.target.value)}
                      className="p-1.5 text-xs bg-white border border-black font-semibold"
                    >
                      <option value="protagonist">Protagonist</option>
                      <option value="antagonist">Antagonist</option>
                      <option value="sidekick">Sidekick</option>
                      <option value="mentor">Mentor</option>
                    </select>
                    <input
                      type="text"
                      placeholder="Appearance traits (e.g. robot arm, trench coat)"
                      value={char.description}
                      onChange={(e) => handleCharacterChange(idx, 'description', e.target.value)}
                      className="flex-1 p-1.5 text-xs bg-white border border-black"
                    />
                    <button
                      type="button"
                      onClick={() => handleRemoveCharacter(idx)}
                      className="p-1.5 text-red-600 hover:text-red-800 cursor-pointer"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}

                <button
                  type="button"
                  onClick={handleAddCharacter}
                  className="inline-flex items-center gap-1 text-xs font-bold text-stone-900 bg-stone-200 hover:bg-stone-300 px-2.5 py-1 border border-black cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  Add Character
                </button>
              </div>
            )}
          </div>

          {/* Loading indicator during generation */}
          {isGenerating && (
            <div className="p-4 bg-amber-200 border-3 border-black shadow-[4px_4px_0px_#000] flex flex-col items-center justify-center gap-2">
              <div className="flex items-center gap-2">
                <Wand2 className="w-6 h-6 text-stone-950 animate-bounce" />
                <span className="font-comic text-base tracking-wider text-stone-950">
                  CREATING YOUR COMIC BOOK WITH GEMINI...
                </span>
              </div>
              <p className="text-xs font-bold text-stone-800 text-center animate-pulse">
                {loadingStepsText[loadingStep]}
              </p>
            </div>
          )}

          {/* Submit Action */}
          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              disabled={isGenerating}
              className="px-4 py-2 text-xs font-bold text-stone-700 hover:text-black border-2 border-black bg-white shadow-[2px_2px_0px_#000] cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isGenerating || !prompt.trim()}
              className="inline-flex items-center gap-2 px-6 py-2.5 bg-red-600 hover:bg-red-500 disabled:bg-stone-400 text-white font-comic text-lg tracking-wider border-3 border-black shadow-[4px_4px_0px_#000] hover:-translate-x-0.5 hover:-translate-y-0.5 active:translate-x-0.5 active:translate-y-0.5 transition-all cursor-pointer"
            >
              <Sparkles className="w-5 h-5 text-amber-300" />
              {isGenerating ? 'GENERATING COMIC...' : 'GENERATE COMIC WITH GEMINI'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
