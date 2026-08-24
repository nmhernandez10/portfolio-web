import React from 'react';
import { SectionHeader } from '../../components/content/SectionHeader.jsx';
import { SkillGroup } from '../../components/content/SkillGroup.jsx';
import { Divider } from '../../components/core/Divider.jsx';

export function About({ skills, education }) {
  return (
    <section id="about" style={{ padding: 'var(--space-9) var(--gutter)' }}>
      <div style={{ maxWidth: 'var(--width-content)', margin: '0 auto' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0,0.85fr) minmax(0,1.15fr)', gap: 'var(--space-8)' }}>
          <div>
            <SectionHeader index="03" label="About" title="How I work." style={{ marginBottom: 'var(--space-5)' }} />
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)', maxWidth: 'var(--measure-prose)' }}>
              <p style={{ font: 'var(--type-body)', color: 'var(--text-body)' }}>
                I lead technical design and delivery for a regulated mental health platform, working across teams of four
                to eight engineers and partnering directly with Product on scope and sequencing.
              </p>
              <p style={{ font: 'var(--type-body)', color: 'var(--text-body)' }}>
                Mentoring engineers and raising the team's review and architecture standards is a core part of how I work.
                I also build the tooling and automated workflows my team uses to work alongside AI coding agents.
              </p>
            </div>
            <Divider label="Education" space="var(--space-7)" />
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
              {education.map((e) => (
                <div key={e.degree} style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  <span style={{ font: 'var(--type-h3)', color: 'var(--ink-1)' }}>{e.degree}</span>
                  <span style={{ font: 'var(--type-meta)', color: 'var(--text-meta)' }}>{e.school} · {e.period}</span>
                </div>
              ))}
            </div>
          </div>
          <div>
            {skills.map((s) => <SkillGroup key={s.title} {...s} />)}
          </div>
        </div>
      </div>
    </section>
  );
}
