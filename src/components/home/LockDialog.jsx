import { useEffect, useId, useRef, useState } from 'react';
import { siteConfig } from '../../data/siteConfig';
import { unlock, WrongPassword } from '../../lib/lock';
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

// Asks for the NDA password of a locked project. On success the project's
// details are stored by lib/lock.js and every card for it updates by itself.
export default function LockDialog({ project, open, onClose }) {
  const ref = useRef(null);
  const fieldId = useId();
  const messageId = useId();
  const [password, setPassword] = useState('');
  const [reveal, setReveal] = useState(false);
  const [status, setStatus] = useState('idle'); // idle | checking | wrong | unavailable | unsupported

  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    if (open && !dialog.open) dialog.showModal();
    if (!open && dialog.open) dialog.close();
  }, [open]);

  function reset() {
    setPassword('');
    setReveal(false);
    setStatus('idle');
  }

  async function submit(event) {
    event.preventDefault();
    if (!password.trim() || status === 'checking') return;
    setStatus('checking');
    try {
      await unlock(project.lockId, password);
      reset();
      onClose();
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
    <dialog
      ref={ref}
      className={styles.dialog}
      aria-labelledby={`${fieldId}-title`}
      onClose={() => {
        reset();
        onClose();
      }}
      onClick={(event) => {
        // a click on the backdrop lands on the <dialog> itself
        if (event.target === ref.current) onClose();
      }}
    >
      <form className={styles.inner} onSubmit={submit}>
        <span className={styles.badge}>
          <LockIcon size={26} />
        </span>
        <h2 id={`${fieldId}-title`} className={styles.title}>
          Under NDA
        </h2>
        <p className={styles.text}>
          <strong>{project.title}</strong> is covered by a non-disclosure agreement. Enter the
          password I shared with you to see it.
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
          <button type="button" className={styles.secondary} data-sound="none" onClick={onClose}>
            Cancel
          </button>
        </div>

        <p className={styles.help}>
          Don&apos;t have it?{' '}
          <a href={`mailto:${siteConfig.email}?subject=${subject}`}>Ask for access</a>
        </p>
      </form>
    </dialog>
  );
}
