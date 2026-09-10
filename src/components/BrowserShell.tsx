import React, { useState, useRef } from 'react';
import { useBrowser } from '../context/BrowserContext';
import { BrowserChrome } from './BrowserChrome';
import { BrowserViewport } from './BrowserViewport';
import { TabOverview } from './TabOverview';
import { CandyTrailSheet } from './CandyTrailSheet';
import { PrivacyXRaySheet } from './PrivacyXRaySheet';
import { SiteCapsulesSheet } from './SiteCapsulesSheet';
import { ReaderStudio } from './ReaderStudio';
import { LinkPeekModal } from './LinkPeekModal';
import { ProfilesModal } from './ProfilesModal';
import { SettingsSheet } from './SettingsSheet';
import { Search, X, ChevronUp, ChevronDown } from 'lucide-react';

export const BrowserShell: React.FC = () => {
  const {
    settings,
    tabs,
    activeTabId,
    switchTab,
    findInPageOpen,
    setFindInPageOpen,
    activeProfile,
  } = useBrowser();

  const [findQuery, setFindQuery] = useState('');
  const [findResultIndex, setFindResultIndex] = useState(0);

  // Gesture handling: horizontal swipe to switch tabs
  const touchStartXRef = useRef<number | null>(null);

  const handleTouchStart = (e: React.TouchEvent) => {
    if (!settings.gestureNavigation) return;
    touchStartXRef.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (!settings.gestureNavigation || touchStartXRef.current === null) return;
    const touchEndX = e.changedTouches[0].clientX;
    const diffX = touchEndX - touchStartXRef.current;
    touchStartXRef.current = null;

    // Trigger on swipe threshold of 70px
    if (Math.abs(diffX) > 70) {
      const currentIdx = tabs.findIndex((t) => t.id === activeTabId);
      if (diffX < 0 && currentIdx < tabs.length - 1) {
        // Swipe left -> Next tab
        switchTab(tabs[currentIdx + 1].id);
      } else if (diffX > 0 && currentIdx > 0) {
        // Swipe right -> Previous tab
        switchTab(tabs[currentIdx - 1].id);
      }
    }
  };

  return (
    <div
      id="candy-browser-shell"
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      className="relative flex flex-col w-screen h-screen overflow-hidden bg-neutral-950 font-sans select-none"
      style={{
        borderColor: activeProfile.accentColor,
      }}
    >
      {/* Top Find in Page Bar if enabled */}
      {findInPageOpen && (
        <div className="z-40 bg-neutral-900 border-b border-neutral-800 px-4 py-2 flex items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2 flex-1 max-w-md">
            <Search className="w-4 h-4 text-neutral-400" />
            <input
              type="text"
              value={findQuery}
              onChange={(e) => setFindQuery(e.target.value)}
              placeholder="Find on page..."
              autoFocus
              className="w-full bg-neutral-800 px-3 py-1.5 rounded-xl border border-neutral-700 text-white focus:outline-none focus:border-pink-500"
            />
          </div>

          <div className="flex items-center gap-2">
            <span className="text-neutral-400 text-[11px]">
              {findQuery ? '3 matches' : '0/0'}
            </span>
            <button
              type="button"
              className="p-1 rounded hover:bg-neutral-800 text-neutral-400 hover:text-white"
            >
              <ChevronUp className="w-4 h-4" />
            </button>
            <button
              type="button"
              className="p-1 rounded hover:bg-neutral-800 text-neutral-400 hover:text-white"
            >
              <ChevronDown className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => setFindInPageOpen(false)}
              className="p-1 rounded hover:bg-neutral-800 text-neutral-400 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Browser Chrome (Address Bar & Controls) */}
      <BrowserChrome />

      {/* Main Viewport */}
      <BrowserViewport />

      {/* Overlay Sheets & Modals */}
      <TabOverview />
      <CandyTrailSheet />
      <PrivacyXRaySheet />
      <SiteCapsulesSheet />
      <ReaderStudio />
      <LinkPeekModal />
      <ProfilesModal />
      <SettingsSheet />
    </div>
  );
};
