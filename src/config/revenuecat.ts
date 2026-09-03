import { Platform } from 'react-native';

// ---------------------------------------------------------------------------
// RevenueCat setup
// ---------------------------------------------------------------------------
// 1. Create a free account at https://app.revenuecat.com
// 2. Add your app there and connect it to App Store Connect (iOS) and/or
//    Google Play Console (Android) — RevenueCat walks you through this.
// 3. In each store, create your subscription product(s) (e.g. a monthly and
//    a yearly auto-renewing subscription) and attach them to an Entitlement
//    in RevenueCat called "premium" (or update PREMIUM_ENTITLEMENT_ID below
//    to match whatever you name it).
// 4. Group those products into an Offering in the RevenueCat dashboard and
//    mark it "current" — that's what PremiumScreen fetches and displays.
// 5. Copy the public API keys from RevenueCat -> Project settings -> API
//    keys (one per store) and paste them below. These are safe to ship in
//    the app; they only allow purchases, not account access.
// ---------------------------------------------------------------------------
export const REVENUECAT_API_KEYS = {
  ios: 'REPLACE_WITH_APPLE_REVENUECAT_API_KEY',
  android: 'REPLACE_WITH_GOOGLE_REVENUECAT_API_KEY',
};

export function getRevenueCatApiKey(): string {
  return Platform.OS === 'ios' ? REVENUECAT_API_KEYS.ios : REVENUECAT_API_KEYS.android;
}

// The Entitlement identifier (RevenueCat dashboard -> Entitlements) that
// unlocks Premium. Every purchase/restore check in the app looks at this one
// identifier — rename it here if you name it differently in the dashboard.
export const PREMIUM_ENTITLEMENT_ID = 'premium';

// False until real API keys are pasted in above. While it's false, the app
// deliberately never calls the RevenueCat SDK (a placeholder key would just
// fail), and PremiumScreen falls back to a preview UI instead of crashing.
export function isRevenueCatConfigured(): boolean {
  const key = getRevenueCatApiKey();
  return Boolean(key) && !key.startsWith('REPLACE_WITH_');
}
