import { profile } from "./profile";

/**
 * The Person JSON-LD, derived from the profile rather than restated beside it.
 * Only `/` renders it — index.astro slots it into the head — so this module is
 * not re-exported from the barrel; like content/contact, its door is the
 * subpath.
 *
 * Everything returned is JSON-native. `url` is a string, not the URL object it
 * came from, so that JSON.parse of the rendered <script> deep-equals what this
 * returns and a test can assert against the module instead of a copied string.
 */
export interface PersonSchema {
  "@context": "https://schema.org";
  "@type": "Person";
  name: string;
  alternateName: string;
  url: string;
  jobTitle: string;
  sameAs: string[];
  address: {
    "@type": "PostalAddress";
    addressLocality: string;
    addressCountry: string;
  };
}

export function personSchema(site: URL | undefined): PersonSchema {
  // Narrowed here rather than at the call site: astro.config.mjs owns the
  // origin, and a page should not have to prove that before asking for schema.
  if (!site) {
    throw new Error("personSchema needs `site` from astro.config.mjs.");
  }

  // profile.location is one string because the contact rail renders it as one.
  // Structured data needs its two halves, so the split is validated: an edit to
  // "Bogotá" alone should fail the build, not ship a half-formed address, and a
  // third part ("City, Region, Country") should fail too rather than be dropped
  // silently into a country field that then names a region.
  const parts = profile.location.split(", ");
  const [addressLocality, addressCountry] = parts;
  if (parts.length !== 2 || !addressLocality || !addressCountry) {
    throw new Error(
      `profile.location must read "City, Country" — got "${profile.location}".`,
    );
  }

  return {
    "@context": "https://schema.org",
    "@type": "Person",
    name: profile.fullName,
    alternateName: profile.alternateName,
    url: site.href,
    jobTitle: profile.role,
    sameAs: [`https://${profile.github}`, `https://${profile.linkedin}`],
    address: {
      "@type": "PostalAddress",
      addressLocality,
      addressCountry,
    },
  };
}
