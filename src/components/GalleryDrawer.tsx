import React from 'react';
import { ComicStory } from '../types/comic';
import { soundFx } from '../utils/soundEffects';
import { X, Trash2, BookOpen, Clock, FileUp, Sparkles } from 'lucide-react';

interface GalleryDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  savedComics: ComicStory[];
  currentComicId: string;
  onSelectComic: (comic: ComicStory) => void;
  onDeleteComic: (comicId: string) => void;
  onImportJson: (comic: ComicStory) => void;
}

export const GalleryDrawer: React.FC<GalleryDrawerProps> = ({
  isOpen,
  onClose,
  savedComics,
  currentComicId,
  onSelectComic,
  onDeleteComic,
  onImportJson,
}) => {
  if (!isOpen) return null;

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        try {
          const parsed = JSON.parse(event.target?.result as string);
          if (parsed && parsed.title && parsed.panels) {
            onImportJson(parsed);
            soundFx.playTada();
          }
        } catch {
          alert('Invalid comic story JSON file.');
        }
      };
      reader.readAsText(file);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-stone-950/60 backdrop-blur-xs">
      <div className="relative w-full max-w-md bg-amber-50 h-full border-l-4 border-black shadow-[-8px_0px_0px_#000] flex flex-col animate-in slide-in-from-right duration-200">
        {/* Header */}
        <div className="bg-amber-400 border-b-4 border-black px-5 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="font-comic text-2xl tracking-wide text-stone-950">
              MY COMIC VAULT ({savedComics.length})
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

        {/* Content list */}
        <div className="flex-1 p-4 overflow-y-auto space-y-3">
          {/* Import JSON helper */}
          <div className="border-2 border-dashed border-stone-400 p-3 bg-white flex items-center justify-between">
            <span className="text-xs font-bold text-stone-700">
              Import a saved JSON comic
            </span>
            <label className="inline-flex items-center gap-1 text-xs font-bold bg-amber-200 hover:bg-amber-300 px-2.5 py-1 border border-black cursor-pointer shadow-xs">
              <FileUp className="w-3.5 h-3.5" />
              Upload JSON
              <input
                type="file"
                accept=".json"
                onChange={handleFileUpload}
                className="hidden"
              />
            </label>
          </div>

          {savedComics.length === 0 ? (
            <div className="text-center py-12 text-stone-500 font-semibold text-sm">
              No saved comics yet. Create one with Gemini or load a preset!
            </div>
          ) : (
            savedComics.map((comic) => {
              const isSelected = comic.id === currentComicId;
              return (
                <div
                  key={comic.id}
                  className={`p-3.5 border-3 border-black transition-all cursor-pointer bg-white ${
                    isSelected
                      ? 'bg-amber-100 shadow-[4px_4px_0px_#000] -translate-x-0.5'
                      : 'hover:bg-amber-50 shadow-[2px_2px_0px_#000]'
                  }`}
                  onClick={() => {
                    soundFx.playPunch();
                    onSelectComic(comic);
                    onClose();
                  }}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-comic text-base tracking-wide text-stone-950">
                          {comic.title}
                        </span>
                        <span className="text-[10px] font-bold bg-black text-amber-300 px-1 py-0.2">
                          {comic.issueNumber}
                        </span>
                      </div>
                      <p className="text-xs text-stone-600 line-clamp-1 italic font-speech">
                        "{comic.tagline}"
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        soundFx.playWhoosh();
                        onDeleteComic(comic.id);
                      }}
                      className="text-stone-400 hover:text-red-600 p-1 cursor-pointer"
                      title="Delete Comic"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="flex items-center justify-between text-[11px] text-stone-500 font-semibold mt-2.5 pt-2 border-t border-stone-200">
                    <span>
                      {comic.genre} · {comic.panels.length} panels
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {new Date(comic.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};
