import React, { useState } from 'react';
import {
  X,
  Flame,
  Plus,
  Trash2,
  ExternalLink,
  Monitor,
  Shield,
  Palette,
  Globe,
} from 'lucide-react';
import { useBrowser } from '../context/BrowserContext';
import { SiteCapsule } from '../types';

export const SiteCapsulesSheet: React.FC = () => {
  const {
    capsules,
    createCapsule,
    deleteCapsule,
    launchCapsule,
    capsulesSheetOpen,
    setCapsulesSheetOpen,
    activeTab,
  } = useBrowser();

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [name, setName] = useState('');
  const [url, setUrl] = useState(activeTab.url || 'https://');
  const [icon, setIcon] = useState('🍬');
  const [color, setColor] = useState('#FF2F78');
  const [desktopMode, setDesktopMode] = useState(false);

  if (!capsulesSheetOpen) return null;

  const colorOptions = ['#FF2F78', '#FF6B00', '#00C853', '#0091EA', '#AA00FF', '#FFD600'];
  const iconOptions = ['🍬', '🐙', '⚡', '📰', '📚', '🚀', '🎨', '💼'];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !url.trim()) return;
    createCapsule(name.trim(), url.trim(), icon, color, desktopMode);
    setName('');
    setShowCreateModal(false);
  };

  return (
    <div
      id="site-capsules-sheet-overlay"
      className="fixed inset-0 z-50 bg-neutral-950/95 backdrop-blur-2xl flex flex-col text-neutral-100 overflow-hidden animate-in fade-in duration-200"
    >
      {/* Header */}
      <div className="border-b border-neutral-800 px-4 sm:px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setCapsulesSheetOpen(false)}
            className="p-2 rounded-full hover:bg-neutral-800 text-neutral-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-pink-500/20 text-pink-400">
              <Flame className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <span>Site Capsules</span>
                <span className="px-2 py-0.5 rounded-full bg-pink-500/20 text-pink-400 text-xs font-semibold">
                  {capsules.length}
                </span>
              </h2>
              <p className="text-xs text-neutral-400">
                Isolated custom web app shortcuts with tailored privacy and layout rules
              </p>
            </div>
          </div>
        </div>

        <button
          type="button"
          onClick={() => {
            setUrl(activeTab.url);
            setShowCreateModal(true);
          }}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-pink-500 hover:bg-pink-600 text-white text-xs font-bold shadow-lg shadow-pink-500/25 transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>New Capsule</span>
        </button>
      </div>

      {/* Main Grid */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 max-w-5xl mx-auto w-full">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {capsules.map((capsule) => (
            <div
              key={capsule.id}
              onClick={() => launchCapsule(capsule)}
              className="group relative p-5 rounded-2xl bg-neutral-900 hover:bg-neutral-850 border border-neutral-800 hover:border-pink-500/40 cursor-pointer transition-all shadow-lg flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span
                    className="w-10 h-10 rounded-2xl flex items-center justify-center text-xl shadow-md"
                    style={{ backgroundColor: capsule.color }}
                  >
                    {capsule.icon}
                  </span>
                  <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
                    <button
                      type="button"
                      onClick={() => deleteCapsule(capsule.id)}
                      className="p-1.5 rounded-lg text-neutral-400 hover:text-rose-400 hover:bg-neutral-800 transition-colors"
                      title="Delete Capsule"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <h3 className="font-bold text-base text-white group-hover:text-pink-300 transition-colors">
                  {capsule.name}
                </h3>
                <p className="text-xs text-neutral-400 truncate mt-0.5">{capsule.url}</p>
              </div>

              <div className="pt-4 mt-3 border-t border-neutral-800/80 flex items-center justify-between text-xs text-neutral-400">
                <div className="flex items-center gap-2">
                  {capsule.desktopMode && (
                    <span className="flex items-center gap-1 text-[11px] text-blue-400">
                      <Monitor className="w-3 h-3" />
                      Desktop
                    </span>
                  )}
                  {capsule.adblockEnabled && (
                    <span className="flex items-center gap-1 text-[11px] text-emerald-400">
                      <Shield className="w-3 h-3" />
                      Shielded
                    </span>
                  )}
                </div>

                <span className="flex items-center gap-1 text-pink-400 font-semibold group-hover:underline">
                  <span>Launch</span>
                  <ExternalLink className="w-3 h-3" />
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Create Capsule Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-60 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <form
            onSubmit={handleSubmit}
            className="w-full max-w-md rounded-2xl bg-neutral-900 border border-neutral-800 p-6 space-y-4 text-xs"
          >
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Flame className="w-5 h-5 text-pink-400" />
              <span>Create Site Capsule</span>
            </h3>

            <div className="space-y-1">
              <label className="font-semibold text-neutral-300">Capsule Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Hacker News, GitHub, Wikipedia"
                required
                className="w-full px-3 py-2 rounded-xl bg-neutral-800 border border-neutral-700 text-sm text-white focus:outline-none focus:border-pink-500"
              />
            </div>

            <div className="space-y-1">
              <label className="font-semibold text-neutral-300">Target Web URL</label>
              <input
                type="text"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="https://..."
                required
                className="w-full px-3 py-2 rounded-xl bg-neutral-800 border border-neutral-700 text-sm text-white focus:outline-none focus:border-pink-500 font-mono"
              />
            </div>

            {/* Icon Picker */}
            <div className="space-y-1">
              <label className="font-semibold text-neutral-300">Icon Emblem</label>
              <div className="flex gap-2">
                {iconOptions.map((ic) => (
                  <button
                    key={ic}
                    type="button"
                    onClick={() => setIcon(ic)}
                    className={`w-9 h-9 rounded-xl flex items-center justify-center text-lg ${
                      icon === ic ? 'bg-pink-500/30 border border-pink-500' : 'bg-neutral-800'
                    }`}
                  >
                    {ic}
                  </button>
                ))}
              </div>
            </div>

            {/* Color Picker */}
            <div className="space-y-1">
              <label className="font-semibold text-neutral-300">Accent Theme Color</label>
              <div className="flex gap-2">
                {colorOptions.map((c) => (
                  <button
                    key={c}
                    type="button"
                    onClick={() => setColor(c)}
                    className={`w-8 h-8 rounded-full transition-transform ${
                      color === c ? 'ring-2 ring-white ring-offset-2 ring-offset-neutral-900 scale-110' : ''
                    }`}
                    style={{ backgroundColor: c }}
                  />
                ))}
              </div>
            </div>

            {/* Desktop Mode Toggle */}
            <label className="flex items-center gap-2 cursor-pointer pt-1">
              <input
                type="checkbox"
                checked={desktopMode}
                onChange={(e) => setDesktopMode(e.target.checked)}
                className="rounded text-pink-500 focus:ring-pink-500"
              />
              <span className="text-neutral-300 font-medium">Default to Desktop Viewport</span>
            </label>

            <div className="flex justify-end gap-2 pt-3 border-t border-neutral-800">
              <button
                type="button"
                onClick={() => setShowCreateModal(false)}
                className="px-4 py-2 rounded-xl text-neutral-400 hover:text-white"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 rounded-xl bg-pink-500 hover:bg-pink-600 text-white font-bold shadow-lg shadow-pink-500/25"
              >
                Create Capsule
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
