import React from 'react';

export function Portrait({
  src, alt = 'Portrait', size = 220, shape = 'arch', grayscale = true, style, ...rest
}) {
  const [hover, setHover] = React.useState(false);
  const radii = {
    arch: `${size / 2}px ${size / 2}px var(--radius-lg) var(--radius-lg)`,
    round: '50%',
    soft: 'var(--radius-lg)',
    square: 'var(--radius-none)',
  };
  return (
    <div
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        width: size, height: shape === 'round' ? size : Math.round(size * 1.22),
        borderRadius: radii[shape] || radii.arch,
        overflow: 'hidden', background: 'var(--paper-sunk)',
        border: '1px solid var(--border-hairline)',
        flex: '0 0 auto', ...style,
      }}
      {...rest}
    >
      <img
        src={src} alt={alt}
        style={{
          width: '100%', height: '100%', objectFit: 'cover', display: 'block',
          filter: grayscale && !hover ? 'grayscale(1) contrast(1.02)' : 'grayscale(0)',
          transform: hover ? 'scale(1.03)' : 'scale(1)',
          transition: 'filter var(--dur-slow) var(--ease-out), transform var(--dur-slow) var(--ease-out)',
        }}
      />
    </div>
  );
}
