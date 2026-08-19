const ICONS = "../../assets/icons";
const PORTRAIT = "../../assets/portrait-nicolas.jpg";

function PoHeader({ theme, onTheme }) {
  const links = [["work", "Work"], ["experience", "Experience"], ["stack", "Stack"], ["contact", "Contact"]];
  return (
    <header style={{ position: "sticky", top: 0, zIndex: 20, background: "color-mix(in oklab, var(--surface-canvas) 86%, transparent)", backdropFilter: "blur(10px)", borderBottom: "1px solid var(--border-subtle)" }}>
      <div style={{ maxWidth: "var(--container-max)", margin: "0 auto", padding: "14px var(--gutter-lg)", display: "flex", alignItems: "center", justifyContent: "space-between", gap: "var(--space-6)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "var(--space-3)" }}>
          <Avatar src={PORTRAIT} alt="Nicolás Mateo" size="sm" />
          <span style={{ fontFamily: "var(--font-display)", fontSize: 18, fontWeight: 600, letterSpacing: "-0.02em", color: "var(--text-display)" }}>
            Nicolás Mateo<span style={{ color: "var(--accent-press)" }}>.</span>
          </span>
        </div>
        <nav style={{ display: "flex", gap: "var(--space-6)" }}>
          {links.map(([id, label]) => (
            <a key={id} href={"#" + id} style={{ fontFamily: "var(--font-mono)", fontSize: "var(--text-2xs)", letterSpacing: "var(--tracking-label)", textTransform: "uppercase", color: "var(--text-muted)", borderBottom: "1px solid transparent", paddingBottom: 2 }}>{label}</a>
          ))}
        </nav>
        <div style={{ display: "flex", alignItems: "center", gap: "var(--space-3)" }}>
          <ThemeToggle theme={theme} onChange={onTheme} iconBase={ICONS} />
          <Button size="sm" variant="secondary" icon="download" iconPosition="left" iconBase={ICONS}>Resume</Button>
        </div>
      </div>
    </header>
  );
}

function PoSection({ children, id, style }) {
  return <section id={id} style={{ maxWidth: "var(--container-max)", margin: "var(--section-gap) auto 0", padding: "0 var(--gutter-lg)", ...style }}>{children}</section>;
}

function PoHero({ lens, onLens }) {
  const p = window.PORTFOLIO, l = p.lenses[lens];
  return (
    <div style={{ maxWidth: "var(--container-max)", margin: "0 auto", padding: "var(--space-20) var(--gutter-lg) 0" }}>
      <div style={{ display: "grid", gridTemplateColumns: "minmax(0,7fr) minmax(0,5fr)", gap: "var(--space-16)", alignItems: "center" }}>
        <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-6)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "var(--space-4)", flexWrap: "wrap" }}>
            <SegmentedToggle value={lens} onChange={onLens} options={[{ value: "be", label: "Backend" }, { value: "fs", label: "Full stack" }]} />
            <Tag tone="success" dot>Open to work</Tag>
          </div>
          <h1 style={{ margin: 0, fontSize: "var(--text-6xl)", lineHeight: "var(--leading-tight)", letterSpacing: "var(--tracking-display)" }}>
            {l.hero[0]}<br />{l.hero[1]}
          </h1>
          <p style={{ margin: 0, maxWidth: "48ch", fontSize: "var(--text-lg)", lineHeight: "var(--leading-body)", color: "var(--text-secondary)" }}>{l.lede}</p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "var(--space-3)", marginTop: "var(--space-2)" }}>
            <Button icon="arrow-down" iconBase={ICONS} as="a" href="#work">See selected work</Button>
            <Button variant="secondary" icon="mail" iconPosition="left" iconBase={ICONS} as="a" href="#contact">Get in touch</Button>
          </div>
          <div style={{ display: "flex", gap: "var(--space-6)", flexWrap: "wrap", marginTop: "var(--space-4)" }}>
            <span className="label-mono">{p.location}</span>
            <span className="label-mono">{l.role}</span>
          </div>
        </div>
        <div style={{ position: "relative" }}>
          <img
            src={PORTRAIT}
            alt="Nicolás Mateo Hernández"
            style={{ width: "100%", aspectRatio: "4 / 5", objectFit: "cover", objectPosition: "50% 20%", borderRadius: "var(--radius-media)", border: "1px solid var(--border-subtle)" }}
          />
          <span style={{ position: "absolute", left: -1, bottom: -1, padding: "8px 12px", background: "var(--surface-canvas)", borderTop: "1px solid var(--border-subtle)", borderRight: "1px solid var(--border-subtle)", borderTopRightRadius: "var(--radius-sm)", fontFamily: "var(--font-mono)", fontSize: "var(--text-2xs)", letterSpacing: "var(--tracking-label)", textTransform: "uppercase", color: "var(--text-muted)" }}>
            Bogotá · Remote
          </span>
        </div>
      </div>
    </div>
  );
}

function PoStats() {
  return (
    <PoSection>
      <div className="reveal" style={{ display: "grid", gridTemplateColumns: "repeat(4, minmax(0,1fr))", gap: "var(--space-8)", borderTop: "1px solid var(--border-subtle)", paddingTop: "var(--space-8)" }}>
        {window.PORTFOLIO.stats.map((s) => <StatBlock key={s.label} value={s.value} label={s.label} />)}
      </div>
    </PoSection>
  );
}

function PoWork({ lens }) {
  const p = window.PORTFOLIO;
  return (
    <PoSection id="work">
      <SectionHeader eyebrow="01 / Selected work" title={p.lenses[lens].workTitle} lede="No screenshots here on purpose — each card states the system and the part I owned." />
      <div className="reveal" style={{ display: "grid", gridTemplateColumns: "repeat(2, minmax(0,1fr))", gap: "var(--space-6)", marginTop: "var(--space-10)" }}>
        {p.work.map((w, i) => (
          <ProjectBrief key={w.id} iconBase={ICONS} index={String(i + 1).padStart(2, "0")} title={w.title} role={w.role} period={w.period} summary={w[lens]} metrics={w.metrics} stack={w.stack} />
        ))}
      </div>
    </PoSection>
  );
}

function PoExperience() {
  const p = window.PORTFOLIO;
  return (
    <PoSection id="experience">
      <SectionHeader eyebrow="02 / Experience" title="Six years of production work" />
      <div className="reveal" style={{ display: "grid", gridTemplateColumns: "minmax(0,7fr) minmax(0,4fr)", gap: "var(--space-16)", marginTop: "var(--space-10)" }}>
        <ol style={{ margin: 0, padding: 0 }}>{p.timeline.map((t) => <TimelineItem key={t.role + t.period} {...t} />)}</ol>
        <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-6)" }}>
          <span className="label-mono">Education</span>
          {p.education.map((e) => (
            <div key={e.degree} style={{ display: "flex", flexDirection: "column", gap: 4, borderTop: "1px solid var(--border-subtle)", paddingTop: "var(--space-4)" }}>
              <span style={{ fontSize: "var(--text-base)" }}>{e.degree}</span>
              <span style={{ fontSize: "var(--text-sm)", color: "var(--text-secondary)" }}>{e.school}</span>
              <span className="label-mono">{e.period}</span>
            </div>
          ))}
        </div>
      </div>
    </PoSection>
  );
}

function PoStack({ lens }) {
  return (
    <PoSection id="stack">
      <SectionHeader eyebrow="03 / Stack" title="What I reach for" />
      <div className="reveal" style={{ display: "grid", gridTemplateColumns: "repeat(3, minmax(0,1fr))", gap: "var(--space-10) var(--space-8)", marginTop: "var(--space-10)" }}>
        {window.PORTFOLIO.lenses[lens].skills.map((s) => (
          <SkillGroup key={s.title} title={s.title} icon={s.icon} iconSet={s.iconSet || "tech"} iconBase={ICONS} items={s.items} />
        ))}
      </div>
    </PoSection>
  );
}

function PoAI() {
  const bullets = [
    "Internal tooling and automated workflows over multiple agent CLIs, so delegation and verification look the same across the team.",
    "An agent-driven first pass on GitHub pull requests, checked against versioned convention files — human review still gates the merge.",
    "Agentic capabilities inside product platforms with AWS Bedrock and AgentCore.",
    "Token budgets, per-task model selection and context management tuned so cost stays predictable.",
  ];
  return (
    <PoSection>
      <Card tone="accent" padding="lg" className="reveal" style={{ display: "grid", gridTemplateColumns: "minmax(0,5fr) minmax(0,7fr)", gap: "var(--space-12)" }}>
        <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-4)" }}>
          <span className="label-mono" style={{ display: "flex", alignItems: "center", gap: 8, color: "var(--gold-700)" }}>
            <Icon name="sparkles" size={14} base={ICONS} /> 04 / AI engineering
          </span>
          <h2 style={{ margin: 0, fontSize: "var(--text-2xl)", lineHeight: "var(--leading-display)" }}>Building the workflows my team uses to work with agents</h2>
        </div>
        <ul style={{ margin: 0, padding: 0, listStyle: "none", display: "flex", flexDirection: "column", gap: "var(--space-4)" }}>
          {bullets.map((b) => (
            <li key={b} style={{ display: "flex", gap: "var(--space-3)", fontSize: "var(--text-base)", lineHeight: "var(--leading-body)", color: "var(--text-secondary)" }}>
              <Icon name="check" size={16} base={ICONS} style={{ color: "var(--gold-700)", marginTop: 5 }} />
              <span>{b}</span>
            </li>
          ))}
        </ul>
      </Card>
    </PoSection>
  );
}

function PoContact() {
  const p = window.PORTFOLIO;
  const [sent, setSent] = React.useState(false);
  const rows = [["mail", "Email", p.email, "mailto:" + p.email], ["map-pin", "Based in", p.location, null], ["github", "Code", p.github, "https://" + p.github], ["file-text", "Resume", "Backend and full-stack versions", null]];
  return (
    <PoSection id="contact">
      <SectionHeader eyebrow="05 / Contact" title="Tell me what you are building" lede="I read everything. A sentence or two about the team and the problem is plenty to start." />
      <div className="reveal" style={{ display: "grid", gridTemplateColumns: "minmax(0,7fr) minmax(0,5fr)", gap: "var(--space-16)", marginTop: "var(--space-10)" }}>
        <form onSubmit={(e) => { e.preventDefault(); setSent(true); }} style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "var(--space-5)" }}>
          <Input label="Name" name="name" placeholder="Who is writing?" required />
          <Input label="Email" name="email" type="email" placeholder="you@company.com" required />
          <Select label="What is this about?" iconBase={ICONS} options={["A role", "Contract work", "Something else"]} style={{ gridColumn: "1 / -1" }} />
          <Textarea label="What are you building?" rows={5} placeholder="A sentence or two is plenty." style={{ gridColumn: "1 / -1" }} />
          <div style={{ gridColumn: "1 / -1", display: "flex", alignItems: "center", gap: "var(--space-4)" }}>
            <Button icon="arrow-right" iconBase={ICONS}>{sent ? "Sent, thank you" : "Send it"}</Button>
            {sent ? <Tag tone="success" dot>I reply within a couple of days</Tag> : <span style={{ fontSize: "var(--text-sm)", color: "var(--text-muted)" }}>Or just email me directly.</span>}
          </div>
        </form>
        <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-6)" }}>
          {rows.map(([icon, label, value, href]) => (
            <div key={label} style={{ display: "flex", gap: "var(--space-4)", borderTop: "1px solid var(--border-subtle)", paddingTop: "var(--space-4)" }}>
              <Icon name={icon} set={icon === "github" ? "tech" : "ui"} size={16} base={ICONS} style={{ color: "var(--text-muted)", marginTop: 3 }} />
              <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                <span className="label-mono">{label}</span>
                {href ? <TextLink href={href}>{value}</TextLink> : <span style={{ fontSize: "var(--text-base)" }}>{value}</span>}
              </div>
            </div>
          ))}
        </div>
      </div>
    </PoSection>
  );
}

function PoFooter() {
  const p = window.PORTFOLIO;
  return (
    <footer style={{ borderTop: "1px solid var(--border-subtle)", marginTop: "var(--section-gap)" }}>
      <div style={{ maxWidth: "var(--container-max)", margin: "0 auto", padding: "var(--space-10) var(--gutter-lg) var(--space-16)", display: "flex", flexWrap: "wrap", gap: "var(--space-6)", justifyContent: "space-between", alignItems: "center" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "var(--space-3)" }}>
          <Avatar src={PORTRAIT} alt="" size="sm" />
          <span style={{ fontFamily: "var(--font-display)", fontSize: "var(--text-lg)", fontWeight: 600, letterSpacing: "-0.02em" }}>Nicolás Mateo<span style={{ color: "var(--accent-press)" }}>.</span></span>
        </div>
        <div style={{ display: "flex", gap: "var(--space-6)", alignItems: "center" }}>
          <TextLink href={"https://" + p.github} external iconBase={ICONS}>GitHub</TextLink>
          <TextLink href={"https://" + p.linkedin} external iconBase={ICONS}>LinkedIn</TextLink>
          <span className="label-mono">Built in Bogotá</span>
        </div>
      </div>
    </footer>
  );
}

Object.assign(window, { PoHeader, PoSection, PoHero, PoStats, PoWork, PoExperience, PoStack, PoAI, PoContact, PoFooter, ICONS, PORTRAIT });
