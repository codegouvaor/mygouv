/**
 * Homepage content of the MyGouv public portal.
 *
 * Every list rendered on the homepage lives here so the page stays a pure
 * composition of sections and the content can evolve — or be replaced by an
 * API / CMS feed — without touching the interface.
 *
 * The main destinations reuse the canonical routes of `site-structure.ts`
 * (source of truth of the portal architecture): the header, the footer and
 * the homepage all point to the same sections. Service-oriented entries
 * (domains, situations, popular services) currently lead to the `Services`
 * section hub: the deep catalogue routes do not exist yet, so the homepage
 * never invents URLs — when a sub-page ships, only the `href` of the entry
 * needs to change.
 */
import type { FrIconClassName } from "@codegouvaor/react-ads/fr";
import { primaryNavigation, sectionPaths } from "./site-structure";

/** Canonical destinations of the public portal (mirrors `primaryNavigation`). */
export const homePaths = {
  discover: sectionPaths.discover,
  services: sectionPaths.services,
  news: sectionPaths.news,
  help: sectionPaths.help,
  about: sectionPaths.about,
} as const;

export type HomeEntry = {
  /** Message key suffix of the label (`home.<section>.items.<key>`). */
  key: string;
  href: string;
  iconId?: FrIconClassName;
};

/**
 * “Découvrir MyGouv” destinations of the homepage.
 *
 * Derived straight from the `discover` section of `site-structure.ts` (the
 * single source of truth of the portal architecture) so the homepage never
 * re-creates an independent navigation: when a subject page ships, only the
 * configuration changes. The overview entry (“MyGouv”, which points back to
 * the section root) is skipped — the section carries its own “Découvrir
 * MyGouv” call to action.
 */
const discoverSection = primaryNavigation.find((item) => item.id === "discover");
export const discoverLinks: ReadonlyArray<HomeEntry> =
  (discoverSection?.children ?? [])
    .filter((child) => child.labelKey !== "mygouv")
    .map((child) => ({ key: child.labelKey, href: child.href }));

/** Quick-access domains — citizen-oriented service areas, not ministries. */
export const serviceDomains: ReadonlyArray<HomeEntry> = [
  { key: "etatCivil", href: homePaths.services, iconId: "fr-icon-user-line" },
  { key: "entreprises", href: homePaths.services, iconId: "fr-icon-building-line" },
  { key: "etudes", href: homePaths.services, iconId: "fr-icon-book-2-line" },
  { key: "travail", href: homePaths.services, iconId: "fr-icon-briefcase-line" },
  { key: "fiscalite", href: homePaths.services, iconId: "fr-icon-money-euro-circle-line" },
  { key: "logement", href: homePaths.services, iconId: "fr-icon-home-4-line" },
  { key: "sante", href: homePaths.services, iconId: "fr-icon-heart-pulse-line" },
  { key: "mobilite", href: homePaths.services, iconId: "fr-icon-car-line" },
  { key: "famille", href: homePaths.services, iconId: "fr-icon-heart-line" },
];

/** What MyGouv does for the citizen (explanatory, non-navigational). */
export const explainerPoints: ReadonlyArray<{ key: string; iconId: FrIconClassName }> = [
  { key: "rechercher", iconId: "fr-icon-search-line" },
  { key: "comprendre", iconId: "fr-icon-information-line" },
  { key: "effectuer", iconId: "fr-icon-checkbox-circle-line" },
  { key: "suivre", iconId: "fr-icon-time-line" },
  { key: "retrouver", iconId: "fr-icon-folder-2-line" },
];

/** Life-event entries (“Je veux…”), each leading to the services catalogue. */
export const lifeSituations: ReadonlyArray<HomeEntry> = [
  { key: "creerEntreprise", href: homePaths.services },
  { key: "commencerEtudes", href: homePaths.services },
  { key: "chercherEmploi", href: homePaths.services },
  { key: "demenager", href: homePaths.services },
  { key: "changementSituation", href: homePaths.services },
  { key: "voyager", href: homePaths.services },
  { key: "devenirParent", href: homePaths.services },
  { key: "preparerRetraite", href: homePaths.services },
];

/** Most-used services of the portal. */
export const popularServices: ReadonlyArray<HomeEntry> = [
  { key: "carteIdentite", href: homePaths.services },
  { key: "passeport", href: homePaths.services },
  { key: "changementAdresse", href: homePaths.services },
  { key: "creerEntreprise", href: homePaths.services },
  { key: "declarerRevenus", href: homePaths.services },
  { key: "demanderAllocation", href: homePaths.services },
  { key: "consulterDocuments", href: homePaths.services },
];
