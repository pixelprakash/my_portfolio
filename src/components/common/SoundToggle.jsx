import { setSoundEnabled } from '../../audio/uiSound';
import { useSoundState } from '../../hooks/useSoundState';
import styles from './SoundToggle.module.css';

// Navbar switch for the interface sounds. Sound is opt-in, so until the
// visitor has made a choice (the intro's pill gate counts) it gently invites
// a click.
export default function SoundToggle() {
  const soundState = useSoundState();
  const on = soundState === 'on';

  return (
    <button
      type="button"
      className={`${styles.toggle} ${on ? styles.on : ''} ${
        soundState === 'unset' ? styles.invite : ''
      }`}
      aria-pressed={on}
      data-sound="none"
      onClick={() => setSoundEnabled(!on)}
    >
      <span className={styles.bars} aria-hidden="true">
        <span style={{ '--h': '14px', '--d': '0ms' }} />
        <span style={{ '--h': '8px', '--d': '140ms' }} />
        <span style={{ '--h': '12px', '--d': '60ms' }} />
        <span style={{ '--h': '6px', '--d': '200ms' }} />
      </span>
      <span className={styles.word}>Sound</span>
      <span className={styles.state} aria-hidden="true">
        {on ? 'On' : 'Off'}
      </span>
    </button>
  );
}
