import ButtonLink from '../components/ButtonLink.jsx';
import SectionHeader from '../components/SectionHeader.jsx';

export default function Contact() {
  return (
    <main className="inner-page contact-page">
      <SectionHeader
        eyebrow="Contact"
        title="Tell me what you are building"
        description="Use this page as the future home for a contact form, booking link, or direct project inquiry flow."
      />
      <div className="contact-panel">
        <div>
          <p>Email</p>
          <a href="mailto:hello@elsie.studio">hello@elsie.studio</a>
        </div>
        <ButtonLink href="mailto:hello@elsie.studio">Start the conversation</ButtonLink>
      </div>
    </main>
  );
}
