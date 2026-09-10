package dev.sk2andy.materialbrowser.browser

object ProfileFingerprintRules {
    enum class Preset(
        val id: String,
        val label: String,
        val platform: String,
        val userAgent: String,
        val hardwareConcurrency: Int,
        val deviceMemory: Int,
        val webGlVendor: String,
        val webGlRenderer: String,
    ) {
        DEFAULT(
            id = "default",
            label = "Default (Android)",
            platform = "Linux armv81",
            userAgent = "",
            hardwareConcurrency = 8,
            deviceMemory = 8,
            webGlVendor = "",
            webGlRenderer = "",
        ),
        WINDOWS_CHROME(
            id = "windows_chrome",
            label = "Windows · Chrome",
            platform = "Win32",
            userAgent = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/133.0.0.0 Safari/537.36",
            hardwareConcurrency = 16,
            deviceMemory = 16,
            webGlVendor = "Google Inc. (NVIDIA)",
            webGlRenderer = "ANGLE (NVIDIA, NVIDIA GeForce RTX 4070 Direct3D11 vs_5_0 ps_5_0, D3D11)",
        ),
        MACOS_SAFARI(
            id = "macos_safari",
            label = "macOS · Safari",
            platform = "MacIntel",
            userAgent = "Mozilla/5.0 (Macintosh; Intel Mac OS X 14_7_4) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.3 Safari/605.1.15",
            hardwareConcurrency = 10,
            deviceMemory = 16,
            webGlVendor = "Apple Inc.",
            webGlRenderer = "Apple M3 Pro",
        ),
        IOS_SAFARI(
            id = "ios_safari",
            label = "iPhone · Safari",
            platform = "iPhone",
            userAgent = "Mozilla/5.0 (iPhone; CPU iPhone OS 18_3_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.3 Mobile/15E148 Safari/604.1",
            hardwareConcurrency = 6,
            deviceMemory = 6,
            webGlVendor = "Apple Inc.",
            webGlRenderer = "Apple GPU",
        ),
        LINUX_FIREFOX(
            id = "linux_firefox",
            label = "Linux · Firefox",
            platform = "Linux x86_64",
            userAgent = "Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:135.0) Gecko/20100101 Firefox/135.0",
            hardwareConcurrency = 8,
            deviceMemory = 16,
            webGlVendor = "Mesa",
            webGlRenderer = "Mesa Intel(R) UHD Graphics 620 (KBL GT2)",
        ),
        STEALTH_GHOST(
            id = "stealth_ghost",
            label = "Stealth · Ghost Mode",
            platform = "Win32",
            userAgent = "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:128.0) Gecko/20100101 Firefox/128.0",
            hardwareConcurrency = 4,
            deviceMemory = 8,
            webGlVendor = "Generic",
            webGlRenderer = "Direct3D11",
        );

        companion object {
            fun fromId(id: String?): Preset = entries.firstOrNull { it.id == id } ?: DEFAULT
        }
    }

    fun effectiveUserAgent(preset: Preset, defaultUserAgent: String): String {
        return if (preset == Preset.DEFAULT || preset.userAgent.isBlank()) {
            defaultUserAgent
        } else {
            preset.userAgent
        }
    }

    fun spoofingScriptFor(preset: Preset): String {
        if (preset == Preset.DEFAULT) return ""
        val touchPoints = if (preset == Preset.IOS_SAFARI) 5 else 0
        return """
            (function() {
                try {
                    Object.defineProperty(navigator, 'platform', { get: () => '${preset.platform}', configurable: true });
                    Object.defineProperty(navigator, 'hardwareConcurrency', { get: () => ${preset.hardwareConcurrency}, configurable: true });
                    Object.defineProperty(navigator, 'deviceMemory', { get: () => ${preset.deviceMemory}, configurable: true });
                    Object.defineProperty(navigator, 'webdriver', { get: () => false, configurable: true });
                    Object.defineProperty(navigator, 'maxTouchPoints', { get: () => $touchPoints, configurable: true });
                    
                    const getParameter = WebGLRenderingContext.prototype.getParameter;
                    WebGLRenderingContext.prototype.getParameter = function(param) {
                        if (param === 37445) return '${preset.webGlVendor}';
                        if (param === 37446) return '${preset.webGlRenderer}';
                        return getParameter.apply(this, arguments);
                    };
                    if (typeof WebGL2RenderingContext !== 'undefined') {
                        const getParameter2 = WebGL2RenderingContext.prototype.getParameter;
                        WebGL2RenderingContext.prototype.getParameter = function(param) {
                            if (param === 37445) return '${preset.webGlVendor}';
                            if (param === 37446) return '${preset.webGlRenderer}';
                            return getParameter2.apply(this, arguments);
                        };
                    }
                } catch (e) {}
            })();
        """.trimIndent()
    }
}
