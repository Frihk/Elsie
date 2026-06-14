import ProjectCard from '../components/ProjectCard.jsx';
import SectionHeader from '../components/SectionHeader.jsx';
import { projects } from '../data/site.js';

export default function Projects() {
  return (
    <main className="inner-page">
      <SectionHeader
        eyebrow="Selected work"
        title="Curated case studies"
        description="A structured project archive for polished launches, product stories, and brand-led web experiences."
      />
      <div className="project-grid">
        {projects.map((project) => (
          <ProjectCard key={project.title} {...project} />
        ))}
      </div>
    </main>
  );
}
