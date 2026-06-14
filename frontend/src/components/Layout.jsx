import { navLinks } from '../data/site.js';

export default function Layout({ children }) {
  const currentPath = window.location.pathname.replace(/\/$/, '') || '/';

  return (
    <div className="app-shell">
      <header className="site-header">
        <a className="brand-mark" href="/" aria-label="Elsie home">
          Elsie
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
