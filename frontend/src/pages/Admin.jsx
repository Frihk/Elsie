import SectionHeader from '../components/SectionHeader.jsx';
import { useEffect, useMemo, useState } from 'react';
import { useContent } from '../context/ContentContext.jsx';

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
        <h3>Theme colors</h3>
        <p>Primary/background (60%), secondary/nav/text (30%), accent buttons/links (10%).</p>
        <div className="admin-field-grid">
          {[
            { key: 'primary', label: 'Primary / background' },
            { key: 'secondary', label: 'Secondary / text/nav' },
            { key: 'accent', label: 'Accent / CTA' },
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
        <div style={{ marginTop: 16 }}>
          <button onClick={() => handleSaveSection('Theme colors')} disabled={saving}>
            {savingSection === 'Theme colors' ? 'Saving…' : 'Save theme colors'}
          </button>
        </div>
      </section>

      {pageSections.map((section) => {
        const page = section.key === 'home' ? draft.home || {} : draft.pages?.[section.key] || {};
        return (
          <section key={section.key} className="admin-section">
            <h3>{section.title}</h3>
            <div className="admin-field-grid">
              <label>
                Eyebrow
                <input value={page.eyebrow || ''} onChange={(event) => updateField(['pages', section.key, 'eyebrow'], event.target.value)} />
              </label>
              <label>
                Title
                <input value={page.title || ''} onChange={(event) => updateField(['pages', section.key, 'title'], event.target.value)} />
              </label>
            </div>
            <label>
              Description
              <textarea
                value={page.description || ''}
                onChange={(event) => updateField(['pages', section.key, 'description'], event.target.value)}
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
