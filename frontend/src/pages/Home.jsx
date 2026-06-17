import ButtonLink from '../components/ButtonLink.jsx';
import ProjectCard from '../components/ProjectCard.jsx';
import SectionHeader from '../components/SectionHeader.jsx';
import { useContent } from '../context/ContentContext.jsx';

export default function Home() {
  const { content, loading } = useContent();
  const home = content && content.home ? content.home : null;
  const projects = content && content.projects ? content.projects : [];
  const services = content && content.services ? content.services : [];
  const stats = content && content.stats ? content.stats : [];
  return (
    <main>
      <section className="hero-section">
        <div className="hero-copy">
          <p className="eyebrow">{home ? home.eyebrow : 'Premium Digital Craft'}</p>
          <h1>{home ? home.title : 'Building elegant web experiences'}</h1>
          {home && home.paragraphs ? (
            home.paragraphs.map((para, index) => (
              <p key={index}>{para}</p>
            ))
          ) : (
            <p>I design and develop refined digital systems that help brands show up with confidence, clarity, and a memorable sense of style.</p>
          )}
          <div className="hero-actions">
            <ButtonLink href={home && home.ctaPrimary ? home.ctaPrimary.href : '/projects'}>
              {home && home.ctaPrimary ? home.ctaPrimary.label : 'View my work'}
            </ButtonLink>
            <ButtonLink href={home && home.ctaSecondary ? home.ctaSecondary.href : '/contact'} variant="ghost">
              {home && home.ctaSecondary ? home.ctaSecondary.label : 'Start a project'}
            </ButtonLink>
          </div>
        </div>
        <div className="hero-panel" aria-label="Elsie studio overview">
          {stats.map((item) => (
            <div key={item.label}>
              <strong>{item.value}</strong>
              <span>{item.label}</span>
            </div>
          ))}
        </div>
      </section>

      <section className="page-section">
        <SectionHeader
          eyebrow={home?.projectsEyebrow || 'Selected work'}
          title={home?.projectsTitle || 'Curated case studies'}
          description={home?.projectsDescription || 'A starting point for the project archive, ready for real case-study images, metrics, and writeups.'}
        />
        <div className="project-grid">
          {projects.map((project) => (
            <ProjectCard key={project.title} {...project} />
          ))}
        </div>
      </section>

      <section className="page-section split-section">
        <SectionHeader
          eyebrow={home?.servicesEyebrow || 'Services'}
          title={home?.servicesTitle || 'From first impression to launch'}
          description={home?.servicesDescription || 'A focused structure for brand sites, portfolios, product pages, and digital experiences that need to feel considered.'}
        />
        <div className="service-list">
          {services.slice(0, 4).map((service) => (
            <span key={service}>{service}</span>
          ))}
        </div>
      </section>
    </main>
  );
}
