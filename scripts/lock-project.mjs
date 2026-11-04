#!/usr/bin/env node
// Locks a project behind a password (an NDA lock for the portfolio).
//
//   NDA_PASSWORD='your password' node scripts/lock-project.mjs pedagogy-playcards
//   (or: npm run lock -- pedagogy-playcards, which asks for the password)
//
// Reads the project's private details from  private/<id>/  (git-ignored, stays
// on this machine):
//   payload.json   { "href": "https://…", "summary": "…" }   what unlocking reveals
//   cover.webp     the screenshot shown on the card once unlocked
// and writes  public/work/locked/<id>.enc  : the same data, encrypted. That file
// is safe to publish. The site decrypts it in the visitor's browser only when the
// right password is typed, so the real link and screenshot are never in the page.
//
// Encryption: PBKDF2-SHA-256 (600,000 rounds) turns the password into an AES-256
// key; AES-GCM encrypts and authenticates. Changing the password = run this again.
//
// Honest limit: a static site cannot rate-limit guesses. The 600,000 rounds make
// each guess slow, but anyone holding the .enc file can try passwords offline, so
// the password must be strong (long and not a dictionary word).

import { webcrypto as crypto } from 'node:crypto';
import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { createInterface } from 'node:readline/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const ITERATIONS = 600_000;
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

const id = process.argv[2];
if (!id || !/^[a-z0-9-]+$/.test(id)) {
  console.error('Usage: lock-project.mjs <project-id>   (e.g. pedagogy-playcards)');
  process.exit(1);
}

async function readPassword() {
  if (process.env.NDA_PASSWORD) return process.env.NDA_PASSWORD;
  const rl = createInterface({ input: process.stdin, output: process.stdout });
  const answer = await rl.question('Password for this project: ');
  rl.close();
  return answer;
}

const password = (await readPassword()).trim();
if (password.length < 8) {
  console.error('Use at least 8 characters (longer is much safer).');
  process.exit(1);
}

const source = path.join(root, 'private', id);
const payload = JSON.parse(await readFile(path.join(source, 'payload.json'), 'utf8'));
if (!payload.href) {
  console.error('payload.json needs an "href".');
  process.exit(1);
}
const cover = await readFile(path.join(source, 'cover.webp'));
payload.cover = `data:image/webp;base64,${cover.toString('base64')}`;

const salt = crypto.getRandomValues(new Uint8Array(16));
const iv = crypto.getRandomValues(new Uint8Array(12));
const material = await crypto.subtle.importKey('raw', new TextEncoder().encode(password), 'PBKDF2', false, [
  'deriveKey',
]);
const key = await crypto.subtle.deriveKey(
  { name: 'PBKDF2', salt, iterations: ITERATIONS, hash: 'SHA-256' },
  material,
  { name: 'AES-GCM', length: 256 },
  false,
  ['encrypt'],
);
const data = await crypto.subtle.encrypt(
  { name: 'AES-GCM', iv },
  key,
  new TextEncoder().encode(JSON.stringify(payload)),
);

const b64 = (bytes) => Buffer.from(bytes).toString('base64');
const box = { v: 1, kdf: 'PBKDF2-SHA-256', iterations: ITERATIONS, salt: b64(salt), iv: b64(iv), data: b64(data) };

const outDir = path.join(root, 'public', 'work', 'locked');
await mkdir(outDir, { recursive: true });
const out = path.join(outDir, `${id}.enc`);
await writeFile(out, JSON.stringify(box));
console.log(`Locked "${id}" -> ${path.relative(root, out)} (${Math.round(JSON.stringify(box).length / 1024)} KB)`);
