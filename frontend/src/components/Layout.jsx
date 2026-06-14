import { useContent } from '../context/ContentContext.jsx';

export default function Layout({ children }) {
  const currentPath = window.location.pathname.replace(/\/$/, '') || '/';
  const { content, loading } = useContent();

  const navLinks = !loading && content && content.navLinks ? content.navLinks : [];
  const brandLine1 = !loading && content && content.brand ? content.brand.line1 : 'Elsie';

  return (
    <div className="app-shell">
      <header className="site-header">
        <a className="brand-mark" href="/" aria-label="Home">
          {brandLine1}
        </a>
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
