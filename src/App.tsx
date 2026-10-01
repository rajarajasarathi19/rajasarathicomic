/**
 * ComicCraft - AI Comic Story Creator using Gemini Models
 * Full-featured comic studio with story scripting, dynamic layouts,
 * character cast, onomatopoeia sound effects, reading mode, and instant export.
 */

import React, { useState, useEffect } from 'react';
import { ComicStory, ComicPanel, StoryGenerationRequest } from './types/comic';
import { PRESET_COMICS } from './data/presets';
import { Navbar } from './components/Navbar';
import { ComicViewer } from './components/ComicViewer';
import { StoryGeneratorModal } from './components/StoryGeneratorModal';
import { PanelEditorModal } from './components/PanelEditorModal';
import { ReadingModeModal } from './components/ReadingModeModal';
import { GalleryDrawer } from './components/GalleryDrawer';
import { downloadComicPageAsPng, printComic, exportComicJson } from './utils/exportComic';
import { soundFx } from './utils/soundEffects';
import confetti from 'canvas-confetti';
import { AlertCircle, CheckCircle2 } from 'lucide-react';

const STORAGE_KEY = 'comiccraft_saved_comics';
const CURRENT_COMIC_KEY = 'comiccraft_current_comic';

export default function App() {
  const [currentComic, setCurrentComic] = useState<ComicStory>(PRESET_COMICS[0]);
  const [savedComics, setSavedComics] = useState<ComicStory[]>(PRESET_COMICS);

  // Modals & Drawers
  const [isGeneratorOpen, setIsGeneratorOpen] = useState(false);
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [selectedPanel, setSelectedPanel] = useState<ComicPanel | null>(null);
  const [isReadingModeOpen, setIsReadingModeOpen] = useState(false);
  const [isGalleryOpen, setIsGalleryOpen] = useState(false);

  // Loading states
  const [isGeneratingStory, setIsGeneratingStory] = useState(false);
  const [isGeneratingImageId, setIsGeneratingImageId] = useState<string | null>(null);
  const [isAddingPanel, setIsAddingPanel] = useState(false);

  // Banner message
  const [toastMessage, setToastMessage] = useState<{ text: string; type: 'success' | 'info' | 'error' } | null>(null);

  const showToast = (text: string, type: 'success' | 'info' | 'error' = 'info') => {
    setToastMessage({ text, type });
    setTimeout(() => setToastMessage(null), 4500);
  };

  // Load initial comic and saved library from localStorage
  useEffect(() => {
    try {
      const storedList = localStorage.getItem(STORAGE_KEY);
      if (storedList) {
        const parsed = JSON.parse(storedList);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setSavedComics(parsed);
        }
      }

      const storedCurrent = localStorage.getItem(CURRENT_COMIC_KEY);
      if (storedCurrent) {
        const parsedCurrent = JSON.parse(storedCurrent);
        if (parsedCurrent && parsedCurrent.title && parsedCurrent.panels) {
          setCurrentComic(parsedCurrent);
        }
      }
    } catch (e) {
      console.error('Failed to load from localStorage:', e);
    }
  }, []);

  // Save changes to current comic into localStorage
  const handleUpdateComic = (updated: ComicStory) => {
    setCurrentComic(updated);
    try {
      localStorage.setItem(CURRENT_COMIC_KEY, JSON.stringify(updated));
      setSavedComics((prev) => {
        const existingIdx = prev.findIndex((c) => c.id === updated.id);
        const next = [...prev];
        if (existingIdx >= 0) {
          next[existingIdx] = updated;
        } else {
          next.unshift(updated);
        }
        localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
        return next;
      });
    } catch (e) {
      console.error('Failed to save comic to storage:', e);
    }
  };

  // Generate new comic story with Gemini 3.8 Flash
  const handleGenerateStory = async (req: StoryGenerationRequest) => {
    setIsGeneratingStory(true);
    try {
      const res = await fetch('/api/generate-story', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(req),
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.error || `Server responded with ${res.status}`);
      }

      const data = await res.json();
      if (data.comic) {
        handleUpdateComic(data.comic);
        setIsGeneratorOpen(false);
        soundFx.playTada();
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
        });
        showToast(`Created "${data.comic.title}" with Gemini models!`, 'success');
      }
    } catch (err: unknown) {
      console.error('Story generation error:', err);
      const msg = err instanceof Error ? err.message : 'Story generation failed';
      showToast(msg, 'error');
    } finally {
      setIsGeneratingStory(false);
    }
  };

  // Generate image for individual panel with Gemini image model
  const handleRegenerateImage = async (panel: ComicPanel) => {
    setIsGeneratingImageId(panel.id);
    soundFx.playZap();
    try {
      const res = await fetch('/api/generate-panel-image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: panel.visualDescription,
          artStyle: currentComic.artStyle,
        }),
      });

      const data = await res.json();
      if (data.imageUrl) {
        const updatedPanels = currentComic.panels.map((p) =>
          p.id === panel.id ? { ...p, imageUrl: data.imageUrl } : p
        );
        handleUpdateComic({ ...currentComic, panels: updatedPanels });
        soundFx.playTada();
        showToast('Panel illustration generated with Gemini!', 'success');
      } else {
        // Fallback message
        showToast('Image model fallback active: procedural comic art rendered.', 'info');
      }
    } catch (err) {
      console.warn('Image generation fallback:', err);
      showToast('Procedural comic vector art rendered.', 'info');
    } finally {
      setIsGeneratingImageId(null);
    }
  };

  // Text-To-Speech with Gemini 3.8 Flash Lite TTS (or browser Web Speech)
  const handlePlaySpeech = async (text: string, speaker: string = 'Narrator') => {
    try {
      const res = await fetch('/api/generate-speech', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text, speaker, voice: 'Puck' }),
      });

      if (res.ok) {
        const data = await res.json();
        if (data.audioBase64) {
          const audio = new Audio(`data:audio/wav;base64,${data.audioBase64}`);
          audio.play();
          return;
        }
      }
      throw new Error('TTS server fallback');
    } catch {
      // Fallback: Web Speech API
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(`${speaker}: ${text}`);
        utterance.rate = 1.05;
        window.speechSynthesis.speak(utterance);
      }
    }
  };

  // Continue story with AI by adding the next panel
  const handleAddNextPanel = async () => {
    setIsAddingPanel(true);
    soundFx.playBoom();
    try {
      const existingPanelsSummary = currentComic.panels
        .map((p) => `Panel ${p.panelNumber}: ${p.visualDescription} (${p.caption || ''})`)
        .join('\n');

      const nextPanelNumber = currentComic.panels.length + 1;
      const prompt = `Based on the preceding story "${currentComic.title}" (${currentComic.genre}, ${currentComic.tone}):
${existingPanelsSummary}

Generate the NEXT sequential panel (Panel #${nextPanelNumber}) to continue the storyline dramatically.`;

      const res = await fetch('/api/generate-story', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt,
          genre: currentComic.genre,
          tone: currentComic.tone,
          artStyle: currentComic.artStyle,
          panelCount: 1,
          layout: currentComic.layout,
        }),
      });

      const data = await res.json();
      if (data.comic && data.comic.panels && data.comic.panels.length > 0) {
        const newPanel: ComicPanel = {
          ...data.comic.panels[0],
          id: `panel-${currentComic.id}-${nextPanelNumber}`,
          panelNumber: nextPanelNumber,
        };

        const updatedPanels = [...currentComic.panels, newPanel];
        handleUpdateComic({ ...currentComic, panels: updatedPanels });
        soundFx.playTada();
        showToast(`Added Panel #${nextPanelNumber} to the story!`, 'success');
      }
    } catch (err: unknown) {
      console.error('Failed to add panel:', err);
      showToast('Could not add next panel.', 'error');
    } finally {
      setIsAddingPanel(false);
    }
  };

  // Save edited panel from modal
  const handleSavePanel = (updatedPanel: ComicPanel) => {
    const updatedPanels = currentComic.panels.map((p) =>
      p.id === updatedPanel.id ? updatedPanel : p
    );
    handleUpdateComic({ ...currentComic, panels: updatedPanels });
    showToast(`Updated Panel #${updatedPanel.panelNumber}`, 'success');
  };

  // Select preset comic
  const handleSelectPreset = (presetId: string) => {
    const found = PRESET_COMICS.find((p) => p.id === presetId);
    if (found) {
      handleUpdateComic(found);
      showToast(`Loaded preset: "${found.title}"`, 'info');
    }
  };

  // Delete comic from gallery
  const handleDeleteComic = (comicId: string) => {
    const next = savedComics.filter((c) => c.id !== comicId);
    setSavedComics(next);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    if (currentComic.id === comicId && next.length > 0) {
      setCurrentComic(next[0]);
    }
    showToast('Comic removed from vault', 'info');
  };

  // Import JSON comic
  const handleImportJson = (imported: ComicStory) => {
    handleUpdateComic(imported);
    setIsGalleryOpen(false);
    showToast(`Imported "${imported.title}"!`, 'success');
  };

  return (
    <div className="min-h-screen bg-[#fcf8f0] text-stone-900 flex flex-col font-sans selection:bg-amber-300 selection:text-stone-950">
      {/* Toast Notification */}
      {toastMessage && (
        <div
          className={`no-print fixed bottom-5 right-5 z-50 flex items-center gap-2.5 px-4 py-2.5 border-3 border-black shadow-[4px_4px_0px_#000] text-sm font-bold animate-in slide-in-from-bottom duration-150 ${
            toastMessage.type === 'success'
              ? 'bg-emerald-300 text-stone-950'
              : toastMessage.type === 'error'
              ? 'bg-rose-300 text-stone-950'
              : 'bg-amber-300 text-stone-950'
          }`}
        >
          {toastMessage.type === 'success' ? (
            <CheckCircle2 className="w-4 h-4 text-stone-950 shrink-0" />
          ) : (
            <AlertCircle className="w-4 h-4 text-stone-950 shrink-0" />
          )}
          <span>{toastMessage.text}</span>
        </div>
      )}

      {/* Navigation Header */}
      <Navbar
        currentComic={currentComic}
        onNewStory={() => setIsGeneratorOpen(true)}
        onOpenReadingMode={() => setIsReadingModeOpen(true)}
        onOpenGallery={() => setIsGalleryOpen(true)}
        onSelectPreset={handleSelectPreset}
        onExportPng={() => downloadComicPageAsPng('comic-printable-page', currentComic)}
        onPrint={printComic}
        onExportJson={() => exportComicJson(currentComic)}
        presets={PRESET_COMICS}
      />

      {/* Main Studio Viewport */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-6 sm:py-8">
        <ComicViewer
          comic={currentComic}
          onUpdateComic={handleUpdateComic}
          onEditPanel={(panel) => {
            setSelectedPanel(panel);
            setIsEditorOpen(true);
          }}
          onRegenerateImage={handleRegenerateImage}
          onAddNextPanel={handleAddNextPanel}
          onPlaySpeech={handlePlaySpeech}
          isGeneratingImageId={isGeneratingImageId}
          isAddingPanel={isAddingPanel}
        />
      </main>

      {/* Story Generator Modal */}
      <StoryGeneratorModal
        isOpen={isGeneratorOpen}
        onClose={() => setIsGeneratorOpen(false)}
        onGenerate={handleGenerateStory}
        isGenerating={isGeneratingStory}
      />

      {/* Panel Editor Modal */}
      <PanelEditorModal
        panel={selectedPanel}
        isOpen={isEditorOpen}
        onClose={() => {
          setIsEditorOpen(false);
          setSelectedPanel(null);
        }}
        onSave={handleSavePanel}
        onRegenerateImage={handleRegenerateImage}
      />

      {/* Fullscreen Reading Mode */}
      <ReadingModeModal
        comic={currentComic}
        isOpen={isReadingModeOpen}
        onClose={() => setIsReadingModeOpen(false)}
        onPlaySpeech={handlePlaySpeech}
      />

      {/* Gallery Drawer */}
      <GalleryDrawer
        isOpen={isGalleryOpen}
        onClose={() => setIsGalleryOpen(false)}
        savedComics={savedComics}
        currentComicId={currentComic.id}
        onSelectComic={(comic) => setCurrentComic(comic)}
        onDeleteComic={handleDeleteComic}
        onImportJson={handleImportJson}
      />
    </div>
  );
}
