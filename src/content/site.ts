/**
 * The origin's one narrowing.
 *
 * astro.config.mjs's `site` is the single owner of the host — canonical, every
 * og:* URL, the Person JSON-LD, the sitemap and robots.txt all derive from it.
 * Astro types it optional, so every consumer has to narrow before using it, and
 * four of them were doing so with the same three hand-written lines.
 *
 * A throw, never an assertion: `site` unset is a build-time misconfiguration,
 * and the message names which surface noticed. A subpath door like ./contact
 * and ./schema — see the note in ./index.ts — rather than a barrel export,
 * because the barrel re-exports the whole résumé.
 */
export function requireSite(site: URL | undefined, consumer: string): URL {
  if (!site) {
    throw new Error(`astro.config.mjs must set \`site\`: ${consumer}.`);
  }
  return site;
}
