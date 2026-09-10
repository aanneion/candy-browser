import React, { useState } from 'react';
import {
  X,
  Plus,
  Pin,
  PinOff,
  VolumeX,
  Volume2,
  Copy,
  Clock,
  Layers,
  LayoutGrid,
  List,
  FolderPlus,
  Trash2,
  Lock,
  ChevronDown,
  ChevronRight,
  Sparkles,
  ExternalLink,
} from 'lucide-react';
import { useBrowser } from '../context/BrowserContext';
import { BrowserTab, StackColor } from '../types';

export const TabOverview: React.FC = () => {
  const {
    tabs,
    activeTabId,
    switchTab,
    closeTab,
    closeAllTabs,
    openTab,
    duplicateTab,
    togglePinTab,
    toggleMuteTab,
    snoozeTab,
    stacks,
    createStack,
    deleteStack,
    addTabToStack,
    removeTabFromStack,
    toggleStackCollapse,
    snoozedTabs,
    wakeSnoozedTab,
    deleteSnoozedTab,
    tabOverviewOpen,
    setTabOverviewOpen,
    activeProfile,
    settings,
    updateSettings,
  } = useBrowser();

  const [activeViewMode, setActiveViewMode] = useState<'grid' | 'list' | 'stack'>(settings.overviewMode || 'grid');
  const [newStackName, setNewStackName] = useState('');
  const [newStackColor, setNewStackColor] = useState<StackColor>('grape');
  const [showCreateStackModal, setShowCreateStackModal] = useState(false);
  const [snoozeModalTabId, setSnoozeModalTabId] = useState<string | null>(null);

  if (!tabOverviewOpen) return null;

  const stackColorMap: Record<StackColor, { bg: string; text: string; border: string }> = {
    grape: { bg: 'bg-purple-950/40', text: 'text-purple-400', border: 'border-purple-500/40' },
    cherry: { bg: 'bg-rose-950/40', text: 'text-rose-400', border: 'border-rose-500/40' },
    lime: { bg: 'bg-lime-950/40', text: 'text-lime-400', border: 'border-lime-500/40' },
    blueberry: { bg: 'bg-blue-950/40', text: 'text-blue-400', border: 'border-blue-500/40' },
    candy: { bg: 'bg-pink-950/40', text: 'text-pink-400', border: 'border-pink-500/40' },
  };

  const handleCreateStackSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newStackName.trim()) return;
    createStack(newStackName.trim(), newStackColor);
    setNewStackName('');
    setShowCreateStackModal(false);
  };

  const executeSnooze = (hours: number, label: string) => {
    if (!snoozeModalTabId) return;
    snoozeTab(snoozeModalTabId, hours, label);
    setSnoozeModalTabId(null);
  };

  return (
    <div
      id="tab-overview-overlay"
      className="fixed inset-0 z-50 bg-neutral-950/95 backdrop-blur-2xl flex flex-col text-neutral-100 overflow-hidden animate-in fade-in duration-200"
    >
      {/* Top Header Controls */}
      <div className="border-b border-neutral-800 px-4 sm:px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setTabOverviewOpen(false)}
            className="p-2 rounded-full hover:bg-neutral-800 text-neutral-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
          <div>
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <span>Tabs & Stacks</span>
              <span className="px-2 py-0.5 rounded-full bg-pink-500/20 text-pink-400 text-xs font-semibold">
                {tabs.length}
              </span>
            </h2>
            <p className="text-xs text-neutral-400">
              Profile: <span className="text-neutral-200">{activeProfile.name}</span>
            </p>
          </div>
        </div>

        {/* View Mode Switcher and Quick Actions */}
        <div className="flex items-center gap-2">
          <div className="flex items-center bg-neutral-900 border border-neutral-800 rounded-xl p-0.5 text-xs">
            <button
              type="button"
              onClick={() => {
                setActiveViewMode('grid');
                updateSettings({ overviewMode: 'grid' });
              }}
              title="Grid View"
              className={`p-1.5 rounded-lg transition-colors ${
                activeViewMode === 'grid' ? 'bg-neutral-800 text-pink-400 font-bold' : 'text-neutral-400 hover:text-white'
              }`}
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => {
                setActiveViewMode('list');
                updateSettings({ overviewMode: 'list' });
              }}
              title="List View"
              className={`p-1.5 rounded-lg transition-colors ${
                activeViewMode === 'list' ? 'bg-neutral-800 text-pink-400 font-bold' : 'text-neutral-400 hover:text-white'
              }`}
            >
              <List className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => {
                setActiveViewMode('stack');
                updateSettings({ overviewMode: 'stack' });
              }}
              title="Candy Stacks View"
              className={`p-1.5 rounded-lg transition-colors ${
                activeViewMode === 'stack' ? 'bg-neutral-800 text-pink-400 font-bold' : 'text-neutral-400 hover:text-white'
              }`}
            >
              <Layers className="w-4 h-4" />
            </button>
          </div>

          <button
            type="button"
            onClick={() => closeAllTabs(true)}
            className="text-xs px-3 py-1.5 rounded-xl bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 text-neutral-300 hover:text-rose-400 transition-colors hidden sm:block"
          >
            Close Unpinned
          </button>

          <button
            type="button"
            onClick={() => openTab('https://news.ycombinator.com')}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-pink-500 hover:bg-pink-600 text-white text-xs font-semibold shadow-lg shadow-pink-500/25 transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>New Tab</span>
          </button>
        </div>
      </div>

      {/* Main Tab Overview Body */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
        {/* Snoozed Tabs Drawer if any */}
        {snoozedTabs.length > 0 && (
          <div className="p-4 rounded-2xl bg-neutral-900/80 border border-neutral-800">
            <div className="flex items-center justify-between mb-3 text-xs font-semibold text-neutral-400 uppercase tracking-wider">
              <span className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-amber-400" />
                Snoozed Tabs ({snoozedTabs.length})
              </span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
              {snoozedTabs.map((st) => (
                <div
                  key={st.id}
                  className="flex items-center justify-between p-2.5 rounded-xl bg-neutral-850 border border-neutral-700/60 text-xs"
                >
                  <div className="truncate mr-2">
                    <p className="font-semibold text-neutral-200 truncate">{st.title}</p>
                    <p className="text-[10px] text-amber-400">{st.snoozeLabel}</p>
                  </div>
                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => wakeSnoozedTab(st.id)}
                      className="px-2 py-1 rounded-lg bg-pink-500/20 text-pink-300 hover:bg-pink-500/30 text-[11px] font-semibold"
                    >
                      Wake
                    </button>
                    <button
                      type="button"
                      onClick={() => deleteSnoozedTab(st.id)}
                      className="p-1 rounded-lg hover:bg-neutral-800 text-neutral-400 hover:text-rose-400"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 1. Grid Mode */}
        {activeViewMode === 'grid' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {tabs.map((tab) => {
              const isActive = tab.id === activeTabId;
              const stack = stacks.find((s) => s.id === tab.stackId);

              return (
                <div
                  key={tab.id}
                  onClick={() => switchTab(tab.id)}
                  className={`group relative flex flex-col justify-between h-48 p-4 rounded-2xl cursor-pointer transition-all duration-200 border ${
                    isActive
                      ? 'bg-neutral-850 border-pink-500 ring-2 ring-pink-500/40 shadow-xl shadow-pink-500/10'
                      : 'bg-neutral-900/90 hover:bg-neutral-850 border-neutral-800 hover:border-neutral-700'
                  }`}
                >
                  {/* Top Bar inside Tab Card */}
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2 min-w-0">
                      <span className="w-5 h-5 rounded-md flex items-center justify-center text-xs bg-neutral-800">
                        {tab.favicon}
                      </span>
                      <span className="text-xs font-semibold text-neutral-200 truncate">
                        {tab.title}
                      </span>
                    </div>

                    <div className="flex items-center gap-1 shrink-0" onClick={(e) => e.stopPropagation()}>
                      {tab.isPinned && (
                        <Pin className="w-3.5 h-3.5 text-pink-400 fill-pink-400" />
                      )}
                      <button
                        type="button"
                        onClick={() => closeTab(tab.id)}
                        className="p-1 rounded-lg text-neutral-400 hover:text-white hover:bg-neutral-700 transition-colors"
                        title="Close Tab"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Card Body Preview Snippet */}
                  <div className="my-auto py-2 text-xs text-neutral-400 line-clamp-3 leading-relaxed">
                    {tab.previewSnippet || tab.url}
                  </div>

                  {/* Bottom Bar inside Tab Card */}
                  <div className="pt-2 border-t border-neutral-800/80 flex items-center justify-between text-[11px] text-neutral-500">
                    <div className="flex items-center gap-1.5 truncate">
                      {stack && (
                        <span
                          className={`px-1.5 py-0.5 rounded-md font-semibold text-[10px] border ${
                            stackColorMap[stack.color]?.text
                          } ${stackColorMap[stack.color]?.border}`}
                        >
                          {stack.name}
                        </span>
                      )}
                      <span className="truncate">{tab.url.replace(/^https?:\/\//, '')}</span>
                    </div>

                    <div
                      className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <button
                        type="button"
                        onClick={() => togglePinTab(tab.id)}
                        title={tab.isPinned ? 'Unpin' : 'Pin'}
                        className="p-1 rounded hover:bg-neutral-700 text-neutral-400 hover:text-white"
                      >
                        {tab.isPinned ? <PinOff className="w-3.5 h-3.5" /> : <Pin className="w-3.5 h-3.5" />}
                      </button>
                      <button
                        type="button"
                        onClick={() => duplicateTab(tab.id)}
                        title="Duplicate"
                        className="p-1 rounded hover:bg-neutral-700 text-neutral-400 hover:text-white"
                      >
                        <Copy className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => setSnoozeModalTabId(tab.id)}
                        title="Snooze"
                        className="p-1 rounded hover:bg-neutral-700 text-neutral-400 hover:text-white"
                      >
                        <Clock className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* 2. List Mode */}
        {activeViewMode === 'list' && (
          <div className="space-y-2 max-w-3xl mx-auto">
            {tabs.map((tab) => {
              const isActive = tab.id === activeTabId;
              const stack = stacks.find((s) => s.id === tab.stackId);

              return (
                <div
                  key={tab.id}
                  onClick={() => switchTab(tab.id)}
                  className={`flex items-center justify-between p-3.5 rounded-2xl cursor-pointer transition-all border ${
                    isActive
                      ? 'bg-neutral-850 border-pink-500 ring-1 ring-pink-500'
                      : 'bg-neutral-900 hover:bg-neutral-850 border-neutral-800'
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0 mr-4">
                    <span className="w-7 h-7 rounded-lg bg-neutral-800 flex items-center justify-center text-sm shrink-0">
                      {tab.favicon}
                    </span>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-semibold text-neutral-200 truncate">
                          {tab.title}
                        </span>
                        {stack && (
                          <span
                            className={`px-2 py-0.5 rounded-full text-[10px] font-semibold border ${
                              stackColorMap[stack.color]?.text
                            } ${stackColorMap[stack.color]?.border}`}
                          >
                            {stack.name}
                          </span>
                        )}
                        {tab.isPinned && (
                          <Pin className="w-3 h-3 text-pink-400 fill-pink-400 shrink-0" />
                        )}
                      </div>
                      <p className="text-xs text-neutral-400 truncate">{tab.url}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0" onClick={(e) => e.stopPropagation()}>
                    <button
                      type="button"
                      onClick={() => togglePinTab(tab.id)}
                      className="p-1.5 rounded-lg hover:bg-neutral-700 text-neutral-400 hover:text-white"
                    >
                      {tab.isPinned ? <PinOff className="w-4 h-4" /> : <Pin className="w-4 h-4" />}
                    </button>
                    <button
                      type="button"
                      onClick={() => duplicateTab(tab.id)}
                      className="p-1.5 rounded-lg hover:bg-neutral-700 text-neutral-400 hover:text-white"
                    >
                      <Copy className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => setSnoozeModalTabId(tab.id)}
                      className="p-1.5 rounded-lg hover:bg-neutral-700 text-neutral-400 hover:text-white"
                    >
                      <Clock className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => closeTab(tab.id)}
                      className="p-1.5 rounded-lg hover:bg-neutral-700 text-neutral-400 hover:text-rose-400"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* 3. Candy Stacks Mode */}
        {activeViewMode === 'stack' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-semibold text-neutral-200">Candy Stacks Organization</h3>
                <p className="text-xs text-neutral-400">
                  Group tabs by research topic or project with color coding.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setShowCreateStackModal(true)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-neutral-800 hover:bg-neutral-700 border border-neutral-700 text-xs font-semibold text-pink-400 transition-colors"
              >
                <FolderPlus className="w-4 h-4" />
                <span>New Stack</span>
              </button>
            </div>

            {/* Render each Stack */}
            {stacks.map((st) => {
              const stackTabs = tabs.filter((t) => t.stackId === st.id);
              const colorInfo = stackColorMap[st.color] || stackColorMap.grape;

              return (
                <div
                  key={st.id}
                  className={`rounded-2xl border ${colorInfo.border} ${colorInfo.bg} p-4 transition-all`}
                >
                  <div className="flex items-center justify-between mb-3">
                    <button
                      type="button"
                      onClick={() => toggleStackCollapse(st.id)}
                      className="flex items-center gap-2 font-bold text-sm text-white hover:text-neutral-200"
                    >
                      {st.collapsed ? (
                        <ChevronRight className="w-4 h-4 text-neutral-400" />
                      ) : (
                        <ChevronDown className="w-4 h-4 text-neutral-400" />
                      )}
                      <span>{st.name}</span>
                      <span className="px-2 py-0.5 rounded-full bg-neutral-800/80 text-[10px] font-semibold text-neutral-300">
                        {stackTabs.length} tabs
                      </span>
                    </button>

                    <button
                      type="button"
                      onClick={() => deleteStack(st.id)}
                      className="text-xs text-neutral-400 hover:text-rose-400 p-1 rounded hover:bg-neutral-800"
                      title="Delete Stack"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  {!st.collapsed && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                      {stackTabs.map((t) => (
                        <div
                          key={t.id}
                          onClick={() => switchTab(t.id)}
                          className="flex items-center justify-between p-3 rounded-xl bg-neutral-900 hover:bg-neutral-850 border border-neutral-800 cursor-pointer"
                        >
                          <div className="truncate mr-2">
                            <span className="text-xs font-medium text-neutral-200 truncate block">
                              {t.title}
                            </span>
                            <span className="text-[10px] text-neutral-500 truncate block">
                              {t.url}
                            </span>
                          </div>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              removeTabFromStack(t.id);
                            }}
                            className="p-1 rounded text-neutral-400 hover:text-white"
                            title="Remove from stack"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ))}
                      {stackTabs.length === 0 && (
                        <p className="text-xs text-neutral-500 italic col-span-full">
                          No tabs assigned to this stack yet.
                        </p>
                      )}
                    </div>
                  )}
                </div>
              );
            })}

            {/* Unstacked Tabs */}
            <div className="p-4 rounded-2xl border border-neutral-800 bg-neutral-900/60">
              <h4 className="text-xs font-semibold text-neutral-400 uppercase tracking-wider mb-3">
                Unorganized Tabs ({tabs.filter((t) => !t.stackId).length})
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                {tabs
                  .filter((t) => !t.stackId)
                  .map((t) => (
                    <div
                      key={t.id}
                      className="flex items-center justify-between p-3 rounded-xl bg-neutral-900 border border-neutral-800"
                    >
                      <div
                        onClick={() => switchTab(t.id)}
                        className="truncate mr-2 cursor-pointer"
                      >
                        <span className="text-xs font-medium text-neutral-200 truncate block">
                          {t.title}
                        </span>
                        <span className="text-[10px] text-neutral-500 truncate block">
                          {t.url}
                        </span>
                      </div>

                      {stacks.length > 0 && (
                        <select
                          onChange={(e) => {
                            if (e.target.value) addTabToStack(t.id, e.target.value);
                          }}
                          defaultValue=""
                          className="bg-neutral-800 text-[11px] text-neutral-300 rounded px-1.5 py-1 border border-neutral-700"
                        >
                          <option value="" disabled>
                            Add to Stack...
                          </option>
                          {stacks.map((s) => (
                            <option key={s.id} value={s.id}>
                              {s.name}
                            </option>
                          ))}
                        </select>
                      )}
                    </div>
                  ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Snooze Tab Modal */}
      {snoozeModalTabId && (
        <div className="fixed inset-0 z-60 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-sm rounded-2xl bg-neutral-900 border border-neutral-800 p-5 space-y-4">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Clock className="w-5 h-5 text-amber-400" />
              <span>Snooze Tab</span>
            </h3>
            <p className="text-xs text-neutral-400">
              Free up memory and attention. This tab will sleep and resurface when you need it.
            </p>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <button
                type="button"
                onClick={() => executeSnooze(1, 'In 1 hour')}
                className="p-3 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-left border border-neutral-700 font-medium"
              >
                In 1 hour
              </button>
              <button
                type="button"
                onClick={() => executeSnooze(4, 'This afternoon')}
                className="p-3 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-left border border-neutral-700 font-medium"
              >
                In 4 hours
              </button>
              <button
                type="button"
                onClick={() => executeSnooze(24, 'Tomorrow')}
                className="p-3 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-left border border-neutral-700 font-medium"
              >
                Tomorrow
              </button>
              <button
                type="button"
                onClick={() => executeSnooze(168, 'Next week')}
                className="p-3 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-left border border-neutral-700 font-medium"
              >
                Next week
              </button>
            </div>
            <button
              type="button"
              onClick={() => setSnoozeModalTabId(null)}
              className="w-full py-2 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-xs font-semibold text-neutral-300"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Create Stack Modal */}
      {showCreateStackModal && (
        <div className="fixed inset-0 z-60 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <form
            onSubmit={handleCreateStackSubmit}
            className="w-full max-w-sm rounded-2xl bg-neutral-900 border border-neutral-800 p-5 space-y-4"
          >
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <FolderPlus className="w-5 h-5 text-pink-400" />
              <span>Create Candy Stack</span>
            </h3>
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-neutral-400">Stack Name</label>
              <input
                type="text"
                value={newStackName}
                onChange={(e) => setNewStackName(e.target.value)}
                placeholder="e.g., AI Research, Flight Bookings"
                required
                className="w-full px-3 py-2 rounded-xl bg-neutral-800 border border-neutral-700 text-sm text-white focus:outline-none focus:border-pink-500"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-neutral-400">Theme Color</label>
              <div className="grid grid-cols-4 gap-2">
                {(['grape', 'cherry', 'lime', 'blueberry'] as StackColor[]).map((c) => (
                  <button
                    key={c}
                    type="button"
                    onClick={() => setNewStackColor(c)}
                    className={`py-2 px-1 rounded-xl text-xs font-bold capitalize border text-center ${
                      newStackColor === c ? 'ring-2 ring-white ' + stackColorMap[c].bg : 'bg-neutral-800 border-neutral-700 text-neutral-300'
                    }`}
                  >
                    {c}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowCreateStackModal(false)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-neutral-400 hover:text-white"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 rounded-xl bg-pink-500 hover:bg-pink-600 text-white text-xs font-bold shadow-lg shadow-pink-500/20"
              >
                Save Stack
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
