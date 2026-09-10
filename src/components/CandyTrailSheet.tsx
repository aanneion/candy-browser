import React, { useState } from 'react';
import {
  X,
  Compass,
  CornerDownRight,
  RotateCcw,
  ExternalLink,
  Trash2,
  Share2,
  Calendar,
  Clock,
  ArrowRight,
  GitBranch,
} from 'lucide-react';
import { useBrowser } from '../context/BrowserContext';
import { CandyTrailNode } from '../types';

export const CandyTrailSheet: React.FC = () => {
  const {
    trailNodes,
    activeTrailNodeId,
    openTab,
    navigateTab,
    activeTab,
    clearTrail,
    trailSheetOpen,
    setTrailSheetOpen,
  } = useBrowser();

  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(activeTrailNodeId);

  if (!trailSheetOpen) return null;

  const nodesList = Object.values(trailNodes);
  // Find root nodes (no parent)
  const rootNodes = nodesList.filter((n) => !n.parentId);

  const selectedNode = selectedNodeId ? trailNodes[selectedNodeId] : null;

  const handleOpenNode = (node: CandyTrailNode) => {
    navigateTab(activeTab.id, node.url);
    setTrailSheetOpen(false);
  };

  const handleOpenNodeInNewTab = (node: CandyTrailNode) => {
    openTab(node.url, node.title);
    setTrailSheetOpen(false);
  };

  return (
    <div
      id="candy-trail-sheet-overlay"
      className="fixed inset-0 z-50 bg-neutral-950/95 backdrop-blur-2xl flex flex-col text-neutral-100 overflow-hidden animate-in fade-in duration-200"
    >
      {/* Top Header */}
      <div className="border-b border-neutral-800 px-4 sm:px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setTrailSheetOpen(false)}
            className="p-2 rounded-full hover:bg-neutral-800 text-neutral-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-pink-500/20 text-pink-400">
              <Compass className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <span>Candy Trails · Journey Graph</span>
                <span className="px-2 py-0.5 rounded-full bg-pink-500/20 text-pink-400 text-xs font-semibold">
                  {nodesList.length} pages
                </span>
              </h2>
              <p className="text-xs text-neutral-400">
                Visual branching map of web research and links explored
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={clearTrail}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 text-xs text-neutral-300 hover:text-rose-400 transition-colors"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Clear Trail</span>
          </button>
        </div>
      </div>

      {/* Main Graph Content */}
      <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
        {/* Left / Main Interactive Visual Tree */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-8 space-y-6">
          {nodesList.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-8 space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-neutral-900 flex items-center justify-center text-neutral-500">
                <GitBranch className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-neutral-300">No Trail Recorded Yet</h3>
              <p className="text-xs text-neutral-500 max-w-sm">
                Browse websites, click links, or search to watch your interactive branching journey graph develop here.
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              {rootNodes.map((root) => (
                <div
                  key={root.id}
                  className="p-5 rounded-3xl bg-neutral-900/60 border border-neutral-800 space-y-4"
                >
                  {/* Root Node Header */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-pink-500 ring-4 ring-pink-500/20" />
                      <span className="text-xs font-semibold uppercase tracking-wider text-pink-400">
                        Origin Journey Point
                      </span>
                    </div>
                    <span className="text-[11px] text-neutral-500">
                      {new Date(root.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>

                  {/* Render Root Item */}
                  <div
                    onClick={() => setSelectedNodeId(root.id)}
                    className={`p-4 rounded-2xl border transition-all cursor-pointer ${
                      selectedNodeId === root.id
                        ? 'bg-neutral-850 border-pink-500 ring-1 ring-pink-500'
                        : 'bg-neutral-900 hover:bg-neutral-850 border-neutral-800'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-bold text-sm text-white">{root.title}</h4>
                        <p className="text-xs text-neutral-400">{root.url}</p>
                      </div>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleOpenNode(root);
                        }}
                        className="px-2.5 py-1 rounded-lg bg-pink-500/20 text-pink-300 hover:bg-pink-500/30 text-xs font-medium"
                      >
                        Navigate
                      </button>
                    </div>
                  </div>

                  {/* Render Child Branches */}
                  {root.childrenIds.length > 0 && (
                    <div className="pl-6 border-l-2 border-dashed border-pink-500/30 space-y-3 mt-3">
                      <div className="text-[11px] font-semibold text-neutral-400 flex items-center gap-1.5">
                        <CornerDownRight className="w-3.5 h-3.5 text-pink-400" />
                        <span>Forks and links explored from here:</span>
                      </div>

                      {root.childrenIds.map((childId) => {
                        const child = trailNodes[childId];
                        if (!child) return null;
                        const isSelected = selectedNodeId === child.id;

                        return (
                          <div
                            key={child.id}
                            onClick={() => setSelectedNodeId(child.id)}
                            className={`p-3.5 rounded-2xl border transition-all cursor-pointer ${
                              isSelected
                                ? 'bg-neutral-850 border-pink-500 ring-1 ring-pink-500'
                                : 'bg-neutral-900/90 hover:bg-neutral-850 border-neutral-800'
                            }`}
                          >
                            <div className="flex items-center justify-between">
                              <div className="truncate mr-2">
                                <h5 className="font-medium text-xs text-neutral-200 truncate">
                                  {child.title}
                                </h5>
                                <p className="text-[10px] text-neutral-500 truncate">{child.url}</p>
                              </div>
                              <div className="flex items-center gap-1.5 shrink-0">
                                <button
                                  type="button"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleOpenNode(child);
                                  }}
                                  className="px-2 py-1 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-[11px] text-neutral-300 font-medium"
                                >
                                  Go
                                </button>
                                <button
                                  type="button"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleOpenNodeInNewTab(child);
                                  }}
                                  className="p-1 rounded-lg hover:bg-neutral-700 text-neutral-400 hover:text-white"
                                  title="Open in new tab"
                                >
                                  <ExternalLink className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right Sidebar: Selected Node Detail & Actions */}
        {selectedNode && (
          <div className="w-full md:w-80 border-t md:border-t-0 md:border-l border-neutral-800 p-6 bg-neutral-900/80 flex flex-col justify-between">
            <div className="space-y-4">
              <div className="text-xs font-semibold uppercase tracking-wider text-pink-400">
                Selected Node Details
              </div>

              <div>
                <h3 className="text-base font-bold text-white">{selectedNode.title}</h3>
                <p className="text-xs text-neutral-400 mt-1 break-all">{selectedNode.url}</p>
              </div>

              <div className="space-y-2 pt-2 text-xs text-neutral-400">
                <div className="flex items-center justify-between py-1 border-b border-neutral-800">
                  <span>Domain</span>
                  <span className="font-medium text-neutral-200">{selectedNode.domain}</span>
                </div>
                <div className="flex items-center justify-between py-1 border-b border-neutral-800">
                  <span>Recorded</span>
                  <span className="font-medium text-neutral-200">
                    {new Date(selectedNode.timestamp).toLocaleTimeString()}
                  </span>
                </div>
                <div className="flex items-center justify-between py-1 border-b border-neutral-800">
                  <span>Child Branches</span>
                  <span className="font-medium text-pink-400">
                    {selectedNode.childrenIds.length} forks
                  </span>
                </div>
              </div>
            </div>

            <div className="pt-6 space-y-2">
              <button
                type="button"
                onClick={() => handleOpenNode(selectedNode)}
                className="w-full py-2.5 rounded-xl bg-pink-500 hover:bg-pink-600 text-white text-xs font-bold shadow-lg shadow-pink-500/25 transition-all"
              >
                Switch Active Tab Here
              </button>
              <button
                type="button"
                onClick={() => handleOpenNodeInNewTab(selectedNode)}
                className="w-full py-2.5 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-200 text-xs font-semibold border border-neutral-700 transition-colors"
              >
                Fork into New Tab
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
