import React from 'react';
import {
  X,
  Eye,
  ExternalLink,
  Copy,
  Shield,
  ArrowRight,
  Sparkles,
} from 'lucide-react';
import { useBrowser } from '../context/BrowserContext';

export const LinkPeekModal: React.FC = () => {
  const {
    peekState,
    closeLinkPeek,
    navigateTab,
    openTab,
    activeTab,
  } = useBrowser();

  if (!peekState.isOpen) return null;

  const handleOpenNow = () => {
    navigateTab(activeTab.id, peekState.url);
    closeLinkPeek();
  };

  const handleOpenBackground = () => {
    openTab(peekState.url, peekState.title);
    closeLinkPeek();
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(peekState.url);
    closeLinkPeek();
  };

  return (
    <div
      id="link-peek-overlay"
      className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-150"
      onClick={closeLinkPeek}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-lg rounded-3xl bg-neutral-900 border border-neutral-800 shadow-2xl overflow-hidden flex flex-col space-y-4 p-6 text-neutral-100"
      >
        {/* Peek Header */}
        <div className="flex items-center justify-between border-b border-neutral-800 pb-4">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-pink-500/20 text-pink-400">
              <Eye className="w-4 h-4" />
            </div>
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-pink-400">
                Link Peek
              </span>
              <h3 className="font-bold text-base text-white truncate max-w-xs sm:max-w-md">
                {peekState.title || 'Page Preview'}
              </h3>
            </div>
          </div>

          <button
            type="button"
            onClick={closeLinkPeek}
            className="p-1.5 rounded-full hover:bg-neutral-800 text-neutral-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Link URL pill */}
        <div className="px-3 py-1.5 rounded-xl bg-neutral-800/80 border border-neutral-700/60 font-mono text-xs text-neutral-300 truncate">
          {peekState.url}
        </div>

        {/* Peek Snippet Content */}
        <div className="p-4 rounded-2xl bg-neutral-950 border border-neutral-850 space-y-2 text-xs text-neutral-300 leading-relaxed max-h-48 overflow-y-auto">
          <p>{peekState.previewSnippet || 'Previewing target webpage safely without loading external telemetry.'}</p>
        </div>

        {/* Actions */}
        <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-2">
          <button
            type="button"
            onClick={handleCopy}
            className="w-full sm:w-auto px-4 py-2 rounded-xl bg-neutral-800 hover:bg-neutral-750 text-neutral-300 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
          >
            <Copy className="w-3.5 h-3.5" />
            <span>Copy URL</span>
          </button>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              type="button"
              onClick={handleOpenBackground}
              className="flex-1 sm:flex-initial px-4 py-2 rounded-xl bg-neutral-800 hover:bg-neutral-750 text-neutral-200 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>Open in New Tab</span>
            </button>

            <button
              type="button"
              onClick={handleOpenNow}
              className="flex-1 sm:flex-initial px-4 py-2 rounded-xl bg-pink-500 hover:bg-pink-600 text-white text-xs font-bold flex items-center justify-center gap-1.5 shadow-lg shadow-pink-500/25 transition-all"
            >
              <span>Navigate Here</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
