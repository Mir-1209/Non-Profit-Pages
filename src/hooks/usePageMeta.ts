import { useEffect } from 'react';
import { site } from '../config/site';

function setMeta(selector: string, attr: 'content' | 'href', value: string) {
  const el = document.head.querySelector(selector);
  if (el) el.setAttribute(attr, value);
}

/** Keeps <title>, description, canonical and social tags in sync with the current route. */
export function usePageMeta(title: string, description: string = site.description) {
  useEffect(() => {
    const full = title ? `${title} — ${site.name} (${site.short})` : `${site.name} (${site.short}) — ${site.tagline}`;
    document.title = full;
    const url = site.url + window.location.pathname;
    setMeta('meta[name="description"]', 'content', description);
    setMeta('meta[property="og:title"]', 'content', full);
    setMeta('meta[property="og:description"]', 'content', description);
    setMeta('meta[property="og:url"]', 'content', url);
    setMeta('meta[name="twitter:title"]', 'content', full);
    setMeta('meta[name="twitter:description"]', 'content', description);
    setMeta('link[rel="canonical"]', 'href', url);
  }, [title, description]);
}
