import { useContent } from '../context/ContentContext.jsx';
import { content as fallbackContent, fallbackBlocks } from '../data/site.js';

function ServicesSkeleton() {
  return (
    <main className="page-shell">
      <section className="timeline-section skeleton-layout">
        <div className="skeleton skeleton-title" />
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
      {/* Component 06: How We Work */}
      <section className="timeline-section">
        <div className="timeline-grid">
          {steps.map((block, index) => (
            <article className="timeline-col" key={block.id}>
              <div className="timeline-num">{String(index + 1).padStart(2, '0')}</div>
              <h3 className="timeline-title">{block.data.title}</h3>
              <p className="timeline-desc">{block.data.description}</p>
            </article>
          ))}
        </div>
      </section>

      {/* Component 05: Services Accordion */}
      <section className="accordion-section">
        <div className="accordion-header">
          <p className="eyebrow">{page.services_label}</p>
          <h2>{page.services_headline}</h2>
          <p className="text-body" style={{ maxWidth: '600px', marginTop: '24px' }}>{page.services_body}</p>
        </div>
        <div className="accordion-list">
          {services.map((block) => (
            <article className="accordion-item" key={block.id}>
              <div className="accordion-top">
                <h3 className="accordion-title">{block.data.name}</h3>
                <span className="accordion-icon">+</span>
              </div>
              <p className="accordion-desc">{block.data.description}</p>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
