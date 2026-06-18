import { useEffect, useMemo, useState } from 'react';
import { applyTheme, useContent } from '../context/ContentContext.jsx';
import { blockTypesByPage, content as fallbackContent, fallbackBlocks, settings as fallbackSettings } from '../data/site.js';

const apiBase = import.meta.env.VITE_API_BASE_URL || '';

const tabs = [
  { key: 'settings', label: 'Global Settings' },
  { key: 'home', label: 'Home' },
  { key: 'projects', label: 'Projects' },
  { key: 'services', label: 'Services' },
  { key: 'about', label: 'About' },
  { key: 'contact', label: 'Contact' },
];

const fonts = [
  'Cormorant Garamond',
  'Playfair Display',
  'DM Serif Display',
  'Libre Baskerville',
  'EB Garamond',
  'Lora',
];

const fieldMap = {
  home: [
    ['brand_name', 'Brand name', 'input'],
    ['brand_subtitle', 'Brand subtitle', 'input'],
    ['hero_tagline', 'Hero tagline', 'input'],
    ['hero_headline', 'Hero headline', 'textarea'],
    ['hero_body', 'Hero body', 'textarea'],
    ['hero_cta_label', 'Hero CTA label', 'input'],
    ['hero_cta_link', 'Hero CTA link', 'input'],
    ['hero_image', 'Hero image', 'image'],
  ],
  projects: [
    ['projects_headline', 'Projects headline', 'textarea'],
    ['projects_cta_label', 'CTA label', 'input'],
    ['projects_bullets', 'Project bullets', 'list'],
    ['projects_image', 'Projects image', 'image'],
    ['testimonials_heading', 'Testimonials heading', 'input'],
    ['testimonials_subtext_1', 'Testimonials subtext 1', 'input'],
    ['testimonials_subtext_2', 'Testimonials subtext 2', 'input'],
  ],
  services: [
    ['services_label', 'Services label', 'input'],
    ['services_headline', 'Services headline', 'textarea'],
    ['services_body', 'Services body', 'textarea'],
    ['how_we_work_heading', 'How we work heading', 'input'],
    ['core_services_heading', 'Core services heading', 'input'],
  ],
  about: [
    ['about_label', 'About label', 'input'],
    ['about_image', 'About image', 'image'],
    ['about_photo_caption', 'Photo caption', 'input'],
    ['about_bio', 'About bio', 'textarea'],
    ['efficiency_heading', 'Efficiency heading', 'input'],
    ['efficiency_body', 'Efficiency body', 'textarea'],
    ['why_choose_heading', 'Why choose heading', 'input'],
  ],
  contact: [
    ['contact_card_heading', 'Contact heading', 'input'],
    ['contact_email', 'Contact email', 'input'],
    ['contact_location', 'Contact location', 'input'],
    ['contact_email_me_url', 'Email link URL', 'input'],
    ['contact_linkedin_url', 'LinkedIn URL', 'input'],
    ['field_label_name', 'Name field label', 'input'],
    ['field_label_email', 'Email field label', 'input'],
    ['field_label_support', 'Support field label', 'input'],
    ['field_label_message', 'Message field label', 'input'],
    ['submit_label', 'Submit label', 'input'],
    ['footer_text', 'Footer text', 'input'],
    ['support_options', 'Support options', 'list'],
  ],
};

const blockLabels = {
  testimonial: 'Testimonials',
  step: 'How we work steps',
  service: 'Core service cards',
  why_choose: 'Why Choose Eira reasons',
};

const blockFields = {
  testimonial: ['title', 'quote', 'attribution'],
  step: ['title', 'description'],
  service: ['number', 'name', 'description'],
  why_choose: ['title', 'description'],
};

function clone(value) {
  return JSON.parse(JSON.stringify(value));
}

function LoginScreen({ onLogin }) {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  async function submit(event) {
    event.preventDefault();
    try {
      const response = await fetch(`${apiBase}/api/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      });
      if (!response.ok) throw new Error('Incorrect password');
      const payload = await response.json();
      localStorage.setItem('eira_admin_token', payload.token);
      onLogin(payload.token);
    } catch {
      setError('Incorrect password');
    }
  }

  return (
    <main className="admin-login-shell">
      <form className="admin-login-card" onSubmit={submit}>
        <span className="admin-login-logo">EIRA</span>
        <p>EXECUTIVE OPERATIONS</p>
        <input
          aria-label="Password"
          type="password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          placeholder="Password"
        />
        {error && <span className="admin-error">{error}</span>}
        <button type="submit">Enter</button>
      </form>
    </main>
  );
}

export default function Admin() {
  const {
    blocks,
    content,
    deleteBlock,
    loading,
    saveBlock,
    saveContentField,
    saveSetting,
    settings,
    uploadFile,
  } = useContent();
  const [token, setToken] = useState(() => localStorage.getItem('eira_admin_token') || '');
  const [activeTab, setActiveTab] = useState('settings');
  const [draftSettings, setDraftSettings] = useState(fallbackSettings);
  const [draftContent, setDraftContent] = useState(fallbackContent);
  const [draftBlocks, setDraftBlocks] = useState({});
  const [deletedIds, setDeletedIds] = useState([]);
  const [dirty, setDirty] = useState(false);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState('');

  useEffect(() => {
    setDraftSettings({ ...fallbackSettings, ...(settings || {}) });
    setDraftContent({ ...fallbackContent, ...(content || {}) });
    const nextBlocks = {};
    Object.entries(blockTypesByPage).forEach(([page, types]) => {
      nextBlocks[page] = {};
      types.forEach((type) => {
        nextBlocks[page][type] = clone(blocks?.[page]?.[type] || fallbackBlocks(page, type));
      });
    });
    setDraftBlocks(nextBlocks);
  }, [blocks, content, settings]);

  useEffect(() => {
    applyTheme(draftSettings);
  }, [draftSettings]);

  const hasToken = Boolean(token);
  const currentPage = draftContent[activeTab] || {};
  const currentBlockTypes = blockTypesByPage[activeTab] || [];

  const navPreview = useMemo(
    () => ['nav_home', 'nav_projects', 'nav_services', 'nav_about', 'nav_contact'],
    [],
  );

  function markDirty() {
    setDirty(true);
  }

  function updateSetting(key, value) {
    setDraftSettings((current) => ({ ...current, [key]: value }));
    markDirty();
  }

  function updateContent(page, key, value) {
    setDraftContent((current) => ({
      ...current,
      [page]: { ...current[page], [key]: value },
    }));
    markDirty();
  }

  function updateBlock(page, type, index, key, value) {
    setDraftBlocks((current) => {
      const next = clone(current);
      next[page][type][index].data[key] = value;
      return next;
    });
    markDirty();
  }

  function addBlock(page, type) {
    const blank = Object.fromEntries(blockFields[type].map((field) => [field, '']));
    setDraftBlocks((current) => {
      const next = clone(current);
      next[page][type].push({
        id: `new-${Date.now()}`,
        page,
        block_type: type,
        order_index: next[page][type].length,
        data: blank,
      });
      return next;
    });
    markDirty();
  }

  function removeBlock(page, type, index) {
    setDraftBlocks((current) => {
      const next = clone(current);
      const [removed] = next[page][type].splice(index, 1);
      if (typeof removed?.id === 'number') {
        setDeletedIds((ids) => [...ids, removed.id]);
      }
      return next;
    });
    markDirty();
  }

  function moveBlock(page, type, index, direction) {
    setDraftBlocks((current) => {
      const next = clone(current);
      const target = index + direction;
      if (target < 0 || target >= next[page][type].length) return current;
      const items = next[page][type];
      [items[index], items[target]] = [items[target], items[index]];
      return next;
    });
    markDirty();
  }

  async function handleUpload(page, key, file) {
    if (!file || !token) return;
    const payload = await uploadFile(file, token);
    updateContent(page, key, payload.url);
  }

  async function saveChanges() {
    if (!token) return;
    setSaving(true);
    try {
      for (const [key, value] of Object.entries(draftSettings)) {
        await saveSetting(key, value, token);
      }
      for (const [page, fields] of Object.entries(draftContent)) {
        for (const [key, value] of Object.entries(fields)) {
          await saveContentField(page, key, value, token);
        }
      }
      for (const id of deletedIds) {
        await deleteBlock(id, token);
      }
      for (const [page, byType] of Object.entries(draftBlocks)) {
        for (const [type, items] of Object.entries(byType)) {
          for (const [index, block] of items.entries()) {
            await saveBlock({ ...block, order_index: index }, token);
          }
        }
      }
      setDeletedIds([]);
      setDirty(false);
      setToast('Changes saved');
      setTimeout(() => setToast(''), 3000);
    } finally {
      setSaving(false);
    }
  }

  if (!hasToken) return <LoginScreen onLogin={setToken} />;

  return (
    <main className="admin-console">
      {toast && <div className="admin-toast">{toast}</div>}
      <aside className="admin-sidebar">
        <div>
          <span className="admin-logo">EIRA</span>
          <p>Executive Operations</p>
        </div>
        <nav>
          {tabs.map((tab) => (
            <button
              className={activeTab === tab.key ? 'is-active' : ''}
              key={tab.key}
              type="button"
              onClick={() => setActiveTab(tab.key)}
            >
              {tab.label}
            </button>
          ))}
        </nav>
        <a href="/" target="_blank" rel="noreferrer">
          View Site
        </a>
        <button className="admin-save" type="button" onClick={saveChanges} disabled={saving || loading}>
          {dirty && <span aria-label="Unsaved changes" />}
          {saving ? 'Saving' : 'Save Changes'}
        </button>
      </aside>

      <section className="admin-main">
        {activeTab === 'settings' ? (
          <div className="admin-panel">
            <h1>Global Settings</h1>
            <div className="setting-grid">
              {[
                ['color_bg', 'Background (60%)'],
                ['color_primary', 'Primary Text & Structure (30%)'],
                ['color_accent', 'Accent - Buttons & Highlights (10%)'],
              ].map(([key, label]) => (
                <label className="color-control" key={key}>
                  <span>{label}</span>
                  <div>
                    <input type="color" value={draftSettings[key]} onChange={(event) => updateSetting(key, event.target.value)} />
                    <input value={draftSettings[key]} onChange={(event) => updateSetting(key, event.target.value)} />
                  </div>
                  <small>Role is fixed. Only the color value can change.</small>
                </label>
              ))}
            </div>
            <div className="setting-grid">
              {[
                ['font_heading', 'Heading font'],
                ['font_body', 'Body font'],
              ].map(([key, label]) => (
                <label key={key}>
                  {label}
                  <select value={draftSettings[key]} onChange={(event) => updateSetting(key, event.target.value)}>
                    {fonts.map((font) => (
                      <option value={font} key={font}>
                        {font}
                      </option>
                    ))}
                  </select>
                </label>
              ))}
            </div>
            <p className="admin-preview">Eira Executive Operations - Reliable. Discreet. Decisive.</p>
            <div className="setting-grid">
              {navPreview.map((key) => (
                <label key={key}>
                  {key.replace('nav_', 'Nav ')}
                  <input value={draftSettings[key]} onChange={(event) => updateSetting(key, event.target.value)} />
                </label>
              ))}
            </div>
          </div>
        ) : (
          <div className="admin-panel">
            <h1>{tabs.find((tab) => tab.key === activeTab)?.label}</h1>
            <div className="admin-form-grid">
              {(fieldMap[activeTab] || []).map(([key, label, type]) => (
                <FieldEditor
                  key={key}
                  fieldKey={key}
                  label={label}
                  page={activeTab}
                  type={type}
                  value={currentPage[key]}
                  onChange={updateContent}
                  onUpload={handleUpload}
                />
              ))}
            </div>
            {currentBlockTypes.map((type) => (
              <section className="block-editor" key={type}>
                <h2>{blockLabels[type]}</h2>
                {(draftBlocks[activeTab]?.[type] || []).map((block, index) => (
                  <article className="block-card" key={block.id}>
                    <div className="block-toolbar">
                      <span className="drag-handle">::</span>
                      <button type="button" onClick={() => moveBlock(activeTab, type, index, -1)}>
                        Up
                      </button>
                      <button type="button" onClick={() => moveBlock(activeTab, type, index, 1)}>
                        Down
                      </button>
                      <button className="danger" type="button" onClick={() => removeBlock(activeTab, type, index)}>
                        Delete
                      </button>
                    </div>
                    {blockFields[type].map((field) => (
                      <label key={field}>
                        {field}
                        <textarea
                          value={block.data[field] || ''}
                          onChange={(event) => updateBlock(activeTab, type, index, field, event.target.value)}
                          rows={field === 'quote' || field === 'description' ? 4 : 2}
                        />
                      </label>
                    ))}
                  </article>
                ))}
                <button className="add-button" type="button" onClick={() => addBlock(activeTab, type)}>
                  + Add
                </button>
              </section>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}

function FieldEditor({ fieldKey, label, onChange, onUpload, page, type, value }) {
  if (type === 'textarea') {
    return (
      <label>
        {label}
        <textarea value={value || ''} onChange={(event) => onChange(page, fieldKey, event.target.value)} rows={5} />
      </label>
    );
  }

  if (type === 'list') {
    const items = Array.isArray(value) ? value : [];
    return (
      <div className="list-editor">
        <span>{label}</span>
        {items.map((item, index) => (
          <input
            key={`${fieldKey}-${index}`}
            value={item}
            onChange={(event) => {
              const next = [...items];
              next[index] = event.target.value;
              onChange(page, fieldKey, next);
            }}
          />
        ))}
        <button type="button" onClick={() => onChange(page, fieldKey, [...items, ''])}>
          + Add
        </button>
      </div>
    );
  }

  if (type === 'image') {
    return (
      <label className="image-upload-field">
        {label}
        {value && <img src={value} alt="" />}
        <input value={value || ''} onChange={(event) => onChange(page, fieldKey, event.target.value)} />
        <input type="file" accept="image/*" onChange={(event) => onUpload(page, fieldKey, event.target.files?.[0])} />
      </label>
    );
  }

  return (
    <label>
      {label}
      <input value={value || ''} onChange={(event) => onChange(page, fieldKey, event.target.value)} />
    </label>
  );
}
