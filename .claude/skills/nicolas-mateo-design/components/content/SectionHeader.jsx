import React from 'react';

export function SectionHeader({ index, label, title, lead, align = 'left', style, ...rest }) {
  return (
    <header
      style={{
        display: 'flex', flexDirection: 'column', gap: 'var(--space-4)',
        alignItems: align === 'center' ? 'center' : 'flex-start',
        textAlign: align, marginBottom: 'var(--space-7)', ...style,
      }}
      {...rest}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
        {index ? (
          <span style={{
            font: 'var(--type-label)', letterSpacing: 'var(--tracking-label)',
            color: 'var(--clay)',
          }}>{index}</span>
        ) : null}
        {label ? (
          <span style={{
            font: 'var(--type-label)', letterSpacing: 'var(--tracking-label)',
            textTransform: 'uppercase', color: 'var(--text-meta)',
          }}>{label}</span>
        ) : null}
      </div>
      <h2 style={{
        font: 'var(--type-statement)', letterSpacing: 'var(--tracking-display)',
        color: 'var(--text-heading)', maxWidth: '18ch',
      }}>{title}</h2>
      {lead ? (
        <p style={{ font: 'var(--type-lead)', color: 'var(--text-body)', maxWidth: 'var(--measure-prose)' }}>
          {lead}
        </p>
      ) : null}
    </header>
  );
}
