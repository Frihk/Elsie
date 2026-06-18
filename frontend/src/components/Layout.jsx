import { useContent } from '../context/ContentContext.jsx';
import { navLinks as fallbackNav } from '../data/site.js';

export default function Layout({ children }) {
  const currentPath = window.location.pathname.replace(/\/$/, '') || '/';
  const { content, settings } = useContent();

  if (currentPath === '/admin') {
    return <div className="app-shell app-shell--admin">{children}</div>;
  }

  const navLinks = fallbackNav.map((link) => ({
    ...link,
    label: settings?.[link.key] || link.label,
  }));
  const brandName = content?.home?.brand_name || 'EIRA';
  const brandSubtitle = content?.home?.brand_subtitle || 'EXECUTIVE OPERATIONS';

  return (
    <div className="app-shell">
      <header className="site-header">
        <div className="site-brand">
          <a className="brand-mark" href="/" aria-label="Home">
            {brandName}
          </a>
          <span className="brand-subtitle">{brandSubtitle}</span>
        </div>
        <nav className="site-nav" aria-label="Primary navigation">
          {navLinks.map((link) => (
            <a
              className={currentPath === link.href ? 'is-active' : ''}
              href={link.href}
              key={link.href}
            >
              {link.label}
            </a>
          ))}
        </nav>
      </header>
      {children}
    </div>
  );
}
