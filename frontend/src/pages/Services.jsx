import { useContent } from '../context/ContentContext.jsx';

export default function Services() {
  const { content, loading } = useContent();
  const page = content?.pages?.services;

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', background: 'var(--color-bg)', color: 'var(--color-secondary)' }}>
        <p>Loading...</p>
      </div>
    );
  }

  const howWeWorkSteps = page?.howWeWorkSteps || [];
  const coreServices = page?.coreServices || [];

  return (
    <div className="services-page-container">
      {/* Hero section */}
      <section className="services-hero-section">
        <div className="services-hero-content">
          <span className="services-eyebrow">{page?.eyebrow || 'CORE SERVICES'}</span>
          <h1 className="services-headline">
            {page?.title || 'Executive Support Designed for Productivity'}
          </h1>
          <p className="services-paragraph">
            {page?.description || 'We manage the operational complexity of your business and personal life behind the scenes, allowing you to focus on high-impact leadership.'}
          </p>
        </div>
      </section>

      {/* How we work section */}
      <section className="how-we-work-section">
        <h2 className="section-title-centered">
          {page?.howWeWorkHeading || 'How we work'}
        </h2>
        <div className="steps-stack">
          {howWeWorkSteps.map((step, index) => (
            <div className="step-card" key={index}>
              <h3 className="step-card-title">{step.title}</h3>
              <p className="step-card-desc">{step.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Core services section */}
      <section className="core-services-section">
        <h2 className="section-title-centered">
          {page?.coreServicesHeading || 'Core services'}
        </h2>
        <div className="services-grid-2col">
          {coreServices.map((service, index) => (
            <div className="service-grid-card" key={index}>
              <h3 className="service-card-title">
                <span className="service-number">{service.number}</span> — {service.name}
              </h3>
              <p className="service-card-desc">{service.description}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
