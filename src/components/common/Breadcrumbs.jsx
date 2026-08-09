import { Link } from 'react-router-dom';
import styles from './Breadcrumbs.module.css';

// items: [{ label, href? }] — the last item is treated as the current page
// (no link, aria-current="page").
export default function Breadcrumbs({ items }) {
  return (
    <nav className={styles.breadcrumbs} aria-label="Breadcrumb">
      <ol>
        {items.map((item, index) => {
          const isLast = index === items.length - 1;
          return (
            <li key={item.label}>
              {index > 0 && (
                <span className={styles.separator} aria-hidden="true">
                  /
                </span>
              )}
              {isLast || !item.href ? (
                <span className={styles.current} aria-current="page">
                  {item.label}
                </span>
              ) : (
                <Link to={item.href}>{item.label}</Link>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
