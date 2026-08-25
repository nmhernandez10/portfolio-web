import React from 'react';

export function StatBlock({ value, label, note, align = 'left', style, ...rest }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)', textAlign: align, ...style }} {...rest}>
      <span style={{
        font: 'var(--weight-light) var(--size-display-m)/1 var(--font-display)',
        letterSpacing: 'var(--tracking-display)', color: 'var(--text-heading)',
      }}>{value}</span>
      <span style={{
        font: 'var(--type-label)', letterSpacing: 'var(--tracking-label)',
        textTransform: 'uppercase', color: 'var(--text-meta)',
      }}>{label}</span>
      {note ? <span style={{ font: 'var(--type-meta)', color: 'var(--ink-4)' }}>{note}</span> : null}
    </div>
  );
}
