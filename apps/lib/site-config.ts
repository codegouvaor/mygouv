/**
 * Site-specific configuration.
 *
 * This file defines the account menu items that appear in the header when
 * a user is logged in. Each site deploying this portal can override the
 * configuration to present a different account interface.
 *
 * The `accountMenu` array controls what links appear in the dropdown.
 * Each item carries a message key (resolved from `header.account.*` in
 * the message catalogs) and an href.
 *
 * To customise for a new site:
 *   1. Override `accountMenu` with the links relevant to that site.
 *   2. Add corresponding message keys under `header.account.*`.
 *   3. Optionally override `accountLabel` and `logoutLabel` message keys.
 */

export type AccountMenuItem = {
  /** Message key under `header.account.*` for the label. */
  labelKey: string;
  /** Destination href. */
  href: string;
  /** Icon class (ADS fr-icon-*) — optional. */
  iconId?: string;
  /** Set to `true` for destructive actions (e.g. logout). */
  destructive?: boolean;
};

export type SiteAccountConfig = {
  /**
   * Whether the account menu is enabled. Set to `false` on sites that
   * do not support authentication.
   */
  enabled: boolean;

  /** Message key for the button label when logged in. Default: `header.accountLabel`. */
  labelKey: string;

  /** Message key for the logout action. Default: `header.logoutLink`. */
  logoutLabelKey: string;

  /** Menu items shown in the account dropdown. */
  items: AccountMenuItem[];
};

/**
 * Default site configuration for the Ministry of Economy and Finance.
 * Override this in site-specific configurations.
 *
 * The account menu follows the MyGouv personal-space model: the user
 * reaches their files, obligations, payments and documents through a single
 * entry point, without having to know which internal administration handles
 * each case.
 */
export const siteAccountConfig: SiteAccountConfig = {
  enabled: true,
  labelKey: "header.accountLabel",
  logoutLabelKey: "header.logoutLink",
  items: [
    {
      labelKey: "header.account.demarches",
      href: "/mon-espace/demarches",
      iconId: "fr-icon-file-text-line",
    },
    {
      labelKey: "header.account.obligations",
      href: "/mon-espace/obligations",
      iconId: "fr-icon-calendar-line",
    },
    {
      labelKey: "header.account.paiements",
      href: "/mon-espace/paiements",
      iconId: "fr-icon-bank-line",
    },
    {
      labelKey: "header.account.documents",
      href: "/mon-espace/documents",
      iconId: "fr-icon-folder-2-line",
    },
    {
      labelKey: "header.account.notifications",
      href: "/mon-espace/notifications",
      iconId: "fr-icon-notification-3-line",
    },
    {
      labelKey: "header.account.entreprises",
      href: "/mon-espace/entreprises",
      iconId: "fr-icon-building-line",
    },
    {
      labelKey: "header.account.profile",
      href: "/profile",
      iconId: "fr-icon-user-line",
    },
    {
      labelKey: "header.account.settings",
      href: "/settings",
      iconId: "fr-icon-settings-5-line",
    },
  ],
};
