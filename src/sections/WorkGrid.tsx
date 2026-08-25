import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { ProjectCard, ProjectDrawer } from "@/ui";
import type { DrawerProject } from "@/ui";
// Subpaths, not the "@/content" barrel: this is hydrated code and the barrel
// re-exports the whole résumé. sections.ts imports nothing — see the note in
// src/content/index.ts. The projects themselves cross as a serialized prop.
import { COPY, twoDigit } from "@/content/sections";

/**
 * The 01 Work grid and the drawer behind it — the page's one modal.
 *
 * Two things here are deliberately independent of hydration. Each project's
 * drawer-only detail copy renders as static <ol hidden> markup, because the
 * kit's drawer renders nothing while closed and this island is client:visible;
 * and the cards stay real anchors pointing at that markup, so a click landing
 * before React does something honest rather than jumping to the top.
 *
 * The drawer is portaled to document.body. Its scrim and panel are fixed, and
 * Section.astro's .reveal carries a transform until the block has revealed —
 * which would make the section, not the viewport, their containing block.
 */

interface WorkProject extends DrawerProject {
  /** The content model guarantees the lines; the kit's own type does not. */
  detail: string[];
}

interface Props {
  projects: WorkProject[];
}

const detailId = (index: string) => `project-${index}`;

export function WorkGrid({ projects }: Props) {
  // Must start closed to match the prerendered HTML.
  const [project, setProject] = useState<DrawerProject | null>(null);
  // One flag, one meaning: the drawer exists and a card can open it. React
  // cannot portal from the server renderer, and a card should not advertise a
  // dialog that is not there yet — which also gives e2e its hydration barrier.
  const [hydrated, setHydrated] = useState(false);
  useEffect(() => {
    setHydrated(true);
  }, []);

  const entries = projects.map((entry, i) => ({
    ...entry,
    index: twoDigit(i + 1),
  }));

  return (
    <>
      <div className="work__grid">
        {entries.map((entry) => (
          <ProjectCard
            key={entry.index}
            index={entry.index}
            title={entry.title}
            kicker={entry.kicker}
            description={entry.description}
            tags={entry.tags}
            meta={entry.meta}
            href={`#${detailId(entry.index)}`}
            aria-haspopup={hydrated ? "dialog" : undefined}
            onClick={(event) => {
              event.preventDefault();
              setProject(entry);
            }}
          />
        ))}
      </div>

      {/* The drawer's copy, in the page whether or not this island ever runs.
          Never move it inside a hydration-dependent branch. */}
      {entries.map((entry) => (
        <ol key={entry.index} hidden id={detailId(entry.index)}>
          {entry.detail.map((line, i) => (
            <li key={i}>{line}</li>
          ))}
        </ol>
      ))}

      {hydrated &&
        createPortal(
          <ProjectDrawer
            project={project}
            onClose={() => setProject(null)}
            closeLabel={COPY.drawer.close}
          />,
          document.body,
        )}
    </>
  );
}
