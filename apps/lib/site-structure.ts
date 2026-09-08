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
 * The public website presents MyGouv and gives access to it, organised as a
 * two-level navigation tree — never as a flat list of pages:
 *
 *   site
 *   ├── home                   — Accueil, the single entry to the portal
 *   ├── sections               — five thematic sections
 *   │   ├── discover           — understand what MyGouv is
 *   │   │   ├── subject        — MyGouv, Fonctionnement, Fonctionnalités,
 *   │   │   └── …                Sécurité & confidentialité
 *   │   ├── services           — the citizen-facing catalogue of services
 *   │   ├── news               — news of the service (editorial, coming)
 *   │   ├── help               — support and assistance
 *   │   └── about              — MyGouv as a public digital service
 *   └── actions                — transversal actions of the header, kept
 *       ├── language               distinct from the navigation sections:
 *       └── signIn                 switch language, reach the personal space
 *
 * The `children` of a section are its *subjects*: the destinations a visitor
 * can reach from the section menu. The header renders them (desktop dropdown
 * and mobile sub-menus consume exactly the same data), so the site always
 * reflects this single model. Every subject whose page is not published yet
 * keeps its canonical URL here — shipping the page only changes the route
 * files, never the navigation model.
 *
 * `primaryNavigation` stays distinct from the authenticated area: the public
 * sections (understand, discover, search, access) are never mixed with the
 * personal-space entries (use, track, manage) which belong to the account
 * configuration (`@/lib/site-config.ts`) and the SSO/studios applications.
 */
export const PORTAL_HOME = "/";

/** Results page of the localized portal search (see `PortalSearchBar`). */
export const searchPath = "/search";

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
   * Optional sub-entries: the subjects of the section. When present they are
   * rendered as the menu content of the section (ADS `Menu`); an entry
   * without children is rendered as a plain link (e.g. Accueil).
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

/** Roots of the five public sections (besides home, the `/` route). */
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
 *
 * The other header action — switching language — is not a link and carries no
 * label: it is rendered by the `LocaleSwitcher`, whose options come from the
 * centralized i18n routing (`@/i18n/routing`). Both stay out of the
 * `primaryNavigation` list.
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
 *   Accueil             → single entry to the portal (plain link, `/`)
 *   Découvrir MyGouv    → what MyGouv is, how it works, its features,
 *                         security & privacy
 *   Services            → the citizen-facing catalogue of public services,
 *                         organised by the citizen journey, not by ministry
 *   Actualités          → news of the service (editorial content, coming)
 *   Aide                → support, help and documentation
 *   À propos            → institutional presentation of MyGouv
 *
 * Accueil stays a plain entry; the five thematic sections each carry four
 * subjects in their `children` array. The header renders each section as a
 * dropdown (ADS `Menu`) fed by these subjects on desktop and as an
 * expandable section in the mobile menu — one model, both breakpoints.
 *
 * Top-level labels resolve under `nav.primary.<id>`, sub-entries under
 * `nav.panel.<id>.<labelKey>`. The first subject of a section is its
 * overview entry and points back to the section root, so the section landing
 * page always stays reachable from the menu.
 *
 * The `Services` section is deliberately citizen-oriented: its sub-navigation
 * is organised for the user of the public services (all the services, by
 * domain, by life situation, popular services) and not for the administration
 * responsible for them. Ministries are not a navigation axis of the portal.
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
      // “MyGouv” — what the service is — is the overview of the section:
      // it leads to the section landing page itself.
      { labelKey: "mygouv", href: sectionPaths.discover },
      { labelKey: "fonctionnement", href: `${sectionPaths.discover}/comment-ca-marche` },
      { labelKey: "fonctionnalites", href: `${sectionPaths.discover}/fonctionnalites` },
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
    // Editorial news of MyGouv itself (actualités, nouveautés, agenda,
    // état du service) will land under this section as the editorial system
    // ships. The subjects below fix the architecture of the section.
    id: "news",
    labelKey: "news",
    href: sectionPaths.news,
    children: [
      // “Actualités” — the news list — is the section hub.
      { labelKey: "actualites", href: sectionPaths.news },
      { labelKey: "nouveautes", href: `${sectionPaths.news}/nouveautes` },
      { labelKey: "agenda", href: `${sectionPaths.news}/agenda` },
      { labelKey: "etatDuService", href: `${sectionPaths.news}/etat-du-service` },
    ],
  },
  {
    id: "help",
    labelKey: "help",
    href: sectionPaths.help,
    children: [
      // “Centre d'aide” is the section hub: `/aide` is the assistance entry.
      { labelKey: "centreAide", href: sectionPaths.help },
      { labelKey: "premiersPas", href: `${sectionPaths.help}/premiers-pas` },
      { labelKey: "compteMyGouv", href: `${sectionPaths.help}/compte-mygouv` },
      { labelKey: "securite", href: `${sectionPaths.help}/securite` },
    ],
  },
  {
    id: "about",
    labelKey: "about",
    href: sectionPaths.about,
    children: [
      // “Présentation” is the section hub: `/a-propos` presents MyGouv.
      // Accessibility, privacy and security detail pages will be added to
      // this section (or kept under the legal links) as they ship.
      { labelKey: "presentation", href: sectionPaths.about },
      { labelKey: "mission", href: `${sectionPaths.about}/mission` },
      { labelKey: "gouvernance", href: `${sectionPaths.about}/gouvernance` },
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
