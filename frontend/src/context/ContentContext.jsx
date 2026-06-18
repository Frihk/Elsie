import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import * as site from '../data/site.js';

const ContentContext = createContext(null);
const apiBase = import.meta.env.VITE_API_BASE_URL || '';

const routePages = {
  '/': 'home',
  '/projects': 'projects',
  '/services': 'services',
  '/about': 'about',
  '/contact': 'contact',
};

function currentPageFromPath() {
  const path = window.location.pathname.replace(/\/$/, '') || '/';
  return routePages[path] || 'home';
}

function loadGoogleFont(fontName) {
  if (!fontName) return;
  const linkId = `gfont-${fontName.replace(/\s+/g, '-').toLowerCase()}`;
  if (document.getElementById(linkId)) return;

  const link = document.createElement('link');
  link.id = linkId;
  link.rel = 'stylesheet';
  link.href = `https://fonts.googleapis.com/css2?family=${encodeURIComponent(fontName)}:wght@400;500;600;700&display=swap`;
  document.head.appendChild(link);
}

export function applyTheme(settings) {
  const nextSettings = { ...site.settings, ...(settings || {}) };
  const root = document.documentElement.style;

  root.setProperty('--color-bg', nextSettings.color_bg);
  root.setProperty('--color-primary', nextSettings.color_primary);
  root.setProperty('--color-accent', nextSettings.color_accent);
  root.setProperty('--font-heading', `"${nextSettings.font_heading}", serif`);
  root.setProperty('--font-body', `"${nextSettings.font_body}", serif`);

  loadGoogleFont(nextSettings.font_heading);
  loadGoogleFont(nextSettings.font_body);
}

async function api(path, options) {
  const response = await fetch(`${apiBase}${path}`, options);
  if (!response.ok) {
    const payload = await response.json().catch(() => ({}));
    throw new Error(payload.error || 'API request failed');
  }
  return response.json();
}

function normalizePageContent(page, values) {
  const fallback = site.content[page] || {};
  return Object.fromEntries(
    Object.entries(fallback).map(([key, fallbackValue]) => [
      key,
      site.parseField(values?.[key], fallbackValue),
    ]),
  );
}

function normalizeBlocks(page, type, responseBlocks) {
  if (!Array.isArray(responseBlocks) || responseBlocks.length === 0) {
    return site.fallbackBlocks(page, type);
  }
  return responseBlocks.map((block, index) => ({
    id: block.id,
    page: block.page || page,
    block_type: block.block_type || type,
    order_index: block.order_index ?? index,
    data: block.data || {},
  }));
}

export function ContentProvider({ children }) {
  const currentPage = currentPageFromPath();
  const [settings, setSettings] = useState(site.settings);
  const [content, setContent] = useState(site.content);
  const [blocks, setBlocks] = useState(() => {
    const seeded = {};
    Object.entries(site.blockTypesByPage).forEach(([page, types]) => {
      seeded[page] = {};
      types.forEach((type) => {
        seeded[page][type] = site.fallbackBlocks(page, type);
      });
    });
    return seeded;
  });
  const [loading, setLoading] = useState(true);
  const [apiAvailable, setApiAvailable] = useState(true);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setLoading(true);
      try {
        const settingsPayload = await api('/api/settings');
        if (cancelled) return;

        const nextSettings = { ...site.settings, ...(settingsPayload.settings || {}) };
        setSettings(nextSettings);
        applyTheme(nextSettings);

        const pagesToLoad = currentPage === 'home' ? ['home'] : [currentPage];
        if (window.location.pathname.replace(/\/$/, '') === '/admin') {
          pagesToLoad.splice(0, pagesToLoad.length, ...Object.keys(site.content));
        }

        const nextContent = { ...site.content };
        const nextBlocks = {};

        for (const page of pagesToLoad) {
          const contentPayload = await api(`/api/content?page=${encodeURIComponent(page)}`);
          nextContent[page] = normalizePageContent(page, contentPayload.content);

          nextBlocks[page] = {};
          for (const type of site.blockTypesByPage[page] || []) {
            const blockPayload = await api(`/api/blocks?page=${encodeURIComponent(page)}&type=${encodeURIComponent(type)}`);
            nextBlocks[page][type] = normalizeBlocks(page, type, blockPayload.blocks);
          }
        }

        if (!cancelled) {
          setContent((current) => ({ ...current, ...nextContent }));
          setBlocks((current) => ({ ...current, ...nextBlocks }));
          setApiAvailable(true);
        }
      } catch {
        if (!cancelled) {
          setSettings(site.settings);
          setContent(site.content);
          applyTheme(site.settings);
          setApiAvailable(false);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, [currentPage]);

  async function saveSetting(key, value, token) {
    await api('/api/settings', {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ key, value }),
    });
    setSettings((current) => ({ ...current, [key]: value }));
  }

  async function saveContentField(page, fieldKey, value, token) {
    const storedValue = Array.isArray(value) ? JSON.stringify(value) : value;
    await api('/api/content', {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ page, field_key: fieldKey, value: storedValue }),
    });
    setContent((current) => ({
      ...current,
      [page]: { ...current[page], [fieldKey]: value },
    }));
  }

  async function saveBlock(block, token) {
    const payload = {
      id: typeof block.id === 'number' ? block.id : 0,
      page: block.page,
      block_type: block.block_type,
      order_index: block.order_index,
      data: block.data,
    };
    const result = await api('/api/blocks', {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    return result.id;
  }

  async function deleteBlock(id, token) {
    if (typeof id !== 'number') return;
    await api(`/api/blocks/${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` },
    });
  }

  async function uploadFile(file, token) {
    const formData = new FormData();
    formData.append('file', file);
    return api('/api/upload', {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
      body: formData,
    });
  }

  const value = useMemo(
    () => ({
      apiAvailable,
      blocks,
      content,
      currentPage,
      deleteBlock,
      loading,
      saveBlock,
      saveContentField,
      saveSetting,
      settings,
      uploadFile,
    }),
    [apiAvailable, blocks, content, currentPage, loading, settings],
  );

  return <ContentContext.Provider value={value}>{children}</ContentContext.Provider>;
}

export function useContent() {
  const ctx = useContext(ContentContext);
  if (!ctx) throw new Error('useContent must be used within ContentProvider');
  return ctx;
}

export default ContentContext;
