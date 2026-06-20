import { useContent } from '../context/ContentContext.jsx';
import { content as fallbackContent } from '../data/site.js';

function HomeSkeleton() {
  return (
    <main className="page-shell">
      <section className="hero-statement skeleton-layout" style={{ width: '100%', maxWidth: '800px', margin: '0 auto' }}>
        <div className="skeleton skeleton-title" />
        <div className="skeleton skeleton-title" style={{ marginLeft: '60px' }} />
        <div className="skeleton skeleton-line skeleton-line--short" style={{ marginTop: '64px', alignSelf: 'center' }} />
      </section>
    </main>
  );
}

export default function Home() {
  const { content, loading } = useContent();
  const home = content?.home || fallbackContent.home;

  if (loading) return <HomeSkeleton />;

  const words = home.hero_headline.split(' ');
  const half = Math.ceil(words.length / 2);
  const firstLine = words.slice(0, half).join(' ');
  const secondLine = words.slice(half).join(' ');

  return (
    <main className="page-shell">
      <section className="hero-statement">
        <div className="hero-watermark">01</div>
        <div className="hero-vertical-text">{home.brand_name} {home.brand_subtitle} — EST. 2024</div>
        
        <h1 className="text-hero">
          <span className="italic">{firstLine}</span>
          <span className="bold">{secondLine}</span>
        </h1>
        
        <p className="text-body">{home.hero_body}</p>
        
        <a className="hero-cta" href={home.hero_cta_link}>
          {home.hero_cta_label}
          <span className="arrow" aria-hidden="true">——&gt;</span>
        </a>

        <div className="hero-chevron">
          <svg width="24" height="14" viewBox="0 0 24 14" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M2 2L12 12L22 2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
      </section>
    </main>
  );
}
