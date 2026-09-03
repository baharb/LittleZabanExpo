import { useRef } from 'react';
import type { CelebrationHandle, CelebrationOptions } from './CelebrationOverlay';

/**
 * useCelebration — wire up the shared CelebrationOverlay in 2 lines.
 *
 * const celebration = useCelebration();
 * <CelebrationOverlay ref={celebration.ref} />
 * celebration.play({ color: '#FFD93D', message: 'آفرین! 🌟' });
 */
export function useCelebration() {
  const ref = useRef<CelebrationHandle>(null);
  const play = (opts?: CelebrationOptions) => ref.current?.play(opts);
  return { ref, play };
}