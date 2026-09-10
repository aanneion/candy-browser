package dev.sk2andy.materialbrowser.browser

import org.junit.Assert.assertEquals
import org.junit.Assert.assertFalse
import org.junit.Assert.assertTrue
import org.junit.Test

class ProfileFingerprintRulesTest {
    @Test
    fun `preset resolution falls back safely to default`() {
        assertEquals(ProfileFingerprintRules.Preset.DEFAULT, ProfileFingerprintRules.Preset.fromId(null))
        assertEquals(ProfileFingerprintRules.Preset.DEFAULT, ProfileFingerprintRules.Preset.fromId("unknown"))
        assertEquals(ProfileFingerprintRules.Preset.WINDOWS_CHROME, ProfileFingerprintRules.Preset.fromId("windows_chrome"))
        assertEquals(ProfileFingerprintRules.Preset.MACOS_SAFARI, ProfileFingerprintRules.Preset.fromId("macos_safari"))
        assertEquals(ProfileFingerprintRules.Preset.IOS_SAFARI, ProfileFingerprintRules.Preset.fromId("ios_safari"))
        assertEquals(ProfileFingerprintRules.Preset.LINUX_FIREFOX, ProfileFingerprintRules.Preset.fromId("linux_firefox"))
        assertEquals(ProfileFingerprintRules.Preset.STEALTH_GHOST, ProfileFingerprintRules.Preset.fromId("stealth_ghost"))
    }

    @Test
    fun `effective user agent preserves default for default preset`() {
        val defaultUa = "Mozilla/5.0 (Linux; Android 15; Pixel 9 Pro) AppleWebKit/537.36 Chrome/133.0.0.0 Mobile Safari/537.36"
        assertEquals(defaultUa, ProfileFingerprintRules.effectiveUserAgent(ProfileFingerprintRules.Preset.DEFAULT, defaultUa))
    }

    @Test
    fun `effective user agent overrides signature for custom presets`() {
        val defaultUa = "Mozilla/5.0 (Linux; Android 15; Pixel 9 Pro) AppleWebKit/537.36 Mobile Safari/537.36"
        val windowsUa = ProfileFingerprintRules.effectiveUserAgent(ProfileFingerprintRules.Preset.WINDOWS_CHROME, defaultUa)
        val macosUa = ProfileFingerprintRules.effectiveUserAgent(ProfileFingerprintRules.Preset.MACOS_SAFARI, defaultUa)
        val linuxUa = ProfileFingerprintRules.effectiveUserAgent(ProfileFingerprintRules.Preset.LINUX_FIREFOX, defaultUa)

        assertTrue(windowsUa.contains("Windows NT 10.0"))
        assertTrue(macosUa.contains("Macintosh; Intel Mac OS X"))
        assertTrue(linuxUa.contains("X11; Ubuntu; Linux x86_64"))
    }

    @Test
    fun `spoofing script is empty for default and populated for spoofing presets`() {
        assertEquals("", ProfileFingerprintRules.spoofingScriptFor(ProfileFingerprintRules.Preset.DEFAULT))

        val script = ProfileFingerprintRules.spoofingScriptFor(ProfileFingerprintRules.Preset.WINDOWS_CHROME)
        assertTrue(script.contains("navigator, 'platform'"))
        assertTrue(script.contains("Win32"))
        assertTrue(script.contains("hardwareConcurrency"))
        assertTrue(script.contains("deviceMemory"))
        assertTrue(script.contains("UNMASKED_VENDOR_WEBGL") || script.contains("37445"))
    }
}
