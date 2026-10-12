import { useSyncExternalStore } from 'react';
import { getSoundState, subscribeSound } from '../audio/uiSound';

// 'unset' | 'on' | 'off': the visitor's sound choice, live.
export function useSoundState() {
  return useSyncExternalStore(subscribeSound, getSoundState, () => 'unset');
}
