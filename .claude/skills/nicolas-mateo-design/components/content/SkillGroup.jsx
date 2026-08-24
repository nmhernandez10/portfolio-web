import React from 'react';

export function SkillGroup({ title, items = [], style, ...rest }) {
  return (
    <div
      style={{
        display: 'grid', gridTemplateColumns: 'minmax(130px, 170px) 1fr',
        gap: 'var(--space-5)', padding: 'var(--space-5) 0',
        borderTop: '1px solid var(--border-hairline)', alignItems: 'start', ...style,
      }}
      {...rest}
    >
      <h4 style={{
        font: 'var(--type-label)', letterSpacing: 'var(--tracking-label)',
        textTransform: 'uppercase', color: 'var(--text-meta)', paddingTop: 4,
      }}>{title}</h4>
      <p style={{
        font: 'var(--type-body)', color: 'var(--ink-1)',
        display: 'flex', flexWrap: 'wrap', gap: '0 var(--space-3)',
      }}>
        {items.map((it, i) => (
          <span key={it} style={{ display: 'inline-flex', gap: 'var(--space-3)' }}>
            {it}
            {i < items.length - 1 ? <span style={{ color: 'var(--ink-4)' }}>/</span> : null}
          </span>
        ))}
      </p>
    </div>
  );
}
