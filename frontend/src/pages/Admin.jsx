import SectionHeader from '../components/SectionHeader.jsx';
import { useEffect, useMemo, useState } from 'react';
import { useContent, applyTheme } from '../context/ContentContext.jsx';

const defaultColors = {
  primary: '#fff5ee',
  secondary: '#5f2a2a',
  accent: '#c1623a',
};

const pageSections = [
  { key: 'home', title: 'Home page' },
  { key: 'projects', title: 'Projects page' },
  { key: 'services', title: 'Services page' },
  { key: 'about', title: 'About page' },
  { key: 'contact', title: 'Contact page' },
];

function clone(value) {
  return JSON.parse(JSON.stringify(value));
}

function setValueAtPath(obj, path, value) {
  const next = clone(obj);
  let target = next;
  path.slice(0, -1).forEach((key) => {
    if (target[key] == null) target[key] = typeof key === 'number' ? [] : {};
    target[key] = clone(target[key]);
    target = target[key];
  });
  target[path[path.length - 1]] = value;
  return next;
}

function getValueAtPath(obj, path) {
  return path.reduce((acc, key) => (acc ? acc[key] : undefined), obj);
}

export default function Admin() {
  const { content, saveContent, loading } = useContent();
  const [draft, setDraft] = useState(null);
  const [saving, setSaving] = useState(false);
  const [savingSection, setSavingSection] = useState('');
  const [statusMessage, setStatusMessage] = useState('');

  useEffect(() => {
    if (content) {
      setDraft(clone(content));
    }
  }, [content]);

  // Dynamically apply draft settings for live preview!
  useEffect(() => {
    if (draft?.settings) {
      applyTheme(draft.settings);
    }
  }, [draft?.settings]);

  const presetFonts = [
    'Inter',
    'Playfair Display',
    'Georgia',
    'System UI',
    'Lora',
    'Merriweather',
    'Cormorant Garamond',
    'Cinzel',
    'Montserrat',
    'Roboto',
    'Open Sans',
    'Lato'
  ];

  const colors = useMemo(
    () => draft?.settings?.colors || { primary: '#fff5ee', secondary: '#5f2a2a', accent: '#c1623a' },
    [draft],
  );

  const currentSections = useMemo(
    () => ({
      home: content?.home,
      projects: { page: content?.pages?.projects, items: content?.projects },
      services: { page: content?.pages?.services, items: content?.services },
      about: content?.pages?.about,
      contact: content?.pages?.contact,
    }),
    [content],
  );

  function currentSectionData(key) {
    return currentSections[key];
  }

  function updateField(path, value) {
    setDraft((current) => (current ? setValueAtPath(current, path, value) : current));
  }

  function updateArrayItem(path, index, value) {
    setDraft((current) => {
      if (!current) return current;
      const array = getValueAtPath(current, path) || [];
      const nextArray = clone(array);
      nextArray[index] = value;
      return setValueAtPath(current, path, nextArray);
    });
  }

  function addArrayItem(path, value) {
    setDraft((current) => {
      if (!current) return current;
      const array = getValueAtPath(current, path) || [];
      return setValueAtPath(current, path, [...array, value]);
    });
  }

  function removeArrayItem(path, index) {
    setDraft((current) => {
      if (!current) return current;
      const array = getValueAtPath(current, path) || [];
      const nextArray = clone(array);
      nextArray.splice(index, 1);
      return setValueAtPath(current, path, nextArray);
    });
  }

  async function handleSave() {
    if (!draft) return;
    try {
      setSaving(true);
      const updated = await saveContent(draft);
      setDraft(clone(updated));
      setStatusMessage('All content saved.');
    } catch (err) {
      setStatusMessage('Save failed: ' + err.message);
    } finally {
      setSaving(false);
      setSavingSection('');
    }
  }

  async function handleSaveSection(sectionLabel) {
    if (!draft) return;
    try {
      setSaving(true);
      setSavingSection(sectionLabel);
      const updated = await saveContent(draft);
      setDraft(clone(updated));
      setStatusMessage(`${sectionLabel} saved.`);
    } catch (err) {
      setStatusMessage(`Save failed for ${sectionLabel}: ${err.message}`);
    } finally {
      setSaving(false);
      setSavingSection('');
    }
  }

  if (loading || !draft) {
    return (
      <main className="inner-page">
        <SectionHeader eyebrow="Admin" title="Content workspace" description="Loading content editor…" />
        <p>Loading admin editor...</p>
      </main>
    );
  }

  return (
    <main className="inner-page admin-page">
      <SectionHeader eyebrow="Admin" title="Content workspace" description="Edit every page text and theme settings here." />

      <section className="admin-section">
        <h3>Global content</h3>
        <div className="admin-field-grid">
          <label>
            Brand line 1
            <input
              value={draft.brand?.line1 || ''}
              onChange={(event) => updateField(['brand', 'line1'], event.target.value)}
            />
          </label>
          <label>
            Brand line 2
            <input
              value={draft.brand?.line2 || ''}
              onChange={(event) => updateField(['brand', 'line2'], event.target.value)}
            />
          </label>
        </div>

        <div className="admin-section admin-subsection">
          <h4>Navigation links</h4>
          {draft.navLinks?.map((link, index) => (
            <div className="admin-grid-row" key={`${link.href}-${index}`}>
              <label>
                Label
                <input
                  value={link.label || ''}
                  onChange={(event) => updateField(['navLinks', index, 'label'], event.target.value)}
                />
              </label>
              <label>
                URL
                <input
                  value={link.href || ''}
                  onChange={(event) => updateField(['navLinks', index, 'href'], event.target.value)}
                />
              </label>
            </div>
          ))}
        </div>

        <details>
          <summary>View current saved global content</summary>
          <pre>{JSON.stringify({ brand: content?.brand, navLinks: content?.navLinks }, null, 2)}</pre>
        </details>

        <div style={{ marginTop: 16 }}>
          <button onClick={() => handleSaveSection('Global content')} disabled={saving}>
            {savingSection === 'Global content' ? 'Saving…' : 'Save global content'}
          </button>
        </div>
      </section>

      <section className="admin-section">
        <h3>Theme Settings (Colors & Fonts)</h3>
        <p>Primary/background (60% weight), secondary/text/nav (30% weight), and accent buttons/links (10% weight) color scheme. Font choices will render instantly across headers and text.</p>
        
        <h4>Color Customization</h4>
        <div className="admin-field-grid">
          {[
            { key: 'primary', label: 'Primary / background (60%)' },
            { key: 'secondary', label: 'Secondary / text/nav (30%)' },
            { key: 'accent', label: 'Accent / CTA (10%)' },
          ].map(({ key, label }) => (
            <label key={key}>
              {label}
              <input
                type="color"
                value={colors[key] || defaultColors[key]}
                onChange={(event) => updateField(['settings', 'colors', key], event.target.value)}
              />
            </label>
          ))}
        </div>

        <h4 style={{ marginTop: 24 }}>Typography (Font Selection)</h4>
        <div className="admin-field-grid">
          <label>
            Heading Font
            <select
              style={{ padding: '12px', borderRadius: '10px', border: '1px solid var(--color-border)', background: 'var(--color-bg)', color: 'var(--color-secondary)' }}
              value={presetFonts.includes(draft.settings?.fonts?.heading) ? draft.settings?.fonts?.heading : 'custom'}
              onChange={(event) => {
                const val = event.target.value;
                if (val !== 'custom') {
                  updateField(['settings', 'fonts', 'heading'], val);
                } else {
                  updateField(['settings', 'fonts', 'heading'], '');
                }
              }}
            >
              {presetFonts.map(font => (
                <option key={font} value={font}>{font}</option>
              ))}
              <option value="custom">Custom Google Font...</option>
            </select>
          </label>
          {(!presetFonts.includes(draft.settings?.fonts?.heading) || !draft.settings?.fonts?.heading) && (
            <label>
              Custom Heading Font Name
              <input
                value={draft.settings?.fonts?.heading || ''}
                onChange={(event) => updateField(['settings', 'fonts', 'heading'], event.target.value)}
                placeholder="e.g. Montserrat"
              />
            </label>
          )}

          <label>
            Body Font
            <select
              style={{ padding: '12px', borderRadius: '10px', border: '1px solid var(--color-border)', background: 'var(--color-bg)', color: 'var(--color-secondary)' }}
              value={presetFonts.includes(draft.settings?.fonts?.body) ? draft.settings?.fonts?.body : 'custom'}
              onChange={(event) => {
                const val = event.target.value;
                if (val !== 'custom') {
                  updateField(['settings', 'fonts', 'body'], val);
                } else {
                  updateField(['settings', 'fonts', 'body'], '');
                }
              }}
            >
              {presetFonts.map(font => (
                <option key={font} value={font}>{font}</option>
              ))}
              <option value="custom">Custom Google Font...</option>
            </select>
          </label>
          {(!presetFonts.includes(draft.settings?.fonts?.body) || !draft.settings?.fonts?.body) && (
            <label>
              Custom Body Font Name
              <input
                value={draft.settings?.fonts?.body || ''}
                onChange={(event) => updateField(['settings', 'fonts', 'body'], event.target.value)}
                placeholder="e.g. Open Sans"
              />
            </label>
          )}
        </div>

        <div style={{ marginTop: 24 }}>
          <button onClick={() => handleSaveSection('Theme Settings')} disabled={saving}>
            {savingSection === 'Theme Settings' ? 'Saving…' : 'Save Theme Settings'}
          </button>
        </div>
      </section>

      {pageSections.map((section) => {
        const page = section.key === 'home' ? draft.home || {} : draft.pages?.[section.key] || {};
        const pathPrefix = section.key === 'home' ? ['home'] : ['pages', section.key];
        return (
          <section key={section.key} className="admin-section">
            <h3>{section.title}</h3>
            <div className="admin-field-grid">
              <label>
                Eyebrow
                <input value={page.eyebrow || ''} onChange={(event) => updateField([...pathPrefix, 'eyebrow'], event.target.value)} />
              </label>
              <label>
                Title
                <input value={page.title || ''} onChange={(event) => updateField([...pathPrefix, 'title'], event.target.value)} />
              </label>
            </div>
            <label>
              Description
              <textarea
                value={page.description || ''}
                onChange={(event) => updateField([...pathPrefix, 'description'], event.target.value)}
                rows={3}
              />
            </label>

            {section.key === 'home' && (
              <>
                <div className="admin-field-grid">
                  <label>
                    Primary CTA label
                    <input
                      value={draft.home?.ctaPrimary?.label || ''}
                      onChange={(event) => updateField(['home', 'ctaPrimary', 'label'], event.target.value)}
                    />
                  </label>
                  <label>
                    Primary CTA URL
                    <input
                      value={draft.home?.ctaPrimary?.href || ''}
                      onChange={(event) => updateField(['home', 'ctaPrimary', 'href'], event.target.value)}
                    />
                  </label>
                </div>
                <div className="admin-field-grid">
                  <label>
                    Secondary CTA label
                    <input
                      value={draft.home?.ctaSecondary?.label || ''}
                      onChange={(event) => updateField(['home', 'ctaSecondary', 'label'], event.target.value)}
                    />
                  </label>
                  <label>
                    Secondary CTA URL
                    <input
                      value={draft.home?.ctaSecondary?.href || ''}
                      onChange={(event) => updateField(['home', 'ctaSecondary', 'href'], event.target.value)}
                    />
                  </label>
                </div>
                <div className="admin-array-section">
                  <h4>Hero paragraphs</h4>
                  {(draft.home?.paragraphs || []).map((paragraph, index) => (
                    <div className="admin-grid-row" key={`home-paragraph-${index}`}>
                      <textarea
                        value={paragraph}
                        onChange={(event) => updateArrayItem(['home', 'paragraphs'], index, event.target.value)}
                        rows={2}
                      />
                      <button type="button" onClick={() => removeArrayItem(['home', 'paragraphs'], index)}>
                        Remove
                      </button>
                    </div>
                  ))}
                  <button type="button" onClick={() => addArrayItem(['home', 'paragraphs'], '')}>
                    Add paragraph
                  </button>
                </div>

                <div className="admin-section admin-subsection" style={{ marginTop: '24px', border: '1px solid var(--color-border)', padding: '16px', borderRadius: '12px' }}>
                  <h4>Page Stats / Metrics</h4>
                  {(draft.stats || []).map((stat, index) => (
                    <div className="admin-grid-row" key={`stat-${index}`} style={{ display: 'grid', gridTemplateColumns: '1fr 2fr auto', gap: '12px', alignItems: 'end', marginBottom: '12px' }}>
                      <label>
                        Value
                        <input
                          value={stat.value || ''}
                          onChange={(event) => updateField(['stats', index, 'value'], event.target.value)}
                        />
                      </label>
                      <label>
                        Label
                        <input
                          value={stat.label || ''}
                          onChange={(event) => updateField(['stats', index, 'label'], event.target.value)}
                        />
                      </label>
                      <button type="button" onClick={() => removeArrayItem(['stats'], index)} style={{ background: '#c1623a', color: '#fff', border: 'none', padding: '10px 14px', borderRadius: '8px', cursor: 'pointer' }}>
                        Remove
                      </button>
                    </div>
                  ))}
                  <button type="button" onClick={() => addArrayItem(['stats'], { value: '', label: '' })} style={{ marginTop: '8px' }}>
                    Add stat
                  </button>
                </div>

                <div className="admin-section admin-subsection" style={{ marginTop: '24px', border: '1px solid var(--color-border)', padding: '16px', borderRadius: '12px' }}>
                  <h4>Home Projects Section Header</h4>
                  <div className="admin-field-grid">
                    <label>
                      Projects Eyebrow
                      <input
                        value={draft.home?.projectsEyebrow || ''}
                        onChange={(event) => updateField(['home', 'projectsEyebrow'], event.target.value)}
                      />
                    </label>
                    <label>
                      Projects Title
                      <input
                        value={draft.home?.projectsTitle || ''}
                        onChange={(event) => updateField(['home', 'projectsTitle'], event.target.value)}
                      />
                    </label>
                  </div>
                  <label style={{ display: 'block', marginTop: '12px' }}>
                    Projects Description
                    <textarea
                      value={draft.home?.projectsDescription || ''}
                      onChange={(event) => updateField(['home', 'projectsDescription'], event.target.value)}
                      rows={2}
                      style={{ width: '100%', marginTop: '4px' }}
                    />
                  </label>
                </div>

                <div className="admin-section admin-subsection" style={{ marginTop: '24px', border: '1px solid var(--color-border)', padding: '16px', borderRadius: '12px' }}>
                  <h4>Home Services Section Header</h4>
                  <div className="admin-field-grid">
                    <label>
                      Services Eyebrow
                      <input
                        value={draft.home?.servicesEyebrow || ''}
                        onChange={(event) => updateField(['home', 'servicesEyebrow'], event.target.value)}
                      />
                    </label>
                    <label>
                      Services Title
                      <input
                        value={draft.home?.servicesTitle || ''}
                        onChange={(event) => updateField(['home', 'servicesTitle'], event.target.value)}
                      />
                    </label>
                  </div>
                  <label style={{ display: 'block', marginTop: '12px' }}>
                    Services Description
                    <textarea
                      value={draft.home?.servicesDescription || ''}
                      onChange={(event) => updateField(['home', 'servicesDescription'], event.target.value)}
                      rows={2}
                      style={{ width: '100%', marginTop: '4px' }}
                    />
                  </label>
                </div>
              </>
            )}

            {section.key === 'projects' && (
              <>
                <div className="admin-list-section">
                  <h4>Projects</h4>
                  {(draft.projects || []).map((project, index) => (
                    <div className="admin-card" key={`project-${index}`}>
                      <label>
                        Title
                        <input
                          value={project.title || ''}
                          onChange={(event) => updateField(['projects', index, 'title'], event.target.value)}
                        />
                      </label>
                      <label>
                        Category
                        <input
                          value={project.category || ''}
                          onChange={(event) => updateField(['projects', index, 'category'], event.target.value)}
                        />
                      </label>
                      <label>
                        Description
                        <textarea
                          value={project.description || ''}
                          onChange={(event) => updateField(['projects', index, 'description'], event.target.value)}
                          rows={2}
                        />
                      </label>
                      <button type="button" onClick={() => removeArrayItem(['projects'], index)}>
                        Remove project
                      </button>
                    </div>
                  ))}
                  <button type="button" onClick={() => addArrayItem(['projects'], { title: '', category: '', description: '' })}>
                    Add project
                  </button>
                </div>
              </>
            )}

            {section.key === 'services' && (
              <div className="admin-array-section">
                <h4>Services</h4>
                {(draft.services || []).map((service, index) => (
                  <div className="admin-grid-row" key={`service-${index}`}>
                    <input
                      value={service}
                      onChange={(event) => updateArrayItem(['services'], index, event.target.value)}
                    />
                    <button type="button" onClick={() => removeArrayItem(['services'], index)}>
                      Remove
                    </button>
                  </div>
                ))}
                <button type="button" onClick={() => addArrayItem(['services'], '')}>
                  Add service
                </button>
              </div>
            )}

            {section.key === 'about' && (
              <div className="admin-array-section">
                <h4>About paragraphs</h4>
                {(page.paragraphs || []).map((paragraph, index) => (
                  <div className="admin-grid-row" key={`about-paragraph-${index}`}>
                    <textarea
                      value={paragraph}
                      onChange={(event) => updateArrayItem(['pages', 'about', 'paragraphs'], index, event.target.value)}
                      rows={2}
                    />
                    <button type="button" onClick={() => removeArrayItem(['pages', 'about', 'paragraphs'], index)}>
                      Remove
                    </button>
                  </div>
                ))}
                <button type="button" onClick={() => addArrayItem(['pages', 'about', 'paragraphs'], '')}>
                  Add paragraph
                </button>
              </div>
            )}

            {section.key === 'contact' && (
              <div className="admin-field-grid">
                <label>
                  Email
                  <input value={draft.pages?.contact?.email || ''} onChange={(event) => updateField(['pages', 'contact', 'email'], event.target.value)} />
                </label>
              </div>
            )}

            <details>
              <summary>View current saved content</summary>
              <pre>{JSON.stringify(currentSectionData(section.key), null, 2)}</pre>
            </details>

            <div style={{ marginTop: 16 }}>
              <button onClick={() => handleSaveSection(section.title)} disabled={saving}>
                {savingSection === section.title ? 'Saving…' : `Save ${section.title}`}
              </button>
            </div>
          </section>
        );
      })}

      <div className="admin-actions">
        <button onClick={handleSave} disabled={saving}>
          {saving ? 'Saving…' : 'Save all page content'}
        </button>
      </div>
    </main>
  );
}
