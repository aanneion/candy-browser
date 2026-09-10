import React, { useState, useEffect, useRef } from 'react';
import {
  X,
  BookOpen,
  Volume2,
  VolumeX,
  Play,
  Pause,
  RotateCcw,
  Bookmark,
  BookmarkCheck,
  Type,
  Sun,
  Moon,
  Coffee,
  Share2,
  Clock,
  User,
  Calendar,
} from 'lucide-react';
import { useBrowser } from '../context/BrowserContext';

export const ReaderStudio: React.FC = () => {
  const {
    readerOpen,
    closeReaderMode,
    readerArticle,
    readerSettings,
    updateReaderSettings,
    savedArticles,
    toggleSaveCurrentArticle,
  } = useBrowser();

  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [currentSentenceIndex, setCurrentSentenceIndex] = useState<number | null>(null);
  const [showSettingsDrawer, setShowSettingsDrawer] = useState(false);

  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  if (!readerOpen || !readerArticle) return null;

  const isSaved = savedArticles.some((a) => a.url === readerArticle.url);

  // Stop speech when closed
  useEffect(() => {
    return () => {
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  const handleSpeak = () => {
    if (!('speechSynthesis' in window)) {
      alert('Speech synthesis is not supported in this environment.');
      return;
    }

    if (isPaused) {
      window.speechSynthesis.resume();
      setIsPaused(false);
      setIsSpeaking(true);
      return;
    }

    window.speechSynthesis.cancel();

    const fullText = `${readerArticle.title}. ${readerArticle.content.join(' ')}`;
    const utterance = new SpeechSynthesisUtterance(fullText);
    utterance.rate = readerSettings.speechRate || 1.0;

    utterance.onend = () => {
      setIsSpeaking(false);
      setIsPaused(false);
      setCurrentSentenceIndex(null);
    };

    utterance.onerror = () => {
      setIsSpeaking(false);
      setIsPaused(false);
    };

    utteranceRef.current = utterance;
    window.speechSynthesis.speak(utterance);
    setIsSpeaking(true);
    setIsPaused(false);
  };

  const handlePauseSpeech = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.pause();
      setIsPaused(true);
    }
  };

  const handleStopSpeech = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      setIsPaused(false);
      setCurrentSentenceIndex(null);
    }
  };

  // Estimate reading time
  const totalWords = readerArticle.content.join(' ').split(/\s+/).length;
  const readMinutes = Math.max(1, Math.round(totalWords / 200));

  // Themes
  const themeStyles = {
    dark: 'bg-neutral-950 text-neutral-100 selection:bg-pink-500/30',
    light: 'bg-[#faf8f5] text-neutral-900 selection:bg-amber-200',
    sepia: 'bg-[#f4ecd8] text-[#433422] selection:bg-[#d6c29e]',
    midnight: 'bg-[#0B0F19] text-[#E0E7FF] selection:bg-[#3730A3]',
  };

  const fontFamilies = {
    serif: 'font-serif',
    sans: 'font-sans',
    mono: 'font-mono',
  };

  return (
    <div
      id="reader-studio-overlay"
      className={`fixed inset-0 z-50 overflow-y-auto flex flex-col transition-colors duration-300 animate-in fade-in duration-200 ${
        themeStyles[readerSettings.theme]
      }`}
    >
      {/* Sticky Reader Toolbar */}
      <div className="sticky top-0 z-40 backdrop-blur-xl bg-opacity-90 border-b border-black/10 dark:border-white/10 px-4 sm:px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => {
              handleStopSpeech();
              closeReaderMode();
            }}
            className="p-2 rounded-full hover:bg-black/5 dark:hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-pink-500">
            <BookOpen className="w-4 h-4" />
            <span>Reader Studio</span>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2">
          {/* Speech Control */}
          <div className="flex items-center gap-1 bg-black/5 dark:bg-white/10 rounded-full p-1">
            {!isSpeaking || isPaused ? (
              <button
                type="button"
                onClick={handleSpeak}
                title="Read Aloud"
                className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-pink-500 text-white shadow-md hover:bg-pink-600 transition-colors"
              >
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>Listen</span>
              </button>
            ) : (
              <>
                <button
                  type="button"
                  onClick={handlePauseSpeech}
                  title="Pause"
                  className="p-1.5 rounded-full hover:bg-black/10 dark:hover:bg-white/20 transition-colors"
                >
                  <Pause className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={handleStopSpeech}
                  title="Stop"
                  className="p-1.5 rounded-full hover:bg-black/10 dark:hover:bg-white/20 text-rose-500 transition-colors"
                >
                  <VolumeX className="w-3.5 h-3.5" />
                </button>
              </>
            )}
          </div>

          {/* Bookmark Article */}
          <button
            type="button"
            onClick={toggleSaveCurrentArticle}
            title={isSaved ? 'Remove from Saved' : 'Save to Offline Reading List'}
            className="p-2 rounded-full hover:bg-black/5 dark:hover:bg-white/10 transition-colors"
          >
            {isSaved ? (
              <BookmarkCheck className="w-5 h-5 text-pink-500 fill-pink-500" />
            ) : (
              <Bookmark className="w-5 h-5" />
            )}
          </button>

          {/* Typography Settings Button */}
          <button
            type="button"
            onClick={() => setShowSettingsDrawer(!showSettingsDrawer)}
            title="Appearance Settings"
            className="p-2 rounded-full hover:bg-black/5 dark:hover:bg-white/10 transition-colors"
          >
            <Type className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Typography & Theme Drawer */}
      {showSettingsDrawer && (
        <div className="sticky top-[57px] z-30 p-4 border-b border-black/10 dark:border-white/10 backdrop-blur-xl bg-opacity-95 shadow-xl transition-all">
          <div className="max-w-xl mx-auto space-y-4 text-xs">
            {/* Theme Picker */}
            <div className="flex items-center justify-between">
              <span className="font-semibold">Reader Theme</span>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => updateReaderSettings({ theme: 'dark' })}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border ${
                    readerSettings.theme === 'dark' ? 'border-pink-500 bg-neutral-900 text-white font-bold' : 'border-neutral-700 bg-neutral-800 text-neutral-300'
                  }`}
                >
                  <Moon className="w-3.5 h-3.5" />
                  <span>Dark</span>
                </button>
                <button
                  type="button"
                  onClick={() => updateReaderSettings({ theme: 'sepia' })}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border ${
                    readerSettings.theme === 'sepia' ? 'border-pink-500 bg-[#f4ecd8] text-[#433422] font-bold' : 'border-[#d6c29e] bg-[#fdfaf2] text-[#433422]'
                  }`}
                >
                  <Coffee className="w-3.5 h-3.5" />
                  <span>Sepia</span>
                </button>
                <button
                  type="button"
                  onClick={() => updateReaderSettings({ theme: 'light' })}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border ${
                    readerSettings.theme === 'light' ? 'border-pink-500 bg-white text-black font-bold' : 'border-neutral-300 bg-neutral-100 text-neutral-800'
                  }`}
                >
                  <Sun className="w-3.5 h-3.5" />
                  <span>Paper</span>
                </button>
              </div>
            </div>

            {/* Font Family */}
            <div className="flex items-center justify-between">
              <span className="font-semibold">Typeface</span>
              <div className="flex gap-2">
                {(['serif', 'sans', 'mono'] as const).map((font) => (
                  <button
                    key={font}
                    type="button"
                    onClick={() => updateReaderSettings({ fontFamily: font })}
                    className={`px-3 py-1.5 rounded-xl border capitalize ${
                      readerSettings.fontFamily === font ? 'border-pink-500 font-bold' : 'opacity-70'
                    }`}
                  >
                    {font}
                  </button>
                ))}
              </div>
            </div>

            {/* Font Size Slider */}
            <div className="flex items-center justify-between gap-4">
              <span className="font-semibold">Text Size ({readerSettings.fontSize}px)</span>
              <input
                type="range"
                min="14"
                max="26"
                step="1"
                value={readerSettings.fontSize}
                onChange={(e) => updateReaderSettings({ fontSize: Number(e.target.value) })}
                className="w-48 accent-pink-500"
              />
            </div>

            {/* Speech Rate Slider */}
            <div className="flex items-center justify-between gap-4">
              <span className="font-semibold">Narration Speed ({readerSettings.speechRate}x)</span>
              <input
                type="range"
                min="0.75"
                max="1.75"
                step="0.25"
                value={readerSettings.speechRate}
                onChange={(e) => updateReaderSettings({ speechRate: Number(e.target.value) })}
                className="w-48 accent-pink-500"
              />
            </div>
          </div>
        </div>
      )}

      {/* Article Content */}
      <div className="flex-1 max-w-2xl mx-auto px-6 py-12 space-y-8">
        {/* Article Meta Header */}
        <header className="space-y-4 border-b border-black/10 dark:border-white/10 pb-6">
          <div className="flex items-center gap-2 text-xs opacity-70">
            <span>{readerArticle.siteName}</span>
            <span>·</span>
            <span className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" />
              {readMinutes} min read
            </span>
          </div>

          <h1
            className={`font-bold leading-tight ${fontFamilies[readerSettings.fontFamily]}`}
            style={{ fontSize: `${readerSettings.fontSize * 1.6}px` }}
          >
            {readerArticle.title}
          </h1>

          <div className="flex items-center gap-4 text-xs opacity-80 pt-1">
            <span className="flex items-center gap-1.5 font-medium">
              <User className="w-3.5 h-3.5 text-pink-500" />
              {readerArticle.byline}
            </span>
            <span className="flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 opacity-60" />
              {readerArticle.publishedTime}
            </span>
          </div>
        </header>

        {/* Body Paragraphs */}
        <article
          className={`space-y-6 ${fontFamilies[readerSettings.fontFamily]}`}
          style={{
            fontSize: `${readerSettings.fontSize}px`,
            lineHeight: readerSettings.lineHeight,
          }}
        >
          {readerArticle.content.map((paragraph, idx) => (
            <p key={idx} className="leading-relaxed">
              {paragraph}
            </p>
          ))}
        </article>
      </div>
    </div>
  );
};
