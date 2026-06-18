import { useContent } from '../context/ContentContext.jsx';
import { content as fallbackContent, fallbackBlocks } from '../data/site.js';

function ProjectsSkeleton() {
  return (
    <main className="page-shell">
      <section className="split-hero">
        <div className="skeleton-layout">
          <div className="skeleton skeleton-kicker" />
          <div className="skeleton skeleton-title" />
          <div className="skeleton skeleton-line" />
          <div className="skeleton skeleton-line" />
          <div className="skeleton skeleton-button" />
        </div>
        <div className="skeleton skeleton-portrait" />
      </section>
      <section className="section-band">
        <div className="skeleton skeleton-title skeleton-title--small" />
        <div className="card-grid">
          <div className="skeleton skeleton-card" />
          <div className="skeleton skeleton-card" />
          <div className="skeleton skeleton-card" />
        </div>
      </section>
    </main>
  );
}

export default function Projects() {
  const { blocks, content, loading } = useContent();
  const page = content?.projects || fallbackContent.projects;
  const testimonials = blocks?.projects?.testimonial || fallbackBlocks('projects', 'testimonial');

  if (loading) return <ProjectsSkeleton />;

  return (
    <main className="page-shell">
      <section className="split-hero">
        <div className="hero-stack">
          <p className="eyebrow">{page.projects_cta_label}</p>
          <h1>{page.projects_headline}</h1>
          <ul className="ornate-list">
            {page.projects_bullets.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
          <a className="button-link" href="#testimonials">
            {page.projects_cta_label}
            <span aria-hidden="true">-&gt;</span>
          </a>
        </div>
        <div className="image-panel">
          <img src={page.projects_image} alt="Eira client results portrait" />
        </div>
      </section>

      <section className="section-band" id="testimonials">
        <div className="section-heading">
          <h2>{page.testimonials_heading}</h2>
          <p>{page.testimonials_subtext_1}</p>
          <p>{page.testimonials_subtext_2}</p>
        </div>
        <div className="card-grid">
          {testimonials.map((block) => (
            <article className="lux-card" key={block.id}>
              <h3>{block.data.title}</h3>
              <p>{block.data.quote}</p>
              <span>{block.data.attribution}</span>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
