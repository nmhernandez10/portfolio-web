import React from 'react';

export function ProjectCard({
  index, title, kicker, description, tags = [], meta, href, style, ...rest
}) {
  const [hover, setHover] = React.useState(false);
  return (
    <a
      href={href || '#'}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        display: 'flex', flexDirection: 'column', gap: 'var(--space-4)',
        padding: 'var(--space-6)',
        background: hover ? 'var(--surface-card)' : 'transparent',
        border: `1px solid ${hover ? 'var(--line-2)' : 'var(--border-hairline)'}`,
        borderRadius: 'var(--radius-lg)',
        boxShadow: hover ? 'var(--shadow-md)' : 'none',
        transform: hover ? 'translateY(-2px)' : 'none',
        transition: 'transform var(--dur-base) var(--ease-out), box-shadow var(--dur-base) var(--ease-out), background-color var(--dur-base) var(--ease-standard), border-color var(--dur-base) var(--ease-standard)',
        textDecoration: 'none', height: '100%',
        ...style,
      }}
      {...rest}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: 'var(--space-4)' }}>
        <span style={{ font: 'var(--type-label)', letterSpacing: 'var(--tracking-label)', color: 'var(--text-meta)' }}>
          {index}
        </span>
        <span style={{
          font: 'var(--type-label)', color: hover ? 'var(--clay)' : 'var(--ink-4)',
          transform: hover ? 'translateX(3px)' : 'none',
          transition: 'transform var(--dur-base) var(--ease-out), color var(--dur-fast) var(--ease-standard)',
        }}>→</span>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
        {kicker ? (
          <span style={{ font: 'var(--type-meta)', color: 'var(--text-meta)' }}>{kicker}</span>
        ) : null}
        <h3 style={{ font: 'var(--type-h2)', letterSpacing: 'var(--tracking-heading)' }}>{title}</h3>
      </div>

      {description ? (
        <p style={{ font: 'var(--type-small)', color: 'var(--text-body)', flex: 1 }}>{description}</p>
      ) : null}

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--space-2)', alignItems: 'center' }}>
        {tags.map((t) => (
          <span key={t} style={{
            font: 'var(--type-label)', color: 'var(--text-meta)',
            border: '1px solid var(--border-hairline)', borderRadius: 'var(--radius-pill)',
            padding: '5px var(--space-3)', background: 'var(--paper)',
          }}>{t}</span>
        ))}
      </div>

      {meta ? (
        <span style={{ font: 'var(--type-meta)', color: 'var(--ink-4)' }}>{meta}</span>
      ) : null}
    </a>
  );
}
