import { useContent } from '../context/ContentContext.jsx';
import { content as fallbackContent, fallbackBlocks } from '../data/site.js';

function AboutSkeleton() {
  return (
    <main className="page-shell">
      <section className="split-hero">
        <div className="skeleton skeleton-portrait" />
        <div className="skeleton-layout">
          <div className="skeleton skeleton-kicker" />
          <div className="skeleton skeleton-line" />
          <div className="skeleton skeleton-line" />
          <div className="skeleton skeleton-line skeleton-line--short" />
        </div>
      </section>
      <section className="section-band">
        <div className="card-grid">
          <div className="skeleton skeleton-card" />
          <div className="skeleton skeleton-card" />
          <div className="skeleton skeleton-card" />
        </div>
      </section>
    </main>
  );
}

export default function About() {
  const { blocks, content, loading } = useContent();
  const page = content?.about || fallbackContent.about;
  const reasons = blocks?.about?.why_choose || fallbackBlocks('about', 'why_choose');

  if (loading) return <AboutSkeleton />;

  return (
    <main className="page-shell">
      <section className="split-hero split-hero--about">
        <figure className="image-panel image-panel--captioned">
          <img src={page.about_image} alt="Founder of Eira Executive Operations" />
          <figcaption>{page.about_photo_caption}</figcaption>
        </figure>
        <div className="hero-stack">
          <p className="eyebrow">{page.about_label}</p>
          <p className="lead-copy">{page.about_bio}</p>
        </div>
      </section>

      <section className="statement-band">
        <h2>{page.efficiency_heading}</h2>
        <p>{page.efficiency_body}</p>
      </section>

      <section className="section-band">
        <div className="section-heading">
          <h2>{page.why_choose_heading}</h2>
        </div>
        <div className="card-grid">
          {reasons.map((block) => (
            <article className="lux-card" key={block.id}>
              <h3>{block.data.title}</h3>
              <p>{block.data.description}</p>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
