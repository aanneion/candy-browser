import React, { useState, useEffect, useRef } from 'react';
import {
  ArrowLeft,
  ArrowRight,
  RotateCw,
  Shield,
  BookOpen,
  Sparkles,
  Search,
  Lock,
  Layers,
  MoreVertical,
  X,
  Compass,
  CornerDownLeft,
  Pin,
  VolumeX,
  Monitor,
  Clock,
  ExternalLink,
  Plus,
  Flame,
  Fingerprint,
  Database,
} from 'lucide-react';
import { useBrowser } from '../context/BrowserContext';
import { SEARCH_ENGINES } from '../data/initialData';

export const BrowserChrome: React.FC = () => {
  const {
    activeTab,
    tabs,
    activeProfile,
    privacyStats,
    goBack,
    goForward,
    reloadTab,
    navigateTab,
    resolveUrlOrSearch,
    setTabOverviewOpen,
    setPrivacyXRayOpen,
    setTrailSheetOpen,
    setCapsulesSheetOpen,
    setProfilesModalOpen,
    openSandboxManager,
    setSettingsOpen,
    setFindInPageOpen,
    openReaderMode,
    togglePinTab,
    toggleMuteTab,
    toggleDesktopMode,
    snoozeTab,
    settings,
    updateSettings,
    executeCommand,
    capsules,
  } = useBrowser();

  const [isEditing, setIsEditing] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [aiMode, setAiMode] = useState(settings.googleAiModeDefault);
  const [menuOpen, setMenuOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  // Sync input value with active tab
  useEffect(() => {
    if (!isEditing) {
      setInputValue(activeTab.url);
    }
  }, [activeTab.url, isEditing]);

  // Click outside to close menu
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleFocus = () => {
    setIsEditing(true);
    setInputValue(activeTab.url);
    setTimeout(() => {
      inputRef.current?.select();
    }, 50);
  };

  const handleBlur = () => {
    // Delay closing edit mode so clicking suggestions works
    setTimeout(() => {
      setIsEditing(false);
      setInputValue(activeTab.url);
    }, 200);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim()) return;
    const finalUrl = resolveUrlOrSearch(inputValue, aiMode);
    navigateTab(activeTab.id, finalUrl);
    setIsEditing(false);
  };

  const selectSuggestion = (url: string) => {
    navigateTab(activeTab.id, url);
    setIsEditing(false);
  };

  const selectCommand = (cmd: string) => {
    executeCommand(cmd);
    setIsEditing(false);
  };

  // Extract display title / hostname
  const displayHost = (() => {
    try {
      const u = new URL(activeTab.url);
      return u.hostname;
    } catch {
      return activeTab.url.replace(/^https?:\/\//, '').split('/')[0] || 'candy.web';
    }
  })();

  const canGoBack = activeTab.historyIndex > 0;
  const canGoForward = activeTab.historyIndex < activeTab.history.length - 1;

  const quickCommands = [
    { cmd: ':trail', label: 'Candy Trails Graph', icon: '🌿' },
    { cmd: ':xray', label: 'Privacy X-Ray Audit', icon: '🛡️' },
    { cmd: ':reader', label: 'Reader Studio', icon: '📖' },
    { cmd: ':capsule', label: 'Site Capsules', icon: '💊' },
    { cmd: ':snooze', label: 'Snooze Tab', icon: '⏳' },
    { cmd: ':desktop', label: 'Toggle Desktop View', icon: '🖥️' },
    { cmd: ':mute', label: 'Mute Domain Audio', icon: '🔇' },
    { cmd: ':clear', label: 'Clear Memory & Tabs', icon: '🧹' },
  ];

  return (
    <div
      id="browser-chrome"
      className={`relative z-40 w-full bg-neutral-900/90 backdrop-blur-xl border-neutral-800 transition-all duration-200 ${
        settings.addressBarPosition === 'bottom'
          ? 'border-t order-last pb-safe'
          : 'border-b order-first pt-safe'
      }`}
    >
      {/* Suggestions Drawer when editing address */}
      {isEditing && (
        <div
          id="address-suggestions-panel"
          className="absolute left-0 right-0 max-h-[70vh] overflow-y-auto bg-neutral-900/95 backdrop-blur-2xl border-neutral-800 shadow-2xl p-4 transition-all duration-200 divide-y divide-neutral-800/60 z-50 rounded-t-2xl"
          style={{
            [settings.addressBarPosition === 'bottom' ? 'bottom' : 'top']: '100%',
          }}
        >
          {/* AI Mode toggle inside omnibox */}
          <div className="pb-3 flex items-center justify-between">
            <button
              type="button"
              id="ai-mode-toggle"
              onClick={() => setAiMode(!aiMode)}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${
                aiMode
                  ? 'bg-gradient-to-r from-pink-500 to-purple-600 text-white shadow-lg shadow-pink-500/25 ring-2 ring-pink-400/50'
                  : 'bg-neutral-800 text-neutral-300 hover:bg-neutral-700'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>{aiMode ? 'Google AI Mode ON' : 'Enable AI Mode'}</span>
            </button>

            <span className="text-xs text-neutral-400">
              Search engine: <strong className="text-pink-400 capitalize">{settings.defaultSearchEngine}</strong>
            </span>
          </div>

          {/* Quick Candy Commands */}
          <div className="py-3">
            <div className="text-[11px] font-semibold tracking-wider uppercase text-neutral-400 mb-2">
              Candy Commands (Type : for commands)
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {quickCommands.map((c) => (
                <button
                  key={c.cmd}
                  type="button"
                  onMouseDown={(e) => {
                    e.preventDefault();
                    selectCommand(c.cmd);
                  }}
                  className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg bg-neutral-800/80 hover:bg-pink-950/40 hover:border-pink-500/40 border border-neutral-700/50 text-left transition-colors"
                >
                  <span className="text-base">{c.icon}</span>
                  <div className="truncate">
                    <span className="text-xs font-mono font-bold text-pink-400">{c.cmd}</span>
                    <p className="text-[10px] text-neutral-400 truncate">{c.label}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Site Capsules shortcuts */}
          {capsules.length > 0 && (
            <div className="py-3">
              <div className="text-[11px] font-semibold tracking-wider uppercase text-neutral-400 mb-2">
                Site Capsules
              </div>
              <div className="flex flex-wrap gap-2">
                {capsules.map((cap) => (
                  <button
                    key={cap.id}
                    type="button"
                    onMouseDown={(e) => {
                      e.preventDefault();
                      selectSuggestion(cap.url);
                    }}
                    className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-xs text-neutral-200 transition-colors border border-neutral-700/50"
                  >
                    <span
                      className="w-5 h-5 rounded-md flex items-center justify-center text-xs font-bold text-white shadow-sm"
                      style={{ backgroundColor: cap.color }}
                    >
                      {cap.icon}
                    </span>
                    <span className="font-medium">{cap.name}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Quick suggestions based on search */}
          <div className="pt-3">
            <div className="text-[11px] font-semibold tracking-wider uppercase text-neutral-400 mb-2">
              Suggestions & Web Navigation
            </div>
            <div className="space-y-1">
              <button
                type="button"
                onMouseDown={(e) => {
                  e.preventDefault();
                  selectSuggestion('https://news.ycombinator.com');
                }}
                className="w-full flex items-center justify-between p-2 rounded-xl hover:bg-neutral-800 text-left transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="w-7 h-7 rounded-lg bg-orange-500/20 text-orange-400 flex items-center justify-center font-bold text-xs">
                    Y
                  </div>
                  <div>
                    <div className="text-sm font-medium text-neutral-200">Hacker News</div>
                    <div className="text-xs text-neutral-400">news.ycombinator.com</div>
                  </div>
                </div>
                <CornerDownLeft className="w-4 h-4 text-neutral-500" />
              </button>

              <button
                type="button"
                onMouseDown={(e) => {
                  e.preventDefault();
                  selectSuggestion('https://candy.browser/trails');
                }}
                className="w-full flex items-center justify-between p-2 rounded-xl hover:bg-neutral-800 text-left transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="w-7 h-7 rounded-lg bg-pink-500/20 text-pink-400 flex items-center justify-center font-bold text-xs">
                    🍬
                  </div>
                  <div>
                    <div className="text-sm font-medium text-neutral-200">Candy Trails Visual Explorer</div>
                    <div className="text-xs text-neutral-400">candy.browser/trails</div>
                  </div>
                </div>
                <CornerDownLeft className="w-4 h-4 text-neutral-500" />
              </button>

              <button
                type="button"
                onMouseDown={(e) => {
                  e.preventDefault();
                  selectSuggestion('https://en.wikipedia.org/wiki/Web_browser');
                }}
                className="w-full flex items-center justify-between p-2 rounded-xl hover:bg-neutral-800 text-left transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="w-7 h-7 rounded-lg bg-blue-500/20 text-blue-400 flex items-center justify-center font-bold text-xs">
                    W
                  </div>
                  <div>
                    <div className="text-sm font-medium text-neutral-200">Web browser - Wikipedia</div>
                    <div className="text-xs text-neutral-400">en.wikipedia.org</div>
                  </div>
                </div>
                <CornerDownLeft className="w-4 h-4 text-neutral-500" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Omnibox Control Bar */}
      <div className="max-w-7xl mx-auto px-2 sm:px-4 py-2 flex items-center gap-2">
        {/* Navigation buttons: Back / Forward */}
        <div className="flex items-center gap-1">
          <button
            type="button"
            id="nav-back-button"
            onClick={() => goBack()}
            disabled={!canGoBack}
            title="Back"
            className="p-2 rounded-full text-neutral-300 hover:text-white hover:bg-neutral-800 disabled:opacity-30 disabled:hover:bg-transparent transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <button
            type="button"
            id="nav-forward-button"
            onClick={() => goForward()}
            disabled={!canGoForward}
            title="Forward"
            className="p-2 rounded-full text-neutral-300 hover:text-white hover:bg-neutral-800 disabled:opacity-30 disabled:hover:bg-transparent transition-colors hidden sm:block"
          >
            <ArrowRight className="w-4 h-4" />
          </button>
          <button
            type="button"
            id="nav-reload-button"
            onClick={() => reloadTab()}
            title="Reload"
            className="p-2 rounded-full text-neutral-300 hover:text-white hover:bg-neutral-800 transition-colors"
          >
            <RotateCw className="w-4 h-4" />
          </button>
        </div>

        {/* Omnibox URL / Search input pill */}
        <form onSubmit={handleSubmit} className="flex-1 min-w-0">
          <div
            className={`flex items-center gap-2 px-3 py-1.5 rounded-full border transition-all ${
              isEditing
                ? 'bg-neutral-800 border-pink-500 ring-2 ring-pink-500/30'
                : 'bg-neutral-800/80 hover:bg-neutral-800 border-neutral-700/60'
            }`}
          >
            {/* Padlock / Shield indicator */}
            <button
              type="button"
              id="privacy-shield-quick-button"
              onClick={(e) => {
                e.stopPropagation();
                setPrivacyXRayOpen(true);
              }}
              title="Privacy X-Ray Shield"
              className="flex items-center gap-1 text-emerald-400 hover:text-emerald-300 transition-colors"
            >
              <Lock className="w-3.5 h-3.5" />
              {privacyStats.adsBlocked + privacyStats.trackersBlocked > 0 && (
                <span className="text-[10px] font-bold px-1 rounded-full bg-emerald-500/20 text-emerald-400">
                  {privacyStats.adsBlocked + privacyStats.trackersBlocked}
                </span>
              )}
            </button>

            {/* URL / Search Input */}
            <input
              ref={inputRef}
              id="omnibox-input"
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onFocus={handleFocus}
              onBlur={handleBlur}
              placeholder="Search or enter URL, : for commands"
              className="flex-1 bg-transparent text-sm text-neutral-100 placeholder-neutral-500 focus:outline-none truncate"
            />

            {/* Right omnibox status badges */}
            {!isEditing && (
              <div className="flex items-center gap-1.5 shrink-0">
                {activeTab.isPinned && (
                  <span title="Pinned Tab">
                    <Pin className="w-3.5 h-3.5 text-pink-400 fill-pink-400" />
                  </span>
                )}
                {activeTab.isMuted && (
                  <span title="Domain Muted">
                    <VolumeX className="w-3.5 h-3.5 text-amber-400" />
                  </span>
                )}
                {activeTab.isDesktop && (
                  <span title="Desktop View">
                    <Monitor className="w-3.5 h-3.5 text-blue-400" />
                  </span>
                )}
                {activeProfile.isPrivate && (
                  <span className="text-xs px-2 py-0.5 rounded-full bg-pink-500/20 text-pink-400 font-bold">
                    Private
                  </span>
                )}
              </div>
            )}

            {isEditing && (
              <button
                type="button"
                onClick={() => setInputValue('')}
                className="p-1 rounded-full text-neutral-400 hover:text-white"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </form>

        {/* Action icons */}
        <div className="flex items-center gap-1 shrink-0">
          {/* Reader Studio toggle */}
          <button
            type="button"
            id="reader-studio-toggle-btn"
            onClick={() => openReaderMode()}
            title="Open Reader Studio"
            className="p-2 rounded-full text-neutral-300 hover:text-white hover:bg-neutral-800 transition-colors"
          >
            <BookOpen className="w-4 h-4" />
          </button>

          {/* Candy Trails visual journey toggle */}
          <button
            type="button"
            id="candy-trails-toggle-btn"
            onClick={() => setTrailSheetOpen(true)}
            title="Candy Trails Journey Graph"
            className="p-2 rounded-full text-pink-400 hover:text-pink-300 hover:bg-pink-950/30 transition-colors relative"
          >
            <Compass className="w-4 h-4" />
            <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-pink-500 animate-pulse" />
          </button>

          {/* Tab Overview button with counter badge */}
          <button
            type="button"
            id="tabs-counter-button"
            onClick={() => setTabOverviewOpen(true)}
            title="Open Tab Overview"
            className="flex items-center justify-center min-w-[32px] h-8 px-2 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-200 font-bold text-xs border border-neutral-700 transition-colors"
          >
            <Layers className="w-3.5 h-3.5 mr-1 text-pink-400" />
            <span>{tabs.length}</span>
          </button>

          {/* Profile Switcher pill */}
          <button
            type="button"
            id="profile-badge-btn"
            onClick={() => setProfilesModalOpen(true)}
            title={`Active Profile: ${activeProfile.name}`}
            className="w-8 h-8 rounded-xl flex items-center justify-center border text-sm font-semibold hover:opacity-90 transition-opacity"
            style={{
              borderColor: activeProfile.accentColor,
              backgroundColor: activeProfile.accentColor + '20',
            }}
          >
            <span>{activeProfile.icon}</span>
          </button>

          {/* More options menu */}
          <div className="relative" ref={menuRef}>
            <button
              type="button"
              id="more-options-menu-btn"
              onClick={() => setMenuOpen(!menuOpen)}
              title="More Options"
              className="p-2 rounded-full text-neutral-300 hover:text-white hover:bg-neutral-800 transition-colors"
            >
              <MoreVertical className="w-4 h-4" />
            </button>

            {menuOpen && (
              <div
                id="browser-main-dropdown-menu"
                className="absolute right-0 bottom-full mb-2 w-56 rounded-2xl bg-neutral-900/95 backdrop-blur-2xl border border-neutral-800 shadow-2xl py-2 z-50 divide-y divide-neutral-800/80"
              >
                <div className="py-1 px-1">
                  <button
                    type="button"
                    onClick={() => {
                      setPrivacyXRayOpen(true);
                      setMenuOpen(false);
                    }}
                    className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-medium text-neutral-200 hover:bg-neutral-800 hover:text-pink-400 transition-colors"
                  >
                    <Shield className="w-4 h-4 text-emerald-400" />
                    <span>Privacy X-Ray</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setTrailSheetOpen(true);
                      setMenuOpen(false);
                    }}
                    className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-medium text-neutral-200 hover:bg-neutral-800 hover:text-pink-400 transition-colors"
                  >
                    <Compass className="w-4 h-4 text-pink-400" />
                    <span>Candy Trails Graph</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setCapsulesSheetOpen(true);
                      setMenuOpen(false);
                    }}
                    className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-medium text-neutral-200 hover:bg-neutral-800 hover:text-pink-400 transition-colors"
                  >
                    <Flame className="w-4 h-4 text-amber-400" />
                    <span>Site Capsules</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      openSandboxManager('fingerprint');
                      setMenuOpen(false);
                    }}
                    className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-medium text-neutral-200 hover:bg-neutral-800 hover:text-pink-400 transition-colors"
                  >
                    <Fingerprint className="w-4 h-4 text-pink-400" />
                    <span>Hardware Spoofing</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      openSandboxManager('storage');
                      setMenuOpen(false);
                    }}
                    className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-medium text-neutral-200 hover:bg-neutral-800 hover:text-blue-400 transition-colors"
                  >
                    <Database className="w-4 h-4 text-blue-400" />
                    <span>Isolated Storage</span>
                  </button>
                </div>

                <div className="py-1 px-1">
                  <button
                    type="button"
                    onClick={() => {
                      togglePinTab(activeTab.id);
                      setMenuOpen(false);
                    }}
                    className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-medium text-neutral-200 hover:bg-neutral-800 transition-colors"
                  >
                    <Pin className={`w-4 h-4 ${activeTab.isPinned ? 'text-pink-400 fill-pink-400' : 'text-neutral-400'}`} />
                    <span>{activeTab.isPinned ? 'Unpin Tab' : 'Pin Tab'}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      toggleDesktopMode(activeTab.id);
                      setMenuOpen(false);
                    }}
                    className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-medium text-neutral-200 hover:bg-neutral-800 transition-colors"
                  >
                    <Monitor className="w-4 h-4 text-neutral-400" />
                    <span>{activeTab.isDesktop ? 'Mobile View' : 'Desktop View'}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      toggleMuteTab(activeTab.id);
                      setMenuOpen(false);
                    }}
                    className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-medium text-neutral-200 hover:bg-neutral-800 transition-colors"
                  >
                    <VolumeX className="w-4 h-4 text-neutral-400" />
                    <span>{activeTab.isMuted ? 'Unmute Domain' : 'Mute Domain'}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      snoozeTab(activeTab.id, 3, 'Later Today');
                      setMenuOpen(false);
                    }}
                    className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-medium text-neutral-200 hover:bg-neutral-800 transition-colors"
                  >
                    <Clock className="w-4 h-4 text-neutral-400" />
                    <span>Snooze Tab (3h)</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setFindInPageOpen(true);
                      setMenuOpen(false);
                    }}
                    className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-medium text-neutral-200 hover:bg-neutral-800 transition-colors"
                  >
                    <Search className="w-4 h-4 text-neutral-400" />
                    <span>Find in Page</span>
                  </button>
                </div>

                <div className="py-1 px-1">
                  <button
                    type="button"
                    onClick={() => {
                      setSettingsOpen(true);
                      setMenuOpen(false);
                    }}
                    className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-medium text-neutral-200 hover:bg-neutral-800 transition-colors"
                  >
                    <span>⚙️</span>
                    <span>Candy Settings</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
