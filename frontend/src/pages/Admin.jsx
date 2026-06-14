import SectionHeader from '../components/SectionHeader.jsx';
import { useEffect, useState } from 'react';
import { useContent } from '../context/ContentContext.jsx';

const defaultColors = {
  primary: '#fff5ee',
  secondary: '#5f2a2a',
  accent: '#c1623a',
};

export default function Admin() {
  const { content, saveContent } = useContent();
  const [draft, setDraft] = useState('');
  const [colors, setColors] = useState(defaultColors);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (content) {
      setDraft(JSON.stringify(content, null, 2));
      setColors(content.settings?.colors || defaultColors);
    }
  }, [content]);

  function updateColor(field, value) {
    const next = { ...colors, [field]: value };
    setColors(next);
    setDraft((current) => {
      try {
        const parsed = JSON.parse(current);
        parsed.settings = parsed.settings || {};
        parsed.settings.colors = { ...parsed.settings.colors, [field]: value };
        return JSON.stringify(parsed, null, 2);
      } catch {
        return current;
      }
    });
  }

  async function onSave() {
    try {
      setSaving(true);
      const parsed = JSON.parse(draft);
      const updated = await saveContent(parsed);
      setDraft(JSON.stringify(updated, null, 2));
      setColors(updated.settings?.colors || colors);
      alert('Content saved');
    } catch (err) {
      alert('Save failed: ' + err.message);
    } finally {
      setSaving(false);
    }
  }

  async function onSaveColors() {
    try {
      setSaving(true);
      const updated = await saveContent({
        ...content,
        settings: {
          ...(content?.settings || {}),
          colors,
        },
      });
      setDraft(JSON.stringify(updated, null, 2));
      alert('Color theme saved');
    } catch (err) {
      alert('Save failed: ' + err.message);
    } finally {
      setSaving(false);
    }
  }

  return (
    <main className="inner-page">
      <SectionHeader
        eyebrow="Admin"
        title="Content workspace"
        description="Edit site content and theme colors. Save commits to the backend store."
      />
      <div className="admin-grid">
        <article style={{ gridColumn: '1 / -1' }}>
          <h3>Theme colors</h3>
          <p>Primary/background (60%), secondary text/nav (30%), accent/CTA (10%).</p>
          <div style={{ display: 'grid', gap: 16, marginTop: 16 }}>
            {[
              { key: 'primary', label: 'Primary / background' },
              { key: 'secondary', label: 'Secondary / text/nav' },
              { key: 'accent', label: 'Accent / CTA' },
            ].map(({ key, label }) => (
              <label key={key} style={{ display: 'grid', gap: 8 }}>
                <span>{label}</span>
                <input
                  type="color"
                  value={colors[key]}
                  onChange={(event) => updateColor(key, event.target.value)}
                  style={{ width: '100%', height: 44, borderRadius: 8, border: '1px solid #ccc' }}
                />
              </label>
            ))}
          </div>
          <div style={{ marginTop: 16 }}>
            <button onClick={onSaveColors} disabled={saving || !content}>
              {saving ? 'Saving…' : 'Save color theme'}
            </button>
          </div>
        </article>

        <div style={{ gridColumn: '1 / -1' }}>
          <label htmlFor="content-json">Site content (JSON)</label>
          <textarea
            id="content-json"
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            style={{ width: '100%', height: 420 }}
          />
          <div style={{ marginTop: 12 }}>
            <button onClick={onSave} disabled={saving}>
              {saving ? 'Saving…' : 'Save content'}
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}
