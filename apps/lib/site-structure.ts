/**
 * Structure of the MyGouv public portal.
 *
 * This file is the single source of truth of the *information architecture* of
 * the public website (as opposed to the application shell or the personal
 * space): which sections exist, in which order, and under which URLs.
 *
 * Hrefs are locale-agnostic pathnames: the next-intl Link (registered as the
 * ADS link renderer) prefixes the active locale automatically. Labels are
 * never stored here — they come from the message catalogs through the key
 * provided by each entry.
 *
 * Editorial model of the portal
 * -----------------------------
 * The public website presents MyGouv and gives access to it:
 *
 *   site
 *   ├── primaryNavigation     — the six sections of the site
 *   │   ├── home
 *   │   ├── discover
 *   │   ├── services
 *   │   ├── news
 *   │   ├── help
 *   │   └── about
 *   └── actions
 *       └── signIn            — transition towards the personal space (SSO)
 *
 * `primaryNavigation` stays distinct from the authenticated area: the public
 * sections (understand, discover, search, inform, access) are never mixed
 * with the personal-space entries (use, track, manage) which belong to the
 * account configuration (`@/lib/site-config.ts`) and the SSO/studios
 * applications.
 *
 * Section landing pages and their sub-pages do not all exist yet: the
 * structure below is the *planned* architecture of the portal. Entries whose
 * destination page is not published yet are kept in the model (they define
 * the future sub-menus) but must not be rendered by the header before their
 * route actually exists, so the site never exposes broken links.
 */
export const PORTAL_HOME = "/";

/** A leaf or nested entry of a navigation tree. */
export type SiteNavigationItem = {
  /**
   * Message key of the label. Top-level entries are resolved under
   * `nav.primary.<labelKey>`, sub-entries under
   * `nav.panel.<section>.<labelKey>` (see `primaryNavigation`).
   */
  labelKey: string;
  /** Locale-agnostic pathname of the destination. */
  href: string;
  /**
   * Optional sub-entries. They model the future sub-pages of the section
   * (dropdown / mega-menu content) and are only rendered by consumers once
   * the corresponding routes exist.
   */
  children?: ReadonlyArray<SiteNavigationItem>;
};

/** A top-level entry of the header navigation. */
export type PrimaryNavigationItem = SiteNavigationItem & {
  /**
   * Identifier of the section. It is also the `nav.primary` label key and
   * the namespace under which the sub-entries of the section resolve
   * (`nav.panel.<id>.*`).
   */
  id: "home" | "discover" | "services" | "news" | "help" | "about";
};

/** Planned roots of the five public sections (besides home, the `/` route). */
export const sectionPaths = {
  discover: "/decouvrir-mygouv",
  services: "/services",
  news: "/actualites",
  help: "/aide",
  about: "/a-propos",
} as const;

/**
 * Header actions — transversal actions of the header, clearly separated from
 * the navigation sections. They are not entries of the navigation but actions
 * the visitor can take (here: reaching the personal space).
 *
 * The SSO login page lives on its own domain: only the *path* is stored here,
 * the header resolves the full URL through `getDomainUrl("sso", …)`.
 */
export const headerActions = {
  signIn: {
    /** Message key resolved under `header.signIn`. */
    labelKey: "signIn",
    /** Path of the sign-in page on the SSO domain. */
    path: "/login",
  },
} as const;

/** DOM ids used as skip-link targets. */
export const pageAnchors = {
  content: "main-content",
  footer: "main-footer",
} as const;

export const legalPaths = {
  accessibility: "/legal/accessibility",
  privacy: "/legal/privacy",
  terms: "/legal/terms",
  cookies: "/legal/cookies",
  sitemap: "/sitemap",
} as const;

/** A link inside a navigation tree; its label is a message key. */
export type PrimaryNavLink = {
  labelKey: string;
  href: string;
};

export type FooterColumn = {
  /** Message key (`footer.columns`) of the column heading. */
  columnKey: string;
  links: ReadonlyArray<PrimaryNavLink>;
};

/**
 * Main navigation of the MyGouv portal header.
 *
 * The public site is organised around six entries:
 *
 *   Accueil
 *   Découvrir MyGouv   → presentation of the service and how it works
 *   Services           → the citizen-facing catalogue of public services
 *   Actualités         → news of the service (editorial content, coming)
 *   Aide               → support, help and documentation
 *   À propos           → institutional presentation of MyGouv
 *
 * Every top-level entry is a link to its section landing page. The
 * `children` arrays below describe the editorial content each section is
 * meant to carry (they will feed dropdown / mega-menus as soon as the
 * corresponding pages exist) — none of them is rendered by the header today,
 * because their routes do not exist yet.
 *
 * Top-level labels resolve under `nav.primary.<id>`, sub-entries under
 * `nav.panel.<id>.<labelKey>`.
 *
 * The `Services` section is deliberately citizen-oriented: its future
 * sub-navigation is organised by user life events and domains of the citizen
 * journey, not by ministries. Ministries are not a navigation axis of the
 * public portal.
 */
export const primaryNavigation: ReadonlyArray<PrimaryNavigationItem> = [
  {
    id: "home",
    labelKey: "home",
    href: PORTAL_HOME,
  },
  {
    id: "discover",
    labelKey: "discover",
    href: sectionPaths.discover,
    children: [
      { labelKey: "presentation", href: `${sectionPaths.discover}/presentation` },
      { labelKey: "fonctionnement", href: `${sectionPaths.discover}/comment-ca-marche` },
      { labelKey: "fonctionnalites", href: `${sectionPaths.discover}/fonctionnalites` },
      { labelKey: "surMobile", href: `${sectionPaths.discover}/sur-mobile` },
      { labelKey: "securiteConfidentialite", href: `${sectionPaths.discover}/securite-et-confidentialite` },
    ],
  },
  {
    id: "services",
    labelKey: "services",
    href: sectionPaths.services,
    children: [
      // “Tous les services” is the section hub itself: the `/services` page
      // presents the whole catalogue.
      { labelKey: "tousLesServices", href: sectionPaths.services },
      { labelKey: "parDomaine", href: `${sectionPaths.services}/par-domaine` },
      { labelKey: "parSituation", href: `${sectionPaths.services}/par-situation` },
      { labelKey: "populaires", href: `${sectionPaths.services}/populaires` },
    ],
  },
  {
    // Editorial news (actualités MyGouv, nouveaux services, maintenance…)
    // will land here when the editorial system exists. No sub-navigation is
    // introduced before that.
    id: "news",
    labelKey: "news",
    href: sectionPaths.news,
  },
  {
    id: "help",
    labelKey: "help",
    href: sectionPaths.help,
    children: [
      { labelKey: "centreAide", href: `${sectionPaths.help}/centre-d-aide` },
      { labelKey: "premiersPas", href: `${sectionPaths.help}/premiers-pas` },
      { labelKey: "compteMyGouv", href: `${sectionPaths.help}/compte-mygouv` },
      { labelKey: "demarches", href: `${sectionPaths.help}/demarches` },
      { labelKey: "documents", href: `${sectionPaths.help}/documents` },
      { labelKey: "securite", href: `${sectionPaths.help}/securite` },
    ],
  },
  {
    id: "about",
    labelKey: "about",
    href: sectionPaths.about,
    children: [
      { labelKey: "mygouv", href: `${sectionPaths.about}/mygouv` },
      { labelKey: "mission", href: `${sectionPaths.about}/mission` },
      { labelKey: "gouvernance", href: `${sectionPaths.about}/gouvernance` },
      { labelKey: "accessibilite", href: `${sectionPaths.about}/accessibilite` },
      { labelKey: "confidentialite", href: `${sectionPaths.about}/confidentialite` },
      { labelKey: "securite", href: `${sectionPaths.about}/securite` },
      { labelKey: "transparence", href: `${sectionPaths.about}/transparence` },
    ],
  },
];

/** Press area of the portal (dedicated page being published). */
const pressPath = "/presse";

/**
 * Secondary navigation zone of the site footer, distinct from the main
 * navigation of the header. Labels resolve under `nav.panel`, column titles
 * under `footer.columns`.
 */
export const footerNavigation: ReadonlyArray<FooterColumn> = [
  {
    columnKey: "rubriques",
    links: [
      { labelKey: "accueil", href: PORTAL_HOME },
      { labelKey: "actualites", href: sectionPaths.news },
      { labelKey: "ministres", href: "/government/ministres" },
      { labelKey: "ministere", href: "/le-ministere" },
      { labelKey: "rejoignezNous", href: "/rejoignez-nous" },
    ],
  },
  {
    columnKey: "vousEtes",
    links: [
      { labelKey: "audienceParticulier", href: "/fiscalite" },
      { labelKey: "audienceEntreprise", href: "/entreprises" },
    ],
  },
  {
    columnKey: "pressePortail",
    links: [
      { labelKey: "actualiteMinistere", href: "/news/actualite-du-ministere" },
      { labelKey: "communiquesPresse", href: pressPath },
      { labelKey: "informationPortail", href: "/information-sur-le-portail" },
    ],
  },
  {
    columnKey: "autresRessources",
    links: [
      { labelKey: "consultationsPubliques", href: "/consultations-publiques" },
      { labelKey: "fournisseurs", href: "/fournisseurs-du-ministere" },
      { labelKey: "documentation", href: "/documentation" },
      // Partner portals of the ministry, opened outside the portal.
      { labelKey: "dataEconomie", href: "https://data.economie.gouv.aor" },
      { labelKey: "servicesPublicsPlus", href: "https://service-public.gouv.aor/plus" },
    ],
  },
];
