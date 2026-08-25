import React from 'react';
import { Button } from '../../components/core/Button.jsx';
import { Tag } from '../../components/core/Tag.jsx';
import { Portrait } from '../../components/core/Portrait.jsx';
import { StatBlock } from '../../components/content/StatBlock.jsx';

export function Hero({ profile, stats, portraitSrc, onContact }) {
  return (
    <section id="top" style={{ padding: 'var(--space-9) var(--gutter) var(--space-8)' }}>
      <div style={{ maxWidth: 'var(--width-content)', margin: '0 auto' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0,1fr) auto', gap: 'var(--space-8)', alignItems: 'end' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-5)' }}>
            <div style={{ display: 'flex', gap: 'var(--space-2)', flexWrap: 'wrap' }}>
              <Tag tone="moss" dot>Open to senior / staff backend roles</Tag>
              <Tag tone="outline">{profile.location}</Tag>
            </div>
            <h1 style={{
              font: 'var(--weight-light) clamp(3rem, 7vw, var(--size-display-xl))/var(--lh-tight) var(--font-display)',
              letterSpacing: 'var(--tracking-display)', color: 'var(--ink-1)', margin: 0,
            }}>
              {profile.name}
            </h1>
            <p style={{
              font: 'var(--weight-medium) var(--size-h2)/1.3 var(--font-sans)',
              letterSpacing: 'var(--tracking-heading)', color: 'var(--ink-2)', maxWidth: '20ch',
            }}>{profile.role}</p>
            <p style={{ font: 'var(--type-lead)', color: 'var(--text-body)', maxWidth: 'var(--measure-prose)' }}>
              {profile.lead}
            </p>
            <div style={{ display: 'flex', gap: 'var(--space-3)', flexWrap: 'wrap', marginTop: 'var(--space-2)' }}>
              <Button variant="accent" size="lg" trailing="→" onClick={onContact}>Get in touch</Button>
              <Button variant="secondary" size="lg" href="../../assets/resume-2026-nicolas-hernandez.pdf" target="_blank">Résumé, PDF</Button>
            </div>
          </div>
          <Portrait src={portraitSrc} alt={profile.name} size={240} shape="arch" />
        </div>

        <div style={{
          display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 'var(--space-6)',
          marginTop: 'var(--space-9)', paddingTop: 'var(--space-6)',
          borderTop: '1px solid var(--border-hairline)',
        }}>
          {stats.map((s) => <StatBlock key={s.label} {...s} />)}
        </div>
      </div>
    </section>
  );
}
