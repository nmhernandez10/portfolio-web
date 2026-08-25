import React from 'react';

export function ExperienceItem({
  role, company, location, period, summary, points = [], tags = [],
  current = false, style, ...rest
}) {
  return (
    <article
      style={{
        display: 'grid', gridTemplateColumns: 'minmax(150px, 200px) 1fr',
        gap: 'var(--space-6)', padding: 'var(--space-6) 0',
        borderTop: '1px solid var(--border-hairline)', ...style,
      }}
      {...rest}
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
        <span style={{
          font: 'var(--type-label)', letterSpacing: 'var(--tracking-label)',
          color: current ? 'var(--clay)' : 'var(--text-meta)',
        }}>{period}</span>
        {location ? (
          <span style={{ font: 'var(--type-meta)', color: 'var(--text-meta)' }}>{location}</span>
        ) : null}
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-1)' }}>
          <h3 style={{ font: 'var(--type-h2)', letterSpacing: 'var(--tracking-heading)' }}>{role}</h3>
          <span style={{ font: 'var(--type-small)', color: 'var(--text-meta)' }}>{company}</span>
        </div>

        {summary ? (
          <p style={{ font: 'var(--type-body)', color: 'var(--text-body)', maxWidth: 'var(--measure-prose)' }}>
            {summary}
          </p>
        ) : null}

        {points.length ? (
          <ul style={{
            margin: 0, padding: 0, listStyle: 'none',
            display: 'flex', flexDirection: 'column', gap: 'var(--space-2)',
            maxWidth: 'var(--measure-prose)',
          }}>
            {points.map((p, i) => (
              <li key={i} style={{
                display: 'grid', gridTemplateColumns: '14px 1fr', gap: 'var(--space-3)',
                font: 'var(--type-small)', color: 'var(--text-body)',
              }}>
                <span style={{ color: 'var(--ink-4)', font: 'var(--type-code)' }}>—</span>
                <span>{p}</span>
              </li>
            ))}
          </ul>
        ) : null}

        {tags.length ? (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--space-2)', marginTop: 'var(--space-2)' }}>
            {tags.map((t) => (
              <span key={t} style={{
                font: 'var(--type-label)', color: 'var(--text-meta)',
                border: '1px solid var(--border-hairline)', borderRadius: 'var(--radius-pill)',
                padding: '5px var(--space-3)',
              }}>{t}</span>
            ))}
          </div>
        ) : null}
      </div>
    </article>
  );
}
