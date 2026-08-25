import React from 'react';

const SIZES = {
  sm: { font: 'var(--size-meta)', pad: '0 var(--space-3)', h: 30, gap: 'var(--space-2)' },
  md: { font: 'var(--size-body-s)', pad: '0 var(--space-4)', h: 38, gap: 'var(--space-2)' },
  lg: { font: 'var(--size-body)', pad: '0 var(--space-5)', h: 46, gap: 'var(--space-3)' },
};

const VARIANTS = {
  primary: {
    background: 'var(--ink-1)', color: 'var(--text-inverse)',
    border: '1px solid var(--ink-1)',
    hover: { background: 'oklch(0.16 0.010 70)', borderColor: 'oklch(0.16 0.010 70)' },
  },
  accent: {
    background: 'var(--clay)', color: 'var(--paper)',
    border: '1px solid var(--clay)',
    hover: { background: 'var(--clay-strong)', borderColor: 'var(--clay-strong)' },
  },
  secondary: {
    background: 'transparent', color: 'var(--ink-1)',
    border: '1px solid var(--border-control)',
    hover: { background: 'var(--paper-sunk)', borderColor: 'var(--ink-3)' },
  },
  ghost: {
    background: 'transparent', color: 'var(--ink-2)',
    border: '1px solid transparent',
    hover: { background: 'var(--paper-sunk)', color: 'var(--ink-1)' },
  },
};

export function Button({
  children, variant = 'primary', size = 'md', href, trailing, leading,
  disabled = false, full = false, type = 'button', onClick, style, ...rest
}) {
  const [hover, setHover] = React.useState(false);
  const s = SIZES[size] || SIZES.md;
  const v = VARIANTS[variant] || VARIANTS.primary;

  const base = {
    display: full ? 'flex' : 'inline-flex',
    width: full ? '100%' : undefined,
    alignItems: 'center', justifyContent: 'center', gap: s.gap,
    height: s.h, padding: s.pad,
    font: `var(--weight-medium) ${s.font}/1 var(--font-sans)`,
    letterSpacing: '-0.005em',
    borderRadius: 'var(--radius-pill)',
    cursor: disabled ? 'not-allowed' : 'pointer',
    opacity: disabled ? 0.4 : 1,
    textDecoration: 'none',
    whiteSpace: 'nowrap',
    transition: 'var(--transition-control), transform var(--dur-instant) var(--ease-standard)',
    ...v,
    ...(hover && !disabled ? v.hover : null),
    ...style,
  };
  delete base.hover;

  const content = (
    <>
      {leading ? <span style={{ display: 'flex', opacity: 0.85 }}>{leading}</span> : null}
      {children}
      {trailing ? <span style={{ display: 'flex', opacity: 0.85 }}>{trailing}</span> : null}
    </>
  );

  const handlers = {
    onMouseEnter: () => setHover(true),
    onMouseLeave: () => setHover(false),
    onClick: disabled ? undefined : onClick,
  };

  if (href && !disabled) {
    return <a href={href} style={base} {...handlers} {...rest}>{content}</a>;
  }
  return <button type={type} disabled={disabled} style={base} {...handlers} {...rest}>{content}</button>;
}
