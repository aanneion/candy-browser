import React, { useState } from 'react';
import {
  X,
  Settings,
  Search,
  Shield,
  Layout,
  Download,
  Upload,
  CheckCircle2,
  Sparkles,
  Smartphone,
  Trash2,
} from 'lucide-react';
import { useBrowser } from '../context/BrowserContext';
import { SEARCH_ENGINES } from '../data/initialData';

export const SettingsSheet: React.FC = () => {
  const {
    settings,
    updateSettings,
    settingsOpen,
    setSettingsOpen,
    exportArchive,
    importArchive,
    closeAllTabs,
    clearTrail,
  } = useBrowser();

  const [importStatus, setImportStatus] = useState<string | null>(null);
  const [copiedExport, setCopiedExport] = useState(false);

  if (!settingsOpen) return null;

  const handleExport = () => {
    const jsonStr = exportArchive();
    navigator.clipboard.writeText(jsonStr);
    setCopiedExport(true);
    setTimeout(() => setCopiedExport(false), 2000);
  };

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      const success = importArchive(content);
      if (success) {
        setImportStatus('Archive successfully imported!');
      } else {
        setImportStatus('Failed to parse archive JSON.');
      }
      setTimeout(() => setImportStatus(null), 3000);
    };
    reader.readAsText(file);
  };

  return (
    <div
      id="settings-sheet-overlay"
      className="fixed inset-0 z-50 bg-neutral-950/95 backdrop-blur-2xl flex flex-col text-neutral-100 overflow-hidden animate-in fade-in duration-200"
    >
      {/* Header */}
      <div className="border-b border-neutral-800 px-4 sm:px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setSettingsOpen(false)}
            className="p-2 rounded-full hover:bg-neutral-800 text-neutral-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-pink-500/20 text-pink-400">
              <Settings className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">Candy Browser Settings</h2>
              <p className="text-xs text-neutral-400">
                Configure navigation, privacy defenses, gesture controls, and backup
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Settings List */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 max-w-3xl mx-auto w-full space-y-6">
        {/* 1. Search & Omnibox */}
        <div className="p-5 rounded-3xl bg-neutral-900 border border-neutral-800 space-y-4">
          <div className="flex items-center gap-2 text-pink-400 font-bold text-xs uppercase tracking-wider">
            <Search className="w-4 h-4" />
            <span>Search & Intelligence</span>
          </div>

          <div className="space-y-3 text-xs">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-semibold text-white text-sm">Default Search Engine</h4>
                <p className="text-neutral-400">Used when typing keywords into the omnibox</p>
              </div>
              <select
                value={settings.defaultSearchEngine}
                onChange={(e) => updateSettings({ defaultSearchEngine: e.target.value })}
                className="px-3 py-1.5 rounded-xl bg-neutral-800 border border-neutral-700 text-white font-medium"
              >
                {SEARCH_ENGINES.map((engine: { id: string; name: string }) => (
                  <option key={engine.id} value={engine.id}>
                    {engine.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-neutral-800">
              <div>
                <h4 className="font-semibold text-white text-sm flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-pink-400" />
                  <span>Google AI Mode Default</span>
                </h4>
                <p className="text-neutral-400">
                  Automatically synthesize verified multi-source AI answers
                </p>
              </div>
              <input
                type="checkbox"
                checked={settings.googleAiModeDefault}
                onChange={(e) => updateSettings({ googleAiModeDefault: e.target.checked })}
                className="rounded text-pink-500 focus:ring-pink-500 w-4 h-4"
              />
            </div>
          </div>
        </div>

        {/* 2. Layout & Address Bar */}
        <div className="p-5 rounded-3xl bg-neutral-900 border border-neutral-800 space-y-4">
          <div className="flex items-center gap-2 text-pink-400 font-bold text-xs uppercase tracking-wider">
            <Smartphone className="w-4 h-4" />
            <span>Layout & Ergonomics</span>
          </div>

          <div className="space-y-3 text-xs">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-semibold text-white text-sm">Address Bar Placement</h4>
                <p className="text-neutral-400">
                  Bottom position optimizes for single-hand mobile and thumb reach
                </p>
              </div>
              <div className="flex gap-1 bg-neutral-800 p-1 rounded-xl">
                <button
                  type="button"
                  onClick={() => updateSettings({ addressBarPosition: 'top' })}
                  className={`px-3 py-1 rounded-lg font-semibold ${
                    settings.addressBarPosition === 'top' ? 'bg-pink-500 text-white' : 'text-neutral-400'
                  }`}
                >
                  Top
                </button>
                <button
                  type="button"
                  onClick={() => updateSettings({ addressBarPosition: 'bottom' })}
                  className={`px-3 py-1 rounded-lg font-semibold ${
                    settings.addressBarPosition === 'bottom' ? 'bg-pink-500 text-white' : 'text-neutral-400'
                  }`}
                >
                  Bottom
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-neutral-800">
              <div>
                <h4 className="font-semibold text-white text-sm">Gesture-First Navigation</h4>
                <p className="text-neutral-400">
                  Horizontal edge swipes switch tabs with native fluidity
                </p>
              </div>
              <input
                type="checkbox"
                checked={settings.gestureNavigation}
                onChange={(e) => updateSettings({ gestureNavigation: e.target.checked })}
                className="rounded text-pink-500 focus:ring-pink-500 w-4 h-4"
              />
            </div>
          </div>
        </div>

        {/* 3. Privacy Defenses */}
        <div className="p-5 rounded-3xl bg-neutral-900 border border-neutral-800 space-y-4">
          <div className="flex items-center gap-2 text-emerald-400 font-bold text-xs uppercase tracking-wider">
            <Shield className="w-4 h-4" />
            <span>Privacy Defenses</span>
          </div>

          <div className="space-y-3 text-xs">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-semibold text-white text-sm">Block Third-Party Trackers & Cookies</h4>
                <p className="text-neutral-400">Prevents cross-site behavioral profiling</p>
              </div>
              <input
                type="checkbox"
                checked={settings.blockThirdPartyCookies}
                onChange={(e) => updateSettings({ blockThirdPartyCookies: e.target.checked })}
                className="rounded text-emerald-500 focus:ring-emerald-500 w-4 h-4"
              />
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-neutral-800">
              <div>
                <h4 className="font-semibold text-white text-sm">Automatic HTTPS Upgrade</h4>
                <p className="text-neutral-400">Upgrades insecure connections to TLS encryption</p>
              </div>
              <input
                type="checkbox"
                checked={settings.httpsOnlyMode}
                onChange={(e) => updateSettings({ httpsOnlyMode: e.target.checked })}
                className="rounded text-emerald-500 focus:ring-emerald-500 w-4 h-4"
              />
            </div>

            <div className="pt-2 border-t border-neutral-800 flex items-center justify-between">
              <div>
                <h4 className="font-semibold text-white text-sm">Flush Browsing Session</h4>
                <p className="text-neutral-400">Close all open tabs and clear the Candy Trail graph</p>
              </div>
              <button
                type="button"
                onClick={() => {
                  closeAllTabs(false);
                  clearTrail();
                  setSettingsOpen(false);
                }}
                className="px-3 py-1.5 rounded-xl bg-rose-500/20 text-rose-300 hover:bg-rose-500/30 text-xs font-semibold"
              >
                Clear Now
              </button>
            </div>
          </div>
        </div>

        {/* 4. Backup, Export & Import */}
        <div className="p-5 rounded-3xl bg-neutral-900 border border-neutral-800 space-y-4">
          <div className="flex items-center gap-2 text-blue-400 font-bold text-xs uppercase tracking-wider">
            <Download className="w-4 h-4" />
            <span>Data Archive & Sync</span>
          </div>

          <p className="text-xs text-neutral-400">
            Export all your Candy Stacks, Custom Rules, Site Capsules, and Preferences to a JSON archive.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <button
              type="button"
              onClick={handleExport}
              className="flex-1 py-2.5 px-4 rounded-xl bg-neutral-800 hover:bg-neutral-750 border border-neutral-700 text-xs font-semibold text-neutral-200 flex items-center justify-center gap-2 transition-colors"
            >
              <Download className="w-4 h-4" />
              <span>{copiedExport ? 'Copied JSON to Clipboard!' : 'Export App Archive'}</span>
            </button>

            <label className="flex-1 py-2.5 px-4 rounded-xl bg-neutral-800 hover:bg-neutral-750 border border-neutral-700 text-xs font-semibold text-neutral-200 flex items-center justify-center gap-2 cursor-pointer transition-colors">
              <Upload className="w-4 h-4" />
              <span>Import Archive JSON</span>
              <input type="file" accept=".json" onChange={handleImport} className="hidden" />
            </label>
          </div>

          {importStatus && (
            <div className="p-2.5 rounded-xl bg-emerald-500/20 text-emerald-300 text-xs font-medium flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>{importStatus}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
