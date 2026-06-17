import { useContent } from '../context/ContentContext.jsx';

export default function About() {
  const { content, loading } = useContent();
  const page = content?.pages?.about;

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', background: 'var(--color-bg)', color: 'var(--color-secondary)' }}>
        <p>Loading...</p>
      </div>
    );
  }

  const paragraphs = page?.paragraphs || [];
  const whyChooseReasons = page?.whyChooseReasons || [];

  return (
    <div className="about-page-container">
      {/* Hero section */}
      <section className="about-hero-section">
        <div className="about-hero-grid">
          {/* Left Column: Portrait photo and caption */}
          <div className="about-hero-left">
            <div className="about-photo-card">
              <img src="/about_portrait.jpg" alt="CEO & Founder" className="about-portrait-photo" />
              <div className="about-photo-caption">
                {page?.caption || 'CEO AND FOUNDER OF EIRA EXECUTIVE OPERATIONS'}
              </div>
            </div>
          </div>

          {/* Right Column: Title and Bio */}
          <div className="about-hero-right">
            <span className="about-eyebrow">{page?.eyebrow || 'ABOUT'}</span>
            <div className="about-bio-content">
              {paragraphs.map((p, index) => (
                <p key={index} className="about-bio-paragraph">{p}</p>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Efficiency with Discretion section */}
      <section className="about-discretion-section">
        <h2 className="discretion-subheading">
          {page?.discretionSubheading || 'Efficiency with discretion'}
        </h2>
        <p className="discretion-paragraph">
          {page?.discretionParagraph || 'We operate behind the scenes, ensuring your processes run smoothly while maintaining absolute confidentiality at all times.'}
        </p>
      </section>

      {/* Why Choose Eira section */}
      <section className="about-whychoose-section">
        <h2 className="whychoose-heading">
          {page?.whyChooseHeading || 'Why Choose Eira'}
        </h2>
        <div className="whychoose-list">
          {whyChooseReasons.map((reason, index) => (
            <div className="whychoose-item" key={index}>
              <p className="whychoose-text">
                <strong className="whychoose-bold-label">{reason.label}.</strong> {reason.text}
              </p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
