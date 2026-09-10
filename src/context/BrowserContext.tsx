import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import {
  BrowserProfile,
  BrowserSettings,
  BrowserTab,
  CandyRule,
  CandyTrailNode,
  PrivacyStats,
  ProfileBookmark,
  ProfileCookie,
  ProfileFingerprint,
  ProfileFingerprintPreset,
  ProfileHistoryEntry,
  ProfileIDBEntry,
  ProfileStorageItem,
  ProfileWebCacheEntry,
  ReaderArticle,
  ReaderSettings,
  SiteCapsule,
  SnoozedTab,
  StackColor,
  TabStack,
} from '../types';
import {
  FINGERPRINT_PRESETS,
  INITIAL_BOOKMARKS,
  INITIAL_CANDY_RULES,
  INITIAL_CAPSULES,
  INITIAL_COOKIES,
  INITIAL_HISTORY,
  INITIAL_IDB,
  INITIAL_PROFILES,
  INITIAL_SETTINGS,
  INITIAL_STACKS,
  INITIAL_STORAGE,
  INITIAL_TABS,
  INITIAL_WEB_CACHE,
  SEARCH_ENGINES,
  SIMULATED_PAGES,
} from '../data/initialData';

interface BrowserContextType {
  // Tabs & Navigation
  tabs: BrowserTab[];
  activeTabId: string;
  activeTab: BrowserTab;
  activeProfileTabs: BrowserTab[];
  openTab: (url?: string, title?: string, options?: { parentTabId?: string; isPrivate?: boolean; profileId?: string }) => void;
  closeTab: (tabId: string) => void;
  closeAllTabs: (keepPinned?: boolean) => void;
  switchTab: (tabId: string) => void;
  navigateTab: (tabId: string, url: string) => void;
  goBack: (tabId?: string) => void;
  goForward: (tabId?: string) => void;
  reloadTab: (tabId?: string) => void;
  duplicateTab: (tabId: string) => void;
  togglePinTab: (tabId: string) => void;
  toggleMuteTab: (tabId: string) => void;
  toggleDesktopMode: (tabId: string) => void;
  setTabZoom: (tabId: string, zoom: number) => void;
  snoozeTab: (tabId: string, hours: number, label: string) => void;
  wakeSnoozedTab: (snoozedId: string) => void;
  deleteSnoozedTab: (snoozedId: string) => void;
  snoozedTabs: SnoozedTab[];

  // Tab Stacks
  stacks: TabStack[];
  createStack: (name: string, color: StackColor, tabIds?: string[]) => void;
  editStack: (id: string, name: string, color: StackColor) => void;
  deleteStack: (id: string) => void;
  addTabToStack: (tabId: string, stackId: string) => void;
  removeTabFromStack: (tabId: string) => void;
  toggleStackCollapse: (stackId: string) => void;

  // Profiles & Hardware Fingerprint
  profiles: BrowserProfile[];
  activeProfileId: string;
  activeProfile: BrowserProfile;
  switchProfile: (profileId: string) => void;
  createProfile: (name: string, icon: string, accentColor: string, wallpaper: any, preset?: ProfileFingerprintPreset) => void;
  updateProfileWallpaper: (profileId: string, wallpaper: any) => void;
  updateProfileFingerprint: (profileId: string, updates: Partial<ProfileFingerprint>) => void;
  applyFingerprintPreset: (profileId: string, preset: ProfileFingerprintPreset) => void;

  // Multi-Profile Storage Sandbox
  cookies: ProfileCookie[];
  activeProfileCookies: ProfileCookie[];
  addCookie: (cookie: Omit<ProfileCookie, 'id' | 'profileId'>, profileId?: string) => void;
  deleteCookie: (id: string) => void;
  clearCookies: (profileId?: string) => void;

  localStorageItems: ProfileStorageItem[];
  activeProfileLocalStorage: ProfileStorageItem[];
  setLocalStorageItem: (key: string, value: string, profileId?: string) => void;
  deleteLocalStorageItem: (id: string) => void;
  clearLocalStorage: (profileId?: string) => void;

  idbEntries: ProfileIDBEntry[];
  activeProfileIdb: ProfileIDBEntry[];
  setIdbEntry: (dbName: string, storeName: string, key: string, value: string, profileId?: string) => void;
  deleteIdbEntry: (id: string) => void;
  clearIdb: (profileId?: string) => void;

  webCacheEntries: ProfileWebCacheEntry[];
  activeProfileWebCache: ProfileWebCacheEntry[];
  deleteWebCacheEntry: (id: string) => void;
  clearWebCache: (profileId?: string) => void;

  bookmarks: ProfileBookmark[];
  activeProfileBookmarks: ProfileBookmark[];
  addBookmark: (title: string, url: string, folder?: string, icon?: string, profileId?: string) => void;
  deleteBookmark: (id: string) => void;
  isBookmarked: (url: string) => boolean;

  history: ProfileHistoryEntry[];
  activeProfileHistory: ProfileHistoryEntry[];
  deleteHistoryEntry: (id: string) => void;
  clearHistory: (profileId?: string) => void;

  // Sandbox & Fingerprint Modal
  sandboxManagerOpen: boolean;
  setSandboxManagerOpen: (open: boolean) => void;
  sandboxInitialTab: 'personas' | 'fingerprint' | 'storage' | 'audit';
  openSandboxManager: (tab?: 'personas' | 'fingerprint' | 'storage' | 'audit') => void;

  // Candy Trails
  trailNodes: Record<string, CandyTrailNode>;
  clearTrail: () => void;
  activeTrailNodeId: string | null;

  // Site Capsules
  capsules: SiteCapsule[];
  createCapsule: (name: string, url: string, icon: string, color: string, desktopMode: boolean) => void;
  deleteCapsule: (id: string) => void;
  launchCapsule: (capsule: SiteCapsule) => void;

  // Reader Studio
  readerOpen: boolean;
  readerArticle: ReaderArticle | null;
  openReaderMode: (tab?: BrowserTab) => void;
  closeReaderMode: () => void;
  readerSettings: ReaderSettings;
  updateReaderSettings: (settings: Partial<ReaderSettings>) => void;
  savedArticles: ReaderArticle[];
  toggleSaveCurrentArticle: () => void;

  // Privacy X-Ray
  privacyStats: PrivacyStats;
  setPermission: (perm: 'camera' | 'microphone' | 'geolocation' | 'notifications', val: 'granted' | 'denied' | 'prompt') => void;
  rules: CandyRule[];
  toggleRule: (id: string) => void;
  addRule: (category: string, filter: string, type: 'css' | 'host') => void;
  deleteRule: (id: string) => void;

  // Link Peek
  peekState: { isOpen: boolean; url: string; title?: string; previewSnippet?: string };
  openLinkPeek: (url: string, title?: string, previewSnippet?: string) => void;
  closeLinkPeek: () => void;

  // UI Overlays & Sheets
  tabOverviewOpen: boolean;
  setTabOverviewOpen: (open: boolean) => void;
  trailSheetOpen: boolean;
  setTrailSheetOpen: (open: boolean) => void;
  privacyXRayOpen: boolean;
  setPrivacyXRayOpen: (open: boolean) => void;
  capsulesSheetOpen: boolean;
  setCapsulesSheetOpen: (open: boolean) => void;
  profilesModalOpen: boolean;
  setProfilesModalOpen: (open: boolean) => void;
  settingsOpen: boolean;
  setSettingsOpen: (open: boolean) => void;
  commandsMenuOpen: boolean;
  setCommandsMenuOpen: (open: boolean) => void;
  findInPageOpen: boolean;
  setFindInPageOpen: (open: boolean) => void;

  // Search & Omnibox Settings
  settings: BrowserSettings;
  updateSettings: (newSettings: Partial<BrowserSettings>) => void;
  executeCommand: (cmd: string) => void;
  resolveUrlOrSearch: (input: string, isAiMode?: boolean) => string;
  exportArchive: () => string;
  importArchive: (jsonStr: string) => boolean;
}

const BrowserContext = createContext<BrowserContextType | null>(null);

export const BrowserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Profiles
  const [profiles, setProfiles] = useState<BrowserProfile[]>(() => {
    try {
      const saved = localStorage.getItem('candy_profiles');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          const priv = INITIAL_PROFILES.find((p) => p.isPrivate);
          return priv && !parsed.some((p: BrowserProfile) => p.id === priv.id)
            ? [...parsed, priv]
            : parsed;
        }
      }
      return INITIAL_PROFILES;
    } catch {
      return INITIAL_PROFILES;
    }
  });
  const [activeProfileId, setActiveProfileId] = useState<string>('profile-personal');

  // Multi-Profile Storage Sandbox (Dedicated Sandboxes)
  const [cookies, setCookies] = useState<ProfileCookie[]>(() => {
    try {
      const saved = localStorage.getItem('candy_profile_cookies');
      return saved ? JSON.parse(saved) : INITIAL_COOKIES;
    } catch {
      return INITIAL_COOKIES;
    }
  });

  const [localStorageItems, setLocalStorageItems] = useState<ProfileStorageItem[]>(() => {
    try {
      const saved = localStorage.getItem('candy_profile_storage');
      return saved ? JSON.parse(saved) : INITIAL_STORAGE;
    } catch {
      return INITIAL_STORAGE;
    }
  });

  const [idbEntries, setIdbEntries] = useState<ProfileIDBEntry[]>(() => {
    try {
      const saved = localStorage.getItem('candy_profile_idb');
      return saved ? JSON.parse(saved) : INITIAL_IDB;
    } catch {
      return INITIAL_IDB;
    }
  });

  const [webCacheEntries, setWebCacheEntries] = useState<ProfileWebCacheEntry[]>(() => {
    try {
      const saved = localStorage.getItem('candy_profile_web_cache');
      return saved ? JSON.parse(saved) : INITIAL_WEB_CACHE;
    } catch {
      return INITIAL_WEB_CACHE;
    }
  });

  const [bookmarks, setBookmarks] = useState<ProfileBookmark[]>(() => {
    try {
      const saved = localStorage.getItem('candy_profile_bookmarks');
      return saved ? JSON.parse(saved) : INITIAL_BOOKMARKS;
    } catch {
      return INITIAL_BOOKMARKS;
    }
  });

  const [history, setHistory] = useState<ProfileHistoryEntry[]>(() => {
    try {
      const saved = localStorage.getItem('candy_profile_history');
      return saved ? JSON.parse(saved) : INITIAL_HISTORY;
    } catch {
      return INITIAL_HISTORY;
    }
  });

  // Sandbox & Fingerprint Modal State
  const [sandboxManagerOpen, setSandboxManagerOpen] = useState(false);
  const [sandboxInitialTab, setSandboxInitialTab] = useState<'personas' | 'fingerprint' | 'storage' | 'audit'>('personas');

  const openSandboxManager = useCallback((tab: 'personas' | 'fingerprint' | 'storage' | 'audit' = 'personas') => {
    setSandboxInitialTab(tab);
    setSandboxManagerOpen(true);
  }, []);

  // Tabs
  const [tabs, setTabs] = useState<BrowserTab[]>(INITIAL_TABS);
  const [activeTabId, setActiveTabId] = useState<string>('tab-1');
  const [snoozedTabs, setSnoozedTabs] = useState<SnoozedTab[]>([]);

  // Stacks
  const [stacks, setStacks] = useState<TabStack[]>(INITIAL_STACKS);

  // Settings
  const [settings, setSettings] = useState<BrowserSettings>(() => {
    try {
      const saved = localStorage.getItem('candy_settings');
      return saved ? JSON.parse(saved) : INITIAL_SETTINGS;
    } catch {
      return INITIAL_SETTINGS;
    }
  });

  // Candy Trails
  const [trailNodes, setTrailNodes] = useState<Record<string, CandyTrailNode>>(() => {
    return {
      'node-1': {
        id: 'node-1',
        tabId: 'tab-1',
        url: 'https://news.ycombinator.com',
        title: 'Hacker News',
        domain: 'news.ycombinator.com',
        timestamp: Date.now() - 300000,
        childrenIds: ['node-2', 'node-3'],
      },
      'node-2': {
        id: 'node-2',
        tabId: 'tab-2',
        url: 'https://candy.browser/trails',
        title: 'Candy Trails',
        domain: 'candy.browser',
        timestamp: Date.now() - 120000,
        parentId: 'node-1',
        childrenIds: [],
      },
      'node-3': {
        id: 'node-3',
        tabId: 'tab-3',
        url: 'https://en.wikipedia.org/wiki/Web_browser',
        title: 'Web browser - Wikipedia',
        domain: 'en.wikipedia.org',
        timestamp: Date.now() - 50000,
        parentId: 'node-1',
        childrenIds: [],
      },
    };
  });
  const [activeTrailNodeId, setActiveTrailNodeId] = useState<string | null>('node-1');

  // Capsules
  const [capsules, setCapsules] = useState<SiteCapsule[]>(() => {
    try {
      const saved = localStorage.getItem('candy_capsules');
      return saved ? JSON.parse(saved) : INITIAL_CAPSULES;
    } catch {
      return INITIAL_CAPSULES;
    }
  });

  // Reader Studio
  const [readerOpen, setReaderOpen] = useState(false);
  const [readerArticle, setReaderArticle] = useState<ReaderArticle | null>(null);
  const [readerSettings, setReaderSettings] = useState<ReaderSettings>({
    fontFamily: 'serif',
    fontSize: 18,
    lineHeight: 1.7,
    theme: 'dark',
    speechRate: 1.0,
  });
  const [savedArticles, setSavedArticles] = useState<ReaderArticle[]>([]);

  // Privacy & Rules
  const [rules, setRules] = useState<CandyRule[]>(INITIAL_CANDY_RULES);
  const [privacyStats, setPrivacyStats] = useState<PrivacyStats>({
    adsBlocked: 14,
    trackersBlocked: 8,
    cookiesBlocked: 3,
    httpsEncrypted: true,
    trackersList: [
      { domain: 'google-analytics.com', category: 'Analytics', blocked: true },
      { domain: 'doubleclick.net', category: 'Ad', blocked: true },
      { domain: 'connect.facebook.net', category: 'Tracker', blocked: true },
      { domain: 'clarity.ms', category: 'Analytics', blocked: true },
      { domain: 'consent.cookie-cdn.net', category: 'Consent', blocked: true },
    ],
    permissions: {
      camera: 'prompt',
      microphone: 'prompt',
      geolocation: 'prompt',
      notifications: 'denied',
    },
  });

  // Link Peek
  const [peekState, setPeekState] = useState<{ isOpen: boolean; url: string; title?: string; previewSnippet?: string }>({
    isOpen: false,
    url: '',
  });

  // Sheets and Modals
  const [tabOverviewOpen, setTabOverviewOpen] = useState(false);
  const [trailSheetOpen, setTrailSheetOpen] = useState(false);
  const [privacyXRayOpen, setPrivacyXRayOpen] = useState(false);
  const [capsulesSheetOpen, setCapsulesSheetOpen] = useState(false);
  const [profilesModalOpen, setProfilesModalOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [commandsMenuOpen, setCommandsMenuOpen] = useState(false);
  const [findInPageOpen, setFindInPageOpen] = useState(false);

  // Active Profile & Active Tab computations
  const activeProfile = useMemo(() => {
    return profiles.find((p) => p.id === activeProfileId) || profiles[0];
  }, [profiles, activeProfileId]);

  const activeTab = useMemo(() => {
    const found = tabs.find((t) => t.id === activeTabId);
    if (found) return found;
    return tabs[0] || INITIAL_TABS[0];
  }, [tabs, activeTabId]);

  // Scoped tabs and isolated storage for active profile
  const activeProfileTabs = useMemo(() => {
    return tabs.filter((t) => t.profileId === activeProfileId);
  }, [tabs, activeProfileId]);

  const activeProfileCookies = useMemo(() => {
    return cookies.filter((c) => c.profileId === activeProfileId);
  }, [cookies, activeProfileId]);

  const activeProfileLocalStorage = useMemo(() => {
    return localStorageItems.filter((s) => s.profileId === activeProfileId);
  }, [localStorageItems, activeProfileId]);

  const activeProfileIdb = useMemo(() => {
    return idbEntries.filter((i) => i.profileId === activeProfileId);
  }, [idbEntries, activeProfileId]);

  const activeProfileWebCache = useMemo(() => {
    return webCacheEntries.filter((w) => w.profileId === activeProfileId);
  }, [webCacheEntries, activeProfileId]);

  const activeProfileBookmarks = useMemo(() => {
    return bookmarks.filter((b) => b.profileId === activeProfileId);
  }, [bookmarks, activeProfileId]);

  const activeProfileHistory = useMemo(() => {
    return history.filter((h) => h.profileId === activeProfileId);
  }, [history, activeProfileId]);

  // Persist non-private profile sandbox storage (Privacy rule: no private data to localStorage)
  useEffect(() => {
    try {
      const nonPrivateCookies = cookies.filter((c) => c.profileId !== 'profile-private');
      localStorage.setItem('candy_profile_cookies', JSON.stringify(nonPrivateCookies));
    } catch {}
  }, [cookies]);

  useEffect(() => {
    try {
      const nonPrivateStorage = localStorageItems.filter((s) => s.profileId !== 'profile-private');
      localStorage.setItem('candy_profile_storage', JSON.stringify(nonPrivateStorage));
    } catch {}
  }, [localStorageItems]);

  useEffect(() => {
    try {
      const nonPrivateIdb = idbEntries.filter((i) => i.profileId !== 'profile-private');
      localStorage.setItem('candy_profile_idb', JSON.stringify(nonPrivateIdb));
    } catch {}
  }, [idbEntries]);

  useEffect(() => {
    try {
      const nonPrivateCache = webCacheEntries.filter((w) => w.profileId !== 'profile-private');
      localStorage.setItem('candy_profile_web_cache', JSON.stringify(nonPrivateCache));
    } catch {}
  }, [webCacheEntries]);

  useEffect(() => {
    try {
      const nonPrivateBookmarks = bookmarks.filter((b) => b.profileId !== 'profile-private');
      localStorage.setItem('candy_profile_bookmarks', JSON.stringify(nonPrivateBookmarks));
    } catch {}
  }, [bookmarks]);

  useEffect(() => {
    try {
      const nonPrivateHistory = history.filter((h) => h.profileId !== 'profile-private');
      localStorage.setItem('candy_profile_history', JSON.stringify(nonPrivateHistory));
    } catch {}
  }, [history]);

  useEffect(() => {
    try {
      const nonPrivateProfiles = profiles.filter((p) => !p.isPrivate);
      localStorage.setItem('candy_profiles', JSON.stringify(nonPrivateProfiles));
    } catch {}
  }, [profiles]);

  // Persist settings & capsules
  useEffect(() => {
    try {
      localStorage.setItem('candy_settings', JSON.stringify(settings));
    } catch (e) {
      // Ignored for privacy/quota
    }
  }, [settings]);

  useEffect(() => {
    try {
      localStorage.setItem('candy_capsules', JSON.stringify(capsules));
    } catch (e) {
      // Ignored
    }
  }, [capsules]);

  // Derive domain helper
  const extractDomain = (url: string) => {
    try {
      const u = new URL(url);
      return u.hostname;
    } catch {
      return url.split('/')[0] || 'candy.web';
    }
  };

  // Switch active profile
  const switchProfile = (profileId: string) => {
    setActiveProfileId(profileId);
    // Find first tab belonging to this profile, or create one
    const profileTabs = tabs.filter((t) => t.profileId === profileId);
    if (profileTabs.length > 0) {
      setActiveTabId(profileTabs[0].id);
    } else {
      const newTabId = 'tab-' + Math.random().toString(36).substring(2, 9);
      const isPriv = profiles.find((p) => p.id === profileId)?.isPrivate ?? false;
      const newTab: BrowserTab = {
        id: newTabId,
        url: 'https://news.ycombinator.com',
        title: isPriv ? 'Private Browsing' : 'New Tab',
        favicon: '🍬',
        profileId,
        isPrivate: isPriv,
        isPinned: false,
        isMuted: false,
        isDesktop: false,
        zoom: 100,
        lastAccessed: Date.now(),
        history: ['https://news.ycombinator.com'],
        historyIndex: 0,
      };
      setTabs((prev) => [...prev, newTab]);
      setActiveTabId(newTabId);
    }
  };

  // Open a new tab
  const openTab = useCallback(
    (
      url: string = 'https://news.ycombinator.com',
      title?: string,
      options?: { parentTabId?: string; isPrivate?: boolean; profileId?: string }
    ) => {
      const newTabId = 'tab-' + Math.random().toString(36).substring(2, 9);
      const targetProfileId = options?.profileId || activeProfileId;
      const targetIsPrivate = options?.isPrivate !== undefined ? options.isPrivate : activeProfile.isPrivate;

      const pageInfo = SIMULATED_PAGES[url];
      const tabTitle = title || pageInfo?.title || url.replace(/^https?:\/\//, '');

      // Create new trail node
      const newNodeId = 'node-' + Math.random().toString(36).substring(2, 9);
      const parentNodeId = options?.parentTabId ? tabs.find((t) => t.id === options.parentTabId)?.trailNodeId : activeTab?.trailNodeId;

      if (!targetIsPrivate) {
        setTrailNodes((prev) => {
          const updated = { ...prev };
          if (parentNodeId && updated[parentNodeId]) {
            updated[parentNodeId] = {
              ...updated[parentNodeId],
              childrenIds: [...updated[parentNodeId].childrenIds, newNodeId],
            };
          }
          updated[newNodeId] = {
            id: newNodeId,
            tabId: newTabId,
            url,
            title: tabTitle,
            domain: extractDomain(url),
            timestamp: Date.now(),
            parentId: parentNodeId,
            childrenIds: [],
          };
          return updated;
        });
        setActiveTrailNodeId(newNodeId);
      }

      const newTab: BrowserTab = {
        id: newTabId,
        url,
        title: tabTitle,
        favicon: url.includes('github') ? '🐙' : url.includes('wikipedia') ? 'W' : '🍬',
        profileId: targetProfileId,
        isPrivate: targetIsPrivate,
        isPinned: false,
        isMuted: false,
        isDesktop: false,
        zoom: 100,
        lastAccessed: Date.now(),
        history: [url],
        historyIndex: 0,
        trailNodeId: targetIsPrivate ? undefined : newNodeId,
        previewSnippet: pageInfo?.paragraphs[0] || 'Fast, private browsing with Candy Web engine.',
      };

      setTabs((prev) => [...prev, newTab]);
      setActiveTabId(newTabId);
      setTabOverviewOpen(false);
    },
    [activeProfileId, activeProfile.isPrivate, activeTab, tabs]
  );

  // Close a tab
  const closeTab = useCallback(
    (tabId: string) => {
      setTabs((prev) => {
        if (prev.length <= 1) {
          // Reset to home tab
          return [
            {
              id: 'tab-home',
              url: 'https://news.ycombinator.com',
              title: 'Hacker News',
              favicon: '🍬',
              profileId: activeProfileId,
              isPrivate: activeProfile.isPrivate,
              isPinned: false,
              isMuted: false,
              isDesktop: false,
              zoom: 100,
              lastAccessed: Date.now(),
              history: ['https://news.ycombinator.com'],
              historyIndex: 0,
            },
          ];
        }
        const filtered = prev.filter((t) => t.id !== tabId);
        if (activeTabId === tabId) {
          // Switch to adjacent tab
          const nextTab = filtered[filtered.length - 1];
          setActiveTabId(nextTab.id);
        }
        return filtered;
      });
    },
    [activeProfileId, activeProfile.isPrivate, activeTabId]
  );

  const closeAllTabs = useCallback(
    (keepPinned = true) => {
      setTabs((prev) => {
        const remaining = keepPinned ? prev.filter((t) => t.isPinned) : [];
        if (remaining.length === 0) {
          const freshTab: BrowserTab = {
            id: 'tab-fresh-' + Date.now(),
            url: 'https://news.ycombinator.com',
            title: 'New Tab',
            favicon: '🍬',
            profileId: activeProfileId,
            isPrivate: activeProfile.isPrivate,
            isPinned: false,
            isMuted: false,
            isDesktop: false,
            zoom: 100,
            lastAccessed: Date.now(),
            history: ['https://news.ycombinator.com'],
            historyIndex: 0,
          };
          setActiveTabId(freshTab.id);
          return [freshTab];
        }
        setActiveTabId(remaining[0].id);
        return remaining;
      });
    },
    [activeProfileId, activeProfile.isPrivate]
  );

  const switchTab = useCallback((tabId: string) => {
    setActiveTabId(tabId);
    setTabs((prev) =>
      prev.map((t) => (t.id === tabId ? { ...t, lastAccessed: Date.now() } : t))
    );
    setTabOverviewOpen(false);
  }, []);

  const navigateTab = useCallback(
    (tabId: string, targetUrl: string) => {
      let finalUrl = targetUrl;
      if (!/^https?:\/\//i.test(finalUrl) && !finalUrl.startsWith('candy://')) {
        finalUrl = 'https://' + finalUrl;
      }

      const page = SIMULATED_PAGES[finalUrl];
      const pageTitle = page?.title || finalUrl.replace(/^https?:\/\//, '');

      setTabs((prev) =>
        prev.map((t) => {
          if (t.id !== tabId) return t;
          const newHistory = [...t.history.slice(0, t.historyIndex + 1), finalUrl];
          return {
            ...t,
            url: finalUrl,
            title: pageTitle,
            history: newHistory,
            historyIndex: newHistory.length - 1,
            lastAccessed: Date.now(),
            previewSnippet: page?.paragraphs[0] || 'Browsing ' + finalUrl,
          };
        })
      );

      // Record in Candy Trail if not in private mode
      const tab = tabs.find((t) => t.id === tabId);
      if (tab && !tab.isPrivate) {
        const newNodeId = 'node-' + Math.random().toString(36).substring(2, 9);
        const parentNodeId = tab.trailNodeId;

        setTrailNodes((prev) => {
          const updated = { ...prev };
          if (parentNodeId && updated[parentNodeId]) {
            updated[parentNodeId] = {
              ...updated[parentNodeId],
              childrenIds: [...updated[parentNodeId].childrenIds, newNodeId],
            };
          }
          updated[newNodeId] = {
            id: newNodeId,
            tabId,
            url: finalUrl,
            title: pageTitle,
            domain: extractDomain(finalUrl),
            timestamp: Date.now(),
            parentId: parentNodeId,
            childrenIds: [],
          };
          return updated;
        });

        setActiveTrailNodeId(newNodeId);
        setTabs((prev) =>
          prev.map((t) => (t.id === tabId ? { ...t, trailNodeId: newNodeId } : t))
        );
      }

      // Profile Isolation Sandbox: Record history & simulated resource cache (never for private profiles)
      const targetProfileId = tab?.profileId || activeProfileId;
      const isTabPrivate = tab?.isPrivate ?? activeProfile.isPrivate;
      if (!isTabPrivate) {
        setHistory((prev) => {
          const existingIdx = prev.findIndex((h) => h.profileId === targetProfileId && h.url === finalUrl);
          if (existingIdx >= 0) {
            const updated = [...prev];
            updated[existingIdx] = {
              ...updated[existingIdx],
              title: pageTitle,
              visitedAt: Date.now(),
              visitCount: updated[existingIdx].visitCount + 1,
            };
            return updated;
          }
          const newEntry: ProfileHistoryEntry = {
            id: 'hist-' + Math.random().toString(36).substring(2, 9),
            profileId: targetProfileId,
            url: finalUrl,
            title: pageTitle,
            domain: extractDomain(finalUrl),
            visitedAt: Date.now(),
            visitCount: 1,
          };
          return [newEntry, ...prev];
        });

        setWebCacheEntries((prev) => {
          const cacheId = 'wc-' + Math.random().toString(36).substring(2, 9);
          const newCache: ProfileWebCacheEntry = {
            id: cacheId,
            profileId: targetProfileId,
            url: `${finalUrl.replace(/\/$/, '')}/bundle.js`,
            method: 'GET',
            status: 200,
            contentType: 'application/javascript',
            sizeBytes: Math.floor(10240 + Math.random() * 20480),
            cachedAt: Date.now(),
          };
          return [newCache, ...prev.slice(0, 49)];
        });
      }

      // Update simulated privacy stats
      setPrivacyStats((prev) => ({
        ...prev,
        adsBlocked: prev.adsBlocked + Math.floor(Math.random() * 3),
        trackersBlocked: prev.trackersBlocked + (page?.trackersCount || 1),
      }));
    },
    [tabs]
  );

  const goBack = useCallback(
    (tabId?: string) => {
      const id = tabId || activeTabId;
      setTabs((prev) =>
        prev.map((t) => {
          if (t.id !== id || t.historyIndex <= 0) return t;
          const newIdx = t.historyIndex - 1;
          const prevUrl = t.history[newIdx];
          const page = SIMULATED_PAGES[prevUrl];
          return {
            ...t,
            url: prevUrl,
            title: page?.title || prevUrl,
            historyIndex: newIdx,
          };
        })
      );
    },
    [activeTabId]
  );

  const goForward = useCallback(
    (tabId?: string) => {
      const id = tabId || activeTabId;
      setTabs((prev) =>
        prev.map((t) => {
          if (t.id !== id || t.historyIndex >= t.history.length - 1) return t;
          const newIdx = t.historyIndex + 1;
          const nextUrl = t.history[newIdx];
          const page = SIMULATED_PAGES[nextUrl];
          return {
            ...t,
            url: nextUrl,
            title: page?.title || nextUrl,
            historyIndex: newIdx,
          };
        })
      );
    },
    [activeTabId]
  );

  const reloadTab = useCallback(
    (tabId?: string) => {
      const id = tabId || activeTabId;
      setTabs((prev) =>
        prev.map((t) => (t.id === id ? { ...t, lastAccessed: Date.now() } : t))
      );
    },
    [activeTabId]
  );

  const duplicateTab = useCallback(
    (tabId: string) => {
      const target = tabs.find((t) => t.id === tabId);
      if (!target) return;
      openTab(target.url, target.title + ' (Copy)', {
        parentTabId: target.id,
        isPrivate: target.isPrivate,
        profileId: target.profileId,
      });
    },
    [tabs, openTab]
  );

  const togglePinTab = useCallback((tabId: string) => {
    setTabs((prev) =>
      prev.map((t) => (t.id === tabId ? { ...t, isPinned: !t.isPinned } : t))
    );
  }, []);

  const toggleMuteTab = useCallback((tabId: string) => {
    setTabs((prev) =>
      prev.map((t) => (t.id === tabId ? { ...t, isMuted: !t.isMuted } : t))
    );
  }, []);

  const toggleDesktopMode = useCallback((tabId: string) => {
    setTabs((prev) =>
      prev.map((t) => (t.id === tabId ? { ...t, isDesktop: !t.isDesktop } : t))
    );
  }, []);

  const setTabZoom = useCallback((tabId: string, zoom: number) => {
    setTabs((prev) =>
      prev.map((t) => (t.id === tabId ? { ...t, zoom: Math.min(200, Math.max(50, zoom)) } : t))
    );
  }, []);

  // Snoozing Tabs
  const snoozeTab = useCallback(
    (tabId: string, hours: number, label: string) => {
      const target = tabs.find((t) => t.id === tabId);
      if (!target) return;

      const snoozed: SnoozedTab = {
        id: 'snooze-' + Math.random().toString(36).substring(2, 9),
        url: target.url,
        title: target.title,
        snoozeUntil: Date.now() + hours * 3600 * 1000,
        snoozeLabel: label,
        profileId: target.profileId,
      };

      setSnoozedTabs((prev) => [...prev, snoozed]);
      closeTab(tabId);
    },
    [tabs, closeTab]
  );

  const wakeSnoozedTab = useCallback(
    (snoozedId: string) => {
      const target = snoozedTabs.find((s) => s.id === snoozedId);
      if (!target) return;
      openTab(target.url, target.title, { profileId: target.profileId });
      setSnoozedTabs((prev) => prev.filter((s) => s.id !== snoozedId));
    },
    [snoozedTabs, openTab]
  );

  const deleteSnoozedTab = useCallback((snoozedId: string) => {
    setSnoozedTabs((prev) => prev.filter((s) => s.id !== snoozedId));
  }, []);

  // Tab Stacks
  const createStack = useCallback((name: string, color: StackColor, tabIds: string[] = []) => {
    const stackId = 'stack-' + Math.random().toString(36).substring(2, 9);
    const newStack: TabStack = {
      id: stackId,
      name,
      color,
      collapsed: false,
    };
    setStacks((prev) => [...prev, newStack]);
    if (tabIds.length > 0) {
      setTabs((prev) =>
        prev.map((t) => (tabIds.includes(t.id) ? { ...t, stackId } : t))
      );
    }
  }, []);

  const editStack = useCallback((id: string, name: string, color: StackColor) => {
    setStacks((prev) =>
      prev.map((s) => (s.id === id ? { ...s, name, color } : s))
    );
  }, []);

  const deleteStack = useCallback((id: string) => {
    setStacks((prev) => prev.filter((s) => s.id !== id));
    setTabs((prev) =>
      prev.map((t) => (t.stackId === id ? { ...t, stackId: undefined } : t))
    );
  }, []);

  const addTabToStack = useCallback((tabId: string, stackId: string) => {
    setTabs((prev) =>
      prev.map((t) => (t.id === tabId ? { ...t, stackId } : t))
    );
  }, []);

  const removeTabFromStack = useCallback((tabId: string) => {
    setTabs((prev) =>
      prev.map((t) => (t.id === tabId ? { ...t, stackId: undefined } : t))
    );
  }, []);

  const toggleStackCollapse = useCallback((stackId: string) => {
    setStacks((prev) =>
      prev.map((s) => (s.id === stackId ? { ...s, collapsed: !s.collapsed } : s))
    );
  }, []);

  // Profiles & Hardware Fingerprinting
  const createProfile = useCallback(
    (name: string, icon: string, accentColor: string, wallpaper: any, preset: ProfileFingerprintPreset = 'windows-chrome') => {
      const id = 'profile-' + Math.random().toString(36).substring(2, 9);
      const fp = FINGERPRINT_PRESETS[preset] || FINGERPRINT_PRESETS['windows-chrome'];
      const newProf: BrowserProfile = {
        id,
        name,
        icon,
        accentColor,
        wallpaper,
        isPrivate: false,
        fingerprint: { ...fp },
      };
      setProfiles((prev) => [...prev, newProf]);
      setActiveProfileId(id);
    },
    []
  );

  const updateProfileWallpaper = useCallback((profileId: string, wallpaper: any) => {
    setProfiles((prev) =>
      prev.map((p) => (p.id === profileId ? { ...p, wallpaper } : p))
    );
  }, []);

  const updateProfileFingerprint = useCallback((profileId: string, updates: Partial<ProfileFingerprint>) => {
    setProfiles((prev) =>
      prev.map((p) => {
        if (p.id !== profileId) return p;
        const currentFp = p.fingerprint || FINGERPRINT_PRESETS['windows-chrome'];
        return {
          ...p,
          fingerprint: {
            ...currentFp,
            ...updates,
            preset: 'custom',
          },
        };
      })
    );
  }, []);

  const applyFingerprintPreset = useCallback((profileId: string, preset: ProfileFingerprintPreset) => {
    const template = FINGERPRINT_PRESETS[preset] || FINGERPRINT_PRESETS['windows-chrome'];
    setProfiles((prev) =>
      prev.map((p) => {
        if (p.id !== profileId) return p;
        return {
          ...p,
          fingerprint: { ...template },
        };
      })
    );
  }, []);

  // Multi-Profile Storage Sandbox Handlers
  const addCookie = useCallback(
    (cookie: Omit<ProfileCookie, 'id' | 'profileId'>, profileId?: string) => {
      const targetId = profileId || activeProfileId;
      const newCookie: ProfileCookie = {
        id: 'ck-' + Math.random().toString(36).substring(2, 9),
        profileId: targetId,
        ...cookie,
      };
      setCookies((prev) => [newCookie, ...prev]);
    },
    [activeProfileId]
  );

  const deleteCookie = useCallback((id: string) => {
    setCookies((prev) => prev.filter((c) => c.id !== id));
  }, []);

  const clearCookies = useCallback(
    (profileId?: string) => {
      const targetId = profileId || activeProfileId;
      setCookies((prev) => prev.filter((c) => c.profileId !== targetId));
    },
    [activeProfileId]
  );

  const setLocalStorageItem = useCallback(
    (key: string, value: string, profileId?: string) => {
      const targetId = profileId || activeProfileId;
      setLocalStorageItems((prev) => {
        const existing = prev.findIndex((s) => s.profileId === targetId && s.key === key);
        const byteSize = new Blob([key, value]).size;
        if (existing >= 0) {
          const updated = [...prev];
          updated[existing] = { ...updated[existing], value, byteSize, updatedAt: Date.now() };
          return updated;
        }
        return [
          {
            id: 'st-' + Math.random().toString(36).substring(2, 9),
            profileId: targetId,
            key,
            value,
            byteSize,
            updatedAt: Date.now(),
          },
          ...prev,
        ];
      });
    },
    [activeProfileId]
  );

  const deleteLocalStorageItem = useCallback((id: string) => {
    setLocalStorageItems((prev) => prev.filter((s) => s.id !== id));
  }, []);

  const clearLocalStorage = useCallback(
    (profileId?: string) => {
      const targetId = profileId || activeProfileId;
      setLocalStorageItems((prev) => prev.filter((s) => s.profileId !== targetId));
    },
    [activeProfileId]
  );

  const setIdbEntry = useCallback(
    (dbName: string, storeName: string, key: string, value: string, profileId?: string) => {
      const targetId = profileId || activeProfileId;
      setIdbEntries((prev) => {
        const existing = prev.findIndex(
          (i) => i.profileId === targetId && i.dbName === dbName && i.storeName === storeName && i.key === key
        );
        if (existing >= 0) {
          const updated = [...prev];
          updated[existing] = { ...updated[existing], value, updatedAt: Date.now() };
          return updated;
        }
        return [
          {
            id: 'idb-' + Math.random().toString(36).substring(2, 9),
            profileId: targetId,
            dbName,
            storeName,
            key,
            value,
            updatedAt: Date.now(),
          },
          ...prev,
        ];
      });
    },
    [activeProfileId]
  );

  const deleteIdbEntry = useCallback((id: string) => {
    setIdbEntries((prev) => prev.filter((i) => i.id !== id));
  }, []);

  const clearIdb = useCallback(
    (profileId?: string) => {
      const targetId = profileId || activeProfileId;
      setIdbEntries((prev) => prev.filter((i) => i.profileId !== targetId));
    },
    [activeProfileId]
  );

  const deleteWebCacheEntry = useCallback((id: string) => {
    setWebCacheEntries((prev) => prev.filter((w) => w.id !== id));
  }, []);

  const clearWebCache = useCallback(
    (profileId?: string) => {
      const targetId = profileId || activeProfileId;
      setWebCacheEntries((prev) => prev.filter((w) => w.profileId !== targetId));
    },
    [activeProfileId]
  );

  const addBookmark = useCallback(
    (title: string, url: string, folder = 'Bookmarks', icon = '★', profileId?: string) => {
      const targetId = profileId || activeProfileId;
      setBookmarks((prev) => {
        if (prev.some((b) => b.profileId === targetId && b.url === url)) return prev;
        return [
          {
            id: 'bm-' + Math.random().toString(36).substring(2, 9),
            profileId: targetId,
            title: title || url,
            url,
            icon,
            folder,
            addedAt: Date.now(),
          },
          ...prev,
        ];
      });
    },
    [activeProfileId]
  );

  const deleteBookmark = useCallback((id: string) => {
    setBookmarks((prev) => prev.filter((b) => b.id !== id));
  }, []);

  const isBookmarked = useCallback(
    (url: string) => {
      return bookmarks.some((b) => b.profileId === activeProfileId && b.url === url);
    },
    [bookmarks, activeProfileId]
  );

  const deleteHistoryEntry = useCallback((id: string) => {
    setHistory((prev) => prev.filter((h) => h.id !== id));
  }, []);

  const clearHistory = useCallback(
    (profileId?: string) => {
      const targetId = profileId || activeProfileId;
      setHistory((prev) => prev.filter((h) => h.profileId !== targetId));
    },
    [activeProfileId]
  );

  // Candy Trails
  const clearTrail = useCallback(() => {
    setTrailNodes({});
    setActiveTrailNodeId(null);
  }, []);

  // Capsules
  const createCapsule = useCallback(
    (name: string, url: string, icon: string, color: string, desktopMode: boolean) => {
      const newCap: SiteCapsule = {
        id: 'capsule-' + Math.random().toString(36).substring(2, 9),
        name,
        url,
        icon: icon || '🍬',
        color: color || '#FF2F78',
        profileId: activeProfileId,
        desktopMode,
        adblockEnabled: true,
        tags: ['Custom'],
      };
      setCapsules((prev) => [...prev, newCap]);
    },
    [activeProfileId]
  );

  const deleteCapsule = useCallback((id: string) => {
    setCapsules((prev) => prev.filter((c) => c.id !== id));
  }, []);

  const launchCapsule = useCallback(
    (capsule: SiteCapsule) => {
      openTab(capsule.url, capsule.name, {
        profileId: capsule.profileId,
      });
      setCapsulesSheetOpen(false);
    },
    [openTab]
  );

  // Reader Studio
  const openReaderMode = useCallback(
    (tab?: BrowserTab) => {
      const current = tab || activeTab;
      const page = SIMULATED_PAGES[current.url];

      const article: ReaderArticle = {
        id: 'article-' + Math.random().toString(36).substring(2, 9),
        url: current.url,
        title: current.title,
        byline: page?.author || 'Candy Editorial & Extraction',
        siteName: extractDomain(current.url),
        publishedTime: page?.date || new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
        content: page?.paragraphs || [
          'This webpage content was synthesized for Reader Studio distraction-free display.',
          'Reader Studio eliminates advertisements, cookie banners, navigation sidebars, and trackers to deliver a pure reading surface.',
          'Use the speech button below to have Candy Browser narrate this article aloud via Web Speech API.',
        ],
      };

      setReaderArticle(article);
      setReaderOpen(true);
    },
    [activeTab]
  );

  const closeReaderMode = useCallback(() => {
    setReaderOpen(false);
  }, []);

  const updateReaderSettings = useCallback((newSettings: Partial<ReaderSettings>) => {
    setReaderSettings((prev) => ({ ...prev, ...newSettings }));
  }, []);

  const toggleSaveCurrentArticle = useCallback(() => {
    if (!readerArticle) return;
    setSavedArticles((prev) => {
      const exists = prev.some((a) => a.url === readerArticle.url);
      if (exists) {
        return prev.filter((a) => a.url !== readerArticle.url);
      }
      return [...prev, { ...readerArticle, savedAt: Date.now() }];
    });
  }, [readerArticle]);

  // Privacy rules & permissions
  const setPermission = useCallback(
    (perm: 'camera' | 'microphone' | 'geolocation' | 'notifications', val: 'granted' | 'denied' | 'prompt') => {
      setPrivacyStats((prev) => ({
        ...prev,
        permissions: {
          ...prev.permissions,
          [perm]: val,
        },
      }));
    },
    []
  );

  const toggleRule = useCallback((id: string) => {
    setRules((prev) =>
      prev.map((r) => (r.id === id ? { ...r, enabled: !r.enabled } : r))
    );
  }, []);

  const addRule = useCallback((category: string, filter: string, type: 'css' | 'host') => {
    const newRule: CandyRule = {
      id: 'rule-' + Math.random().toString(36).substring(2, 9),
      category,
      filter,
      type,
      enabled: true,
      domainTarget: '*',
    };
    setRules((prev) => [...prev, newRule]);
  }, []);

  const deleteRule = useCallback((id: string) => {
    setRules((prev) => prev.filter((r) => r.id !== id));
  }, []);

  // Link Peek
  const openLinkPeek = useCallback((url: string, title?: string, previewSnippet?: string) => {
    const page = SIMULATED_PAGES[url];
    setPeekState({
      isOpen: true,
      url,
      title: title || page?.title || url,
      previewSnippet: previewSnippet || page?.paragraphs[0] || 'Quick preview for ' + url,
    });
  }, []);

  const closeLinkPeek = useCallback(() => {
    setPeekState((prev) => ({ ...prev, isOpen: false }));
  }, []);

  // Settings update
  const updateSettings = useCallback((newSettings: Partial<BrowserSettings>) => {
    setSettings((prev) => ({ ...prev, ...newSettings }));
  }, []);

  // Command Runner
  const executeCommand = useCallback(
    (cmd: string) => {
      const clean = cmd.trim().toLowerCase();
      if (clean === ':trail' || clean === ':trails') {
        setTrailSheetOpen(true);
      } else if (clean === ':xray' || clean === ':privacy') {
        setPrivacyXRayOpen(true);
      } else if (clean === ':reader') {
        openReaderMode();
      } else if (clean === ':capsule' || clean === ':capsules') {
        setCapsulesSheetOpen(true);
      } else if (clean === ':tabs' || clean === ':overview') {
        setTabOverviewOpen(true);
      } else if (clean === ':snooze') {
        snoozeTab(activeTabId, 4, 'Later Today');
      } else if (clean === ':pin') {
        togglePinTab(activeTabId);
      } else if (clean === ':mute') {
        toggleMuteTab(activeTabId);
      } else if (clean === ':desktop') {
        toggleDesktopMode(activeTabId);
      } else if (clean === ':new') {
        openTab();
      } else if (clean === ':private' || clean === ':incognito') {
        switchProfile('profile-private');
      } else if (clean === ':clear') {
        closeAllTabs(false);
        clearTrail();
      } else if (clean === ':settings') {
        setSettingsOpen(true);
      } else if (clean === ':profiles' || clean === ':persona' || clean === ':personas') {
        openSandboxManager('personas');
      } else if (clean === ':fingerprint' || clean === ':spoof' || clean === ':hw') {
        openSandboxManager('fingerprint');
      } else if (clean === ':sandbox' || clean === ':storage' || clean === ':cookies' || clean === ':idb') {
        openSandboxManager('storage');
      } else if (clean === ':audit' || clean === ':leak') {
        openSandboxManager('audit');
      } else if (clean === ':bookmarks') {
        openSandboxManager('storage');
      } else if (clean === ':history') {
        openSandboxManager('storage');
      } else if (clean === ':find') {
        setFindInPageOpen(true);
      }
    },
    [
      activeTabId,
      openReaderMode,
      snoozeTab,
      togglePinTab,
      toggleMuteTab,
      toggleDesktopMode,
      openTab,
      switchProfile,
      closeAllTabs,
      clearTrail,
      openSandboxManager,
    ]
  );

  // Omnibox URL or Search Resolver
  const resolveUrlOrSearch = useCallback(
    (input: string, isAiMode = false): string => {
      const trimmed = input.trim();
      if (!trimmed) return 'https://news.ycombinator.com';

      // Check if command
      if (trimmed.startsWith(':')) {
        executeCommand(trimmed);
        return activeTab.url;
      }

      // Check if direct URL
      const isLikelyUrl =
        /^https?:\/\//i.test(trimmed) ||
        (/^[a-z0-9-]+(\.[a-z0-9-]+)+/i.test(trimmed) && !trimmed.includes(' '));

      if (isLikelyUrl) {
        return /^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`;
      }

      // If in AI Mode, synthesize a search or Gemini AI answer query
      if (isAiMode) {
        return `https://candy.ai/mode?query=${encodeURIComponent(trimmed)}`;
      }

      // Otherwise, use user's selected search engine
      const engine = SEARCH_ENGINES.find((e: { id: string; searchUrl: string }) => e.id === settings.defaultSearchEngine) || SEARCH_ENGINES[0];
      return `${engine.searchUrl}${encodeURIComponent(trimmed)}`;
    },
    [settings.defaultSearchEngine, executeCommand, activeTab.url]
  );

  // App Data Archive: Export & Import
  const exportArchive = useCallback(() => {
    const archive = {
      version: 2,
      exportedAt: new Date().toISOString(),
      tabs: tabs.filter((t) => !t.isPrivate),
      stacks,
      capsules,
      rules,
      settings,
      profiles: profiles.filter((p) => !p.isPrivate),
      cookies: cookies.filter((c) => c.profileId !== 'profile-private'),
      localStorageItems: localStorageItems.filter((s) => s.profileId !== 'profile-private'),
      idbEntries: idbEntries.filter((i) => i.profileId !== 'profile-private'),
      bookmarks: bookmarks.filter((b) => b.profileId !== 'profile-private'),
      history: history.filter((h) => h.profileId !== 'profile-private'),
    };
    return JSON.stringify(archive, null, 2);
  }, [tabs, stacks, capsules, rules, settings, profiles, cookies, localStorageItems, idbEntries, bookmarks, history]);

  const importArchive = useCallback((jsonStr: string) => {
    try {
      const data = JSON.parse(jsonStr);
      if (data.tabs && Array.isArray(data.tabs)) setTabs(data.tabs);
      if (data.stacks && Array.isArray(data.stacks)) setStacks(data.stacks);
      if (data.capsules && Array.isArray(data.capsules)) setCapsules(data.capsules);
      if (data.rules && Array.isArray(data.rules)) setRules(data.rules);
      if (data.settings) setSettings((prev) => ({ ...prev, ...data.settings }));
      if (data.profiles && Array.isArray(data.profiles)) setProfiles(data.profiles);
      if (data.cookies && Array.isArray(data.cookies)) setCookies(data.cookies);
      if (data.localStorageItems && Array.isArray(data.localStorageItems)) setLocalStorageItems(data.localStorageItems);
      if (data.idbEntries && Array.isArray(data.idbEntries)) setIdbEntries(data.idbEntries);
      if (data.bookmarks && Array.isArray(data.bookmarks)) setBookmarks(data.bookmarks);
      if (data.history && Array.isArray(data.history)) setHistory(data.history);
      return true;
    } catch {
      return false;
    }
  }, []);

  const value = {
    tabs,
    activeTabId,
    activeTab,
    activeProfileTabs,
    openTab,
    closeTab,
    closeAllTabs,
    switchTab,
    navigateTab,
    goBack,
    goForward,
    reloadTab,
    duplicateTab,
    togglePinTab,
    toggleMuteTab,
    toggleDesktopMode,
    setTabZoom,
    snoozeTab,
    wakeSnoozedTab,
    deleteSnoozedTab,
    snoozedTabs,

    stacks,
    createStack,
    editStack,
    deleteStack,
    addTabToStack,
    removeTabFromStack,
    toggleStackCollapse,

    profiles,
    activeProfileId,
    activeProfile,
    switchProfile,
    createProfile,
    updateProfileWallpaper,
    updateProfileFingerprint,
    applyFingerprintPreset,

    cookies,
    activeProfileCookies,
    addCookie,
    deleteCookie,
    clearCookies,

    localStorageItems,
    activeProfileLocalStorage,
    setLocalStorageItem,
    deleteLocalStorageItem,
    clearLocalStorage,

    idbEntries,
    activeProfileIdb,
    setIdbEntry,
    deleteIdbEntry,
    clearIdb,

    webCacheEntries,
    activeProfileWebCache,
    deleteWebCacheEntry,
    clearWebCache,

    bookmarks,
    activeProfileBookmarks,
    addBookmark,
    deleteBookmark,
    isBookmarked,

    history,
    activeProfileHistory,
    deleteHistoryEntry,
    clearHistory,

    sandboxManagerOpen,
    setSandboxManagerOpen,
    sandboxInitialTab,
    openSandboxManager,

    trailNodes,
    clearTrail,
    activeTrailNodeId,

    capsules,
    createCapsule,
    deleteCapsule,
    launchCapsule,

    readerOpen,
    readerArticle,
    openReaderMode,
    closeReaderMode,
    readerSettings,
    updateReaderSettings,
    savedArticles,
    toggleSaveCurrentArticle,

    privacyStats,
    setPermission,
    rules,
    toggleRule,
    addRule,
    deleteRule,

    peekState,
    openLinkPeek,
    closeLinkPeek,

    tabOverviewOpen,
    setTabOverviewOpen,
    trailSheetOpen,
    setTrailSheetOpen,
    privacyXRayOpen,
    setPrivacyXRayOpen,
    capsulesSheetOpen,
    setCapsulesSheetOpen,
    profilesModalOpen,
    setProfilesModalOpen,
    settingsOpen,
    setSettingsOpen,
    commandsMenuOpen,
    setCommandsMenuOpen,
    findInPageOpen,
    setFindInPageOpen,

    settings,
    updateSettings,
    executeCommand,
    resolveUrlOrSearch,
    exportArchive,
    importArchive,
  };

  return <BrowserContext.Provider value={value}>{children}</BrowserContext.Provider>;
};

export const useBrowser = () => {
  const context = useContext(BrowserContext);
  if (!context) {
    throw new Error('useBrowser must be used within a BrowserProvider');
  }
  return context;
};
