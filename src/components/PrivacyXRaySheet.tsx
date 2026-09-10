import React, { useState } from 'react';
import {
  X,
  Shield,
  ShieldCheck,
  ShieldAlert,
  Camera,
  Mic,
  MapPin,
  Bell,
  Lock,
  Cookie,
  EyeOff,
  CheckCircle2,
  Plus,
  Trash2,
  Filter,
} from 'lucide-react';
import { useBrowser } from '../context/BrowserContext';

export const PrivacyXRaySheet: React.FC = () => {
  const {
    privacyStats,
    setPermission,
    rules,
    toggleRule,
    addRule,
    deleteRule,
    privacyXRayOpen,
    setPrivacyXRayOpen,
    activeTab,
  } = useBrowser();

  const [activeTabSubnav, setActiveTabSubnav] = useState<'audit' | 'radar' | 'rules'>('audit');
  const [newRuleCategory, setNewRuleCategory] = useState('Custom Filter');
  const [newRuleFilter, setNewRuleFilter] = useState('');
  const [newRuleType, setNewRuleType] = useState<'css' | 'host'>('css');
  const [showAddRule, setShowAddRule] = useState(false);

  if (!privacyXRayOpen) return null;

  const handleCreateRule = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newRuleFilter.trim()) return;
    addRule(newRuleCategory, newRuleFilter.trim(), newRuleType);
    setNewRuleFilter('');
    setShowAddRule(false);
  };

  return (
    <div
      id="privacy-xray-sheet-overlay"
      className="fixed inset-0 z-50 bg-neutral-950/95 backdrop-blur-2xl flex flex-col text-neutral-100 overflow-hidden animate-in fade-in duration-200"
    >
      {/* Header */}
      <div className="border-b border-neutral-800 px-4 sm:px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setPrivacyXRayOpen(false)}
            className="p-2 rounded-full hover:bg-neutral-800 text-neutral-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-emerald-500/20 text-emerald-400">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <span>Privacy X-Ray</span>
                <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 text-xs font-semibold">
                  Protected
                </span>
              </h2>
              <p className="text-xs text-neutral-400">
                Live inspection of network telemetry, trackers, and origin permissions
              </p>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center bg-neutral-900 border border-neutral-800 rounded-xl p-0.5 text-xs">
          <button
            type="button"
            onClick={() => setActiveTabSubnav('audit')}
            className={`px-3 py-1.5 rounded-lg transition-colors font-semibold ${
              activeTabSubnav === 'audit' ? 'bg-neutral-800 text-emerald-400' : 'text-neutral-400 hover:text-white'
            }`}
          >
            Page Audit
          </button>
          <button
            type="button"
            onClick={() => setActiveTabSubnav('radar')}
            className={`px-3 py-1.5 rounded-lg transition-colors font-semibold ${
              activeTabSubnav === 'radar' ? 'bg-neutral-800 text-emerald-400' : 'text-neutral-400 hover:text-white'
            }`}
          >
            Permission Radar
          </button>
          <button
            type="button"
            onClick={() => setActiveTabSubnav('rules')}
            className={`px-3 py-1.5 rounded-lg transition-colors font-semibold ${
              activeTabSubnav === 'rules' ? 'bg-neutral-800 text-emerald-400' : 'text-neutral-400 hover:text-white'
            }`}
          >
            Candy Rules ({rules.length})
          </button>
        </div>
      </div>

      {/* Main Sheet Body */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 max-w-4xl mx-auto w-full space-y-6">
        {/* Sub-view 1: Page Audit */}
        {activeTabSubnav === 'audit' && (
          <div className="space-y-6">
            {/* Top Score Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="p-4 rounded-2xl bg-neutral-900 border border-neutral-800">
                <div className="text-xs font-semibold text-neutral-400 uppercase tracking-wider">
                  Ads Neutralized
                </div>
                <div className="text-2xl font-bold text-white mt-1">{privacyStats.adsBlocked}</div>
                <div className="text-[11px] text-emerald-400 mt-0.5">EasyList Cosmetic</div>
              </div>

              <div className="p-4 rounded-2xl bg-neutral-900 border border-neutral-800">
                <div className="text-xs font-semibold text-neutral-400 uppercase tracking-wider">
                  Trackers Cut
                </div>
                <div className="text-2xl font-bold text-white mt-1">{privacyStats.trackersBlocked}</div>
                <div className="text-[11px] text-emerald-400 mt-0.5">Telemetry Blocked</div>
              </div>

              <div className="p-4 rounded-2xl bg-neutral-900 border border-neutral-800">
                <div className="text-xs font-semibold text-neutral-400 uppercase tracking-wider">
                  Banners Stripped
                </div>
                <div className="text-2xl font-bold text-white mt-1">{privacyStats.cookiesBlocked}</div>
                <div className="text-[11px] text-emerald-400 mt-0.5">GDPR/Cookie Banners</div>
              </div>

              <div className="p-4 rounded-2xl bg-neutral-900 border border-neutral-800">
                <div className="text-xs font-semibold text-neutral-400 uppercase tracking-wider">
                  TLS Certificate
                </div>
                <div className="text-lg font-bold text-emerald-400 mt-1 flex items-center gap-1">
                  <Lock className="w-4 h-4" />
                  <span>Encrypted</span>
                </div>
                <div className="text-[11px] text-neutral-400 mt-0.5">HTTPS Verified</div>
              </div>
            </div>

            {/* List of blocked tracking origins */}
            <div className="p-5 rounded-2xl bg-neutral-900 border border-neutral-800 space-y-3">
              <h3 className="text-sm font-bold text-white flex items-center justify-between">
                <span>Blocked Third-Party Telemetry & Tracking Domains</span>
                <span className="text-xs text-emerald-400 font-semibold">100% Dropped</span>
              </h3>

              <div className="divide-y divide-neutral-800">
                {privacyStats.trackersList.map((t, idx) => (
                  <div key={idx} className="py-2.5 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <EyeOff className="w-4 h-4 text-emerald-400 shrink-0" />
                      <span className="font-mono text-neutral-200">{t.domain}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded-full bg-neutral-800 text-neutral-300 font-semibold text-[10px]">
                        {t.category}
                      </span>
                      <span className="text-emerald-400 font-semibold flex items-center gap-1 text-[11px]">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        Blocked
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Sub-view 2: Permission Radar */}
        {activeTabSubnav === 'radar' && (
          <div className="space-y-4">
            <div className="p-4 rounded-2xl bg-neutral-900 border border-neutral-800">
              <h3 className="text-sm font-bold text-white">Hardware & Origin Permissions Radar</h3>
              <p className="text-xs text-neutral-400 mt-1">
                Fine-grained control over what this webpage ({activeTab.url}) is allowed to access.
              </p>
            </div>

            <div className="space-y-3">
              {/* Camera */}
              <div className="p-4 rounded-2xl bg-neutral-900 border border-neutral-800 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-xl bg-neutral-800 text-neutral-300">
                    <Camera className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-white">Camera Access</h4>
                    <p className="text-xs text-neutral-400">Capture video or barcode scans</p>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 bg-neutral-800 p-1 rounded-xl text-xs font-semibold">
                  {(['granted', 'prompt', 'denied'] as const).map((mode) => (
                    <button
                      key={mode}
                      type="button"
                      onClick={() => setPermission('camera', mode)}
                      className={`px-3 py-1 rounded-lg capitalize transition-colors ${
                        privacyStats.permissions.camera === mode
                          ? mode === 'granted'
                            ? 'bg-emerald-500 text-white'
                            : mode === 'denied'
                            ? 'bg-rose-500 text-white'
                            : 'bg-neutral-700 text-white'
                          : 'text-neutral-400 hover:text-white'
                      }`}
                    >
                      {mode}
                    </button>
                  ))}
                </div>
              </div>

              {/* Microphone */}
              <div className="p-4 rounded-2xl bg-neutral-900 border border-neutral-800 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-xl bg-neutral-800 text-neutral-300">
                    <Mic className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-white">Microphone</h4>
                    <p className="text-xs text-neutral-400">Audio recording and voice input</p>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 bg-neutral-800 p-1 rounded-xl text-xs font-semibold">
                  {(['granted', 'prompt', 'denied'] as const).map((mode) => (
                    <button
                      key={mode}
                      type="button"
                      onClick={() => setPermission('microphone', mode)}
                      className={`px-3 py-1 rounded-lg capitalize transition-colors ${
                        privacyStats.permissions.microphone === mode
                          ? mode === 'granted'
                            ? 'bg-emerald-500 text-white'
                            : mode === 'denied'
                            ? 'bg-rose-500 text-white'
                            : 'bg-neutral-700 text-white'
                          : 'text-neutral-400 hover:text-white'
                      }`}
                    >
                      {mode}
                    </button>
                  ))}
                </div>
              </div>

              {/* Geolocation */}
              <div className="p-4 rounded-2xl bg-neutral-900 border border-neutral-800 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-xl bg-neutral-800 text-neutral-300">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-white">Precise Geolocation</h4>
                    <p className="text-xs text-neutral-400">GPS and wireless location signals</p>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 bg-neutral-800 p-1 rounded-xl text-xs font-semibold">
                  {(['granted', 'prompt', 'denied'] as const).map((mode) => (
                    <button
                      key={mode}
                      type="button"
                      onClick={() => setPermission('geolocation', mode)}
                      className={`px-3 py-1 rounded-lg capitalize transition-colors ${
                        privacyStats.permissions.geolocation === mode
                          ? mode === 'granted'
                            ? 'bg-emerald-500 text-white'
                            : mode === 'denied'
                            ? 'bg-rose-500 text-white'
                            : 'bg-neutral-700 text-white'
                          : 'text-neutral-400 hover:text-white'
                      }`}
                    >
                      {mode}
                    </button>
                  ))}
                </div>
              </div>

              {/* Notifications */}
              <div className="p-4 rounded-2xl bg-neutral-900 border border-neutral-800 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-xl bg-neutral-800 text-neutral-300">
                    <Bell className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-white">Push Notifications</h4>
                    <p className="text-xs text-neutral-400">Origin alerts and background notifications</p>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 bg-neutral-800 p-1 rounded-xl text-xs font-semibold">
                  {(['granted', 'prompt', 'denied'] as const).map((mode) => (
                    <button
                      key={mode}
                      type="button"
                      onClick={() => setPermission('notifications', mode)}
                      className={`px-3 py-1 rounded-lg capitalize transition-colors ${
                        privacyStats.permissions.notifications === mode
                          ? mode === 'granted'
                            ? 'bg-emerald-500 text-white'
                            : mode === 'denied'
                            ? 'bg-rose-500 text-white'
                            : 'bg-neutral-700 text-white'
                          : 'text-neutral-400 hover:text-white'
                      }`}
                    >
                      {mode}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Sub-view 3: Candy Rules & Filter Studio */}
        {activeTabSubnav === 'rules' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-white">Candy Rules Engine</h3>
                <p className="text-xs text-neutral-400">
                  Bundled and custom CSS cosmetic selectors and host filters.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setShowAddRule(!showAddRule)}
                className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold shadow-md transition-all"
              >
                <Plus className="w-4 h-4" />
                <span>Add Rule</span>
              </button>
            </div>

            {/* Rule Creation Form */}
            {showAddRule && (
              <form
                onSubmit={handleCreateRule}
                className="p-4 rounded-2xl bg-neutral-900 border border-neutral-800 space-y-3"
              >
                <h4 className="text-xs font-bold text-white uppercase tracking-wider">
                  New Custom Filter Rule
                </h4>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-[11px] text-neutral-400 block mb-1">Rule Type</label>
                    <select
                      value={newRuleType}
                      onChange={(e) => setNewRuleType(e.target.value as 'css' | 'host')}
                      className="w-full px-3 py-1.5 rounded-xl bg-neutral-800 border border-neutral-700 text-xs text-white"
                    >
                      <option value="css">Cosmetic CSS Selector (Hides Elements)</option>
                      <option value="host">Host Blocker (Blocks Network Requests)</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-[11px] text-neutral-400 block mb-1">Category</label>
                    <input
                      type="text"
                      value={newRuleCategory}
                      onChange={(e) => setNewRuleCategory(e.target.value)}
                      className="w-full px-3 py-1.5 rounded-xl bg-neutral-800 border border-neutral-700 text-xs text-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[11px] text-neutral-400 block mb-1">Filter Pattern</label>
                  <input
                    type="text"
                    value={newRuleFilter}
                    onChange={(e) => setNewRuleFilter(e.target.value)}
                    placeholder="e.g. .ad-banner, #cookie-notice, tracker.com"
                    required
                    className="w-full px-3 py-2 rounded-xl bg-neutral-800 border border-neutral-700 text-xs text-white font-mono"
                  />
                </div>

                <div className="flex justify-end gap-2 pt-1">
                  <button
                    type="button"
                    onClick={() => setShowAddRule(false)}
                    className="px-3 py-1.5 rounded-xl text-xs text-neutral-400 hover:text-white"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-xs font-bold text-white shadow-md"
                  >
                    Save Rule
                  </button>
                </div>
              </form>
            )}

            {/* Rules List */}
            <div className="space-y-2">
              {rules.map((rule) => (
                <div
                  key={rule.id}
                  className="p-3.5 rounded-2xl bg-neutral-900 border border-neutral-800 flex items-center justify-between text-xs"
                >
                  <div className="min-w-0 mr-3">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-neutral-200">{rule.category}</span>
                      <span className="px-1.5 py-0.5 rounded bg-neutral-800 text-[10px] uppercase font-mono text-neutral-400">
                        {rule.type}
                      </span>
                    </div>
                    <p className="font-mono text-neutral-400 text-[11px] truncate mt-0.5">
                      {rule.filter}
                    </p>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      type="button"
                      onClick={() => toggleRule(rule.id)}
                      className={`px-2.5 py-1 rounded-lg font-semibold text-[11px] transition-colors ${
                        rule.enabled
                          ? 'bg-emerald-500/20 text-emerald-400'
                          : 'bg-neutral-800 text-neutral-500'
                      }`}
                    >
                      {rule.enabled ? 'Enabled' : 'Disabled'}
                    </button>
                    <button
                      type="button"
                      onClick={() => deleteRule(rule.id)}
                      className="p-1 rounded text-neutral-500 hover:text-rose-400"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
