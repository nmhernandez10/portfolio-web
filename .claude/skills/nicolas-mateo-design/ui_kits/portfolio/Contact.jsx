import React from 'react';
import { Button } from '../../components/core/Button.jsx';
import { Input } from '../../components/forms/Input.jsx';
import { Textarea } from '../../components/forms/Textarea.jsx';
import { TextLink } from '../../components/navigation/TextLink.jsx';
import { SectionHeader } from '../../components/content/SectionHeader.jsx';

export function Contact({ profile }) {
  const [sent, setSent] = React.useState(false);
  return (
    <section id="contact" style={{ padding: 'var(--space-9) var(--gutter) var(--space-8)', background: 'var(--paper-sunk)' }}>
      <div style={{ maxWidth: 'var(--width-content)', margin: '0 auto' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0,1fr) minmax(0,1fr)', gap: 'var(--space-8)' }}>
          <div>
            <SectionHeader index="04" label="Contact" title="Tell me what you're building." style={{ marginBottom: 'var(--space-5)' }} />
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
                <span style={{ font: 'var(--type-label)', letterSpacing: 'var(--tracking-label)', textTransform: 'uppercase', color: 'var(--text-meta)' }}>Email</span>
                <TextLink href={`mailto:${profile.email}`} style={{ font: 'var(--type-lead)' }}>{profile.email}</TextLink>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
                <span style={{ font: 'var(--type-label)', letterSpacing: 'var(--tracking-label)', textTransform: 'uppercase', color: 'var(--text-meta)' }}>Elsewhere</span>
                <TextLink href={`https://${profile.linkedin}`} external arrow>{profile.linkedin}</TextLink>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
                <span style={{ font: 'var(--type-label)', letterSpacing: 'var(--tracking-label)', textTransform: 'uppercase', color: 'var(--text-meta)' }}>Based in</span>
                <span style={{ font: 'var(--type-body)', color: 'var(--ink-1)' }}>{profile.location} · UTC−5 · remote-first</span>
              </div>
            </div>
          </div>

          <form
            onSubmit={(e) => { e.preventDefault(); setSent(true); }}
            style={{
              display: 'flex', flexDirection: 'column', gap: 'var(--space-4)',
              background: 'var(--surface-card)', border: '1px solid var(--border-hairline)',
              borderRadius: 'var(--radius-lg)', padding: 'var(--space-6)',
            }}
          >
            <Input label="Name" placeholder="your name" required />
            <Input label="Email" type="email" placeholder="you@company.com" required />
            <Textarea label="Message" rows={4} placeholder="what you're building, and where I'd fit" required />
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-4)' }}>
              <Button variant="accent" type="submit" trailing="→">Send message</Button>
              {sent ? <span style={{ font: 'var(--type-meta)', color: 'var(--moss)' }}>Thanks — I'll reply within a couple of days.</span> : null}
            </div>
          </form>
        </div>
      </div>
    </section>
  );
}
