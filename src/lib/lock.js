import { useSyncExternalStore } from 'react';

// NDA locks. A locked project's real link, summary and screenshot are not in
// the page at all: they live in public/work/locked/<id>.enc, encrypted with a
// password (see scripts/lock-project.mjs). Typing the password decrypts them in
// the browser; nothing is sent anywhere. Once unlocked, the details are kept
// for the rest of the browser session (sessionStorage), so the card doesn't ask
// again until the tab is closed or the visitor chooses "Lock again".

const storageKey = (id) => `sp-nda-${id}`;
const cache = new Map(); // id -> unlocked details, or null
const listeners = new Set();

function read(id) {
  if (!id) return null;
  if (!cache.has(id)) {
    let value = null;
    try {
      value = JSON.parse(sessionStorage.getItem(storageKey(id)));
    } catch {
      // storage blocked or unreadable: just stay locked
    }
    cache.set(id, value);
  }
  return cache.get(id);
}

function emit() {
  listeners.forEach((listener) => listener());
}

const subscribe = (listener) => {
  listeners.add(listener);
  return () => listeners.delete(listener);
};

/** The unlocked details of a project, or null while it is locked. */
export function useUnlocked(id) {
  return useSyncExternalStore(
    subscribe,
    () => read(id),
    () => null
  );
}

export function lockAgain(id) {
  cache.set(id, null);
  try {
    sessionStorage.removeItem(storageKey(id));
  } catch {
    // nothing to clean up
  }
  emit();
}

export class WrongPassword extends Error {}

const fromBase64 = (text) => Uint8Array.from(atob(text), (c) => c.charCodeAt(0));

/**
 * Tries a password. Resolves with the decrypted details (and remembers them),
 * rejects with WrongPassword if it doesn't open the lock, or with a plain Error
 * if the encrypted file can't be loaded or the browser can't decrypt.
 */
export async function unlock(id, password) {
  if (!window.crypto?.subtle) throw new Error('unsupported');

  const response = await fetch(`/work/locked/${id}.enc`, { cache: 'no-cache' });
  if (!response.ok) throw new Error('unavailable');
  const box = await response.json();

  const material = await crypto.subtle.importKey(
    'raw',
    new TextEncoder().encode(password.trim()),
    'PBKDF2',
    false,
    ['deriveKey']
  );
  const key = await crypto.subtle.deriveKey(
    { name: 'PBKDF2', salt: fromBase64(box.salt), iterations: box.iterations, hash: 'SHA-256' },
    material,
    { name: 'AES-GCM', length: 256 },
    false,
    ['decrypt']
  );

  let plain;
  try {
    plain = await crypto.subtle.decrypt({ name: 'AES-GCM', iv: fromBase64(box.iv) }, key, fromBase64(box.data));
  } catch {
    // AES-GCM authenticates: a wrong key fails here instead of producing noise
    throw new WrongPassword();
  }

  const details = JSON.parse(new TextDecoder().decode(plain));
  cache.set(id, details);
  try {
    sessionStorage.setItem(storageKey(id), JSON.stringify(details));
  } catch {
    // too big or blocked: it simply won't persist past this page view
  }
  emit();
  return details;
}
