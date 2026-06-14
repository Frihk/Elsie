import ButtonLink from '../components/ButtonLink.jsx';
import SectionHeader from '../components/SectionHeader.jsx';
import { useContent } from '../context/ContentContext.jsx';

export default function Contact() {
  const { content } = useContent();
  const page = content?.pages?.contact;

  return (
    <main className="inner-page contact-page">
      <SectionHeader
        eyebrow={page?.eyebrow || 'Contact'}
        title={page?.title || 'Tell me what you are building'}
        description={page?.description || 'Use this page as the future home for a contact form, booking link, or direct project inquiry flow.'}
      />
      <div className="contact-panel">
        <div>
          <p>Email</p>
          <a href={`mailto:${page?.email || 'hello@elsie.studio'}`}>{page?.email || 'hello@elsie.studio'}</a>
        </div>
        <ButtonLink href={`mailto:${page?.email || 'hello@elsie.studio'}`}>Start the conversation</ButtonLink>
      </div>
    </main>
  );
}
