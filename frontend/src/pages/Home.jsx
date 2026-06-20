import { useContent } from '../context/ContentContext.jsx';
import { content as fallbackContent } from '../data/site.js';
import './Home.css';

function HomeSkeleton() {
  return (
    <section className="hero">
      <div className="hero-left">
        <div className="skeleton skeleton-title" />
      </div>
      <div className="hero-right"></div>
    </section>
  );
}

export default function Home() {
  const { content, loading } = useContent();
  const home = content?.home || fallbackContent.home;

  if (loading) return <HomeSkeleton />;

  return (
    <section className="hero">
      {/* LEFT */}
      <div className="hero-left">
        <div className="eyebrow">
          <div className="eyebrow-line"></div>
          {home.hero_tagline}
        </div>

        <h1>{home.hero_headline}</h1>

        <p className="headline-accent">For HNW Founders &amp; C-Suite Executives who've outgrown traditional assistance.</p>

        <p className="body-copy">
          {home.hero_body}
        </p>

        {/* MICRO PROOF */}
        <div className="micro-proof">
          <div className="proof-stat">
            <div className="proof-num">40+</div>
            <div className="proof-label">CLIENTS SERVED</div>
          </div>
          <div className="proof-sep"></div>
          <div className="proof-stat">
            <div className="proof-num">8+</div>
            <div className="proof-label">COUNTRIES</div>
          </div>
          <div className="proof-sep"></div>
          <div className="proof-stat">
            <div className="proof-num">100%</div>
            <div className="proof-label">DISCRETION</div>
          </div>
        </div>

        {/* PULL QUOTE */}
        <div className="pull-quote">
          <p>"She doesn't wait to be told what to do — she sees the problem before I do and handles it. That's rare."</p>
          <cite>— CEO, Series B Startup · London</cite>
        </div>

        {/* CTA */}
        <div className="cta-group">
          <a href={home.hero_cta_link} className="cta-btn" style={{ textDecoration: 'none' }}>
            {home.hero_cta_label.toUpperCase()} &nbsp;→
          </a>
          <a href="#" className="cta-secondary-link">See how I work</a>
        </div>

        {/* TRUST STRIP */}
        <div className="trust-strip">
          <div className="trust-label">TRUSTED BY LEADERS IN</div>
          <div className="trust-items">
            <span className="trust-item">FAMILY OFFICES</span>
            <span className="trust-item">PE-BACKED FOUNDERS</span>
            <span className="trust-item">SERIES B+ STARTUPS</span>
            <span className="trust-item">PRIVATE EQUITY</span>
          </div>
        </div>
      </div>

      {/* RIGHT */}
      <div className="hero-right">
        {/* Availability badge */}
        <div className="avail-badge">
          <div className="avail-dot"></div>
          ACCEPTING 2 NEW CLIENTS
        </div>

        {/* Photo area */}
        <div className="photo-area">
          <div className="photo-fill">
            {home.hero_image ? (
              <img src={home.hero_image} alt="Executive Portrait" className="ceo-photo" />
            ) : (
              <svg className="silhouette" width="220" height="420" viewBox="0 0 220 420" fill="none">
                <ellipse cx="110" cy="80" rx="52" ry="58" fill="#8C6455"/>
                <rect x="50" y="148" width="120" height="170" rx="12" fill="#8C6455"/>
                <rect x="50" y="325" width="44" height="90" rx="8" fill="#8C6455"/>
                <rect x="126" y="325" width="44" height="90" rx="8" fill="#8C6455"/>
              </svg>
            )}
          </div>

          <div className="photo-caption">
            <div className="photo-caption-name">{home.brand_name}</div>
            <div className="photo-caption-title">{home.brand_subtitle}</div>
          </div>
        </div>

        {/* Floating testimonial */}
        <div className="floating-testi">
          <div className="floating-stars">★★★★★</div>
          <p className="floating-text">"Operates like a COO. Completely changed how I run my week."</p>
          <div className="floating-author">FOUNDER, FAMILY OFFICE · DUBAI</div>
        </div>
      </div>
    </section>
  );
}
