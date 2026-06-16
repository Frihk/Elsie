import SectionHeader from '../components/SectionHeader.jsx';
import { useContent } from '../context/ContentContext.jsx';

export default function Services() {
  const { content } = useContent();
  const page = content?.pages?.services;
  const services = content?.services || [];
  return (
    <main className="inner-page">
      <SectionHeader
        eyebrow={page?.eyebrow || 'Capabilities'}
        title={page?.title || 'Services with a precise point of view'}
        description={page?.description || 'Each engagement is shaped around the same fundamentals: clear content, polished interaction, and a frontend that is easy to evolve.'}
      />
      <div className="service-list service-list--large">
        {services.map((service) => (
          <span key={service}>{service}</span>
        ))}
      </div>
    </main>
  );
}
