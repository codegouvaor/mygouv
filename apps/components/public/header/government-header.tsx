"use client";

import * as React from "react";
import { Header } from "@codegouvaor/react-ads/Header";
import { SkipLinks } from "@codegouvaor/react-ads/SkipLinks";
import { headerFooterDisplayItem } from "@codegouvaor/react-ads/Display";
import type { HeaderProps } from "@codegouvaor/react-ads/Header";
import type { MainNavigationProps } from "@codegouvaor/react-ads/MainNavigation";
import { useTranslations } from "next-intl";
import { usePathname, useRouter } from "@/i18n/navigation";
import { getDomainUrl } from "@/lib/domains";
import { getPortalSearchPath } from "@/components/public/search/portal-search-bar";
import {
  headerActions,
  pageAnchors,
  primaryNavigation,
  type SiteNavigationItem,
} from "@/lib/site-structure";
import { useAuth } from "@/context/AuthContext";
import { UserAccountMenu } from "@/components/public/header/user-account-menu";
import { siteAccountConfig } from "@/lib/site-config";

/** Whether a pathname is the destination itself or lives under it. */
const isPathActive = (href: string, pathname: string): boolean =>
  href === "/" ? pathname === "/" : pathname === href || pathname.startsWith(`${href}/`);

/**
 * Whether the current pathname matches an entry or any of its sub-entries
 * (the subjects of the section), so the parent tab stays highlighted on
 * every page of the section tree.
 */
function isNavItemActive(item: SiteNavigationItem, pathname: string): boolean {
  if (isPathActive(item.href, pathname)) return true;
  return (item.children ?? []).some((child) => isNavItemActive(child, pathname));
}

/**
 * Header of the MyGouv public portal.
 *
 * Main navigation — the permanent editorial architecture of the portal,
 * straight from the `site-structure` configuration (single source of truth):
 *
 *   Accueil              → plain entry to the portal (always a link, never a
 *                          dropdown)
 *   Découvrir MyGouv     → MyGouv, Fonctionnement, Fonctionnalités,
 *                          Sécurité & confidentialité
 *   Services             → Tous les services, Par domaine, Par situation,
 *                          Services populaires
 *   Actualités           → Actualités, Nouveautés, Agenda, État du service
 *   Aide                 → Centre d'aide, Premiers pas, Compte MyGouv,
 *                          Sécurité
 *   À propos             → Présentation, Mission, Gouvernance, Transparence
 *
 * Every section carrying `children` is rendered as an ADS `Menu` dropdown on
 * desktop and as an expandable section in the mobile menu — the very same
 * items feed both, so Desktop and Mobile always share one logical structure.
 * `Accueil` has no children and stays a simple link. No navigation label or
 * destination is hardcoded here: labels come from the message catalogs, hrefs
 * from `site-structure.ts`.
 *
 * The header also carries the portal search (`PortalSearchBar` behaviour):
 * a search input shown next to the actions on desktop, behind a magnifier
 * button in the mobile menu, that submits to the localized `/search` route.
 *
 * The right side of the header carries the transversal actions, clearly
 * separated from the navigation:
 *  - “Se connecter” (`headerActions.signIn`), the primary action of the
 *    header: the transition towards the MyGouv personal space, hosted on the
 *    SSO domain;
 *  - the accessibility/display settings button of ADS.
 *
 * When the user is authenticated, the “Se connecter” action is hidden and a
 * custom account menu (`UserAccountMenu`) is rendered instead, presenting
 * the personal-space entries driven by `siteAccountConfig` — the public
 * navigation and the authenticated area stay distinct.
 */
export function GovernmentHeader() {
  const t = useTranslations();
  const tPrimaryNav = useTranslations("nav.primary");
  const tNavPanel = useTranslations("nav.panel");
  const tBrand = useTranslations("brand");
  const pathname = usePathname();
  const router = useRouter();

  const navigationItems: MainNavigationProps.Item[] = primaryNavigation.map((item) => {
    const children = item.children ?? [];

    const common = {
      isActive: isNavItemActive(item, pathname),
      text: tPrimaryNav(item.labelKey),
    };

    if (children.length === 0) {
      // “Accueil” — a section without subjects stays a plain link.
      return { ...common, linkProps: { href: item.href } };
    }

    // Sections with subjects open an ADS Menu; their label keys resolve
    // under `nav.panel.<section>.<subject>`.
    return {
      ...common,
      menuLinks: children.map((child) => ({
        isActive: isNavItemActive(child, pathname),
        text: tNavPanel(`${item.id}.${child.labelKey}`),
        linkProps: { href: child.href },
      })),
    };
  });

  // Search action — submit to the localized /search route (shared with the
  // standalone `PortalSearchBar`, see `getPortalSearchPath`).
  const handleSearch = (text: string) => {
    router.push(getPortalSearchPath(text));
  };

  // Auth state for conditional account UI.
  const { isAuthenticated, isLoading: isAuthLoading } = useAuth();

  // Header actions — transversal actions, never navigation entries:
  //  - “Se connecter” pointing to the SSO personal space when the visitor is
  //    not authenticated (replaced by the account menu once they are);
  //  - the ADS accessibility/display settings button.
  const quickAccessItems = React.useMemo<HeaderProps.QuickAccessItem[]>(() => {
    const items: HeaderProps.QuickAccessItem[] = [];

    if (!isAuthenticated || isAuthLoading) {
      items.push({
        iconId: "fr-icon-account-circle-line",
        text: t(`header.${headerActions.signIn.labelKey}`),
        linkProps: { href: getDomainUrl("sso", headerActions.signIn.path) },
      });
    }

    items.push(headerFooterDisplayItem);
    return items;
  }, [isAuthenticated, isAuthLoading, t]);

  return (
    <>
      <SkipLinks
        links={[
          { label: t("common.skipToContent"), anchor: `#${pageAnchors.content}` },
          { label: t("common.skipToFooter"), anchor: `#${pageAnchors.footer}` },
        ]}
      />
      <Header
        className="gov-header"
        identity={{
          imgUrl: "/astoria-gouv.png",
          alt: tBrand("republicName"),
          institution: "",
        }}
        homeLinkProps={{
          href: "/",
          title: t("header.homeTitle"),
        }}
        serviceTitle={t("header.serviceTitle")}
        serviceTagline={t("header.serviceTagline")}
        navigation={navigationItems}
        quickAccessItems={quickAccessItems}
        renderSearchInput={(params) => (
          <input {...params} placeholder={t("meta.searchPlaceholder")} />
        )}
        onSearchButtonClick={handleSearch}
      />
      {/* Account menu — rendered outside the ADS Header so it can use
          its own dropdown positioning and auth state without conflicting
          with the ADS quick-access toolbar. */}
      {siteAccountConfig.enabled && <UserAccountMenu />}
    </>
  );
}
