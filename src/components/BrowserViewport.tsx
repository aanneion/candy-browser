import React, { useState } from 'react';
import {
  ExternalLink,
  Eye,
  Shield,
  BookOpen,
  Sparkles,
  Search,
  CheckCircle2,
  AlertCircle,
  Copy,
  Share2,
  VolumeX,
  Compass,
  ArrowUpRight,
  Fingerprint,
  Cpu,
  Database,
  ChevronDown,
  ChevronUp,
  Terminal,
  Layers,
  Lock,
} from 'lucide-react';
import { useBrowser } from '../context/BrowserContext';
import { SIMULATED_PAGES, FINGERPRINT_PRESETS } from '../data/initialData';

export const BrowserViewport: React.FC = () => {
  const {
    activeTab,
    navigateTab,
    openTab,
    openLinkPeek,
    openReaderMode,
    setPrivacyXRayOpen,
    setTrailSheetOpen,
    privacyStats,
    rules,
    activeProfile,
    activeProfileCookies,
    activeProfileLocalStorage,
    activeProfileIdb,
    activeProfileWebCache,
    openSandboxManager,
  } = useBrowser();

  const [copiedLink, setCopiedLink] = useState(false);
  const [activeIframeFailed, setActiveIframeFailed] = useState(false);
  const [showIdentityDrawer, setShowIdentityDrawer] = useState(false);
  const [copiedUserAgent, setCopiedUserAgent] = useState(false);

  const fp = activeProfile.fingerprint || FINGERPRINT_PRESETS['windows-chrome'];

  const isAiModePage = activeTab.url.startsWith('https://candy.ai/mode');
  const aiQuery = isAiModePage
    ? decodeURIComponent(new URL(activeTab.url).searchParams.get('query') || '')
    : '';

  const simulatedPage = SIMULATED_PAGES[activeTab.url];

  const handleLinkClick = (url: string, e: React.MouseEvent) => {
    e.preventDefault();
    navigateTab(activeTab.id, url);
  };

  const handleLinkPeek = (url: string, title: string, snippet: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    openLinkPeek(url, title, snippet);
  };

  const handleShare = () => {
    navigator.clipboard.writeText(activeTab.url);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  return (
    <div
      id="browser-viewport-container"
      className="flex-1 w-full h-full overflow-y-auto bg-neutral-950 text-neutral-100 relative"
      style={{
        transform: `scale(${activeTab.zoom / 100})`,
        transformOrigin: 'top center',
      }}
    >
      {/* Domain Mute Notice */}
      {activeTab.isMuted && (
        <div className="sticky top-0 z-20 bg-amber-500/20 border-b border-amber-500/30 px-4 py-1.5 text-xs text-amber-300 flex items-center justify-between backdrop-blur-md">
          <div className="flex items-center gap-2">
            <VolumeX className="w-3.5 h-3.5" />
            <span>Domain audio is muted by Candy Rule</span>
          </div>
          <span className="text-[10px] text-amber-400/80">Tab sound disabled</span>
        </div>
      )}

      {/* Persona Hardware Spoofing & Partitioned Sandbox Banner */}
      <div className="sticky top-0 z-10 bg-neutral-900/90 backdrop-blur-md border-b border-neutral-800/80 px-3 sm:px-4 py-1.5 flex flex-col transition-all">
        <div className="flex items-center justify-between gap-2 text-xs">
          {/* Persona and Platform Identity */}
          <div className="flex items-center gap-2 truncate">
            <button
              type="button"
              onClick={() => openSandboxManager('personas')}
              className="flex items-center gap-1.5 px-2 py-0.5 rounded-lg hover:bg-neutral-800 transition-colors shrink-0"
              title={`Switch Persona: ${activeProfile.name}`}
            >
              <span
                className="w-5 h-5 rounded-md flex items-center justify-center text-xs font-bold border"
                style={{
                  backgroundColor: activeProfile.accentColor + '25',
                  borderColor: activeProfile.accentColor,
                }}
              >
                {activeProfile.icon}
              </span>
              <span className="font-semibold text-white">{activeProfile.name}</span>
              {activeProfile.isPrivate && (
                <span className="px-1.5 py-0.2 rounded bg-purple-500/20 text-purple-300 text-[10px] font-bold flex items-center gap-0.5">
                  <Lock className="w-2.5 h-2.5" />
                  Private
                </span>
              )}
            </button>

            <span className="text-neutral-600 hidden sm:inline">|</span>

            {/* Emulated Platform Signature */}
            <div className="hidden sm:flex items-center gap-1.5 text-neutral-300 truncate">
              <Fingerprint className="w-3.5 h-3.5 text-pink-400 shrink-0" />
              <span className="truncate font-medium text-[11px]">
                {fp.osName.split(' ')[0]} ({fp.preset}) · {fp.hardwareConcurrency} Cores · {fp.deviceMemory}GB RAM
              </span>
              {fp.canvasNoiseEnabled && (
                <span className="px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-300 text-[9px] font-bold">
                  Noise: ON
                </span>
              )}
            </div>
          </div>

          {/* Quick Sandbox Stats and Drawer Toggle */}
          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={() => openSandboxManager('storage')}
              className="flex items-center gap-1 px-2 py-0.5 rounded-lg bg-neutral-800/80 hover:bg-neutral-750 text-neutral-300 text-[11px] font-medium border border-neutral-700 transition-colors"
              title="Inspect Isolated Sandbox Storage"
            >
              <Database className="w-3 h-3 text-blue-400" />
              <span>
                Sandbox ({activeProfileCookies.length} ck, {activeProfileLocalStorage.length} st)
              </span>
            </button>

            <button
              type="button"
              onClick={() => setShowIdentityDrawer(!showIdentityDrawer)}
              className="flex items-center gap-1 px-1.5 py-0.5 rounded-lg hover:bg-neutral-800 text-neutral-400 hover:text-white text-[11px] transition-colors"
              title="Toggle Live Navigator Identity Drawer"
            >
              <Terminal className="w-3 h-3 text-pink-400" />
              <span>Verify</span>
              {showIdentityDrawer ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
            </button>
          </div>
        </div>

        {/* Expandable Live Identity Inspector Drawer */}
        {showIdentityDrawer && (
          <div className="mt-2 pt-2 border-t border-neutral-800/80 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 text-[11px] font-mono text-neutral-300 bg-neutral-950/60 p-2.5 rounded-xl animate-in fade-in duration-150">
            <div className="space-y-0.5">
              <span className="text-neutral-500 text-[10px] block font-sans">navigator.platform</span>
              <span className="text-pink-400 font-bold truncate block">{fp.platform}</span>
            </div>
            <div className="space-y-0.5">
              <span className="text-neutral-500 text-[10px] block font-sans">hardwareConcurrency / RAM</span>
              <span className="text-emerald-400 font-bold block">
                {fp.hardwareConcurrency} Cores / {fp.deviceMemory}GB RAM
              </span>
            </div>
            <div className="space-y-0.5">
              <span className="text-neutral-500 text-[10px] block font-sans">WebGL Renderer</span>
              <span className="text-blue-400 truncate block">{fp.webglRenderer.slice(0, 24)}...</span>
            </div>
            <div className="space-y-0.5 flex items-center justify-between">
              <div>
                <span className="text-neutral-500 text-[10px] block font-sans">WebRTC / Noise</span>
                <span className="text-amber-400 block">
                  {fp.webRtcPolicy} · {fp.canvasNoiseEnabled ? 'Noise' : 'Clean'}
                </span>
              </div>
              <button
                type="button"
                onClick={() => {
                  navigator.clipboard.writeText(fp.userAgent);
                  setCopiedUserAgent(true);
                  setTimeout(() => setCopiedUserAgent(false), 2000);
                }}
                className="px-2 py-1 rounded bg-neutral-800 hover:bg-neutral-700 text-[10px] text-neutral-300 flex items-center gap-1 font-sans"
              >
                {copiedUserAgent ? <CheckCircle2 className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                <span>UA</span>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* 1. Google AI Mode Search Result Experience */}
      {isAiModePage ? (
        <div className="max-w-3xl mx-auto px-4 py-8 space-y-6">
          <div className="flex items-center gap-3 p-4 rounded-2xl bg-gradient-to-r from-pink-500/10 via-purple-500/10 to-transparent border border-pink-500/30">
            <div className="p-2.5 rounded-xl bg-gradient-to-tr from-pink-500 to-purple-600 text-white shadow-lg shadow-pink-500/20">
              <Sparkles className="w-6 h-6" />
            </div>
            <div>
              <div className="text-xs font-semibold uppercase tracking-wider text-pink-400">
                Google AI Mode · Synthesized Overview
              </div>
              <h1 className="text-xl font-bold text-white mt-0.5">{aiQuery || 'AI Mode Search'}</h1>
            </div>
          </div>

          {/* AI Answer Card */}
          <div className="p-6 rounded-2xl bg-neutral-900 border border-neutral-800 space-y-4 shadow-xl">
            <div className="flex items-center justify-between text-xs text-neutral-400 border-b border-neutral-800 pb-3">
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                Multi-source intelligence verified
              </span>
              <span className="text-pink-400 font-medium">Candy Gemini Engine</span>
            </div>

            <div className="prose prose-invert max-w-none text-neutral-200 text-sm leading-relaxed space-y-3">
              <p>
                Synthesizing verified information for <strong className="text-pink-300">"{aiQuery}"</strong> across web domains.
                Modern web architectures and privacy sandboxes isolate script execution, partition tracking cookies, and offer gesture-driven workflows.
              </p>
              <div className="p-3 rounded-xl bg-neutral-800/60 border border-neutral-700/50 space-y-1.5">
                <div className="text-xs font-semibold text-neutral-300">Key Highlights:</div>
                <ul className="text-xs space-y-1 text-neutral-400 list-disc list-inside">
                  <li>Zero-latency gesture switching allows seamless tab transitions without opening the overview.</li>
                  <li>Privacy X-Ray continuously monitors background telemetry, blocking fingerprinting heuristics.</li>
                  <li>Candy Trails maps non-linear browsing, preserving research trees for instant recall.</li>
                </ul>
              </div>
              <p>
                Would you like to explore deeper through Reader Studio, check real-time privacy trackers, or branch this journey into a new Candy Trail?
              </p>
            </div>

            {/* Citations and Action Buttons */}
            <div className="pt-3 border-t border-neutral-800 flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => navigateTab(activeTab.id, 'https://candy.browser/trails')}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-pink-500/20 text-pink-300 hover:bg-pink-500/30 text-xs font-medium transition-colors"
              >
                <Compass className="w-3.5 h-3.5" />
                <span>Explore Candy Trails</span>
              </button>
              <button
                type="button"
                onClick={() => openReaderMode()}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-neutral-800 text-neutral-200 hover:bg-neutral-700 text-xs font-medium transition-colors"
              >
                <BookOpen className="w-3.5 h-3.5" />
                <span>Reader Studio</span>
              </button>
              <button
                type="button"
                onClick={() => setPrivacyXRayOpen(true)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-neutral-800 text-emerald-400 hover:bg-neutral-700 text-xs font-medium transition-colors"
              >
                <Shield className="w-3.5 h-3.5" />
                <span>Inspect Privacy</span>
              </button>
            </div>
          </div>
        </div>
      ) : simulatedPage ? (
        /* 2. Rich Simulated Web Page with Interactive Links & Link Peek */
        <div className={`max-w-4xl mx-auto px-4 sm:px-8 py-6 space-y-8 ${activeTab.isDesktop ? 'w-[1024px] max-w-none' : ''}`}>
          {/* Web Header Banner */}
          <div className="border-b border-neutral-800 pb-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1.5">
                <span className="px-2 py-0.5 rounded-md bg-neutral-800 text-neutral-300 text-[11px] font-semibold tracking-wide uppercase">
                  {simulatedPage.badge}
                </span>
                <span className="text-xs text-neutral-400">· {simulatedPage.domain}</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
                {simulatedPage.title}
              </h1>
            </div>

            {/* Quick Actions Header */}
            <div className="flex items-center gap-2 shrink-0">
              <button
                type="button"
                onClick={() => openReaderMode()}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-neutral-800/80 hover:bg-neutral-700 text-xs text-neutral-200 font-medium border border-neutral-700 transition-colors"
                title="Read in Reader Studio"
              >
                <BookOpen className="w-3.5 h-3.5 text-pink-400" />
                <span>Reader</span>
              </button>

              <button
                type="button"
                onClick={handleShare}
                className="p-2 rounded-xl bg-neutral-800/80 hover:bg-neutral-700 text-neutral-200 border border-neutral-700 transition-colors"
                title="Copy Page URL"
              >
                {copiedLink ? <CheckCircle2 className="w-4 h-4 text-emerald-400" /> : <Share2 className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Candy Shield Active Banner */}
          <div className="flex items-center justify-between p-3 rounded-xl bg-emerald-950/20 border border-emerald-500/20 text-xs text-emerald-300">
            <div className="flex items-center gap-2">
              <Shield className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>
                Candy Protection Active: Blocked <strong>{simulatedPage.trackersCount + 2} trackers</strong> & cookie consent banners.
              </span>
            </div>
            <button
              type="button"
              onClick={() => setPrivacyXRayOpen(true)}
              className="font-semibold text-emerald-400 hover:underline shrink-0"
            >
              View X-Ray →
            </button>
          </div>

          {/* Article / Web Page Sections */}
          <div className="space-y-6 text-neutral-300 leading-relaxed text-sm sm:text-base">
            {simulatedPage.paragraphs.map((p, idx) => (
              <div key={idx} className="space-y-2">
                {simulatedPage.headings[idx] && (
                  <h2 className="text-lg sm:text-xl font-bold text-white pt-2">
                    {simulatedPage.headings[idx]}
                  </h2>
                )}
                <p>{p}</p>
              </div>
            ))}
          </div>

          {/* Interactive Web Links with Link Peek */}
          <div className="pt-6 border-t border-neutral-800">
            <h3 className="text-sm font-semibold text-neutral-400 uppercase tracking-wider mb-4 flex items-center justify-between">
              <span>Related Hyperlinks & Citations</span>
              <span className="text-xs normal-case text-neutral-400 font-normal">
                Click to navigate · Click <Eye className="inline w-3.5 h-3.5 text-pink-400 ml-0.5" /> to Peek
              </span>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {simulatedPage.links.map((link, idx) => (
                <div
                  key={idx}
                  className="group relative p-4 rounded-xl bg-neutral-900 hover:bg-neutral-850 border border-neutral-800 hover:border-pink-500/40 transition-all shadow-md flex flex-col justify-between"
                >
                  <div>
                    <a
                      href={link.url}
                      onClick={(e) => handleLinkClick(link.url, e)}
                      className="font-semibold text-sm text-pink-400 hover:text-pink-300 flex items-center gap-1.5"
                    >
                      <span>{link.label}</span>
                      <ArrowUpRight className="w-3.5 h-3.5 opacity-60 group-hover:opacity-100 transition-opacity" />
                    </a>
                    <p className="text-xs text-neutral-400 mt-1 line-clamp-2">{link.preview}</p>
                  </div>

                  <div className="mt-3 pt-2.5 border-t border-neutral-800/80 flex items-center justify-between text-xs">
                    <span className="text-[11px] text-neutral-400 truncate max-w-[180px]">
                      {link.url.replace(/^https?:\/\//, '')}
                    </span>

                    <div className="flex items-center gap-1.5">
                      {/* Peek button */}
                      <button
                        type="button"
                        onClick={(e) => handleLinkPeek(link.url, link.label, link.preview, e)}
                        className="flex items-center gap-1 px-2 py-1 rounded-lg bg-neutral-800 hover:bg-pink-950/40 text-neutral-300 hover:text-pink-300 border border-neutral-700/60 text-[11px] font-medium transition-colors"
                        title="Link Peek"
                      >
                        <Eye className="w-3 h-3 text-pink-400" />
                        <span>Peek</span>
                      </button>

                      {/* Open in new tab */}
                      <button
                        type="button"
                        onClick={() => openTab(link.url, link.label)}
                        className="p-1 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-400 hover:text-white border border-neutral-700/60 transition-colors"
                        title="Open in new tab"
                      >
                        <ExternalLink className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : (
        /* 3. Real Web URL renderer with Sandboxed Iframe and Live Fallback card */
        <div className="w-full h-full flex flex-col">
          <div className="bg-neutral-900 border-b border-neutral-800 px-4 py-2 flex items-center justify-between text-xs text-neutral-400">
            <div className="flex items-center gap-2 truncate">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              <span className="truncate">{activeTab.url}</span>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => openReaderMode()}
                className="flex items-center gap-1 text-pink-400 hover:underline"
              >
                <BookOpen className="w-3.5 h-3.5" />
                <span>Reader Mode</span>
              </button>
              <a
                href={activeTab.url}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-1 text-neutral-300 hover:text-white"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                <span>Open in Tab</span>
              </a>
            </div>
          </div>

          <div className="flex-1 relative w-full h-full">
            {activeIframeFailed ? (
              <div className="w-full h-full flex flex-col items-center justify-center p-6 text-center bg-neutral-950 space-y-4">
                <div className="w-14 h-14 rounded-2xl bg-pink-500/10 border border-pink-500/30 flex items-center justify-center text-pink-400">
                  <Shield className="w-7 h-7" />
                </div>
                <div className="max-w-md space-y-1">
                  <h3 className="text-lg font-bold text-white">External Site Protected by Same-Origin Policy</h3>
                  <p className="text-xs text-neutral-400 leading-relaxed">
                    This domain restricts iframe embedding via X-Frame-Options or CSP. Your isolated persona sandbox and hardware spoofing are ready.
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <a
                    href={activeTab.url}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-2 px-4 py-2 rounded-xl bg-pink-500 hover:bg-pink-600 text-white text-xs font-semibold shadow-lg shadow-pink-500/20 transition-all"
                  >
                    <ExternalLink className="w-4 h-4" />
                    <span>Open in Direct Window</span>
                  </a>
                  <button
                    type="button"
                    onClick={() => openReaderMode()}
                    className="flex items-center gap-2 px-4 py-2 rounded-xl bg-neutral-850 hover:bg-neutral-800 text-neutral-200 text-xs font-semibold border border-neutral-750 transition-all"
                  >
                    <BookOpen className="w-4 h-4 text-pink-400" />
                    <span>Extract with Reader</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => openSandboxManager('storage')}
                    className="flex items-center gap-2 px-4 py-2 rounded-xl bg-neutral-850 hover:bg-neutral-800 text-neutral-200 text-xs font-semibold border border-neutral-750 transition-all"
                  >
                    <Database className="w-4 h-4 text-blue-400" />
                    <span>Inspect Sandbox</span>
                  </button>
                </div>
              </div>
            ) : (
              <iframe
                src={activeTab.url}
                title={activeTab.title}
                sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
                onError={() => setActiveIframeFailed(true)}
                className="w-full h-full border-none bg-white"
              />
            )}
          </div>
        </div>
      )}
    </div>
  );
};
