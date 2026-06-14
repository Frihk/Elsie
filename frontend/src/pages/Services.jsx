import SectionHeader from '../components/SectionHeader.jsx';
import { services } from '../data/site.js';

export default function Services() {
  return (
    <main className="inner-page">
      <SectionHeader
        eyebrow="Capabilities"
        title="Services with a precise point of view"
        description="Each engagement is shaped around the same fundamentals: clear content, polished interaction, and a frontend that is easy to evolve."
      />
      <div className="service-list service-list--large">
        {services.map((service) => (
          <span key={service}>{service}</span>
        ))}
      </div>
    </main>
  );
}
