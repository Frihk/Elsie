import ProjectCard from '../components/ProjectCard.jsx';
import SectionHeader from '../components/SectionHeader.jsx';
import { useContent } from '../context/ContentContext.jsx';

export default function Projects() {
  const { content } = useContent();
  const page = content?.pages?.projects;
  const projects = content?.projects || [];
  return (
    <main className="inner-page">
      <SectionHeader
        eyebrow={page?.eyebrow || 'Selected work'}
        title={page?.title || 'Curated case studies'}
        description={page?.description || 'A structured project archive for polished launches, product stories, and brand-led web experiences.'}
      />
      <div className="project-grid">
        {projects.map((project) => (
          <ProjectCard key={project.title} {...project} />
        ))}
      </div>
    </main>
  );
}
