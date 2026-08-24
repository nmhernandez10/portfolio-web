import React from 'react';

export function Textarea({ label, hint, error, id, rows = 5, style, ...rest }) {
  const [focus, setFocus] = React.useState(false);
  const fieldId = id || `ta-${(label || 'field').replace(/\s+/g, '-').toLowerCase()}`;
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)', ...style }}>
      {label ? (
        <label htmlFor={fieldId} style={{
          font: 'var(--type-label)', letterSpacing: 'var(--tracking-label)',
          textTransform: 'uppercase', color: 'var(--text-meta)',
        }}>{label}</label>
      ) : null}
      <textarea
        id={fieldId} rows={rows}
        onFocus={() => setFocus(true)}
        onBlur={() => setFocus(false)}
        style={{
          width: '100%', resize: 'vertical',
          background: 'var(--surface-card)', color: 'var(--ink-1)',
          font: 'var(--type-body)',
          border: `1px solid ${error ? 'var(--rust)' : focus ? 'var(--ink-3)' : 'var(--border-control)'}`,
          borderRadius: 'var(--radius-md)',
          padding: 'var(--space-3) var(--space-4)',
          outline: 'none',
          boxShadow: focus ? 'var(--shadow-focus)' : 'none',
          transition: 'var(--transition-control), box-shadow var(--dur-fast) var(--ease-standard)',
        }}
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
