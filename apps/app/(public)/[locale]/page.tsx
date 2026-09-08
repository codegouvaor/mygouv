import type { CSSProperties, ReactNode } from "react";
import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { localizedAlternates, resolveLocaleParam } from "@/lib/localized-metadata";
import { getDomainUrl } from "@/lib/domains";
import { headerActions } from "@/lib/site-structure";
import {
  benefits,
  explainerPoints,
  homePaths,
  lifeSituations,
  popularServices,
  serviceDomains,
} from "@/lib/home-content";
import {
  CtaButtonsGroup,
  LinkTile,
  NoticeCallout,
} from "@/components/public/content/ads-fragments";

const HOME_PATH = "/";

type PageProps = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale: rawLocale } = await params;
  const locale = resolveLocaleParam(rawLocale);

  const tMeta = await getTranslations({ locale, namespace: "meta" });

  return {
    title: { absolute: tMeta("defaultTitle") },
    description: tMeta("description"),
    ...localizedAlternates(locale, HOME_PATH),
  };
}

/* Layout below uses the ADS design tokens through `var(--ads-*)` (the single
 * source of tokens — main.css) and the DSFR grid (`fr-grid-row`, `fr-col-*`).
 * Only the arrangement of the blocks is expressed here, inline, without any
 * local stylesheet. Every string resolves from the message catalogs. */

const sectionContainerStyle: CSSProperties = {
  maxWidth: "80rem",
  marginInline: "auto",
  padding: "clamp(2.5rem, 6vw, 4.5rem) 1.25rem",
};

const sectionHeaderRowStyle: CSSProperties = {
  display: "flex",
  alignItems: "flex-end",
  justifyContent: "space-between",
  flexWrap: "wrap",
  gap: "1rem 2.5rem",
  marginBottom: "2rem",
};

const sectionHeaderTextStyle: CSSProperties = {
  maxWidth: "52rem",
};

const kickerStyle: CSSProperties = {
  margin: "0 0 0.5rem",
  fontSize: "0.8125rem",
  lineHeight: 1.4,
  fontWeight: 700,
  letterSpacing: "0.08em",
  textTransform: "uppercase",
  color: "var(--ads-color-primary)",
};

const sectionTitleStyle: CSSProperties = {
  margin: "0",
  fontSize: "clamp(1.375rem, 2.6vw, 2rem)",
  lineHeight: 1.3,
  fontWeight: 700,
  color: "var(--ads-color-text)",
};

const sectionLeadStyle: CSSProperties = {
  margin: "0.75rem 0 0",
  fontSize: "1rem",
  lineHeight: 1.7,
  color: "var(--ads-color-text-muted)",
};

const listResetStyle: CSSProperties = {
  listStyle: "none",
  margin: "0",
  padding: "0",
};

/** Icon + title + description card (explanatory blocks of the page). */
const featureCardStyle: CSSProperties = {
  display: "flex",
  flexDirection: "column",
  gap: "0.625rem",
  height: "100%",
  padding: "1.25rem",
  background: "var(--ads-color-background)",
  border: "1px solid var(--ads-color-border)",
  borderTop: "3px solid var(--ads-color-primary)",
};

const featureTitleStyle: CSSProperties = {
  margin: "0",
  fontSize: "1rem",
  lineHeight: 1.4,
  fontWeight: 700,
  color: "var(--ads-color-text)",
};

const featureDescStyle: CSSProperties = {
  margin: "0",
  fontSize: "0.875rem",
  lineHeight: 1.6,
  color: "var(--ads-color-text-muted)",
};

const arrowListStyle: CSSProperties = {
  ...listResetStyle,
  border: "1px solid var(--ads-color-border)",
  borderBottom: "none",
};

const arrowRowStyle: CSSProperties = {
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  gap: "1rem",
  padding: "0.875rem 1.25rem",
  fontWeight: 600,
  textDecoration: "none",
  color: "var(--ads-color-text)",
  borderBottom: "1px solid var(--ads-color-border)",
  background: "var(--ads-color-background)",
};

/**
 * Shared heading of an alternating section: kicker, title (h2), optional
 * lead, optional right-side actions. `aria-labelledby` points to the h2.
 */
function SectionHeading({
  id,
  kicker,
  title,
  lead,
  actions,
}: {
  id: string;
  kicker?: string;
  title: string;
  lead?: string;
  actions?: ReactNode;
}) {
  return (
    <div style={sectionHeaderRowStyle}>
      <div style={sectionHeaderTextStyle}>
        {kicker ? <p style={kickerStyle}>{kicker}</p> : null}
        <h2 id={id} style={sectionTitleStyle}>
          {title}
        </h2>
        {lead ? <p style={sectionLeadStyle}>{lead}</p> : null}
      </div>
      {actions ? <div style={{ flexShrink: 0 }}>{actions}</div> : null}
    </div>
  );
}

/**
 * Homepage of the MyGouv public portal — the official entry point towards
 * the public services of the Republic of Astoria.
 *
 * The header lets visitors explore the portal (its six sections); this page
 * answers, in order:
 *
 *   01 Hero               — what MyGouv is, in one statement, and the
 *                           main actions (see the services, discover, log in)
 *   02 Accès rapide       — service areas, organised for the citizen
 *   03 Qu'est-ce que MyGouv ? — the role of the service, in five points
 *   04 Par situation      — life events, without knowing the administration
 *   05 Services populaires — the most used services
 *   06 Actualités         — news of MyGouv, kept secondary (no editorial
 *                           content yet, only the seam)
 *   07 Pourquoi MyGouv ?  — the benefits for the citizen
 *   08 Appel à l'action   — discover the services or log in to the space
 *
 * Every section is driven by `lib/home-content.ts` and the message catalogs.
 * Destinations reuse the canonical routes of `site-structure.ts`: the page
 * does not invent URLs — when a deeper route ships, only the config changes.
 */
export default async function HomePage({ params }: PageProps) {
  const { locale: rawLocale } = await params;
  const locale = resolveLocaleParam(rawLocale);
  setRequestLocale(locale);

  const t = await getTranslations({ locale });
  const th = await getTranslations({ locale, namespace: "home" });

  const signInHref = getDomainUrl("sso", headerActions.signIn.path);

  return (
    <>
      {/* 01 — Hero: the official statement of MyGouv and its main actions. */}
      <section aria-labelledby="home-hero-title">
        <div
          style={{
            maxWidth: "56rem",
            marginInline: "auto",
            padding: "clamp(3rem, 8vw, 5.5rem) 1.25rem",
            textAlign: "center",
          }}
        >
          <p style={{ ...kickerStyle, marginInline: "auto" }}>{th("hero.kicker")}</p>
          <h1
            id="home-hero-title"
            style={{
              margin: "0 auto",
              maxWidth: "40rem",
              fontSize: "clamp(2rem, 4.5vw, 3rem)",
              lineHeight: 1.15,
              fontWeight: 700,
              color: "var(--ads-color-text)",
            }}
          >
            {th("hero.title")}
          </h1>
          <p
            style={{
              margin: "1.25rem auto 0",
              maxWidth: "44rem",
              fontSize: "1.125rem",
              lineHeight: 1.7,
              color: "var(--ads-color-text-muted)",
            }}
          >
            {th("hero.lead")}
          </p>
          <div style={{ marginTop: "2rem" }}>
            <CtaButtonsGroup
              alignment="center"
              buttons={[
                {
                  children: th("hero.servicesCta"),
                  href: homePaths.services,
                  priority: "primary",
                  iconId: "fr-icon-arrow-right-line",
                },
                {
                  children: th("hero.discoverCta"),
                  href: homePaths.discover,
                  priority: "secondary",
                },
                {
                  children: t("header.signIn"),
                  href: signInHref,
                  priority: "tertiary",
                  iconId: "fr-icon-account-circle-line",
                },
              ]}
            />
          </div>
        </div>
      </section>

      {/* 02 — Accès rapide: the service areas, first entry into the catalogue.
          The citizen comes first, not the administration. */}
      <section
        aria-labelledby="home-domains-title"
        style={{ background: "var(--ads-color-surface-muted)" }}
      >
        <div style={sectionContainerStyle}>
          <SectionHeading
            id="home-domains-title"
            kicker={th("domains.kicker")}
            title={th("domains.title")}
            lead={th("domains.lead")}
          />
          <ul className="fr-grid-row fr-grid-row--gutters" role="list" style={listResetStyle}>
            {serviceDomains.map((domain) => (
              <li key={domain.key} className="fr-col-12 fr-col-md-6 fr-col-lg-4">
                <LinkTile
                  title={th(`domains.items.${domain.key}`)}
                  href={domain.href}
                  iconId={domain.iconId}
                />
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* 03 — Qu'est-ce que MyGouv ?: what the citizen can do with the
          service, before any technical explanation. */}
      <section aria-labelledby="home-explainer-title">
        <div style={sectionContainerStyle}>
          <SectionHeading
            id="home-explainer-title"
            kicker={th("explainer.kicker")}
            title={th("explainer.title")}
            lead={th("explainer.lead")}
          />
          <ul className="fr-grid-row fr-grid-row--gutters" role="list" style={listResetStyle}>
            {explainerPoints.map((point) => (
              <li key={point.key} className="fr-col-12 fr-col-md-6">
                <div style={featureCardStyle}>
                  <span
                    className={point.iconId}
                    aria-hidden="true"
                    style={{ fontSize: "1.5rem", lineHeight: 1, color: "var(--ads-color-primary)" }}
                  />
                  <h3 style={featureTitleStyle}>{th(`explainer.items.${point.key}.title`)}</h3>
                  <p style={featureDescStyle}>{th(`explainer.items.${point.key}.desc`)}</p>
                </div>
              </li>
            ))}
          </ul>
          <div style={{ marginTop: "1.75rem" }}>
            <CtaButtonsGroup
              buttons={[
                {
                  children: th("explainer.cta"),
                  href: homePaths.discover,
                  priority: "secondary",
                  iconId: "fr-icon-arrow-right-line",
                },
              ]}
            />
          </div>
        </div>
      </section>

      {/* 04 — Par situation: find the service without knowing which
          administration is responsible. */}
      <section
        aria-labelledby="home-situations-title"
        style={{ background: "var(--ads-color-surface-muted)" }}
      >
        <div style={sectionContainerStyle}>
          <SectionHeading
            id="home-situations-title"
            kicker={th("situations.kicker")}
            title={th("situations.title")}
            lead={th("situations.lead")}
          />
          <ul className="fr-grid-row fr-grid-row--gutters" role="list" style={listResetStyle}>
            {lifeSituations.map((situation) => (
              <li key={situation.key} className="fr-col-12 fr-col-md-6 fr-col-lg-3">
                <LinkTile
                  title={th(`situations.items.${situation.key}`)}
                  href={situation.href}
                  horizontal
                  small
                  iconId="fr-icon-arrow-right-line"
                />
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* 05 — Services populaires: the most used services of the portal. */}
      <section aria-labelledby="home-popular-title">
        <div style={sectionContainerStyle}>
          <SectionHeading
            id="home-popular-title"
            kicker={th("popular.kicker")}
            title={th("popular.title")}
            lead={th("popular.lead")}
            actions={
              <CtaButtonsGroup
                buttons={[
                  {
                    children: th("popular.allCta"),
                    href: homePaths.services,
                    priority: "secondary",
                    iconId: "fr-icon-arrow-right-line",
                  },
                ]}
              />
            }
          />
          <ul role="list" style={arrowListStyle}>
            {popularServices.map((service) => (
              <li key={service.key}>
                <a href={service.href} style={arrowRowStyle}>
                  {th(`popular.items.${service.key}`)}
                  <span className="fr-icon-arrow-right-line" aria-hidden="true" />
                </a>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* 06 — Actualités: secondary on purpose. No editorial content exists
          yet; the section only carries the seam (message + destination). */}
      <section
        aria-labelledby="home-news-title"
        style={{ background: "var(--ads-color-surface-muted)" }}
      >
        <div style={sectionContainerStyle}>
          <SectionHeading
            id="home-news-title"
            kicker={th("news.kicker")}
            title={th("news.title")}
            lead={th("news.lead")}
            actions={
              <CtaButtonsGroup
                buttons={[
                  {
                    children: th("news.allCta"),
                    href: homePaths.news,
                    priority: "secondary",
                    iconId: "fr-icon-arrow-right-line",
                  },
                ]}
              />
            }
          />
          <NoticeCallout iconId="fr-icon-information-line">{th("news.empty")}</NoticeCallout>
        </div>
      </section>

      {/* 07 — Pourquoi utiliser MyGouv ?: the benefits, kept sober and
          citizen-centred. */}
      <section aria-labelledby="home-benefits-title">
        <div style={sectionContainerStyle}>
          <SectionHeading
            id="home-benefits-title"
            kicker={th("benefits.kicker")}
            title={th("benefits.title")}
          />
          <ul className="fr-grid-row fr-grid-row--gutters" role="list" style={listResetStyle}>
            {benefits.map((benefit) => (
              <li key={benefit.key} className="fr-col-12 fr-col-md-6 fr-col-lg-4">
                <div style={featureCardStyle}>
                  <span
                    className={benefit.iconId}
                    aria-hidden="true"
                    style={{ fontSize: "1.5rem", lineHeight: 1, color: "var(--ads-color-primary)" }}
                  />
                  <h3 style={featureTitleStyle}>{th(`benefits.items.${benefit.key}.title`)}</h3>
                  <p style={featureDescStyle}>{th(`benefits.items.${benefit.key}.desc`)}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* 08 — Appel à l'action final: continue towards the services or the
          personal space. */}
      <section
        aria-labelledby="home-cta-title"
        style={{ background: "var(--ads-color-surface-muted)" }}
      >
        <div
          style={{
            maxWidth: "44rem",
            marginInline: "auto",
            padding: "clamp(2.5rem, 6vw, 4rem) 1.25rem",
            textAlign: "center",
          }}
        >
          <h2
            id="home-cta-title"
            style={{ margin: "0 auto", maxWidth: "36rem", ...sectionTitleStyle }}
          >
            {th("cta.title")}
          </h2>
          <p style={{ ...sectionLeadStyle, margin: "0.875rem auto 0", maxWidth: "36rem" }}>
            {th("cta.lead")}
          </p>
          <div style={{ marginTop: "1.75rem" }}>
            <CtaButtonsGroup
              alignment="center"
              buttons={[
                {
                  children: th("cta.servicesCta"),
                  href: homePaths.services,
                  priority: "primary",
                  iconId: "fr-icon-arrow-right-line",
                },
                {
                  children: t("header.signIn"),
                  href: signInHref,
                  priority: "secondary",
                  iconId: "fr-icon-account-circle-line",
                },
              ]}
            />
          </div>
        </div>
      </section>
    </>
  );
}
