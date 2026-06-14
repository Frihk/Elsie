import ButtonLink from '../components/ButtonLink.jsx';
import ProjectCard from '../components/ProjectCard.jsx';
import SectionHeader from '../components/SectionHeader.jsx';
import { projects, services, stats } from '../data/site.js';

export default function Home() {
  return (
    <main>
      <section className="hero-section">
        <div className="hero-copy">
          <p className="eyebrow">Premium Digital Craft</p>
          <h1>Building elegant web experiences</h1>
          <p>
            I design and develop refined digital systems that help brands show up
            with confidence, clarity, and a memorable sense of style.
          </p>
          <div className="hero-actions">
            <ButtonLink href="/projects">View my work</ButtonLink>
            <ButtonLink href="/contact" variant="ghost">
              Start a project
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
          eyebrow="Selected work"
          title="Curated case studies"
          description="A starting point for the project archive, ready for real case-study images, metrics, and writeups."
        />
        <div className="project-grid">
          {projects.map((project) => (
            <ProjectCard key={project.title} {...project} />
          ))}
        </div>
      </section>

      <section className="page-section split-section">
        <SectionHeader
          eyebrow="Services"
          title="From first impression to launch"
          description="A focused structure for brand sites, portfolios, product pages, and digital experiences that need to feel considered."
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
