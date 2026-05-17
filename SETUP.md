# Little Zaban - Expo Setup Guide

## 🚀 Run in 3 Steps (Expo Go)

### Step 1 — Install dependencies
```bash
cd LittleZabanExpo
npm install
```

### Step 2 — Start the dev server
```bash
npx expo start
```

### Step 3 — Open on your phone
1. Install **Expo Go** from App Store or Google Play
2. Scan the QR code shown in the terminal
3. App loads instantly! ✅

---

## 📱 That's it!

No Android Studio. No Xcode. No gradle. No keystore.
Just npm install → expo start → scan QR.

---

## 🌍 Publish to App Stores (later)

When you're ready to publish:

### 1. Install EAS CLI
```bash
npm install -g eas-cli
eas login
```

### 2. Configure build
```bash
eas build:configure
```

### 3. Build for Android (Google Play)
```bash
eas build --platform android
```

### 4. Build for iOS (App Store)
```bash
eas build --platform ios
```

### 5. Submit to stores
```bash
eas submit --platform android
eas submit --platform ios
```

Builds run in the cloud — no local Android Studio or Xcode needed.

---

## 🔧 Troubleshooting

**Metro bundler error?**
```bash
npx expo start --clear
```

**Package not found?**
```bash
npm install
npx expo install --fix
```

**App not loading on phone?**
- Make sure phone and computer are on the same WiFi
- Try pressing `w` in terminal to open web version first

---

## 📁 Project Structure

```
LittleZabanExpo/
├── app/                    ← Expo Router pages
│   ├── _layout.tsx         ← Root layout
│   ├── index.tsx           ← Splash screen
│   ├── age.tsx             ← Age selection
│   ├── section.tsx         ← Learning section
│   ├── game.tsx            ← Game router
│   ├── parent.tsx          ← Parent dashboard
│   └── (tabs)/             ← Bottom tab screens
│       ├── index.tsx       ← Home
│       ├── subjects.tsx    ← Lessons
│       ├── games.tsx       ← Games
│       ├── persian.tsx     ← Culture
│       └── profile.tsx     ← Profile
├── src/
│   ├── screens/            ← Screen components
│   │   └── games/          ← 6 game components
│   ├── data/               ← All Persian content
│   ├── store/              ← App state (Context)
│   └── theme/              ← Colors
└── assets/                 ← Icons & splash screen
```
