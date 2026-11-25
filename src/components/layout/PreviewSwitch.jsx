import { useLocation } from 'react-router-dom';
import { setHeroOption, setUiPreview, useHeroOption, useUiPreview } from '../../lib/uiVersion';
import styles from './PreviewSwitch.module.css';

const VERSIONS = [
  { value: 'v1', label: 'v1', name: 'Version 1, the current design' },
  { value: 'v2', label: 'v2', name: 'Version 2, the redesign' },
];

const HEROES = [
  { value: '1', label: '1', name: 'Hero option 1, light and glass' },
  { value: '2', label: '2', name: 'Hero option 2, choose your pill' },
];

function Segmented({ options, value, onChange }) {
  return (
    <span className={styles.track} data-second={value === options[1].value || undefined}>
      <span className={styles.thumb} aria-hidden="true" />
      {options.map((option) => (
        <button
          key={option.value}
          type="button"
          className={styles.option}
          aria-pressed={value === option.value}
          aria-label={option.name}
          onClick={() => onChange(option.value)}
        >
          {option.label}
        </button>
      ))}
    </span>
  );
}

// The floating preview switch. It only exists for someone who opened a preview
// link (see lib/uiVersion); for everyone else it renders nothing. It looks the
// same in both versions, so it never favours one in a comparison. On the home
// page in v2, it also chooses between the two heroes.
export default function PreviewSwitch() {
  const preview = useUiPreview();
  const hero = useHeroOption();
  const { pathname } = useLocation();
  if (!preview) return null;

  return (
    <>
      {/* room under the footer, so the floating bar never covers its links */}
      <div className={styles.spacer} aria-hidden="true" />
      <div className={styles.bar} role="group" aria-label="Design preview">
        <span className={styles.label}>Preview</span>
        <Segmented options={VERSIONS} value={preview} onChange={setUiPreview} />
        {preview === 'v2' && pathname === '/' && (
          <span className={styles.heroes} role="group" aria-label="Hero option">
            <span className={styles.heroLabel} aria-hidden="true">
              Hero
            </span>
            <Segmented options={HEROES} value={hero} onChange={setHeroOption} />
          </span>
        )}
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
