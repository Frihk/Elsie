import SectionHeader from '../components/SectionHeader.jsx';
import { useEffect, useState } from 'react';
import { useContent } from '../context/ContentContext.jsx';

export default function Admin() {
  const { content, saveContent } = useContent();
  const [draft, setDraft] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (content) setDraft(JSON.stringify(content, null, 2));
  }, [content]);

  async function onSave() {
    try {
      setSaving(true);
      const parsed = JSON.parse(draft);
      await saveContent(parsed);
      alert('Content saved');
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
        description="Edit site content and settings below. Save commits to the backend store."
      />
      <div className="admin-grid">
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
