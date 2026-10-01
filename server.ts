import express, { Request, Response } from 'express';
import { createServer as createViteServer } from 'vite';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI, Type } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = Number(process.env.PORT) || 3000;

  app.use(express.json({ limit: '30mb' }));

  // Initialize Gemini client (Server-Side only)
  const apiKey = process.env.GEMINI_API_KEY;
  const ai = apiKey
    ? new GoogleGenAI({
        apiKey,
        httpOptions: {
          headers: {
            'User-Agent': 'aistudio-build',
          },
        },
      })
    : null;

  // --- API Routes ---

  // Health check
  app.get('/api/health', (req: Request, res: Response) => {
    res.json({
      status: 'ok',
      hasApiKey: !!apiKey,
      timestamp: new Date().toISOString(),
    });
  });

  // Suggest prompt ideas based on genre
  app.post('/api/suggest-prompt', async (req: Request, res: Response) => {
    try {
      const { genre = 'Superhero' } = req.body;
      if (!ai) {
        return res.json({
          ideas: [
            'A retired hero must come out of retirement when their cat starts teleporting.',
            'An apprentice wizard accidentally summons a neon-glowing cyberpunk delivery drone.',
            'A noir detective discovers that all the shadows in the city are unionizing.',
            'Two rival culinary champions battle with mythical dragon-fire frying pans.'
          ]
        });
      }

      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: `Generate 4 punchy, imaginative comic book story hooks/premises for the genre: "${genre}".
Return only a JSON array of 4 short premise strings (1-2 sentences each). Make them vibrant, visually rich, and full of comic potential.`,
        config: {
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.ARRAY,
            items: { type: Type.STRING },
          },
        },
      });

      const ideas = JSON.parse(response.text?.trim() || '[]');
      res.json({ ideas });
    } catch (err: unknown) {
      console.error('Error suggesting prompt:', err);
      res.json({
        ideas: [
          'A neon vigilante chases a rogue AI that paints graffiti across holographic skyscrapers.',
          'An astronaut finds an ancient ramen cart parked on the dark side of the moon.',
          'A quiet librarian discovers the books fight each other when the lights go off.',
          'A tiny mouse knight defends a pantry fortress against the dread Kitchen Cockroach King.'
        ]
      });
    }
  });

  // Full Comic Generation using Gemini 3.8 Flash
  app.post('/api/generate-story', async (req: Request, res: Response) => {
    try {
      const {
        prompt,
        genre = 'Superhero',
        tone = 'Action-Packed',
        artStyle = 'retro-comic',
        panelCount = 4,
        layout = 'classic-4',
        characters = [],
      } = req.body;

      if (!prompt || typeof prompt !== 'string') {
        return res.status(400).json({ error: 'Prompt is required' });
      }

      if (!ai) {
        return res.status(500).json({
          error: 'Gemini API Key is not configured. Please ensure GEMINI_API_KEY is provided in settings.',
        });
      }

      const characterBrief = characters && characters.length > 0
        ? `Characters to include: ${JSON.stringify(characters)}`
        : 'Create 1 to 3 distinct, memorable comic characters with unique looks and personalities.';

      const systemInstruction = `You are a master comic book creator, graphic novelist, and storyboard artist.
Your job is to transform a story premise into a thrilling, visually dynamic, professionally scripted comic book issue with exactly ${panelCount} panels.

Key comic craft rules:
1. Every panel must have a distinct cinematic camera angle (e.g. "Low Angle Wide Splash", "Extreme Close-Up", "Dutch Tilt Tension", "Over-the-Shoulder Showdown").
2. Panels must feature crisp, punchy dialogue balloons (types: "speech", "thought", "shout", "whisper").
3. Use dramatic narrator captions when setting scene context.
4. Add vivid, impactful onomatopoeia sound effects (e.g., "KAPOW!", "ZAP!", "WHOOSH!", "CRASH!", "THWIP!", "BZZZT!").
5. The visual descriptions must be richly detailed for comic illustrators: specify characters' poses, expressions, costume details, lighting mood, color palette, background environment, and dynamic comic effects (speed lines, energy bursts, halftone dots, rain, smoke).
6. Match the requested Art Style: ${artStyle} (e.g., retro-comic has Ben-Day dots and vintage pop art colors; manga has dynamic speed lines and screentones; dark-noir has deep chiaroscuro shadows; cyberpunk has vibrant neon rim lights).
7. Match the requested Tone: ${tone} and Genre: ${genre}.`;

      const promptMessage = `Create a ${panelCount}-panel comic story based on this premise:
"${prompt}"

${characterBrief}
Layout format: ${layout}
Tone: ${tone}
Genre: ${genre}
Art Style: ${artStyle}`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: promptMessage,
        config: {
          systemInstruction,
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              title: { type: Type.STRING, description: 'Catchy comic book title' },
              issueNumber: { type: Type.STRING, description: 'Issue format e.g. #01 or Vol. 1' },
              tagline: { type: Type.STRING, description: 'One-line dramatic comic teaser tagline' },
              synopsis: { type: Type.STRING, description: 'Brief 2-sentence summary' },
              coverColor: { type: Type.STRING, description: 'Hex color for title badge / accent e.g. #dc2626 or #0284c7' },
              characters: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    name: { type: Type.STRING },
                    role: { type: Type.STRING, description: 'protagonist, antagonist, sidekick, mentor, or extra' },
                    appearance: { type: Type.STRING, description: 'Visual appearance description' },
                    personality: { type: Type.STRING },
                    colorTheme: { type: Type.STRING, description: 'Signature hex color e.g. #f59e0b' },
                  },
                  required: ['name', 'role', 'appearance', 'personality', 'colorTheme'],
                },
              },
              panels: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    panelNumber: { type: Type.INTEGER },
                    caption: { type: Type.STRING, description: 'Narrator caption box text, or empty string' },
                    visualDescription: { type: Type.STRING, description: 'Detailed visual scene description' },
                    cameraAngle: { type: Type.STRING, description: 'Camera shot type and angle' },
                    illustrationData: {
                      type: Type.OBJECT,
                      properties: {
                        primarySubject: { type: Type.STRING },
                        actionPose: { type: Type.STRING },
                        environment: { type: Type.STRING },
                        colorPalette: {
                          type: Type.OBJECT,
                          properties: {
                            skyOrBg: { type: Type.STRING, description: 'Hex color for background' },
                            groundOrMid: { type: Type.STRING, description: 'Hex color for midground' },
                            accent: { type: Type.STRING, description: 'Hex color for key highlight' },
                            shadow: { type: Type.STRING, description: 'Hex color for deep shadow' },
                          },
                          required: ['skyOrBg', 'groundOrMid', 'accent', 'shadow'],
                        },
                        lightingMood: { type: Type.STRING },
                        effects: {
                          type: Type.ARRAY,
                          items: { type: Type.STRING, description: 'one of: speed-lines, halftone-dots, energy-burst, smoke, rain, sunburst' },
                        },
                        compositionAngle: { type: Type.STRING },
                      },
                      required: ['primarySubject', 'actionPose', 'environment', 'colorPalette', 'lightingMood', 'effects', 'compositionAngle'],
                    },
                    dialogue: {
                      type: Type.ARRAY,
                      items: {
                        type: Type.OBJECT,
                        properties: {
                          speaker: { type: Type.STRING },
                          text: { type: Type.STRING },
                          type: { type: Type.STRING, description: 'speech, thought, shout, whisper, or caption' },
                          position: { type: Type.STRING, description: 'top-left, top-right, bottom-left, bottom-right, center, top-center, bottom-center' },
                        },
                        required: ['speaker', 'text', 'type', 'position'],
                      },
                    },
                    soundEffects: {
                      type: Type.ARRAY,
                      items: {
                        type: Type.OBJECT,
                        properties: {
                          text: { type: Type.STRING, description: 'Sound FX text like POW!, BAM!, WHOOSH!' },
                          style: { type: Type.STRING, description: 'punchy, fiery, electric, cosmic, or stealth' },
                          x: { type: Type.NUMBER, description: 'Horizontal percentage 10 to 90' },
                          y: { type: Type.NUMBER, description: 'Vertical percentage 10 to 90' },
                          rotation: { type: Type.NUMBER, description: 'Rotation in degrees -20 to 20' },
                        },
                        required: ['text', 'style', 'x', 'y', 'rotation'],
                      },
                    },
                  },
                  required: ['panelNumber', 'visualDescription', 'cameraAngle', 'illustrationData', 'dialogue', 'soundEffects'],
                },
              },
            },
            required: ['title', 'issueNumber', 'tagline', 'synopsis', 'characters', 'panels'],
          },
        },
      });

      const parsedStory = JSON.parse(response.text?.trim() || '{}');

      // Add unique IDs and structure
      const comicId = 'comic-' + Date.now();
      const enrichedStory = {
        id: comicId,
        title: parsedStory.title || 'Untitled Comic Adventure',
        issueNumber: parsedStory.issueNumber || '#01',
        tagline: parsedStory.tagline || 'An AI Generated Comic Epic',
        genre,
        tone,
        artStyle,
        layout,
        createdAt: new Date().toISOString(),
        author: 'ComicCraft AI Studio',
        synopsis: parsedStory.synopsis || prompt,
        coverColor: parsedStory.coverColor || '#dc2626',
        characters: (parsedStory.characters || []).map((c: Record<string, unknown>, idx: number) => ({
          id: `char-${comicId}-${idx}`,
          name: c.name || `Character ${idx + 1}`,
          role: c.role || 'protagonist',
          appearance: c.appearance || '',
          personality: c.personality || '',
          colorTheme: c.colorTheme || '#e11d48',
        })),
        panels: (parsedStory.panels || []).map((p: Record<string, unknown>, idx: number) => ({
          id: `panel-${comicId}-${idx + 1}`,
          panelNumber: idx + 1,
          caption: p.caption || undefined,
          visualDescription: p.visualDescription || '',
          cameraAngle: p.cameraAngle || 'Standard Eye-Level',
          illustrationData: p.illustrationData || {
            primarySubject: 'Hero in dynamic stance',
            actionPose: 'Standing ready',
            environment: 'City skyline',
            colorPalette: { skyOrBg: '#1e293b', groundOrMid: '#334155', accent: '#f59e0b', shadow: '#0f172a' },
            lightingMood: 'Dramatic comic lighting',
            effects: ['speed-lines', 'halftone-dots'],
            compositionAngle: 'Eye-level dynamic',
          },
          dialogue: ((p.dialogue as Record<string, unknown>[]) || []).map((d: Record<string, unknown>, dIdx: number) => ({
            id: `d-${comicId}-${idx}-${dIdx}`,
            speaker: d.speaker || 'Hero',
            text: d.text || '...',
            type: d.type || 'speech',
            position: d.position || 'top-left',
          })),
          soundEffects: ((p.soundEffects as Record<string, unknown>[]) || []).map((s: Record<string, unknown>, sIdx: number) => ({
            id: `s-${comicId}-${idx}-${sIdx}`,
            text: s.text || 'POW!',
            style: s.style || 'punchy',
            x: typeof s.x === 'number' ? s.x : 50,
            y: typeof s.y === 'number' ? s.y : 50,
            rotation: typeof s.rotation === 'number' ? s.rotation : 0,
          })),
        })),
      };

      res.json({ comic: enrichedStory });
    } catch (err: unknown) {
      console.error('Error generating comic story:', err);
      const errorMessage = err instanceof Error ? err.message : 'Failed to generate comic story';
      res.status(500).json({ error: errorMessage });
    }
  });

  // Generate Image for Panel (nano banana / gemini image with graceful fallback)
  app.post('/api/generate-panel-image', async (req: Request, res: Response) => {
    try {
      const { prompt, artStyle = 'retro-comic' } = req.body;
      if (!prompt) {
        return res.status(400).json({ error: 'Prompt is required' });
      }

      if (!ai) {
        return res.status(500).json({ error: 'Gemini client not initialized' });
      }

      const styleGuide = artStyle === 'manga'
        ? 'Japanese Manga style, black and white ink drawing, intense screentones, speedlines, high contrast, clean anime line art'
        : artStyle === 'dark-noir'
        ? 'Moody graphic novel noir style, heavy black shadows, chiaroscuro lighting, cinematic angle, gritty vintage ink'
        : artStyle === 'cyberpunk'
        ? 'Cyberpunk graphic novel art, neon magenta and cyan highlights, tech silhouettes, holographic glow, detailed ink'
        : 'Vintage classic 1960s comic book panel illustration, bold ink outlines, vibrant pop art colors, Ben-Day halftone dots texture, dynamic action';

      const fullImagePrompt = `Single comic book panel illustration: ${prompt}. Art style: ${styleGuide}. Comic art only, no text, no captions, sharp linework.`;

      // Call Gemini 3.1 Flash Lite Image
      const imageResponse = await ai.models.generateContent({
        model: 'gemini-3.1-flash-lite-image',
        contents: {
          parts: [{ text: fullImagePrompt }],
        },
        config: {
          imageConfig: {
            aspectRatio: '4:3',
          },
        },
      });

      let foundImageUrl: string | null = null;
      if (imageResponse.candidates?.[0]?.content?.parts) {
        for (const part of imageResponse.candidates[0].content.parts) {
          if (part.inlineData?.data) {
            const mimeType = part.inlineData.mimeType || 'image/png';
            foundImageUrl = `data:${mimeType};base64,${part.inlineData.data}`;
            break;
          }
        }
      }

      if (foundImageUrl) {
        return res.json({ imageUrl: foundImageUrl });
      } else {
        return res.status(404).json({ error: 'No image data returned from model' });
      }
    } catch (err: unknown) {
      console.warn('Image generation could not complete (will use procedural comic engine):', err);
      const message = err instanceof Error ? err.message : 'Image generation unavailable';
      return res.status(422).json({
        error: message,
        fallback: true,
      });
    }
  });

  // Text-To-Speech with gemini-3.8-flash-lite-tts
  app.post('/api/generate-speech', async (req: Request, res: Response) => {
    try {
      const { text, speaker = 'Narrator', voice = 'Puck' } = req.body;
      if (!text) {
        return res.status(400).json({ error: 'Text is required for TTS' });
      }

      if (!ai) {
        return res.status(500).json({ error: 'Gemini client not initialized' });
      }

      // Valid prebuilt voices: 'Puck', 'Charon', 'Kore', 'Fenrir', 'Zephyr'
      const voiceName = ['Puck', 'Charon', 'Kore', 'Fenrir', 'Zephyr'].includes(voice) ? voice : 'Puck';

      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash-lite-tts',
        contents: [
          {
            role: 'user',
            parts: [
              {
                text: `${speaker}: ${text}`,
                speechMetadata: {
                  style: 'Dramatic comic book voice narration, expressive, energetic',
                },
              },
            ],
          },
        ],
        config: {
          responseModalities: ['AUDIO'],
          speechConfig: {
            voiceConfig: {
              prebuiltVoiceConfig: { voiceName },
            },
          },
        },
      });

      const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
      if (base64Audio) {
        return res.json({
          audioBase64: base64Audio,
          mimeType: 'audio/wav',
        });
      }

      res.status(404).json({ error: 'No audio returned from TTS model' });
    } catch (err: unknown) {
      console.error('Error generating speech:', err);
      const message = err instanceof Error ? err.message : 'Speech synthesis failed';
      res.status(500).json({ error: message });
    }
  });

  // Rewrite dialogue to be punchier / comic style
  app.post('/api/rewrite-dialogue', async (req: Request, res: Response) => {
    const text = req.body?.text || '';
    const style = req.body?.style || 'punchy';
    if (!text) return res.status(400).json({ error: 'Text required' });

    try {
      if (!ai) {
        return res.json({
          suggestions: [
            text.toUpperCase() + '!',
            'Listen close: ' + text,
            'Mark my words, ' + text
          ]
        });
      }

      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: `Rewrite this comic dialogue line: "${text}" into 3 different comic book styles (style: ${style}).
Make them snappy, expressive, and fit neatly inside a speech balloon.
Return a JSON array of 3 alternative strings.`,
        config: {
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.ARRAY,
            items: { type: Type.STRING },
          },
        },
      });

      const suggestions = JSON.parse(response.text?.trim() || '[]');
      res.json({ suggestions });
    } catch (err: unknown) {
      console.error('Error rewriting dialogue:', err);
      res.json({
        suggestions: [
          text.toUpperCase() + '!',
          'Not on my watch! ' + text,
          'Here is the deal: ' + text
        ]
      });
    }
  });

  // --- Vite & Static Handling ---
  if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (req: Request, res: Response) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  } else {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`ComicCraft server running on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
