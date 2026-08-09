import { useLocation, useNavigate } from 'react-router-dom';
import styles from './BackButton.module.css';

export default function BackButton({ fallbackTo = '/', label = 'Back' }) {
  const navigate = useNavigate();
  const location = useLocation();
  // react-router gives the initial history entry key "default"; anything
  // else means there's real browser history to go back to.
  const canGoBack = location.key !== 'default';

  return (
    <button
      type="button"
      className={styles.back}
      onClick={() => (canGoBack ? navigate(-1) : navigate(fallbackTo))}
    >
      <span className={styles.arrow} aria-hidden="true">
        ←
      </span>
      {label}
    </button>
  );
}
