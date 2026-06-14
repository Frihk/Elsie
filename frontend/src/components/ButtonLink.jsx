export default function ButtonLink({ children, href, variant = 'primary' }) {
  return (
    <a className={`button-link ${variant === 'ghost' ? 'is-ghost' : ''}`} href={href}>
      {children}
      <span aria-hidden="true">-&gt;</span>
    </a>
  );
}
