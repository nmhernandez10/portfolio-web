# Portfolio site — UI kit

A single-page personal site for Nicolás Hernández, composed entirely from this
system's components. `index.html` is the interactive recreation: sticky nav with
scroll-spy, four content sections, a working contact form (client-side only), and
a project drawer that slides in when a `ProjectCard` is clicked.

## Files

| File | What it is |
| --- | --- |
| `PortfolioSite.jsx` | Composes the whole page; owns nav state and the drawer. |
| `Hero.jsx` | Name, role, lead paragraph, portrait, stat row. |
| `Work.jsx` | 2×2 grid of `ProjectCard`s. |
| `Experience.jsx` | Stacked `ExperienceItem`s on the sunk surface. |
| `About.jsx` | Prose + education on the left, skills table on the right. |
| `Contact.jsx` | Contact details + form. |
| `ProjectDrawer.jsx` | Right-side detail panel. |
| `data.js` | All copy, sourced from the 2026 résumé. Nothing here is invented. |

## Rules this kit demonstrates

- One accent (clay) per screen: the hero CTA. Section ordinals also use it, at 12px.
- Sections alternate `--paper` and `--paper-sunk`; no third background.
- Separation is hairlines, never shadows. Shadow appears only on card hover and the drawer.
- Every section opens with a numbered `SectionHeader`; ordinals run 01–04 in page order.
