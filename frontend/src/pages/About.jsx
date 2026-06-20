import { useContent } from '../context/ContentContext.jsx';
import { content as fallbackContent, fallbackBlocks } from '../data/site.js';

function AboutSkeleton() {
  return (
    <main className="page-shell">
      <section className="about-section skeleton-layout">
        <div className="skeleton skeleton-title" />
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
      {/* Component 07: About */}
      <section className="about-section">
        <div className="about-col-1"></div>
        <div className="about-col-2">
          <p className="about-bio">{page.about_bio}</p>
        </div>
        <div className="about-col-3">
          <div className="fact-pair">
            <span className="fact-label">Founded</span>
            <span className="fact-value">2024</span>
          </div>
          <div className="fact-pair">
            <span className="fact-label">Operating In</span>
            <span className="fact-value">USA — Remote</span>
          </div>
          <div className="fact-pair">
            <span className="fact-label">Approach</span>
            <span className="fact-value">Precision & Discretion</span>
          </div>
          <a className="about-cta" href="/contact">
            Work with us →
          </a>
        </div>
      </section>

      <section className="statement-band">
        <h2>{page.efficiency_heading}</h2>
        <p className="lead-copy">{page.efficiency_body}</p>
      </section>

      <section className="section-band">
        <div className="section-heading">
          <h2>{page.why_choose_heading}</h2>
        </div>
        <div className="card-grid">
          {reasons.map((block) => (
            <article key={block.id}>
              <h3 style={{ fontSize: '20px', marginBottom: '16px' }}>{block.data.title}</h3>
              <p className="text-body" style={{ color: 'var(--color-muted)' }}>{block.data.description}</p>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
