import React from 'react';

const field = (focus) => ({
  width: '100%',
  background: 'var(--surface-card)',
  color: 'var(--ink-1)',
  font: 'var(--type-body)',
  border: `1px solid ${focus ? 'var(--ink-3)' : 'var(--border-control)'}`,
  borderRadius: 'var(--radius-md)',
  padding: 'var(--space-3) var(--space-4)',
  outline: 'none',
  boxShadow: focus ? 'var(--shadow-focus)' : 'none',
  transition: 'var(--transition-control), box-shadow var(--dur-fast) var(--ease-standard)',
});

export function Input({ label, hint, error, id, style, ...rest }) {
  const [focus, setFocus] = React.useState(false);
  const inputId = id || `in-${(label || 'field').replace(/\s+/g, '-').toLowerCase()}`;
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)', ...style }}>
      {label ? (
        <label htmlFor={inputId} style={{
          font: 'var(--type-label)', letterSpacing: 'var(--tracking-label)',
          textTransform: 'uppercase', color: 'var(--text-meta)',
        }}>{label}</label>
      ) : null}
      <input
        id={inputId}
        onFocus={() => setFocus(true)}
        onBlur={() => setFocus(false)}
        style={{ ...field(focus), borderColor: error ? 'var(--rust)' : field(focus).border.split(' ')[2] }}
        {...rest}
      />
      {error || hint ? (
        <span style={{ font: 'var(--type-meta)', color: error ? 'var(--rust)' : 'var(--text-meta)' }}>
          {error || hint}
        </span>
      ) : null}
    </div>
  );
}
