import React from 'react';

export function Card({
  children, as: Tag = 'div', tone = 'raised', interactive = false,
  pad = 'var(--space-6)', href, style, ...rest
}) {
  const [hover, setHover] = React.useState(false);
  const tones = {
    raised: { background: 'var(--surface-card)', border: '1px solid var(--border-hairline)' },
    flat:   { background: 'transparent', border: '1px solid var(--border-hairline)' },
    sunk:   { background: 'var(--surface-sunk)', border: '1px solid transparent' },
    inverse:{ background: 'var(--surface-inverse)', border: '1px solid var(--line-inverse)', color: 'var(--text-inverse)' },
  };
  const El = href ? 'a' : Tag;
  return (
    <El
      href={href}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        display: 'block', padding: pad,
        borderRadius: 'var(--radius-lg)',
        ...tones[tone],
        boxShadow: interactive && hover ? 'var(--shadow-md)' : 'var(--shadow-none)',
        borderColor: interactive && hover ? 'var(--line-2)' : (tones[tone].border || '').split(' ')[2],
        transform: interactive && hover ? 'translateY(-2px)' : 'translateY(0)',
        transition: 'transform var(--dur-base) var(--ease-out), box-shadow var(--dur-base) var(--ease-out), border-color var(--dur-base) var(--ease-standard)',
        textDecoration: 'none',
        ...style,
      }}
      {...rest}
    >
      {children}
    </El>
  );
}
