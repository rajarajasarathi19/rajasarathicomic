import React, { useState } from 'react';
import { ComicPanel, DialogueItem, SoundEffectItem, BubbleType, BubblePosition } from '../types/comic';
import { soundFx } from '../utils/soundEffects';
import { X, Plus, Trash2, Sparkles, Volume2, Upload, Wand2, ArrowRight } from 'lucide-react';

interface PanelEditorModalProps {
  panel: ComicPanel | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (updatedPanel: ComicPanel) => void;
  onRegenerateImage?: (panel: ComicPanel) => void;
}

const BUBBLE_TYPES: { id: BubbleType; label: string }[] = [
  { id: 'speech', label: 'Speech' },
  { id: 'thought', label: 'Thought' },
  { id: 'shout', label: 'Shout' },
  { id: 'whisper', label: 'Whisper' },
];

const POSITIONS: { id: BubblePosition; label: string }[] = [
  { id: 'top-left', label: 'Top Left' },
  { id: 'top-right', label: 'Top Right' },
  { id: 'bottom-left', label: 'Bottom Left' },
  { id: 'bottom-right', label: 'Bottom Right' },
  { id: 'top-center', label: 'Top Center' },
  { id: 'center', label: 'Center' },
];

const SFX_STYLES: { id: SoundEffectItem['style']; label: string }[] = [
  { id: 'punchy', label: 'Punchy (Gold)' },
  { id: 'fiery', label: 'Fiery (Red/Orange)' },
  { id: 'electric', label: 'Electric (Cyan/Blue)' },
  { id: 'cosmic', label: 'Cosmic (Purple)' },
  { id: 'stealth', label: 'Stealth (Dark)' },
];

const POPULAR_SFX = ['POW!', 'BAM!', 'ZAP!', 'WHOOSH!', 'CRASH!', 'BOOM!', 'THWIP!', 'SNAP!'];

export const PanelEditorModal: React.FC<PanelEditorModalProps> = ({
  panel,
  isOpen,
  onClose,
  onSave,
  onRegenerateImage,
}) => {
  if (!isOpen || !panel) return null;

  const [caption, setCaption] = useState(panel.caption || '');
  const [visualDescription, setVisualDescription] = useState(panel.visualDescription);
  const [cameraAngle, setCameraAngle] = useState(panel.cameraAngle);
  const [dialogue, setDialogue] = useState<DialogueItem[]>([...panel.dialogue]);
  const [soundEffects, setSoundEffects] = useState<SoundEffectItem[]>([...panel.soundEffects]);
  const [imageUrl, setImageUrl] = useState(panel.imageUrl || '');
  const [rewritingIndex, setRewritingIndex] = useState<number | null>(null);
  const [aiSuggestions, setAiSuggestions] = useState<{ index: number; options: string[] } | null>(null);

  const handleAddDialogue = () => {
    soundFx.playPunch();
    const newItem: DialogueItem = {
      id: 'd-' + Date.now(),
      speaker: 'Hero',
      text: 'New dialogue line...',
      type: 'speech',
      position: dialogue.length % 2 === 0 ? 'top-left' : 'bottom-right',
    };
    setDialogue((prev) => [...prev, newItem]);
  };

  const handleRemoveDialogue = (index: number) => {
    soundFx.playWhoosh();
    setDialogue((prev) => prev.filter((_, i) => i !== index));
  };

  const handleDialogueChange = (index: number, field: keyof DialogueItem, value: unknown) => {
    setDialogue((prev) => {
      const copy = [...prev];
      copy[index] = { ...copy[index], [field]: value };
      return copy;
    });
  };

  const handleAddSoundEffect = (presetText?: string) => {
    soundFx.playZap();
    const newFx: SoundEffectItem = {
      id: 'sfx-' + Date.now(),
      text: presetText || 'BAM!',
      style: 'punchy',
      x: 50,
      y: 50,
      rotation: Math.floor(Math.random() * 20) - 10,
    };
    setSoundEffects((prev) => [...prev, newFx]);
  };

  const handleRemoveSoundEffect = (index: number) => {
    soundFx.playWhoosh();
    setSoundEffects((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSoundEffectChange = (index: number, field: keyof SoundEffectItem, value: unknown) => {
    setSoundEffects((prev) => {
      const copy = [...prev];
      copy[index] = { ...copy[index], [field]: value };
      return copy;
    });
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === 'string') {
          setImageUrl(reader.result);
          soundFx.playTada();
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRewriteWithGemini = async (index: number) => {
    const text = dialogue[index]?.text;
    if (!text) return;
    setRewritingIndex(index);
    soundFx.playZap();
    try {
      const res = await fetch('/api/rewrite-dialogue', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text, style: 'punchy' }),
      });
      const data = await res.json();
      if (data.suggestions && data.suggestions.length > 0) {
        setAiSuggestions({ index, options: data.suggestions });
      }
    } catch {
      // fallback
      setAiSuggestions({
        index,
        options: [text.toUpperCase() + '!', `Not today! ${text}`, `Listen up: ${text}`],
      });
    } finally {
      setRewritingIndex(null);
    }
  };

  const handleApplySuggestion = (index: number, option: string) => {
    handleDialogueChange(index, 'text', option);
    setAiSuggestions(null);
    soundFx.playPunch();
  };

  const handleSave = () => {
    soundFx.playPunch();
    const updated: ComicPanel = {
      ...panel,
      caption: caption.trim() ? caption.trim() : undefined,
      visualDescription,
      cameraAngle,
      dialogue,
      soundEffects,
      imageUrl: imageUrl || undefined,
    };
    onSave(updated);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/75 backdrop-blur-xs overflow-y-auto">
      <div className="relative w-full max-w-3xl bg-amber-50 border-4 border-black shadow-[8px_8px_0px_#000] my-8 overflow-hidden animate-in fade-in duration-150">
        {/* Header */}
        <div className="bg-amber-400 border-b-4 border-black px-5 py-3.5 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="font-comic text-2xl text-stone-950">
              EDIT PANEL #{panel.panelNumber}
            </span>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 bg-white hover:bg-stone-100 border-2 border-black flex items-center justify-center cursor-pointer shadow-[2px_2px_0px_#000]"
          >
            <X className="w-5 h-5 text-stone-900" />
          </button>
        </div>

        {/* Content Tabs / Body */}
        <div className="p-6 space-y-5 max-h-[75vh] overflow-y-auto">
          {/* Narrator Caption */}
          <div>
            <label className="block font-comic text-sm tracking-wide text-stone-900 uppercase mb-1">
              Narrator Caption Box (Optional)
            </label>
            <input
              type="text"
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              placeholder="e.g. MEANWHILE, AT THE CLOCK TOWER..."
              className="w-full p-2.5 bg-white border-2 border-black text-sm font-semibold uppercase focus:outline-none focus:ring-2 focus:ring-amber-500 shadow-[2px_2px_0px_#000]"
            />
          </div>

          {/* Visual Scene & Camera Angle */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="sm:col-span-2">
              <label className="block font-comic text-sm tracking-wide text-stone-900 uppercase mb-1">
                Visual Description
              </label>
              <textarea
                rows={2}
                value={visualDescription}
                onChange={(e) => setVisualDescription(e.target.value)}
                className="w-full p-2 bg-white border-2 border-black text-xs font-medium focus:outline-none shadow-[2px_2px_0px_#000]"
              />
            </div>
            <div>
              <label className="block font-comic text-sm tracking-wide text-stone-900 uppercase mb-1">
                Camera Angle
              </label>
              <input
                type="text"
                value={cameraAngle}
                onChange={(e) => setCameraAngle(e.target.value)}
                className="w-full p-2 bg-white border-2 border-black text-xs font-semibold focus:outline-none shadow-[2px_2px_0px_#000]"
              />
            </div>
          </div>

          {/* Image & Illustration Options */}
          <div className="border-2 border-black p-3.5 bg-white shadow-[2px_2px_0px_#000]">
            <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
              <span className="font-comic text-sm tracking-wide text-stone-900 uppercase">
                Panel Artwork
              </span>
              <div className="flex items-center gap-2">
                <label className="inline-flex items-center gap-1 text-xs font-bold text-stone-800 bg-stone-100 hover:bg-stone-200 px-2.5 py-1 border border-black cursor-pointer shadow-xs">
                  <Upload className="w-3.5 h-3.5" />
                  Upload Custom Image
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                </label>

                {onRegenerateImage && (
                  <button
                    type="button"
                    onClick={() => onRegenerateImage(panel)}
                    className="inline-flex items-center gap-1 text-xs font-bold text-stone-900 bg-sky-300 hover:bg-sky-200 px-2.5 py-1 border border-black cursor-pointer shadow-xs"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    Generate with Gemini
                  </button>
                )}

                {imageUrl && (
                  <button
                    type="button"
                    onClick={() => setImageUrl('')}
                    className="text-xs font-bold text-red-600 hover:underline cursor-pointer"
                  >
                    Reset to Procedural Comic Art
                  </button>
                )}
              </div>
            </div>

            {imageUrl && (
              <div className="mt-2 w-32 h-24 border-2 border-black overflow-hidden relative">
                <img src={imageUrl} alt="Panel" className="w-full h-full object-cover" />
                <span className="absolute bottom-0 right-0 bg-black text-white text-[9px] px-1 font-bold">
                  CUSTOM
                </span>
              </div>
            )}
          </div>

          {/* Dialogue Balloons Editor */}
          <div className="border-2 border-black p-4 bg-white shadow-[3px_3px_0px_#000]">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-comic text-base tracking-wide text-stone-950 uppercase">
                Dialogue Balloons ({dialogue.length})
              </h3>
              <button
                type="button"
                onClick={handleAddDialogue}
                className="inline-flex items-center gap-1 text-xs font-bold bg-amber-400 hover:bg-amber-300 text-stone-950 px-2.5 py-1 border-2 border-black shadow-[2px_2px_0px_#000] cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                Add Balloon
              </button>
            </div>

            <div className="space-y-3">
              {dialogue.map((item, index) => (
                <div key={item.id} className="p-3 bg-amber-50 border-2 border-black space-y-2">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        placeholder="Speaker name"
                        value={item.speaker}
                        onChange={(e) => handleDialogueChange(index, 'speaker', e.target.value)}
                        className="p-1 text-xs font-bold bg-white border border-black w-28"
                      />
                      <select
                        value={item.type}
                        onChange={(e) =>
                          handleDialogueChange(index, 'type', e.target.value as BubbleType)
                        }
                        className="p-1 text-xs bg-white border border-black font-semibold"
                      >
                        {BUBBLE_TYPES.map((bt) => (
                          <option key={bt.id} value={bt.id}>
                            {bt.label}
                          </option>
                        ))}
                      </select>
                      <select
                        value={item.position}
                        onChange={(e) =>
                          handleDialogueChange(index, 'position', e.target.value as BubblePosition)
                        }
                        className="p-1 text-xs bg-white border border-black font-semibold"
                      >
                        {POSITIONS.map((pos) => (
                          <option key={pos.id} value={pos.id}>
                            {pos.label}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => handleRewriteWithGemini(index)}
                        disabled={rewritingIndex === index}
                        title="AI Punch-up with Gemini"
                        className="inline-flex items-center gap-1 text-[11px] font-bold text-stone-900 bg-amber-200 hover:bg-amber-300 px-2 py-0.5 border border-black cursor-pointer"
                      >
                        <Wand2 className={`w-3 h-3 ${rewritingIndex === index ? 'animate-spin' : ''}`} />
                        Punch-Up
                      </button>
                      <button
                        type="button"
                        onClick={() => handleRemoveDialogue(index)}
                        className="text-red-600 hover:text-red-800 p-1 cursor-pointer"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  <textarea
                    rows={2}
                    value={item.text}
                    onChange={(e) => handleDialogueChange(index, 'text', e.target.value)}
                    className="w-full p-2 text-xs bg-white border border-black font-speech font-bold focus:outline-none"
                  />

                  {/* AI Suggestions Dropdown */}
                  {aiSuggestions && aiSuggestions.index === index && (
                    <div className="p-2 bg-amber-100 border border-black space-y-1">
                      <div className="text-[10px] font-bold uppercase text-stone-700">
                        Gemini Suggestions (Click to apply):
                      </div>
                      {aiSuggestions.options.map((opt, optIdx) => (
                        <button
                          key={optIdx}
                          type="button"
                          onClick={() => handleApplySuggestion(index, opt)}
                          className="w-full text-left text-xs bg-white hover:bg-amber-300 p-1.5 border border-black flex items-center justify-between font-bold cursor-pointer"
                        >
                          <span>{opt}</span>
                          <ArrowRight className="w-3.5 h-3.5 shrink-0" />
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Sound Effects Editor */}
          <div className="border-2 border-black p-4 bg-white shadow-[3px_3px_0px_#000]">
            <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
              <h3 className="font-comic text-base tracking-wide text-stone-950 uppercase">
                Sound Effects / Onomatopoeia ({soundEffects.length})
              </h3>
              <div className="flex flex-wrap gap-1">
                {POPULAR_SFX.slice(0, 5).map((sfx) => (
                  <button
                    key={sfx}
                    type="button"
                    onClick={() => handleAddSoundEffect(sfx)}
                    className="font-comic text-xs px-2 py-0.5 bg-yellow-300 hover:bg-yellow-200 border border-black shadow-xs cursor-pointer"
                  >
                    +{sfx}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              {soundEffects.map((fx, index) => (
                <div key={fx.id} className="p-2 bg-stone-50 border border-black flex flex-wrap items-center gap-3">
                  <input
                    type="text"
                    value={fx.text}
                    onChange={(e) => handleSoundEffectChange(index, 'text', e.target.value.toUpperCase())}
                    className="p-1 font-comic text-sm uppercase bg-white border border-black w-24"
                  />
                  <select
                    value={fx.style}
                    onChange={(e) =>
                      handleSoundEffectChange(index, 'style', e.target.value as SoundEffectItem['style'])
                    }
                    className="p-1 text-xs bg-white border border-black font-semibold"
                  >
                    {SFX_STYLES.map((st) => (
                      <option key={st.id} value={st.id}>
                        {st.label}
                      </option>
                    ))}
                  </select>

                  <div className="flex items-center gap-1 text-xs">
                    <span className="font-bold text-[10px]">X:</span>
                    <input
                      type="range"
                      min="10"
                      max="90"
                      value={fx.x}
                      onChange={(e) => handleSoundEffectChange(index, 'x', Number(e.target.value))}
                      className="w-16 accent-amber-500"
                    />
                    <span className="text-[10px] w-6">{fx.x}%</span>
                  </div>

                  <div className="flex items-center gap-1 text-xs">
                    <span className="font-bold text-[10px]">Y:</span>
                    <input
                      type="range"
                      min="10"
                      max="90"
                      value={fx.y}
                      onChange={(e) => handleSoundEffectChange(index, 'y', Number(e.target.value))}
                      className="w-16 accent-amber-500"
                    />
                    <span className="text-[10px] w-6">{fx.y}%</span>
                  </div>

                  <button
                    type="button"
                    onClick={() => soundFx.playByEffect(fx.text)}
                    title="Test Sound"
                    className="p-1 bg-stone-200 hover:bg-stone-300 border border-black cursor-pointer"
                  >
                    <Volume2 className="w-3.5 h-3.5" />
                  </button>

                  <button
                    type="button"
                    onClick={() => handleRemoveSoundEffect(index)}
                    className="text-red-600 hover:text-red-800 p-1 cursor-pointer ml-auto"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-amber-100 border-t-4 border-black px-6 py-3.5 flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 text-xs font-bold text-stone-700 hover:text-black border-2 border-black bg-white shadow-[2px_2px_0px_#000] cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSave}
            className="px-6 py-2 bg-amber-400 hover:bg-amber-300 text-stone-950 font-comic text-base tracking-wider border-3 border-black shadow-[3px_3px_0px_#000] active:translate-x-0.5 active:translate-y-0.5 cursor-pointer"
          >
            SAVE PANEL
          </button>
        </div>
      </div>
    </div>
  );
};
