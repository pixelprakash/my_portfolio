import { Link } from 'react-router-dom';
import { useDocumentHead } from '../hooks/useDocumentHead';

export default function NotFoundPage() {
  useDocumentHead({
    title: 'Page not found',
    description: 'The page you were looking for could not be found.',
  });

  return (
    <section
      className="section-container"
      style={{
        padding: '7rem 0',
        textAlign: 'center',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '1.5rem',
      }}
    >
      <span className="kicker">404</span>
      <h1 style={{ fontSize: 'clamp(1.75rem, 5vw, 2.75rem)' }}>Page not found</h1>
      <p style={{ color: 'var(--color-text-secondary)', maxWidth: '480px' }}>
        The page you're looking for doesn't exist or may have moved.
      </p>
      <Link
        to="/"
        style={{
          display: 'inline-flex',
          padding: '0.75rem 1.75rem',
          borderRadius: 'var(--radius-pill)',
          border: '1px solid var(--color-border-strong)',
          fontWeight: 600,
        }}
      >
        Back to home
      </Link>
    </section>
  );
}
