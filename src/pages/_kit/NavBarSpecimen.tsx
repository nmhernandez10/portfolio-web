import { Button, NavBar } from "@/kit";
import type { NavItem } from "@/kit";

export interface NavBarSpecimenProps {
  brand: string;
  items: NavItem[];
  active: string;
  resumeHref: string;
  resumeLabel: string;
}

/**
 * NavBar's `action` slot takes a React element, and an .astro template can only
 * produce Astro renderables — so the one composition on this page that nests a
 * component inside a prop is assembled here instead. VC3's SiteNav island fills
 * the same slot with the theme toggle beside this button.
 */
export function NavBarSpecimen({
  brand,
  items,
  active,
  resumeHref,
  resumeLabel,
}: NavBarSpecimenProps) {
  return (
    <NavBar
      brand={brand}
      items={items}
      active={active}
      action={
        <Button size="sm" variant="secondary" href={resumeHref}>
          {resumeLabel}
        </Button>
      }
    />
  );
}
