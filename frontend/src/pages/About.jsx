import SectionHeader from '../components/SectionHeader.jsx';

export default function About() {
  return (
    <main className="inner-page about-page">
      <SectionHeader
        eyebrow="About Elsie"
        title="A studio-minded frontend for refined digital work"
        description="This structure gives the brand a focused foundation: reusable sections, content data, and page-level modules that can grow into a fuller portfolio or client site."
      />
      <div className="text-columns">
        <p>
          Elsie pairs quiet visual polish with practical engineering decisions, so the
          site can look premium without becoming difficult to maintain.
        </p>
        <p>
          The frontend is now organized around pages, shared components, and central
          content collections. That makes future edits smaller and keeps visual rhythm
          consistent across the experience.
        </p>
      </div>
    </main>
  );
}
