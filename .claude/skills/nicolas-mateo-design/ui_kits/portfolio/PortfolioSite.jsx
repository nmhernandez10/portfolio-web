import React from 'react';
import { NavBar } from '../../components/navigation/NavBar.jsx';
import { TextLink } from '../../components/navigation/TextLink.jsx';
import { Button } from '../../components/core/Button.jsx';
import { Hero } from './Hero.jsx';
import { Work } from './Work.jsx';
import { Experience } from './Experience.jsx';
import { About } from './About.jsx';
import { Contact } from './Contact.jsx';
import { ProjectDrawer } from './ProjectDrawer.jsx';
import { PROFILE, STATS, PROJECTS, EXPERIENCE, SKILLS, EDUCATION } from './data.js';

const NAV = [
  { id: 'work', label: 'Work' },
  { id: 'experience', label: 'Experience' },
  { id: 'about', label: 'About' },
  { id: 'contact', label: 'Contact' },
];

export function PortfolioSite({ portraitSrc = '../../assets/portrait.jpg', resumeSrc = '../../assets/resume-2026-nicolas-hernandez.pdf' }) {
  const [active, setActive] = React.useState('work');
  const [project, setProject] = React.useState(null);

  const go = (id) => {
    setActive(id === 'top' ? 'work' : id);
    const el = document.getElementById(id === 'top' ? 'top' : id);
    if (el) window.scrollTo({ top: id === 'top' ? 0 : el.offsetTop - 60, behavior: 'smooth' });
  };

  React.useEffect(() => {
    const ids = NAV.map((n) => n.id);
    const onScroll = () => {
      const y = window.scrollY + 140;
      let cur = ids[0];
      ids.forEach((id) => { const el = document.getElementById(id); if (el && el.offsetTop <= y) cur = id; });
      setActive(cur);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <div style={{ background: 'var(--paper)', minHeight: '100vh' }}>
      <NavBar
        brand={PROFILE.name}
        items={NAV}
        active={active}
        onNavigate={go}
        action={<Button size="sm" variant="secondary" href={resumeSrc} target="_blank">Résumé</Button>}
      />
      <Hero profile={PROFILE} stats={STATS} portraitSrc={portraitSrc} onContact={() => go('contact')} />
      <Work projects={PROJECTS} onOpen={setProject} />
      <Experience roles={EXPERIENCE} />
      <About skills={SKILLS} education={EDUCATION} />
      <Contact profile={PROFILE} />

      <footer style={{
        padding: 'var(--space-6) var(--gutter)', borderTop: '1px solid var(--border-hairline)',
        background: 'var(--paper-sunk)',
      }}>
        <div style={{
          maxWidth: 'var(--width-content)', margin: '0 auto',
          display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 'var(--space-5)', flexWrap: 'wrap',
        }}>
          <span style={{ font: 'var(--type-meta)', color: 'var(--text-meta)' }}>© 2026 {PROFILE.name}</span>
          <div style={{ display: 'flex', gap: 'var(--space-5)', font: 'var(--type-meta)' }}>
            <TextLink href={`mailto:${PROFILE.email}`}>Email</TextLink>
            <TextLink href={`https://${PROFILE.linkedin}`} external>LinkedIn</TextLink>
            <TextLink href={resumeSrc}>Résumé</TextLink>
          </div>
        </div>
      </footer>

      <ProjectDrawer project={project} onClose={() => setProject(null)} />
    </div>
  );
}
