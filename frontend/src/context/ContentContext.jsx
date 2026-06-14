import React, { createContext, useContext, useEffect, useState } from 'react';
import * as fallback from '../data/site.js';

const ContentContext = createContext(null);

function applyTheme(colors) {
  const root = document.documentElement.style;
  root.setProperty('--color-bg', colors.primary || '#fff5ee');
  root.setProperty('--color-surface', colors.primary || '#fff5ee');
  root.setProperty('--color-secondary', colors.secondary || '#5f2a2a');
  root.setProperty('--color-text', colors.secondary || '#5f2a2a');
  root.setProperty('--color-accent', colors.accent || '#c1623a');
  root.setProperty('--color-text-inverse', '#fff5ee');
  root.setProperty('--color-muted', 'rgba(95, 42, 42, 0.72)');
  root.setProperty('--color-border', 'rgba(95, 42, 42, 0.14)');
  root.setProperty('--color-surface-soft', 'rgba(95, 42, 42, 0.06)');
  root.setProperty('--color-secondary-layer', 'rgba(95, 42, 42, 0.96)');
  root.setProperty('--color-secondary-soft', 'rgba(95, 42, 42, 0.08)');
  root.setProperty('--color-accent-soft', 'rgba(193, 98, 58, 0.08)');
  root.setProperty('--color-accent-glow', 'rgba(193, 98, 58, 0.16)');
}

export function ContentProvider({ children }) {
  const [content, setContent] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      try {
        const res = await fetch('/api/admin/content');
        if (!res.ok) throw new Error('Failed to load content');
        const json = await res.json();
        if (!cancelled) {
          setContent(json.data);
          if (json.data?.settings?.colors) {
            applyTheme(json.data.settings.colors);
          }
        }
      } catch (err) {
        // fallback to local data
        if (!cancelled) {
          const fallbackContent = {
            navLinks: fallback.navLinks,
            projects: fallback.projects,
            services: fallback.services,
            stats: fallback.stats,
            settings: fallback.settings,
          };
          setContent(fallbackContent);
          applyTheme(fallback.settings.colors);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    load();
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (content?.settings?.colors) {
      applyTheme(content.settings.colors);
    }
  }, [content?.settings?.colors]);

  async function saveContent(newContent) {
    const res = await fetch('/api/admin/content', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newContent),
    });
    if (!res.ok) throw new Error('Save failed');
    const json = await res.json();
    setContent(json.data);
    return json.data;
  }

  return (
    <ContentContext.Provider value={{ content, setContent, saveContent, loading }}>
      {children}
    </ContentContext.Provider>
  );
}

export function useContent() {
  const ctx = useContext(ContentContext);
  if (!ctx) throw new Error('useContent must be used within ContentProvider');
  return ctx;
}

export default ContentContext;
