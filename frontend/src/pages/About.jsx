import SectionHeader from '../components/SectionHeader.jsx';
import { useContent } from '../context/ContentContext.jsx';

export default function About() {
  const { content } = useContent();
  const page = content?.pages?.about;

  return (
    <main className="inner-page about-page">
      <SectionHeader
        eyebrow={page?.eyebrow || 'About'}
        title={page?.title || 'A studio-minded frontend for refined digital work'}
        description={page?.description || 'This structure gives the brand a focused foundation: reusable sections, content data, and page-level modules that can grow into a fuller portfolio or client site.'}
      />
      <div className="text-columns">
        {(page?.paragraphs || []).map((p, i) => (
          <p key={i}>{p}</p>
        ))}
      </div>
    </main>
  );
}
