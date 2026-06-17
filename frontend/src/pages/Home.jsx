import { useContent } from '../context/ContentContext.jsx';

export default function Home() {
  const { content, loading } = useContent();
  const home = content?.home;
  const brand = content?.brand;
  const navLinks = content?.navLinks || [];

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', background: 'var(--color-bg)', color: 'var(--color-secondary)' }}>
        <p>Loading Elsie...</p>
      </div>
    );
  }

  const currentPath = window.location.pathname.replace(/\/$/, '') || '/';

  return (
    <div className="home-split-container">
      {/* Left zone: ~60% width */}
      <div className="home-left-zone">
        <header className="home-left-header">
          <div className="home-brand">
            <a href="/" className="home-brand-title">{brand?.line1 || 'EIRA'}</a>
            <span className="home-brand-subtitle">{brand?.line2 || 'EXECUTIVE OPERATIONS'}</span>
          </div>
          <nav className="home-nav">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className={`home-nav-link ${currentPath === link.href ? 'is-active' : ''}`}
              >
                {link.label}
              </a>
            ))}
          </nav>
        </header>

        <main className="home-left-content">
          <div className="home-tagline-wrapper">
            <span className="home-tagline">{home?.eyebrow || 'PREMIUM DIGITAL CRAFT'}</span>
            <div className="home-tagline-rule" />
          </div>
          
          <h1 className="home-headline">
            {home?.title || 'Building elegant web experiences'}
          </h1>
          
          <p className="home-paragraph">
            {home?.paragraphs?.[0] || 'I design and develop refined digital systems that help brands show up with confidence, clarity, and a memorable sense of style.'}
          </p>
          
          <div className="home-cta-wrapper">
            <a href={home?.ctaPrimary?.href || '/projects'} className="home-cta-btn">
              {home?.ctaPrimary?.label || 'View my work'}
              <svg className="home-cta-arrow" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="5" y1="12" x2="19" y2="12"></line>
                <polyline points="12 5 19 12 12 19"></polyline>
              </svg>
            </a>
          </div>
        </main>
      </div>

      {/* Right zone: ~40% width */}
      <div className="home-right-zone">
        <div className="home-photo-wrapper">
          <img src="/portrait.jpg" alt="Portrait" className="home-portrait-photo" />
        </div>
      </div>
    </div>
  );
}
