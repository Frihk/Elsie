import { useContent } from '../context/ContentContext.jsx';
import { content as fallbackContent, fallbackBlocks } from '../data/site.js';

function ServicesSkeleton() {
  return (
    <main className="page-shell">
      <section className="center-hero skeleton-layout">
        <div className="skeleton skeleton-kicker" />
        <div className="skeleton skeleton-title" />
        <div className="skeleton skeleton-line" />
        <div className="skeleton skeleton-line skeleton-line--short" />
      </section>
      <section className="section-band">
        <div className="card-grid card-grid--two">
          <div className="skeleton skeleton-card" />
          <div className="skeleton skeleton-card" />
          <div className="skeleton skeleton-card" />
          <div className="skeleton skeleton-card" />
        </div>
      </section>
    </main>
  );
}

export default function Services() {
  const { blocks, content, loading } = useContent();
  const page = content?.services || fallbackContent.services;
  const steps = blocks?.services?.step || fallbackBlocks('services', 'step');
  const services = blocks?.services?.service || fallbackBlocks('services', 'service');

  if (loading) return <ServicesSkeleton />;

  return (
    <main className="page-shell">
      <section className="center-hero">
        <p className="eyebrow">{page.services_label}</p>
        <h1>{page.services_headline}</h1>
        <p className="lead-copy">{page.services_body}</p>
      </section>

      <section className="section-band">
        <div className="section-heading">
          <h2>{page.how_we_work_heading}</h2>
        </div>
        <div className="timeline-list">
          {steps.map((block, index) => (
            <article className="timeline-item" key={block.id}>
              <span>{String(index + 1).padStart(2, '0')}</span>
              <div>
                <h3>{block.data.title}</h3>
                <p>{block.data.description}</p>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="section-band">
        <div className="section-heading">
          <h2>{page.core_services_heading}</h2>
        </div>
        <div className="card-grid card-grid--two">
          {services.map((block) => (
            <article className="lux-card" key={block.id}>
              <span className="card-number">{block.data.number}</span>
              <h3>{block.data.name}</h3>
              <p>{block.data.description}</p>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
