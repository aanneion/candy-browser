export interface BrowserTab {
  id: string;
  url: string;
  title: string;
  favicon: string;
  profileId: string;
  isPrivate: boolean;
  isPinned: boolean;
  isMuted: boolean;
  isDesktop: boolean;
  zoom: number;
  lastAccessed: number;
  history: string[];
  historyIndex: number;
  stackId?: string;
  previewSnippet?: string;
  trailNodeId?: string;
}

export type StackColor = 'grape' | 'cherry' | 'lime' | 'blueberry' | 'candy';

export interface TabStack {
  id: string;
  name: string;
  color: StackColor;
  collapsed: boolean;
}

export type WallpaperPreset = 'candy-mesh' | 'candy-sunset' | 'dark-nebula' | 'minimal-slate';

export type ProfileFingerprintPreset =
  | 'windows-chrome'
  | 'macos-safari'
  | 'ios-safari'
  | 'linux-firefox'
  | 'stealth-ghost'
  | 'custom';

export interface ProfileFingerprint {
  preset: ProfileFingerprintPreset;
  osName: string;
  userAgent: string;
  platform: string;
  hardwareConcurrency: number;
  deviceMemory: number;
  screenResolution: string;
  colorDepth: number;
  webglVendor: string;
  webglRenderer: string;
  canvasNoiseEnabled: boolean;
  audioNoiseEnabled: boolean;
  webRtcPolicy: 'munge-candidates' | 'disable-all' | 'public-only';
  timezone: string;
  languages: string[];
  touchSupport: boolean;
  doNotTrack: boolean;
}

export interface ProfileCookie {
  id: string;
  profileId: string;
  name: string;
  value: string;
  domain: string;
  path: string;
  expires: string;
  secure: boolean;
  httpOnly: boolean;
  sameSite: 'Strict' | 'Lax' | 'None';
}

export interface ProfileStorageItem {
  id: string;
  profileId: string;
  key: string;
  value: string;
  byteSize: number;
  updatedAt: number;
}

export interface ProfileIDBEntry {
  id: string;
  profileId: string;
  dbName: string;
  storeName: string;
  key: string;
  value: string;
  updatedAt: number;
}

export interface ProfileWebCacheEntry {
  id: string;
  profileId: string;
  url: string;
  method: 'GET' | 'POST';
  status: number;
  contentType: string;
  sizeBytes: number;
  cachedAt: number;
}

export interface ProfileBookmark {
  id: string;
  profileId: string;
  title: string;
  url: string;
  icon: string;
  folder: string;
  addedAt: number;
}

export interface ProfileHistoryEntry {
  id: string;
  profileId: string;
  url: string;
  title: string;
  domain: string;
  visitedAt: number;
  visitCount: number;
}

export interface BrowserProfile {
  id: string;
  name: string;
  icon: string;
  accentColor: string;
  wallpaper: WallpaperPreset;
  isPrivate: boolean;
  fingerprint: ProfileFingerprint;
}

export interface CandyTrailNode {
  id: string;
  tabId: string;
  url: string;
  title: string;
  domain: string;
  timestamp: number;
  parentId?: string;
  childrenIds: string[];
}

export interface SiteCapsule {
  id: string;
  name: string;
  url: string;
  icon: string;
  color: string;
  profileId: string;
  desktopMode: boolean;
  adblockEnabled: boolean;
  tags: string[];
}

export interface ReaderArticle {
  id: string;
  url: string;
  title: string;
  byline: string;
  siteName: string;
  publishedTime: string;
  content: string[];
  savedAt?: number;
}

export interface ReaderSettings {
  fontFamily: 'sans' | 'serif' | 'mono';
  fontSize: number;
  lineHeight: number;
  theme: 'light' | 'sepia' | 'dark' | 'midnight';
  speechRate: number;
}

export interface TrackerItem {
  domain: string;
  category: 'Ad' | 'Tracker' | 'Analytics' | 'Consent';
  blocked: boolean;
}

export interface PrivacyStats {
  adsBlocked: number;
  trackersBlocked: number;
  cookiesBlocked: number;
  httpsEncrypted: boolean;
  trackersList: TrackerItem[];
  permissions: {
    camera: 'granted' | 'denied' | 'prompt';
    microphone: 'granted' | 'denied' | 'prompt';
    geolocation: 'granted' | 'denied' | 'prompt';
    notifications: 'granted' | 'denied' | 'prompt';
  };
}

export interface CandyRule {
  id: string;
  type: 'css' | 'host' | 'header';
  filter: string;
  category: string;
  enabled: boolean;
  domainTarget: string;
}

export interface BrowserSettings {
  defaultSearchEngine: string;
  addressBarPosition: 'bottom' | 'top';
  googleAiModeDefault: boolean;
  contentBlockingEnabled: boolean;
  cookieConsentBlocking: boolean;
  videoAutoplayBlocking: boolean;
  themeMode: 'system' | 'dark' | 'light';
  overviewMode: 'grid' | 'list' | 'stack';
  gestureNavigation?: boolean;
  blockThirdPartyCookies?: boolean;
  httpsOnlyMode?: boolean;
}

export interface SnoozedTab {
  id: string;
  url: string;
  title: string;
  snoozeUntil: number;
  snoozeLabel: string;
  profileId: string;
}

export interface SearchSuggestion {
  title: string;
  subtitle?: string;
  url: string;
  type: 'history' | 'capsule' | 'search' | 'command' | 'ai';
  command?: string;
}
