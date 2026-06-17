import { useContent } from '../context/ContentContext.jsx';

export default function Layout({ children }) {
  const currentPath = window.location.pathname.replace(/\/$/, '') || '/';
  const { content, loading } = useContent();

  const navLinks = !loading && content && content.navLinks ? content.navLinks : [];
  const brandLine1 = !loading && content && content.brand ? content.brand.line1 : 'EIRA';
  const brandLine2 = !loading && content && content.brand ? content.brand.line2 : 'EXECUTIVE OPERATIONS';

  return (
    <div className="app-shell">
      <header className="site-header">
        <div className="site-brand">
          <a className="brand-mark" href="/" aria-label="Home">
            {brandLine1}
          </a>
          <span className="brand-subtitle">{brandLine2}</span>
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
