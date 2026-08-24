import React from 'react';

export function TextLink({ children, href, arrow = false, tone = 'ink', external = false, style, ...rest }) {
  const [hover, setHover] = React.useState(false);
  const base = tone === 'accent' ? 'var(--clay)' : 'var(--ink-1)';
  return (
    <a
      href={href}
      target={external ? '_blank' : undefined}
      rel={external ? 'noreferrer' : undefined}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        display: 'inline-flex', alignItems: 'center', gap: 'var(--space-2)',
        color: hover ? 'var(--clay)' : base,
        font: 'inherit', textDecoration: 'none',
        backgroundImage: 'linear-gradient(currentColor, currentColor)',
        backgroundSize: hover ? '100% 1px' : '0% 1px',
        backgroundPosition: '0 100%', backgroundRepeat: 'no-repeat',
        paddingBottom: 2,
        transition: 'background-size var(--dur-base) var(--ease-out), color var(--dur-fast) var(--ease-standard)',
        ...style,
      }}
      {...rest}
    >
      {children}
      {arrow ? (
        <span style={{
          font: 'var(--type-label)',
          transform: hover ? 'translateX(3px)' : 'none',
          transition: 'transform var(--dur-base) var(--ease-out)',
        }}>→</span>
      ) : null}
    </a>
  );
}
