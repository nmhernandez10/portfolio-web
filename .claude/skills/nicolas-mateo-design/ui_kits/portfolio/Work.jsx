import React from 'react';
import { SectionHeader } from '../../components/content/SectionHeader.jsx';
import { ProjectCard } from '../../components/content/ProjectCard.jsx';

export function Work({ projects, onOpen }) {
  return (
    <section id="work" style={{ padding: 'var(--space-9) var(--gutter)' }}>
      <div style={{ maxWidth: 'var(--width-content)', margin: '0 auto' }}>
        <SectionHeader
          index="01" label="Selected work"
          title="Systems I designed, shipped and still own."
          lead="Four pieces of production work, each with the constraint that shaped it."
        />
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0,1fr))', gap: 'var(--space-4)' }}>
          {projects.map((p) => (
            <ProjectCard
              key={p.index} {...p} href="#"
              onClick={(e) => { e.preventDefault(); onOpen(p); }}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
