import { useEffect } from 'react';

const SITE_NAME = 'Surya Prakash Musunuri';

function setMeta(name, content, attr = 'name') {
  if (!content) return;
  let tag = document.head.querySelector(`meta[${attr}="${name}"]`);
  if (!tag) {
    tag = document.createElement('meta');
    tag.setAttribute(attr, name);
    document.head.appendChild(tag);
  }
  tag.setAttribute('content', content);
}

function setCanonical(path) {
  if (!path) return;
  let link = document.head.querySelector('link[rel="canonical"]');
  if (!link) {
    link = document.createElement('link');
    link.setAttribute('rel', 'canonical');
    document.head.appendChild(link);
  }
  link.setAttribute('href', `${window.location.origin}${path}`);
}

// Updates the document <title>/description/canonical for the current route.
// Client-side only (no SSR in this app), but still picked up by JS-rendering
// crawlers and improves the tab title / browser history for every visitor.
export function useDocumentHead({ title, description, path }) {
  useEffect(() => {
    const fullTitle = title ? `${title} — ${SITE_NAME}` : SITE_NAME;
    document.title = fullTitle;

    setMeta('description', description);
    setMeta('og:title', fullTitle, 'property');
    setMeta('og:description', description, 'property');
    setCanonical(path);
  }, [title, description, path]);
}
