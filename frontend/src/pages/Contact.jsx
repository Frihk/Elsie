import { useState } from 'react';
import { useContent } from '../context/ContentContext.jsx';

export default function Contact() {
  const { content, loading } = useContent();
  const page = content?.pages?.contact;

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    supportNeeded: 'General Executive Support',
    message: ''
  });
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', background: 'var(--color-bg)', color: 'var(--color-secondary)' }}>
        <p>Loading...</p>
      </div>
    );
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) {
      setErrorMsg('All fields are required.');
      return;
    }
    try {
      setSubmitting(true);
      setErrorMsg('');
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          message: `[Support Needed: ${formData.supportNeeded}] ${formData.message}`
        })
      });
      if (!response.ok) throw new Error('Failed to send message.');
      setSubmitted(true);
      setFormData({ name: '', email: '', supportNeeded: 'General Executive Support', message: '' });
    } catch (err) {
      setErrorMsg(err.message || 'An error occurred. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="contact-page-container">
      <div className="contact-page-grid">
        {/* Left Column: Form */}
        <div className="contact-form-column">
          <span className="contact-eyebrow">{page?.eyebrow || 'CONTACT'}</span>
          <h1 className="contact-headline">{page?.title || 'Tell us what you are building'}</h1>
          <p className="contact-description">{page?.description || 'Get in touch to discuss support opportunities.'}</p>
          
          {submitted ? (
            <div className="contact-success-msg">
              <p>Thank you for reaching out. We will respond to your inquiry with absolute discretion shortly.</p>
            </div>
          ) : (
            <form className="contact-form" onSubmit={handleSubmit}>
              {errorMsg && <p className="contact-error-msg">{errorMsg}</p>}
              
              <div className="form-group">
                <label htmlFor="name" className="form-label">Full Name</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="e.g. Jane Doe"
                  className="form-input"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="email" className="form-label">Email</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="e.g. jane@company.com"
                  className="form-input"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="supportNeeded" className="form-label">Support Needed</label>
                <select
                  id="supportNeeded"
                  name="supportNeeded"
                  value={formData.supportNeeded}
                  onChange={handleInputChange}
                  className="form-select"
                >
                  <option value="General Executive Support">General Executive Support</option>
                  <option value="Inbox & Calendar Triage">Inbox & Calendar Triage</option>
                  <option value="Logistics & Travel Planning">Logistics & Travel Planning</option>
                  <option value="Special Operations / Projects">Special Operations / Projects</option>
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="message" className="form-label">Message</label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  placeholder="Tell us about your operations..."
                  rows={6}
                  className="form-textarea"
                  required
                />
              </div>

              <button type="submit" className="form-submit-btn" disabled={submitting}>
                {submitting ? 'Sending...' : 'Send Message'}
              </button>
            </form>
          )}
        </div>

        {/* Right Column: Contact Details Card */}
        <div className="contact-details-column">
          <div className="contact-details-card">
            <h2 className="details-card-title">Contact</h2>
            <div className="details-card-group">
              <span className="details-label">Email</span>
              <p className="details-value">{page?.email || 'hello@eira.operations'}</p>
            </div>
            <div className="details-card-group">
              <span className="details-label">Location</span>
              <p className="details-value">{page?.location || 'Geneva, Switzerland & London, UK'}</p>
            </div>
            <div className="details-card-links">
              <a href={`mailto:${page?.email || 'hello@eira.operations'}`} className="details-link">Email Me</a>
              <a href={page?.linkedin || 'https://linkedin.com'} className="details-link" target="_blank" rel="noopener noreferrer">LinkedIn</a>
            </div>
          </div>
        </div>
      </div>
      
      {/* Footer */}
      <footer className="site-footer">
        <p>© 2026 Eira Executive Operations</p>
      </footer>
    </div>
  );
}
