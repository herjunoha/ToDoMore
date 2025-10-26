# ProGuard configuration for ToDoMore Android app
# This file is used to configure the R8/ProGuard minifier for release builds
# R8 is the new code shrinker from Google, replacing ProGuard

# Keep all React Native and related classes
-keep class com.facebook.react.** { *; }
-keep interface com.facebook.react.** { *; }
-keep class com.facebook.** { *; }
-keep interface com.facebook.** { *; }

# Keep native methods
-keepclasseswithmembernames class * {
    native <methods>;
}

# Keep custom application classes
-keep class com.todomore.** { *; }

# Keep JavaScriptCore (JSC) and Hermes
-keep class com.facebook.jni.** { *; }
-keep class com.facebook.hermes.** { *; }

# Keep BuildConfig and R classes
-keepclasseswithmembernames class * {
    public static final int id;
    public static final int attr;
    public static final int styleable;
    public static final int[] styleable;
}

# Keep R classes - needed for resource references
-keep class **.R
-keep class **.R$* {
    <fields>;
}

# Keep enumerations
-keepclassmembers enum * {
    public static **[] values();
    public static ** valueOf(java.lang.String);
}

# Keep serializable classes and serialVersionUID
-keepclassmembers class * implements java.io.Serializable {
    static final long serialVersionUID;
    private static final java.io.ObjectStreamField[] serialPersistentFields;
    private void writeObject(java.io.ObjectOutputStream);
    private void readObject(java.io.ObjectInputStream);
    java.lang.Object writeReplace();
    java.lang.Object readResolve();
}

# Keep parcelable classes
-keep class * implements android.os.Parcelable {
    public static final android.os.Parcelable$Creator *;
}

# Keep Android support library classes
-keep class androidx.** { *; }
-keep interface androidx.** { *; }

# Keep RxJava classes (if used)
-keep class rx.** { *; }
-keep interface rx.** { *; }
-keep class io.reactivex.** { *; }
-keep interface io.reactivex.** { *; }

# Keep SQLite Storage classes
-keep class io.sqlc.** { *; }
-keep class org.sqlite.** { *; }

# Keep Keychain and secure storage
-keep class com.oblador.keychain.** { *; }

# Keep Crypto-JS (if compiled to bytecode)
-keep class org.conscrypt.** { *; }

# Keep Vector Icons
-keep class com.oblador.vectoricons.** { *; }

# Keep gestures and animations
-keep class com.swmansion.gesturehandler.** { *; }
-keep class com.swmansion.reanimated.** { *; }

# Remove logging in release builds
-assumenosideeffects class android.util.Log {
    public static *** d(...);
    public static *** v(...);
    public static *** i(...);
}

# Optimization options
-optimizationpasses 5
-dontusemixedcaseclassnames
-verbose

# Keep line numbers for crash reporting
-keepattributes SourceFile,LineNumberTable
-renamesourcefileattribute SourceFile

# Keep annotations
-keepattributes *Annotation*
-keepattributes Signature
-keepattributes Exceptions
-keepattributes InnerClasses

# View constructors for inflation
-keepclasseswithmembers class * {
    public <init>(android.content.Context, android.util.AttributeSet);
}

# Keep FragmentActivity constructors
-keepclassmembers class * extends android.app.Activity {
    public void *(android.view.View);
}

# Keep BaseActivity and custom activities
-keep public class * extends android.app.Activity
-keep public class * extends android.app.Service
-keep public class * extends android.content.BroadcastReceiver
-keep public class * extends android.content.ContentProvider

# Keep broadcast receivers
-keepclassmembers class * extends android.content.BroadcastReceiver {
    public <init>(...);
}

# Keep services
-keepclassmembers class * extends android.app.Service {
    public <init>(...);
}

# Keep custom View classes
-keep public class * extends android.view.View {
    public <init>(android.content.Context);
    public <init>(android.content.Context, android.util.AttributeSet);
    public <init>(android.content.Context, android.util.AttributeSet, int);
}

# Keep callback methods for onClick listeners
-keepclassmembers class * {
    void on*(android.view.View);
    void on*(...);
}

# Remove unused code after obfuscation
-dontnote **
-dontwarn **
-ignorewarnings

# Optimization settings for better performance
-optimizations code/simplification/arithmetic,code/simplification/cast,field/*,class/unboxing/enum

# Keep method signatures for native calls
-keepattributes Signature
