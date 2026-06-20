import { useState } from 'react';
import { useContent } from '../context/ContentContext.jsx';
import { content as fallbackContent } from '../data/site.js';

function ContactSkeleton() {
  return (
    <main className="page-shell">
      <section className="contact-section skeleton-layout">
        <div className="skeleton skeleton-title" />
      </section>
    </main>
  );
}

export default function Contact() {
  const { content, loading } = useContent();
  const page = content?.contact || fallbackContent.contact;
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    supportNeeded: page?.support_options?.[0] || 'Executive Operations',
    message: '',
  });
  const [submitted, setSubmitted] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  if (loading) return <ContactSkeleton />;

  function handleInputChange(event) {
    const { name, value } = event.target;
    setFormData((current) => ({ ...current, [name]: value }));
  }

  function handleSubmit(event) {
    event.preventDefault();
    if (!formData.name || !formData.email || !formData.message) {
      setErrorMsg('All fields are required.');
      return;
    }
    setErrorMsg('');
    setSubmitted(true);
    setFormData({
      name: '',
      email: '',
      supportNeeded: page.support_options[0],
      message: '',
    });
  }

  return (
    <main className="page-shell" id="contact">
      <section className="contact-section">
        <div className="contact-header">
          <h2>Let's begin.</h2>
          {submitted ? (
            <div className="form-success" style={{ marginTop: '80px' }}>
              <p>Thank you. Your message has been prepared with discretion.</p>
            </div>
          ) : (
            <form className="contact-form" onSubmit={handleSubmit}>
              {errorMsg && <p className="form-error">{errorMsg}</p>}
              <label>
                {page.field_label_name}
                <input name="name" value={formData.name} onChange={handleInputChange} />
              </label>
              <label>
                {page.field_label_email}
                <input name="email" type="email" value={formData.email} onChange={handleInputChange} />
              </label>
              <label>
                {page.field_label_support}
                <select name="supportNeeded" value={formData.supportNeeded} onChange={handleInputChange}>
                  {page.support_options.map((option) => (
                    <option value={option} key={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </label>
              <label>
                {page.field_label_message}
                <textarea name="message" rows={1} value={formData.message} onChange={handleInputChange} />
              </label>
              <button type="submit" className="contact-submit">
                {page.submit_label}
                <span className="arrow">——&gt;</span>
              </button>
            </form>
          )}
        </div>

        <aside className="contact-details">
          <div className="fact-pair">
            <span className="fact-label">Email</span>
            <span className="fact-value" style={{ fontStyle: 'normal', fontSize: '16px' }}>{page.contact_email}</span>
          </div>
          <div className="fact-pair">
            <span className="fact-label">Location</span>
            <span className="fact-value" style={{ fontStyle: 'normal', fontSize: '16px' }}>{page.contact_location}</span>
          </div>
          <div style={{ display: 'flex', gap: '24px', marginTop: '24px' }}>
            <a className="fact-label" style={{ color: 'var(--color-accent)', opacity: 1, textDecoration: 'none' }} href={page.contact_email_me_url}>Email Me</a>
            <a className="fact-label" style={{ color: 'var(--color-accent)', opacity: 1, textDecoration: 'none' }} href={page.contact_linkedin_url} target="_blank" rel="noreferrer">
              LinkedIn
            </a>
          </div>
          <p className="text-caption" style={{ marginTop: 'auto', opacity: 0.5 }}>{page.footer_text}</p>
        </aside>
      </section>
    </main>
  );
}
