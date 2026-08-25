import React from 'react';
import { Tag } from '../../components/core/Tag.jsx';
import { Button } from '../../components/core/Button.jsx';

export function ProjectDrawer({ project, onClose }) {
  const open = !!project;
  const [shown, setShown] = React.useState(null);
  React.useEffect(() => { if (project) setShown(project); }, [project]);
  const p = project || shown;

  return (
    <>
      <div
        onClick={onClose}
        style={{
          position: 'fixed', inset: 0, background: 'var(--scrim)',
          opacity: open ? 1 : 0, pointerEvents: open ? 'auto' : 'none',
          transition: 'opacity var(--dur-base) var(--ease-standard)', zIndex: 40,
        }}
      />
      <aside
        style={{
          position: 'fixed', top: 0, right: 0, bottom: 0, width: 'min(560px, 92vw)',
          background: 'var(--surface-card)', borderLeft: '1px solid var(--border-hairline)',
          boxShadow: 'var(--shadow-lg)', zIndex: 41,
          transform: open ? 'translateX(0)' : 'translateX(100%)',
          transition: 'transform var(--dur-slow) var(--ease-out)',
          display: 'flex', flexDirection: 'column',
        }}
      >
        {p ? (
          <>
            <header style={{
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              padding: 'var(--space-5) var(--space-6)', borderBottom: '1px solid var(--border-hairline)',
            }}>
              <span style={{ font: 'var(--type-label)', letterSpacing: 'var(--tracking-label)', color: 'var(--clay)' }}>{p.index}</span>
              <Button variant="ghost" size="sm" onClick={onClose}>Close ✕</Button>
            </header>
            <div style={{ padding: 'var(--space-6)', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 'var(--space-5)' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
                <span style={{ font: 'var(--type-meta)', color: 'var(--text-meta)' }}>{p.kicker}</span>
                <h2 style={{ font: 'var(--type-statement)', letterSpacing: 'var(--tracking-display)' }}>{p.title}</h2>
              </div>
              <p style={{ font: 'var(--type-lead)', color: 'var(--text-body)' }}>{p.description}</p>
              <ul style={{ margin: 0, padding: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
                {(p.detail || []).map((d, i) => (
                  <li key={i} style={{ display: 'grid', gridTemplateColumns: '28px 1fr', gap: 'var(--space-3)' }}>
                    <span style={{ font: 'var(--type-label)', color: 'var(--ink-4)', paddingTop: 4 }}>
                      {String(i + 1).padStart(2, '0')}
                    </span>
                    <span style={{ font: 'var(--type-body)', color: 'var(--text-body)' }}>{d}</span>
                  </li>
                ))}
              </ul>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--space-2)', paddingTop: 'var(--space-2)', borderTop: '1px solid var(--border-hairline)' }}>
                {(p.tags || []).map((t) => <Tag key={t}>{t}</Tag>)}
              </div>
              <span style={{ font: 'var(--type-meta)', color: 'var(--ink-4)' }}>{p.meta}</span>
            </div>
          </>
        ) : null}
      </aside>
    </>
  );
}
