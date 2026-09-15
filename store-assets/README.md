# ZAAL — publishing package

Everything prepared so far for submitting ZAAL (free version, no subscriptions) to both stores. Images are already the right sizes; text is ready to paste into each console.

## Folders
- `apple/` — App Store Connect: `app-store-icon-1024.png` (1024x1024, opaque, matches Apple's no-alpha requirement) + `listing.md` (name, subtitle, description, keywords, age rating, App Privacy answers).
- `google/` — Play Console: `play-store-icon-512.png`, `feature-graphic-1024x500.png` + `listing.md` (name, descriptions, content rating, Data safety answers, Families target-audience note).
- `privacy-policy.md` — shared by both stores. **You still need to host this somewhere public** (a free option: paste it into a GitHub repo's README and use the GitHub-rendered URL, or a Notion/Google Sites page) and put that URL into both listings.

## Still missing: screenshots
Both stores require real device screenshots (Apple: at least one 6.7" iPhone size; Google: at least 2 phone screenshots, ideally 1080x1920 or larger). These need to come from a running build, not a static export — I can help capture these with you once you can run the app in a simulator or on a device, or you can take them yourself in Expo Go and send them over.

## Icon/splash source
Everything here is generated from `assets/logo.png` at 72% (icon) / 56% (adaptive icon) / 62% (splash) scale, centered on a warm cream background (#FFF6E8) chosen for contrast — the logo's own purple wordmark was unreadable on ZAAL's brand purple. `assets/icon.png`, `assets/adaptive-icon.png`, and `assets/splash.png` were regenerated the same way, and `app.json`'s splash/adaptive-icon background colors were updated to match.

## Final build files (.ipa / .aab)
`eas.json` already has the build profiles configured. Producing the actual signed files needs your Apple Developer and Google Play accounts logged in interactively (EAS can't do that unattended), so this is a step to run together:
```
eas login
eas build --platform ios --profile production
eas build --platform android --profile production
```
Each prints a download link when done (also at expo.dev or `eas build:list`). From there, `eas submit --platform ios` / `--platform android` uploads them straight to each store, or you can download and upload manually.
