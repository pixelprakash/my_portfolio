import { useEffect, useId, useRef, useState } from 'react';
import { siteConfig } from '../../data/siteConfig';
import { lockWords, unlock, WrongPassword } from '../../lib/lock';
import styles from './LockDialog.module.css';

export function LockIcon({ size = 22 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <rect x="4.5" y="10.5" width="15" height="10" rx="2.5" stroke="currentColor" strokeWidth="1.8" />
      <path
        d="M8 10.5V8a4 4 0 0 1 8 0v2.5"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
      <circle cx="12" cy="15.5" r="1.4" fill="currentColor" />
    </svg>
  );
}

// The password form of a locked project. On success the project's details are
// stored by lib/lock.js and everything showing it (cards, the case study page)
// updates by itself. Used in the card's dialog and directly on a locked page.
export function LockForm({ project, titleId, onDone, onCancel }) {
  const fieldId = useId();
  const messageId = useId();
  const [password, setPassword] = useState('');
  const [reveal, setReveal] = useState(false);
  const [status, setStatus] = useState('idle'); // idle | checking | wrong | unavailable | unsupported
  const words = lockWords(project);

  async function submit(event) {
    event.preventDefault();
    if (!password.trim() || status === 'checking') return;
    setStatus('checking');
    try {
      await unlock(project.lockId, password);
      onDone?.();
    } catch (error) {
      if (error instanceof WrongPassword) setStatus('wrong');
      else setStatus(error?.message === 'unsupported' ? 'unsupported' : 'unavailable');
    }
  }

  const message = {
    wrong: "That password didn't open it. Please check it and try again.",
    unavailable: "Couldn't load the protected details. Check your connection and try again.",
    unsupported: "This browser can't unlock it. Try a current version of Chrome, Safari or Firefox.",
  }[status];

  const subject = encodeURIComponent(`Access to ${project.title}`);

  return (
    <form className={styles.inner} onSubmit={submit}>
      <span className={styles.badge}>
        <LockIcon size={26} />
      </span>
      <h2 id={titleId} className={styles.title}>
        {words.kicker}
      </h2>
      <p className={styles.text}>
        <strong>{project.title}</strong> {words.sentence} Enter the password I shared with you to
        see it.
      </p>

      <label className={styles.label} htmlFor={fieldId}>
        Password
      </label>
      <div className={styles.field}>
        <input
          id={fieldId}
          className={styles.input}
          type={reveal ? 'text' : 'password'}
          value={password}
          onChange={(event) => {
            setPassword(event.target.value);
            if (status !== 'checking') setStatus('idle');
          }}
          autoComplete="off"
          autoCapitalize="none"
          autoCorrect="off"
          spellCheck="false"
          aria-invalid={status === 'wrong'}
          aria-describedby={message ? messageId : undefined}
          disabled={status === 'checking'}
        />
        <button
          type="button"
          className={styles.reveal}
          aria-pressed={reveal}
          data-sound="none"
          onClick={() => setReveal((shown) => !shown)}
        >
          {reveal ? 'Hide' : 'Show'}
        </button>
      </div>

      <p id={messageId} className={styles.message} role="alert">
        {message}
      </p>

      <div className={styles.actions}>
        <button
          type="submit"
          className={styles.primary}
          disabled={!password.trim() || status === 'checking'}
        >
          {status === 'checking' ? 'Checking…' : 'Unlock'}
        </button>
        {onCancel && (
          <button type="button" className={styles.secondary} data-sound="none" onClick={onCancel}>
            Cancel
          </button>
        )}
      </div>

      <p className={styles.help}>
        Don&apos;t have it?{' '}
        <a href={`mailto:${siteConfig.email}?subject=${subject}`}>Ask for access</a>
      </p>
    </form>
  );
}

// The card's dialog: asks for the password of a locked project.
export default function LockDialog({ project, open, onClose }) {
  const ref = useRef(null);
  const titleId = useId();

  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    if (open && !dialog.open) dialog.showModal();
    if (!open && dialog.open) dialog.close();
  }, [open]);

  return (
    <dialog
      ref={ref}
      className={styles.dialog}
      aria-labelledby={titleId}
      onClose={onClose}
      onClick={(event) => {
        // a click on the backdrop lands on the <dialog> itself
        if (event.target === ref.current) onClose();
      }}
    >
      {/* only while open, so a closed dialog forgets what was typed */}
      {open && <LockForm project={project} titleId={titleId} onDone={onClose} onCancel={onClose} />}
    </dialog>
  );
}
