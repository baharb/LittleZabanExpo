import Purchases, { CustomerInfo, LOG_LEVEL, PurchasesOffering, PurchasesPackage } from 'react-native-purchases';
import { getRevenueCatApiKey, isRevenueCatConfigured, PREMIUM_ENTITLEMENT_ID } from '../config/revenuecat';

// Thin wrapper around the RevenueCat SDK. Every screen in the app that
// touches purchases (PremiumScreen today; anything else later) goes through
// these functions instead of calling `Purchases` directly, so there's one
// place that knows how to configure the SDK, one definition of "is this
// user premium", and one spot to change if we ever swap providers.

let configured = false;

export function hasPremiumEntitlement(info: CustomerInfo | null | undefined): boolean {
  return Boolean(info?.entitlements?.active?.[PREMIUM_ENTITLEMENT_ID]);
}

/**
 * Configure the RevenueCat SDK once, at app startup (see PurchasesBridge in
 * App.tsx). Safe to call more than once. Does nothing until real API keys
 * are set in src/config/revenuecat.ts.
 */
export async function initPurchases(): Promise<void> {
  if (configured || !isRevenueCatConfigured()) return;
  if (__DEV__) {
    try { await Purchases.setLogLevel(LOG_LEVEL.WARN); } catch {}
  }
  Purchases.configure({ apiKey: getRevenueCatApiKey() });
  configured = true;
}

export function isPurchasesReady(): boolean {
  return configured;
}

/**
 * Subscribe to purchase/subscription-state changes — renewals,
 * cancellations, billing issues, and restores that happen on another
 * device all flow through this listener automatically. Returns an
 * unsubscribe function; call it on unmount.
 */
export function subscribeToCustomerInfo(onChange: (info: CustomerInfo) => void): () => void {
  if (!configured) return () => {};
  const listener = (info: CustomerInfo) => onChange(info);
  Purchases.addCustomerInfoUpdateListener(listener);
  return () => { Purchases.removeCustomerInfoUpdateListener(listener); };
}

export async function getCurrentCustomerInfo(): Promise<CustomerInfo | null> {
  if (!configured) return null;
  try {
    return await Purchases.getCustomerInfo();
  } catch {
    return null;
  }
}

/** The current Offering configured in the RevenueCat dashboard, or null if RevenueCat isn't configured yet / has no offering set. */
export async function fetchCurrentOffering(): Promise<PurchasesOffering | null> {
  if (!configured) return null;
  try {
    const offerings = await Purchases.getOfferings();
    return offerings.current;
  } catch {
    return null;
  }
}

export async function buyPackage(pkg: PurchasesPackage): Promise<{ success: boolean; cancelled: boolean; customerInfo?: CustomerInfo; error?: string }> {
  try {
    const { customerInfo } = await Purchases.purchasePackage(pkg);
    return { success: hasPremiumEntitlement(customerInfo), cancelled: false, customerInfo };
  } catch (e: any) {
    if (e?.userCancelled) return { success: false, cancelled: true };
    return { success: false, cancelled: false, error: e?.message ?? 'Purchase failed.' };
  }
}

export async function restorePurchases(): Promise<{ success: boolean; customerInfo?: CustomerInfo; error?: string }> {
  try {
    const customerInfo = await Purchases.restorePurchases();
    return { success: hasPremiumEntitlement(customerInfo), customerInfo };
  } catch (e: any) {
    return { success: false, error: e?.message ?? 'Restore failed.' };
  }
}
