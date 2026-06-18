import { useContent } from '../context/ContentContext.jsx';
import { content as fallbackContent } from '../data/site.js';

function HomeSkeleton() {
  return (
    <main className="home-shell">
      <section className="home-copy skeleton-layout">
        <div className="skeleton skeleton-kicker" />
        <div className="skeleton skeleton-title" />
        <div className="skeleton skeleton-line" />
        <div className="skeleton skeleton-line skeleton-line--short" />
        <div className="skeleton skeleton-button" />
      </section>
      <aside className="home-visual">
        <div className="skeleton skeleton-portrait" />
      </aside>
    </main>
  );
}

export default function Home() {
  const { content, loading } = useContent();
  const home = content?.home || fallbackContent.home;

  if (loading) return <HomeSkeleton />;

  return (
    <main className="home-shell">
      <section className="home-copy">
        <p className="eyebrow">{home.hero_tagline}</p>
        <h1>{home.hero_headline}</h1>
        <p className="lead-copy">{home.hero_body}</p>
        <a className="button-link" href={home.hero_cta_link}>
          {home.hero_cta_label}
          <span aria-hidden="true">-&gt;</span>
        </a>
      </section>
      <aside className="home-visual">
        <img src={home.hero_image} alt={`${home.brand_name} executive portrait`} />
      </aside>
    </main>
  );
}
