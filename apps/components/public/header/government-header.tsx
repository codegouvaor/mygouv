"use client";

import * as React from "react";
import { Header } from "@codegouvaor/react-ads/Header";
import { SkipLinks } from "@codegouvaor/react-ads/SkipLinks";
import { headerFooterDisplayItem } from "@codegouvaor/react-ads/Display";
import type { HeaderProps } from "@codegouvaor/react-ads/Header";
import type { MainNavigationProps } from "@codegouvaor/react-ads/MainNavigation";
import { useTranslations } from "next-intl";
import { usePathname } from "@/i18n/navigation";
import { getDomainUrl } from "@/lib/domains";
import {
  headerActions,
  pageAnchors,
  primaryNavigation,
  type PrimaryNavigationItem,
  type SiteNavigationItem,
} from "@/lib/site-structure";
import { useAuth } from "@/context/AuthContext";
import { UserAccountMenu } from "@/components/public/header/user-account-menu";
import { siteAccountConfig } from "@/lib/site-config";

/** Whether a pathname is the destination itself or lives under it. */
const isPathActive = (href: string, pathname: string): boolean =>
  href === "/" ? pathname === "/" : pathname === href || pathname.startsWith(`${href}/`);

/**
 * Whether the current pathname matches an entry or any of its sub-entries.
 *
 * Sub-entries are the *planned* pages of a section: they are not rendered by
 * the header yet (their routes do not exist), but counting them keeps the
 * parent tab highlighted as soon as the visitor lands on any page of the
 * section tree.
 */
function isNavItemActive(item: SiteNavigationItem, pathname: string): boolean {
  if (isPathActive(item.href, pathname)) return true;
  return (item.children ?? []).some((child) => isNavItemActive(child, pathname));
}

/**
 * Header of the MyGouv public portal.
 *
 * Main navigation — the permanent editorial architecture of the portal,
 * straight from the `site-structure` configuration:
 *
 *   Accueil
 *   Découvrir MyGouv   → the service, how it works, features, mobile
 *   Services           → the citizen-facing catalogue of public services
 *   Actualités         → news of the service (editorial content, coming)
 *   Aide               → support and documentation
 *   À propos           → institutional presentation of MyGouv
 *
 * Every entry is rendered as a plain link to its section landing page. The
 * `children` arrays of `primaryNavigation` describe the *planned* sub-pages
 * (future dropdown / mega-menu content): they are not rendered until their
 * routes actually exist, so the site never exposes broken links.
 *
 * The right side of the header carries the transversal actions, clearly
 * separated from the navigation:
 *  - “Se connecter” (`headerActions.signIn`), the primary action of the
 *    header: it is the transition towards the MyGouv personal space, hosted
 *    on the SSO domain;
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
  const tBrand = useTranslations("brand");
  const pathname = usePathname();

  const navigationItems: MainNavigationProps.Item[] = primaryNavigation.map(
    (item: PrimaryNavigationItem) => ({
      isActive: isNavItemActive(item, pathname),
      text: tPrimaryNav(item.labelKey),
      linkProps: { href: item.href },
    })
  );

  // Auth state for conditional account UI.
  const { isAuthenticated, isLoading: isAuthLoading } = useAuth();

  // Quick-access items — transversal header actions, not navigation entries.
  // “Se connecter” points to the SSO personal space when the visitor is not
  // authenticated; it is replaced by the account menu once they are.
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
      />
      {/* Account menu — rendered outside the ADS Header so it can use
          its own dropdown positioning and auth state without conflicting
          with the ADS quick-access toolbar. */}
      {siteAccountConfig.enabled && <UserAccountMenu />}
    </>
  );
}
