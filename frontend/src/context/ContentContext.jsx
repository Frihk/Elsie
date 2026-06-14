import React, { createContext, useContext, useEffect, useState } from 'react';
import * as fallback from '../data/site.js';

const ContentContext = createContext(null);

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
        }
      } catch (err) {
        // fallback to local data
        if (!cancelled) {
          setContent({
            navLinks: fallback.navLinks,
            projects: fallback.projects,
            services: fallback.services,
            stats: fallback.stats,
          });
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
