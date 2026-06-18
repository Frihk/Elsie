import { useContent } from '../context/ContentContext.jsx';

export default function Projects() {
  const { content, loading } = useContent();
  const page = content?.pages?.projects;

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', background: 'var(--color-bg)', color: 'var(--color-secondary)' }}>
        <p>Loading...</p>
      </div>
    );
  }

  const services = page?.services || [
    "Strategic Operations",
    "Calendar Precision",
    "International Logistics",
    "Board Relations"
  ];

  const testimonials = page?.testimonials || [];

  return (
    <div className="projects-container">
      {/* Hero section */}
      <section className="projects-hero-split">
        <div className="projects-hero-left">
          <div className="projects-hero-content">
            <span className="projects-eyebrow">{page?.eyebrow || 'SELECTED WORK'}</span>
            <div className="projects-tagline-rule" />
            
            <h1 className="projects-headline">
              {page?.title || 'RESULTS DELIVERED TO CLIENTS'}
            </h1>
            
            <ul className="projects-services-list">
              {services.map((service, index) => (
                <li key={index}>
                  {index > 0 && <span className="list-dot">•</span>}
                  <span className="service-text">{service}</span>
                </li>
              ))}
            </ul>
            
            <div className="projects-cta-wrapper">
              <a href="#testimonials" className="projects-cta-btn">
                {page?.ctaLabel || 'Explore Results →'}
              </a>
            </div>
          </div>
        </div>
        
        <div className="projects-hero-right">
          <div className="projects-photo-wrapper">
            <img src="/projects_portrait.jpg" alt="Results Portrait" className="projects-portrait-photo" />
          </div>
        </div>
      </section>

      {/* Testimonials section */}
      <section id="testimonials" className="testimonials-section">
        <div className="testimonials-header">
          <h2 className="testimonials-title">
            {page?.testimonialsHeading || 'Testimonials from clients'}
          </h2>
          <p className="testimonials-subtitle">
            {page?.testimonialsSubheading1 || 'We build long-term partnerships based on trust,'}
          </p>
          <p className="testimonials-subtitle">
            {page?.testimonialsSubheading2 || 'absolute discretion, and flawless execution.'}
          </p>
        </div>

        <div className="testimonials-grid">
          {testimonials.map((t, index) => (
            <div className="testimonial-card" key={index}>
              <h3 className="testimonial-client-type">{t.clientType}</h3>
              <p className="testimonial-quote">"{t.quote}"</p>
              <span className="testimonial-attribution">{t.attribution}</span>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
