/**
 * URL structure of the public portal.
 *
 * Hrefs are locale-agnostic pathnames: the next-intl Link (registered as the
 * ADS link renderer) prefixes the active locale automatically. Labels are
 * never stored here — they come from the message catalogs through the key
 * provided by each entry.
 */
export const PORTAL_HOME = "/";

export type PrimaryNavKey =
  | "economie"
  | "fiscalite"
  | "entreprises"
  | "financesPubliques"
  | "commerceDouanes"
  | "donneesRessources";

/** A link inside a mega-menu panel; its label is a `nav.panel` message key. */
export type PrimaryNavLink = {
  labelKey: string;
  href: string;
};

/**
 * One column of a mega-menu panel. The heading is either plain text
 * (`titleKey`) or, when the column heading is itself the main destination of
 * the group, a link (`mainLink`) — rendered by the ADS `MegaMenu` as
 * `categoryMainText` / `categoryMainLink`.
 */
export type MegaMenuCategory =
  | {
      /** Message key (`nav.panel`) of the category heading. */
      titleKey: string;
      mainLink?: never;
      links: ReadonlyArray<PrimaryNavLink>;
    }
  | {
      titleKey?: never;
      /** Heading rendered as a link (e.g. “Toutes les démarches”). */
      mainLink: PrimaryNavLink;
      links: ReadonlyArray<PrimaryNavLink>;
    };

/**
 * One top-level entry of the Government Header navigation.
 *
 * Navigation principle (info.gouv.fr-inspired, adapted to Astoria): every
 * section opens a mega-menu panel composed of
 *  - a leader band: the section name, a one-line description and the main
 *    section action (e.g. “→ Tout le Gouvernement”),
 *  - an optional featured zone (used by Actualités for “À la une”),
 *  - a small number of link columns — the mega-menu is not the sitemap of the
 *    portal: only the destinations that matter to the user journey.
 *
 * Top-level labels resolve under `nav.primary` (`labelKey`), panel content
 * under `nav.panel` (`titleKey`, `paragraphKey` and nested `labelKey`s).
 */
export type PrimaryNavItem =
  | {
      type: "link";
      labelKey: string;
      href: string;
    }
  | {
      type: "megaMenu";
      labelKey: string;
      href: string;
      /** Leader band shown on top of the panel. */
      leader: {
        titleKey: string;
        paragraphKey: string;
        link: PrimaryNavLink;
      };
      /**
       * Optional featured zone rendered as the first column of the panel
       * (e.g. “À la une” in Actualités), meant to be fed dynamically later.
       * The link label is NOT stored here: the header reads the shared
       * `home.news.featured` messages so the headline has a single source.
       */
      featuredLink?: {
        titleKey: string;
        href: string;
      };
      categories?: ReadonlyArray<MegaMenuCategory>;
    };

export type FooterColumn = {
  /** Message key (`footer.columns`) of the column heading. */
  columnKey: string;
  links: ReadonlyArray<PrimaryNavLink>;
};

export const sectionPaths = {
  composition: "/government/composition",
  decryptages: "/decryptages",
  lEtatEtMoi: "/l-etat-et-moi",
  preventionDesRisques: "/prevention-des-risques",
  suiviDesEngagements: "/suivi-des-engagements",
  liensUtiles: "/liens-utiles",
  /** Citizen participation: provisional section being published. */
  participation: "/participation",
  /** Priority policies (former “Politiques prioritaires” navigation entry). */
  politiquesPrioritaires: "/politiques-prioritaires",
  /** Public policies hub — main destination of “L'action publique”. */
  politiquesPubliques: "/politiques-publiques",
} as const;

export const legalPaths = {
  accessibility: "/legal/accessibility",
  privacy: "/legal/privacy",
  terms: "/legal/terms",
  cookies: "/legal/cookies",
  sitemap: "/sitemap",
} as const;

export const searchPath = "/search";

/** Press area of the portal (dedicated page being published). */
export const pressPath = "/presse";

/** DOM ids used as skip-link targets. */
export const pageAnchors = {
  content: "main-content",
  footer: "main-footer",
} as const;

/**
 * Secondary navigation zone of the site footer, distinct from the main
 * navigation of the header. Organised like a ministry footer:
 *
 *   Rubriques        → Accueil, Actualités, le Gouvernement, le ministère
 *   Vous êtes        → the portal audiences (individuals, companies)
 *   Presse & portail → ministry news, press releases, portal information
 *   Autres ressources→ consultations, suppliers, documentation, data portal,
 *                      the “Services Publics +” application
 *
 * The column zone is complemented by the bottom bar of the footer
 * (Contact, Plan du portail, Documents opposables, legal links). Labels
 * resolve under `nav.panel`, column titles under `footer.columns`.
 */
export const footerNavigation: ReadonlyArray<FooterColumn> = [
  {
    columnKey: "rubriques",
    links: [
      { labelKey: "accueil", href: PORTAL_HOME },
      { labelKey: "actualites", href: "/news" },
      { labelKey: "ministres", href: "/government/ministres" },
      { labelKey: "ministere", href: "/le-ministere" },
      { labelKey: "rejoignezNous", href: "/rejoignez-nous" },
    ],
  },
  {
    columnKey: "vousEtes",
    links: [
      // The audience entries reuse the domain hubs of the main navigation:
      // the portal is one application, oriented by audience in the footer.
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

/**
 * Main navigation of the Government Header of the Ministry of Economy and
 * Finance — the permanent architecture of the application, in six domains.
 * Each domain regroups the ministry's missions and services into one
 * coherent application (no separate portals for taxes, customs, budget…):
 *
 *   Économie             → Politique économique, croissance, emploi, innovation
 *   Fiscalité            → Impôts, taxes, déclarations et paiements
 *   Entreprises          → Créer, gérer, financer, exporter
 *   Finances publiques   → Budget de l'État, dette, transparence
 *   Commerce & Douanes   → Commerce intérieur et international, douanes
 *   Données & Ressources → Données, statistiques, études, réglementation
 *
 * Every domain opens a mega-menu panel with four thematic sections of four
 * links each, so the ministry can be navigated as a single application
 * rather than as a collection of linked administrative sites. The structure
 * is configuration-driven: the same architecture can be reused for another
 * ministry by providing a different `primaryNavigation`.
 *
 * Hrefs follow the URL plan of the ministry portal; a few point to pages
 * being published and will resolve as soon as those sections ship.
 */
export const primaryNavigation: ReadonlyArray<PrimaryNavItem> = [
  {
    type: "megaMenu",
    labelKey: "economie",
    href: "/economie",
    leader: {
      titleKey: "economieTitle",
      paragraphKey: "economieText",
      link: { labelKey: "economieAllLink", href: "/economie" },
    },
    categories: [
      {
        // POLITIQUE ÉCONOMIQUE
        titleKey: "economiePolitiqueCategory",
        links: [
          { labelKey: "economieStrategie", href: "/economie/strategie-economique" },
          { labelKey: "economieReformes", href: "/economie/reformes-economiques" },
          { labelKey: "economieIndustrie", href: "/economie/politique-industrielle" },
          { labelKey: "economiePolitiqueCompetitivite", href: "/economie/politique-de-competitivite" },
        ],
      },
      {
        // CROISSANCE & COMPÉTITIVITÉ
        titleKey: "economieCroissanceCategory",
        links: [
          { labelKey: "economieCroissance", href: "/economie/croissance" },
          { labelKey: "economieProductivite", href: "/economie/productivite" },
          { labelKey: "economieCompetitivite", href: "/economie/competitivite" },
          { labelKey: "economieDeveloppement", href: "/economie/developpement-economique" },
        ],
      },
      {
        // EMPLOI & ACTIVITÉ
        titleKey: "economieEmploiCategory",
        links: [
          { labelKey: "economieMarcheTravail", href: "/economie/marche-du-travail" },
          { labelKey: "economieActivite", href: "/economie/activite-economique" },
          { labelKey: "economieEntrepreneuriat", href: "/economie/entrepreneuriat" },
          { labelKey: "economieDynamiqueEntreprises", href: "/economie/dynamique-des-entreprises" },
        ],
      },
      {
        // INVESTISSEMENT & INNOVATION
        titleKey: "economieInvestissementCategory",
        links: [
          { labelKey: "economieInvestissement", href: "/economie/investissement" },
          { labelKey: "economieInnovation", href: "/economie/innovation" },
          { labelKey: "economieRecherche", href: "/economie/recherche" },
          { labelKey: "economieTechnologiesStrategiques", href: "/economie/technologies-strategiques" },
        ],
      },
    ],
  },
  {
    type: "megaMenu",
    labelKey: "fiscalite",
    href: "/fiscalite",
    leader: {
      titleKey: "fiscaliteTitle",
      paragraphKey: "fiscaliteText",
      link: { labelKey: "fiscaliteAllLink", href: "/fiscalite" },
    },
    categories: [
      {
        // PARTICULIERS
        titleKey: "fiscaliteParticuliersCategory",
        links: [
          { labelKey: "fiscaliteImpotRevenu", href: "/fiscalite/impot-sur-le-revenu" },
          { labelKey: "fiscaliteDeclarationFiscale", href: "/fiscalite/declaration-fiscale" },
          { labelKey: "fiscalitePaiement", href: "/fiscalite/paiement" },
          { labelKey: "fiscaliteSituationFiscale", href: "/fiscalite/situation-fiscale" },
        ],
      },
      {
        // ENTREPRISES
        titleKey: "fiscaliteEntreprisesCategory",
        links: [
          { labelKey: "fiscaliteImpotSocietes", href: "/fiscalite/impot-sur-les-societes" },
          { labelKey: "fiscaliteTva", href: "/fiscalite/tva" },
          { labelKey: "fiscaliteEntreprises", href: "/fiscalite/fiscalite-des-entreprises" },
          { labelKey: "fiscaliteObligationsFiscales", href: "/fiscalite/obligations-fiscales" },
        ],
      },
      {
        // TAXES & CONTRIBUTIONS
        titleKey: "fiscaliteTaxesCategory",
        links: [
          { labelKey: "fiscaliteTaxes", href: "/fiscalite/taxes" },
          { labelKey: "fiscaliteContributions", href: "/fiscalite/contributions" },
          { labelKey: "fiscaliteDroitsPrelevements", href: "/fiscalite/droits-et-prelevements" },
          { labelKey: "fiscaliteRegimesParticuliers", href: "/fiscalite/regimes-particuliers" },
        ],
      },
      {
        // DÉCLARATIONS & PAIEMENTS — oriented towards action
        titleKey: "fiscaliteDeclarationsCategory",
        links: [
          { labelKey: "fiscaliteDeclarer", href: "/fiscalite/declarer" },
          { labelKey: "fiscalitePayer", href: "/fiscalite/payer" },
          { labelKey: "fiscaliteEcheances", href: "/fiscalite/echeances" },
          { labelKey: "fiscaliteSimulateurs", href: "/fiscalite/simulateurs-fiscaux" },
        ],
      },
    ],
  },
  {
    type: "megaMenu",
    labelKey: "entreprises",
    href: "/entreprises",
    leader: {
      titleKey: "entreprisesTitle",
      paragraphKey: "entreprisesText",
      link: { labelKey: "entreprisesAllLink", href: "/entreprises" },
    },
    categories: [
      {
        // CRÉER & ENREGISTRER
        titleKey: "entreprisesCreerCategory",
        links: [
          { labelKey: "entreprisesCreer", href: "/entreprises/creer-une-entreprise" },
          { labelKey: "entreprisesChoisirStructure", href: "/entreprises/choisir-une-structure" },
          { labelKey: "entreprisesEnregistrerActivite", href: "/entreprises/enregistrer-une-activite" },
          { labelKey: "entreprisesModifier", href: "/entreprises/modifier-une-entreprise" },
        ],
      },
      {
        // GÉRER & DÉVELOPPER
        titleKey: "entreprisesGererCategory",
        links: [
          { labelKey: "entreprisesObligationsAdministratives", href: "/entreprises/obligations-administratives" },
          { labelKey: "entreprisesDeveloppement", href: "/entreprises/developpement" },
          { labelKey: "entreprisesGestion", href: "/entreprises/gestion" },
          { labelKey: "entreprisesReglementation", href: "/entreprises/reglementation" },
        ],
      },
      {
        // FINANCER & INVESTIR
        titleKey: "entreprisesFinancerCategory",
        links: [
          { labelKey: "entreprisesFinancement", href: "/entreprises/financement" },
          { labelKey: "entreprisesAidesPubliques", href: "/entreprises/aides-publiques" },
          { labelKey: "entreprisesSubventions", href: "/entreprises/subventions" },
          { labelKey: "entreprisesInvestissement", href: "/entreprises/investissement" },
        ],
      },
      {
        // EXPORTER & INTERNATIONAL
        titleKey: "entreprisesExporterCategory",
        links: [
          { labelKey: "entreprisesExportation", href: "/entreprises/exportation" },
          { labelKey: "entreprisesMarchesInternationaux", href: "/entreprises/marches-internationaux" },
          { labelKey: "entreprisesAccompagnement", href: "/entreprises/accompagnement" },
          { labelKey: "entreprisesCommerceInternational", href: "/entreprises/commerce-international" },
        ],
      },
    ],
  },
  {
    type: "megaMenu",
    labelKey: "financesPubliques",
    href: "/finances-publiques",
    leader: {
      titleKey: "financesTitle",
      paragraphKey: "financesText",
      link: { labelKey: "financesAllLink", href: "/finances-publiques" },
    },
    categories: [
      {
        // BUDGET DE L'ÉTAT
        titleKey: "financesBudgetCategory",
        links: [
          { labelKey: "financesBudgetAnnuel", href: "/finances-publiques/budget-annuel" },
          { labelKey: "financesProjetBudget", href: "/finances-publiques/projet-de-budget" },
          { labelKey: "financesLoiFinances", href: "/finances-publiques/loi-de-finances" },
          { labelKey: "financesExecutionBudgetaire", href: "/finances-publiques/execution-budgetaire" },
        ],
      },
      {
        // RECETTES & DÉPENSES
        titleKey: "financesRecettesCategory",
        links: [
          { labelKey: "financesRecettesPubliques", href: "/finances-publiques/recettes-publiques" },
          { labelKey: "financesDepensesPubliques", href: "/finances-publiques/depenses-publiques" },
          { labelKey: "financesRepartitionDepenses", href: "/finances-publiques/repartition-des-depenses" },
          { labelKey: "financesDepensesMinistere", href: "/finances-publiques/depenses-par-ministere" },
        ],
      },
      {
        // DETTE & TRÉSORERIE
        titleKey: "financesDetteCategory",
        links: [
          { labelKey: "financesDettePublique", href: "/finances-publiques/dette-publique" },
          { labelKey: "financesTresorerie", href: "/finances-publiques/tresorerie" },
          { labelKey: "financesFinancementEtat", href: "/finances-publiques/financement-de-letat" },
          { labelKey: "financesGestionDette", href: "/finances-publiques/gestion-de-la-dette" },
        ],
      },
      {
        // TRANSPARENCE FINANCIÈRE
        titleKey: "financesTransparenceCategory",
        links: [
          { labelKey: "financesComptesPublics", href: "/finances-publiques/comptes-publics" },
          { labelKey: "financesDonneesBudgetaires", href: "/finances-publiques/donnees-budgetaires" },
          { labelKey: "financesControleFinancier", href: "/finances-publiques/controle-financier" },
          { labelKey: "financesRapports", href: "/finances-publiques/rapports" },
        ],
      },
    ],
  },
  {
    type: "megaMenu",
    labelKey: "commerceDouanes",
    href: "/commerce-et-douanes",
    leader: {
      titleKey: "commerceDouanesTitle",
      paragraphKey: "commerceDouanesText",
      link: { labelKey: "commerceDouanesAllLink", href: "/commerce-et-douanes" },
    },
    categories: [
      {
        // COMMERCE INTÉRIEUR
        titleKey: "commerceInterieurCategory",
        links: [
          { labelKey: "commerceReglementationCommerciale", href: "/commerce-et-douanes/reglementation-commerciale" },
          { labelKey: "commerceProtectionMarche", href: "/commerce-et-douanes/protection-du-marche" },
          { labelKey: "commercePratiquesCommerciales", href: "/commerce-et-douanes/pratiques-commerciales" },
          { labelKey: "commerceConcurrence", href: "/commerce-et-douanes/concurrence" },
        ],
      },
      {
        // COMMERCE INTERNATIONAL
        titleKey: "commerceInternationalCategory",
        links: [
          { labelKey: "commerceExterieur", href: "/commerce-et-douanes/commerce-exterieur" },
          { labelKey: "commerceAccordsCommerciaux", href: "/commerce-et-douanes/accords-commerciaux" },
          { labelKey: "commerceMarchesInternationaux", href: "/commerce-et-douanes/marches-internationaux" },
          { labelKey: "commercePolitiqueCommerciale", href: "/commerce-et-douanes/politique-commerciale" },
        ],
      },
      {
        // IMPORTER & EXPORTER
        titleKey: "commerceImporterCategory",
        links: [
          { labelKey: "commerceImportation", href: "/commerce-et-douanes/importation" },
          { labelKey: "commerceExportation", href: "/commerce-et-douanes/exportation" },
          { labelKey: "commerceDeclarations", href: "/commerce-et-douanes/declarations" },
          { labelKey: "commerceProcedures", href: "/commerce-et-douanes/procedures" },
        ],
      },
      {
        // DOUANES & DROITS
        titleKey: "commerceDouanesCategory",
        links: [
          { labelKey: "commerceDouanes", href: "/commerce-et-douanes/douanes" },
          { labelKey: "commerceDroitsTaxes", href: "/commerce-et-douanes/droits-et-taxes" },
          { labelKey: "commerceTarifs", href: "/commerce-et-douanes/tarifs" },
          { labelKey: "commerceReglementationDouaniere", href: "/commerce-et-douanes/reglementation-douaniere" },
        ],
      },
    ],
  },
  {
    type: "megaMenu",
    labelKey: "donneesRessources",
    href: "/donnees-et-ressources",
    leader: {
      titleKey: "donneesRessourcesTitle",
      paragraphKey: "donneesRessourcesText",
      link: { labelKey: "donneesRessourcesAllLink", href: "/donnees-et-ressources" },
    },
    categories: [
      {
        // DONNÉES ÉCONOMIQUES
        titleKey: "donneesDonneesCategory",
        links: [
          { labelKey: "donneesEconomiques", href: "/donnees-et-ressources/donnees-economiques" },
          { labelKey: "donneesIndicateurs", href: "/donnees-et-ressources/indicateurs" },
          { labelKey: "donneesSeriesHistoriques", href: "/donnees-et-ressources/series-historiques" },
          { labelKey: "donneesOuvertes", href: "/donnees-et-ressources/donnees-ouvertes" },
        ],
      },
      {
        // STATISTIQUES & INDICATEURS
        titleKey: "donneesStatistiquesCategory",
        links: [
          { labelKey: "donneesPib", href: "/donnees-et-ressources/pib" },
          { labelKey: "donneesInflation", href: "/donnees-et-ressources/inflation" },
          { labelKey: "donneesEmploi", href: "/donnees-et-ressources/emploi" },
          { labelKey: "donneesCommerceExterieur", href: "/donnees-et-ressources/commerce-exterieur" },
        ],
      },
      {
        // ÉTUDES & PUBLICATIONS
        titleKey: "donneesEtudesCategory",
        links: [
          { labelKey: "donneesRapports", href: "/donnees-et-ressources/rapports" },
          { labelKey: "donneesEtudes", href: "/donnees-et-ressources/etudes" },
          { labelKey: "donneesAnalyses", href: "/donnees-et-ressources/analyses" },
          { labelKey: "donneesPublications", href: "/donnees-et-ressources/publications" },
        ],
      },
      {
        // LOIS & RÉGLEMENTATION
        titleKey: "donneesLoisCategory",
        links: [
          { labelKey: "donneesTextesOfficiels", href: "/donnees-et-ressources/textes-officiels" },
          { labelKey: "donneesReglementation", href: "/donnees-et-ressources/reglementation" },
          { labelKey: "donneesDoctrine", href: "/donnees-et-ressources/doctrine" },
          { labelKey: "donneesDocumentation", href: "/donnees-et-ressources/documentation" },
        ],
      },
    ],
  },
];
