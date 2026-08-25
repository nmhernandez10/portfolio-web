import React from 'react';
import { SectionHeader } from '../../components/content/SectionHeader.jsx';
import { ExperienceItem } from '../../components/content/ExperienceItem.jsx';

export function Experience({ roles }) {
  return (
    <section id="experience" style={{ padding: 'var(--space-9) var(--gutter)', background: 'var(--paper-sunk)' }}>
      <div style={{ maxWidth: 'var(--width-content)', margin: '0 auto' }}>
        <SectionHeader index="02" label="Experience" title="Six years of production backends." />
        <div>
          {roles.map((r) => <ExperienceItem key={r.role + r.period} {...r} />)}
        </div>
      </div>
    </section>
  );
}
