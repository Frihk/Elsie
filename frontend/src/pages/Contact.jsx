import { useState } from 'react';
import { useContent } from '../context/ContentContext.jsx';
import { content as fallbackContent } from '../data/site.js';

function ContactSkeleton() {
  return (
    <main className="contact-shell">
      <section className="contact-form-panel skeleton-layout">
        <div className="skeleton skeleton-title" />
        <div className="skeleton skeleton-line" />
        <div className="skeleton skeleton-line" />
        <div className="skeleton skeleton-line" />
        <div className="skeleton skeleton-button" />
      </section>
      <aside className="contact-card">
        <div className="skeleton skeleton-card" />
      </aside>
    </main>
  );
}

export default function Contact() {
  const { content, loading } = useContent();
  const page = content?.contact || fallbackContent.contact;
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    supportNeeded: page.support_options[0],
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
    <main className="contact-shell" id="contact">
      <section className="contact-form-panel">
        <p className="eyebrow">{page.contact_card_heading}</p>
        <h1>{page.contact_card_heading}</h1>
        {submitted ? (
          <div className="form-success">
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
              <textarea name="message" rows={6} value={formData.message} onChange={handleInputChange} />
            </label>
            <button type="submit" className="button-link button-link--button">
              {page.submit_label}
            </button>
          </form>
        )}
      </section>

      <aside className="contact-card">
        <h2>{page.contact_card_heading}</h2>
        <div>
          <span>Email</span>
          <p>{page.contact_email}</p>
        </div>
        <div>
          <span>Location</span>
          <p>{page.contact_location}</p>
        </div>
        <div className="contact-links">
          <a href={page.contact_email_me_url}>Email Me</a>
          <a href={page.contact_linkedin_url} target="_blank" rel="noreferrer">
            LinkedIn
          </a>
        </div>
        <p className="footer-note">{page.footer_text}</p>
      </aside>
    </main>
  );
}
