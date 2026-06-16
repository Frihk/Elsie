export default function ProjectCard({ category, description, title }) {
  return (
    <article className="project-card">
      <div className="project-card__media" aria-hidden="true" />
      <p>{category}</p>
      <h3>{title}</h3>
      <span>{description}</span>
    </article>
  );
}
