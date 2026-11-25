import { setUiPreview, useUiPreview } from '../../lib/uiVersion';
import styles from './PreviewSwitch.module.css';

const OPTIONS = [
  { value: 'v1', label: 'v1', name: 'Version 1, the current design' },
  { value: 'v2', label: 'v2', name: 'Version 2, the redesign' },
];

// The floating v1 / v2 switch. It only exists for someone who opened a preview
// link (see lib/uiVersion); for everyone else it renders nothing. It looks the
// same in both versions, so it never favours one in a comparison.
export default function PreviewSwitch() {
  const preview = useUiPreview();
  if (!preview) return null;

  return (
    <>
      {/* room under the footer, so the floating bar never covers its links */}
      <div className={styles.spacer} aria-hidden="true" />
      <div className={styles.bar} role="group" aria-label="Design preview">
        <span className={styles.label}>Preview</span>
        <span className={styles.track} data-active={preview}>
          <span className={styles.thumb} aria-hidden="true" />
          {OPTIONS.map((option) => (
            <button
              key={option.value}
              type="button"
              className={styles.option}
              aria-pressed={preview === option.value}
              aria-label={option.name}
              onClick={() => setUiPreview(option.value)}
            >
              {option.label}
            </button>
          ))}
        </span>
        <button
          type="button"
          className={styles.close}
          aria-label="Leave the preview"
          title="Leave the preview"
          onClick={() => setUiPreview(null)}
        >
          ✕
        </button>
      </div>
    </>
  );
}
