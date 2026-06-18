import React, { createContext, useContext, useEffect, useState } from 'react';
import * as fallback from '../data/site.js';

const ContentContext = createContext(null);

export function applyTheme(settings) {
  if (!settings) return;
  const colors = settings.colors || {};
  const fonts = settings.fonts || {};
  const root = document.documentElement.style;

  root.setProperty('--color-bg', colors.primary || '#fff5ee');
  root.setProperty('--color-surface', colors.primary || '#fff5ee');
  root.setProperty('--color-secondary', colors.secondary || '#5f2a2a');
  root.setProperty('--color-text', colors.secondary || '#5f2a2a');
  root.setProperty('--color-accent', colors.accent || '#c1623a');
  root.setProperty('--color-text-inverse', colors.primary || '#fff5ee');

  const hexToRgba = (hex, alpha) => {
    if (!hex) return '';
    const cleanHex = hex.replace('#', '');
    let r = 0, g = 0, b = 0;
    if (cleanHex.length === 3) {
      r = parseInt(cleanHex[0] + cleanHex[0], 16);
      g = parseInt(cleanHex[1] + cleanHex[1], 16);
      b = parseInt(cleanHex[2] + cleanHex[2], 16);
    } else if (cleanHex.length === 6) {
      r = parseInt(cleanHex.substring(0, 2), 16);
      g = parseInt(cleanHex.substring(2, 4), 16);
      b = parseInt(cleanHex.substring(4, 6), 16);
    }
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  };

  const secondaryColor = colors.secondary || '#5f2a2a';
  const accentColor = colors.accent || '#c1623a';

  root.setProperty('--color-muted', hexToRgba(secondaryColor, 0.72));
  root.setProperty('--color-border', hexToRgba(secondaryColor, 0.14));
  root.setProperty('--color-surface-soft', hexToRgba(secondaryColor, 0.06));
  root.setProperty('--color-secondary-layer', hexToRgba(secondaryColor, 0.96));
  root.setProperty('--color-secondary-soft', hexToRgba(secondaryColor, 0.08));
  root.setProperty('--color-accent-soft', hexToRgba(accentColor, 0.08));
  root.setProperty('--color-accent-glow', hexToRgba(accentColor, 0.16));

  const loadGoogleFont = (fontName) => {
    if (!fontName) return;
    const stdFonts = ['inter', 'playfair display', 'georgia', 'system ui', 'ui-sans-serif', 'system-ui', '-apple-system', 'sans-serif', 'serif', 'monospace', 'arial', 'helvetica'];
    if (stdFonts.includes(fontName.toLowerCase())) return;

    const linkId = `gfont-${fontName.replace(/\s+/g, '-').toLowerCase()}`;
    if (document.getElementById(linkId)) return;

    const link = document.createElement('link');
    link.id = linkId;
    link.rel = 'stylesheet';
    link.href = `https://fonts.googleapis.com/css2?family=${encodeURIComponent(fontName)}:wght@300;400;600;700&display=swap`;
    document.head.appendChild(link);
  };

  if (fonts.heading) {
    loadGoogleFont(fonts.heading);
    root.setProperty('--font-heading', `"${fonts.heading}", Georgia, serif`);
  }
  if (fonts.body) {
    loadGoogleFont(fonts.body);
    root.setProperty('--font-body', `"${fonts.body}", ui-sans-serif, system-ui, -apple-system, sans-serif`);
  }
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
          if (json.data?.settings) {
            applyTheme(json.data.settings);
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
          applyTheme(fallback.settings);
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
    if (content?.settings) {
      applyTheme(content.settings);
    }
  }, [content?.settings]);

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
