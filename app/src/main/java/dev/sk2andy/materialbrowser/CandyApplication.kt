package dev.sk2andy.materialbrowser

import android.app.Application
import android.util.Log
import java.io.File

class CandyApplication : Application() {
    override fun onCreate() {
        super.onCreate()
        val defaultHandler = Thread.getDefaultUncaughtExceptionHandler()
        Thread.setDefaultUncaughtExceptionHandler { thread, throwable ->
            runCatching {
                Log.e("CandyBrowser", "Fatal uncaught crash on thread ${thread.name}", throwable)
                File(filesDir, "last_crash.txt").writeText(
                    "Timestamp: ${System.currentTimeMillis()}\n" +
                        "Thread: ${thread.name}\n" +
                        "Message: ${throwable.message}\n" +
                        "Stacktrace:\n${throwable.stackTraceToString()}",
                )
            }
            defaultHandler?.uncaughtException(thread, throwable)
        }
    }
}
