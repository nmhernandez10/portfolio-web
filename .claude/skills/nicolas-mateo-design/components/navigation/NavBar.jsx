import React from 'react';

export function NavBar({
  brand = 'Nicolás Hernández', items = [], active, onNavigate, action, style, ...rest
}) {
  const [scrolled, setScrolled] = React.useState(false);
  React.useEffect(() => {
    const el = document.scrollingElement || document.documentElement;
    const onScroll = () => setScrolled(el.scrollTop > 8);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <nav
      style={{
        position: 'sticky', top: 0, zIndex: 20,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        gap: 'var(--space-6)',
        padding: 'var(--space-4) var(--gutter)',
        background: 'var(--nav-bg)',
        backdropFilter: 'saturate(1.4) blur(12px)',
        WebkitBackdropFilter: 'saturate(1.4) blur(12px)',
        borderBottom: `1px solid ${scrolled ? 'var(--border-hairline)' : 'transparent'}`,
        transition: 'border-color var(--dur-base) var(--ease-standard)',
        ...style,
      }}
      {...rest}
    >
      <a
        href="#top"
        onClick={(e) => { if (onNavigate) { e.preventDefault(); onNavigate('top'); } }}
        style={{
          font: 'var(--weight-medium) var(--size-body-s)/1 var(--font-sans)',
          letterSpacing: '-0.01em', color: 'var(--ink-1)', textDecoration: 'none',
        }}
      >{brand}</a>

      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-5)' }}>
        {items.map((it) => {
          const id = it.id || it.label;
          const on = active === id;
          return (
            <a
              key={id}
              href={it.href || `#${id}`}
              onClick={(e) => { if (onNavigate) { e.preventDefault(); onNavigate(id); } }}
              style={{
                font: 'var(--type-label)', letterSpacing: 'var(--tracking-label)',
                textTransform: 'uppercase',
                color: on ? 'var(--ink-1)' : 'var(--text-meta)',
                textDecoration: 'none', paddingBottom: 3,
                borderBottom: `1px solid ${on ? 'var(--clay)' : 'transparent'}`,
                transition: 'var(--transition-control)',
              }}
            >{it.label}</a>
          );
        })}
        {action}
      </div>
    </nav>
  );
}
