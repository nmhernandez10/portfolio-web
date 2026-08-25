import React from 'react';

export function Divider({ label, tone = 'hairline', space = 'var(--space-6)', style, ...rest }) {
  const color = tone === 'strong' ? 'var(--line-2)' : 'var(--line-1)';
  if (!label) {
    return <hr style={{ border: 0, borderTop: `1px solid ${color}`, margin: `${space} 0`, ...style }} {...rest} />;
  }
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-4)', margin: `${space} 0`, ...style }} {...rest}>
      <span style={{
        font: 'var(--type-label)', letterSpacing: 'var(--tracking-label)',
        textTransform: 'uppercase', color: 'var(--text-meta)', whiteSpace: 'nowrap',
      }}>{label}</span>
      <span style={{ flex: 1, height: 1, background: color }} />
    </div>
  );
}
