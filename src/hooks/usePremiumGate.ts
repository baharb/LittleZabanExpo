import { useNav } from '../store/NavContext';

/**
 * The single entry point for showing the premium upsell anywhere in the
 * app. Call `openPremium()` from any press handler — the Settings section,
 * a "Go Premium" banner, a locked lesson card, etc. — and it always:
 * confirms the parent password first, then lands on the Premium/payment
 * screen. Centralizing the flow here means "password -> paywall" is only
 * wired up once; every future premium entry point just imports this hook
 * instead of re-implementing the flow.
 */
export function usePremiumGate() {
  const { navigate } = useNav();
  const openPremium = () => navigate({ name: 'PremiumUnlock' });
  return { openPremium };
}
