// Single on/off switch for the whole Premium/subscription feature.
//
// Set to false: every "Go Premium" entry point is hidden and the app reads
// as fully free (this is the current, published-to-stores state). Set back
// to true once subscription products + RevenueCat are wired up (see
// src/config/revenuecat.ts) to bring the paywall back — nothing else needs
// to change, every Premium screen/hook/service is still here, just unused
// while this is false.
export const PREMIUM_ENABLED = false;
