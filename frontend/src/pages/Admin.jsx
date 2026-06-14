import SectionHeader from '../components/SectionHeader.jsx';

export default function Admin() {
  return (
    <main className="inner-page">
      <SectionHeader
        eyebrow="Admin"
        title="Content workspace"
        description="A placeholder admin surface for future project, service, and contact-message management."
      />
      <div className="admin-grid">
        {['Projects', 'Services', 'Messages'].map((item) => (
          <article key={item}>
            <h3>{item}</h3>
            <p>Ready for backend integration.</p>
          </article>
        ))}
      </div>
    </main>
  );
}
