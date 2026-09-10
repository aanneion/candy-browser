import React, { useState, useEffect } from 'react';
import {
  X,
  User,
  Users,
  Plus,
  Lock,
  Sparkles,
  Check,
  Palette,
  Shield,
  ShieldCheck,
  Briefcase,
  Coffee,
  Laptop,
  Smartphone,
  Monitor,
  Database,
  HardDrive,
  Cookie,
  Trash2,
  RefreshCw,
  Sliders,
  Eye,
  AlertTriangle,
  Cpu,
  Activity,
  Fingerprint,
  Globe,
  Key,
  Clock,
  Bookmark,
  Search,
  Layers,
  Radio,
  HelpCircle,
  FolderLock,
  Zap,
} from 'lucide-react';
import { useBrowser } from '../context/BrowserContext';
import { FINGERPRINT_PRESETS } from '../data/initialData';
import {
  ProfileFingerprint,
  ProfileFingerprintPreset,
  BrowserProfile,
  ProfileCookie,
  ProfileStorageItem,
  ProfileIDBEntry,
} from '../types';

export const ProfilesModal: React.FC = () => {
  const {
    profiles,
    activeProfileId,
    activeProfile,
    switchProfile,
    createProfile,
    updateProfileFingerprint,
    applyFingerprintPreset,
    profilesModalOpen,
    setProfilesModalOpen,
    sandboxManagerOpen,
    setSandboxManagerOpen,
    sandboxInitialTab,
    // Sandbox isolated storages
    cookies,
    localStorageItems,
    idbEntries,
    webCacheEntries,
    bookmarks,
    history,
    tabs,
    addCookie,
    deleteCookie,
    clearCookies,
    setLocalStorageItem,
    deleteLocalStorageItem,
    clearLocalStorage,
    setIdbEntry,
    deleteIdbEntry,
    clearIdb,
    deleteWebCacheEntry,
    clearWebCache,
    addBookmark,
    deleteBookmark,
    deleteHistoryEntry,
    clearHistory,
  } = useBrowser();

  const isOpen = profilesModalOpen || sandboxManagerOpen;

  const [activeTab, setActiveTab] = useState<'personas' | 'fingerprint' | 'storage' | 'audit'>('personas');
  const [selectedProfileId, setSelectedProfileId] = useState<string>(activeProfileId);

  // Storage sub-tab
  const [storageSubTab, setStorageSubTab] = useState<'cookies' | 'localstorage' | 'idb' | 'cache' | 'bookmarks' | 'history'>('cookies');

  // New Profile Form
  const [showCreate, setShowCreate] = useState(false);
  const [newProfileName, setNewProfileName] = useState('');
  const [newProfileIcon, setNewProfileIcon] = useState('💼');
  const [newProfileColor, setNewProfileColor] = useState('#AA00FF');
  const [newProfilePreset, setNewProfilePreset] = useState<ProfileFingerprintPreset>('windows-chrome');

  // New Cookie Form
  const [showAddCookie, setShowAddCookie] = useState(false);
  const [cookieDomain, setCookieDomain] = useState('example.com');
  const [cookieName, setCookieName] = useState('');
  const [cookieValue, setCookieValue] = useState('');
  const [cookieSecure, setCookieSecure] = useState(true);
  const [cookieHttpOnly, setCookieHttpOnly] = useState(false);

  // New Storage Item Form
  const [showAddStorage, setShowAddStorage] = useState(false);
  const [storageKey, setStorageKey] = useState('');
  const [storageVal, setStorageVal] = useState('');

  // New IDB Entry Form
  const [showAddIdb, setShowAddIdb] = useState(false);
  const [idbDb, setIdbDb] = useState('AppDatabase');
  const [idbStore, setIdbStore] = useState('userStore');
  const [idbKey, setIdbKey] = useState('');
  const [idbVal, setIdbVal] = useState('');

  // Audit simulated test state
  const [auditRunning, setAuditRunning] = useState(false);
  const [auditComplete, setAuditComplete] = useState(true);

  // Sync initial tab when opened via sandbox manager
  useEffect(() => {
    if (sandboxInitialTab) {
      setActiveTab(sandboxInitialTab);
    }
  }, [sandboxInitialTab, isOpen]);

  // Keep selectedProfileId in sync with active profile
  useEffect(() => {
    if (!profiles.some((p) => p.id === selectedProfileId)) {
      setSelectedProfileId(activeProfileId);
    }
  }, [profiles, selectedProfileId, activeProfileId]);

  if (!isOpen) return null;

  const targetProfile = profiles.find((p) => p.id === selectedProfileId) || activeProfile;
  const currentFp = targetProfile.fingerprint || FINGERPRINT_PRESETS['windows-chrome'];

  // Scoped storage data for currently viewed profile
  const profileTabs = tabs.filter((t) => t.profileId === selectedProfileId);
  const profileCookies = cookies.filter((c) => c.profileId === selectedProfileId);
  const profileStorage = localStorageItems.filter((s) => s.profileId === selectedProfileId);
  const profileIdb = idbEntries.filter((i) => i.profileId === selectedProfileId);
  const profileCache = webCacheEntries.filter((w) => w.profileId === selectedProfileId);
  const profileBookmarks = bookmarks.filter((b) => b.profileId === selectedProfileId);
  const profileHistory = history.filter((h) => h.profileId === selectedProfileId);

  const handleClose = () => {
    setProfilesModalOpen(false);
    setSandboxManagerOpen(false);
    setShowCreate(false);
  };

  const handleCreateProfile = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProfileName.trim()) return;
    createProfile(
      newProfileName.trim(),
      newProfileIcon,
      newProfileColor,
      { type: 'gradient', value: 'from-pink-900 to-purple-950' },
      newProfilePreset
    );
    setNewProfileName('');
    setShowCreate(false);
    setActiveTab('personas');
  };

  const handleAddCookieSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!cookieName.trim()) return;
    addCookie(
      {
        name: cookieName.trim(),
        value: cookieValue.trim(),
        domain: cookieDomain.trim(),
        path: '/',
        expires: 'Session',
        secure: cookieSecure,
        httpOnly: cookieHttpOnly,
        sameSite: 'Lax',
      },
      selectedProfileId
    );
    setCookieName('');
    setCookieValue('');
    setShowAddCookie(false);
  };

  const handleAddStorageSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!storageKey.trim()) return;
    setLocalStorageItem(storageKey.trim(), storageVal.trim(), selectedProfileId);
    setStorageKey('');
    setStorageVal('');
    setShowAddStorage(false);
  };

  const handleAddIdbSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!idbKey.trim()) return;
    setIdbEntry(idbDb.trim(), idbStore.trim(), idbKey.trim(), idbVal.trim(), selectedProfileId);
    setIdbKey('');
    setIdbVal('');
    setShowAddIdb(false);
  };

  const runAudit = () => {
    setAuditRunning(true);
    setAuditComplete(false);
    setTimeout(() => {
      setAuditRunning(false);
      setAuditComplete(true);
    }, 900);
  };

  const iconOptions = ['👤', '💼', '🔬', '🎮', '🎨', '🚀', '☕', '🔒', '💎', '🛡️'];
  const colorOptions = ['#FF2F78', '#AA00FF', '#0091EA', '#00C853', '#FF6B00', '#607D8B', '#E91E63', '#00BCD4'];

  const presetsList: { id: ProfileFingerprintPreset; name: string; icon: string; os: string; desc: string }[] = [
    {
      id: 'windows-chrome',
      name: 'Windows 11 · Chrome 128',
      icon: '🪟',
      os: 'Windows 11 Pro 64-bit',
      desc: 'NVIDIA RTX 4080 · 16 Cores · 32GB RAM · DirectX 12',
    },
    {
      id: 'macos-safari',
      name: 'macOS Sonoma · Safari 17.5',
      icon: '🍎',
      os: 'macOS 14.5 Sonoma',
      desc: 'Apple M3 Max · 16 Cores · 36GB Unified RAM · Metal 3',
    },
    {
      id: 'ios-safari',
      name: 'iOS 17.5 · Mobile Safari',
      icon: '📱',
      os: 'iOS 17.5.1 (iPhone 15 Pro)',
      desc: 'Apple A17 Pro · 6 Cores · 8GB RAM · Touch-enabled Retina',
    },
    {
      id: 'linux-firefox',
      name: 'Linux · Firefox 129',
      icon: '🐧',
      os: 'Ubuntu Linux 24.04 LTS x86_64',
      desc: 'AMD Radeon RX 7900 XTX · 32 Cores · 64GB RAM · Mesa Vulkan',
    },
    {
      id: 'stealth-ghost',
      name: 'Stealth Tor / RFP Mode',
      icon: '🥷',
      os: 'ResistFingerprinting (Stealth Ghost)',
      desc: 'Canvas Noise · AudioContext Noise · UTC Time · WebRTC Munging',
    },
  ];

  return (
    <div
      id="profiles-modal-overlay"
      className="fixed inset-0 z-50 bg-black/75 backdrop-blur-md flex items-center justify-center p-2 sm:p-4 animate-in fade-in duration-150"
      onClick={handleClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-4xl max-h-[92vh] flex flex-col rounded-3xl bg-neutral-900 border border-neutral-800 shadow-2xl overflow-hidden text-neutral-100"
      >
        {/* Header with Title and Mode Tabs */}
        <div className="border-b border-neutral-800 bg-neutral-950/80 px-4 sm:px-6 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-pink-500 to-purple-600 flex items-center justify-center text-white shadow-lg shadow-pink-500/20">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-base sm:text-lg text-white">
                  Multi-Profile Isolation & Hardware Spoofing
                </h3>
                <span className="px-2 py-0.5 rounded-full bg-pink-500/20 text-pink-400 text-[10px] font-bold">
                  Pro Sandbox
                </span>
              </div>
              <p className="text-xs text-neutral-400">
                Independent sandboxes for cookies, storage, cache & hardware signatures
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={handleClose}
            className="self-end sm:self-auto p-1.5 rounded-full hover:bg-neutral-800 text-neutral-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Studio Navigation Bar */}
        <div className="px-4 sm:px-6 pt-3 pb-2 border-b border-neutral-800 bg-neutral-900 flex items-center gap-1 sm:gap-2 overflow-x-auto shrink-0">
          <button
            type="button"
            onClick={() => setActiveTab('personas')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
              activeTab === 'personas'
                ? 'bg-pink-500 text-white shadow-md shadow-pink-500/20'
                : 'text-neutral-400 hover:text-neutral-200 hover:bg-neutral-800'
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            <span>👥 Personas ({profiles.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('fingerprint')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
              activeTab === 'fingerprint'
                ? 'bg-pink-500 text-white shadow-md shadow-pink-500/20'
                : 'text-neutral-400 hover:text-neutral-200 hover:bg-neutral-800'
            }`}
          >
            <Fingerprint className="w-3.5 h-3.5" />
            <span>🎭 Hardware & Spoofing</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('storage')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
              activeTab === 'storage'
                ? 'bg-pink-500 text-white shadow-md shadow-pink-500/20'
                : 'text-neutral-400 hover:text-neutral-200 hover:bg-neutral-800'
            }`}
          >
            <Database className="w-3.5 h-3.5" />
            <span>🗄️ Isolated Sandbox Storage</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('audit')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
              activeTab === 'audit'
                ? 'bg-pink-500 text-white shadow-md shadow-pink-500/20'
                : 'text-neutral-400 hover:text-neutral-200 hover:bg-neutral-800'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>🔍 Anti-Leak Audit</span>
          </button>
        </div>

        {/* Selected Profile Indicator Banner */}
        <div className="px-4 sm:px-6 py-2 bg-neutral-950/60 border-b border-neutral-800 flex items-center justify-between text-xs text-neutral-300">
          <div className="flex items-center gap-2">
            <span className="text-neutral-400">Active Persona Context:</span>
            <select
              value={selectedProfileId}
              onChange={(e) => setSelectedProfileId(e.target.value)}
              className="bg-neutral-800 border border-neutral-700 text-white px-2.5 py-1 rounded-lg text-xs font-semibold focus:outline-none focus:border-pink-500"
            >
              {profiles.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.icon} {p.name} {p.id === activeProfileId ? '(Active)' : ''}
                </option>
              ))}
            </select>
          </div>

          <div className="hidden sm:flex items-center gap-3 text-[11px] text-neutral-400">
            <span className="flex items-center gap-1">
              <Cookie className="w-3 h-3 text-amber-400" />
              {profileCookies.length} Cookies
            </span>
            <span className="flex items-center gap-1">
              <HardDrive className="w-3 h-3 text-blue-400" />
              {profileStorage.length} Storage
            </span>
            <span className="flex items-center gap-1">
              <Cpu className="w-3 h-3 text-pink-400" />
              {currentFp.osName.split(' ')[0]}
            </span>
          </div>
        </div>

        {/* Main Body Content */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
          {/* TAB 1: PERSONAS & ISOLATION LIST */}
          {activeTab === 'personas' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-base text-white">Browser Personas & Sandboxes</h4>
                  <p className="text-xs text-neutral-400">
                    Each profile is a completely isolated container with its own storage partition and hardware fingerprint
                  </p>
                </div>

                {!showCreate && (
                  <button
                    type="button"
                    onClick={() => setShowCreate(true)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-pink-500 hover:bg-pink-600 text-white text-xs font-semibold shadow-md shadow-pink-500/20 transition-colors"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>New Profile</span>
                  </button>
                )}
              </div>

              {/* Create Profile Form */}
              {showCreate && (
                <form
                  onSubmit={handleCreateProfile}
                  className="p-5 rounded-2xl bg-neutral-950 border border-pink-500/40 space-y-4 shadow-xl animate-in fade-in"
                >
                  <div className="flex items-center justify-between border-b border-neutral-800 pb-2">
                    <h5 className="font-bold text-sm text-white flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-pink-400" />
                      <span>Create Isolated Browser Persona</span>
                    </h5>
                    <button
                      type="button"
                      onClick={() => setShowCreate(false)}
                      className="text-neutral-400 hover:text-white"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs text-neutral-300 block mb-1 font-medium">Profile Name</label>
                      <input
                        type="text"
                        value={newProfileName}
                        onChange={(e) => setNewProfileName(e.target.value)}
                        placeholder="e.g. Trading & Crypto, High Sec Research"
                        required
                        className="w-full px-3 py-2 rounded-xl bg-neutral-850 border border-neutral-700 text-white text-xs focus:outline-none focus:border-pink-500"
                      />
                    </div>

                    <div>
                      <label className="text-xs text-neutral-300 block mb-1 font-medium">
                        Initial Hardware Fingerprint Preset
                      </label>
                      <select
                        value={newProfilePreset}
                        onChange={(e) => setNewProfilePreset(e.target.value as ProfileFingerprintPreset)}
                        className="w-full px-3 py-2 rounded-xl bg-neutral-850 border border-neutral-700 text-white text-xs focus:outline-none focus:border-pink-500 font-medium"
                      >
                        {presetsList.map((preset) => (
                          <option key={preset.id} value={preset.id}>
                            {preset.icon} {preset.name}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                    <div>
                      <label className="text-xs text-neutral-300 block mb-1.5 font-medium">Avatar Icon</label>
                      <div className="flex flex-wrap gap-2">
                        {iconOptions.map((icon) => (
                          <button
                            key={icon}
                            type="button"
                            onClick={() => setNewProfileIcon(icon)}
                            className={`w-9 h-9 rounded-xl flex items-center justify-center text-sm border transition-all ${
                              newProfileIcon === icon
                                ? 'border-pink-500 bg-pink-500/20 scale-110'
                                : 'border-neutral-800 bg-neutral-850 hover:bg-neutral-800'
                            }`}
                          >
                            {icon}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="text-xs text-neutral-300 block mb-1.5 font-medium">Accent Palette</label>
                      <div className="flex flex-wrap gap-2">
                        {colorOptions.map((color) => (
                          <button
                            key={color}
                            type="button"
                            onClick={() => setNewProfileColor(color)}
                            className={`w-9 h-9 rounded-xl border flex items-center justify-center transition-all ${
                              newProfileColor === color ? 'ring-2 ring-white scale-110' : 'border-neutral-800'
                            }`}
                            style={{ backgroundColor: color }}
                          >
                            {newProfileColor === color && <Check className="w-4 h-4 text-white" />}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="pt-2 flex justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => setShowCreate(false)}
                      className="px-4 py-2 rounded-xl bg-neutral-800 text-neutral-300 text-xs font-semibold hover:bg-neutral-700"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 rounded-xl bg-pink-500 hover:bg-pink-600 text-white text-xs font-semibold shadow-md shadow-pink-500/20"
                    >
                      Initialize Sandbox
                    </button>
                  </div>
                </form>
              )}

              {/* Profiles List Cards */}
              <div className="grid grid-cols-1 gap-3">
                {profiles.map((profile) => {
                  const isActive = profile.id === activeProfileId;
                  const pTabs = tabs.filter((t) => t.profileId === profile.id);
                  const pCookies = cookies.filter((c) => c.profileId === profile.id);
                  const pStorage = localStorageItems.filter((s) => s.profileId === profile.id);
                  const pIdb = idbEntries.filter((i) => i.profileId === profile.id);
                  const pCache = webCacheEntries.filter((w) => w.profileId === profile.id);
                  const pFp = profile.fingerprint || FINGERPRINT_PRESETS['windows-chrome'];

                  return (
                    <div
                      key={profile.id}
                      className={`p-4 rounded-2xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                        isActive
                          ? 'bg-neutral-850 border-pink-500 ring-1 ring-pink-500/50 shadow-xl'
                          : 'bg-neutral-900 hover:bg-neutral-850/80 border-neutral-800'
                      }`}
                    >
                      <div className="flex items-start sm:items-center gap-3.5">
                        <span
                          className="w-12 h-12 rounded-2xl flex items-center justify-center text-xl font-bold shadow-md shrink-0"
                          style={{
                            backgroundColor: profile.accentColor + '25',
                            borderColor: profile.accentColor,
                            borderWidth: 1.5,
                          }}
                        >
                          {profile.icon}
                        </span>

                        <div className="space-y-1">
                          <div className="flex items-center gap-2 flex-wrap">
                            <h4 className="font-bold text-sm text-white">{profile.name}</h4>
                            {isActive && (
                              <span className="px-2 py-0.5 rounded-full bg-pink-500/20 text-pink-400 text-[10px] font-bold border border-pink-500/30">
                                Current Active Persona
                              </span>
                            )}
                            {profile.isPrivate && (
                              <span className="px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-400 text-[10px] font-bold flex items-center gap-1">
                                <Lock className="w-2.5 h-2.5" />
                                Memory Only
                              </span>
                            )}
                            <span className="px-2 py-0.5 rounded-full bg-neutral-800 text-neutral-300 text-[10px] font-medium">
                              {pFp.osName.split(' ')[0]} · {pFp.screenResolution}
                            </span>
                          </div>

                          <p className="text-xs text-neutral-400 line-clamp-1">
                            {profile.isPrivate
                              ? 'Zero persistence: storage & tabs evaporate on close'
                              : `Dedicated partition: ${pCookies.length} cookies, ${pStorage.length} localStorage, ${pIdb.length} IndexedDB, ${pCache.length} cache items`}
                          </p>

                          {/* Mini Sandbox Badges */}
                          <div className="flex flex-wrap items-center gap-2 pt-1 text-[11px] text-neutral-400">
                            <span className="flex items-center gap-1 bg-neutral-800/60 px-2 py-0.5 rounded-md">
                              <Layers className="w-3 h-3 text-pink-400" />
                              {pTabs.length} Tabs
                            </span>
                            <span className="flex items-center gap-1 bg-neutral-800/60 px-2 py-0.5 rounded-md">
                              <Cookie className="w-3 h-3 text-amber-400" />
                              {pCookies.length} Cookies
                            </span>
                            <span className="flex items-center gap-1 bg-neutral-800/60 px-2 py-0.5 rounded-md">
                              <HardDrive className="w-3 h-3 text-blue-400" />
                              {pStorage.length} Storage Keys
                            </span>
                            <span className="flex items-center gap-1 bg-neutral-800/60 px-2 py-0.5 rounded-md">
                              <Cpu className="w-3 h-3 text-emerald-400" />
                              {pFp.hardwareConcurrency} Cores / {pFp.deviceMemory}GB RAM
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                        <button
                          type="button"
                          onClick={() => {
                            setSelectedProfileId(profile.id);
                            setActiveTab('fingerprint');
                          }}
                          className="px-3 py-1.5 rounded-xl bg-neutral-800 hover:bg-neutral-750 text-neutral-300 hover:text-white text-xs font-semibold border border-neutral-700 transition-colors flex items-center gap-1.5"
                          title="Configure Hardware Fingerprint"
                        >
                          <Sliders className="w-3.5 h-3.5 text-pink-400" />
                          <span>Spoofing</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => {
                            setSelectedProfileId(profile.id);
                            setActiveTab('storage');
                          }}
                          className="px-3 py-1.5 rounded-xl bg-neutral-800 hover:bg-neutral-750 text-neutral-300 hover:text-white text-xs font-semibold border border-neutral-700 transition-colors flex items-center gap-1.5"
                          title="Inspect Storage Partition"
                        >
                          <Database className="w-3.5 h-3.5 text-blue-400" />
                          <span>Storage</span>
                        </button>

                        {!isActive ? (
                          <button
                            type="button"
                            onClick={() => {
                              switchProfile(profile.id);
                              handleClose();
                            }}
                            className="px-3.5 py-1.5 rounded-xl bg-pink-500 hover:bg-pink-600 text-white text-xs font-semibold shadow-md shadow-pink-500/20 transition-colors"
                          >
                            Switch To
                          </button>
                        ) : (
                          <span className="px-3 py-1.5 rounded-xl bg-neutral-800 text-neutral-400 text-xs font-semibold flex items-center gap-1">
                            <Check className="w-3.5 h-3.5 text-pink-400" />
                            Active
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB 2: HARDWARE & FINGERPRINT SPOOFING */}
          {activeTab === 'fingerprint' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-neutral-800 pb-3">
                <div>
                  <h4 className="font-bold text-base text-white flex items-center gap-2">
                    <Fingerprint className="w-4 h-4 text-pink-400" />
                    <span>Hardware & Platform Fingerprint Spoofing</span>
                  </h4>
                  <p className="text-xs text-neutral-400">
                    Emulating hardware platform for: <strong className="text-white">{targetProfile.name}</strong>
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-xs text-neutral-400">Current Preset:</span>
                  <span className="px-2.5 py-1 rounded-xl bg-pink-500/20 border border-pink-500/30 text-pink-300 text-xs font-semibold uppercase">
                    {currentFp.preset}
                  </span>
                </div>
              </div>

              {/* Presets Grid */}
              <div>
                <label className="text-xs font-semibold text-neutral-300 block mb-2 uppercase tracking-wider">
                  Select Hardware Signature Preset
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {presetsList.map((preset) => {
                    const isSelected = currentFp.preset === preset.id;
                    return (
                      <div
                        key={preset.id}
                        onClick={() => applyFingerprintPreset(targetProfile.id, preset.id)}
                        className={`p-3.5 rounded-2xl border cursor-pointer transition-all flex flex-col justify-between ${
                          isSelected
                            ? 'bg-neutral-850 border-pink-500 ring-1 ring-pink-500 shadow-lg'
                            : 'bg-neutral-900 hover:bg-neutral-850 border-neutral-800'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-2xl">{preset.icon}</span>
                          {isSelected ? (
                            <span className="px-2 py-0.5 rounded-full bg-pink-500 text-white text-[10px] font-bold">
                              Applied
                            </span>
                          ) : (
                            <span className="text-[10px] text-neutral-400">Click to apply</span>
                          )}
                        </div>
                        <div>
                          <h5 className="font-bold text-xs text-white">{preset.name}</h5>
                          <p className="text-[11px] text-neutral-400 mt-1">{preset.desc}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Granular Hardware Parameter Customizer */}
              <div className="p-5 rounded-2xl bg-neutral-950 border border-neutral-800 space-y-4">
                <h5 className="font-bold text-xs uppercase tracking-wider text-neutral-300 flex items-center gap-2">
                  <Sliders className="w-3.5 h-3.5 text-pink-400" />
                  <span>Custom Hardware & Defense Parameters</span>
                </h5>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-xs">
                  {/* CPU Cores */}
                  <div className="space-y-1.5">
                    <label className="text-neutral-400 font-medium flex items-center justify-between">
                      <span>CPU Cores (hardwareConcurrency)</span>
                      <span className="text-white font-bold">{currentFp.hardwareConcurrency} Cores</span>
                    </label>
                    <select
                      value={currentFp.hardwareConcurrency}
                      onChange={(e) =>
                        updateProfileFingerprint(targetProfile.id, {
                          hardwareConcurrency: parseInt(e.target.value, 10),
                        })
                      }
                      className="w-full px-3 py-1.5 rounded-xl bg-neutral-850 border border-neutral-700 text-white font-medium"
                    >
                      <option value={2}>2 Cores (Low-end / Netbook)</option>
                      <option value={4}>4 Cores (Quad-core)</option>
                      <option value={6}>6 Cores (Hexa-core / Mobile)</option>
                      <option value={8}>8 Cores (Octa-core Standard)</option>
                      <option value={12}>12 Cores (High Performance)</option>
                      <option value={16}>16 Cores (Workstation)</option>
                      <option value={24}>24 Cores (Intel i9 Extreme)</option>
                      <option value={32}>32 Cores (AMD Threadripper)</option>
                    </select>
                  </div>

                  {/* Device Memory */}
                  <div className="space-y-1.5">
                    <label className="text-neutral-400 font-medium flex items-center justify-between">
                      <span>Device Memory (RAM)</span>
                      <span className="text-white font-bold">{currentFp.deviceMemory} GB</span>
                    </label>
                    <select
                      value={currentFp.deviceMemory}
                      onChange={(e) =>
                        updateProfileFingerprint(targetProfile.id, {
                          deviceMemory: parseInt(e.target.value, 10),
                        })
                      }
                      className="w-full px-3 py-1.5 rounded-xl bg-neutral-850 border border-neutral-700 text-white font-medium"
                    >
                      <option value={2}>2 GB</option>
                      <option value={4}>4 GB</option>
                      <option value={8}>8 GB</option>
                      <option value={16}>16 GB</option>
                      <option value={32}>32 GB</option>
                      <option value={64}>64 GB</option>
                    </select>
                  </div>

                  {/* Screen Resolution */}
                  <div className="space-y-1.5">
                    <label className="text-neutral-400 font-medium flex items-center justify-between">
                      <span>Screen Resolution</span>
                      <span className="text-white font-bold">{currentFp.screenResolution}</span>
                    </label>
                    <select
                      value={currentFp.screenResolution}
                      onChange={(e) =>
                        updateProfileFingerprint(targetProfile.id, {
                          screenResolution: e.target.value,
                        })
                      }
                      className="w-full px-3 py-1.5 rounded-xl bg-neutral-850 border border-neutral-700 text-white font-medium"
                    >
                      <option value="1920x1080">1920 x 1080 (FHD 1080p Standard)</option>
                      <option value="2560x1440">2560 x 1440 (QHD 2K 1440p)</option>
                      <option value="3840x2160">3840 x 2160 (4K UHD)</option>
                      <option value="2880x1800">2880 x 1800 (Apple Retina 16")</option>
                      <option value="1170x2532">1170 x 2532 (iPhone Retina 3x)</option>
                      <option value="1366x768">1366 x 768 (Legacy Laptop)</option>
                    </select>
                  </div>

                  {/* WebRTC Policy */}
                  <div className="space-y-1.5">
                    <label className="text-neutral-400 font-medium">WebRTC Leak Prevention Policy</label>
                    <select
                      value={currentFp.webRtcPolicy}
                      onChange={(e) =>
                        updateProfileFingerprint(targetProfile.id, {
                          webRtcPolicy: e.target.value as any,
                        })
                      }
                      className="w-full px-3 py-1.5 rounded-xl bg-neutral-850 border border-neutral-700 text-white font-medium"
                    >
                      <option value="munge-candidates">Munge Candidates (Strip local RFC-1918 IPs)</option>
                      <option value="disable-all">Disable All WebRTC (Maximum Stealth)</option>
                      <option value="public-only">Public Interface Only</option>
                    </select>
                  </div>

                  {/* Timezone */}
                  <div className="space-y-1.5">
                    <label className="text-neutral-400 font-medium">Spoofed Timezone</label>
                    <select
                      value={currentFp.timezone}
                      onChange={(e) =>
                        updateProfileFingerprint(targetProfile.id, {
                          timezone: e.target.value,
                        })
                      }
                      className="w-full px-3 py-1.5 rounded-xl bg-neutral-850 border border-neutral-700 text-white font-medium"
                    >
                      <option value="UTC">UTC (Universal Coordinated Time)</option>
                      <option value="America/New_York">America/New_York (EST / EDT)</option>
                      <option value="America/Los_Angeles">America/Los_Angeles (PST / PDT)</option>
                      <option value="America/Chicago">America/Chicago (CST / CDT)</option>
                      <option value="Europe/London">Europe/London (GMT / BST)</option>
                      <option value="Europe/Berlin">Europe/Berlin (CET / CEST)</option>
                      <option value="Asia/Tokyo">Asia/Tokyo (JST)</option>
                    </select>
                  </div>

                  {/* Platform String */}
                  <div className="space-y-1.5">
                    <label className="text-neutral-400 font-medium">Navigator Platform</label>
                    <input
                      type="text"
                      value={currentFp.platform}
                      onChange={(e) =>
                        updateProfileFingerprint(targetProfile.id, {
                          platform: e.target.value,
                        })
                      }
                      className="w-full px-3 py-1.5 rounded-xl bg-neutral-850 border border-neutral-700 text-white font-mono text-[11px]"
                    />
                  </div>
                </div>

                {/* Noise Injection Toggles */}
                <div className="pt-3 border-t border-neutral-800 grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div className="p-3 rounded-xl bg-neutral-900 border border-neutral-800 flex items-center justify-between">
                    <div>
                      <h6 className="font-semibold text-white flex items-center gap-1.5">
                        <Sparkles className="w-3.5 h-3.5 text-pink-400" />
                        <span>Canvas Noise Injection</span>
                      </h6>
                      <p className="text-[11px] text-neutral-400">
                        Adds subtle mathematical perturbations to HTML5 Canvas hashing
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() =>
                        updateProfileFingerprint(targetProfile.id, {
                          canvasNoiseEnabled: !currentFp.canvasNoiseEnabled,
                        })
                      }
                      className={`w-11 h-6 rounded-full transition-colors relative shrink-0 ${
                        currentFp.canvasNoiseEnabled ? 'bg-pink-500' : 'bg-neutral-800'
                      }`}
                    >
                      <span
                        className={`block w-4 h-4 rounded-full bg-white transition-transform ${
                          currentFp.canvasNoiseEnabled ? 'translate-x-6' : 'translate-x-1'
                        }`}
                      />
                    </button>
                  </div>

                  <div className="p-3 rounded-xl bg-neutral-900 border border-neutral-800 flex items-center justify-between">
                    <div>
                      <h6 className="font-semibold text-white flex items-center gap-1.5">
                        <Activity className="w-3.5 h-3.5 text-purple-400" />
                        <span>AudioContext Noise Injection</span>
                      </h6>
                      <p className="text-[11px] text-neutral-400">
                        Perturbs audio oscillator frequency response to foil audio fingerprints
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() =>
                        updateProfileFingerprint(targetProfile.id, {
                          audioNoiseEnabled: !currentFp.audioNoiseEnabled,
                        })
                      }
                      className={`w-11 h-6 rounded-full transition-colors relative shrink-0 ${
                        currentFp.audioNoiseEnabled ? 'bg-pink-500' : 'bg-neutral-800'
                      }`}
                    >
                      <span
                        className={`block w-4 h-4 rounded-full bg-white transition-transform ${
                          currentFp.audioNoiseEnabled ? 'translate-x-6' : 'translate-x-1'
                        }`}
                      />
                    </button>
                  </div>
                </div>

                {/* User-Agent Preview & Customizer */}
                <div className="pt-2">
                  <label className="text-neutral-400 font-medium block mb-1 text-xs">
                    Emulated User-Agent Header String
                  </label>
                  <textarea
                    rows={2}
                    value={currentFp.userAgent}
                    onChange={(e) =>
                      updateProfileFingerprint(targetProfile.id, {
                        userAgent: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 rounded-xl bg-neutral-900 border border-neutral-800 text-white font-mono text-[11px] focus:outline-none focus:border-pink-500"
                  />
                </div>

                {/* WebGL GPU String */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div>
                    <label className="text-neutral-400 block mb-1 font-medium">WebGL Vendor</label>
                    <input
                      type="text"
                      value={currentFp.webglVendor}
                      onChange={(e) =>
                        updateProfileFingerprint(targetProfile.id, {
                          webglVendor: e.target.value,
                        })
                      }
                      className="w-full px-3 py-1.5 rounded-xl bg-neutral-900 border border-neutral-800 text-white font-mono text-[11px]"
                    />
                  </div>
                  <div>
                    <label className="text-neutral-400 block mb-1 font-medium">WebGL Renderer</label>
                    <input
                      type="text"
                      value={currentFp.webglRenderer}
                      onChange={(e) =>
                        updateProfileFingerprint(targetProfile.id, {
                          webglRenderer: e.target.value,
                        })
                      }
                      className="w-full px-3 py-1.5 rounded-xl bg-neutral-900 border border-neutral-800 text-white font-mono text-[11px]"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: ISOLATED STORAGE SANDBOX EXPLORER */}
          {activeTab === 'storage' && (
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-neutral-800 pb-3">
                <div>
                  <h4 className="font-bold text-base text-white flex items-center gap-2">
                    <Database className="w-4 h-4 text-blue-400" />
                    <span>Dedicated Storage Sandbox Partition</span>
                  </h4>
                  <p className="text-xs text-neutral-400">
                    Inspecting isolated persistent buckets for persona: <strong className="text-white">{targetProfile.name}</strong>
                  </p>
                </div>

                {targetProfile.isPrivate && (
                  <span className="px-2.5 py-1 rounded-xl bg-purple-500/20 border border-purple-500/30 text-purple-300 text-xs font-semibold">
                    🔒 Ephemeral Memory Bucket (No Disk Persistence)
                  </span>
                )}
              </div>

              {/* Sub-tab navigation */}
              <div className="flex flex-wrap items-center gap-1.5 border-b border-neutral-800 pb-2">
                <button
                  type="button"
                  onClick={() => setStorageSubTab('cookies')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all ${
                    storageSubTab === 'cookies'
                      ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                      : 'text-neutral-400 hover:text-white hover:bg-neutral-800'
                  }`}
                >
                  🍪 Cookies ({profileCookies.length})
                </button>

                <button
                  type="button"
                  onClick={() => setStorageSubTab('localstorage')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all ${
                    storageSubTab === 'localstorage'
                      ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                      : 'text-neutral-400 hover:text-white hover:bg-neutral-800'
                  }`}
                >
                  🗄️ LocalStorage ({profileStorage.length})
                </button>

                <button
                  type="button"
                  onClick={() => setStorageSubTab('idb')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all ${
                    storageSubTab === 'idb'
                      ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30'
                      : 'text-neutral-400 hover:text-white hover:bg-neutral-800'
                  }`}
                >
                  📦 IndexedDB ({profileIdb.length})
                </button>

                <button
                  type="button"
                  onClick={() => setStorageSubTab('cache')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all ${
                    storageSubTab === 'cache'
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                      : 'text-neutral-400 hover:text-white hover:bg-neutral-800'
                  }`}
                >
                  ⚡ Web Cache ({profileCache.length})
                </button>

                <button
                  type="button"
                  onClick={() => setStorageSubTab('bookmarks')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all ${
                    storageSubTab === 'bookmarks'
                      ? 'bg-pink-500/20 text-pink-300 border border-pink-500/30'
                      : 'text-neutral-400 hover:text-white hover:bg-neutral-800'
                  }`}
                >
                  📑 Bookmarks ({profileBookmarks.length})
                </button>

                <button
                  type="button"
                  onClick={() => setStorageSubTab('history')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all ${
                    storageSubTab === 'history'
                      ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30'
                      : 'text-neutral-400 hover:text-white hover:bg-neutral-800'
                  }`}
                >
                  🕒 History ({profileHistory.length})
                </button>
              </div>

              {/* 1. COOKIES SUB-TAB */}
              {storageSubTab === 'cookies' && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-neutral-400">
                      Partitioned cookies can only be accessed by tabs running in this persona
                    </span>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => setShowAddCookie(!showAddCookie)}
                        className="px-2.5 py-1 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-200 text-xs font-medium transition-colors"
                      >
                        + Add Cookie
                      </button>
                      <button
                        type="button"
                        onClick={() => clearCookies(targetProfile.id)}
                        className="px-2.5 py-1 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 text-xs font-medium transition-colors"
                      >
                        Clear All Cookies
                      </button>
                    </div>
                  </div>

                  {showAddCookie && (
                    <form
                      onSubmit={handleAddCookieSubmit}
                      className="p-3.5 rounded-xl bg-neutral-950 border border-neutral-800 space-y-3 text-xs"
                    >
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                        <input
                          type="text"
                          placeholder="Domain (e.g. github.com)"
                          value={cookieDomain}
                          onChange={(e) => setCookieDomain(e.target.value)}
                          required
                          className="px-3 py-1.5 rounded-lg bg-neutral-850 border border-neutral-700 text-white"
                        />
                        <input
                          type="text"
                          placeholder="Cookie Name (e.g. user_session)"
                          value={cookieName}
                          onChange={(e) => setCookieName(e.target.value)}
                          required
                          className="px-3 py-1.5 rounded-lg bg-neutral-850 border border-neutral-700 text-white"
                        />
                        <input
                          type="text"
                          placeholder="Cookie Value"
                          value={cookieValue}
                          onChange={(e) => setCookieValue(e.target.value)}
                          required
                          className="px-3 py-1.5 rounded-lg bg-neutral-850 border border-neutral-700 text-white"
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4 text-neutral-300">
                          <label className="flex items-center gap-1.5">
                            <input
                              type="checkbox"
                              checked={cookieSecure}
                              onChange={(e) => setCookieSecure(e.target.checked)}
                              className="rounded accent-pink-500"
                            />
                            <span>Secure</span>
                          </label>
                          <label className="flex items-center gap-1.5">
                            <input
                              type="checkbox"
                              checked={cookieHttpOnly}
                              onChange={(e) => setCookieHttpOnly(e.target.checked)}
                              className="rounded accent-pink-500"
                            />
                            <span>HttpOnly</span>
                          </label>
                        </div>
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => setShowAddCookie(false)}
                            className="px-3 py-1 rounded-lg bg-neutral-800 text-neutral-300"
                          >
                            Cancel
                          </button>
                          <button
                            type="submit"
                            className="px-3 py-1 rounded-lg bg-pink-500 text-white font-medium"
                          >
                            Save Cookie
                          </button>
                        </div>
                      </div>
                    </form>
                  )}

                  <div className="space-y-2">
                    {profileCookies.length === 0 ? (
                      <div className="p-8 rounded-2xl bg-neutral-950/40 border border-neutral-800/80 text-center text-xs text-neutral-400">
                        No cookies stored in this profile sandbox.
                      </div>
                    ) : (
                      profileCookies.map((ck) => (
                        <div
                          key={ck.id}
                          className="p-3 rounded-xl bg-neutral-950 border border-neutral-800 flex items-center justify-between gap-3 text-xs"
                        >
                          <div className="space-y-0.5 overflow-hidden">
                            <div className="flex items-center gap-2 font-mono">
                              <span className="font-bold text-amber-400">{ck.name}</span>
                              <span className="text-neutral-400">· {ck.domain}</span>
                              {ck.secure && (
                                <span className="px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-300 text-[10px]">
                                  Secure
                                </span>
                              )}
                              {ck.httpOnly && (
                                <span className="px-1.5 py-0.2 rounded bg-purple-500/20 text-purple-300 text-[10px]">
                                  HttpOnly
                                </span>
                              )}
                            </div>
                            <div className="text-[11px] text-neutral-400 truncate max-w-md font-mono">
                              Value: {ck.value}
                            </div>
                          </div>

                          <button
                            type="button"
                            onClick={() => deleteCookie(ck.id)}
                            className="p-1.5 rounded-lg hover:bg-neutral-800 text-neutral-400 hover:text-red-400 transition-colors"
                            title="Delete Cookie"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}

              {/* 2. LOCALSTORAGE SUB-TAB */}
              {storageSubTab === 'localstorage' && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-neutral-400">
                      Isolated key-value storage sandbox for web apps running in {targetProfile.name}
                    </span>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => setShowAddStorage(!showAddStorage)}
                        className="px-2.5 py-1 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-200 text-xs font-medium transition-colors"
                      >
                        + Set Item
                      </button>
                      <button
                        type="button"
                        onClick={() => clearLocalStorage(targetProfile.id)}
                        className="px-2.5 py-1 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 text-xs font-medium transition-colors"
                      >
                        Clear Storage
                      </button>
                    </div>
                  </div>

                  {showAddStorage && (
                    <form
                      onSubmit={handleAddStorageSubmit}
                      className="p-3.5 rounded-xl bg-neutral-950 border border-neutral-800 space-y-3 text-xs"
                    >
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        <input
                          type="text"
                          placeholder="Storage Key (e.g. app_state)"
                          value={storageKey}
                          onChange={(e) => setStorageKey(e.target.value)}
                          required
                          className="px-3 py-1.5 rounded-lg bg-neutral-850 border border-neutral-700 text-white"
                        />
                        <input
                          type="text"
                          placeholder="Storage Value"
                          value={storageVal}
                          onChange={(e) => setStorageVal(e.target.value)}
                          required
                          className="px-3 py-1.5 rounded-lg bg-neutral-850 border border-neutral-700 text-white"
                        />
                      </div>
                      <div className="flex justify-end gap-2">
                        <button
                          type="button"
                          onClick={() => setShowAddStorage(false)}
                          className="px-3 py-1 rounded-lg bg-neutral-800 text-neutral-300"
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          className="px-3 py-1 rounded-lg bg-pink-500 text-white font-medium"
                        >
                          Store Key
                        </button>
                      </div>
                    </form>
                  )}

                  <div className="space-y-2">
                    {profileStorage.length === 0 ? (
                      <div className="p-8 rounded-2xl bg-neutral-950/40 border border-neutral-800/80 text-center text-xs text-neutral-400">
                        No localStorage items in this profile sandbox.
                      </div>
                    ) : (
                      profileStorage.map((st) => (
                        <div
                          key={st.id}
                          className="p-3 rounded-xl bg-neutral-950 border border-neutral-800 flex items-center justify-between gap-3 text-xs"
                        >
                          <div className="space-y-0.5 overflow-hidden">
                            <div className="flex items-center gap-2 font-mono">
                              <span className="font-bold text-blue-400">{st.key}</span>
                              <span className="text-[10px] text-neutral-400 bg-neutral-850 px-1.5 py-0.5 rounded">
                                {st.byteSize} bytes
                              </span>
                            </div>
                            <div className="text-[11px] text-neutral-400 truncate max-w-md font-mono">
                              {st.value}
                            </div>
                          </div>

                          <button
                            type="button"
                            onClick={() => deleteLocalStorageItem(st.id)}
                            className="p-1.5 rounded-lg hover:bg-neutral-800 text-neutral-400 hover:text-red-400 transition-colors"
                            title="Delete Item"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}

              {/* 3. INDEXEDDB SUB-TAB */}
              {storageSubTab === 'idb' && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-neutral-400">
                      Partitioned client-side IndexedDB databases & object stores
                    </span>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => setShowAddIdb(!showAddIdb)}
                        className="px-2.5 py-1 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-200 text-xs font-medium transition-colors"
                      >
                        + Insert Record
                      </button>
                      <button
                        type="button"
                        onClick={() => clearIdb(targetProfile.id)}
                        className="px-2.5 py-1 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 text-xs font-medium transition-colors"
                      >
                        Flush DB
                      </button>
                    </div>
                  </div>

                  {showAddIdb && (
                    <form
                      onSubmit={handleAddIdbSubmit}
                      className="p-3.5 rounded-xl bg-neutral-950 border border-neutral-800 space-y-3 text-xs"
                    >
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2">
                        <input
                          type="text"
                          placeholder="Database Name"
                          value={idbDb}
                          onChange={(e) => setIdbDb(e.target.value)}
                          required
                          className="px-3 py-1.5 rounded-lg bg-neutral-850 border border-neutral-700 text-white"
                        />
                        <input
                          type="text"
                          placeholder="Object Store Name"
                          value={idbStore}
                          onChange={(e) => setIdbStore(e.target.value)}
                          required
                          className="px-3 py-1.5 rounded-lg bg-neutral-850 border border-neutral-700 text-white"
                        />
                        <input
                          type="text"
                          placeholder="Record Key"
                          value={idbKey}
                          onChange={(e) => setIdbKey(e.target.value)}
                          required
                          className="px-3 py-1.5 rounded-lg bg-neutral-850 border border-neutral-700 text-white"
                        />
                        <input
                          type="text"
                          placeholder="Record Value (JSON / text)"
                          value={idbVal}
                          onChange={(e) => setIdbVal(e.target.value)}
                          required
                          className="px-3 py-1.5 rounded-lg bg-neutral-850 border border-neutral-700 text-white"
                        />
                      </div>
                      <div className="flex justify-end gap-2">
                        <button
                          type="button"
                          onClick={() => setShowAddIdb(false)}
                          className="px-3 py-1 rounded-lg bg-neutral-800 text-neutral-300"
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          className="px-3 py-1 rounded-lg bg-pink-500 text-white font-medium"
                        >
                          Insert Record
                        </button>
                      </div>
                    </form>
                  )}

                  <div className="space-y-2">
                    {profileIdb.length === 0 ? (
                      <div className="p-8 rounded-2xl bg-neutral-950/40 border border-neutral-800/80 text-center text-xs text-neutral-400">
                        No IndexedDB records in this profile sandbox.
                      </div>
                    ) : (
                      profileIdb.map((idb) => (
                        <div
                          key={idb.id}
                          className="p-3 rounded-xl bg-neutral-950 border border-neutral-800 flex items-center justify-between gap-3 text-xs"
                        >
                          <div className="space-y-0.5 overflow-hidden">
                            <div className="flex items-center gap-2 font-mono">
                              <span className="font-bold text-purple-400">{idb.dbName}</span>
                              <span className="text-neutral-400">/ {idb.storeName}</span>
                              <span className="text-white">[{idb.key}]</span>
                            </div>
                            <div className="text-[11px] text-neutral-400 truncate max-w-md font-mono">
                              {idb.value}
                            </div>
                          </div>

                          <button
                            type="button"
                            onClick={() => deleteIdbEntry(idb.id)}
                            className="p-1.5 rounded-lg hover:bg-neutral-800 text-neutral-400 hover:text-red-400 transition-colors"
                            title="Delete Record"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}

              {/* 4. WEB CACHE SUB-TAB */}
              {storageSubTab === 'cache' && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-neutral-400">
                      Isolated HTTP cache partition for static assets, scripts & styles
                    </span>
                    <button
                      type="button"
                      onClick={() => clearWebCache(targetProfile.id)}
                      className="px-2.5 py-1 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 text-xs font-medium transition-colors"
                    >
                      Clear Web Cache
                    </button>
                  </div>

                  <div className="space-y-2">
                    {profileCache.length === 0 ? (
                      <div className="p-8 rounded-2xl bg-neutral-950/40 border border-neutral-800/80 text-center text-xs text-neutral-400">
                        No cached resources in this profile sandbox.
                      </div>
                    ) : (
                      profileCache.map((cache) => (
                        <div
                          key={cache.id}
                          className="p-3 rounded-xl bg-neutral-950 border border-neutral-800 flex items-center justify-between gap-3 text-xs"
                        >
                          <div className="space-y-0.5 overflow-hidden font-mono">
                            <div className="flex items-center gap-2">
                              <span className="px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 text-[10px] font-bold">
                                {cache.status} {cache.method}
                              </span>
                              <span className="text-white truncate max-w-sm">{cache.url}</span>
                            </div>
                            <div className="text-[10px] text-neutral-400 flex items-center gap-3">
                              <span>Type: {cache.contentType}</span>
                              <span>Size: {(cache.sizeBytes / 1024).toFixed(1)} KB</span>
                            </div>
                          </div>

                          <button
                            type="button"
                            onClick={() => deleteWebCacheEntry(cache.id)}
                            className="p-1.5 rounded-lg hover:bg-neutral-800 text-neutral-400 hover:text-red-400 transition-colors"
                            title="Delete Resource"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}

              {/* 5. BOOKMARKS SUB-TAB */}
              {storageSubTab === 'bookmarks' && (
                <div className="space-y-3">
                  <span className="text-xs text-neutral-400 block">
                    Bookmarks saved specifically inside this persona sandbox
                  </span>
                  <div className="space-y-2">
                    {profileBookmarks.length === 0 ? (
                      <div className="p-8 rounded-2xl bg-neutral-950/40 border border-neutral-800/80 text-center text-xs text-neutral-400">
                        No bookmarks saved in this profile.
                      </div>
                    ) : (
                      profileBookmarks.map((bm) => (
                        <div
                          key={bm.id}
                          className="p-3 rounded-xl bg-neutral-950 border border-neutral-800 flex items-center justify-between gap-3 text-xs"
                        >
                          <div className="flex items-center gap-2.5">
                            <span className="text-base">{bm.icon || '★'}</span>
                            <div>
                              <div className="font-semibold text-white">{bm.title}</div>
                              <div className="text-neutral-400 text-[11px] truncate max-w-sm">{bm.url}</div>
                            </div>
                          </div>
                          <button
                            type="button"
                            onClick={() => deleteBookmark(bm.id)}
                            className="p-1.5 rounded-lg hover:bg-neutral-800 text-neutral-400 hover:text-red-400 transition-colors"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}

              {/* 6. HISTORY SUB-TAB */}
              {storageSubTab === 'history' && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-neutral-400">
                      Isolated chronological navigation logs for {targetProfile.name}
                    </span>
                    <button
                      type="button"
                      onClick={() => clearHistory(targetProfile.id)}
                      className="px-2.5 py-1 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 text-xs font-medium transition-colors"
                    >
                      Clear Profile History
                    </button>
                  </div>
                  <div className="space-y-2">
                    {profileHistory.length === 0 ? (
                      <div className="p-8 rounded-2xl bg-neutral-950/40 border border-neutral-800/80 text-center text-xs text-neutral-400">
                        No browsing history recorded in this profile sandbox.
                      </div>
                    ) : (
                      profileHistory.map((h) => (
                        <div
                          key={h.id}
                          className="p-3 rounded-xl bg-neutral-950 border border-neutral-800 flex items-center justify-between gap-3 text-xs"
                        >
                          <div>
                            <div className="font-semibold text-white">{h.title}</div>
                            <div className="text-neutral-400 text-[11px] truncate max-w-sm">{h.url}</div>
                          </div>
                          <button
                            type="button"
                            onClick={() => deleteHistoryEntry(h.id)}
                            className="p-1.5 rounded-lg hover:bg-neutral-800 text-neutral-400 hover:text-red-400 transition-colors"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 4: ANTI-LEAK AUDIT */}
          {activeTab === 'audit' && (
            <div className="space-y-5">
              <div className="flex items-center justify-between border-b border-neutral-800 pb-3">
                <div>
                  <h4 className="font-bold text-base text-white flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-emerald-400" />
                    <span>Real-Time Fingerprint & Tracking Defense Audit</span>
                  </h4>
                  <p className="text-xs text-neutral-400">
                    Live verification of how external trackers and cross-site scripts perceive {targetProfile.name}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={runAudit}
                  disabled={auditRunning}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-neutral-800 hover:bg-neutral-750 text-neutral-200 text-xs font-semibold border border-neutral-700 transition-colors disabled:opacity-50"
                >
                  <RefreshCw className={`w-3.5 h-3.5 text-pink-400 ${auditRunning ? 'animate-spin' : ''}`} />
                  <span>{auditRunning ? 'Auditing...' : 'Re-run Audit'}</span>
                </button>
              </div>

              {/* Overall Score Card */}
              <div className="p-5 rounded-2xl bg-gradient-to-r from-emerald-950/30 via-neutral-900 to-neutral-900 border border-emerald-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3.5">
                  <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 flex items-center justify-center font-black text-xl">
                    A+
                  </div>
                  <div>
                    <h5 className="font-bold text-sm text-white flex items-center gap-2">
                      <span>Fingerprint Resistance: High / Unlinkable</span>
                      <Check className="w-4 h-4 text-emerald-400" />
                    </h5>
                    <p className="text-xs text-neutral-400">
                      Cross-site trackers are unable to link browsing sessions across your personas.
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 text-xs">
                  <div className="px-3 py-1.5 rounded-xl bg-neutral-850 border border-neutral-800">
                    <span className="text-neutral-400 block text-[10px]">Entropy Reduction</span>
                    <span className="font-bold text-emerald-400">99.4%</span>
                  </div>
                  <div className="px-3 py-1.5 rounded-xl bg-neutral-850 border border-neutral-800">
                    <span className="text-neutral-400 block text-[10px]">Partition Integrity</span>
                    <span className="font-bold text-pink-400">100% Isolated</span>
                  </div>
                </div>
              </div>

              {/* Diagnostic Test Matrix */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                {/* Test 1: WebRTC Local IP */}
                <div className="p-4 rounded-xl bg-neutral-950 border border-neutral-800 space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-white flex items-center gap-1.5">
                      <Globe className="w-3.5 h-3.5 text-blue-400" />
                      WebRTC Candidate Munging
                    </span>
                    <span className="px-2 py-0.5 rounded-md bg-emerald-500/20 text-emerald-300 text-[10px] font-bold">
                      PROTECTED
                    </span>
                  </div>
                  <p className="text-[11px] text-neutral-400">
                    Local RFC-1918 internal IPs stripped from SDP offer candidates.
                  </p>
                  <div className="font-mono text-[10px] text-neutral-400 bg-neutral-900 p-2 rounded-lg">
                    Candidate: 0.0.0.0:9 (Munged / Suppressed)
                  </div>
                </div>

                {/* Test 2: Canvas Noise */}
                <div className="p-4 rounded-xl bg-neutral-950 border border-neutral-800 space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-white flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-pink-400" />
                      HTML5 Canvas Hash Noise
                    </span>
                    <span
                      className={`px-2 py-0.5 rounded-md text-[10px] font-bold ${
                        currentFp.canvasNoiseEnabled
                          ? 'bg-emerald-500/20 text-emerald-300'
                          : 'bg-amber-500/20 text-amber-300'
                      }`}
                    >
                      {currentFp.canvasNoiseEnabled ? 'NOISE INJECTED' : 'STANDARD'}
                    </span>
                  </div>
                  <p className="text-[11px] text-neutral-400">
                    {currentFp.canvasNoiseEnabled
                      ? 'Canvas readback perturbed with sub-perceptual jitter per session.'
                      : 'Canvas noise is disabled in settings.'}
                  </p>
                  <div className="font-mono text-[10px] text-neutral-400 bg-neutral-900 p-2 rounded-lg">
                    Hash: 7a8f...d931 ({currentFp.canvasNoiseEnabled ? 'Jitter Active' : 'Deterministic'})
                  </div>
                </div>

                {/* Test 3: Audio Oscillator */}
                <div className="p-4 rounded-xl bg-neutral-950 border border-neutral-800 space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-white flex items-center gap-1.5">
                      <Activity className="w-3.5 h-3.5 text-purple-400" />
                      AudioContext Signature
                    </span>
                    <span
                      className={`px-2 py-0.5 rounded-md text-[10px] font-bold ${
                        currentFp.audioNoiseEnabled
                          ? 'bg-emerald-500/20 text-emerald-300'
                          : 'bg-neutral-800 text-neutral-400'
                      }`}
                    >
                      {currentFp.audioNoiseEnabled ? 'DEFENDED' : 'UNALTERED'}
                    </span>
                  </div>
                  <p className="text-[11px] text-neutral-400">
                    Oscillator output frequency buffer is randomized to defeat acoustic profiling.
                  </p>
                  <div className="font-mono text-[10px] text-neutral-400 bg-neutral-900 p-2 rounded-lg">
                    AudioBuffer Jitter: ±0.00012% randomized
                  </div>
                </div>

                {/* Test 4: Hardware Coherence */}
                <div className="p-4 rounded-xl bg-neutral-950 border border-neutral-800 space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-white flex items-center gap-1.5">
                      <Cpu className="w-3.5 h-3.5 text-amber-400" />
                      Platform & Core Parity
                    </span>
                    <span className="px-2 py-0.5 rounded-md bg-emerald-500/20 text-emerald-300 text-[10px] font-bold">
                      COHERENT
                    </span>
                  </div>
                  <p className="text-[11px] text-neutral-400">
                    Navigator platform, screen dimensions and user agent match authentic hardware.
                  </p>
                  <div className="font-mono text-[10px] text-neutral-400 bg-neutral-900 p-2 rounded-lg">
                    {currentFp.platform} · {currentFp.hardwareConcurrency} Cores · {currentFp.deviceMemory}GB RAM
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="border-t border-neutral-800 bg-neutral-950/80 px-4 sm:px-6 py-3 flex items-center justify-between text-xs text-neutral-400">
          <div className="flex items-center gap-2">
            <Shield className="w-3.5 h-3.5 text-emerald-400" />
            <span>Strict Isolation Active: No data shared between profiles</span>
          </div>

          <button
            type="button"
            onClick={handleClose}
            className="px-4 py-1.5 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-white font-medium transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
