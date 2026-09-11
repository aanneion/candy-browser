# ProGuard / R8 rules for Candy Browser Release Builds

# Preserve line numbers and source files for useful crash reports
-keepattributes SourceFile,LineNumberTable
-keepattributes *Annotation*,Signature,InnerClasses,EnclosingMethod

# WebView JavascriptInterface annotations and methods
-keepattributes JavascriptInterface
-keepclassmembers class * {
    @android.webkit.JavascriptInterface <methods>;
}

# WebKit
-keep class androidx.webkit.** { *; }

# Google Play Services Cast Framework
-keep public class * extends com.google.android.gms.cast.framework.OptionsProvider
-keep class dev.sk2andy.materialbrowser.browser.cast.CastOptionsProvider {
    public <init>();
    *;
}
-keep class com.google.android.gms.cast.framework.** { *; }
-keep class com.google.android.gms.cast.** { *; }

# Google Play Services Code Scanner & MLKit
-keep class com.google.android.gms.code.scanner.** { *; }
-keep class com.google.mlkit.** { *; }
-dontwarn com.google.android.gms.**
-dontwarn com.google.mlkit.**

# AndroidX Credentials
-keep class androidx.credentials.** { *; }
-dontwarn androidx.credentials.**

# Native (JNI) methods and Argon2Kt
-keepclasseswithmembernames class * {
    native <methods>;
}
-keep class com.lambdapioneer.argon2kt.** { *; }

# BlurView library
-keep class eightbitlab.com.blurview.** { *; }
-dontwarn eightbitlab.com.blurview.**
-dontwarn android.renderscript.**

# OkHttp & Okio
-dontwarn okhttp3.**
-dontwarn okio.**
-keep class okhttp3.** { *; }

# Guava
-dontwarn com.google.common.**

# Standard Android components
-keep public class * extends android.app.Activity
-keep public class * extends android.app.Service
-keep public class * extends android.content.BroadcastReceiver
-keep public class * extends android.content.ContentProvider
-keep public class * extends android.app.Application
-keep class dev.sk2andy.materialbrowser.CandyApplication { *; }

# Preserve enum values and valueOf
-keepclassmembers enum * {
    public static **[] values();
    public static ** valueOf(java.lang.String);
}
