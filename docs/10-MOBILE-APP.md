# 📱 Mobilná Aplikácia (Capacitor)

## Prehľad

Capacitor zabalí webovú aplikáciu do natívnych iOS a Android aplikácií s prístupom k natívnym funkciám.

```
┌─────────────────────────────────────────────────────────────┐
│                    Native App Shell                          │
│  ┌─────────────────────────────────────────────────────────┐ │
│  │                                                         │ │
│  │                    WebView                              │ │
│  │              (Your Next.js App)                         │ │
│  │                                                         │ │
│  │         https://vasa-domena.sk                          │ │
│  │                                                         │ │
│  └─────────────────────────────────────────────────────────┘ │
│                                                              │
│  Native APIs: Push, Camera, Storage, etc.                   │
└─────────────────────────────────────────────────────────────┘
```

**Architektúra:** Aplikácia je len "okno" na živý web. Aktualizácie webu = automatické aktualizácie v appke!

---

## 1. Inštalácia

```bash
# Capacitor core
npm install @capacitor/core
npm install -D @capacitor/cli

# Inicializácia
npx cap init "Beauty Academy" "sk.beautyacademy.app" --web-dir=out

# Platformy
npm install @capacitor/ios @capacitor/android

# Pridanie platforiem
npx cap add ios
npx cap add android
```

---

## 2. Konfigurácia

### capacitor.config.ts

```typescript
// capacitor.config.ts
import type { CapacitorConfig } from '@capacitor/cli'

const config: CapacitorConfig = {
  appId: 'sk.beautyacademy.app',
  appName: 'Beauty Academy',
  webDir: 'out', // Next.js static export (len ak nepoužívate live URL)
  
  // DÔLEŽITÉ: Použitie live URL = automatické aktualizácie
  server: {
    url: 'https://beautyacademy.sk', // Vaša produkčná doména
    androidScheme: 'https',
    iosScheme: 'https',
    // Pre development
    // url: 'http://localhost:3000',
    // cleartext: true, // Len pre HTTP (development)
  },

  // iOS špecifické
  ios: {
    contentInset: 'automatic',
    preferredContentMode: 'mobile',
    backgroundColor: '#ffffff',
    // Splash screen
    splash: {
      backgroundColor: '#ec4899',
      spinnerColor: '#ffffff',
    },
  },

  // Android špecifické
  android: {
    allowMixedContent: false,
    backgroundColor: '#ffffff',
    // Splash screen
    splash: {
      backgroundColor: '#ec4899',
      spinnerColor: '#ffffff',
      layoutName: 'launch_screen',
    },
  },

  // Plugins konfigurácia
  plugins: {
    SplashScreen: {
      launchShowDuration: 2000,
      launchAutoHide: true,
      backgroundColor: '#ec4899',
      androidSplashResourceName: 'splash',
      showSpinner: false,
    },
    StatusBar: {
      style: 'dark',
      backgroundColor: '#ffffff',
    },
    Keyboard: {
      resize: 'body',
      style: 'dark',
    },
  },
}

export default config
```

---

## 3. CSS Úpravy pre Mobile

### Safe Areas (iPhone Notch)

```css
/* src/app/globals.css */

/* Safe Area Variables */
:root {
  --safe-area-top: env(safe-area-inset-top);
  --safe-area-bottom: env(safe-area-inset-bottom);
  --safe-area-left: env(safe-area-inset-left);
  --safe-area-right: env(safe-area-inset-right);
}

/* Body padding pre notch */
body {
  padding-top: var(--safe-area-top);
  padding-bottom: var(--safe-area-bottom);
  padding-left: var(--safe-area-left);
  padding-right: var(--safe-area-right);
}

/* Alternatíva: min-height pre content */
.app-container {
  min-height: calc(100vh - var(--safe-area-top) - var(--safe-area-bottom));
}
```

### Natívny Pocit

```css
/* src/app/globals.css */

/* Vypnutie overscroll "gunciagania" */
html, body {
  overscroll-behavior: none;
  -webkit-overflow-scrolling: touch;
}

/* Vypnutie text selection (okrem inputov) */
body {
  -webkit-user-select: none;
  user-select: none;
  -webkit-touch-callout: none;
}

/* Povolenie selectu pre inputy */
input, 
textarea, 
[contenteditable="true"] {
  -webkit-user-select: auto;
  user-select: auto;
}

/* Vypnutie tap highlight */
* {
  -webkit-tap-highlight-color: transparent;
}

/* Smooth scrolling */
html {
  scroll-behavior: smooth;
}

/* Fix pre iOS input zoom */
@media screen and (max-width: 768px) {
  input, 
  textarea, 
  select {
    font-size: 16px !important; /* Predchádza autozoom */
  }
}

/* Fixed header s notch support */
.header-fixed {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  padding-top: calc(var(--safe-area-top) + 1rem);
  z-index: 50;
}

/* Bottom navigation */
.bottom-nav {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  padding-bottom: var(--safe-area-bottom);
  background: white;
  border-top: 1px solid #e5e7eb;
}
```

### Video Player Mobile Optimalizácie

```css
/* Video fullscreen na mobile */
.video-wrapper {
  position: relative;
  width: 100%;
  background: black;
}

/* Landscape mode */
@media (orientation: landscape) and (max-height: 500px) {
  .video-wrapper {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 9999;
  }
  
  .lesson-content {
    display: none;
  }
}
```

---

## 4. Detekcia Platformy

```typescript
// src/lib/platform.ts
import { Capacitor } from '@capacitor/core'

export const isNative = Capacitor.isNativePlatform()
export const isIOS = Capacitor.getPlatform() === 'ios'
export const isAndroid = Capacitor.getPlatform() === 'android'
export const isWeb = Capacitor.getPlatform() === 'web'

// Hook pre React
export function usePlatform() {
  return {
    isNative,
    isIOS,
    isAndroid,
    isWeb,
    platform: Capacitor.getPlatform(),
  }
}
```

### Použitie v komponente

```typescript
// src/components/layout/Header.tsx
'use client'

import { usePlatform } from '@/lib/platform'

export function Header() {
  const { isNative, isIOS } = usePlatform()

  return (
    <header 
      className={cn(
        'sticky top-0 z-50 bg-white border-b',
        isIOS && 'pt-[env(safe-area-inset-top)]'
      )}
    >
      {/* ... */}
    </header>
  )
}
```

---

## 5. Push Notifikácie (Voliteľné)

### Inštalácia

```bash
npm install @capacitor/push-notifications
npx cap sync
```

### Konfigurácia

```typescript
// src/lib/push-notifications.ts
import { PushNotifications } from '@capacitor/push-notifications'
import { Capacitor } from '@capacitor/core'

export async function initPushNotifications() {
  if (!Capacitor.isNativePlatform()) {
    return
  }

  // Žiadosť o povolenie
  let permStatus = await PushNotifications.checkPermissions()

  if (permStatus.receive === 'prompt') {
    permStatus = await PushNotifications.requestPermissions()
  }

  if (permStatus.receive !== 'granted') {
    console.log('Push notifications permission denied')
    return
  }

  // Registrácia
  await PushNotifications.register()

  // Listeners
  PushNotifications.addListener('registration', (token) => {
    console.log('Push registration success:', token.value)
    // Odoslať token na backend pre uloženie
    savePushToken(token.value)
  })

  PushNotifications.addListener('registrationError', (error) => {
    console.error('Push registration error:', error)
  })

  PushNotifications.addListener('pushNotificationReceived', (notification) => {
    console.log('Push notification received:', notification)
  })

  PushNotifications.addListener('pushNotificationActionPerformed', (action) => {
    console.log('Push notification action:', action)
    // Navigácia podľa action
  })
}

async function savePushToken(token: string) {
  await fetch('/api/users/push-token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ token }),
  })
}
```

---

## 6. Build Process

### Development

```bash
# Web development
npm run dev

# Sync zmeny do natívnych projektov
npx cap sync

# Otvoriť v Xcode (iOS)
npx cap open ios

# Otvoriť v Android Studio
npx cap open android
```

### Production Build

```bash
# 1. Build Next.js (ak nepoužívate live URL)
npm run build
npm run export # Ak používate static export

# 2. Sync
npx cap sync

# 3. Build v IDE
# iOS: Xcode → Product → Archive
# Android: Android Studio → Build → Generate Signed Bundle
```

### Dôležité: Live URL vs Static Export

| Metóda | Výhody | Nevýhody |
|--------|--------|----------|
| **Live URL** | Automatické updaty, žiadny re-submit | Vyžaduje internet |
| **Static Export** | Offline prístup | Nové features = App Store review |

**Odporúčanie:** Použiť Live URL pre jednoduchší update cyklus.

---

## 7. App Store Konfigurácia

### iOS (App Store Connect)

1. **Apple Developer Account** ($99/rok)
2. **App ID** v Apple Developer Portal
3. **Certificates & Provisioning Profiles**
4. **App Store Connect** - vytvorenie aplikácie
5. **Screenshots & Metadata**

### Android (Google Play Console)

1. **Google Play Developer Account** ($25 jednorazovo)
2. **Keystore** pre signing
3. **Play Console** - vytvorenie aplikácie
4. **Screenshots & Metadata**

---

## 8. App Icons & Splash Screen

### Generovanie Ikon

```bash
# Inštalácia cordova-res
npm install -g cordova-res

# Vytvorte resources/icon.png (1024x1024)
# Vytvorte resources/splash.png (2732x2732)

# Generovanie
cordova-res ios --skip-config --copy
cordova-res android --skip-config --copy
```

### Manuálna štruktúra

```
resources/
├── icon.png          # 1024x1024 (app icon)
├── splash.png        # 2732x2732 (splash screen)
├── ios/
│   └── ... (generované)
└── android/
    └── ... (generované)
```

---

## 9. Testing

### iOS Simulator

```bash
# Otvoriť v simulátore
npx cap open ios
# Xcode → Select simulator → Run
```

### Android Emulator

```bash
# Otvoriť v Android Studio
npx cap open android
# Android Studio → Select device → Run
```

### Fyzické Zariadenie

**iOS:**
1. Pripojiť iPhone cez USB
2. Xcode → Select device → Run
3. Trust developer certificate na zariadení

**Android:**
1. Zapnúť Developer options & USB debugging
2. Pripojiť cez USB
3. Android Studio → Select device → Run

---

## 10. Debugging

### Safari Web Inspector (iOS)

1. iPhone: Settings → Safari → Advanced → Web Inspector ON
2. Mac: Safari → Develop → [Device] → [Your App]

### Chrome DevTools (Android)

1. Android: Developer options → USB debugging ON
2. Chrome: `chrome://inspect` → Select WebView

---

## 📋 Checklist

- [ ] Capacitor nainštalovaný
- [ ] capacitor.config.ts nakonfigurovaný
- [ ] Live URL nastavené
- [ ] CSS safe areas implementované
- [ ] Overscroll behavior vypnuté
- [ ] App icons vytvorené
- [ ] Splash screen vytvorený
- [ ] iOS projekt funguje v Xcode
- [ ] Android projekt funguje v Android Studio
- [ ] Testované na fyzickom zariadení
- [ ] Push notifikácie (voliteľné)

---

## ⚠️ Dôležité Poznámky

1. **Live URL** = aplikácia vždy zobrazuje aktuálny web, updaty nepotrebujú App Store review
2. **App Store** vyžaduje review aj pre "webview" aplikácie
3. **iOS** má prísnejšie review guidelines
4. **Android** je tolerantnejší k webview aplikáciám
5. **Testovať** na reálnych zariadeniach pred submissiou

---

*Capacitor pre jednoduchú konverziu webovej aplikácie na natívnu.*


