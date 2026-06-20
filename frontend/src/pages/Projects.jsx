import { useState } from 'react';
import { useContent } from '../context/ContentContext.jsx';
import { content as fallbackContent, fallbackBlocks } from '../data/site.js';

function ProjectsSkeleton() {
  return (
    <main className="page-shell">
      <section className="editorial-statement skeleton-layout">
        <div className="skeleton skeleton-title" />
        <div className="skeleton skeleton-card" />
      </section>
    </main>
  );
}

export default function Projects() {
  const { blocks, content, loading } = useContent();
  const page = content?.projects || fallbackContent.projects;
  const testimonials = blocks?.projects?.testimonial || fallbackBlocks('projects', 'testimonial');
  
  const [quoteIndex, setQuoteIndex] = useState(0);
  const [fading, setFading] = useState(false);

  const words = page.projects_headline.split(' ');
  const p1 = words.slice(0, 1).join(' ');
  const p2 = words.slice(1, 3).join(' ');
  const p3 = words.slice(3).join(' ');

  const handleNextQuote = () => {
    setFading(true);
    setTimeout(() => {
      setQuoteIndex((prev) => (prev + 1) % testimonials.length);
      setFading(false);
    }, 300);
  };

  const handlePrevQuote = () => {
    setFading(true);
    setTimeout(() => {
      setQuoteIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
      setFading(false);
    }, 300);
  };

  if (loading) return <ProjectsSkeleton />;

  const currentTestimonial = testimonials[quoteIndex];

  return (
    <main className="page-shell">
      {/* Component 03: Editorial Statement */}
      <section className="editorial-statement">
        <div className="editorial-watermark">03</div>
        <div className="staircase-title">
          <span>{p1}</span>
          <span>{p2}</span>
          <span>{p3}</span>
        </div>
        <div className="rhythmic-grid">
          {page.projects_bullets.map((item, i) => (
            <div className="rhythmic-item" key={i}>
              <span>{item}</span>
              <span style={{ color: 'var(--color-accent)' }}>+</span>
            </div>
          ))}
        </div>
      </section>

      {/* Component 04: Sensory Interlude */}
      <section className="sensory-interlude">
        <p className="sensory-quote">
          “We do not just manage your operations.<br />We inhabit your world.”
        </p>
        <p className="sensory-attribution">— Managing Director, Private Equity Firm, New York</p>
      </section>

      {/* Component 08: Testimonials */}
      <section className="testimonials-section" id="testimonials">
        <div className="quote-reader">
          <button className="quote-nav" onClick={handlePrevQuote} aria-label="Previous quote">←</button>
          
          <div className={`quote-content ${fading ? 'fading' : ''}`}>
            {currentTestimonial && (
              <>
                <p className="quote-text">“{currentTestimonial.data.quote}”</p>
                <p className="quote-attr">{currentTestimonial.data.attribution}</p>
              </>
            )}
          </div>

          <button className="quote-nav" onClick={handleNextQuote} aria-label="Next quote">→</button>
        </div>

        <div className="sector-strip-container">
          <div className="sector-strip">
            {[...Array(4)].map((_, groupIndex) => (
              <div key={groupIndex} style={{ display: 'flex' }}>
                <span className="sector-item">Technology</span>
                <span className="sector-item">Private Equity</span>
                <span className="sector-item">Venture Capital</span>
                <span className="sector-item">Real Estate</span>
                <span className="sector-item">Philanthropy</span>
                <span className="sector-item">Entertainment</span>
                <span className="sector-item">Family Office</span>
                <span className="sector-item">Aviation</span>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
